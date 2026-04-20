import { Fragment, useState, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { RiskIcon } from './RiskIcons'
import taxonomyJson from '../../data/taxonomy.json'
import policiesJson from '../../data/policies.json'
import matrixJson from '../../data/matrix.json'

// ── Types ──────────────────────────────────────────────────────────────────

interface Policy {
  id: string
  name: string
  short_name: string
  creator_category: string
  binding: string
  status: string
  year: number
  jurisdiction: string
  url: string
}

interface Subcategory {
  id: string
  name: string
  description: string
}

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

interface MatrixEntry {
  policy_id: string
  subcategory_id: string
  score: number
  summary: string
  clauses: string[]
  notes?: string
}

type ActiveCell =
  | { type: 'category'; policyId: string; categoryId: string }
  | { type: 'subcategory'; policyId: string; categoryId: string; subcategoryId: string }

type PanelView =
  | null
  | { type: 'detail'; cell: ActiveCell }
  | { type: 'critical-gaps' }
  | { type: 'category-detail'; categoryId: string }

// ── Data ──────────────────────────────────────────────────────────────────

const categories = taxonomyJson.categories as Category[]
const policies = policiesJson as Policy[]
const matrixEntries = (matrixJson as { scores: MatrixEntry[] }).scores

// ── Constants ─────────────────────────────────────────────────────────────

const CREATOR_GROUPS: { id: string; label: string }[] = [
  { id: 'eu', label: 'European Union' },
  { id: 'us', label: 'United States' },
  { id: 'china', label: 'China' },
  { id: 'other-gov', label: 'Other Governments' },
  { id: 'multilateral', label: 'Multilateral' },
  { id: 'private-sector', label: 'Private Sector' },
]

const BINDING_LABEL: Record<string, string> = {
  yes: 'Binding',
  partial: 'Partial',
  no: 'Voluntary',
}

const BINDING_BADGE: Record<string, string> = {
  yes: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  partial: 'bg-amber-900/60 text-amber-300 border-amber-700',
  no: 'bg-slate-800/60 text-slate-400 border-slate-700',
}

const SCORE_LABELS: Record<number, string> = {
  0: 'Not addressed',
  1: 'Mentioned',
  2: 'Provisions',
  3: 'Provisions + enforcement',
}

const CATEGORY_HEADER_HEIGHT = 80
const SUBCATEGORY_HEADER_HEIGHT = 88

// ── Color utility ─────────────────────────────────────────────────────────

const COLOR_STOPS: [number, number, number][] = [
  [127, 29, 29],
  [194, 65, 12],
  [202, 138, 4],
  [21, 128, 61],
]

function scoreToColor(score: number): string {
  const clamped = Math.max(0, Math.min(3, score))
  const lower = Math.floor(clamped)
  const upper = Math.min(3, lower + 1)
  const t = clamped - lower
  const [r1, g1, b1] = COLOR_STOPS[lower]
  const [r2, g2, b2] = COLOR_STOPS[upper]
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`
}

// ── Summary Stats ─────────────────────────────────────────────────────────

interface CriticalGap {
  subcategory: Subcategory
  categoryId: string
  categoryName: string
  maxScore: number
  policiesWithScores: number
}

interface SummaryStats {
  policiesAnalyzed: number
  avgCoverageScore: number
  criticalGapsCount: number
  criticalGaps: CriticalGap[]
}

function computeSummaryStats(
  entries: MatrixEntry[],
  allSubcategories: Subcategory[],
  categories: Category[]
): SummaryStats {
  const analyzedPolicyIds = new Set(entries.map(e => e.policy_id))

  // Average of top-5 scores per subcategory, then mean across subcategories.
  // Uses top-5 rather than all policies so scores aren't diluted by policies
  // never designed to address a given risk.
  const TOP_N = 5
  const subcatIds = [...new Set(allSubcategories.map(s => s.id))]
  const perSubcatAvgs = subcatIds.map(id => {
    const scores = entries
      .filter(e => e.subcategory_id === id)
      .map(e => e.score)
      .sort((a, b) => b - a)
      .slice(0, TOP_N)
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
  })
  const avgCoverageScore =
    perSubcatAvgs.length > 0
      ? perSubcatAvgs.reduce((a, b) => a + b, 0) / perSubcatAvgs.length
      : 0

  const criticalGaps: CriticalGap[] = []
  for (const sub of allSubcategories) {
    const scoresForSub = entries
      .filter(e => e.subcategory_id === sub.id)
      .map(e => e.score)

    // Adequate coverage: either 2+ policies with provisions (≥2) OR 1+ with enforcement (3)
    const policiesWithProvisions = scoresForSub.filter(s => s >= 2).length
    const policiesWithEnforcement = scoresForSub.filter(s => s === 3).length
    const hasAdequateCoverage = policiesWithProvisions >= 2 || policiesWithEnforcement >= 1

    if (!hasAdequateCoverage) {
      const maxScore = scoresForSub.length > 0 ? Math.max(...scoresForSub) : 0
      const category = categories.find(c => c.subcategories.some(s => s.id === sub.id))!
      criticalGaps.push({
        subcategory: sub,
        categoryId: category.id,
        categoryName: category.name,
        maxScore,
        policiesWithScores: scoresForSub.length,
      })
    }
  }

  return {
    policiesAnalyzed: analyzedPolicyIds.size,
    avgCoverageScore,
    criticalGapsCount: criticalGaps.length,
    criticalGaps,
  }
}

// ── Detail Panel ──────────────────────────────────────────────────────────

interface DetailPanelProps {
  cell: ActiveCell
  scoreLookup: Record<string, Record<string, MatrixEntry>>
  onClose: () => void
}

const DetailPanel: FC<DetailPanelProps> = ({ cell, scoreLookup, onClose }) => {
  const policy = policies.find(p => p.id === cell.policyId)!
  const category = categories.find(c => c.id === cell.categoryId)!
  const policyScores = scoreLookup[cell.policyId] ?? {}

  let content: ReactNode

  if (cell.type === 'category') {
    const rows = category.subcategories.map(sub => ({
      sub,
      entry: policyScores[sub.id] as MatrixEntry | undefined,
    }))
    const scores = rows.flatMap(r => (r.entry ? [r.entry.score] : []))
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null

    content = (
      <div>
        <div className="flex items-center gap-3 mb-5">
          {avg !== null ? (
            <span
              className="text-2xl font-bold px-3 py-1 rounded text-white tabular-nums"
              style={{ backgroundColor: scoreToColor(avg) }}
            >
              {avg.toFixed(1)}
            </span>
          ) : (
            <span className="text-lg font-medium px-3 py-1 rounded bg-slate-800 text-slate-500">
              No data
            </span>
          )}
          {avg !== null && (
            <span className="text-slate-500 text-xs">
              avg · {scores.length}/{category.subcategories.length} subcategories analyzed
            </span>
          )}
        </div>

        <div className="space-y-2">
          {rows.map(({ sub, entry }) => (
            <div key={sub.id} className="rounded bg-slate-800/50 border border-slate-700/50 p-3">
              <div className="flex items-start gap-2 mb-1.5">
                <span
                  className="shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-white mt-0.5"
                  style={{ backgroundColor: entry ? scoreToColor(entry.score) : '#1e293b' }}
                >
                  {entry ? entry.score : '–'}
                </span>
                <span className="text-slate-200 text-sm font-medium leading-tight">{sub.name}</span>
              </div>
              {entry ? (
                <>
                  <p className="text-slate-400 text-xs leading-relaxed ml-8 mb-1.5">{entry.summary}</p>
                  {entry.clauses.length > 0 && (
                    <ul className="ml-8 space-y-0.5">
                      {entry.clauses.map((c, i) => (
                        <li key={i} className="text-slate-500 text-xs">· {c}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-slate-600 text-xs ml-8 italic">Not yet analyzed</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    const sub = category.subcategories.find(s => s.id === cell.subcategoryId)!
    const entry = policyScores[sub.id] as MatrixEntry | undefined

    content = (
      <div>
        <p className="text-slate-500 text-xs leading-relaxed mb-4">{sub.description}</p>

        {entry ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-2xl font-bold px-3 py-1 rounded text-white tabular-nums"
                style={{ backgroundColor: scoreToColor(entry.score) }}
              >
                {entry.score}/3
              </span>
              <span className="text-slate-400 text-sm">{SCORE_LABELS[entry.score]}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{entry.summary}</p>
            {entry.clauses.length > 0 && (
              <div className="mb-4">
                <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider mb-2">
                  Clauses referenced
                </p>
                <ul className="space-y-1">
                  {entry.clauses.map((c, i) => (
                    <li key={i} className="text-slate-400 text-sm">· {c}</li>
                  ))}
                </ul>
              </div>
            )}
            {entry.notes && (
              <div className="border-t border-slate-700 pt-3">
                <p className="text-slate-500 text-xs italic leading-relaxed">{entry.notes}</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded bg-slate-800 text-slate-500 text-sm">
              Not yet analyzed
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/25 z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[420px] max-w-[90vw] bg-slate-900 border-l border-slate-700 overflow-y-auto z-40 shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-slate-900/98 backdrop-blur border-b border-slate-700 px-5 py-3.5 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <RiskIcon categoryId={cell.categoryId} size={16} color="#64748b" />
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider truncate">
                {category.name}
              </span>
            </div>
            {cell.type === 'subcategory' && (
              <p className="text-slate-200 text-sm font-medium leading-snug">
                {category.subcategories.find(s => s.id === cell.subcategoryId)?.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2 flex-wrap shrink-0">
          <a
            href={policy.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold text-sm hover:text-blue-300 transition-colors"
          >
            {policy.short_name}
          </a>
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${BINDING_BADGE[policy.binding]}`}>
            {BINDING_LABEL[policy.binding]}
          </span>
          <span className="text-slate-500 text-xs">{policy.jurisdiction} · {policy.year}</span>
        </div>

        <div className="px-5 py-4 flex-1 overflow-y-auto">
          {content}
        </div>
      </div>
    </>
  )
}

// ── Collapsible Section Component ─────────────────────────────────────────

interface CollapsibleSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

const CollapsibleSection: FC<CollapsibleSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-800 rounded-lg bg-slate-900/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
      >
        <span className="text-slate-300 font-medium text-sm">{title}</span>
        <span className={`text-slate-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-slate-800/50">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────

export const PolicyMatrix: FC = () => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [panelView, setPanelView] = useState<PanelView>(null)
  const [creatorFilter, setCreatorFilter] = useState<Set<string>>(new Set())
  const [bindingFilter, setBindingFilter] = useState<Set<string>>(new Set())
  const [gapsOnly, setGapsOnly] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const scoreLookup = useMemo(() => {
    const lookup: Record<string, Record<string, MatrixEntry>> = {}
    for (const entry of matrixEntries) {
      if (!lookup[entry.policy_id]) lookup[entry.policy_id] = {}
      lookup[entry.policy_id][entry.subcategory_id] = entry
    }
    return lookup
  }, [])

  const allSubcategories = useMemo(
    () => categories.flatMap(c => c.subcategories),
    []
  )

  // Get filtered policies based on current filters
  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      if (creatorFilter.size > 0 && !creatorFilter.has(p.creator_category)) return false
      if (bindingFilter.size > 0 && !bindingFilter.has(p.binding)) return false
      return true
    })
  }, [creatorFilter, bindingFilter])

  // Get matrix entries for filtered policies only
  const filteredMatrixEntries = useMemo(() => {
    const filteredPolicyIds = new Set(filteredPolicies.map(p => p.id))
    return matrixEntries.filter(e => filteredPolicyIds.has(e.policy_id))
  }, [filteredPolicies])

  // Compute summary stats based on filtered data
  const summaryStats = useMemo(
    () => computeSummaryStats(filteredMatrixEntries, allSubcategories, categories),
    [filteredMatrixEntries, allSubcategories]
  )

  // Compute category averages based on filtered data.
  // For each subcategory, takes the top-5 policy scores and averages those,
  // then averages across subcategories within the category.
  const categoryAverages = useMemo(() => {
    const TOP_N = 5
    return categories.map(cat => {
      const perSubcatAvgs: number[] = []
      for (const sub of cat.subcategories) {
        const scores = filteredPolicies
          .flatMap(p => {
            const entry = scoreLookup[p.id]?.[sub.id]
            return entry ? [entry.score] : []
          })
          .sort((a, b) => b - a)
          .slice(0, TOP_N)
        if (scores.length > 0) {
          perSubcatAvgs.push(scores.reduce((a, b) => a + b, 0) / scores.length)
        }
      }
      const avg =
        perSubcatAvgs.length > 0
          ? perSubcatAvgs.reduce((a, b) => a + b, 0) / perSubcatAvgs.length
          : null
      return { categoryId: cat.id, average: avg, count: perSubcatAvgs.length }
    })
  }, [scoreLookup, filteredPolicies])

  const groupedPolicies = useMemo(() => {
    return CREATOR_GROUPS.map(g => ({
      ...g,
      policies: filteredPolicies.filter(p => p.creator_category === g.id),
    })).filter(g => g.policies.length > 0)
  }, [filteredPolicies])

  function getCategoryAvg(policyId: string, cat: Category): number | null {
    const scores = cat.subcategories.flatMap(sub => {
      const e = scoreLookup[policyId]?.[sub.id]
      return e ? [e.score] : []
    })
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
  }

  function toggleExpand(catId: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(catId)) next.delete(catId)
      else next.add(catId)
      return next
    })
    setPanelView(cur => (cur?.type === 'detail' && cur.cell.categoryId === catId ? null : cur))
  }

  function toggleFilter<T extends string>(
    current: Set<T>,
    value: T,
    setter: (s: Set<T>) => void,
  ) {
    const next = new Set(current)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    setter(next)
  }

  function cellIsDimmed(score: number | null): boolean {
    return gapsOnly && score !== null && score > 1
  }

  const totalDataCols = categories.reduce(
    (n, cat) => n + (expanded.has(cat.id) ? cat.subcategories.length : 1),
    0,
  )

  const hasAnyExpanded = expanded.size > 0

  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="border-b border-slate-800 px-4 sm:px-6 py-5 shrink-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-100">
              AI Policy Coverage Matrix
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Mapping governance frameworks against frontier AI risks
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-600 text-xs whitespace-nowrap">Last updated: {lastUpdated}</span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-xs px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors whitespace-nowrap"
            >
              {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Stats Bar ───────────────────────────────── */}
      <div className="border-b border-slate-800 px-4 sm:px-6 py-4 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-6 flex-wrap min-w-max">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-lg">{summaryStats.policiesAnalyzed}</span>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Policies Analyzed</p>
              <p className="text-slate-300 text-sm">frameworks in matrix</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-800" />

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: scoreToColor(summaryStats.avgCoverageScore) + '33',
                borderColor: scoreToColor(summaryStats.avgCoverageScore)
              }}
            >
              <span
                className="font-bold text-lg"
                style={{ color: scoreToColor(summaryStats.avgCoverageScore) }}
              >
                {summaryStats.avgCoverageScore.toFixed(2)}
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Avg Coverage</p>
              <p className="text-slate-300 text-sm">top 5 policies per risk factor</p>
            </div>
          </div>

          <div className="w-px h-10 bg-slate-800" />

          <button
            onClick={() => setPanelView({ type: 'critical-gaps' })}
            className="flex items-center gap-3 group text-left hover:bg-amber-900/20 rounded-lg p-1 -ml-1 pr-1 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center group-hover:border-amber-400/50 transition-colors">
              <span className="text-amber-400 font-bold text-lg">{summaryStats.criticalGapsCount}</span>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider group-hover:text-amber-400 transition-colors">Critical Gaps</p>
              <p className="text-slate-300 text-sm">subcategories lacking adequate coverage</p>
            </div>
          </button>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Score</span>
            {([0, 1, 2, 3] as const).map(s => (
              <div key={s} className="flex items-center gap-1.5 hidden sm:flex">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: scoreToColor(s) }} />
                <span className="text-slate-500 text-xs whitespace-nowrap">{s} — {SCORE_LABELS[s]}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <div className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-700 shrink-0" />
              <span className="text-slate-500 text-xs">No data</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Risk Category Legend ─────────────────────────────── */}
      <div className="px-4 sm:px-6 py-4 border-b border-slate-800 shrink-0">
        <CollapsibleSection title="Risk Category Legend" defaultOpen={true}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
            {categories.map(cat => {
              const catAvg = categoryAverages.find(a => a.categoryId === cat.id)
              const avg = catAvg?.average
              return (
                <button
                  key={cat.id}
                  onClick={() => setPanelView({ type: 'category-detail', categoryId: cat.id })}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 transition-colors text-left w-full"
                >
                  <div className="shrink-0">
                    <RiskIcon categoryId={cat.id} size={28} color="#94a3b8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-slate-200 text-sm font-medium leading-tight truncate">{cat.name}</p>
                      {avg !== null && avg !== undefined && (
                        <span
                          className="shrink-0 w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center text-white"
                          style={{ backgroundColor: scoreToColor(avg) }}
                        >
                          {avg.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                      {cat.subcategories[0]?.description || 'Risk category'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </CollapsibleSection>
      </div>

      {/* ── Main layout with sidebar ─────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/30 overflow-y-auto hidden md:block">
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mb-3">
                  Creator Category
                </h3>
                <div className="space-y-2">
                  {CREATOR_GROUPS.map(g => (
                    <label key={g.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={creatorFilter.size === 0 || creatorFilter.has(g.id)}
                        onChange={() => toggleFilter(creatorFilter, g.id, setCreatorFilter)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20 focus:ring-2"
                      />
                      <span className="text-slate-300 text-sm group-hover:text-slate-100 transition-colors">{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mb-3">
                  Binding Status
                </h3>
                <div className="space-y-2">
                  {(['yes', 'partial', 'no'] as const).map(val => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={bindingFilter.size === 0 || bindingFilter.has(val)}
                        onChange={() => toggleFilter(bindingFilter, val, setBindingFilter)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20 focus:ring-2"
                      />
                      <span className="text-slate-300 text-sm group-hover:text-slate-100 transition-colors">{BINDING_LABEL[val]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mb-3">
                  View Options
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    role="switch"
                    aria-checked={gapsOnly}
                    onClick={() => setGapsOnly(p => !p)}
                    className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${gapsOnly ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${gapsOnly ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                    />
                  </button>
                  <span className="text-slate-300 text-sm">Show gaps only (≤1)</span>
                </label>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                  Filter to highlight cells scoring 0 (not addressed) or 1 (mentioned only)
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setCreatorFilter(new Set())
                    setBindingFilter(new Set())
                    setGapsOnly(false)
                  }}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Matrix content */}
        <div className="flex-1 overflow-x-auto relative">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-50" style={{ zIndex: 50 }} />
          <table className="border-collapse" style={{ minWidth: 'max-content', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th
                  className="border-b border-r border-slate-800 bg-slate-950 text-left px-3 text-slate-400 text-xs font-medium uppercase tracking-wider"
                  style={{
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 100,
                    width: 192,
                    minWidth: 192,
                    height: CATEGORY_HEADER_HEIGHT,
                    verticalAlign: 'middle',
                  }}
                >
                  Policy
                </th>

                {categories.map(cat => {
                  const isExpanded = expanded.has(cat.id)
                  const colCount = isExpanded ? cat.subcategories.length : 1
                  const shortName = cat.name.replace(' Risks', '').replace(/ & /g, ' \n& ')
                  return (
                    <th
                      key={cat.id}
                      colSpan={colCount}
                      title={`${cat.name} - Click to ${isExpanded ? 'collapse' : 'expand'} subcategories`}
                      className={`border-b border-r border-slate-800 cursor-pointer select-none transition-colors ${isExpanded ? 'bg-slate-900' : 'bg-slate-950 hover:bg-slate-900'
                        }`}
                      style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 20,
                        height: CATEGORY_HEADER_HEIGHT,
                        width: isExpanded ? colCount * 52 : 72,
                        minWidth: isExpanded ? colCount * 52 : 72,
                        verticalAlign: 'middle',
                        padding: '4px',
                      }}
                      onClick={() => toggleExpand(cat.id)}
                    >
                      <div className="flex flex-col items-center justify-center gap-0.5 px-1 py-2 h-full">
                        <RiskIcon
                          categoryId={cat.id}
                          size={22}
                          color={isExpanded ? '#94a3b8' : '#475569'}
                        />
                        <span
                          className={`text-[9px] font-medium leading-tight text-center transition-colors ${isExpanded ? 'text-slate-300' : 'text-slate-500'
                            }`}
                          style={{
                            maxWidth: isExpanded ? 'none' : 56,
                            wordBreak: 'break-word',
                            lineHeight: '1.1',
                          }}
                        >
                          {shortName}
                        </span>
                        <span className={`text-[8px] transition-colors ${isExpanded ? 'text-slate-400' : 'text-slate-600'}`}>
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </th>
                  )
                })}
              </tr>

              {hasAnyExpanded && (
                <tr>
                  <th
                    className="border-b border-r border-slate-800 bg-slate-950"
                    style={{
                      position: 'sticky',
                      top: CATEGORY_HEADER_HEIGHT,
                      left: 0,
                      zIndex: 30,
                      width: 192,
                      height: SUBCATEGORY_HEADER_HEIGHT,
                    }}
                  />
                  {categories.flatMap(cat =>
                    expanded.has(cat.id)
                      ? cat.subcategories.map(sub => (
                        <th
                          key={sub.id}
                          title={sub.description}
                          className="border-b border-r border-slate-800 bg-slate-900/60"
                          style={{
                            position: 'sticky',
                            top: CATEGORY_HEADER_HEIGHT,
                            zIndex: 20,
                            width: 52,
                            minWidth: 52,
                            height: SUBCATEGORY_HEADER_HEIGHT,
                            padding: 0,
                            verticalAlign: 'bottom',
                          }}
                        >
                          <div
                            style={{
                              width: 52,
                              height: SUBCATEGORY_HEADER_HEIGHT,
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                              paddingBottom: 6,
                            }}
                          >
                            <span
                              style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                                fontSize: 10,
                                color: '#64748b',
                                lineHeight: 1.2,
                                maxHeight: SUBCATEGORY_HEADER_HEIGHT - 8,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {sub.name}
                            </span>
                          </div>
                        </th>
                      ))
                      : [
                        <th
                          key={cat.id}
                          className="border-b border-r border-slate-800 bg-slate-950"
                          style={{
                            position: 'sticky',
                            top: CATEGORY_HEADER_HEIGHT,
                            zIndex: 20,
                            width: 68,
                            minWidth: 68,
                            height: SUBCATEGORY_HEADER_HEIGHT,
                          }}
                        />,
                      ],
                  )}
                </tr>
              )}
            </thead>

            <tbody>
              {/* Category Average Row - Top of matrix */}
              <tr className="bg-slate-900/80">
                <td
                  className="border-b-2 border-r border-slate-700 px-3 py-3"
                  style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 100,
                    width: 192,
                    minWidth: 192,
                  }}
                >
                  <span className="text-slate-200 text-xs font-bold uppercase tracking-wider">Category Average</span>
                  <span className="block text-slate-500 text-[10px] mt-0.5 normal-case tracking-normal font-normal">avg of top 5 per risk factor</span>
                </td>
                {categories.map(cat => {
                  const catAvg = categoryAverages.find(a => a.categoryId === cat.id)
                  const isExpanded = expanded.has(cat.id)
                  const avgValue = catAvg?.average ?? null

                  if (isExpanded) {
                    return cat.subcategories.map(sub => {
                      const subScores = filteredPolicies
                        .flatMap(p => {
                          const entry = scoreLookup[p.id]?.[sub.id]
                          return entry ? [entry.score] : []
                        })
                        .sort((a, b) => b - a)
                        .slice(0, 5)
                      const subAvg = subScores.length > 0 ? subScores.reduce((a, b) => a + b, 0) / subScores.length : null
                      return (
                        <td
                          key={sub.id}
                          className="border-b-2 border-r border-slate-700"
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            width: 52,
                            minWidth: 52,
                            height: 44,
                            backgroundColor: subAvg !== null ? scoreToColor(subAvg) : '#0f172a',
                          }}
                        >
                          <span className="flex items-center justify-center h-full w-full text-xs font-bold text-white/95 tabular-nums">
                            {subAvg !== null ? subAvg.toFixed(1) : ''}
                          </span>
                        </td>
                      )
                    })
                  } else {
                    return (
                      <td
                        key={cat.id}
                        title={`${cat.name}: ${avgValue?.toFixed(2) ?? 'no data'} average across filtered policies`}
                        className="border-b-2 border-r border-slate-700"
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: 72,
                          minWidth: 72,
                          height: 44,
                          backgroundColor: avgValue !== null ? scoreToColor(avgValue) : '#0f172a',
                        }}
                      >
                        <span className="flex items-center justify-center h-full w-full text-xs font-bold text-white/95 tabular-nums">
                          {avgValue !== null ? avgValue.toFixed(2) : ''}
                        </span>
                      </td>
                    )
                  }
                })}
              </tr>

              {groupedPolicies.map(group => (
                <Fragment key={group.id}>
                  <tr>
                    <td
                      colSpan={1 + totalDataCols}
                      className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-700 bg-slate-900/60"
                      style={{ position: 'sticky', left: 0 }}
                    >
                      {group.label}
                    </td>
                  </tr>

                  {group.policies.map(policy => {
                    const hasData = matrixEntries.some(e => e.policy_id === policy.id)
                    return (
                      <tr key={policy.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td
                          className="border-b border-r border-slate-800 bg-slate-950 group-hover:bg-slate-900/80 px-3 py-2 transition-colors"
                          style={{
                            position: 'sticky',
                            left: 0,
                            zIndex: 100,
                            width: 192,
                            minWidth: 192,
                          }}
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={policy.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-200 text-xs font-medium hover:text-blue-300 transition-colors whitespace-nowrap"
                              onClick={e => e.stopPropagation()}
                            >
                              {policy.short_name}
                            </a>
                            <span
                              className={`text-[9px] px-1 py-px rounded border whitespace-nowrap leading-tight ${BINDING_BADGE[policy.binding]}`}
                            >
                              {BINDING_LABEL[policy.binding]}
                            </span>
                          </div>
                          <div className="text-slate-600 text-[10px] mt-0.5">{policy.year}</div>
                          {!hasData && (
                            <div className="text-slate-700 text-[9px] mt-0.5 italic">analysis pending</div>
                          )}
                        </td>

                        {categories.flatMap(cat => {
                          if (expanded.has(cat.id)) {
                            return cat.subcategories.map(sub => {
                              const entry = scoreLookup[policy.id]?.[sub.id] as MatrixEntry | undefined
                              const isActive =
                                panelView?.type === 'detail' &&
                                panelView.cell.type === 'subcategory' &&
                                panelView.cell.policyId === policy.id &&
                                panelView.cell.subcategoryId === sub.id
                              const dimmed = cellIsDimmed(entry?.score ?? null)

                              return (
                                <td
                                  key={sub.id}
                                  title={entry ? `${sub.name}: ${entry.score}/3` : `${sub.name}: no data`}
                                  className="border-b border-r border-slate-800/40 cursor-pointer relative overflow-hidden"
                                  style={{
                                    width: 52,
                                    minWidth: 52,
                                    height: 40,
                                    backgroundColor: entry ? scoreToColor(entry.score) : '#0f172a',
                                    boxShadow: isActive
                                      ? 'inset 0 0 0 2px rgba(255,255,255,0.85)'
                                      : undefined,
                                    opacity: dimmed ? 0.25 : 1,
                                    transition: 'opacity 0.15s',
                                  }}
                                  onClick={() =>
                                    setPanelView({
                                      type: 'detail',
                                      cell: {
                                        type: 'subcategory',
                                        policyId: policy.id,
                                        categoryId: cat.id,
                                        subcategoryId: sub.id,
                                      }
                                    })
                                  }
                                >
                                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.08] transition-opacity" />
                                  <span className="relative z-10 flex items-center justify-center h-full w-full text-xs font-bold text-white/80 tabular-nums">
                                    {entry ? entry.score : ''}
                                  </span>
                                </td>
                              )
                            })
                          } else {
                            const avg = getCategoryAvg(policy.id, cat)
                            const isActive =
                              panelView?.type === 'detail' &&
                              panelView.cell.type === 'category' &&
                              panelView.cell.policyId === policy.id &&
                              panelView.cell.categoryId === cat.id
                            const dimmed = cellIsDimmed(avg)

                            return (
                              <td
                                key={cat.id}
                                title={avg !== null ? `${cat.name}: ${avg.toFixed(1)} avg` : `${cat.name}: no data`}
                                className="border-b border-r border-slate-800/40 cursor-pointer relative overflow-hidden"
                                style={{
                                  width: 68,
                                  minWidth: 68,
                                  height: 40,
                                  backgroundColor: avg !== null ? scoreToColor(avg) : '#0f172a',
                                  boxShadow: isActive
                                    ? 'inset 0 0 0 2px rgba(255,255,255,0.85)'
                                    : undefined,
                                  opacity: dimmed ? 0.25 : 1,
                                  transition: 'opacity 0.15s',
                                }}
                                onClick={() =>
                                  setPanelView({
                                    type: 'detail',
                                    cell: {
                                      type: 'category',
                                      policyId: policy.id,
                                      categoryId: cat.id,
                                    }
                                  })
                                }
                              >
                                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-[0.08] transition-opacity" />
                                <span className="relative z-10 flex items-center justify-center h-full w-full text-xs font-semibold text-white/80 tabular-nums">
                                  {avg !== null ? avg.toFixed(1) : ''}
                                </span>
                              </td>
                            )
                          }
                        })}
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer sections ──────────────────────────────────── */}
      <div className="border-t border-slate-800 px-4 sm:px-6 py-6 shrink-0 space-y-4">
        {/* Methodology Section */}
        <CollapsibleSection title="Methodology">
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">
                Each policy is scored against 8 risk categories and {categories.reduce((n, c) => n + c.subcategories.length, 0)} subcategories
                using a conservative 4-point rubric based on what instruments <em>mandate</em>, not what they imply.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([0, 1, 2, 3] as const).map(score => (
                <div key={score} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div
                    className="shrink-0 w-8 h-8 rounded flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: scoreToColor(score) }}
                  >
                    {score}
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{SCORE_LABELS[score]}</p>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {score === 0 && 'The risk category receives no explicit mention or consideration in the policy document.'}
                      {score === 1 && 'The risk is acknowledged in preamble, principles, or high-level statements without operative provisions.'}
                      {score === 2 && 'Specific operative provisions address the risk (requirements, guidelines, or recommended practices).'}
                      {score === 3 && 'Specific provisions backed by enforcement mechanisms (audits, penalties, licensing, or oversight bodies).'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/50">
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong className="text-slate-400">Scoring principle: </strong>
                Scored conservatively on what instruments mandate, not what they imply.
                Presence of related language in preamble or principles alone warrants only a score of 1.
                Enforcement mechanisms include mandatory audits, licensing requirements, civil/criminal penalties,
                or dedicated oversight bodies with investigative authority.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* About Section */}
        <CollapsibleSection title="About This Project">
          <div className="mt-3 space-y-3">
            <p className="text-slate-400 text-sm leading-relaxed">
              The AI Policy Coverage Matrix provides a systematic analysis of how existing and proposed
              governance frameworks address frontier AI risks. By mapping policies against a comprehensive
              risk taxonomy, this tool identifies critical gaps in regulatory coverage and enables
              evidence-based policy development.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              This analysis covers {policies.length} policies from governments, multilateral bodies,
              and private sector organizations. Each policy is evaluated against 8 major risk categories
              encompassing alignment, operational security, epistemic risks, misuse potential, and
              long-term existential concerns.
            </p>
            <div className="pt-3 border-t border-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-slate-500 text-xs">
                {policies.length} policies in scope ·{' '}
                {matrixEntries.length > 0 ? new Set(matrixEntries.map(e => e.policy_id)).size : 0} analyzed to date ·{' '}
                {categories.length} risk categories ·{' '}
                {categories.reduce((n, c) => n + c.subcategories.length, 0)} subcategories
              </p>
              <p className="text-slate-500 text-xs">
                Author: <a href="https://www.linkedin.com/in/covi-franklin-005896190/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Covi Franklin</a>
              </p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* ── Detail panel ─────────────────────────────────────── */}
      {panelView && panelView.type === 'detail' && (
        <DetailPanel
          cell={panelView.cell}
          scoreLookup={scoreLookup}
          onClose={() => setPanelView(null)}
        />
      )}

      {/* ── Critical Gaps Panel ──────────────────────────────── */}
      {panelView && panelView.type === 'critical-gaps' && (
        <CriticalGapsPanel
          gaps={summaryStats.criticalGaps}
          onClose={() => setPanelView(null)}
        />
      )}

      {/* ── Category Detail Panel ────────────────────────────── */}
      {panelView && panelView.type === 'category-detail' && (
        <CategoryDetailPanel
          categoryId={panelView.categoryId}
          categoryAverages={categoryAverages}
          scoreLookup={scoreLookup}
          filteredPolicies={filteredPolicies}
          onClose={() => setPanelView(null)}
        />
      )}
    </div>
  )
}

// ── Critical Gaps Panel ───────────────────────────────────────

interface CriticalGapsPanelProps {
  gaps: CriticalGap[]
  onClose: () => void
}

const CriticalGapsPanel: FC<CriticalGapsPanelProps> = ({ gaps, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/25 z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[480px] max-w-[90vw] bg-slate-900 border-l border-slate-700 overflow-y-auto z-40 shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-slate-900/98 backdrop-blur border-b border-slate-700 px-5 py-4 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-500 text-xl font-bold">{gaps.length}</span>
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">
                Critical Gaps Identified
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Subcategories without adequate coverage (need 2+ policies with provisions OR 1+ with enforcement)
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {gaps.map((gap, i) => (
            <div key={i} className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <RiskIcon categoryId={gap.categoryId} size={20} color="#f59e0b" />
                  <div>
                    <p className="text-slate-200 text-sm font-medium">{gap.subcategory.name}</p>
                    <p className="text-slate-500 text-xs">{gap.categoryName}</p>
                  </div>
                </div>
                <span
                  className="shrink-0 w-8 h-8 rounded flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: scoreToColor(gap.maxScore) }}
                >
                  {gap.maxScore}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">
                {gap.subcategory.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Max score: {gap.maxScore}/3</span>
                <span>{gap.policiesWithScores} policies scored</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ── Category Detail Panel ─────────────────────────────────────

interface CategoryDetailPanelProps {
  categoryId: string
  categoryAverages: { categoryId: string; average: number | null; count: number }[]
  scoreLookup: Record<string, Record<string, MatrixEntry>>
  filteredPolicies: Policy[]
  onClose: () => void
}

const CategoryDetailPanel: FC<CategoryDetailPanelProps> = ({ categoryId, categoryAverages, scoreLookup, filteredPolicies, onClose }) => {
  const category = categories.find(c => c.id === categoryId)!
  const catAvg = categoryAverages.find(a => a.categoryId === categoryId)

  return (
    <>
      <div className="fixed inset-0 bg-black/25 z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[480px] max-w-[90vw] bg-slate-900 border-l border-slate-700 overflow-y-auto z-40 shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-slate-900/98 backdrop-blur border-b border-slate-700 px-5 py-4 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <RiskIcon categoryId={category.id} size={18} color="#94a3b8" />
              <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider truncate">
                {category.name}
              </span>
            </div>
            <h2 className="text-slate-200 text-lg font-semibold leading-tight">{category.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-200 hover:bg-slate-700 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {catAvg?.average !== null ? (
                <span
                  className="text-3xl font-bold px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: scoreToColor(catAvg!.average!) }}
                >
                  {catAvg!.average!.toFixed(2)}
                </span>
              ) : (
                <span className="text-xl font-medium px-4 py-2 rounded-lg bg-slate-800 text-slate-500">
                  No data
                </span>
              )}
              <div>
                <p className="text-slate-400 text-xs">Average Score</p>
                <p className="text-slate-500 text-xs">across all policies</p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-slate-300 text-sm font-medium">{category.subcategories.length} subcategories</p>
              <p className="text-slate-500 text-xs">{catAvg?.count || 0} individual scores</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          <p className="text-slate-400 text-sm leading-relaxed">
            This category covers {category.subcategories.map(s => s.name.toLowerCase()).join(', ')}.
          </p>

          <div className="space-y-2">
            <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider mb-2">
              Subcategories
            </p>
            {category.subcategories.map(sub => {
              const subScores: number[] = []
              for (const policy of filteredPolicies) {
                const entry = scoreLookup[policy.id]?.[sub.id]
                if (entry) subScores.push(entry.score)
              }
              const subAvg = subScores.length > 0 ? subScores.reduce((a, b) => a + b, 0) / subScores.length : null

              return (
                <div key={sub.id} className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
                  <div className="flex items-start gap-2 mb-1.5">
                    <span
                      className="shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-white mt-0.5"
                      style={{ backgroundColor: subAvg !== null ? scoreToColor(subAvg) : '#1e293b' }}
                    >
                      {subAvg !== null ? subAvg.toFixed(1) : '–'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-slate-200 text-sm font-medium leading-tight">{sub.name}</p>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">{sub.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
