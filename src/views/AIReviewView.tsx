/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  GitFork,
  XCircle,
  Edit3,
  Shield,
  Sparkles,
  Lock,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import { ReviewCandidatePair } from '../types/material';
import { SpecimenGraphic } from '../components/SpecimenGraphic';

interface AIReviewViewProps {
  pairs: ReviewCandidatePair[];
  selectedPairId: string;
  onSelectPair: (id: string) => void;
  onDecision: (
    pairId: string,
    action: 'APPROVE' | 'MODIFY' | 'SPLIT' | 'REJECT',
    reason: string
  ) => void;
  onNavigate: (view: string) => void;
}

export const AIReviewView: React.FC<AIReviewViewProps> = ({
  pairs,
  selectedPairId,
  onSelectPair,
  onDecision,
  onNavigate,
}) => {
  const currentPair =
    pairs.find((p) => p.id === selectedPairId) || pairs[0] || null;

  const [selectedAction, setSelectedAction] = useState<
    'APPROVE' | 'MODIFY' | 'SPLIT' | 'REJECT'
  >('SPLIT');

  const [justification, setJustification] = useState(
    'Mismatch in pressure rating verified; creating separate variant NMC record for Class 600 while preserving Class 150 identity.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  if (!currentPair) {
    return (
      <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">All Queue Items Reviewed</h3>
        <p className="text-xs text-slate-500 mt-1">
          Zero pending conflicts in the Priority Data Governance Queue.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const minChars = 40;
  const charsRemaining = Math.max(0, minChars - justification.length);

  const handlePastePrescribed = () => {
    if (selectedAction === 'SPLIT') {
      setJustification(
        'Critical thermodynamic boundary gap verified: 150 PSI vs 600 PSI rating mismatch. Split approved to prevent physical installation hazard during inter-plant inventory sharing per CVC guidelines.'
      );
    } else if (selectedAction === 'APPROVE') {
      setJustification(
        'Verified cross-CPSE technical equivalence based on ASME B36.10M standard dimensional and chemical concordance. Harmonization confirmed for unified NMC master code.'
      );
    } else if (selectedAction === 'MODIFY') {
      setJustification(
        'Technical parameters adjusted to reflect canonical specification: reconciled schedule thickness and nominal bore designation.'
      );
    } else {
      setJustification(
        'Incompatible specifications identified across CPSE catalogs. Candidates rejected from unified master code grouping.'
      );
    }
  };

  const handleConfirmAction = () => {
    if (charsRemaining > 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onDecision(currentPair.id, selectedAction, justification);
      setIsSubmitting(false);
      setSuccessBanner(
        `Action [${selectedAction}] successfully committed to statutory governance audit trail. Hash: #HEX-${Math.random()
          .toString(16)
          .substring(2, 8)
          .toUpperCase()}`
      );
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 400);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Conflict Tabs Carousel (matches Image 6 top) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {pairs.map((pair) => {
          const isSelected = pair.id === currentPair.id;
          const isResolved = pair.reviewStatus !== 'PENDING_REVIEW';
          return (
            <button
              key={pair.id}
              onClick={() => {
                onSelectPair(pair.id);
                setSuccessBanner(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
                isSelected
                  ? 'bg-red-50 text-red-700 border-red-300 shadow-xs ring-1 ring-red-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isResolved
                    ? 'bg-emerald-500'
                    : pair.conflict?.isCritical
                    ? 'bg-red-600'
                    : 'bg-amber-500'
                }`}
              />
              <span className="font-mono">{pair.evidence.overallScore}%</span>
              <span>
                {pair.cpseA.node.replace('DEMO-', '')} ↔ {pair.cpseB.node.replace('DEMO-', '')}
              </span>
              {pair.conflict && !isResolved && (
                <span className="text-[9px] font-bold bg-red-600 text-white px-1 rounded-xs uppercase">
                  CONFLICT
                </span>
              )}
              {isResolved && (
                <span className="text-[9px] font-bold bg-emerald-600 text-white px-1 rounded-xs uppercase">
                  {pair.reviewStatus}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Dual Entity Audit Card (matches Image 6 center) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-blue-600 rotate-90" />
            <h3 className="text-sm font-bold text-slate-900">Dual Entity Audit</h3>
          </div>
          <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-red-200 uppercase tracking-wide">
            CRITICAL MISMATCH
          </span>
        </div>

        {/* Entity Comparison Header Box */}
        <div className="space-y-2">
          {/* CPSE-A Box */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-blue-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                CPSE-A ({currentPair.cpseA.node})
              </span>
              <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100/70 px-1.5 py-0.2 rounded">
                {currentPair.cpseA.code}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {currentPair.cpseA.description}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {currentPair.cpseA.facility}
            </p>
          </div>

          {/* AI Cross-Evaluation Divider */}
          <div className="flex items-center justify-center my-1">
            <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI CROSS-EVALUATION</span>
            </span>
          </div>

          {/* CPSE-B Box */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-purple-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                CPSE-B ({currentPair.cpseB.node})
              </span>
              <span className="font-mono text-xs font-bold text-purple-800 bg-purple-100/70 px-1.5 py-0.2 rounded">
                {currentPair.cpseB.code}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {currentPair.cpseB.description}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {currentPair.cpseB.facility}
            </p>
          </div>
        </div>

        {/* Specimen Visual Grid (Matches Image 6 specimen photos) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <SpecimenGraphic
            type={currentPair.id.includes('pipe') ? 'pipe-a' : 'valve'}
            label={currentPair.cpseA.specimenLabel}
          />
          <SpecimenGraphic
            type={currentPair.id.includes('pipe') ? 'pipe-b' : 'bolts'}
            label={currentPair.cpseB.specimenLabel}
          />
        </div>

        {/* ATTRIBUTE MATRIX (5 Parameters Audited) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              ATTRIBUTE MATRIX
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentPair.attributes.length} Parameters Audited
            </span>
          </div>

          <div className="space-y-2">
            {currentPair.attributes.map((attr, idx) => {
              const isMatch = attr.status === 'MATCH';
              const isEquivalent = attr.status === 'EQUIVALENT';
              const isMismatch = attr.status === 'MISMATCH';

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-md border text-xs ${
                    isMismatch
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800 text-[11px]">
                      {attr.name}
                    </span>
                    {isMatch && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" /> MATCH
                      </span>
                    )}
                    {isEquivalent && (
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                        ⇄ EQUIVALENT
                      </span>
                    )}
                    {isMismatch && (
                      <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                        ✕ MISMATCH
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        CPSE-A
                      </span>
                      <span className={`font-medium ${isMismatch ? 'text-red-700 font-bold' : 'text-slate-800'}`}>
                        {attr.cpseAValue}
                      </span>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 block font-mono">
                        CPSE-B
                      </span>
                      <span className={`font-medium ${isMismatch ? 'text-red-700 font-bold' : 'text-slate-800'}`}>
                        {attr.cpseBValue}
                      </span>
                    </div>
                  </div>

                  {attr.note && (
                    <div className={`mt-2 p-1.5 rounded text-[10px] leading-relaxed ${
                      isMismatch
                        ? 'bg-red-100/70 text-red-900 border border-red-200'
                        : 'bg-blue-50 text-blue-900 border border-blue-100'
                    }`}>
                      {attr.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explainable Evidence Engine (NEXUS-V4) Card (matches Image 6 bottom half) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-blue-700">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900">
              Explainable Evidence Engine
            </h4>
          </div>
          <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
            NEXUS-V4
          </span>
        </div>

        {/* Critical Conflict Box */}
        {currentPair.conflict && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-red-700 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>CRITICAL CONFLICT DETECTED</span>
            </div>
            <p className="text-xs text-red-950 font-medium leading-relaxed">
              {currentPair.conflict.hazardDescription}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-red-800">
              <span>RECOMMENDATION:</span>
              <span className="bg-red-100 px-1.5 py-0.5 rounded text-[10px]">
                {currentPair.conflict.recommendation}
              </span>
            </div>
          </div>
        )}

        {/* Confidence Decomposition Breakdown */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Confidence Decomposition
              </span>
              <span className="text-[10px] text-slate-500">
                Deterministic weighted similarity calculation
              </span>
            </div>
            {/* Circular badge */}
            <div className="w-10 h-10 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center font-mono font-bold text-xs text-blue-700 shrink-0">
              {currentPair.evidence.overallScore}%
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Description Text Match</span>
                <span className="font-mono font-bold">{currentPair.evidence.descriptionSimilarity}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{ width: `${currentPair.evidence.descriptionSimilarity}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Semantic Embeddings</span>
                <span className="font-mono font-bold">{currentPair.evidence.semanticEmbeddings}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{ width: `${currentPair.evidence.semanticEmbeddings}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Extracted Attribute Compatibility</span>
                <span className="font-mono font-bold">{currentPair.evidence.extractedAttributeCompatibility}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full"
                  style={{ width: `${currentPair.evidence.extractedAttributeCompatibility}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Taxonomy Category Concordance</span>
                <span className="font-mono font-bold text-emerald-600">
                  {currentPair.evidence.taxonomyConcordance}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full"
                  style={{ width: `${currentPair.evidence.taxonomyConcordance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Unit of Measurement (UOM)</span>
                <span className="font-mono font-bold text-emerald-600">
                  {currentPair.evidence.uomCompatibility}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full"
                  style={{ width: `${currentPair.evidence.uomCompatibility}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-0.5">
                <span>Manufacturer / Part Reference</span>
                <span className="font-mono font-bold text-amber-600">
                  {currentPair.evidence.manufacturerPartReference}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: `${currentPair.evidence.manufacturerPartReference}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Determination (Steward Step) (matches Image 6 bottom actions) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span className="text-slate-900">Operational Determination</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Steward Step</span>
        </div>

        {/* 4 Action Buttons Matrix */}
        <div className="grid grid-cols-2 gap-2">
          {/* Button 1: Approve Match */}
          <button
            onClick={() => setSelectedAction('APPROVE')}
            className={`py-2 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              selectedAction === 'APPROVE'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Match</span>
          </button>

          {/* Button 2: Modify Specs */}
          <button
            onClick={() => setSelectedAction('MODIFY')}
            className={`py-2 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              selectedAction === 'MODIFY'
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modify Specs</span>
          </button>

          {/* Button 3: Split Records (RECOMMENDED) */}
          <button
            onClick={() => setSelectedAction('SPLIT')}
            className={`relative py-2.5 px-2.5 rounded text-xs font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
              selectedAction === 'SPLIT'
                ? 'bg-amber-50 text-amber-900 border-amber-400 shadow-sm ring-2 ring-amber-300'
                : 'bg-amber-50/50 hover:bg-amber-100/50 text-amber-900 border-amber-300'
            }`}
          >
            <span className="absolute -top-2 right-2 bg-amber-400 text-amber-950 text-[8px] font-bold px-1.5 py-0.2 rounded-xs uppercase tracking-wider">
              RECOMMENDED
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <GitFork className="w-3.5 h-3.5 text-amber-700" />
              <span>Split Records</span>
            </div>
          </button>

          {/* Button 4: Reject Pair */}
          <button
            onClick={() => setSelectedAction('REJECT')}
            className={`py-2 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              selectedAction === 'REJECT'
                ? 'bg-red-600 text-white border-red-700 shadow-sm ring-2 ring-red-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject Pair</span>
          </button>
        </div>

        {/* Reason for Decision (Mandatory for CVC & Statutory Governance Audit) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800 flex items-center gap-1">
              <span>Reason for decision *</span>
            </label>
            <Shield className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Mandatory for CVC & Statutory Internal Data Governance Audit
          </p>

          <textarea
            rows={3}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="e.g., Mismatch in pressure rating verified; creating separate variant NMC record for Class 600 while preserving Class 150 identity."
            className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-slate-50 font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span
              className={`font-mono ${
                charsRemaining > 0 ? 'text-amber-700' : 'text-emerald-700 font-bold'
              }`}
            >
              {charsRemaining > 0
                ? `${charsRemaining} more characters needed for compliance audit`
                : '✓ Statutory character minimum met'}
            </span>

            <button
              type="button"
              onClick={handlePastePrescribed}
              className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Paste Prescribed Justification</span>
            </button>
          </div>
        </div>

        {/* Action Confirmation Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmAction}
            disabled={charsRemaining > 0 || isSubmitting}
            className={`py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              charsRemaining > 0 || isSubmitting
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : selectedAction === 'SPLIT'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                : selectedAction === 'APPROVE'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-black text-white shadow-xs'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isSubmitting
                ? 'Recording Audit...'
                : `Confirm ${selectedAction.charAt(0) + selectedAction.slice(1).toLowerCase()}`}
            </span>
          </button>
        </div>

        {/* Auditor Stamp Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>STEWARD: DS-78819 (IOCL)</span>
          <span>SESSION: #HEX-90A2FF</span>
        </div>
      </div>
    </div>
  );
};
