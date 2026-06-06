"use client";

import React from "react";

interface AnimatedQuizIllustrationProps {
  category: string;
  className?: string;
}

export function AnimatedQuizIllustration({
  category,
  className,
}: AnimatedQuizIllustrationProps) {
  // Normalize category key
  const catKey = category.toLowerCase().trim();

  // Theme configuration based on category
  let primaryColor = "#6366f1"; // Indigo
  let secondaryColor = "#ec4899"; // Pink
  let glowColor = "rgba(99, 102, 241, 0.4)";
  let categoryIcon = null;
  let floatingElements = null;

  switch (catKey) {
    case "science":
      primaryColor = "#06b6d4"; // Cyan
      secondaryColor = "#a855f7"; // Purple
      glowColor = "rgba(6, 182, 212, 0.4)";
      // Atom central illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2" fill="none">
          <ellipse cx="200" cy="200" rx="65" ry="22" transform="rotate(30 200 200)" />
          <ellipse cx="200" cy="200" rx="65" ry="22" transform="rotate(90 200 200)" />
          <ellipse cx="200" cy="200" rx="65" ry="22" transform="rotate(150 200 200)" />
          <circle cx="200" cy="200" r="12" fill={primaryColor} className="animate-pulse-core" style={{ filter: `drop-shadow(0 0 8px ${primaryColor})` }} />
          {/* Electrons */}
          <circle cx="256" cy="232" r="5" fill={secondaryColor} />
          <circle cx="200" cy="265" r="5" fill={secondaryColor} />
          <circle cx="144" cy="168" r="5" fill={secondaryColor} />
        </g>
      );
      // Floating chemical/physical symbols
      floatingElements = (
        <>
          {/* Flask icon */}
          <g className="animate-float" stroke={primaryColor} strokeWidth="1.5" fill="none" transform="translate(80, 80) scale(0.8)">
            <path d="M10 5h10M12 5v6L5 25h20L18 11V5z" />
          </g>
          {/* DNA helix double segment */}
          <g className="animate-float-delayed" stroke={secondaryColor} strokeWidth="1.5" fill="none" transform="translate(290, 90) scale(0.9)">
            <path d="M5 5c5 5 10 5 15 0M5 15c5-5 10-5 15 0" />
            <path d="M5 5v10M12 8v4M20 5v10" strokeDasharray="2 2" />
          </g>
          {/* Light star */}
          <path d="M300 280l4 4-4 4 4-4z" fill={primaryColor} className="animate-pulse-glow" />
          <path d="M90 290l3 3-3 3 3-3z" fill={secondaryColor} className="animate-pulse-glow" />
        </>
      );
      break;

    case "technology":
      primaryColor = "#3b82f6"; // Blue
      secondaryColor = "#10b981"; // Emerald
      glowColor = "rgba(59, 130, 246, 0.4)";
      // CPU Chip center illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="165" y="165" width="70" height="70" rx="8" className="animate-pulse-core" style={{ filter: `drop-shadow(0 0 10px ${primaryColor}66)` }} />
          <rect x="182" y="182" width="36" height="36" rx="4" fill={`${primaryColor}15`} />
          {/* Chip pins */}
          <path d="M185 165v-10M200 165v-10M215 165v-10" />
          <path d="M185 235v10M200 235v10M215 235v10" />
          <path d="M165 185h-10M165 200h-10M165 215h-10" />
          <path d="M235 185h10M235 200h10M235 215h10" />
        </g>
      );
      // Coding elements and binary
      floatingElements = (
        <>
          {/* Angle brackets < > */}
          <g className="animate-float" stroke={secondaryColor} strokeWidth="1.8" fill="none" strokeLinecap="round" transform="translate(75, 95) scale(0.9)">
            <path d="M10 5L3 12l7 7M20 5l7 7-7 7" />
          </g>
          {/* Binary bits */}
          <text x="300" y="100" fill={primaryColor} fontSize="14" fontWeight="bold" className="animate-float-delayed font-mono opacity-80">1</text>
          <text x="290" y="270" fill={secondaryColor} fontSize="14" fontWeight="bold" className="animate-float font-mono opacity-70">0</text>
          <text x="90" y="280" fill={primaryColor} fontSize="14" fontWeight="bold" className="animate-float-delayed font-mono opacity-60">1</text>
        </>
      );
      break;

    case "history":
      primaryColor = "#d97706"; // Amber
      secondaryColor = "#ea580c"; // Orange
      glowColor = "rgba(217, 119, 6, 0.4)";
      // Hourglass central illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M168 150h64M168 250h64" />
          <path d="M170 150c0 40 24 45 28 50 4 5 4 5 0 10-4 5-28 10-28 50" />
          <path d="M230 150c0 40-24 45-30 50-4 5-4 5 0 10 6 5 30 10 30 50" />
          {/* Sand particles falling & accumulating */}
          <path d="M180 162h40l-20 25z" fill={`${secondaryColor}25`} />
          <path d="M190 240h20l-10-15z" fill={secondaryColor} />
          <line x1="200" y1="187" x2="200" y2="235" strokeDasharray="3 4" stroke={secondaryColor} className="animate-pulse-core" />
        </g>
      );
      floatingElements = (
        <>
          {/* Scroll scroll icon */}
          <g className="animate-float" stroke={primaryColor} strokeWidth="1.5" fill="none" transform="translate(70, 85) scale(0.85)">
            <path d="M8 5h14a3 3 0 013 3v12a3 3 0 01-3 3H8a3 3 0 01-3-3V8a3 3 0 013-3z" />
            <path d="M5 9h20M5 17h20" />
          </g>
          {/* Roman numeral / star */}
          <text x="300" y="105" fill={secondaryColor} fontSize="13" fontWeight="bold" className="animate-float-delayed font-serif opacity-75">IV</text>
          <text x="290" y="280" fill={primaryColor} fontSize="13" fontWeight="bold" className="animate-float font-serif opacity-80">XII</text>
          <circle cx="95" cy="275" r="4" fill={secondaryColor} className="animate-pulse-glow" />
        </>
      );
      break;

    case "geography":
      primaryColor = "#10b981"; // Emerald
      secondaryColor = "#0284c7"; // Sky Blue
      glowColor = "rgba(16, 185, 129, 0.4)";
      // Globe central illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2.5" fill="none">
          <circle cx="200" cy="200" r="45" className="animate-pulse-core" style={{ filter: `drop-shadow(0 0 12px ${primaryColor}44)` }} />
          <ellipse cx="200" cy="200" rx="45" ry="16" />
          <ellipse cx="200" cy="200" rx="16" ry="45" />
          <line x1="200" y1="155" x2="200" y2="245" />
          <line x1="155" y1="200" x2="245" y2="200" />
        </g>
      );
      floatingElements = (
        <>
          {/* Compass Rose star */}
          <g className="animate-float" stroke={secondaryColor} strokeWidth="1.8" fill="none" transform="translate(80, 80) scale(0.9)">
            <path d="M12 2v20M2 12h20M12 2l3 7h-6zM12 22l3-7h-6z" />
          </g>
          {/* Map pin */}
          <g className="animate-float-delayed" stroke={primaryColor} strokeWidth="1.8" fill="none" transform="translate(295, 90) scale(0.8)">
            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
            <circle cx="12" cy="9" r="3" fill={primaryColor} />
          </g>
          <path d="M285 270l4 4-4 4 4-4z" fill={secondaryColor} className="animate-pulse-glow" />
          <path d="M100 280l3 3-3 3 3-3z" fill={primaryColor} className="animate-pulse-glow" />
        </>
      );
      break;

    case "sports":
      primaryColor = "#f97316"; // Orange
      secondaryColor = "#eab308"; // Yellow
      glowColor = "rgba(249, 115, 22, 0.4)";
      // Trophy central illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M172 155h56v34c0 16-12 28-28 28s-28-12-28-28v-34z" fill={`${primaryColor}10`} className="animate-pulse-core" />
          <path d="M200 217v20M178 237h44" />
          <path d="M172 165h-12c-8 0-10 12 0 12h12M228 165h12c8 0 10 12 0 12h-12" />
          <polygon points="200,165 204,175 215,175 207,181 210,192 200,186 190,192 193,181 185,175 196,175" fill={secondaryColor} stroke={secondaryColor} strokeWidth="1" transform="scale(0.8) translate(50, 42)" />
        </g>
      );
      floatingElements = (
        <>
          {/* Whistle or Crown */}
          <g className="animate-float" stroke={secondaryColor} strokeWidth="1.8" fill="none" transform="translate(70, 85) scale(0.8)">
            <path d="M5 12h14l3-5-5 2-5-5-5 5-5-2z" />
          </g>
          {/* Star badge */}
          <g className="animate-float-delayed" stroke={primaryColor} strokeWidth="1.5" fill="none" transform="translate(290, 95) scale(0.9)">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7l1.5 3h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" fill={`${primaryColor}33`} />
          </g>
          <circle cx="95" cy="280" r="4" fill={primaryColor} className="animate-pulse-glow" />
          <circle cx="285" cy="265" r="4" fill={secondaryColor} className="animate-pulse-glow" />
        </>
      );
      break;

    case "entertainment":
      primaryColor = "#ec4899"; // Pink
      secondaryColor = "#818cf8"; // Indigo
      glowColor = "rgba(236, 72, 153, 0.4)";
      // Music Notes central illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M185 220V155l45-12v65" className="animate-pulse-core" />
          <circle cx="171" cy="221" r="14" fill={primaryColor} />
          <circle cx="216" cy="208" r="14" fill={primaryColor} />
          <path d="M185 175l45-12" stroke={secondaryColor} strokeWidth="2" />
        </g>
      );
      floatingElements = (
        <>
          {/* Star symbol */}
          <g className="animate-float" stroke={secondaryColor} strokeWidth="1.8" fill="none" transform="translate(80, 80) scale(0.9)">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </g>
          {/* Film reel outline */}
          <g className="animate-float-delayed" stroke={primaryColor} strokeWidth="1.8" fill="none" transform="translate(290, 90) scale(0.85)">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v20M2 12h20" strokeDasharray="2 2" />
          </g>
          <path d="M285 270l4 4-4 4 4-4z" fill={secondaryColor} className="animate-pulse-glow" />
          <path d="M100 275l3 3-3 3 3-3z" fill={primaryColor} className="animate-pulse-glow" />
        </>
      );
      break;

    default: // general / other
      primaryColor = "#8b5cf6"; // Violet
      secondaryColor = "#ec4899"; // Pink
      glowColor = "rgba(139, 92, 246, 0.4)";
      // Brain or Glowing Lightbulb center illustration
      categoryIcon = (
        <g stroke={primaryColor} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M180 222c-10-10-15-22-15-35 0-25 20-45 45-45s45 20 45 45c0 13-5 25-15 35v15h-60v-15z" className="animate-pulse-core" style={{ filter: `drop-shadow(0 0 10px ${primaryColor}44)` }} />
          <path d="M185 237h30M190 247h20" fill={`${secondaryColor}33`} />
          <path d="M195 195l5-15h10l5 15" stroke={secondaryColor} />
          {/* Glow waves */}
          <path d="M145 170a40 40 0 000 34M255 170a40 40 0 010 34" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
      );
      // Floating question marks and sparkles
      floatingElements = (
        <>
          <g className="animate-float" fill={secondaryColor} transform="translate(75, 80) scale(0.95)">
            <text x="0" y="20" fontSize="22" fontWeight="bold" fontFamily="sans-serif">?</text>
          </g>
          <g className="animate-float-delayed" fill={primaryColor} transform="translate(295, 95) scale(0.95)">
            <text x="0" y="20" fontSize="20" fontWeight="bold" fontFamily="sans-serif">?</text>
          </g>
          <path d="M280 260l4 4-4 4 4-4z" fill={secondaryColor} className="animate-pulse-glow" />
          <path d="M100 270l3 3-3 3 3-3z" fill={primaryColor} className="animate-pulse-glow" />
        </>
      );
      break;
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Dynamic inline stylesheets for pure SVG animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.1); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-y-delayed {
          0%, 100% { transform: translateY(-4px); }
          50% { transform: translateY(4px); }
        }
        @keyframes pulse-core {
          0%, 100% { filter: drop-shadow(0 0 8px ${glowColor}) opacity(0.85); }
          50% { filter: drop-shadow(0 0 20px ${glowColor}) opacity(1); }
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-spin-cw {
          transform-origin: 200px 200px;
          animation: spin-cw 32s linear infinite;
        }
        .animate-spin-ccw {
          transform-origin: 200px 200px;
          animation: spin-ccw 22s linear infinite;
        }
        .animate-pulse-glow {
          transform-origin: center;
          animation: pulse-glow 3.5s ease-in-out infinite;
        }
        .animate-pulse-core {
          transform-origin: 200px 200px;
          animation: pulse-core 2.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float-y 4.5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-y-delayed 5.5s ease-in-out infinite;
        }
        .animate-dash {
          stroke-dasharray: 6 5;
          animation: dash 2.5s linear infinite;
        }
      `}} />

      {/* Background Radial Glow Blob in Sync with Category Colors */}
      <div
        className="absolute inset-0 m-auto size-52 rounded-full blur-3xl opacity-25 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      />

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 w-full h-auto max-w-[280px] md:max-w-[340px] select-none"
      >
        <defs>
          {/* Main Gradient for rings */}
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.1" />
          </linearGradient>
          {/* Inner core radial gradient glow */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
            <stop offset="70%" stopColor={secondaryColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient background glows */}
        <circle cx="200" cy="200" r="120" fill="url(#coreGlow)" className="animate-pulse-glow" />

        {/* --- Orbiting System Outer Ring --- */}
        <circle
          cx="200"
          cy="200"
          r="160"
          stroke="url(#mainGradient)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 8"
          className="animate-spin-cw"
        />

        {/* --- Middle Ring with Dash Dash offset animation --- */}
        <circle
          cx="200"
          cy="200"
          r="135"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.4"
          className="animate-dash animate-spin-ccw"
        />

        {/* --- Inner Concentric Ring with Orbiting Node Guides --- */}
        <circle
          cx="200"
          cy="200"
          r="105"
          stroke={secondaryColor}
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.3"
        />
        {/* Nodes locked on the inner ring, rotates */}
        <g className="animate-spin-cw">
          <circle cx="200" cy="95" r="4.5" fill={primaryColor} />
          <line x1="200" y1="95" x2="200" y2="200" stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.15" />
          
          <circle cx="291" cy="252" r="3.5" fill={secondaryColor} />
          <line x1="291" y1="252" x2="200" y2="200" stroke={secondaryColor} strokeWidth="0.5" strokeOpacity="0.15" />
          
          <circle cx="109" cy="252" r="3.5" fill={primaryColor} />
          <line x1="109" y1="252" x2="200" y2="200" stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.15" />
        </g>

        {/* --- Center Power Core Halo --- */}
        <circle
          cx="200"
          cy="200"
          r="60"
          fill="none"
          stroke={`url(#mainGradient)`}
          strokeWidth="1.5"
          strokeDasharray="15 5"
          className="animate-spin-ccw"
        />

        {/* --- Primary Center Icon --- */}
        {categoryIcon}

        {/* --- Floating Objects & Particle Field --- */}
        {floatingElements}
      </svg>
    </div>
  );
}
