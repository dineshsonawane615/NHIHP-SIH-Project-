/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Smartphone, Monitor, ShieldCheck, X } from 'lucide-react';
import { Emblem } from './Emblem';
import { OfficerAvatar } from './OfficerAvatar';
import { OfficerProfile } from '../types/material';

interface HeaderProps {
  currentRole: string;
  selectedCpse: string;
  activeView: string;
  onNavigate: (view: string) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  officer: OfficerProfile;
  pendingConflictsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  selectedCpse,
  activeView,
  onNavigate,
  isMobileFrame,
  onToggleFrame,
  officer,
  pendingConflictsCount,
}) => {
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  return (
    <header className="w-full shrink-0 select-none z-30">
      {/* Primary Executive Navy Bar (#07192F or #0B2545) */}
      <div className="w-full bg-[#07192F] text-white px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-[#1D4ED8]/60 shadow-xs">
        {/* Brand Zone */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-hidden"
        >
          <Emblem size={34} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl leading-tight tracking-wide text-white group-hover:text-blue-300 transition-colors">
                MATRA
              </span>
              <span className="text-sm sm:text-base text-blue-100 font-semibold tracking-wide hidden md:inline">
                — Material Alignment & Reconciliation Assistant
              </span>
            </div>
            <span className="text-xs text-blue-200 font-medium tracking-tight md:hidden">
              Material Alignment & Reconciliation Assistant
            </span>
          </div>
        </button>

        {/* Action Controls & Officer Profile Lockup */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Handheld / Workstation Mode toggle small icon */}
          <button
            onClick={onToggleFrame}
            title={isMobileFrame ? 'Switch to Desktop Workstation Mode' : 'Switch to Handheld Mobile Mode'}
            className={`p-1.5 rounded-full hover:bg-white/10 text-slate-200 transition-colors cursor-pointer flex items-center justify-center border ${
              isMobileFrame ? 'bg-blue-600/40 text-blue-300 border-blue-400/50' : 'border-transparent text-slate-300 hover:text-white'
            }`}
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-blue-300" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* Notifications button with badge */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-200 transition-colors relative cursor-pointer"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingConflictsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#07192F] animate-pulse">
                  {pendingConflictsCount}
                </span>
              )}
            </button>

            {/* Quick Notification Dropdown */}
            {showNotificationDrawer && (
              <div className="absolute right-0 top-10 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Governance Alerts ({pendingConflictsCount})
                  </span>
                  <button
                    onClick={() => setShowNotificationDrawer(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="py-2 space-y-2">
                  <div
                    onClick={() => {
                      onNavigate('ai-review');
                      setShowNotificationDrawer(false);
                    }}
                    className="p-2 rounded bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100/80 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                      <span>Critical Conflict Flagged</span>
                      <span className="text-[9px] font-mono text-amber-700">14:02 IST</span>
                    </div>
                    <p className="text-[10px] text-amber-800 mt-0.5 leading-snug">
                      IOCL ↔ NTPC Pipe 150 PSI vs 600 PSI mismatch requires immediate data steward review.
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      onNavigate('registry');
                      setShowNotificationDrawer(false);
                    }}
                    className="p-2 rounded bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100/80 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                      <span>NMC Ratified</span>
                      <span className="text-[9px] font-mono text-blue-700">11:34 IST</span>
                    </div>
                    <p className="text-[10px] text-blue-800 mt-0.5 leading-snug">
                      NMC-BOLT-00001 published to National Golden Master with 5 CPSEs enrolled.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('ai-review');
                    setShowNotificationDrawer(false);
                  }}
                  className="w-full text-center py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 block border-t border-slate-100 mt-1"
                >
                  Open Governance Queue →
                </button>
              </div>
            )}
          </div>

          {/* Officer Avatar & Profile trigger */}
          <button
            onClick={() => onNavigate(activeView === 'profile' ? 'dashboard' : 'profile')}
            className={`flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer border ${
              activeView === 'profile' ? 'border-blue-400 bg-white/10' : 'border-transparent'
            }`}
            title="View Officer Profile & Account Settings"
          >
            <OfficerAvatar size={28} showStatus />
          </button>
        </div>
      </div>

      {/* Sub-bar / Context State Strip */}
      <div className="w-full bg-[#051122] text-slate-300 px-3 py-1.5 flex items-center justify-between text-[11px] border-b border-slate-800">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <span className="text-slate-300 font-medium">Role:</span>
          <span className="text-white font-semibold">{currentRole}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">CPSE:</span>
          <span className="text-blue-300 font-medium truncate max-w-[140px] sm:max-w-xs">
            {selectedCpse}
          </span>
        </div>
      </div>
    </header>
  );
};
