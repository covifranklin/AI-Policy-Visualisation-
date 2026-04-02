#!/usr/bin/env tsx
/**
 * build-matrix.ts
 *
 * Aggregates all per-policy clause files from ../app/data/clauses/
 * into ../app/data/matrix.json, flattening scores into a single array.
 *
 * Usage:
 *   npx tsx build-matrix.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "app", "data");
const CLAUSES_DIR = path.join(DATA_DIR, "clauses");
const MATRIX_PATH = path.join(DATA_DIR, "matrix.json");

interface ClauseScore {
  subcategory_id: string;
  score: number;
  summary: string;
  clauses: string[];
  notes: string;
}

interface ClausesFile {
  policy_id: string;
  analyzed_date: string;
  scores: ClauseScore[];
  meta_observations: string[];
}

interface MatrixEntry {
  policy_id: string;
  subcategory_id: string;
  score: number;
  summary: string;
  clauses: string[];
  notes: string;
}

function buildMatrix(): void {
  if (!fs.existsSync(CLAUSES_DIR)) {
    console.error(`Clauses directory not found: ${CLAUSES_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(CLAUSES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.warn("No clause files found. Run analyze-policy.ts for each policy first.");
    process.exit(0);
  }

  const scores: MatrixEntry[] = [];
  const metadata: Record<string, { analyzed_date: string; meta_observations: string[] }> = {};

  for (const file of files) {
    const filePath = path.join(CLAUSES_DIR, file);
    const data: ClausesFile = JSON.parse(fs.readFileSync(filePath, "utf8"));

    metadata[data.policy_id] = {
      analyzed_date: data.analyzed_date,
      meta_observations: data.meta_observations,
    };

    for (const score of data.scores) {
      scores.push({
        policy_id: data.policy_id,
        subcategory_id: score.subcategory_id,
        score: score.score,
        summary: score.summary,
        clauses: score.clauses,
        notes: score.notes,
      });
    }

    console.log(
      `  ${data.policy_id}: ${data.scores.length} scores (analyzed ${data.analyzed_date})`
    );
  }

  const matrix = { scores, metadata };
  fs.writeFileSync(MATRIX_PATH, JSON.stringify(matrix, null, 2));

  console.log(
    `\nMatrix built: ${scores.length} total entries across ${files.length} policies → ${MATRIX_PATH}`
  );
}

buildMatrix();
