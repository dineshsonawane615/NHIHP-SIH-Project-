/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SpecimenGraphicProps {
  type: 'pipe-a' | 'pipe-b' | 'pipes-stock' | 'valve' | 'bolts';
  label?: string;
  className?: string;
}

export const SpecimenGraphic: React.FC<SpecimenGraphicProps> = ({
  type,
  label,
  className = '',
}) => {
  if (type === 'pipe-a') {
    return (
      <div
        className={`relative overflow-hidden rounded-md bg-gradient-to-br from-slate-900 via-neutral-900 to-stone-900 border border-slate-700/60 shadow-inner flex flex-col justify-end p-2.5 min-h-[96px] ${className}`}
      >
        {/* Steel pipe visual with white stencil */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="absolute inset-x-0 top-3 flex flex-col gap-1.5 px-3">
          <div className="h-6 w-full bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 rounded-xs border-y border-neutral-500/50 flex items-center px-2">
            <span className="font-mono text-[9px] text-slate-200 tracking-wider font-semibold opacity-90">
              ASTM A106-B // 100NB SCH 40 // SMLS // HEAT NO. 692854 // IOCL BARAUNI
            </span>
          </div>
          <div className="h-5 w-4/5 bg-gradient-to-r from-neutral-700 via-neutral-500 to-neutral-700 rounded-xs border-y border-neutral-400/40 flex items-center px-2">
            <span className="font-mono text-[8px] text-slate-300 tracking-widest opacity-75">
              150 PSI WOG • HYDRO TEST 1500 PSI • REV-4
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-wider text-white bg-black/75 px-1.5 py-0.5 rounded-xs border border-white/10 uppercase">
            {label || 'IOCL SPECIMEN A'}
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-1 rounded-xs border border-emerald-500/30">
            MET-INSPECTED
          </span>
        </div>
      </div>
    );
  }

  if (type === 'pipe-b') {
    return (
      <div
        className={`relative overflow-hidden rounded-md bg-gradient-to-br from-stone-950 via-zinc-900 to-neutral-900 border border-slate-700/60 shadow-inner flex flex-col justify-end p-2.5 min-h-[96px] ${className}`}
      >
        {/* Steel pipe with yellow stencil */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:14px_14px]" />
        <div className="absolute inset-x-0 top-3 flex flex-col gap-1.5 px-3">
          <div className="h-6 w-full bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 rounded-xs border-y border-zinc-400/50 flex items-center px-2">
            <span className="font-mono text-[9px] text-amber-300 tracking-wider font-bold">
              ASTM A106-B // 4" SCH 40 // SEAMLESS // HEAT NO. 523451 // NTPC SINGRAULI
            </span>
          </div>
          <div className="h-5 w-3/4 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 rounded-xs border-y border-zinc-400/40 flex items-center px-2">
            <span className="font-mono text-[8px] text-amber-200 tracking-widest opacity-85">
              CLASS 600 HEAVY WALL // 600 PSI
            </span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-wider text-amber-300 bg-black/80 px-1.5 py-0.5 rounded-xs border border-amber-400/20 uppercase">
            {label || 'NTPC SPECIMEN B'}
          </span>
          <span className="text-[9px] font-mono text-red-400 bg-red-950/80 px-1 rounded-xs border border-red-500/30">
            600# MISMATCH
          </span>
        </div>
      </div>
    );
  }

  if (type === 'pipes-stock') {
    return (
      <div
        className={`relative overflow-hidden rounded-md bg-gradient-to-b from-slate-900 via-slate-800 to-zinc-900 border border-slate-700 p-2 min-h-[84px] flex flex-col justify-end ${className}`}
      >
        {/* End circular pipes cluster rendering */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-60">
          <div className="w-12 h-12 rounded-full border-4 border-slate-400 bg-slate-800 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-500" />
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-400 bg-slate-800 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-500" />
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-400 bg-slate-800 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-500" />
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur-xs px-2 py-1 rounded-xs">
          <span className="text-[10px] font-mono text-white font-semibold">
            Certified Engineering Specification
          </span>
          <span className="text-[9px] font-mono text-cyan-300">REV-4 2024</span>
        </div>
      </div>
    );
  }

  if (type === 'valve') {
    return (
      <div
        className={`relative overflow-hidden rounded-md bg-gradient-to-br from-blue-950 via-slate-900 to-zinc-900 border border-slate-700 p-2 flex items-center justify-center ${className}`}
      >
        <svg viewBox="0 0 60 60" className="w-10 h-10 text-blue-400" fill="none">
          <circle cx="30" cy="14" r="8" stroke="#60A5FA" strokeWidth="2.5" />
          <line x1="30" y1="14" x2="30" y2="34" stroke="#93C5FD" strokeWidth="3" />
          <path d="M12 44L30 36L48 44V32L30 40L12 32V44Z" fill="#3B82F6" opacity="0.6" stroke="#60A5FA" strokeWidth="1.5" />
          <rect x="8" y="34" width="4" height="12" fill="#93C5FD" />
          <rect x="48" y="34" width="4" height="12" fill="#93C5FD" />
        </svg>
      </div>
    );
  }

  // default bolts
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-gradient-to-br from-zinc-900 via-slate-900 to-stone-950 border border-slate-700 p-2 flex items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 60 60" className="w-10 h-10 text-amber-400" fill="none">
        <rect x="18" y="10" width="24" height="40" rx="3" fill="#334155" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="18" y1="20" x2="42" y2="20" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="18" y1="26" x2="42" y2="26" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="18" y1="32" x2="42" y2="32" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="18" y1="38" x2="42" y2="38" stroke="#CBD5E1" strokeWidth="1.5" />
        <polygon points="14,14 46,14 42,6 18,6" fill="#F59E0B" opacity="0.8" />
        <polygon points="14,46 46,46 42,54 18,54" fill="#F59E0B" opacity="0.8" />
      </svg>
    </div>
  );
};
