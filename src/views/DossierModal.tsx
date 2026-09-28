/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  FileCheck2,
  Download,
  Printer,
  ShieldCheck,
  QrCode,
  Landmark,
  Building,
} from 'lucide-react';
import { NationalMaterialRecord } from '../types/material';
import { Emblem } from '../components/Emblem';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: NationalMaterialRecord | null;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen || !record) return null;

  const handleDownloadJson = () => {
    const jsonBlob = new Blob([JSON.stringify(record, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.nmcId}_Official_Dossier.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-2xs z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white rounded-lg max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#07192F] text-white p-3.5 flex items-center justify-between border-b border-blue-500/50">
          <div className="flex items-center gap-2.5">
            <Emblem size={28} />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block text-blue-200">
                GOVERNMENT OF INDIA • NMIHP
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                National Material Dossier
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dossier Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          {/* Certificate Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                CANONICAL NATIONAL IDENTIFIER
              </span>
              <span className="font-mono text-base font-bold text-blue-950 block">
                {record.nmcId}
              </span>
              <span className="text-[10px] text-blue-800">
                Version {record.version} • {record.status}
              </span>
            </div>
            <div className="w-12 h-12 bg-white rounded border border-blue-200 p-1 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-800" />
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              CANONICAL MATERIAL DESCRIPTION
            </span>
            <p className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
              {record.canonicalDescription}
            </p>
          </div>

          {/* Specifications Matrix */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
              GOVERNED TECHNICAL ATTRIBUTES
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block">Standard & Grade</span>
                <span className="font-bold text-slate-800">{record.attributes.standardGrade}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Nominal Bore</span>
                <span className="font-bold text-slate-800">{record.attributes.nominalBore}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Wall / Schedule</span>
                <span className="font-bold text-slate-800">{record.attributes.scheduleWall}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Pressure Design</span>
                <span className="font-bold text-slate-800">{record.attributes.pressureRating}</span>
              </div>
            </div>
          </div>

          {/* Mapped CPSE Lineage */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              ENROLLED CPSE INVENTORY ALIGNMENT
            </span>
            <div className="border border-slate-200 rounded divide-y divide-slate-100 text-[11px]">
              {record.mappedEntities.map((ent, i) => (
                <div key={i} className="p-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ent.cpse}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-700">{ent.localItemCode}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                      {ent.matchState}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attestation & Provenance */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[10px] space-y-1">
            <div className="flex items-center justify-between text-slate-600 font-bold">
              <span>STATUTORY ATTESTATION</span>
              <span className="font-mono text-blue-700">HASH: #0b25e791</span>
            </div>
            <p className="text-slate-500 leading-snug">
              Certified under Central Vigilance Commission (CVC) & Ministry of Petroleum & Natural Gas data governance guidelines. All source identities preserved without destructive overwrite.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="py-1.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Certified Dossier (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
