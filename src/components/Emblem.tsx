/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export const Emblem: React.FC<EmblemProps> = ({
  className = '',
  size = 36,
  showBadge = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm select-none"
      >
        {/* Rounded square container */}
        <rect width="100" height="100" rx="22" fill="#07192F" />

        {/* Outer Hexagon */}
        <path
          d="M50 14L81.1769 32V68L50 86L18.8231 68V32L50 14Z"
          stroke="#408BFA"
          strokeWidth="6.5"
          strokeLinejoin="round"
        />

        {/* Radial Spokes connecting to center */}
        <line x1="50" y1="50" x2="50" y2="28" stroke="#87B6FF" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="50" y2="72" stroke="#87B6FF" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="69" y2="39" stroke="#87B6FF" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="69" y2="61" stroke="#87B6FF" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="31" y2="39" stroke="#87B6FF" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="50" y1="50" x2="31" y2="61" stroke="#87B6FF" strokeWidth="4.5" strokeLinecap="round" />

        {/* Center Node */}
        <circle cx="50" cy="50" r="14" fill="#24A0ED" />

        {/* 6 Peripheral Nodes */}
        <circle cx="50" cy="27" r="6" fill="#FFFFFF" />
        <circle cx="69" cy="38" r="6" fill="#FFFFFF" />
        <circle cx="69" cy="62" r="6" fill="#FFFFFF" />
        <circle cx="50" cy="73" r="6" fill="#FFFFFF" />
        <circle cx="31" cy="62" r="6" fill="#FFFFFF" />
        <circle cx="31" cy="38" r="6" fill="#FFFFFF" />
      </svg>

      {showBadge && (
        <span
          className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border border-[#07192F] flex items-center justify-center shadow-xs"
          style={{ width: size * 0.38, height: size * 0.38 }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
};
