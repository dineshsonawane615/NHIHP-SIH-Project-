/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Search,
  Download,
  Filter,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { AuditLogEntry } from '../types/material';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    const matchesAction =
      filterAction === 'ALL' || log.action.toUpperCase() === filterAction;
    const matchesSearch =
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sessionHash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const handleExportCsv = () => {
    const csvContent =
      'ID,Timestamp,Actor,Entity,Action,Reason,SessionHash\n' +
      logs
        .map(
          (l) =>
            `"${l.id}","${l.timestamp}","${l.actor}","${l.entity}","${l.action}","${l.reason}","${l.sessionHash}"`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CVC_Statutory_Audit_Log_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Statutory Governance & Audit Log
            </h2>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            CVC COMPLIANT
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Immutable cryptographic ledger of all Data Steward decisions, AI recommendations, and CPSE catalog overrides.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, entity code, or hash..."
            className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-semibold cursor-pointer"
        >
          <option value="ALL">All Actions</option>
          <option value="SPLIT">Split</option>
          <option value="APPROVE">Approve</option>
          <option value="MODIFY">Modify</option>
          <option value="INGEST">Ingest</option>
          <option value="EXPORT">Export</option>
        </select>
      </div>

      {/* Audit Log Stream */}
      <div className="space-y-2">
        {filtered.map((log) => {
          const isExpanded = expandedLogId === log.id;
          return (
            <div
              key={log.id}
              className="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                      log.action === 'Split'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : log.action === 'Approve'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-[11px]">
                    {log.entity}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {log.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-snug">
                {log.reason}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                <span>ACTOR: {log.actor}</span>
                <span className="text-blue-700 font-bold">{log.sessionHash}</span>
              </div>

              {/* Before/After Diff */}
              {(log.diffBefore || log.diffAfter) && (
                <div>
                  <button
                    onClick={() =>
                      setExpandedLogId(isExpanded ? null : log.id)
                    }
                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Record Diff' : 'View Before / After Delta'}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200 text-[10px] font-mono space-y-1">
                      {log.diffBefore && (
                        <div className="text-red-700">
                          <span className="font-bold">BEFORE:</span> {log.diffBefore}
                        </div>
                      )}
                      {log.diffAfter && (
                        <div className="text-emerald-700">
                          <span className="font-bold">AFTER:</span> {log.diffAfter}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Export Log Button */}
      <button
        onClick={handleExportCsv}
        className="w-full py-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-300 rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download Full Statutory Audit Log (CSV)</span>
      </button>
    </div>
  );
};
