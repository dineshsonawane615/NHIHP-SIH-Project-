/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Scale,
  Boxes,
  Zap,
  CheckCircle2,
  Database,
  ArrowUpRight,
  Landmark,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Federation Analytics & KPIs
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-500 font-mono">
            UPDATED: 14:02 IST
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Harmonization precision, statutory safety metrics, and aggregated procurement intelligence
        </p>
      </div>

      {/* Primary Safety KPIs (Matches PRD Section 11 & 15!) */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2 px-0.5">
          STATUTORY DATA QUALITY & SAFETY METRICS
        </span>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* KPI 1: False Merge Rate */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
              False Merge Rate
            </span>
            <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
              0.42%
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Standard: &lt; 0.50% (Safety Gate Passed)
            </p>
          </div>

          {/* KPI 2: False Split Rate */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
              False Split Rate
            </span>
            <div className="text-lg font-bold font-mono text-blue-700 mt-1">
              1.15%
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Conservative split bias applied
            </p>
          </div>

          {/* KPI 3: Conflict Catch Rate */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
              Conflict Catch Rate
            </span>
            <div className="text-lg font-bold font-mono text-purple-700 mt-1">
              100.0%
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Zero physical safety escapes
            </p>
          </div>
        </div>
      </div>

      {/* CPSE Catalog Intake & Harmonization Rates */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">
            Harmonization Progress by Enterprise Node
          </span>
          <span className="text-[10px] text-slate-500 font-mono">6 CPSE Nodes</span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* IOCL */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-slate-800">DEMO-IOCL (Refineries)</span>
              <span className="font-mono text-slate-600">76,400 / 92,000 (83.0%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: '83%' }} />
            </div>
          </div>

          {/* NTPC */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-slate-800">DEMO-NTPC (Thermal)</span>
              <span className="font-mono text-slate-600">58,500 / 78,000 (75.0%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: '75%' }} />
            </div>
          </div>

          {/* SAIL */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-slate-800">DEMO-SAIL (Steel Works)</span>
              <span className="font-mono text-slate-600">46,080 / 64,000 (72.0%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: '72%' }} />
            </div>
          </div>

          {/* BHEL */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-semibold text-slate-800">DEMO-BHEL (Heavy Electricals)</span>
              <span className="font-mono text-slate-600">31,000 / 50,000 (62.0%)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Aggregated Demand & Procurement Intelligence */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Procurement Demand Aggregation
            </h3>
            <p className="text-[10px] text-slate-500">
              Cross-enterprise demand consolidation opportunities (Demo Estimate)
            </p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Est. ₹44.4 Cr Pool
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold text-blue-800 block">
                NMC-PIPE-00184
              </span>
              <span className="text-[11px] text-slate-700">Seamless CS Pipe 100NB SCH40</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 block font-mono">45,200 Mtr</span>
              <span className="text-[10px] text-slate-500 font-mono">₹38.4 Cr (4 CPSEs)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold text-blue-800 block">
                NMC-VALVE-00027
              </span>
              <span className="text-[11px] text-slate-700">Forged Steel Gate Valve 50NB Class 800</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 block font-mono">1,850 Units</span>
              <span className="text-[10px] text-slate-500 font-mono">₹4.2 Cr (3 CPSEs)</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-mono text-[11px] font-bold text-blue-800 block">
                NMC-BOLT-00001
              </span>
              <span className="text-[11px] text-slate-700">Stud Bolt A193 B7 3/4" x 120mm + 2H Nuts</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 block font-mono">120,000 Pcs</span>
              <span className="text-[10px] text-slate-500 font-mono">₹1.8 Cr (5 CPSEs)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mock ERP Gateway Status */}
      <div className="bg-[#07192F] text-white rounded-lg p-3.5 space-y-2 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Sovereign ERP Gateway Connectors (Mock)</span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px]">ALL ACTIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[10px]">SAP S/4HANA RFC</span>
            <span className="text-emerald-400 font-mono font-bold">CONNECTED (SYNC 2m)</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Oracle EBS Adapter</span>
            <span className="text-emerald-400 font-mono font-bold">CONNECTED (SYNC 5m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
