/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Building,
  Mail,
  Check,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Emblem } from '../components/Emblem';

interface SignInViewProps {
  onSignIn: (role: string, email: string, cpse: string) => void;
  onBack?: () => void;
}

export const SignInView: React.FC<SignInViewProps> = ({ onSignIn, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<'Data Steward' | 'Tech Officer' | 'Auditor'>('Data Steward');
  const [email, setEmail] = useState('rajesh.sharma@cpcl.co.in');
  const [selectedCpse, setSelectedCpse] = useState('CPCL — Chennai Petroleum Corporation');
  const [keepActive, setKeepActive] = useState(true);

  const roles: Array<'Data Steward' | 'Tech Officer' | 'Auditor'> = [
    'Data Steward',
    'Tech Officer',
    'Auditor',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(selectedRole, email, selectedCpse);
  };

  return (
    <div className="min-h-full flex flex-col justify-between py-2 sm:py-6 px-3 sm:px-4 max-w-md mx-auto w-full select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200/80 mb-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}
        <div className="flex items-center gap-2">
          <Emblem size={24} />
          <span className="font-bold text-sm text-[#0B2545]">NMIHP Sign In</span>
        </div>
        <div className="p-1 rounded-full bg-slate-100 text-slate-600">
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* Center Emblem & Sovereign Notice */}
      <div className="text-center space-y-2 mb-4">
        <div className="flex justify-center mb-1">
          <Emblem size={64} showBadge />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
          GOVERNMENT OF INDIA • MINISTRY OF HEAVY INDUSTRIES
        </span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Officer Portal Sign In
        </h2>
        <p className="text-xs text-slate-600 leading-snug">
          National Material Intelligence & Harmonization Platform (NMIHP)
        </p>
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-wider mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>SECURED SOVEREIGN NODE</span>
        </div>
      </div>

      {/* Main Sign-In Card (matches Image 14 center) */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-md space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Designated Role Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Designated Role
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md">
              {roles.map((r) => {
                const isActive = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Email or Employee ID */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Official Email or Employee ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Assigned CPSE Node */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Assigned CPSE Node
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <select
                value={selectedCpse}
                onChange={(e) => setSelectedCpse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-8 py-2 text-xs text-slate-800 font-medium appearance-none focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="CPCL — Chennai Petroleum Corporation">
                  CPCL — Chennai Petroleum Corporat
                </option>
                <option value="IOCL — Indian Oil Corporation Ltd">
                  IOCL — Indian Oil Corporation Ltd
                </option>
                <option value="NTPC — National Thermal Power Corp">
                  NTPC — National Thermal Power Corp
                </option>
                <option value="SAIL — Steel Authority of India Ltd">
                  SAIL — Steel Authority of India Ltd
                </option>
                <option value="BHEL — Bharat Heavy Electricals Ltd">
                  BHEL — Bharat Heavy Electricals Ltd
                </option>
                <option value="ONGC — Oil & Natural Gas Corporation">
                  ONGC — Oil & Natural Gas Corp
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Keep session active checkbox */}
          <label className="flex items-center gap-2 cursor-pointer pt-0.5">
            <input
              type="checkbox"
              checked={keepActive}
              onChange={(e) => setKeepActive(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-700 font-medium">
              Keep session active on this Gov-Workstation
            </span>
          </label>

          {/* Enter Portal Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#0B2545] hover:bg-[#134074] text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
          >
            <span>Enter Portal (Demo Access)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-blue-700 font-semibold pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => alert('Demo Credentials: Any valid CPSE email works. Preloaded: rajesh.sharma@cpcl.co.in')}
            className="hover:underline cursor-pointer"
          >
            Need Access?
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => alert('NIC Helpdesk: Available 24x7 on NIC-Gov Toll Free: 1800-111-999')}
            className="hover:underline cursor-pointer"
          >
            NIC Helpdesk
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => alert('Portal Specs: Compliant with ISO 8000-110/115 and SIH26099 Architecture Guidelines.')}
            className="hover:underline cursor-pointer"
          >
            Portal Specs
          </button>
        </div>
      </div>

      {/* Official Sovereign System Notice (matches Image 14 bottom) */}
      <div className="mt-4 p-3 bg-blue-50/50 rounded border border-blue-100/80 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>OFFICIAL SOVEREIGN SYSTEM NOTICE</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm mx-auto">
          National Material Intelligence & Harmonization Platform. Authorized personnel only. All access logged and audited under federal data governance standards.
        </p>
      </div>
    </div>
  );
};
