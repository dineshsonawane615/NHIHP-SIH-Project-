/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Building,
  MapPin,
  Lock,
  LogOut,
  Bell,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Monitor,
  KeyRound,
  ShieldAlert,
  ChevronRight,
  Edit2,
} from 'lucide-react';
import { OfficerProfile } from '../types/material';
import { loginAuditRecords } from '../data/mockData';
import { OfficerAvatar } from '../components/OfficerAvatar';

interface ProfileViewProps {
  officer: OfficerProfile;
  onUpdateOfficer: (updated: Partial<OfficerProfile>) => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  officer,
  onUpdateOfficer,
  onSignOut,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(officer.name);
  const [phone, setPhone] = useState(officer.phone);
  const [notifications, setNotifications] = useState(officer.notificationsEnabled);
  const [activeSessionTerminated, setActiveSessionTerminated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(officer.employeeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleNotifications = () => {
    const newVal = !notifications;
    setNotifications(newVal);
    onUpdateOfficer({ notificationsEnabled: newVal });
  };

  const handleDownloadSecurityAudit = () => {
    const csvContent =
      'Status,Time,Network,IP,AuthMethod\n' +
      loginAuditRecords
        .map((r) => `"${r.status}","${r.time}","${r.network}","${r.ip}","${r.authMethod}"`)
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NIC_CERT_Security_Audit_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-xs text-slate-500">
          View and manage your verified administrative credentials
        </p>
      </div>

      {/* Main Profile Header Card (matches Image 12 top) */}
      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <OfficerAvatar size={56} showStatus />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 truncate">
                {officer.name}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
                • ACTIVE
              </span>
            </div>
            <p className="text-xs font-semibold text-blue-700">
              {officer.roleTitle}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {officer.organization}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded text-xs border border-blue-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Personal Information (Verified) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>PERSONAL INFORMATION</span>
          </div>
          <span className="text-[9px] font-bold text-blue-700 font-mono">VERIFIED</span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              FULL NAME
            </span>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  onUpdateOfficer({ name: e.target.value });
                }}
                className="w-full mt-0.5 border border-slate-300 rounded px-2 py-1 text-xs"
              />
            ) : (
              <span className="font-semibold text-slate-900 block mt-0.5">
                {officer.name}
              </span>
            )}
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              EMPLOYEE ID
            </span>
            <div className="flex items-center justify-between mt-0.5 bg-slate-50 p-1.5 rounded border border-slate-200">
              <span className="font-mono font-bold text-slate-800 text-[11px]">
                {officer.employeeId}
              </span>
              <button
                onClick={handleCopyId}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              OFFICIAL EMAIL
            </span>
            <span className="font-mono text-slate-800 block mt-0.5">
              {officer.email}
            </span>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              PHONE
            </span>
            {isEditing ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  onUpdateOfficer({ phone: e.target.value });
                }}
                className="w-full mt-0.5 border border-slate-300 rounded px-2 py-1 text-xs"
              />
            ) : (
              <span className="font-mono text-slate-800 block mt-0.5">
                {officer.phone}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                DEPARTMENT
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {officer.department}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                ORGANIZATION
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                CPCL
              </span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
              LOCATION
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {officer.location}
            </span>
          </div>
        </div>
      </div>

      {/* ASSIGNED ROLE Card */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>ASSIGNED ROLE</span>
        </div>

        <div className="bg-blue-50/70 p-2.5 rounded border border-blue-200/80">
          <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <span>{officer.roleTitle}</span>
          </h4>
          <p className="text-[11px] text-blue-950 mt-1 leading-relaxed">
            {officer.roleDescription}
          </p>
        </div>
      </div>

      {/* ACCOUNT SETTINGS Card (matches Image 12 middle) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-2.5">
        <div className="text-slate-700 font-bold text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
          ACCOUNT SETTINGS
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Notifications
              </span>
              <span className="text-[10px] text-slate-500 block">
                Receive important NMIHP notifications
              </span>
            </div>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
              notifications ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Password */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-between py-2 border-t border-slate-100 text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs font-semibold text-slate-900 block">
                Password
              </span>
              <span className="text-[10px] text-slate-500 block">
                Change your account password
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Sign Out */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-between py-2 border-t border-slate-100 text-left text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-red-600" />
            <div>
              <span className="text-xs font-semibold block">Sign Out</span>
              <span className="text-[10px] text-red-500 block">
                Sign out from NMIHP session
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* SESSION SECURITY & LOGIN AUDIT (NIC-CERT AUDITED) */}
      <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>SESSION SECURITY & LOGIN AUDIT</span>
          </div>
          <span className="text-[9px] font-bold text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            NIC-CERT AUDITED
          </span>
        </div>

        {/* Current Active Session Box */}
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Current Session (Active Now)
            </span>
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              MFA ENFORCED
            </span>
          </div>

          <div className="text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-slate-400" />
              <span>NIC-Secure Workstation • Chrome 124 (Windows 11)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>10.142.24.88 (NIC Gov-VPN / Chennai Gateway)</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Started: Today, 08:30 IST • Expires in 03h 45m
            </p>
          </div>

          <button
            onClick={() => setActiveSessionTerminated(true)}
            disabled={activeSessionTerminated}
            className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            {activeSessionTerminated
              ? '✓ Other Sessions Terminated'
              : 'Terminate Other Sessions'}
          </button>
        </div>

        {/* Recent Login Audit Log (Last 4 attempts) */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span>RECENT LOGIN AUDIT LOG</span>
            <span className="text-[10px] text-slate-400 font-normal">Last 4 attempts</span>
          </div>

          <div className="space-y-1.5">
            {loginAuditRecords.map((rec, i) => (
              <div
                key={i}
                className="p-2 rounded border border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px]"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold">
                    {rec.success ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    )}
                    <span className={rec.success ? 'text-slate-800' : 'text-red-700'}>
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {rec.time} • {rec.network} • IP: <span className="font-mono">{rec.ip}</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                    rec.success
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {rec.authMethod}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Download CSV button */}
        <button
          onClick={handleDownloadSecurityAudit}
          className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Security Audit Log (CSV)</span>
        </button>
      </div>

      {/* Statutory Footer notice (matches Image 12 footer) */}
      <div className="p-3 text-center text-[10px] text-slate-400 border-t border-slate-200/80 leading-relaxed">
        <p className="font-bold text-slate-500">
          NMIHP • National Material Intelligence & Harmonization Platform
        </p>
        <p>
          Synthetic GovTech prototype environment. All actions are logged and audited per statutory governance frameworks.
        </p>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-4 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900">Change Officer Password</h3>
            <p className="text-xs text-slate-500">
              Must adhere to NIC-Gov security standards (minimum 12 characters, numbers, and special characters).
            </p>
            <input
              type="password"
              placeholder="Current Password"
              className="w-full border border-slate-300 rounded p-2 text-xs"
            />
            <input
              type="password"
              placeholder="New Secure Password"
              className="w-full border border-slate-300 rounded p-2 text-xs"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-1.5 bg-slate-100 rounded text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-1.5 bg-blue-600 text-white rounded text-xs font-bold"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
