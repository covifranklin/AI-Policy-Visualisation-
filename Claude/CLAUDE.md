# AI Policy Coverage Matrix

## Project Purpose
Interactive web tool mapping frontier AI policies against risk categories to identify governance gaps. Built to be shared publicly (LinkedIn, policy community) as a useful reference tool.

## Tech Stack
- React + TypeScript
- Tailwind CSS for styling
- Recharts for the heatmap/matrix visualization
- Vite for build tooling
- No backend — all data is static JSON

## Project Structure
```
/data/
  policies.json          # Policy metadata (name, creator, binding status, URL)
  taxonomy.json          # 8 top-level risk categories + subcategories
  matrix.json            # Coverage scores: policy × risk subcategory
  /clauses/              # Supporting evidence for each score (one JSON per policy)
/policy-sources/         # Raw policy texts (PDFs, markdown) organized by creator
  /western-gov/
  /non-western-gov/
  /multilateral/
  /private-sector/
/src/
  /components/           # React visualization components
  App.tsx                # Main app
  main.tsx               # Entry point
/scripts/
  analyze-policy.ts      # Script to analyze a single policy against taxonomy
  build-matrix.ts        # Aggregates all analysis into matrix.json
```

## Data Schema

### policies.json
```json
[
  {
    "id": "eu-ai-act",
    "name": "EU Artificial Intelligence Act",
    "short_name": "EU AI Act",
    "creator_category": "western-gov" | "non-western-gov" | "multilateral" | "private-sector",
    "binding": "yes" | "partial" | "no",
    "status": "In force",
    "year": 2024,
    "jurisdiction": "EU (extraterritorial)",
    "source_file": "policy-sources/western-gov/eu-ai-act.pdf",
    "url": "https://..."
  }
]
```

### taxonomy.json
```json
{
  "categories": [
    {
      "id": "alignment-control",
      "name": "Alignment & Control Risks",
      "subcategories": [
        {
          "id": "goal-misalignment",
          "name": "Goal misalignment / specification gaming",
          "description": "Models optimize the wrong objective (reward hacking, Goodhart's law)"
        }
      ]
    }
  ]
}
```

### matrix.json
```json
{
  "scores": [
    {
      "policy_id": "eu-ai-act",
      "subcategory_id": "goal-misalignment",
      "score": 2,
      "summary": "Article 9 requires risk management for high-risk systems including testing for unintended behaviors",
      "clauses": ["Article 9(2)(a)", "Article 9(7)"]
    }
  ]
}
```

## Coverage Scoring Rubric
- **0** — Not addressed: The policy contains no provisions relevant to this risk
- **1** — Mentioned: Risk is acknowledged in preamble, principles, or general language but no specific provisions
- **2** — Specific provisions: Policy contains concrete requirements, obligations, or guidelines targeting this risk
- **3** — Provisions + enforcement: Specific provisions exist AND include enforcement mechanisms, audit requirements, or accountability measures

## Analysis Instructions
When analyzing a policy against the risk taxonomy:
1. Read the full policy text
2. For each risk subcategory, search for relevant provisions
3. Assign a score (0-3) based on the rubric above
4. Record the specific articles/sections that justify the score
5. Write a one-sentence summary of the coverage
6. Be conservative — score based on what the text actually says, not implied intent
7. If a provision partially addresses a risk, score 1 or 2 depending on specificity
8. Note where voluntary frameworks are referenced but not mandated

## Visualization Requirements
- Main view: Heatmap matrix with policies (Y-axis) grouped by creator category, risk categories (X-axis)
- Color scale: Red (0) → Orange (1) → Yellow (2) → Green (3)
- Click category column header to expand subcategories
- Click any cell to see supporting clause text
- "Gaps" toggle: Filter to show only 0-1 scores
- Filter sidebar: Filter by creator category, binding status
- Responsive design, works on mobile
- Clean, professional aesthetic suitable for policy audience
- Include title, legend, methodology note, and author attribution

## Visual Identity — Risk Category Icons
Each of the 8 risk categories has a custom SVG icon displayed in column headers and the detail panel. Icons are:
- Inline SVG React components (no external image files)
- Monochrome with a single themeable accent color
- 48x48px viewBox, 2px stroke, clean linework
- Professional and slightly dark/serious — NOT playful, cartoonish, or humorous
- Subtle hover animation (CSS transition pulse/glow only)

Icon concepts:
1. Alignment & Control → cracked compass needle
2. Operational & Infrastructure → fractured circuit board
3. Information & Epistemic → eye with signal interference
4. Security & Conflict → shield with targeting reticle
5. Governance & Institutional → cracked gavel
6. Economic & Systemic → sharply tipping scales
7. Human & Societal → fragmenting human silhouette
8. Long-term / Existential → hourglass nearly empty

Design tone: "policy briefing meets data dashboard" — serious, precise, slightly ominous but restrained.

## Brand / Attribution
- Title: "AI Policy Coverage Matrix"
- Subtitle: "Mapping governance frameworks against frontier AI risks"
- Author: [Your name]
- Include a brief methodology note explaining the scoring rubric
