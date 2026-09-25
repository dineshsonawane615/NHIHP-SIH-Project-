/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutGrid, Sparkles, Boxes, Landmark, BarChart3, FileText } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
  pendingReviewCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onNavigate,
  pendingReviewCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'ai-review',
      label: 'AI Review',
      icon: Sparkles,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
    },
    {
      id: 'materials',
      label: 'Materials',
      icon: Boxes,
    },
    {
      id: 'registry',
      label: 'Registry',
      icon: Landmark,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="w-full bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shrink-0 select-none z-20 shadow-md">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition-colors relative cursor-pointer ${
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-105 text-blue-600 stroke-[2.2]' : 'stroke-[1.8]'
                }`}
              />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-full border border-white leading-tight">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight whitespace-nowrap">
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
