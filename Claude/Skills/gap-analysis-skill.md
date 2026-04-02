# Gap Analysis Skill

## Purpose
Take the completed coverage matrix and identify the most significant governance gaps — risk areas where no or few policies provide meaningful coverage.

## Input
- /data/matrix.json (all coverage scores)
- /data/policies.json (policy metadata)
- /data/taxonomy.json (risk taxonomy)

## Analysis to Produce

### 1. Uncovered Risks
Subcategories where NO policy scores above 1.
Format: List each with the subcategory name, parent category, and what this means practically.

### 2. Weakly Covered Risks
Subcategories where only voluntary/non-binding frameworks score above 1 (i.e., no hard law covers it meaningfully).

### 3. Coverage by Creator Type
For each creator category (western-gov, non-western-gov, multilateral, private-sector):
- Average coverage score across all subcategories
- Their strongest and weakest areas
- Notable patterns

### 4. Binding vs. Voluntary Gap
Compare average scores for binding policies vs. voluntary ones. Where do voluntary frameworks outperform binding law? (This is interesting because it reveals where corporate self-regulation is ahead of legislation.)

### 5. Key Findings (for LinkedIn / publication)
- Top 5 most under-governed risk areas
- Top 5 best-governed risk areas
- The single most important gap (narrative framing for thought leadership)
- Any surprising findings

## Output Format
```json
{
  "uncovered_risks": [...],
  "weakly_covered_risks": [...],
  "coverage_by_creator": {...},
  "binding_vs_voluntary": {...},
  "key_findings": {
    "top_undergoverned": [...],
    "top_governed": [...],
    "headline_gap": "...",
    "surprises": [...]
  }
}
```
