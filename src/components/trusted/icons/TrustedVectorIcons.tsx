// SPDX-License-Identifier: MIT — Copyright (c) 2026 DyharL
// Product: Veritas (TrustedMac UI Suite)
// Security Standard: TR_SEC_SVG_SVR_ICONS
// Clean-Room Standard: 100% Vector SVG, Zero Third-Party Bitmaps, Signature Orange Ambré Palette (#ffb330, #fa870b, #761c01)

import React from 'react';

export interface TrustedIconProps {
  size?: number;
  className?: string;
  glow?: boolean;
  active?: boolean;
  onClick?: () => void;
}

// 1. SmartPulse: Cœur battant, orbe radiant & anneaux orbitaux
export function TrustedSmartPulseIcon({
  size = 64,
  className = '',
  glow = true,
  active = false,
  onClick,
}: TrustedIconProps) {
  const filterId = `glow-smartpulse-${size}`;
  const gradCoreId = `grad-core-${size}`;
  const gradRingId = `grad-ring-${size}`;
  const gradPlateId = `grad-plate-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation={glow ? 10 : 4} floodColor="#fa870b" floodOpacity={glow ? 0.45 : 0.2} />
        </filter>
        <linearGradient id={gradPlateId} x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a150c" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#140b07" stopOpacity="0.95" />
          <stop offset="1" stopColor="#080402" stopOpacity="1" />
        </linearGradient>
        <radialGradient id={gradCoreId} cx="50%" cy="45%" r="48%">
          <stop stopColor="#ffebad" stopOpacity="1" />
          <stop offset="0.25" stopColor="#ffb330" stopOpacity="1" />
          <stop offset="0.65" stopColor="#fa870b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#9e3605" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id={gradRingId} x1="20" y1="20" x2="108" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb330" />
          <stop offset="0.5" stopColor="#fa870b" stopOpacity="0.6" />
          <stop offset="1" stopColor="#761c01" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Squircle macOS Base */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill={`url(#${gradPlateId})`}
        stroke={active ? '#fa870b' : 'rgba(255, 179, 48, 0.25)'}
        strokeWidth={active ? 2.5 : 1.2}
        filter={`url(#${filterId})`}
      />

      {/* Reflet Spéculaire Supérieur */}
      <path
        d="M 12 36 C 12 22 22 12 36 12 L 92 12 C 106 12 116 22 116 36 L 116 48 C 96 38 48 38 12 48 Z"
        fill="white"
        fillOpacity="0.06"
      />

      {/* Anneau Orbital Concentrique 1 */}
      <circle cx="64" cy="64" r="40" stroke={`url(#${gradRingId})`} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

      {/* Anneau Orbital Concentrique 2 */}
      <circle cx="64" cy="64" r="28" stroke={`url(#${gradRingId})`} strokeWidth="1.2" opacity="0.8" />

      {/* Orbe Central Radiant */}
      <circle cx="64" cy="64" r="18" fill={`url(#${gradCoreId})`} />

      {/* Ligne ECG / Battement Cardiaque */}
      <path
        d="M 32 64 L 46 64 L 52 54 L 60 74 L 68 46 L 76 68 L 82 64 L 96 64"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="drop-shadow(0 0 4px #ffb330)"
      />

      {/* Éclats Photoniques Aux Sommets */}
      <circle cx="68" cy="46" r="2" fill="#ffffff" />
      <circle cx="60" cy="74" r="1.5" fill="#ffebad" />
    </svg>
  );
}

// 2. DeepClean: Caches système, disques 3D dépolis & faisceau de purge
export function TrustedDeepCleanIcon({
  size = 64,
  className = '',
  glow = true,
  active = false,
  onClick,
}: TrustedIconProps) {
  const filterId = `glow-deepclean-${size}`;
  const gradPlateId = `grad-dc-plate-${size}`;
  const gradDiskId = `grad-dc-disk-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation={glow ? 10 : 4} floodColor="#fa870b" floodOpacity={glow ? 0.45 : 0.2} />
        </filter>
        <linearGradient id={gradPlateId} x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#281308" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#140b07" stopOpacity="0.95" />
          <stop offset="1" stopColor="#080402" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={gradDiskId} x1="32" y1="36" x2="96" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb330" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#fa870b" stopOpacity="0.75" />
          <stop offset="1" stopColor="#761c01" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Squircle macOS Base */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill={`url(#${gradPlateId})`}
        stroke={active ? '#fa870b' : 'rgba(255, 179, 48, 0.25)'}
        strokeWidth={active ? 2.5 : 1.2}
        filter={`url(#${filterId})`}
      />

      {/* Disque Inférieur (Stack 3) */}
      <ellipse cx="64" cy="84" rx="34" ry="12" fill="#3b1706" stroke="#fa870b" strokeWidth="1.2" opacity="0.6" />

      {/* Disque Médian (Stack 2) */}
      <ellipse cx="64" cy="70" rx="34" ry="12" fill="#582109" stroke="#ffb330" strokeWidth="1.4" opacity="0.8" />

      {/* Disque Supérieur (Stack 1) */}
      <ellipse cx="64" cy="56" rx="34" ry="12" fill={`url(#${gradDiskId})`} stroke="#ffe199" strokeWidth="1.5" />

      {/* Fenêtre Laser Balayante de Nettoyage */}
      <path
        d="M 38 52 C 50 48 78 48 90 52 L 94 58 C 82 62 46 62 34 58 Z"
        fill="#ffffff"
        fillOpacity="0.4"
        filter="drop-shadow(0 0 6px #ffffff)"
      />

      {/* Particules Lumineuses de Purge */}
      <circle cx="88" cy="40" r="2.5" fill="#ffffff" filter="drop-shadow(0 0 3px #ffb330)" />
      <circle cx="94" cy="46" r="1.5" fill="#ffb330" />
      <circle cx="34" cy="44" r="2" fill="#ffb330" />
      <circle cx="42" cy="38" r="1.5" fill="#ffffff" />
    </svg>
  );
}

// 3. TrustedShield: Bouclier blindé facetté, cadenas cryptographique & aura sécurité
export function TrustedShieldIcon({
  size = 64,
  className = '',
  glow = true,
  active = false,
  onClick,
}: TrustedIconProps) {
  const filterId = `glow-shield-${size}`;
  const gradPlateId = `grad-sh-plate-${size}`;
  const gradShieldLId = `grad-sh-left-${size}`;
  const gradShieldRId = `grad-sh-right-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation={glow ? 10 : 4} floodColor="#fa870b" floodOpacity={glow ? 0.45 : 0.2} />
        </filter>
        <linearGradient id={gradPlateId} x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2a150c" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#140b07" stopOpacity="0.95" />
          <stop offset="1" stopColor="#080402" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={gradShieldLId} x1="32" y1="32" x2="64" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb330" />
          <stop offset="0.6" stopColor="#fa870b" />
          <stop offset="1" stopColor="#872304" />
        </linearGradient>
        <linearGradient id={gradShieldRId} x1="64" y1="32" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffa01c" />
          <stop offset="0.6" stopColor="#d15a00" />
          <stop offset="1" stopColor="#541201" />
        </linearGradient>
      </defs>

      {/* Squircle macOS Base */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill={`url(#${gradPlateId})`}
        stroke={active ? '#fa870b' : 'rgba(255, 179, 48, 0.25)'}
        strokeWidth={active ? 2.5 : 1.2}
        filter={`url(#${filterId})`}
      />

      {/* Aile Gauche du Bouclier (Facettée Lumineuse) */}
      <path
        d="M 64 30 L 36 42 C 36 68 46 88 64 98 L 64 30 Z"
        fill={`url(#${gradShieldLId})`}
        stroke="#ffe3a3"
        strokeWidth="1.2"
      />

      {/* Aile Droite du Bouclier (Facettée Ombrée) */}
      <path
        d="M 64 30 L 92 42 C 92 68 82 88 64 98 L 64 30 Z"
        fill={`url(#${gradShieldRId})`}
        stroke="#fa870b"
        strokeWidth="1.2"
      />

      {/* Cadenas Cryptographique Central */}
      <rect x="54" y="60" width="20" height="16" rx="4" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))" />
      <path d="M 58 60 L 58 54 C 58 50.7 60.7 48 64 48 C 67.3 48 70 50.7 70 54 L 70 60" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="64" cy="67" r="2" fill="#761c01" />
      <line x1="64" y1="69" x2="64" y2="72" stroke="#761c01" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 4. HyperTune: Turbine aérodynamique & propulsion haute vitesse
export function TrustedHyperTuneIcon({
  size = 64,
  className = '',
  glow = true,
  active = false,
  onClick,
}: TrustedIconProps) {
  const filterId = `glow-hypertune-${size}`;
  const gradPlateId = `grad-ht-plate-${size}`;
  const gradTurbineId = `grad-ht-turb-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation={glow ? 10 : 4} floodColor="#fa870b" floodOpacity={glow ? 0.45 : 0.2} />
        </filter>
        <linearGradient id={gradPlateId} x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#281308" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#140b07" stopOpacity="0.95" />
          <stop offset="1" stopColor="#080402" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={gradTurbineId} x1="32" y1="32" x2="96" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffebad" />
          <stop offset="0.4" stopColor="#ffb330" />
          <stop offset="0.8" stopColor="#fa870b" />
          <stop offset="1" stopColor="#681801" />
        </linearGradient>
      </defs>

      {/* Squircle macOS Base */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill={`url(#${gradPlateId})`}
        stroke={active ? '#fa870b' : 'rgba(255, 179, 48, 0.25)'}
        strokeWidth={active ? 2.5 : 1.2}
        filter={`url(#${filterId})`}
      />

      {/* Fusée / Ailette de Propulsion Aérodynamique */}
      <path
        d="M 64 28 C 76 42 84 64 84 82 L 64 74 L 44 82 C 44 64 52 42 64 28 Z"
        fill={`url(#${gradTurbineId})`}
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />

      {/* Cône Central de Turbine */}
      <circle cx="64" cy="62" r="10" fill="#2a1205" stroke="#ffb330" strokeWidth="2" />
      <circle cx="64" cy="62" r="4" fill="#ffffff" filter="drop-shadow(0 0 3px #ffb330)" />

      {/* Flammes de Plasma & Échappement */}
      <path
        d="M 52 82 L 64 100 L 76 82 L 68 86 L 64 80 L 60 86 Z"
        fill="#ffb330"
        filter="drop-shadow(0 0 8px #fa870b)"
      />

      {/* Lignes de Vitesse / Flux d'Air */}
      <line x1="28" y1="48" x2="28" y2="76" stroke="#fa870b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="100" y1="48" x2="100" y2="76" stroke="#fa870b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="36" y1="36" x2="36" y2="58" stroke="#ffb330" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="92" y1="36" x2="92" y2="58" stroke="#ffb330" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

// 5. AppPurge: Cube applicatif modulaire 3D & extracteur magnétique de résidus
export function TrustedAppPurgeIcon({
  size = 64,
  className = '',
  glow = true,
  active = false,
  onClick,
}: TrustedIconProps) {
  const filterId = `glow-apppurge-${size}`;
  const gradPlateId = `grad-ap-plate-${size}`;
  const gradCubeTopId = `grad-ap-top-${size}`;
  const gradCubeLId = `grad-ap-left-${size}`;
  const gradCubeRId = `grad-ap-right-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation={glow ? 10 : 4} floodColor="#fa870b" floodOpacity={glow ? 0.45 : 0.2} />
        </filter>
        <linearGradient id={gradPlateId} x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#281308" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#140b07" stopOpacity="0.95" />
          <stop offset="1" stopColor="#080402" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={gradCubeTopId} x1="40" y1="36" x2="88" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffebad" />
          <stop offset="1" stopColor="#ffb330" />
        </linearGradient>
        <linearGradient id={gradCubeLId} x1="36" y1="58" x2="64" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fa870b" />
          <stop offset="1" stopColor="#8c2805" />
        </linearGradient>
        <linearGradient id={gradCubeRId} x1="64" y1="58" x2="92" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d15a00" />
          <stop offset="1" stopColor="#4f1201" />
        </linearGradient>
      </defs>

      {/* Squircle macOS Base */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill={`url(#${gradPlateId})`}
        stroke={active ? '#fa870b' : 'rgba(255, 179, 48, 0.25)'}
        strokeWidth={active ? 2.5 : 1.2}
        filter={`url(#${filterId})`}
      />

      {/* Face Supérieure du Cube Isométrique */}
      <polygon points="64,36 90,48 64,60 38,48" fill={`url(#${gradCubeTopId})`} stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" />

      {/* Face Gauche du Cube */}
      <polygon points="38,48 64,60 64,88 38,76" fill={`url(#${gradCubeLId})`} stroke="#ffb330" strokeWidth="1" strokeOpacity="0.5" />

      {/* Face Droite du Cube */}
      <polygon points="64,60 90,48 90,76 64,88" fill={`url(#${gradCubeRId})`} stroke="#fa870b" strokeWidth="1" strokeOpacity="0.5" />

      {/* Élément Flottant Détaché (Résidu Extrait) */}
      <polygon points="88,30 100,36 88,42 76,36" fill="#ffffff" filter="drop-shadow(0 0 6px #ffb330)" />
      <polygon points="76,36 88,42 88,52 76,46" fill="#ffb330" />
      <polygon points="88,42 100,36 100,46 88,52" fill="#fa870b" />
    </svg>
  );
}

// 6. StorageRadar: Scope radar circulaire, balayage & constellation de sphères
export function TrustedStorageRadarIcon({
  size = 64,
  className = '',
  glow = true,
  active = false,
  onClick,
}: TrustedIconProps) {
  const filterId = `glow-storageradar-${size}`;
  const gradPlateId = `grad-sr-plate-${size}`;
  const gradBeamId = `grad-sr-beam-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
      onClick={onClick}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation={glow ? 10 : 4} floodColor="#fa870b" floodOpacity={glow ? 0.45 : 0.2} />
        </filter>
        <linearGradient id={gradPlateId} x1="16" y1="16" x2="112" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#281308" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#140b07" stopOpacity="0.95" />
          <stop offset="1" stopColor="#080402" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={gradBeamId} x1="64" y1="64" x2="98" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="0.4" stopColor="#ffb330" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fa870b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle macOS Base */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="28"
        fill={`url(#${gradPlateId})`}
        stroke={active ? '#fa870b' : 'rgba(255, 179, 48, 0.25)'}
        strokeWidth={active ? 2.5 : 1.2}
        filter={`url(#${filterId})`}
      />

      {/* Grille Réticule Radar */}
      <circle cx="64" cy="64" r="42" stroke="#fa870b" strokeWidth="1" opacity="0.4" />
      <circle cx="64" cy="64" r="28" stroke="#fa870b" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
      <circle cx="64" cy="64" r="14" stroke="#ffb330" strokeWidth="1.2" opacity="0.8" />
      <line x1="64" y1="22" x2="64" y2="106" stroke="#fa870b" strokeWidth="0.8" opacity="0.3" />
      <line x1="22" y1="64" x2="106" y2="64" stroke="#fa870b" strokeWidth="0.8" opacity="0.3" />

      {/* Faisceau Radar Rotatif */}
      <path d="M 64 64 L 98 34 A 42 42 0 0 1 106 64 Z" fill={`url(#${gradBeamId})`} />

      {/* Constellation de Bulles (Gros Dossiers Détectés) */}
      <circle cx="78" cy="48" r="7" fill="#ffebad" filter="drop-shadow(0 0 5px #fa870b)" />
      <circle cx="48" cy="76" r="11" fill="#ffb330" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1" />
      <circle cx="82" cy="80" r="5" fill="#fa870b" />
      <circle cx="46" cy="46" r="4" fill="#ffb330" opacity="0.7" />

      {/* Centreur Radar */}
      <circle cx="64" cy="64" r="3" fill="#ffffff" />
    </svg>
  );
}
