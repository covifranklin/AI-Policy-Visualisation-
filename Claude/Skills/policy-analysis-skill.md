# Policy Analysis Skill

## Purpose
Analyze a single AI governance policy document against the project's risk taxonomy and produce structured coverage scores.

## Input
- A policy document (PDF or text)
- The risk taxonomy (from /data/taxonomy.json)
- The scoring rubric (from CLAUDE.md)

## Process
1. Read the entire policy document
2. For each of the 8 top-level risk categories and their subcategories:
   a. Search the document for provisions, articles, clauses, or language relevant to the subcategory
   b. Assess the specificity and enforceability of any relevant provisions
   c. Assign a score (0-3) per the rubric
   d. Record the exact article/section references
   e. Write a one-sentence summary justifying the score
3. Flag any notable observations (e.g., "This policy explicitly defers to industry self-regulation on this topic")

## Output Format
```json
{
  "policy_id": "eu-ai-act",
  "analyzed_date": "2026-04-01",
  "scores": [
    {
      "subcategory_id": "goal-misalignment",
      "score": 2,
      "summary": "Article 9 requires risk management systems for high-risk AI that must account for unintended model behaviors",
      "clauses": ["Art. 9(2)(a)", "Art. 9(7)"],
      "notes": ""
    }
  ],
  "meta_observations": [
    "Strong on operational requirements, weak on alignment-specific technical risks",
    "Enforcement relies on national market surveillance authorities"
  ]
}
```

## Scoring Guidelines
- Be conservative. Score what the text actually mandates, not what it implies.
- Voluntary language ("should", "may consider") scores lower than mandatory ("shall", "must").
- A policy that creates a general framework without addressing a specific risk subcategory gets 0 for that subcategory, not 1.
- Preamble language alone (recitals, whereas clauses, principles statements) = score 1 at most.
- Specific operational requirements with defined obligations = score 2.
- Score 3 requires both specific provisions AND defined enforcement/audit/penalty mechanisms for that specific risk area.
- If a policy addresses a parent category broadly but not a specific subcategory, note this but score the subcategory based on its own coverage.

## Quality Checks
- Every score > 0 must have at least one clause reference
- Every score must have a summary sentence
- Total scores per policy should be reviewed for internal consistency
- Cross-check: If a policy scores 3 on a subcategory, verify that enforcement mechanisms genuinely apply to that specific risk
