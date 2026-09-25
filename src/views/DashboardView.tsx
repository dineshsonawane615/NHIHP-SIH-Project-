/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldAlert,
  Boxes,
  GitMerge,
  AlertCircle,
  CheckCircle2,
  Landmark,
  Scale,
  ChevronRight,
  ArrowUpRight,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { NationalMaterialRecord } from '../types/material';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenConflict: (conflictId: string) => void;
  onOpenDossier: (nmcId: string) => void;
  nationalRecords: NationalMaterialRecord[];
  pendingReviewCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenConflict,
  onOpenDossier,
  nationalRecords,
  pendingReviewCount,
}) => {
  return (
    <div className="space-y-4 pb-8">
      {/* Registry Session Header Card */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Registry Session</span>
            </div>
            <h2 className="text-xl font-bold text-[#0B2545] tracking-tight">
              Welcome, Smt. R. Sharma
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Senior Director of Harmonization & Standards
            </p>
          </div>
          <div className="w-9 h-9 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        {/* Catalog Status Notification Banner */}
        <div className="mt-3.5 bg-blue-50/80 border border-blue-100 rounded-md p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">
                Multi-CPSE Catalog Status
              </p>
              <p className="text-[11px] text-red-700 font-medium">
                {pendingReviewCount} Critical Conflicts Require Attention...
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-review')}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shrink-0 cursor-pointer shadow-xs transition-colors"
          >
            Audit
          </button>
        </div>
      </div>

      {/* Platform Key Performance Indicators Header */}
      <div>
        <div className="flex items-center justify-between px-0.5 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Platform Key Performance Indicators
          </span>
          <span className="text-[11px] font-mono text-slate-400">Sync: 14:02 IST</span>
        </div>

        {/* 6 Metric KPI Grid (2 cols on mobile, 3 cols on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          {/* Card 1: Total Materials */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-slate-600">Total Materials</span>
              <Boxes className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                284,920
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Across 6 CPSE catalogs</p>
            </div>
          </div>

          {/* Card 2: Potential Matches */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-slate-600">Potential Matches</span>
              <GitMerge className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                14,210
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">AI similarity ≥ 75%</p>
            </div>
          </div>

          {/* Card 3: Pending Review */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-slate-600">Pending Review</span>
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">42</span>
                <span className="text-[9px] font-bold uppercase bg-red-100 text-red-700 px-1 py-0.2 rounded-xs">
                  URGENT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                Requires Data Steward Sign-off
              </p>
            </div>
          </div>

          {/* Card 4: Harmonized */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-slate-600">Harmonized</span>
              <FileCheck2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                192,450
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">67.5% Platform progress</p>
            </div>
          </div>

          {/* Card 5: National Records */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-slate-600">National Records</span>
              <Landmark className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                58,120
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Canonical NMCs Issued</p>
            </div>
          </div>

          {/* Card 6: False Merge Rate (Primary Safety KPI per PRD!) */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[11px] font-semibold text-slate-600">False Merge Rate</span>
              <Scale className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                0.42%
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Audited &lt; 0.50% Std</p>
            </div>
          </div>
        </div>
      </div>

      {/* Harmonization Coverage Section */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-800">Harmonization Coverage</span>
          <span className="text-xs font-bold text-blue-700 font-mono">67.5%</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
          <span>Consolidated status across federation</span>
          <span>Target: 80% Q3</span>
        </div>

        {/* Progress Bar with 3 segments */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-600" style={{ width: '67.5%' }} title="Harmonized: 67.5%" />
          <div className="h-full bg-amber-500" style={{ width: '18.2%' }} title="AI Review: 18.2%" />
          <div className="h-full bg-slate-400" style={{ width: '14.3%' }} title="Mapped: 14.3%" />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium mt-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Harmonized 67.5%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>AI Review 18.2%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Mapped 14.3%</span>
          </div>
        </div>

        {/* Source CPSE Intake Volume (4 Major Nodes) */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            <span>Source CPSE Intake Volume</span>
            <span className="text-blue-600 font-semibold text-[10px] lowercase font-normal">
              4 Major Nodes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded flex items-center justify-between border border-slate-100">
              <span className="text-slate-600 font-medium text-[11px]">DEMO-IOCL</span>
              <span className="font-mono font-bold text-slate-800 tabular-nums text-[11px]">
                92,000
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded flex items-center justify-between border border-slate-100">
              <span className="text-slate-600 font-medium text-[11px]">DEMO-NTPC</span>
              <span className="font-mono font-bold text-slate-800 tabular-nums text-[11px]">
                78,000
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded flex items-center justify-between border border-slate-100">
              <span className="text-slate-600 font-medium text-[11px]">DEMO-SAIL</span>
              <span className="font-mono font-bold text-slate-800 tabular-nums text-[11px]">
                64,000
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded flex items-center justify-between border border-slate-100">
              <span className="text-slate-600 font-medium text-[11px]">DEMO-BHEL</span>
              <span className="font-mono font-bold text-slate-800 tabular-nums text-[11px]">
                50,000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Consolidation Opportunities Section (3 ACTIVE) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none">
              Consolidation Opportunities
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Aggregated demand pipeline for unified master codes
            </p>
          </div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-blue-200">
            3 ACTIVE
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Item 1: NMC-PIPE-00184 IDENTICAL */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  NMC-PIPE-00184
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                  IDENTICAL
                </span>
              </div>
              <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Review Req.
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Seamless CS Pipe 100NB SCH40 ASTM A106-B
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
              <div>
                <span className="text-slate-500 block text-[10px]">Consolidated Demand</span>
                <span className="font-bold text-slate-900">45,200 Meters</span>
                <span className="block text-[9px] font-mono text-slate-500">Est. ₹38.4 Cr</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Entities (4 CPSEs)</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">IOCL</span>
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">NTPC</span>
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">SAIL</span>
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">ONGC</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                High Spec Overlap (98%)
              </span>
              <button
                onClick={() => onOpenConflict('conflict-pipe-01')}
                className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>Quick Review</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Item 2: NMC-VALVE-00027 EQUIVALENT */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  NMC-VALVE-00027
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 uppercase">
                  EQUIVALENT
                </span>
              </div>
              <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                Review Req.
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Forged Steel Gate Valve 50NB Class 800
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
              <div>
                <span className="text-slate-500 block text-[10px]">Consolidated Demand</span>
                <span className="font-bold text-slate-900">1,850 Units</span>
                <span className="block text-[9px] font-mono text-slate-500">Est. ₹4.2 Cr</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Entities (3 CPSEs)</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">IOCL</span>
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">GAIL</span>
                  <span className="px-1 py-0.2 bg-white border border-slate-200 rounded text-[9px] font-medium text-slate-700">HPCL</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
                <GitMerge className="w-3.5 h-3.5 text-blue-600" />
                Functional Equivalence
              </span>
              <button
                onClick={() => onOpenConflict('conflict-valve-03')}
                className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>Quick Review</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Item 3: NMC-BOLT-00001 HARMONIZED */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  NMC-BOLT-00001
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                  HARMONIZED
                </span>
              </div>
              <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                Canonical
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                Stud Bolt with 2 Hex Nuts B7/2H 3/4" x 120mm
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded text-[11px] border border-slate-100">
              <div>
                <span className="text-slate-500 block text-[10px]">Consolidated Demand</span>
                <span className="font-bold text-slate-900">120,000 Pcs</span>
                <span className="block text-[9px] font-mono text-slate-500">Est. ₹1.8 Cr</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Entities</span>
                <span className="text-[11px] font-semibold text-slate-800 block mt-0.5">
                  5 CPSEs Enrolled
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-medium text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Standard Spec Adopted
              </span>
              <button
                onClick={() => onOpenDossier('NMC-BOLT-00001')}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <span>View Dossier</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Data Governance Queue Card (Image 4 bottom) */}
      <div className="bg-[#07192F] text-white rounded-lg p-4 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-blue-300">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Priority Data Governance Queue
          </span>
        </div>

        <div>
          <h4 className="text-base font-bold text-white tracking-tight">
            High Confidence Discrepancies
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            3 cross-enterprise conflicts identified between IOCL and NTPC catalog mappings requiring immediate sign-off.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-review')}
          className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
        >
          <span>Launch AI Review Queue ({pendingReviewCount} Conflicts)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
