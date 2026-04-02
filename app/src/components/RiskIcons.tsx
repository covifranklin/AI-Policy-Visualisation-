import React, { useState, useEffect } from 'react';

interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

// Pixel art icons with hover-triggered frame-by-frame sprite animations
// Limited high-contrast palette: #1e293b (dark), #475569 (mid), #94a3b8 (light), #f1f5f9 (bright)

// 1. Alignment & Control — Cracked compass, needle spins wildly on hover
const AlignmentControlIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => setFrame(f => (f + 1) % 16), 50);
    return () => clearInterval(interval);
  }, [isHovered]);

  const needleAngle = frame * 22.5;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

      {/* Rotating needle */}
      <g style={{ transformOrigin: '16px 16px', transform: `rotate(${needleAngle}deg)` }}>
        {/* North needle - solid */}
        <rect x="15" y="6" width="1" height="9" fill="#f1f5f9" />
        <rect x="16" y="8" width="1" height="7" fill="#f1f5f9" />
        {/* South needle - cracked/broken */}
        <rect x="15" y="18" width="1" height="5" fill="#475569" />
        <rect x="16" y="20" width="1" height="4" fill="#475569" />
        {/* Crack offset */}
        <rect x="17" y="19" width="1" height="3" fill="#475569" />
      </g>

      {/* Crack lines */}
      <rect x="18" y="17" width="1" height="1" fill={color} />
      <rect x="19" y="18" width="1" height="1" fill={color} />
    </svg>
  );
};

// 2. Operational & Infrastructure — Circuit board with spreading fracture on hover
const OperationalInfrastructureIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => setFrame(f => Math.min(f + 1, 8)), 100);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

      {/* Fracture - spreads on hover */}
      {frame >= 1 && <rect x="8" y="10" width="2" height="1" fill="#f1f5f9" />}
      {frame >= 2 && <rect x="10" y="11" width="2" height="1" fill="#f1f5f9" />}
      {frame >= 3 && <rect x="12" y="12" width="2" height="1" fill="#f1f5f9" />}
      {frame >= 4 && <rect x="14" y="14" width="1" height="1" fill="#f1f5f9" />}
      {frame >= 5 && <rect x="17" y="17" width="2" height="1" fill="#f1f5f9" />}
      {frame >= 6 && <rect x="19" y="19" width="2" height="1" fill="#f1f5f9" />}
      {frame >= 7 && <rect x="21" y="20" width="2" height="1" fill="#f1f5f9" />}
      {frame >= 8 && <rect x="23" y="22" width="2" height="1" fill="#f1f5f9" />}
    </svg>
  );
};

// 3. Information & Epistemic — Eye with glitching corruption on hover
const InformationEpistemicIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => setFrame(f => (f + 1) % 8), 80);
    return () => clearInterval(interval);
  }, [isHovered]);

  const glitchOffset = isHovered ? (frame % 4) : 0;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

      {/* Pupil - glitches on hover */}
      <rect x={14 + glitchOffset} y="15" width="2" height="2" fill="#f1f5f9" />

      {/* Glitch lines - only on hover */}
      {isHovered && frame % 2 === 0 && (
        <>
          <rect x="6" y="14" width="4" height="1" fill="#f1f5f9" opacity="0.7" />
          <rect x="22" y="14" width="4" height="1" fill="#f1f5f9" opacity="0.7" />
          <rect x="6" y="18" width="3" height="1" fill="#f1f5f9" opacity="0.5" />
          <rect x="23" y="18" width="3" height="1" fill="#f1f5f9" opacity="0.5" />
        </>
      )}

      {/* Glitch bar - vertical */}
      {isHovered && frame % 3 === 0 && (
        <rect x="18" y="12" width="1" height="8" fill="#f1f5f9" opacity="0.4" />
      )}
    </svg>
  );
};

// 4. Security & Conflict — Shield with bullet ricochet on hover
const SecurityConflictIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => {
      setFrame(f => {
        if (f >= 12) return 0; // Reset after animation completes
        return f + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Bullet position - travels from top-right, hits shield, ricochets
  let bulletX = 28 - frame * 2;
  let bulletY = 4 + frame;

  // After impact (frame 6), ricochet
  if (frame > 6) {
    const ricochetFrame = frame - 6;
    bulletX = 18 + ricochetFrame * 2;
    bulletY = 14 - ricochetFrame;
  }

  // Spark at impact
  const showSpark = frame === 6 || frame === 7;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

      {/* Static reticle */}
      <rect x="15" y="8" width="1" height="3" fill="#f1f5f9" />
      <rect x="15" y="21" width="1" height="3" fill="#f1f5f9" />
      <rect x="8" y="15" width="3" height="1" fill="#f1f5f9" />
      <rect x="21" y="15" width="3" height="1" fill="#f1f5f9" />

      {/* Center dot */}
      <rect x="15" y="15" width="2" height="2" fill="#f1f5f9" />

      {/* Bullet - only animate on hover */}
      {isHovered && frame < 12 && (
        <>
          <rect x={Math.floor(bulletX)} y={Math.floor(bulletY)} width="2" height="1" fill="#f1f5f9" />
          {/* Bullet trail */}
          {frame < 6 && (
            <>
              <rect x={Math.floor(bulletX + 2)} y={Math.floor(bulletY - 0.5)} width="2" height="1" fill="#f1f5f9" opacity="0.6" />
              <rect x={Math.floor(bulletX + 4)} y={Math.floor(bulletY - 1)} width="2" height="1" fill="#f1f5f9" opacity="0.3" />
            </>
          )}
        </>
      )}

      {/* Impact spark */}
      {showSpark && (
        <>
          <rect x="17" y="13" width="1" height="1" fill="#f1f5f9" />
          <rect x="18" y="12" width="1" height="1" fill="#f1f5f9" />
          <rect x="16" y="12" width="1" height="1" fill="#f1f5f9" />
        </>
      )}
    </svg>
  );
};

// 5. Governance & Institutional — Gavel striking down on hover
const GovernanceInstitutionalIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => {
      setFrame(f => {
        if (f >= 8) return 0; // Reset after animation
        return f + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Gavel starts raised (frame 0-2), strikes down (3-5), impact (6-8)
  const gavelY = frame < 3 ? -4 + frame * 2 : frame < 5 ? 2 + (frame - 3) * 3 : 8;
  const gavelAngle = frame < 3 ? -30 : frame < 5 ? 0 : frame === 5 ? 5 : 0;
  const showImpact = frame >= 5;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Strike base */}
      <rect x="6" y="28" width="14" height="2" fill={color} />
      <rect x="8" y="26" width="10" height="2" fill={color} opacity="0.5" />

      {/* Gavel - strikes down on hover */}
      <g style={{ transform: `translate(0, ${gavelY}px) rotate(${gavelAngle}deg)`, transformOrigin: '21px 10px' }}>
        {/* Gavel handle */}
        <rect x="18" y="14" width="3" height="8" fill={color} transform="rotate(45 19.5 18)" />
        <rect x="19" y="15" width="1" height="6" fill="#1e293b" transform="rotate(45 19.5 18)" />

        {/* Gavel head */}
        <rect x="14" y="4" width="12" height="10" fill={color} transform="rotate(45 20 9)" />
        <rect x="15" y="5" width="10" height="8" fill="#1e293b" transform="rotate(45 20 9)" />

        {/* Crack pattern */}
        <rect x="16" y="6" width="2" height="1" fill="#f1f5f9" transform="rotate(45 20 9)" />
        <rect x="18" y="7" width="1" height="2" fill="#f1f5f9" transform="rotate(45 20 9)" />
      </g>

      {/* Impact particles - only on strike */}
      {showImpact && (
        <>
          <rect x="14" y="25" width="1" height="1" fill="#f1f5f9" opacity="0.8" />
          <rect x="16" y="25" width="1" height="1" fill="#f1f5f9" opacity="0.6" />
          <rect x="12" y="26" width="1" height="1" fill="#f1f5f9" opacity="0.5" />
          <rect x="18" y="26" width="1" height="1" fill="#f1f5f9" opacity="0.4" />
        </>
      )}
    </svg>
  );
};

// 6. Economic & Systemic — Scales tipping dramatically on hover
const EconomicSystemicIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => setFrame(f => (f + 1) % 20), 80);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Dramatic tipping: -15 to +15 degrees
  const tip = isHovered ? Math.sin(frame * 0.314) * 15 : -5;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base */}
      <rect x="12" y="29" width="8" height="2" fill={color} />
      <rect x="14" y="27" width="4" height="2" fill={color} />

      {/* Post */}
      <rect x="15" y="8" width="2" height="19" fill={color} />

      {/* Pivot */}
      <rect x="14" y="6" width="4" height="4" fill="#f1f5f9" />
      <rect x="15" y="7" width="2" height="2" fill="#1e293b" />

      {/* Beam - dramatic tipping */}
      <g style={{ transformOrigin: '16px 8px', transform: `rotate(${tip}deg)` }}>
        <rect x="4" y="7" width="24" height="2" fill={color} />

        {/* Left pan - heavy, with weight */}
        <rect x="5" y="9" width="1" height="8" fill={color} />
        <rect x="3" y="17" width="6" height="1" fill={color} />
        <rect x="4" y="16" width="4" height="1" fill={color} opacity="0.5" />
        {/* Heavy weight */}
        <rect x="4" y="18" width="4" height="4" fill={color} opacity="0.8" />
        <rect x="5" y="19" width="2" height="3" fill="#f1f5f9" />

        {/* Right pan - light, empty */}
        <rect x="26" y="9" width="1" height="4" fill={color} />
        <rect x="24" y="13" width="6" height="1" fill={color} />
        <rect x="25" y="12" width="4" height="1" fill={color} opacity="0.3" />
      </g>
    </svg>
  );
};

// 7. Human & Societal — Complete human figure that disintegrates on hover
const HumanSocietalIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => {
      setFrame(f => Math.min(f + 1, 10)); // 10 frames to fully disintegrate
    }, 150);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Opacity decreases as frame increases
  const bodyOpacity = isHovered ? Math.max(0, 1 - frame * 0.1) : 1;
  const fragmentOpacity = isHovered ? frame * 0.1 : 0;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Complete human figure - fades out */}
      <g opacity={bodyOpacity}>
        {/* Head */}
        <rect x="13" y="4" width="6" height="6" fill={color} />
        <rect x="14" y="5" width="4" height="4" fill="#1e293b" />

        {/* Body/torso */}
        <rect x="12" y="10" width="8" height="10" fill={color} />
        <rect x="13" y="11" width="6" height="8" fill="#1e293b" />

        {/* Left arm */}
        <rect x="6" y="12" width="6" height="2" fill={color} />
        <rect x="4" y="14" width="2" height="6" fill={color} />

        {/* Right arm */}
        <rect x="20" y="12" width="6" height="2" fill={color} />
        <rect x="24" y="14" width="2" height="6" fill={color} />

        {/* Left leg */}
        <rect x="11" y="20" width="4" height="8" fill={color} />
        <rect x="10" y="28" width="6" height="2" fill={color} />

        {/* Right leg */}
        <rect x="17" y="20" width="4" height="8" fill={color} />
        <rect x="16" y="28" width="6" height="2" fill={color} />
      </g>

      {/* Disintegration fragments - appear as body fades */}
      {isHovered && frame > 0 && (
        <g opacity={fragmentOpacity}>
          {/* Head fragments */}
          {frame >= 2 && <rect x="20" y="6" width="1" height="1" fill={color} />}
          {frame >= 3 && <rect x="22" y="5" width="1" height="1" fill={color} />}

          {/* Arm fragments */}
          {frame >= 4 && <rect x="26" y="14" width="1" height="1" fill={color} />}
          {frame >= 5 && <rect x="28" y="16" width="1" height="1" fill={color} />}

          {/* Body fragments */}
          {frame >= 5 && <rect x="22" y="15" width="1" height="1" fill={color} />}
          {frame >= 6 && <rect x="24" y="18" width="1" height="1" fill={color} />}

          {/* Leg fragments */}
          {frame >= 7 && <rect x="22" y="24" width="1" height="1" fill={color} />}
          {frame >= 8 && <rect x="24" y="27" width="1" height="1" fill={color} />}
          {frame >= 9 && <rect x="26" y="29" width="1" height="1" fill={color} />}

          {/* Floating dust */}
          {frame >= 6 && <rect x="28" y="8" width="1" height="1" fill={color} opacity="0.4" />}
          {frame >= 8 && <rect x="30" y="12" width="1" height="1" fill={color} opacity="0.3" />}
          {frame >= 10 && <rect x="29" y="20" width="1" height="1" fill={color} opacity="0.2" />}
        </g>
      )}
    </svg>
  );
};

// 8. Long-term / Existential — Clear hourglass with draining sand
const LongtermExistentialIcon: React.FC<IconProps> = ({ color = '#94a3b8', size = 32, className = '' }) => {
  const [frame, setFrame] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) { setFrame(0); return; }
    const interval = setInterval(() => {
      setFrame(f => Math.min(f + 1, 12)); // 12 frames to empty
    }, 200);
    return () => clearInterval(interval);
  }, [isHovered]);

  const sandRemaining = isHovered ? 8 - Math.floor(frame * 0.6) : 8;
  const pileHeight = isHovered ? Math.floor(frame * 0.4) : 0;

  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top frame/cap */}
      <rect x="8" y="2" width="16" height="2" fill={color} />
      <rect x="6" y="4" width="20" height="1" fill={color} />

      {/* Bottom frame/cap */}
      <rect x="8" y="28" width="16" height="2" fill={color} />
      <rect x="6" y="27" width="20" height="1" fill={color} />

      {/* Side supports */}
      <rect x="6" y="5" width="2" height="22" fill={color} />
      <rect x="24" y="5" width="2" height="22" fill={color} />

      {/* Glass bulbs - top */}
      <rect x="10" y="6" width="1" height="10" fill={color} opacity="0.5" />
      <rect x="21" y="6" width="1" height="10" fill={color} opacity="0.5" />
      <rect x="11" y="15" width="10" height="1" fill={color} />

      {/* Glass bulbs - bottom */}
      <rect x="10" y="17" width="1" height="9" fill={color} opacity="0.5" />
      <rect x="21" y="17" width="1" height="9" fill={color} opacity="0.5" />
      <rect x="11" y="25" width="10" height="1" fill={color} />

      {/* Neck connection */}
      <rect x="14" y="16" width="4" height="2" fill={color} />

      {/* Sand in top bulb - depletes on hover */}
      {sandRemaining > 0 && (
        <rect x="12" y={15 - sandRemaining} width="8" height={sandRemaining} fill="#f1f5f9" opacity="0.6" />
      )}

      {/* Sand stream - flows on hover */}
      {isHovered && frame < 12 && (
        <>
          <rect x="15" y="18" width="1" height="7" fill="#f1f5f9" />
          {frame % 2 === 0 && <rect x="16" y="19" width="1" height="5" fill="#f1f5f9" opacity="0.7" />}
        </>
      )}

      {/* Sand pile in bottom - grows on hover */}
      {pileHeight > 0 && (
        <>
          <rect x={13 - Math.floor(pileHeight / 3)} y={25 - pileHeight} width={6 + Math.floor(pileHeight / 2)} height={pileHeight} fill="#f1f5f9" opacity="0.6" />
          {/* Pile slopes */}
          {pileHeight >= 2 && <rect x="12" y="24" width="1" height="1" fill="#f1f5f9" opacity="0.5" />}
          {pileHeight >= 2 && <rect x="19" y="24" width="1" height="1" fill="#f1f5f9" opacity="0.5" />}
        </>
      )}

      {/* Falling grains */}
      {isHovered && frame % 3 === 0 && frame < 12 && (
        <rect x="14" y="22" width="1" height="1" fill="#f1f5f9" opacity="0.5" />
      )}
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
