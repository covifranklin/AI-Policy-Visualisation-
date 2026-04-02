#!/usr/bin/env tsx
/**
 * analyze-policy.ts
 *
 * Scores a single policy against the full risk taxonomy using the Claude API.
 * Reads from local PDF if available, otherwise fetches from the policy URL.
 * Writes output to ../app/data/clauses/<policy-id>.json
 *
 * Usage:
 *   npx tsx analyze-policy.ts <policy-id> [--model <model-id>]
 *
 * Examples:
 *   npx tsx analyze-policy.ts eu-ai-act
 *   npx tsx analyze-policy.ts anthropic-rsp --model claude-opus-4-6
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "app", "data");
const CLAUSES_DIR = path.join(DATA_DIR, "clauses");
const DEFAULT_MODEL = "claude-sonnet-4-6";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Policy {
  id: string;
  name: string;
  source_file: string;
  url: string;
  creator_category: string;
  binding: string;
  year: number;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Taxonomy {
  categories: Category[];
}

interface ScoreEntry {
  subcategory_id: string;
  score: 0 | 1 | 2 | 3;
  summary: string;
  clauses: string[];
  notes: string;
}

interface AnalysisResult {
  policy_id: string;
  analyzed_date: string;
  scores: ScoreEntry[];
  meta_observations: string[];
}

// ---------------------------------------------------------------------------
// Load static data
// ---------------------------------------------------------------------------

const policies: Policy[] = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "policies.json"), "utf8")
);

const taxonomy: Taxonomy = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "taxonomy.json"), "utf8")
);

const allSubcategories: Subcategory[] = taxonomy.categories.flatMap(
  (cat) => cat.subcategories
);

const client = new Anthropic();
fs.mkdirSync(CLAUSES_DIR, { recursive: true });

// ---------------------------------------------------------------------------
// Policy content loader
// ---------------------------------------------------------------------------

type PolicyContent =
  | { kind: "pdf"; base64: string }
  | { kind: "text"; text: string };

async function loadPolicyContent(policy: Policy): Promise<PolicyContent> {
  const localPath = path.join(ROOT, policy.source_file);

  if (fs.existsSync(localPath)) {
    const ext = path.extname(localPath).toLowerCase();
    if (ext === ".pdf") {
      console.log(`  Loading local PDF: ${policy.source_file}`);
      const buf = fs.readFileSync(localPath);
      return { kind: "pdf", base64: buf.toString("base64") };
    } else {
      console.log(`  Loading local text: ${policy.source_file}`);
      return { kind: "text", text: fs.readFileSync(localPath, "utf8") };
    }
  }

  // No local file — fetch from URL
  console.log(`  No local file found. Fetching: ${policy.url}`);
  const res = await fetch(policy.url, {
    headers: { "User-Agent": "Mozilla/5.0 (policy-analysis-script)" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${policy.url}`);
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("pdf")) {
    const buf = Buffer.from(await res.arrayBuffer());
    return { kind: "pdf", base64: buf.toString("base64") };
  }

  // HTML or plain text — strip tags to save tokens
  const raw = await res.text();
  const stripped = raw
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { kind: "text", text: stripped };
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function buildSystemPrompt(): string {
  const taxonomyRef = taxonomy.categories
    .map(
      (cat) =>
        `## ${cat.name}\n` +
        cat.subcategories
          .map((sub) => `  ${sub.id}: ${sub.name} — ${sub.description}`)
          .join("\n")
    )
    .join("\n\n");

  return `You are a policy analyst scoring AI governance documents against a risk taxonomy.

## Scoring rubric
0 = Not addressed — no provisions relevant to this risk
1 = Mentioned — acknowledged in preamble, recitals, or principles; no operative provisions
2 = Specific provisions — concrete obligations, requirements, or guidelines targeting this risk
3 = Specific provisions + enforcement — penalties, audits, or accountability mechanisms apply

## Scoring guidelines
- Conservative: score what the text mandates, not what it implies
- Voluntary language ("should", "may", "encouraged") scores lower than mandatory ("shall", "must")
- Preamble/recital language alone → maximum score 1
- Score 3 requires BOTH specific operative provisions AND enforcement for that specific risk area
- Every score > 0 must cite at least one real clause (article, section, recital number)
- Do not fabricate clause references — only cite what you actually read

## Taxonomy
${taxonomyRef}

## Output
Respond with valid JSON only — no prose, no markdown code fences. Schema:
{
  "policy_id": string,
  "analyzed_date": string,
  "scores": [
    {
      "subcategory_id": string,
      "score": 0|1|2|3,
      "summary": string,
      "clauses": string[],
      "notes": string
    }
  ],
  "meta_observations": string[]
}`;
}

function buildUserMessage(
  content: PolicyContent,
  policyId: string,
  date: string,
  subcategoryCount: number
): Anthropic.MessageParam {
  const instruction = `Score this policy against all ${subcategoryCount} subcategories listed in the taxonomy. Set policy_id to "${policyId}" and analyzed_date to "${date}". Include every subcategory in the scores array — do not omit any.`;

  if (content.kind === "pdf") {
    return {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: content.base64,
          },
        } as Anthropic.DocumentBlockParam,
        { type: "text", text: instruction },
      ],
    };
  }

  return {
    role: "user",
    content: `POLICY TEXT:\n${content.text}\n\n${instruction}`,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function analyzePolicy(policyId: string, model: string): Promise<void> {
  const policy = policies.find((p) => p.id === policyId);
  if (!policy) {
    const ids = policies.map((p) => p.id).join(", ");
    throw new Error(
      `Policy "${policyId}" not found in policies.json.\nAvailable IDs: ${ids}`
    );
  }

  console.log(`\nAnalyzing: ${policy.name}`);
  console.log(`Model: ${model}`);

  const content = await loadPolicyContent(policy);
  const date = new Date().toISOString().slice(0, 10);

  console.log(`  Sending to API...`);
  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    system: buildSystemPrompt(),
    messages: [buildUserMessage(content, policyId, date, allSubcategories.length)],
  });

  const rawText =
    response.content[0].type === "text" ? response.content[0].text : "";

  let result: AnalysisResult;
  try {
    result = JSON.parse(rawText);
  } catch {
    console.warn("  Warning: response was not clean JSON — attempting extraction fallback.");
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(
        `Could not parse JSON from response. First 500 chars:\n${rawText.slice(0, 500)}`
      );
    }
    result = JSON.parse(match[0]);
  }

  // Validate completeness
  const scored = new Set(result.scores.map((s) => s.subcategory_id));
  const missing = allSubcategories.map((s) => s.id).filter((id) => !scored.has(id));
  if (missing.length > 0) {
    console.warn(`  WARNING: Missing scores for subcategories: ${missing.join(", ")}`);
  }

  const outputPath = path.join(CLAUSES_DIR, `${policyId}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(`  Written: ${outputPath}`);
  console.log(
    `  Tokens — input: ${response.usage.input_tokens}, output: ${response.usage.output_tokens}`
  );
  console.log(
    `  Subcategories scored: ${result.scores.length}/${allSubcategories.length}`
  );
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const modelFlagIdx = args.indexOf("--model");
if (modelFlagIdx !== -1 && modelFlagIdx + 1 >= args.length) {
  console.error("Error: --model flag requires a model ID argument.");
  process.exit(1);
}
const model = modelFlagIdx !== -1 ? args[modelFlagIdx + 1] : DEFAULT_MODEL;
const policyId = args.find(
  (a, i) => !a.startsWith("--") && i !== modelFlagIdx + 1
);

if (!policyId) {
  console.error(
    "Usage: npx tsx analyze-policy.ts <policy-id> [--model <model-id>]\n" +
      "Example: npx tsx analyze-policy.ts eu-ai-act\n" +
      "         npx tsx analyze-policy.ts anthropic-rsp --model claude-opus-4-6"
  );
  process.exit(1);
}

analyzePolicy(policyId, model).catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
