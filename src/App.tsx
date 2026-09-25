/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  initialOfficerProfile,
  initialReviewPairs,
  initialMaterialCatalog,
  initialNationalRegistry,
  initialAuditLogs,
} from './data/mockData';
import {
  ReviewCandidatePair,
  MaterialItem,
  NationalMaterialRecord,
  AuditLogEntry,
  OfficerProfile,
  CPSEId,
} from './types/material';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { AIReviewView } from './views/AIReviewView';
import { MaterialsView } from './views/MaterialsView';
import { RegistryView } from './views/RegistryView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuditLogView } from './views/AuditLogView';
import { ProfileView } from './views/ProfileView';
import { SignInView } from './views/SignInView';
import { UploadModal } from './views/UploadModal';
import { DossierModal } from './views/DossierModal';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Core Data States
  const [officer, setOfficer] = useState<OfficerProfile>(initialOfficerProfile);
  const [currentRole, setCurrentRole] = useState<string>('Data Steward');
  const [selectedCpse, setSelectedCpse] = useState<string>('Demo CPSE (DEMO-CPCL)');
  const [reviewPairs, setReviewPairs] = useState<ReviewCandidatePair[]>(initialReviewPairs);
  const [selectedPairId, setSelectedPairId] = useState<string>('conflict-pipe-01');
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterialCatalog);
  const [nationalRegistry, setNationalRegistry] = useState<NationalMaterialRecord[]>(initialNationalRegistry);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dossierNmcId, setDossierNmcId] = useState<string | null>(null);

  const pendingReviewCount = reviewPairs.filter(
    (p) => p.reviewStatus === 'PENDING_REVIEW'
  ).length;

  const handleDecision = (
    pairId: string,
    action: 'APPROVE' | 'MODIFY' | 'SPLIT' | 'REJECT',
    reason: string
  ) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const sessionHash = `#HEX-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

    setReviewPairs((prev) =>
      prev.map((p) => {
        if (p.id !== pairId) return p;
        return {
          ...p,
          reviewStatus: action === 'SPLIT' ? 'SPLIT' : action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'MODIFIED',
          stewardDecision: {
            action,
            reason,
            stewardId: 'DS-78819 (IOCL)',
            timestamp: `Today, ${timestamp} IST`,
            sessionHash,
          },
        };
      })
    );

    // Add to Audit Log
    const targetPair = reviewPairs.find((p) => p.id === pairId);
    if (targetPair) {
      const newLog: AuditLogEntry = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: `Today, ${timestamp} IST`,
        actor: `${officer.name} (${officer.employeeId})`,
        entity: `${targetPair.proposedNmc} / ${targetPair.cpseA.code}`,
        action: action === 'SPLIT' ? 'Split' : action === 'APPROVE' ? 'Approve' : action === 'REJECT' ? 'Reject' : 'Modify',
        reason,
        sessionHash,
        diffBefore: `Candidate grouping for ${targetPair.cpseA.node} and ${targetPair.cpseB.node}`,
        diffAfter:
          action === 'SPLIT'
            ? `Distinct identities registered: 150 PSI utility variant vs 600 PSI supercritical variant`
            : `Harmonized to canonical NMC ${targetPair.proposedNmc}`,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedPairId(scenarioId);
    setActiveView('ai-review');
  };

  const handleOpenConflict = (conflictId?: string) => {
    if (conflictId) {
      setSelectedPairId(conflictId);
    }
    setActiveView('ai-review');
  };

  const handleOpenDossier = (nmcId: string) => {
    setDossierNmcId(nmcId);
  };

  const handleIngestSuccess = (count: number, cpse: CPSEId) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: `Today, ${timestamp} IST`,
      actor: `${officer.name} (${officer.employeeId})`,
      entity: `${cpse} Catalog Batch`,
      action: 'Ingest',
      reason: `Ingested and mapped ${count} records from ${cpse} via Secure Gateway. Automated semantic extraction completed.`,
      sessionHash: `#HEX-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const selectedDossierRecord =
    nationalRegistry.find((r) => r.nmcId === dossierNmcId) ||
    nationalRegistry[0] ||
    null;

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col items-center justify-start font-sans antialiased">
      {/* If in SignIn view */}
      {activeView === 'signin' ? (
        <div className="w-full flex-1 flex flex-col justify-center items-center py-6 px-4">
          <SignInView
            onSignIn={(role, email, cpse) => {
              setCurrentRole(role);
              setSelectedCpse(cpse);
              setOfficer((prev) => ({ ...prev, email }));
              setActiveView('dashboard');
            }}
            onBack={() => setActiveView('dashboard')}
          />
        </div>
      ) : isMobileFrame ? (
        /* Mobile Handheld Device View (1:1 with user screenshots!) */
        <div className="w-full max-w-[440px] min-h-screen sm:min-h-[920px] sm:my-4 sm:rounded-2xl sm:border sm:border-slate-300 sm:shadow-2xl overflow-hidden flex flex-col bg-[#faf8ff]">
          <Header
            currentRole={currentRole}
            selectedCpse={selectedCpse}
            activeView={activeView}
            onNavigate={setActiveView}
            isMobileFrame={isMobileFrame}
            onToggleFrame={() => setIsMobileFrame(false)}
            officer={officer}
            pendingConflictsCount={pendingReviewCount}
          />

          <main className="flex-1 overflow-y-auto p-3 sm:p-3.5">
            {activeView === 'dashboard' && (
              <DashboardView
                onNavigate={setActiveView}
                onOpenConflict={handleOpenConflict}
                onOpenDossier={handleOpenDossier}
                nationalRecords={nationalRegistry}
                pendingReviewCount={pendingReviewCount}
              />
            )}
            {activeView === 'ai-review' && (
              <AIReviewView
                pairs={reviewPairs}
                selectedPairId={selectedPairId}
                onSelectPair={setSelectedPairId}
                onDecision={handleDecision}
                onNavigate={setActiveView}
              />
            )}
            {activeView === 'materials' && (
              <MaterialsView
                materials={materials}
                onOpenUploadModal={() => setIsUploadOpen(true)}
                onOpenDossier={handleOpenDossier}
                onNavigateToReview={handleOpenConflict}
              />
            )}
            {activeView === 'registry' && (
              <RegistryView
                records={nationalRegistry}
                onOpenDossier={handleOpenDossier}
                onNavigateToReview={handleOpenConflict}
              />
            )}
            {activeView === 'analytics' && <AnalyticsView />}
            {activeView === 'audit' && <AuditLogView logs={auditLogs} />}
            {activeView === 'profile' && (
              <ProfileView
                officer={officer}
                onUpdateOfficer={(up) => setOfficer((prev) => ({ ...prev, ...up }))}
                onSignOut={() => setActiveView('signin')}
              />
            )}
          </main>

          <BottomNav
            activeView={activeView}
            onNavigate={setActiveView}
            pendingReviewCount={pendingReviewCount}
          />
        </div>
      ) : (
        /* Full Desktop Workstation Layout */
        <div className="w-full flex-1 flex flex-col min-h-screen">
          <Header
            currentRole={currentRole}
            selectedCpse={selectedCpse}
            activeView={activeView}
            onNavigate={setActiveView}
            isMobileFrame={isMobileFrame}
            onToggleFrame={() => setIsMobileFrame(true)}
            officer={officer}
            pendingConflictsCount={pendingReviewCount}
          />

          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              activeView={activeView}
              onNavigate={setActiveView}
              pendingReviewCount={pendingReviewCount}
              onSelectScenario={handleSelectScenario}
            />

            <main className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
              {activeView === 'dashboard' && (
                <DashboardView
                  onNavigate={setActiveView}
                  onOpenConflict={handleOpenConflict}
                  onOpenDossier={handleOpenDossier}
                  nationalRecords={nationalRegistry}
                  pendingReviewCount={pendingReviewCount}
                />
              )}
              {activeView === 'ai-review' && (
                <AIReviewView
                  pairs={reviewPairs}
                  selectedPairId={selectedPairId}
                  onSelectPair={setSelectedPairId}
                  onDecision={handleDecision}
                  onNavigate={setActiveView}
                />
              )}
              {activeView === 'materials' && (
                <MaterialsView
                  materials={materials}
                  onOpenUploadModal={() => setIsUploadOpen(true)}
                  onOpenDossier={handleOpenDossier}
                  onNavigateToReview={handleOpenConflict}
                />
              )}
              {activeView === 'registry' && (
                <RegistryView
                  records={nationalRegistry}
                  onOpenDossier={handleOpenDossier}
                  onNavigateToReview={handleOpenConflict}
                />
              )}
              {activeView === 'analytics' && <AnalyticsView />}
              {activeView === 'audit' && <AuditLogView logs={auditLogs} />}
              {activeView === 'profile' && (
                <ProfileView
                  officer={officer}
                  onUpdateOfficer={(up) => setOfficer((prev) => ({ ...prev, ...up }))}
                  onSignOut={() => setActiveView('signin')}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Upload Master Data Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onIngestSuccess={handleIngestSuccess}
      />

      {/* National Material Dossier Modal */}
      <DossierModal
        isOpen={Boolean(dossierNmcId)}
        onClose={() => setDossierNmcId(null)}
        record={selectedDossierRecord}
      />
    </div>
  );
}
