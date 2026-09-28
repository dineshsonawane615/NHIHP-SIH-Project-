/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface OfficerAvatarProps {
  className?: string;
  size?: number;
  showStatus?: boolean;
}

export const OfficerAvatar: React.FC<OfficerAvatarProps> = ({
  className = '',
  size = 40,
  showStatus = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // We can provide a clean SVG portrait representing the Indian woman senior executive from Image 1:
  // dark navy blazer, white collared shirt, neat hair, warm skin tone, subtle bindi.
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden border border-slate-300 bg-slate-100 ${className}`}
      style={{ width: size, height: size }}
    >
      {!imgError ? (
        <svg
          viewBox="0 0 120 120"
          width={size}
          height={size}
          className="w-full h-full object-cover"
        >
          {/* Neutral studio background */}
          <rect width="120" height="120" fill="#CBD5E1" />

          {/* Shoulders / Dark Navy Blazer */}
          <path
            d="M8 120C12 96 30 84 45 80L54 96L60 98L66 96L75 80C90 84 108 96 112 120Z"
            fill="#0B1E3B"
          />

          {/* White collared shirt */}
          <path d="M46 80L60 102L74 80L66 74L60 76L54 74Z" fill="#FFFFFF" />
          <path d="M44 80L56 74L54 92Z" fill="#F1F5F9" />
          <path d="M76 80L64 74L66 92Z" fill="#E2E8F0" />

          {/* Gold necklace glint */}
          <path d="M54 84Q60 88 66 84" stroke="#D97706" strokeWidth="1.5" fill="none" />

          {/* Gov Lapel Emblem badge */}
          <circle cx="78" cy="98" r="3" fill="#D97706" />

          {/* Neck */}
          <path d="M52 64H68V78H52Z" fill="#D49B74" />

          {/* Face */}
          <ellipse cx="60" cy="52" rx="22" ry="25" fill="#E5A882" />

          {/* Hair back */}
          <ellipse cx="60" cy="46" rx="28" ry="29" fill="#1C1917" />
          <path
            d="M32 52C32 30 44 20 60 20C76 20 88 30 88 52C88 62 84 72 84 72C84 72 74 62 74 52C74 44 70 38 60 38C50 38 46 44 46 52C46 62 36 72 36 72C36 72 32 62 32 52Z"
            fill="#1C1917"
          />

          {/* Eyes */}
          <ellipse cx="50" cy="50" rx="3.5" ry="2" fill="#1C1917" />
          <ellipse cx="70" cy="50" rx="3.5" ry="2" fill="#1C1917" />
          <circle cx="50.5" cy="49.5" r="1" fill="#FFFFFF" />
          <circle cx="70.5" cy="49.5" r="1" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M45 45Q50 43 55 45" stroke="#1C1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M65 45Q70 43 75 45" stroke="#1C1917" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Small Bindi */}
          <circle cx="60" cy="44" r="1.5" fill="#1E293B" />

          {/* Nose */}
          <path d="M58 50L58 58L62 58" stroke="#C2825C" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Smile */}
          <path d="M52 64Q60 70 68 64" stroke="#9A3412" strokeWidth="2" fill="#FFFFFF" strokeLinecap="round" />

          {/* Small Gold Earrings */}
          <circle cx="37" cy="54" r="2.2" fill="#F59E0B" />
          <circle cx="83" cy="54" r="2.2" fill="#F59E0B" />
        </svg>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#07192F] text-white font-bold text-xs">
          RS
        </div>
      )}

      {showStatus && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};
