/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Sparkles,
} from 'lucide-react';
import { CPSEId } from '../types/material';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: (count: number, cpse: CPSEId) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCpse, setSelectedCpse] = useState<CPSEId>('DEMO-IOCL');
  const [fileName, setFileName] = useState('IOCL_Piping_Master_Q3_2024.xlsx');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleRunAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onIngestSuccess(1218, selectedCpse);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-lg max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B2545] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-sm tracking-tight">
              Upload CPSE Master Data (CSV / Excel)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
          <span
            className={`font-semibold ${
              step === 1 ? 'text-blue-700' : 'text-slate-500'
            }`}
          >
            1. Select File
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`font-semibold ${
              step === 2 ? 'text-blue-700' : 'text-slate-500'
            }`}
          >
            2. Map Schema
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`font-semibold ${
              step === 3 ? 'text-blue-700' : 'text-slate-500'
            }`}
          >
            3. Validate
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`font-semibold ${
              step === 4 ? 'text-blue-700' : 'text-slate-500'
            }`}
          >
            4. Ingest
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Source Enterprise Node
                </label>
                <select
                  value={selectedCpse}
                  onChange={(e) => setSelectedCpse(e.target.value as CPSEId)}
                  className="w-full border border-slate-300 rounded p-2 text-xs font-semibold"
                >
                  <option value="DEMO-IOCL">DEMO-IOCL (Indian Oil Corporation)</option>
                  <option value="DEMO-NTPC">DEMO-NTPC (National Thermal Power)</option>
                  <option value="DEMO-SAIL">DEMO-SAIL (Steel Authority of India)</option>
                  <option value="DEMO-BHEL">DEMO-BHEL (Bharat Heavy Electricals)</option>
                  <option value="DEMO-ONGC">DEMO-ONGC (Oil & Natural Gas Corp)</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-lg p-6 text-center space-y-2">
                <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">
                    Drop CSV, Excel, or JSON export here
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports SAP PRD dumps, Oracle EBS CSV, or GeM catalogs
                  </p>
                </div>
                <div className="inline-block bg-white border border-slate-300 rounded px-3 py-1 font-mono text-[11px] text-slate-700">
                  {fileName}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Proceed to Field Mapping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Map raw SAP/ERP export headers into the canonical material model schema:
              </p>

              <div className="border border-slate-200 rounded divide-y divide-slate-100 text-[11px]">
                <div className="p-2 flex items-center justify-between bg-slate-50 font-bold text-slate-600 uppercase text-[10px]">
                  <span>Source Column (ERP)</span>
                  <span>Canonical Target Field</span>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="font-mono text-slate-700">MATNR (Material No)</span>
                  <span className="font-bold text-blue-700">material_code</span>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="font-mono text-slate-700">MAKTX (Material Text)</span>
                  <span className="font-bold text-blue-700">description</span>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="font-mono text-slate-700">MATKL (Material Group)</span>
                  <span className="font-bold text-blue-700">category</span>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="font-mono text-slate-700">MEINS (Base UOM)</span>
                  <span className="font-bold text-blue-700">uom</span>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <span className="font-mono text-slate-700">MFRNR (Manufacturer)</span>
                  <span className="font-bold text-blue-700">manufacturer</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Validate Data Integrity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Validation Completed Successfully</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  1,250 rows parsed • <span className="font-bold">1,218 fully valid</span> • 32 flagged for minor UOM normalization.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">ISO 8000 Conformance:</span>
                  <span className="font-mono font-bold text-slate-800">PASS (100%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Missing Critical Specs:</span>
                  <span className="font-mono font-bold text-emerald-700">0 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ready for AI Matching:</span>
                  <span className="font-mono font-bold text-blue-700">1,218 Records</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Execute Harmonization Ingest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Ready to Ingest into National Master Layer
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  The AI pipeline will normalize abbreviations, extract technical parameters, and run candidate generation against the national ledger.
                </p>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <span>
                  {isProcessing
                    ? 'Executing Semantic Embeddings & Conflict Checks...'
                    : 'Confirm & Ingest 1,218 Records'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
