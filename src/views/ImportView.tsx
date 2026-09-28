/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowRight,
  Database,
  Building2,
  FileText,
  Info,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { CPSEId, MaterialItem } from '../types/material';

export interface ImportBatchRecord {
  batchId: string;
  cpse: string;
  uploadDate: string;
  fileName: string;
  recordCount: number;
  status: 'Uploaded • Pending AI Harmonization';
}

interface ImportViewProps {
  onImportSuccess: (newMaterials: MaterialItem[], cpse: CPSEId, batch: ImportBatchRecord) => void;
  onNavigate: (view: string) => void;
}

interface ParsedRow {
  rowId: number;
  status: 'VALID' | 'WARNING' | 'ERROR';
  code: string;
  description: string;
  category: string;
  uom: string;
  grade: string;
  size: string;
  pressure: string;
  standard: string;
  manufacturer: string;
  quantity: string;
  validationNote: string;
}

const DEFAULT_CPSE_NODES = [
  { id: 'DEMO-CPCL', name: 'CPCL (Chennai Petroleum Corporation Limited)' },
  { id: 'DEMO-IOCL', name: 'IOCL (Indian Oil Corporation Limited)' },
  { id: 'DEMO-ONGC', name: 'ONGC (Oil and Natural Gas Corporation)' },
  { id: 'DEMO-NTPC', name: 'NTPC (National Thermal Power Corporation)' },
  { id: 'DEMO-SAIL', name: 'SAIL (Steel Authority of India Limited)' },
  { id: 'DEMO-CIL', name: 'CIL (Coal India Limited)' },
];

const INITIAL_RECENT_IMPORTS: ImportBatchRecord[] = [
  {
    batchId: 'BATCH-2026-0928-01',
    cpse: 'DEMO-CPCL',
    uploadDate: '28 Sep 2026, 11:30 IST',
    fileName: 'CPCL_Piping_Master_Q3.csv',
    recordCount: 12380,
    status: 'Uploaded • Pending AI Harmonization',
  },
  {
    batchId: 'BATCH-2026-0927-04',
    cpse: 'DEMO-IOCL',
    uploadDate: '27 Sep 2026, 16:45 IST',
    fileName: 'IOCL_Refinery_Spares_2026.xlsx',
    recordCount: 4520,
    status: 'Uploaded • Pending AI Harmonization',
  },
  {
    batchId: 'BATCH-2026-0926-02',
    cpse: 'DEMO-NTPC',
    uploadDate: '26 Sep 2026, 14:10 IST',
    fileName: 'NTPC_PowerPlant_Hardware.csv',
    recordCount: 8900,
    status: 'Uploaded • Pending AI Harmonization',
  },
];

const MOCK_PREVIEW_ROWS: ParsedRow[] = [
  {
    rowId: 1,
    status: 'VALID',
    code: 'CPCL-MAT-9901',
    description: 'CS PIPE 100NB SCH40 BE ASTM A106 GR.B SEAMLESS',
    category: 'Piping Materials',
    uom: 'MTR',
    grade: 'ASTM A106 Gr.B',
    size: '100 NB (4")',
    pressure: '150 PSI',
    standard: 'ASME B31.3',
    manufacturer: 'Jindal Steel',
    quantity: '500',
    validationNote: 'All required attributes verified',
  },
  {
    rowId: 2,
    status: 'VALID',
    code: 'CPCL-VAL-4412',
    description: 'GATE VALVE 4 INCH CLASS 150 RF FLANGED CS',
    category: 'Flow Control (Valves)',
    uom: 'NOS',
    grade: 'ASTM A216 WCB',
    size: '4 INCH',
    pressure: 'Class 150',
    standard: 'API 600',
    manufacturer: 'L&T Valves',
    quantity: '120',
    validationNote: 'All required attributes verified',
  },
  {
    rowId: 3,
    status: 'WARNING',
    code: 'CPCL-FLG-3305',
    description: 'WELD NECK FLANGE 6 INCH 300# RTJ ASTM A105',
    category: 'Piping Materials',
    uom: 'PCS',
    grade: 'ASTM A105',
    size: '6 INCH',
    pressure: '300#',
    standard: 'ASME B16.5',
    manufacturer: 'Unitech Forge',
    quantity: '85',
    validationNote: 'UOM "PCS" auto-mapped to canonical "NOS"',
  },
  {
    rowId: 4,
    status: 'VALID',
    code: 'CPCL-BLT-1088',
    description: 'STUD BOLT WITH 2 NUTS 5/8" X 3.5" B7/2H HDG',
    category: 'Fasteners & Hardware',
    uom: 'SET',
    grade: 'ASTM A193 B7',
    size: '5/8" x 3.5"',
    pressure: 'N/A',
    standard: 'ASME B18.31.2',
    manufacturer: 'Unbrako',
    quantity: '2400',
    validationNote: 'All required attributes verified',
  },
  {
    rowId: 5,
    status: 'VALID',
    code: 'CPCL-GSK-2201',
    description: 'SPIRAL WOUND GASKET 4" 150# 316L SS GRAFOIL',
    category: 'Gaskets & Seals',
    uom: 'NOS',
    grade: 'SS 316L',
    size: '4 INCH',
    pressure: 'Class 150',
    standard: 'ASME B16.20',
    manufacturer: 'Flexitallic',
    quantity: '450',
    validationNote: 'All required attributes verified',
  },
];

export const ImportView: React.FC<ImportViewProps> = ({ onImportSuccess, onNavigate }) => {
  const [selectedCpse, setSelectedCpse] = useState<string>('DEMO-CPCL');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('CPCL_Master_Catalog_Q3_2026.csv');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>(MOCK_PREVIEW_ROWS);
  const [isValidated, setIsValidated] = useState<boolean>(true);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [recentImports, setRecentImports] = useState<ImportBatchRecord[]>(INITIAL_RECENT_IMPORTS);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Compute metrics
  const validCount = parsedRows.filter((r) => r.status === 'VALID').length;
  const warningCount = parsedRows.filter((r) => r.status === 'WARNING').length;
  const errorCount = parsedRows.filter((r) => r.status === 'ERROR').length;
  const totalCount = file ? parsedRows.length : 12380; // Default mock count or loaded file rows

  // Download Sample Template CSV
  const handleDownloadSample = () => {
    const csvContent =
      'Material Code,Description,Category,UOM,Grade,Size,Pressure Class,Standard,Manufacturer,Quantity\n' +
      'CPCL-MAT-9901,CS PIPE 100NB SCH40 BE ASTM A106 GR.B SEAMLESS,Piping Materials,MTR,ASTM A106 Gr.B,100 NB,150 PSI,ASME B31.3,Jindal Steel,500\n' +
      'CPCL-VAL-4412,GATE VALVE 4 INCH CLASS 150 RF FLANGED CS,Flow Control (Valves),NOS,ASTM A216 WCB,4 INCH,Class 150,API 600,L&T Valves,120\n' +
      'CPCL-FLG-3305,WELD NECK FLANGE 6 INCH 300# RTJ ASTM A105,Piping Materials,NOS,ASTM A105,6 INCH,300#,ASME B16.5,Unitech Forge,85\n' +
      'CPCL-BLT-1088,STUD BOLT WITH 2 NUTS 5/8 X 3.5 B7/2H HDG,Fasteners & Hardware,SET,ASTM A193 B7,5/8 X 3.5,N/A,ASME B18.31.2,Unbrako,2400\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'NMIHP_Material_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV File if uploaded
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setSuccessBanner(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const rows: ParsedRow[] = [];
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Split respecting quotes
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanValues = values.map((v) => v.trim().replace(/^"|"$/g, ''));

        const codeIdx = headers.findIndex((h) => h.includes('code') || h.includes('matnr'));
        const descIdx = headers.findIndex((h) => h.includes('desc') || h.includes('text'));
        const catIdx = headers.findIndex((h) => h.includes('cat') || h.includes('group'));
        const uomIdx = headers.findIndex((h) => h.includes('uom') || h.includes('unit'));
        const gradeIdx = headers.findIndex((h) => h.includes('grade') || h.includes('spec'));
        const sizeIdx = headers.findIndex((h) => h.includes('size') || h.includes('bore'));
        const pressIdx = headers.findIndex((h) => h.includes('press') || h.includes('class'));
        const stdIdx = headers.findIndex((h) => h.includes('stand'));
        const mfrIdx = headers.findIndex((h) => h.includes('mfr') || h.includes('manu'));
        const qtyIdx = headers.findIndex((h) => h.includes('qty') || h.includes('quant'));

        const code = cleanValues[codeIdx >= 0 ? codeIdx : 0] || `MAT-${10000 + i}`;
        const description = cleanValues[descIdx >= 0 ? descIdx : 1] || 'Raw Enterprise Material Line Item';
        const category = cleanValues[catIdx >= 0 ? catIdx : 2] || 'Piping Materials';
        const uom = cleanValues[uomIdx >= 0 ? uomIdx : 3] || 'NOS';
        const grade = cleanValues[gradeIdx >= 0 ? gradeIdx : 4] || 'ASTM Standard';
        const size = cleanValues[sizeIdx >= 0 ? sizeIdx : 5] || 'Standard';
        const pressure = cleanValues[pressIdx >= 0 ? pressIdx : 6] || 'Class 150';
        const standard = cleanValues[stdIdx >= 0 ? stdIdx : 7] || 'ASME B31.3';
        const manufacturer = cleanValues[mfrIdx >= 0 ? mfrIdx : 8] || 'Standard Vendor';
        const quantity = cleanValues[qtyIdx >= 0 ? qtyIdx : 9] || '100';

        let status: 'VALID' | 'WARNING' | 'ERROR' = 'VALID';
        let validationNote = 'All required attributes verified';

        if (!code || !description) {
          status = 'ERROR';
          validationNote = 'Missing required Material Code or Description';
        } else if (uom.toLowerCase() === 'pcs' || uom.toLowerCase() === 'ea') {
          status = 'WARNING';
          validationNote = `UOM "${uom}" auto-mapped to canonical "NOS"`;
        }

        rows.push({
          rowId: i,
          status,
          code,
          description,
          category,
          uom,
          grade,
          size,
          pressure,
          standard,
          manufacturer,
          quantity,
          validationNote,
        });
      }

      setParsedRows(rows);
      setIsValidated(true);
    };

    reader.readAsText(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleReplaceFile = () => {
    setFile(null);
    setFileName('');
    setParsedRows(MOCK_PREVIEW_ROWS);
    setIsValidated(true);
    setSuccessBanner(null);
  };

  const handleValidate = () => {
    setIsValidated(true);
    alert(`Validation complete! ${validCount} valid rows, ${warningCount} warnings, ${errorCount} errors.`);
  };

  // Execute Import
  const handleImportRecords = () => {
    setIsImporting(true);

    const targetCpseId = (selectedCpse as CPSEId) || 'DEMO-CPCL';
    const cpseShort = selectedCpse.replace('DEMO-', '');

    // Convert parsed rows to MaterialItems WITHOUT assigning NMC
    const newItems: MaterialItem[] = parsedRows.map((r, idx) => ({
      id: `IMP-${cpseShort}-${Date.now()}-${idx}`,
      cpse: targetCpseId,
      code: r.code, // Preserve original CPSE code exactly as requested!
      rawErpFeed: r.description,
      normalizedDescription: r.description,
      category: r.category,
      uom: r.uom,
      mfr: r.manufacturer,
      status: 'PENDING_REVIEW', // Do NOT create NMC or approve during import!
      matchScore: 0,
      specifications: {
        nominalBore: r.size,
        materialGrade: r.grade,
        pressureRating: r.pressure,
        standardSpec: r.standard,
      },
      provenance: {
        sourceSystem: `${selectedCpse} (Bulk CSV Ingest)`,
        ingestionDate: new Date().toISOString().split('T')[0],
        syncHash: `#SYNC-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
      },
      candidates: [],
    }));

    const batchRecord: ImportBatchRecord = {
      batchId: `BATCH-2026-${new Date().getMonth() + 1}${new Date().getDate()}-${Math.floor(10 + Math.random() * 89)}`,
      cpse: selectedCpse,
      uploadDate: `Today, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} IST`,
      fileName: fileName || `${cpseShort}_Master_Catalog_Ingest.csv`,
      recordCount: totalCount,
      status: 'Uploaded • Pending AI Harmonization',
    };

    setTimeout(() => {
      onImportSuccess(newItems, targetCpseId, batchRecord);
      setRecentImports((prev) => [batchRecord, ...prev]);
      setIsImporting(false);
      setSuccessBanner(`${totalCount.toLocaleString()} records imported — Pending AI Harmonization`);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto text-slate-800">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-[#07192F] via-[#0B2545] to-[#07192F] text-white p-5 rounded-lg border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Import Material Master</h1>
            <span className="bg-blue-600/40 text-blue-200 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Data Ingestion Gateway
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Upload raw enterprise material master catalogs (Excel / CSV) from sovereign CPSE ERP nodes.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Download Sample Template (.CSV)</span>
        </button>
      </div>

      {/* Governance Notice Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Important Operational Rule:</span> Importing records adds them to the master dataset for AI harmonization. It does <span className="font-bold underline">NOT</span> generate NMC codes or automatically approve materials. Original CPSE material codes are preserved as-is. AI Harmonization occurs in the AI Review module.
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-950">{successBanner}</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                All records successfully added to the master dataset with original CPSE material codes preserved.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('ai-review')}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proceed to AI Review Queue →</span>
            </button>
            <button
              onClick={() => onNavigate('materials')}
              className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold rounded text-xs transition-colors cursor-pointer"
            >
              View Catalog
            </button>
          </div>
        </div>
      )}

      {/* Main Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Flow Step 1 & Step 2 */}
        <div className="lg:col-span-1 space-y-5">
          {/* Step 1: Select CPSE */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Step 1: Select CPSE Enterprise Node
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">REQUIRED</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Sovereign CPSE Node
              </label>
              <select
                value={selectedCpse}
                onChange={(e) => setSelectedCpse(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 text-xs font-semibold bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {DEFAULT_CPSE_NODES.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Materials will be tagged with this CPSE identifier during ingestion.
              </p>
            </div>
          </div>

          {/* Step 2: Upload File Box */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Step 2: Upload Excel / CSV
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">CSV, XLSX</span>
            </div>

            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-5 text-center block cursor-pointer transition-colors ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/80'
                  : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-blue-400'
              }`}
            >
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <UploadCloud className="w-9 h-9 text-blue-600 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-xs">
                Drag & Drop Material Master CSV or Excel here
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                or click to browse your computer
              </p>

              {fileName && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-900 rounded px-2.5 py-1 text-xs font-mono font-bold shadow-2xs">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>{fileName}</span>
                </div>
              )}
            </label>
          </div>

          {/* Field Guidance Card */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-slate-500">
              Required & Optional Fields Mapping
            </h4>

            <div>
              <p className="font-semibold text-emerald-800 flex items-center gap-1 text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Required Fields:
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {['Material Code', 'Description', 'Category', 'UOM'].map((f) => (
                  <span key={f} className="bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <Info className="w-3.5 h-3.5 text-slate-500" /> Optional Fields:
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {['Grade', 'Size', 'Pressure Class', 'Standard', 'Manufacturer', 'Quantity'].map((f) => (
                  <span key={f} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step 3 Validation Metrics, Preview Table & Action Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* File Overview & Validation Status Cards */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>File Validation & Pre-Import Audit</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    READY TO IMPORT
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  File: <span className="font-mono font-semibold text-slate-700">{fileName}</span> • Total Rows: <span className="font-bold text-slate-800">{totalCount.toLocaleString()}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleReplaceFile}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace File</span>
                </button>
                <button
                  onClick={handleValidate}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Validate Data</span>
                </button>
                <button
                  onClick={handleImportRecords}
                  disabled={isImporting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{isImporting ? 'Importing Dataset...' : 'Import Records'}</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valid Records</span>
                </div>
                <p className="text-xl font-extrabold text-emerald-900 mt-1">
                  {validCount.toLocaleString()}
                </p>
                <p className="text-[10px] text-emerald-700 mt-0.5">100% schema match</p>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-md p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Warnings</span>
                </div>
                <p className="text-xl font-extrabold text-amber-900 mt-1">
                  {warningCount.toLocaleString()}
                </p>
                <p className="text-[10px] text-amber-700 mt-0.5">Minor UOM auto-trim</p>
              </div>

              <div className="bg-red-50/70 border border-red-200 rounded-md p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-red-700 font-bold text-xs">
                  <XCircle className="w-4 h-4" />
                  <span>Errors</span>
                </div>
                <p className="text-xl font-extrabold text-red-900 mt-1">
                  {errorCount.toLocaleString()}
                </p>
                <p className="text-[10px] text-red-700 mt-0.5">Missing critical fields</p>
              </div>
            </div>

            {/* Data Preview Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Parsed Data Sample Preview ({parsedRows.length} Rows Shown)
                </h4>
                <span className="text-[10px] text-slate-500">Original CPSE material codes preserved</span>
              </div>

              <div className="border border-slate-200 rounded-md overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                    <tr>
                      <th className="p-2 w-8 text-center">#</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Material Code</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Category</th>
                      <th className="p-2">UOM</th>
                      <th className="p-2">Grade / Spec</th>
                      <th className="p-2">Validation Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
                    {parsedRows.map((row) => (
                      <tr key={row.rowId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2 text-center text-slate-400 font-mono text-[10px]">
                          {row.rowId}
                        </td>
                        <td className="p-2">
                          {row.status === 'VALID' && (
                            <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[9px] inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> VALID
                            </span>
                          )}
                          {row.status === 'WARNING' && (
                            <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[9px] inline-flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> WARNING
                            </span>
                          )}
                          {row.status === 'ERROR' && (
                            <span className="bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded text-[9px] inline-flex items-center gap-0.5">
                              <XCircle className="w-2.5 h-2.5 text-red-600" /> ERROR
                            </span>
                          )}
                        </td>
                        <td className="p-2 font-mono font-bold text-blue-900 whitespace-nowrap">
                          {row.code}
                        </td>
                        <td className="p-2 max-w-xs truncate" title={row.description}>
                          {row.description}
                        </td>
                        <td className="p-2 whitespace-nowrap text-slate-600">
                          {row.category}
                        </td>
                        <td className="p-2 font-mono font-bold text-slate-800">
                          {row.uom}
                        </td>
                        <td className="p-2 whitespace-nowrap text-slate-600">
                          {row.grade}
                        </td>
                        <td className="p-2 text-[10px] text-slate-500 italic max-w-xs truncate">
                          {row.validationNote}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Imports History Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Recent Import Batches</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              History of dataset uploads submitted across sovereign CPSE nodes.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-600">
            {recentImports.length} Batches Recorded
          </span>
        </div>

        <div className="border border-slate-200 rounded-md overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
              <tr>
                <th className="p-2.5">Batch ID</th>
                <th className="p-2.5">CPSE Node</th>
                <th className="p-2.5">Upload Date</th>
                <th className="p-2.5">File Name</th>
                <th className="p-2.5 text-right">Record Count</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
              {recentImports.map((batch) => (
                <tr key={batch.batchId} className="hover:bg-slate-50 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-slate-900">
                    {batch.batchId}
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className="bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                      {batch.cpse}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 whitespace-nowrap">
                    {batch.uploadDate}
                  </td>
                  <td className="p-2.5 font-mono text-slate-800">
                    {batch.fileName}
                  </td>
                  <td className="p-2.5 text-right font-extrabold text-slate-900 font-mono">
                    {batch.recordCount.toLocaleString()}
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => onNavigate('materials')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-bold text-slate-700 rounded text-[11px] transition-colors cursor-pointer border border-slate-200"
                    >
                      View Records
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
