/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  QrCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Upload,
  Link2,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { MaterialItem, CPSEId } from '../types/material';
import { SpecimenGraphic } from '../components/SpecimenGraphic';

interface MaterialsViewProps {
  materials: MaterialItem[];
  onOpenUploadModal: () => void;
  onOpenDossier: (nmcId: string) => void;
  onNavigateToReview: (candidateId?: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  onOpenUploadModal,
  onOpenDossier,
  onNavigateToReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpse, setSelectedCpse] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedMaterialId, setExpandedMaterialId] = useState<string>('mat-iocl-10023');

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.normalizedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mappedNmc && item.mappedNmc.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCpse = selectedCpse === 'ALL' || item.cpse === selectedCpse;
    const matchesCat =
      selectedCategory === 'ALL' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCpse && matchesCat;
  });

  return (
    <div className="space-y-3.5 pb-8">
      {/* Search Input Bar (matches Image 10 top) */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Material Code, Description, NMC..."
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
          />
          <button
            title="Scan QR / Barcode"
            className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
        <button
          className="p-2 bg-white border border-slate-300 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer"
          title="Filter Parameters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* National Registry Pool Subheader & Dropdown Filters */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-[11px] uppercase tracking-wider text-slate-700">
            NATIONAL REGISTRY POOL
          </span>
        </div>
        <span className="font-mono text-blue-700 font-bold text-xs">
          284,109 SKUs
        </span>
      </div>

      {/* Filter Selectors */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="relative">
          <select
            value={selectedCpse}
            onChange={(e) => setSelectedCpse(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium appearance-none focus:outline-hidden focus:border-blue-600 cursor-pointer"
          >
            <option value="ALL">CPSE: All CPSEs</option>
            <option value="DEMO-IOCL">DEMO-IOCL (Refinery)</option>
            <option value="DEMO-NTPC">DEMO-NTPC (Thermal)</option>
            <option value="DEMO-SAIL">DEMO-SAIL (Steel)</option>
            <option value="DEMO-BHEL">DEMO-BHEL (Heavy Eng)</option>
            <option value="DEMO-ONGC">DEMO-ONGC (Offshore)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium appearance-none focus:outline-hidden focus:border-blue-600 cursor-pointer"
          >
            <option value="ALL">Category: All Categories</option>
            <option value="Piping">Piping (Pipes & Tubes)</option>
            <option value="Valves">Flow Control (Valves)</option>
            <option value="Fasteners">Fasteners & Hardware</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
        </div>
      </div>

      {/* Two Summary Metric Cards (matches Image 10) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-semibold text-slate-600">HARMONIZED RATE</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              78.4%
            </span>
            <span className="text-[10px] font-bold text-emerald-600 font-mono">+3.2%</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] font-semibold text-slate-600">CPSE CROSS-MATCHES</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              14,890
            </span>
            <span className="text-[10px] text-amber-700 font-medium">Ready</span>
          </div>
        </div>
      </div>

      {/* Main Material Detail Card (matches Image 10 full 5-step pipeline) */}
      {filteredMaterials.map((item) => {
        const isExpanded = expandedMaterialId === item.id;

        return (
          <div
            key={item.id}
            className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3"
          >
            {/* Top entity header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                  {item.cpse}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {item.code}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  item.status === 'PENDING_REVIEW'
                    ? 'bg-amber-100 text-amber-800'
                    : item.status === 'HIGH_CONFIDENCE'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                • {item.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                {item.normalizedDescription}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Category: <span className="font-semibold text-slate-700">{item.category}</span> • UOM:{' '}
                <span className="font-semibold text-slate-700">{item.uom}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Mfr: <span className="font-semibold text-slate-700">{item.mfr}</span>
              </p>
            </div>

            {/* Mapped NMC Pill */}
            {item.mappedNmc && (
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-md p-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-mono text-xs font-bold text-blue-900">
                    {item.mappedNmc}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">Match Score</span>
                  <span className="bg-blue-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.2 rounded">
                    {item.matchScore}%
                  </span>
                </div>
              </div>
            )}

            {/* Toggle Full 5-Step Harmonization Audit Trail */}
            {isExpanded && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                    Harmonization Audit Trail
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    5-Step Pipeline
                  </span>
                </div>

                {/* STEP 1: RAW ERP FEED */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span>STEP 1 • RAW ERP FEED</span>
                    <span className="font-mono">{item.provenance.sourceSystem}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200/80">
                    {item.rawErpFeed}
                  </div>
                </div>

                {/* STEP 2: SEMANTIC NLP NORMALIZATION */}
                <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200 text-xs">
                  <div className="text-[10px] text-blue-800 font-bold mb-1">
                    STEP 2 • SEMANTIC NLP NORMALIZATION
                  </div>
                  <div className="text-[11px] text-slate-800 font-medium">
                    Nominal Bore: <span className="font-bold">{item.specifications.nominalBore || '100mm (4")'}</span>, Schedule:{' '}
                    <span className="font-bold">{item.specifications.schedule || 'Sch 40'}</span>, End Form:{' '}
                    <span className="font-bold">{item.specifications.endForm || 'Beveled End'}</span>
                  </div>
                </div>

                {/* STEP 3: TECHNICAL PARAMETER VECTOR */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1.5">
                  <div className="text-[10px] text-slate-600 font-bold">
                    STEP 3 • TECHNICAL PARAMETER VECTOR
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        Outer Diameter
                      </span>
                      <span className="font-bold font-mono text-slate-800">
                        {item.specifications.outerDiameter || '114.3 mm'}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        Wall Thickness
                      </span>
                      <span className="font-bold font-mono text-slate-800">
                        {item.specifications.wallThickness || '6.02 mm'}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        Standard Spec
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.specifications.standardSpec || 'ASTM A106'}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        Material Grade
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.specifications.materialGrade || 'Grade B (Seamless)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Certified Engineering Specification Visual Specimen */}
                <SpecimenGraphic type="pipes-stock" />

                {/* STEP 4: PROVENANCE & TRACEABILITY */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                  <div className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 block">
                        STEP 4 • PROVENANCE & TRACEABILITY
                      </span>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                        Ingested from <span className="font-bold text-slate-900">{item.provenance.sourceSystem}</span> on{' '}
                        {item.provenance.ingestionDate} via Secure API Gateway (Sync Hash:{' '}
                        <span className="font-mono text-blue-700 font-bold">
                          {item.provenance.syncHash}
                        </span>).
                      </p>
                    </div>
                  </div>
                </div>

                {/* STEP 5: SOVEREIGN INTER-CPSE CANDIDATES */}
                {item.candidates.length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1.5">
                    <div className="text-[10px] text-slate-600 font-bold">
                      STEP 5 • SOVEREIGN INTER-CPSE CANDIDATES
                    </div>
                    {item.candidates.map((cand, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-blue-800 bg-blue-100 px-1 py-0.2 rounded">
                              {cand.cpse}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-700">
                              {cand.code}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-800 mt-0.5">
                            {cand.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-blue-600">
                            {cand.score}%
                          </span>
                          <button
                            onClick={() => onNavigateToReview('conflict-pipe-01')}
                            title="Inspect Candidate Alignment"
                            className="p-1 rounded text-slate-400 hover:text-blue-600"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons inside expanded card */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToReview('conflict-pipe-01')}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Harmonization</span>
                  </button>
                  <button
                    onClick={() => onOpenDossier(item.mappedNmc || 'NMC-PIPE-00184')}
                    className="p-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 cursor-pointer"
                    title="Audit Record"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Expand / Collapse Button */}
            <button
              onClick={() =>
                setExpandedMaterialId(isExpanded ? '' : item.id)
              }
              className="w-full text-center py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 cursor-pointer pt-1"
            >
              <span>{isExpanded ? 'Collapse Audit Trail' : 'Inspect 5-Step Pipeline'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        );
      })}

      {/* Upload Master Data Button (matches Image 10 bottom) */}
      <button
        onClick={onOpenUploadModal}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>Upload Master Data (CSV/Excel)</span>
      </button>
    </div>
  );
};
