import React from 'react';
import '../index.css';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

// Pixel art style risk icons with glow effects and hover animations
// Using shape-rendering="crispEdges" for pixelated look

// 1. Alignment & Control — cracked compass with twitching needle
const AlignmentControlIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Alignment & Control Risks"
  >
    {/* Compass circle - pixelated octagon */}
    <path d="M24 4 L38 10 L44 24 L38 38 L24 44 L10 38 L4 24 L10 10 Z" />
    {/* Cardinal markers */}
    <rect x="23" y="5" width="2" height="4" fill={color} />
    <rect x="23" y="39" width="2" height="4" fill={color} />
    <rect x="5" y="23" width="4" height="2" fill={color} />
    <rect x="39" y="23" width="4" height="2" fill={color} />
    {/* Center pivot */}
    <rect x="23" y="23" width="2" height="2" fill={color} />
    {/* North needle - intact */}
    <path d="M24 24 L22 14 L24 12 L26 14 Z" fill={color} />
    {/* South needle - cracked and twitching */}
    <g className="icon-twitch">
      <path d="M24 24 L26 32 L28 34 L30 32 Z" fill={color} />
      {/* Crack lines */}
      <path d="M25 26 L27 28 M26 29 L29 27" strokeWidth="1" />
    </g>
    {/* Fragment particles */}
    <g className="icon-float">
      <rect x="31" y="30" width="1" height="1" fill={color} opacity="0.6" />
      <rect x="33" y="28" width="1" height="1" fill={color} opacity="0.4" />
    </g>
  </svg>
);

// 2. Operational & Infrastructure — circuit board with pulse
const OperationalInfrastructureIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Operational & Infrastructure Risks"
  >
    {/* PCB outline */}
    <rect x="6" y="10" width="36" height="28" />
    {/* Corner mounts */}
    <rect x="5" y="9" width="2" height="2" fill={color} />
    <rect x="41" y="9" width="2" height="2" fill={color} />
    <rect x="5" y="37" width="2" height="2" fill={color} />
    <rect x="41" y="37" width="2" height="2" fill={color} />
    {/* Center chip */}
    <rect x="18" y="18" width="12" height="12" />
    {/* Chip pins */}
    <rect x="18" y="14" width="2" height="4" fill={color} />
    <rect x="28" y="14" width="2" height="4" fill={color} />
    <rect x="18" y="30" width="2" height="4" fill={color} />
    <rect x="28" y="30" width="2" height="4" fill={color} />
    {/* Circuit traces - left */}
    <path d="M6 20 L16 20 L16 18 M6 28 L16 28 L16 30" />
    {/* Circuit traces - right */}
    <path d="M32 20 L42 20 M32 28 L42 28" />
    {/* Fracture line with pulse */}
    <g className="icon-pulse">
      <path d="M12 12 L20 20 L24 24 L32 32 L38 36" strokeWidth="3" />
      {/* Gap in fracture */}
      <rect x="22" y="22" width="4" height="4" fill="#0f172a" />
    </g>
  </svg>
);

// 3. Information & Epistemic — glitching eye
const InformationEpistemicIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Information & Epistemic Risks"
  >
    {/* Eye outline - pixelated */}
    <path d="M4 24 L8 16 L14 12 L24 10 L34 12 L40 16 L44 24 L40 32 L34 36 L24 38 L14 36 L8 32 Z" />
    {/* Iris */}
    <rect x="20" y="20" width="8" height="8" />
    {/* Pupil with dilation animation */}
    <g className="icon-pupil">
      <rect x="23" y="23" width="2" height="2" fill={color} />
    </g>
    {/* Horizontal glitch lines */}
    <g className="icon-glitch">
      <rect x="8" y="18" width="6" height="1" fill={color} opacity="0.8" />
      <rect x="16" y="18" width="4" height="1" fill={color} opacity="0.6" />
      <rect x="34" y="18" width="6" height="1" fill={color} opacity="0.8" />
      <rect x="8" y="29" width="5" height="1" fill={color} opacity="0.7" />
      <rect x="35" y="29" width="5" height="1" fill={color} opacity="0.7" />
    </g>
    {/* Vertical glitch bar */}
    <rect x="22" y="18" width="2" height="12" fill={color} opacity="0.3" className="icon-glitch-bar" />
  </svg>
);

// 4. Security & Conflict — shield with rotating reticle
const SecurityConflictIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Security & Conflict Risks"
  >
    {/* Shield outline */}
    <path d="M24 4 L40 10 L40 26 L24 42 L8 26 L8 10 Z" />
    {/* Shield boss */}
    <rect x="22" y="20" width="4" height="4" fill={color} opacity="0.3" />
    {/* Reticle ring */}
    <g className="icon-rotate">
      <circle cx="24" cy="24" r="10" strokeWidth="2" />
    </g>
    {/* Crosshair - static outer */}
    <rect x="23" y="10" width="2" height="6" fill={color} />
    <rect x="23" y="32" width="2" height="6" fill={color} />
    <rect x="10" y="23" width="6" height="2" fill={color} />
    <rect x="32" y="23" width="6" height="2" fill={color} />
    {/* Center dot with pulse */}
    <g className="icon-pulse">
      <rect x="23" y="23" width="2" height="2" fill={color} />
    </g>
  </svg>
);

// 5. Governance & Institutional — cracked gavel with shake
const GovernanceInstitutionalIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Governance & Institutional Risks"
  >
    {/* Strike base */}
    <rect x="8" y="40" width="20" height="3" fill={color} opacity="0.5" />
    {/* Gavel handle */}
    <g className="icon-shake">
      <rect x="12" y="32" width="4" height="12" transform="rotate(45 14 38)" fill={color} />
    </g>
    {/* Gavel head - cracked */}
    <g className="icon-shake">
      <rect x="26" y="8" width="14" height="10" transform="rotate(45 33 13)" />
      {/* Crack pattern */}
      <path d="M30 10 L34 14 L32 18" strokeWidth="1.5" />
      <path d="M34 14 L38 11" strokeWidth="1" />
    </g>
    {/* Impact particles */}
    <g className="icon-float">
      <rect x="20" y="38" width="1" height="1" fill={color} opacity="0.5" />
      <rect x="24" y="40" width="1" height="1" fill={color} opacity="0.4" />
      <rect x="18" y="42" width="1" height="1" fill={color} opacity="0.3" />
    </g>
  </svg>
);

// 6. Economic & Systemic — tipping scales
const EconomicSystemicIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Economic & Systemic Risks"
  >
    {/* Base */}
    <rect x="18" y="42" width="12" height="2" fill={color} />
    {/* Post */}
    <rect x="23" y="10" width="2" height="32" fill={color} />
    {/* Pivot */}
    <rect x="22" y="12" width="4" height="4" fill={color} />
    {/* Beam - tilting animation */}
    <g className="icon-tip">
      <rect x="8" y="20" width="32" height="2" fill={color} />
    </g>
    {/* Left pan - heavy, low */}
    <g className="icon-tip">
      <rect x="8" y="22" width="2" height="8" fill={color} />
      <path d="M4 34 L14 34 L10 30 Z" fill={color} opacity="0.5" />
      {/* Weight */}
      <rect x="7" y="35" width="6" height="4" fill={color} opacity="0.6" />
    </g>
    {/* Right pan - light, high */}
    <g className="icon-tip">
      <rect x="38" y="18" width="2" height="4" fill={color} />
      <path d="M34 22 L44 22 L40 26 Z" fill={color} opacity="0.3" />
    </g>
  </svg>
);

// 7. Human & Societal — fragmenting silhouette
const HumanSocietalIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Human & Societal Risks"
  >
    {/* Head */}
    <rect x="21" y="8" width="6" height="6" />
    {/* Body */}
    <rect x="22" y="16" width="4" height="14" fill={color} />
    {/* Left arm - intact */}
    <rect x="16" y="18" width="8" height="2" fill={color} />
    <rect x="14" y="20" width="2" height="6" fill={color} />
    {/* Right arm - fragmenting */}
    <g className="icon-fragment">
      <rect x="26" y="18" width="6" height="2" fill={color} />
      <rect x="32" y="19" width="3" height="2" fill={color} opacity="0.6" />
    </g>
    {/* Left leg - intact */}
    <rect x="20" y="30" width="3" height="10" fill={color} />
    <rect x="18" y="40" width="5" height="2" fill={color} />
    {/* Right leg - fragmenting */}
    <g className="icon-fragment">
      <rect x="25" y="30" width="3" height="8" fill={color} />
      <rect x="26" y="38" width="3" height="3" fill={color} opacity="0.5" />
    </g>
    {/* Floating fragments */}
    <g className="icon-float">
      <rect x="35" y="16" width="2" height="2" fill={color} opacity="0.4" />
      <rect x="38" y="20" width="1" height="1" fill={color} opacity="0.3" />
      <rect x="30" y="40" width="2" height="2" fill={color} opacity="0.4" />
    </g>
  </svg>
);

// 8. Long-term / Existential — draining hourglass
const LongtermExistentialIcon: React.FC<IconProps> = ({ color = 'currentColor', size = 48, className = '' }) => (
  <svg
    viewBox="0 0 48 48"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    shapeRendering="crispEdges"
    className={`${className} risk-icon`}
    aria-label="Long-term / Existential Risks"
  >
    {/* Top cap */}
    <rect x="14" y="6" width="20" height="2" fill={color} />
    {/* Bottom cap */}
    <rect x="14" y="40" width="20" height="2" fill={color} />
    {/* Glass outline - top chamber */}
    <path d="M16 8 L16 22 L24 24 L32 22 L32 8 Z" />
    {/* Glass outline - bottom chamber */}
    <path d="M16 40 L16 26 L24 24 L32 26 L32 40 Z" />
    {/* Sand in top - depleting */}
    <g className="icon-drain">
      <path d="M18 10 L30 10 L28 18 L20 18 Z" fill={color} opacity="0.4" />
    </g>
    {/* Sand stream */}
    <rect x="23" y="20" width="2" height="8" fill={color} className="icon-stream" />
    {/* Sand pile in bottom - growing */}
    <path d="M18 38 L30 38 L28 30 L20 30 Z" fill={color} opacity="0.5" />
    {/* Falling grains */}
    <g className="icon-float">
      <rect x="21" y="32" width="1" height="1" fill={color} opacity="0.6" />
      <rect x="25" y="34" width="1" height="1" fill={color} opacity="0.5" />
    </g>
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
      className={`risk-icon-wrapper inline-block ${className}`}
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
