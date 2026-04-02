import React from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

// 1. Alignment & Control — cracked compass needle
const AlignmentControlIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Alignment & Control Risks"
  >
    {/* Compass circle */}
    <circle cx="24" cy="24" r="18" />
    {/* Cardinal tick marks */}
    <line x1="24" y1="6" x2="24" y2="10" />
    <line x1="24" y1="38" x2="24" y2="42" />
    <line x1="6" y1="24" x2="10" y2="24" />
    <line x1="38" y1="24" x2="42" y2="24" />
    {/* Compass rose — small center pivot */}
    <circle cx="24" cy="24" r="2" fill={color} stroke="none" />
    {/* North needle — intact, pointing up-left */}
    <line x1="24" y1="24" x2="18" y2="12" />
    {/* South needle — broken, deflected off true south */}
    <line x1="24" y1="24" x2="28" y2="35" />
    {/* Crack fracture on south needle */}
    <polyline points="24,24 26,30 28,35" strokeDasharray="3 1" />
    {/* Fragment chip breaking off */}
    <line x1="26" y1="30" x2="30" y2="28" />
  </svg>
);

// 2. Operational & Infrastructure — circuit board with fracture
const OperationalInfrastructureIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Operational & Infrastructure Risks"
  >
    {/* PCB outline */}
    <rect x="6" y="10" width="36" height="28" rx="2" />
    {/* Chip block in center */}
    <rect x="18" y="18" width="12" height="12" />
    {/* Trace lines left */}
    <line x1="6" y1="20" x2="18" y2="20" />
    <line x1="6" y1="28" x2="18" y2="28" />
    {/* Trace lines right */}
    <line x1="30" y1="20" x2="42" y2="20" />
    <line x1="30" y1="28" x2="42" y2="28" />
    {/* Trace lines top/bottom */}
    <line x1="22" y1="10" x2="22" y2="18" />
    <line x1="26" y1="10" x2="26" y2="18" />
    <line x1="22" y1="30" x2="22" y2="38" />
    <line x1="26" y1="30" x2="26" y2="38" />
    {/* Fracture line slashing diagonally across the whole board */}
    <polyline points="10,14 20,22 22,26 30,32 38,38" strokeWidth="2.5" />
    {/* Gap in fracture to show break */}
    <line x1="21" y1="23" x2="23" y2="25" stroke="none" />
  </svg>
);

// 3. Information & Epistemic — eye with signal interference
const InformationEpistemicIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Information & Epistemic Risks"
  >
    {/* Eye outline */}
    <path d="M4 24 C10 14, 38 14, 44 24 C38 34, 10 34, 4 24 Z" />
    {/* Iris */}
    <circle cx="24" cy="24" r="6" />
    {/* Pupil */}
    <circle cx="24" cy="24" r="2" fill={color} stroke="none" />
    {/* Signal interference — horizontal noise lines crossing the eye */}
    <line x1="8" y1="20" x2="14" y2="20" strokeDasharray="2 2" />
    <line x1="16" y1="20" x2="19" y2="20" strokeDasharray="2 2" />
    <line x1="29" y1="20" x2="34" y2="20" strokeDasharray="2 2" />
    <line x1="36" y1="20" x2="40" y2="20" strokeDasharray="2 2" />
    <line x1="8" y1="28" x2="13" y2="28" strokeDasharray="2 2" />
    <line x1="15" y1="28" x2="20" y2="28" strokeDasharray="2 2" />
    <line x1="30" y1="28" x2="35" y2="28" strokeDasharray="2 2" />
    <line x1="37" y1="28" x2="40" y2="28" strokeDasharray="2 2" />
    {/* Vertical glitch bar through iris */}
    <rect x="21" y="18" width="3" height="12" fill={color} fillOpacity="0.2" stroke="none" />
  </svg>
);

// 4. Security & Conflict — shield with targeting reticle
const SecurityConflictIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Security & Conflict Risks"
  >
    {/* Shield */}
    <path d="M24 4 L40 10 L40 26 C40 35, 24 44, 24 44 C24 44, 8 35, 8 26 L8 10 Z" />
    {/* Targeting reticle — outer ring */}
    <circle cx="24" cy="24" r="9" />
    {/* Crosshair lines — only the portions outside the inner circle */}
    <line x1="24" y1="15" x2="24" y2="19" />
    <line x1="24" y1="29" x2="24" y2="33" />
    <line x1="15" y1="24" x2="19" y2="24" />
    <line x1="29" y1="24" x2="33" y2="24" />
    {/* Center dot */}
    <circle cx="24" cy="24" r="2" fill={color} stroke="none" />
  </svg>
);

// 5. Governance & Institutional — cracked gavel
const GovernanceInstitutionalIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Governance & Institutional Risks"
  >
    {/* Gavel handle */}
    <line x1="14" y1="34" x2="32" y2="16" strokeWidth="3" />
    {/* Gavel head — rectangular block */}
    <rect x="28" y="8" width="14" height="8" rx="1" transform="rotate(45 35 12)" />
    {/* Strike base line */}
    <line x1="6" y1="42" x2="22" y2="42" />
    {/* Crack across gavel head */}
    <polyline points="30,10 34,14 32,18" strokeWidth="1.5" />
    {/* Fracture chips */}
    <line x1="34" y1="14" x2="38" y2="11" strokeWidth="1" />
    <line x1="34" y1="14" x2="37" y2="17" strokeWidth="1" />
  </svg>
);

// 6. Economic & Systemic — balance scales tipping sharply
const EconomicSystemicIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Economic & Systemic Risks"
  >
    {/* Central post */}
    <line x1="24" y1="8" x2="24" y2="42" />
    {/* Base */}
    <line x1="16" y1="42" x2="32" y2="42" />
    {/* Pivot marker */}
    <circle cx="24" cy="14" r="2" fill={color} stroke="none" />
    {/* Beam — tilted sharply left-down */}
    <line x1="8" y1="22" x2="40" y2="12" />
    {/* Left pan — heavy, low */}
    <path d="M4 26 Q8 30 12 26" />
    <line x1="8" y1="22" x2="8" y2="26" />
    {/* Right pan — light, high */}
    <path d="M36 14 Q40 18 44 14" />
    <line x1="40" y1="12" x2="40" y2="14" />
    {/* Weight on left pan */}
    <circle cx="8" cy="28" r="3" fill={color} fillOpacity="0.4" />
  </svg>
);

// 7. Human & Societal — human silhouette with fragments
const HumanSocietalIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Human & Societal Risks"
  >
    {/* Head */}
    <circle cx="24" cy="12" r="5" />
    {/* Body */}
    <line x1="24" y1="17" x2="24" y2="32" />
    {/* Left arm — intact */}
    <line x1="24" y1="22" x2="14" y2="28" />
    {/* Right arm — fragmenting */}
    <line x1="24" y1="22" x2="30" y2="26" />
    <line x1="30" y1="26" x2="35" y2="24" strokeDasharray="2 2" />
    {/* Left leg — intact */}
    <line x1="24" y1="32" x2="18" y2="42" />
    {/* Right leg — fragmenting */}
    <line x1="24" y1="32" x2="28" y2="38" />
    <line x1="28" y1="38" x2="32" y2="44" strokeDasharray="2 2" />
    {/* Detached fragments */}
    <line x1="36" y1="22" x2="39" y2="20" strokeWidth="1.5" />
    <line x1="34" y1="42" x2="37" y2="40" strokeWidth="1.5" />
    <circle cx="38" cy="18" r="1" fill={color} stroke="none" />
    <circle cx="36" cy="39" r="1" fill={color} stroke="none" />
  </svg>
);

// 8. Long-term / Existential — hourglass nearly empty
const LongtermExistentialIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Long-term / Existential Risks"
  >
    {/* Top cap */}
    <line x1="10" y1="6" x2="38" y2="6" />
    {/* Bottom cap */}
    <line x1="10" y1="42" x2="38" y2="42" />
    {/* Left outline */}
    <path d="M10 6 Q10 18 24 24 Q10 30 10 42" />
    {/* Right outline */}
    <path d="M38 6 Q38 18 24 24 Q38 30 38 42" />
    {/* Sand — top chamber nearly empty: just a few grains */}
    <line x1="22" y1="10" x2="26" y2="10" strokeWidth="1.5" />
    <line x1="21" y1="12" x2="27" y2="12" strokeWidth="1" strokeDasharray="1 2" />
    {/* Narrow stream at waist — very thin */}
    <line x1="24" y1="18" x2="24" y2="24" strokeWidth="1" />
    {/* Sand — bottom chamber mostly full */}
    <path d="M13 42 Q16 30 24 28 Q32 30 35 42 Z" fill={color} fillOpacity="0.25" stroke="none" />
    <path d="M13 42 Q16 30 24 28 Q32 30 35 42 Z" />
  </svg>
);

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  'alignment-control': AlignmentControlIcon,
  'operational-infrastructure': OperationalInfrastructureIcon,
  'information-epistemic': InformationEpistemicIcon,
  'security-conflict': SecurityConflictIcon,
  'governance-institutional': GovernanceInstitutionalIcon,
  'economic-systemic': EconomicSystemicIcon,
  'human-societal': HumanSocietalIcon,
  'longterm-existential': LongtermExistentialIcon,
};

interface RiskIconProps {
  categoryId: string;
  color?: string;
  size?: number;
  className?: string;
}

export const RiskIcon: React.FC<RiskIconProps> = ({ categoryId, color, size, className = '' }) => {
  const IconComponent = ICON_MAP[categoryId];
  if (!IconComponent) return null;

  return (
    <span
      className={`risk-icon inline-block transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_6px_currentColor] hover:scale-105 ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <IconComponent color={color} size={size} />
    </span>
  );
};

export {
  AlignmentControlIcon,
  OperationalInfrastructureIcon,
  InformationEpistemicIcon,
  SecurityConflictIcon,
  GovernanceInstitutionalIcon,
  EconomicSystemicIcon,
  HumanSocietalIcon,
  LongtermExistentialIcon,
};
