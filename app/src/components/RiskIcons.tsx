import React, { useState, useEffect } from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

// Pixel art icons with precise pixel placement and frame-by-frame sprite animations
// Limited high-contrast palette: #1e293b (dark), #475569 (mid), #94a3b8 (light), #f1f5f9 (bright)

// 1. Alignment & Control — Cracked compass with rotating broken needle
const AlignmentControlIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 8), 100);
    return () => clearInterval(interval);
  }, []);

  const needleAngle = frame * 45;

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Compass ring - 8-bit circle */}
      <rect x="12" y="4" width="8" height="1" fill={color} />
      <rect x="12" y="27" width="8" height="1" fill={color} />
      <rect x="4" y="12" width="1" height="8" fill={color} />
      <rect x="27" y="12" width="1" height="8" fill={color} />
      <rect x="8" y="2" width="2" height="2" fill={color} />
      <rect x="22" y="2" width="2" height="2" fill={color} />
      <rect x="8" y="28" width="2" height="2" fill={color} />
      <rect x="22" y="28" width="2" height="2" fill={color} />
      <rect x="2" y="8" width="2" height="2" fill={color} />
      <rect x="2" y="22" width="2" height="2" fill={color} />
      <rect x="28" y="8" width="2" height="2" fill={color} />
      <rect x="28" y="22" width="2" height="2" fill={color} />

      {/* Cardinal markers */}
      <rect x="15" y="1" width="2" height="3" fill="#f1f5f9" />
      <rect x="15" y="26" width="2" height="3" fill="#475569" />
      <rect x="1" y="15" width="3" height="2" fill="#f1f5f9" />
      <rect x="26" y="15" width="3" height="2" fill="#475569" />

      {/* Center pivot */}
      <rect x="15" y="15" width="2" height="2" fill="#f1f5f9" />

      {/* Rotating needle - intact north */}
      <g style={{ transformOrigin: '16px 16px', transform: `rotate(${needleAngle}deg)` }}>
        {/* North needle - solid */}
        <rect x="15" y="8" width="1" height="7" fill="#f1f5f9" />
        <rect x="16" y="10" width="1" height="5" fill="#f1f5f9" />
        {/* South needle - cracked/broken */}
        <rect x="15" y="18" width="1" height="4" fill="#475569" />
        <rect x="16" y="20" width="1" height="3" fill="#475569" />
        {/* Crack offset */}
        <rect x="17" y="19" width="1" height="2" fill="#475569" />
      </g>

      {/* Crack lines */}
      <rect x="18" y="17" width="1" height="1" fill={color} />
      <rect x="19" y="18" width="1" height="1" fill={color} />
    </svg>
  );
};

// 2. Operational & Infrastructure — Circuit board with pulsing fracture
const OperationalInfrastructureIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 4), 150);
    return () => clearInterval(interval);
  }, []);

  const pulse = frame < 2;

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* PCB outline */}
      <rect x="4" y="8" width="24" height="1" fill={color} />
      <rect x="4" y="23" width="24" height="1" fill={color} />
      <rect x="4" y="8" width="1" height="16" fill={color} />
      <rect x="27" y="8" width="1" height="16" fill={color} />

      {/* Corner mounts */}
      <rect x="3" y="7" width="2" height="2" fill="#f1f5f9" />
      <rect x="27" y="7" width="2" height="2" fill="#f1f5f9" />
      <rect x="3" y="23" width="2" height="2" fill="#f1f5f9" />
      <rect x="27" y="23" width="2" height="2" fill="#f1f5f9" />

      {/* Center chip */}
      <rect x="12" y="12" width="8" height="8" fill={color} />
      <rect x="14" y="14" width="4" height="4" fill="#1e293b" />

      {/* Chip pins */}
      <rect x="13" y="10" width="1" height="2" fill={color} />
      <rect x="15" y="10" width="1" height="2" fill={color} />
      <rect x="18" y="10" width="1" height="2" fill={color} />
      <rect x="13" y="20" width="1" height="2" fill={color} />
      <rect x="15" y="20" width="1" height="2" fill={color} />
      <rect x="18" y="20" width="1" height="2" fill={color} />

      {/* Circuit traces */}
      <rect x="5" y="12" width="7" height="1" fill={color} />
      <rect x="5" y="19" width="7" height="1" fill={color} />
      <rect x="20" y="12" width="7" height="1" fill={color} />
      <rect x="20" y="19" width="7" height="1" fill={color} />

      {/* Fracture - animated */}
      {pulse && <rect x="8" y="10" width="2" height="1" fill="#f1f5f9" />}
      <rect x="10" y="11" width="2" height="1" fill={color} />
      <rect x="12" y="12" width="1" height="1" fill={color} />
      <rect x="19" y="19" width="1" height="1" fill={color} />
      <rect x="20" y="20" width="2" height="1" fill={color} />
      {pulse && <rect x="22" y="21" width="2" height="1" fill="#f1f5f9" />}
    </svg>
  );
};

// 3. Information & Epistemic — Glitching eye
const InformationEpistemicIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 6), 80);
    return () => clearInterval(interval);
  }, []);

  const glitchOffset = frame % 3;

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Eye outline - almond shape */}
      <rect x="8" y="10" width="2" height="1" fill={color} />
      <rect x="10" y="9" width="2" height="1" fill={color} />
      <rect x="12" y="8" width="8" height="1" fill={color} />
      <rect x="20" y="9" width="2" height="1" fill={color} />
      <rect x="22" y="10" width="2" height="1" fill={color} />

      <rect x="6" y="11" width="2" height="1" fill={color} />
      <rect x="24" y="11" width="2" height="1" fill={color} />

      <rect x="4" y="12" width="2" height="8" fill={color} />
      <rect x="26" y="12" width="2" height="8" fill={color} />

      <rect x="6" y="20" width="2" height="1" fill={color} />
      <rect x="24" y="20" width="2" height="1" fill={color} />

      <rect x="8" y="21" width="2" height="1" fill={color} />
      <rect x="10" y="22" width="2" height="1" fill={color} />
      <rect x="12" y="23" width="8" height="1" fill={color} />
      <rect x="20" y="22" width="2" height="1" fill={color} />
      <rect x="22" y="21" width="2" height="1" fill={color} />

      {/* Iris */}
      <rect x="12" y="13" width="8" height="6" fill={color} />
      <rect x="13" y="14" width="6" height="4" fill="#1e293b" />

      {/* Pupil - dilating */}
      <rect x={14 + glitchOffset} y="15" width="2" height="2" fill="#f1f5f9" />
      <rect x={15 + glitchOffset} y="16" width="1" height="1" fill="#1e293b" />

      {/* Glitch lines - horizontal */}
      {frame % 2 === 0 && (
        <>
          <rect x="6" y="14" width="4" height="1" fill="#f1f5f9" opacity="0.7" />
          <rect x="22" y="14" width="4" height="1" fill="#f1f5f9" opacity="0.7" />
          <rect x="6" y="18" width="3" height="1" fill="#f1f5f9" opacity="0.5" />
          <rect x="23" y="18" width="3" height="1" fill="#f1f5f9" opacity="0.5" />
        </>
      )}

      {/* Glitch bar - vertical */}
      {frame % 3 === 0 && (
        <rect x="18" y="12" width="1" height="8" fill="#f1f5f9" opacity="0.4" />
      )}
    </svg>
  );
};

// 4. Security & Conflict — Shield with rotating reticle
const SecurityConflictIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 8), 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Shield outline */}
      <rect x="16" y="2" width="1" height="1" fill={color} />
      <rect x="14" y="3" width="5" height="1" fill={color} />
      <rect x="12" y="4" width="9" height="1" fill={color} />
      <rect x="10" y="5" width="3" height="1" fill={color} />
      <rect x="20" y="5" width="3" height="1" fill={color} />

      <rect x="8" y="6" width="2" height="12" fill={color} />
      <rect x="23" y="6" width="2" height="12" fill={color} />

      <rect x="10" y="18" width="2" height="2" fill={color} />
      <rect x="21" y="18" width="2" height="2" fill={color} />
      <rect x="12" y="20" width="2" height="2" fill={color} />
      <rect x="19" y="20" width="2" height="2" fill={color} />
      <rect x="14" y="22" width="5" height="1" fill={color} />
      <rect x="15" y="23" width="3" height="1" fill={color} />
      <rect x="16" y="24" width="1" height="1" fill={color} />

      {/* Shield boss */}
      <rect x="14" y="14" width="5" height="5" fill={color} opacity="0.5" />
      <rect x="15" y="15" width="3" height="3" fill="#1e293b" />

      {/* Rotating reticle */}
      <g style={{ transformOrigin: '16px 16px', transform: `rotate(${frame * 45}deg)` }}>
        <rect x="15" y="8" width="1" height="3" fill="#f1f5f9" />
        <rect x="15" y="21" width="1" height="3" fill="#f1f5f9" />
        <rect x="8" y="15" width="3" height="1" fill="#f1f5f9" />
        <rect x="21" y="15" width="3" height="1" fill="#f1f5f9" />
      </g>

      {/* Center dot */}
      <rect x="15" y="15" width="2" height="2" fill="#f1f5f9" />
    </svg>
  );
};

// 5. Governance & Institutional — Cracked gavel
const GovernanceInstitutionalIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 4), 100);
    return () => clearInterval(interval);
  }, []);

  const shake = frame % 2;

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Strike base */}
      <rect x="6" y="28" width="14" height="2" fill={color} />
      <rect x="8" y="26" width="10" height="2" fill={color} opacity="0.5" />

      {/* Gavel handle - shaking */}
      <g style={{ transform: `translate(${shake}px, 0)` }}>
        <rect x="8" y="18" width="3" height="10" fill={color} transform="rotate(45 9.5 23)" />
        <rect x="9" y="19" width="1" height="8" fill="#1e293b" transform="rotate(45 9.5 23)" />
      </g>

      {/* Gavel head - shaking with cracks */}
      <g style={{ transform: `translate(${shake}px, 0)` }}>
        <rect x="16" y="6" width="10" height="8" fill={color} transform="rotate(45 21 10)" />
        <rect x="17" y="7" width="8" height="6" fill="#1e293b" transform="rotate(45 21 10)" />

        {/* Crack pattern */}
        <rect x="18" y="8" width="2" height="1" fill="#f1f5f9" transform="rotate(45 21 10)" />
        <rect x="20" y="9" width="1" height="2" fill="#f1f5f9" transform="rotate(45 21 10)" />
        <rect x="19" y="11" width="2" height="1" fill="#f1f5f9" transform="rotate(45 21 10)" />
      </g>

      {/* Impact particles */}
      {frame === 0 && <rect x="12" y="25" width="1" height="1" fill="#f1f5f9" opacity="0.6" />}
      {frame === 1 && <rect x="14" y="25" width="1" height="1" fill="#f1f5f9" opacity="0.5" />}
      {frame === 2 && <rect x="11" y="26" width="1" height="1" fill="#f1f5f9" opacity="0.4" />}
    </svg>
  );
};

// 6. Economic & Systemic — Tipping scales
const EconomicSystemicIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 8), 150);
    return () => clearInterval(interval);
  }, []);

  const tip = Math.sin(frame * 0.785) * 3;

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Base */}
      <rect x="12" y="29" width="8" height="2" fill={color} />
      <rect x="14" y="27" width="4" height="2" fill={color} />

      {/* Post */}
      <rect x="15" y="8" width="2" height="19" fill={color} />

      {/* Pivot */}
      <rect x="14" y="6" width="4" height="4" fill="#f1f5f9" />
      <rect x="15" y="7" width="2" height="2" fill="#1e293b" />

      {/* Beam - tipping */}
      <g style={{ transformOrigin: '16px 8px', transform: `rotate(${tip}deg)` }}>
        <rect x="4" y="7" width="24" height="2" fill={color} />

        {/* Left pan - heavy, low */}
        <rect x="5" y="9" width="1" height="6" fill={color} />
        <rect x="3" y="15" width="6" height="1" fill={color} />
        <rect x="4" y="14" width="4" height="1" fill={color} opacity="0.5" />
        {/* Weight */}
        <rect x="4" y="16" width="4" height="3" fill={color} opacity="0.7" />
        <rect x="5" y="17" width="2" height="2" fill="#f1f5f9" />

        {/* Right pan - light, high */}
        <rect x="26" y="9" width="1" height="3" fill={color} />
        <rect x="24" y="12" width="6" height="1" fill={color} />
        <rect x="25" y="11" width="4" height="1" fill={color} opacity="0.3" />
      </g>
    </svg>
  );
};

// 7. Human & Societal — Fragmenting silhouette
const HumanSocietalIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 6), 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Head */}
      <rect x="13" y="4" width="6" height="6" fill={color} />
      <rect x="14" y="5" width="4" height="4" fill="#1e293b" />

      {/* Body */}
      <rect x="13" y="10" width="6" height="8" fill={color} />
      <rect x="14" y="11" width="4" height="6" fill="#1e293b" />

      {/* Left arm - intact */}
      <rect x="8" y="12" width="5" height="2" fill={color} />
      <rect x="6" y="14" width="2" height="5" fill={color} />

      {/* Right arm - fragmenting */}
      <rect x="19" y="12" width="4" height="2" fill={color} />
      {frame < 3 ? (
        <rect x={23 + (frame % 2)} y={13 + Math.floor(frame / 2)} width="2" height="1" fill={color} opacity="0.6" />
      ) : (
        <rect x="24" y="14" width="1" height="1" fill={color} opacity="0.3" />
      )}

      {/* Left leg - intact */}
      <rect x="12" y="18" width="3" height="9" fill={color} />
      <rect x="11" y="27" width="5" height="2" fill={color} />

      {/* Right leg - fragmenting */}
      <rect x="17" y="18" width="3" height="6" fill={color} />
      {frame >= 2 && (
        <rect x={17 + (frame - 2)} y={24 + (frame - 2)} width="2" height="2" fill={color} opacity="0.5" />
      )}

      {/* Floating fragments */}
      {frame === 0 && <rect x="25" y="10" width="1" height="1" fill={color} opacity="0.4" />}
      {frame === 1 && <rect x="26" y="12" width="1" height="1" fill={color} opacity="0.3" />}
      {frame === 2 && <rect x="21" y="27" width="1" height="1" fill={color} opacity="0.4" />}
      {frame === 3 && <rect x="23" y="28" width="1" height="1" fill={color} opacity="0.3" />}
    </svg>
  );
};

// 8. Long-term / Existential — Draining hourglass
const LongtermExistentialIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 12), 200);
    return () => clearInterval(interval);
  }, []);

  const sandLevel = 10 - Math.floor(frame * 0.8);
  const pileHeight = Math.floor(frame * 0.5);

  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} shapeRendering="crispEdges">
      {/* Top cap */}
      <rect x="10" y="2" width="12" height="2" fill={color} />

      {/* Bottom cap */}
      <rect x="10" y="28" width="12" height="2" fill={color} />

      {/* Glass outline - top chamber */}
      <rect x="10" y="4" width="2" height="10" fill={color} />
      <rect x="20" y="4" width="2" height="10" fill={color} />
      <rect x="12" y="13" width="8" height="1" fill={color} />

      {/* Glass outline - bottom chamber */}
      <rect x="10" y="18" width="2" height="10" fill={color} />
      <rect x="20" y="18" width="2" height="10" fill={color} />
      <rect x="12" y="17" width="8" height="1" fill={color} />

      {/* Sand in top - depleting */}
      {sandLevel > 0 && (
        <rect x="12" y={13 - sandLevel} width="8" height={sandLevel} fill="#f1f5f9" opacity="0.5" />
      )}

      {/* Neck */}
      <rect x="15" y="14" width="2" height="3" fill={color} />

      {/* Sand stream - flowing */}
      {frame % 2 === 0 && <rect x="15" y="17" width="1" height="4" fill="#f1f5f9" />}
      {frame % 2 === 1 && <rect x="16" y="17" width="1" height="4" fill="#f1f5f9" />}

      {/* Sand pile in bottom - growing */}
      {pileHeight > 0 && (
        <rect x={14 - Math.floor(pileHeight / 2)} y={27 - pileHeight} width={4 + pileHeight} height={pileHeight} fill="#f1f5f9" opacity="0.6" />
      )}

      {/* Falling grains */}
      {frame % 3 === 0 && <rect x="14" y="22" width="1" height="1" fill="#f1f5f9" opacity="0.5" />}
      {frame % 3 === 1 && <rect x="17" y="24" width="1" height="1" fill="#f1f5f9" opacity="0.4" />}
    </svg>
  );
};

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
