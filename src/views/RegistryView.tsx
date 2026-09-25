/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Landmark,
  Search,
  SlidersHorizontal,
  Lock,
  ChevronDown,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  FileSpreadsheet,
  ArrowUpRight,
} from 'lucide-react';
import { NationalMaterialRecord } from '../types/material';
import { SpecimenGraphic } from '../components/SpecimenGraphic';

interface RegistryViewProps {
  records: NationalMaterialRecord[];
  onOpenDossier: (nmcId: string) => void;
  onNavigateToReview: (candidateId?: string) => void;
}

export const RegistryView: React.FC<RegistryViewProps> = ({
  records,
  onOpenDossier,
  onNavigateToReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [expandedNmc, setExpandedNmc] = useState<string>('NMC-PIPE-00184');

  const filterTabs = [
    { id: 'ALL', label: 'All NMCs (58,120)' },
    { id: 'Piping', label: 'Pipes & Fittings' },
    { id: 'Valves', label: 'Valves' },
    { id: 'Fasteners', label: 'Fasteners' },
  ];

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.nmcId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.canonicalDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'ALL' ||
      rec.category.toLowerCase().includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const handleExportRegistry = () => {
    const jsonBlob = new Blob([JSON.stringify(records, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NMIHP_National_Master_Registry_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Header (matches Image 8 top) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              National Master Registry
            </h2>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            LIVE MASTER
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Official Golden Master Catalog for Central Public Sector Enterprises
        </p>

        {/* Hash & Immutable Ledger Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Hash: <span className="font-mono font-bold text-slate-800">#a8f93e</span></span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">Immutable Ledger Timestamped</span>
          </div>
          <Lock className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by NMC, canonical description, ASME spec..."
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
          />
          <button className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs Pills (matches Image 8 filter row) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {filterTabs.map((tab) => {
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* NMC Master Cards List */}
      <div className="space-y-3">
        {filteredRecords.map((item) => {
          const isExpanded = expandedNmc === item.nmcId;
          const isHarmonized = item.status.includes('APPROVED');
          const isPending = item.status.includes('PENDING');

          return (
            <div
              key={item.nmcId}
              className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                    {item.nmcId}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.version}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isHarmonized
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  • {item.status}
                </span>
              </div>

              {/* Description & Thumbnail */}
              <div className="flex gap-2.5 items-start">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.canonicalDescription}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="text-blue-700 font-medium">
                      {item.tags.join(' • ')}
                    </span>
                  </div>
                </div>
                {/* Thumbnail */}
                <div className="w-16 h-12 shrink-0">
                  <SpecimenGraphic
                    type={
                      item.nmcId.includes('PIPE')
                        ? 'pipes-stock'
                        : item.nmcId.includes('VALVE')
                        ? 'valve'
                        : 'bolts'
                    }
                    className="h-full min-h-0"
                  />
                </div>
              </div>

              {/* Mapped Sovereign CPSEs */}
              <div className="bg-slate-50 p-2 rounded text-xs border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-700">
                    MAPPED SOVEREIGN CPSEs ({item.mappedEntities.length})
                  </span>
                  <span className="text-blue-700 font-bold font-mono">
                    {item.conflictsPending ? '1 CONFLICT PENDING' : '100% Convergence'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {item.mappedEntities.map((ent, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-700"
                    >
                      {ent.cpse}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Provenance Accordion */}
              {isExpanded && (
                <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                  {/* Technical Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        STANDARD & GRADE
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.attributes.standardGrade}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        NOMINAL BORE (NB)
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.attributes.nominalBore}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        SCHEDULE / WALL
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.attributes.scheduleWall}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        PRESSURE RATING
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.attributes.pressureRating}
                      </span>
                    </div>
                  </div>

                  {/* Provenance & Audit Trace */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      PROVENANCE & AUDIT TRACE
                    </span>
                    <div className="space-y-1.5 relative border-l-2 border-blue-400 pl-3 ml-1">
                      {item.provenanceTrace.map((prov, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-blue-900">{prov.seed}</span>
                            <span className="text-slate-400 font-mono">{prov.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {prov.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cross-Enterprise Catalog Mapping Table */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
                      CROSS-ENTERPRISE CATALOG MAPPING
                    </span>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-bold uppercase">
                          <tr>
                            <th className="p-1.5">Enterprise</th>
                            <th className="p-1.5">Local Item Code</th>
                            <th className="p-1.5 text-right">Match State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {item.mappedEntities.map((ent, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-1.5 font-medium text-slate-800">
                                {ent.cpse}
                              </td>
                              <td className="p-1.5 font-mono text-blue-700 font-semibold">
                                {ent.localItemCode}
                              </td>
                              <td className="p-1.5 text-right">
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                    ent.matchState === 'Identical'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {ent.matchState}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Action buttons inside expanded record */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onOpenDossier(item.nmcId)}
                      className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Dossier</span>
                    </button>
                    <button
                      onClick={() => onOpenDossier(item.nmcId)}
                      className="p-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                      title="Cryptographic QR Attestation"
                    >
                      <QrCode className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                </div>
              )}

              {/* Conflict banner if pending */}
              {item.conflictsPending && (
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs space-y-1">
                  <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Conflicting Attribute
                    </span>
                    <span className="text-red-700">End Connection</span>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-snug">
                    {item.conflictsPending}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onNavigateToReview('conflict-valve-03')}
                      className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                    >
                      Resolve Conflict
                    </button>
                    <button
                      onClick={() => onOpenDossier(item.nmcId)}
                      className="p-1.5 border border-amber-300 rounded text-amber-800 hover:bg-amber-100"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Toggle Accordion */}
              {!item.conflictsPending && (
                <button
                  onClick={() => setExpandedNmc(isExpanded ? '' : item.nmcId)}
                  className="w-full text-center py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer pt-1"
                >
                  <span>{isExpanded ? 'Hide Technical Attributes' : 'Deep Provenance & Technical Attributes'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Institutional Registry Feed Box (matches Image 8 bottom) */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          <span>Institutional Registry Feed</span>
        </div>
        <p className="text-[11px] text-blue-800 leading-snug">
          Full JSON / CSV master schema snapshot for ERP systems (SAP S/4HANA & Oracle MDM).
        </p>
        <button
          onClick={handleExportRegistry}
          className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Registry (JSON/CSV)</span>
        </button>
      </div>

      {/* Bottom Summary Cards (matches Image 8 footer) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            TOTAL GOLDEN NMCS
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            58,120
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            ↑ +342 this week
          </span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            HARMONIZATION RATE
          </span>
          <div className="text-xl font-bold font-mono text-blue-700 mt-1">
            94.8%
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Across 8 CPSE Nodes
          </span>
        </div>
      </div>
    </div>
  );
};
