/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Boxes,
  Landmark,
  BarChart3,
  FileText,
  User,
  ShieldCheck,
  Zap,
  HelpCircle,
  Database,
} from 'lucide-react';
import { Emblem } from './Emblem';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  pendingReviewCount: number;
  onSelectScenario?: (scenarioId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  pendingReviewCount,
  onSelectScenario,
}) => {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    {
      id: 'ai-review',
      label: 'AI Review',
      icon: Sparkles,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} URGENT` : undefined,
    },
    { id: 'materials', label: 'Materials Catalog', icon: Boxes },
    { id: 'registry', label: 'National Registry', icon: Landmark },
    { id: 'analytics', label: 'Procurement Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Statutory Audit Log', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#07192F] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none h-full">
      {/* Brand area */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <Emblem size={38} showBadge />
        <div>
          <h1 className="font-bold text-white text-base leading-tight tracking-wide">NMIHP</h1>
          <p className="text-[11px] text-blue-300 font-medium">National Master Layer</p>
        </div>
      </div>

      {/* Main Navigation links */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Harmonization
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-bold bg-amber-500 text-slate-900 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* PRD Demo Scenarios Switcher */}
        <div className="pt-4 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          PRD Demonstration Scenarios
        </div>
        <div className="space-y-1">
          <button
            onClick={() => {
              onNavigate('ai-review');
              onSelectScenario?.('conflict-pipe-01');
            }}
            className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:bg-slate-800 hover:text-amber-300 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="truncate">Scenario C: Critical Conflict (150# vs 600#)</span>
          </button>
          <button
            onClick={() => {
              onNavigate('ai-review');
              onSelectScenario?.('conflict-valve-03');
            }}
            className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:bg-slate-800 hover:text-blue-300 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="truncate">Scenario B: Eng. Size (100NB ≡ 4")</span>
          </button>
          <button
            onClick={() => {
              onNavigate('ai-review');
              onSelectScenario?.('demo-scenario-a');
            }}
            className="w-full text-left px-3 py-1.5 rounded text-[11px] text-slate-300 hover:bg-slate-800 hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="truncate">Scenario A: Obvious Duplicate Bolt</span>
          </button>
        </div>

        {/* Sovereign Nodes Status */}
        <div className="pt-4 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Connected Sovereign Nodes
        </div>
        <div className="px-3 py-2 bg-slate-900/60 rounded border border-slate-800 text-[10px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">DEMO-IOCL (SAP PRD):</span>
            <span className="text-emerald-400 font-mono">CONNECTED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">DEMO-NTPC (ECC 6.0):</span>
            <span className="text-emerald-400 font-mono">CONNECTED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">DEMO-SAIL (ERP):</span>
            <span className="text-emerald-400 font-mono">CONNECTED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">DEMO-CPCL (Host Node):</span>
            <span className="text-blue-400 font-mono">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Footer Profile Shortcut */}
      <div className="p-3 border-t border-slate-800 bg-[#051122]">
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-2.5 p-2 rounded text-left transition-colors cursor-pointer ${
            activeView === 'profile' ? 'bg-blue-600/30 border border-blue-500/40 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <User className="w-4 h-4 text-blue-400" />
          <div className="flex-1 truncate">
            <p className="text-xs font-semibold text-white truncate">Smt. R. Sharma</p>
            <p className="text-[10px] text-slate-400 truncate">Data Steward • CPCL</p>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
