/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  fetchMaterials,
  fetchMatches,
  fetchNationalMaterials,
  fetchAuditLogs,
  submitStewardDecision
} from './services/api';
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
import { ImportView, ImportBatchRecord } from './views/ImportView';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

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

  // Load Data from Backend API on mount
  useEffect(() => {
    async function loadData() {
      const [mats, matches, nmcs, logs] = await Promise.all([
        fetchMaterials(),
        fetchMatches(),
        fetchNationalMaterials(),
        fetchAuditLogs()
      ]);
      if (mats && mats.length > 0) setMaterials(mats);
      if (matches && matches.length > 0) {
        setReviewPairs(matches);
        setSelectedPairId(matches[0].id);
      }
      if (nmcs && nmcs.length > 0) setNationalRegistry(nmcs);
      if (logs && logs.length > 0) setAuditLogs(logs);
    }
    loadData();
  }, []);

  const pendingReviewCount = reviewPairs.filter(
    (p) => p.reviewStatus === 'PENDING_REVIEW'
  ).length;

  const handleDecision = async (
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

    // Submit to Backend API
    await submitStewardDecision(pairId, action, reason);

    const targetPair = reviewPairs.find((p) => p.id === pairId);

    setReviewPairs((prev) =>
      prev.map((p) => {
        if (p.id !== pairId) return p;
        return {
          ...p,
          reviewStatus: action === 'SPLIT' ? 'SPLIT' : action === 'APPROVE' ? 'APPROVED' : action === 'REJECT' ? 'REJECTED' : 'MODIFIED',
          stewardDecision: {
            action,
            reason,
            stewardId: `${officer.name} (${officer.employeeId})`,
            timestamp: `Today, ${timestamp} IST`,
            sessionHash,
          },
        };
      })
    );

    // Update Materials Catalog records if harmonized or split
    if (targetPair) {
      const codeA = targetPair.cpseA?.code;
      const codeB = targetPair.cpseB?.code;

      setMaterials((prev) =>
        prev.map((m) => {
          if (m.code === codeA || m.code === codeB) {
            return {
              ...m,
              status: 'HARMONIZED',
              mappedNmc: action === 'SPLIT' ? `${targetPair.proposedNmc}-V` : targetPair.proposedNmc,
            };
          }
          return m;
        })
      );

      // Update National Registry records
      setNationalRegistry((prev) => {
        const primaryNmc = targetPair.proposedNmc || 'NMC-GENERIC-00100';
        const exists = prev.some((r) => r.nmcId === primaryNmc);

        let updatedList: NationalMaterialRecord[];

        if (exists) {
          updatedList = prev.map((r) => {
            if (r.nmcId === primaryNmc) {
              const nodeA: CPSEId = (targetPair.cpseA?.node || 'DEMO-CPCL') as CPSEId;
              const nodeB: CPSEId = (targetPair.cpseB?.node || 'DEMO-IOCL') as CPSEId;
              const matchStateB: 'Identical' | 'Harmonized' | 'Equivalent' = action === 'SPLIT' ? 'Equivalent' : 'Harmonized';

              return {
                ...r,
                status: 'APPROVED & HARMONIZED' as const,
                conflictsPending: undefined,
                mappedEntities: [
                  ...(r.mappedEntities || []),
                  ...(targetPair.cpseA?.code && !(r.mappedEntities || []).some(e => e.localItemCode === targetPair.cpseA?.code)
                    ? [{ cpse: nodeA, localItemCode: targetPair.cpseA.code, matchState: 'Identical' as const }]
                    : []),
                  ...(targetPair.cpseB?.code && !(r.mappedEntities || []).some(e => e.localItemCode === targetPair.cpseB?.code)
                    ? [{ cpse: nodeB, localItemCode: targetPair.cpseB.code, matchState: matchStateB }]
                    : [])
                ]
              };
            }
            return r;
          });
        } else {
          const nodeA: CPSEId = (targetPair.cpseA?.node || 'DEMO-CPCL') as CPSEId;
          const nodeB: CPSEId = (targetPair.cpseB?.node || 'DEMO-IOCL') as CPSEId;
          const matchStateB: 'Identical' | 'Harmonized' | 'Equivalent' = action === 'SPLIT' ? 'Equivalent' : 'Harmonized';

          const newPrimaryRecord: NationalMaterialRecord = {
            nmcId: primaryNmc,
            version: 'v1.0',
            status: 'APPROVED & HARMONIZED',
            canonicalDescription: targetPair.cpseA?.description || targetPair.cpseB?.description || 'Harmonized National Master Material',
            category: targetPair.cpseA?.category || 'Piping & Structural',
            tags: ['Approved', 'ASME Standard', 'Harmonized'],
            attributes: {
              standardGrade: targetPair.attributes?.find(a => a.name.toLowerCase().includes('grade') || a.name.toLowerCase().includes('base'))?.cpseAValue || 'ASTM A106 Gr. B',
              nominalBore: targetPair.attributes?.find(a => a.name.toLowerCase().includes('bore') || a.name.toLowerCase().includes('size'))?.cpseAValue || '100 NB',
              scheduleWall: targetPair.attributes?.find(a => a.name.toLowerCase().includes('schedule') || a.name.toLowerCase().includes('wall'))?.cpseAValue || 'SCH 40',
              pressureRating: targetPair.attributes?.find(a => a.name.toLowerCase().includes('pressure') || a.name.toLowerCase().includes('class'))?.cpseAValue || '150 PSI Design',
              materialBase: targetPair.attributes?.find(a => a.name.toLowerCase().includes('material') || a.name.toLowerCase().includes('base'))?.cpseAValue || 'Carbon Steel',
            },
            mappedEntities: [
              { cpse: nodeA, localItemCode: targetPair.cpseA?.code || 'MAT-001', matchState: 'Identical' },
              { cpse: nodeB, localItemCode: targetPair.cpseB?.code || 'MAT-002', matchState: matchStateB }
            ],
            provenanceTrace: [
              {
                seed: `Approved via AI Review Queue by ${officer.name}`,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                note: `Steward Decision [${action}] committed to National Registry. Justification: ${reason}`
              }
            ],
            consolidatedDemand: '15,000 Units',
            estValueCr: '14.2'
          };
          updatedList = [newPrimaryRecord, ...prev];
        }

        // If action is SPLIT, also ensure the split variant record exists in National Registry
        if (action === 'SPLIT') {
          const splitNmc = `${primaryNmc}-V2`;
          if (!updatedList.some(r => r.nmcId === splitNmc)) {
            const nodeB: CPSEId = (targetPair.cpseB?.node || 'DEMO-NTPC') as CPSEId;
            const splitRecord: NationalMaterialRecord = {
              nmcId: splitNmc,
              version: 'v1.0',
              status: 'APPROVED & HARMONIZED',
              canonicalDescription: `${targetPair.cpseB?.description || 'High-Pressure Variant Spec'} (Class Variant)`,
              category: targetPair.cpseB?.category || targetPair.cpseA?.category || 'Piping & Structural',
              tags: ['Approved Variant', 'High-Pressure', 'Harmonized'],
              attributes: {
                standardGrade: targetPair.attributes?.find(a => a.name.toLowerCase().includes('grade'))?.cpseBValue || 'ASTM A106 Gr. B',
                nominalBore: targetPair.attributes?.find(a => a.name.toLowerCase().includes('bore'))?.cpseBValue || '100 NB',
                scheduleWall: targetPair.attributes?.find(a => a.name.toLowerCase().includes('schedule'))?.cpseBValue || 'SCH 40',
                pressureRating: targetPair.attributes?.find(a => a.name.toLowerCase().includes('pressure'))?.cpseBValue || '600 PSI (Class 600)',
                materialBase: targetPair.attributes?.find(a => a.name.toLowerCase().includes('material'))?.cpseBValue || 'Carbon Steel',
              },
              mappedEntities: [
                { cpse: nodeB, localItemCode: targetPair.cpseB?.code || 'P-77821', matchState: 'Identical' }
              ],
              provenanceTrace: [
                {
                  seed: `Split Variant Registered: ${splitNmc}`,
                  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                  note: `Separated into distinct high-pressure canonical identity per Steward Decision: ${reason}`
                }
              ],
              consolidatedDemand: '8,500 Units',
              estValueCr: '9.8'
            };
            updatedList = [splitRecord, ...updatedList];
          }
        }

        return updatedList;
      });

      // Add to Audit Log
      const newLog: AuditLogEntry = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: `Today, ${timestamp} IST`,
        actor: `${officer.name} (${officer.employeeId})`,
        entity: `${targetPair.proposedNmc} / ${targetPair.cpseA?.code || 'CPSE-A'}`,
        action: action === 'SPLIT' ? 'Split' : action === 'APPROVE' ? 'Approve' : action === 'REJECT' ? 'Reject' : 'Modify',
        reason,
        sessionHash,
        diffBefore: `Candidate grouping for ${targetPair.cpseA?.node || 'Node A'} and ${targetPair.cpseB?.node || 'Node B'}`,
        diffAfter:
          action === 'SPLIT'
            ? `Distinct identities registered: Class 150 utility variant vs Class 600 supercritical variant`
            : `Harmonized to canonical NMC ${targetPair.proposedNmc}`,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }

    // Refresh from backend API if available
    const freshNmcs = await fetchNationalMaterials();
    if (freshNmcs && freshNmcs.length > 0) {
      setNationalRegistry((prev) => {
        const map = new Map<string, NationalMaterialRecord>();
        freshNmcs.forEach(r => map.set(r.nmcId, r));
        prev.forEach(r => {
          if (!map.has(r.nmcId)) map.set(r.nmcId, r);
        });
        return Array.from(map.values());
      });
    }

    const updatedLogs = await fetchAuditLogs();
    if (updatedLogs && updatedLogs.length > 0) {
      setAuditLogs(updatedLogs);
    }
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedPairId(scenarioId);
    setActiveView('ai-review');
  };

  const handleImportSuccess = (newItems: MaterialItem[], cpseId: CPSEId, batch: ImportBatchRecord) => {
    setMaterials((prev) => [...newItems, ...prev]);
    const newLog: AuditLogEntry = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: `Today, ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} IST`,
      actor: `${officer.name} (${officer.employeeId})`,
      entity: `${batch.batchId} / ${cpseId}`,
      action: 'Ingest',
      reason: `Import Material Master dataset: ${batch.fileName} (${batch.recordCount} records imported)`,
      sessionHash: `#HEX-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
      diffBefore: `Source ERP Catalog Feed (${cpseId})`,
      diffAfter: `Ingested ${newItems.length} raw records — Pending AI Harmonization`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleOpenConflict = (candidateId?: string, materialItem?: MaterialItem) => {
    if (materialItem) {
      const existingPair = reviewPairs.find(
        (p) =>
          p.id === candidateId ||
          p.cpseA?.code === materialItem.code ||
          p.cpseB?.code === materialItem.code
      );

      if (existingPair) {
        setSelectedPairId(existingPair.id);
      } else {
        const dynamicId = `dyn-pair-${materialItem.id || Math.random().toString(36).substring(2, 7)}`;
        const firstCand = materialItem.candidates && materialItem.candidates[0];

        const newPair: ReviewCandidatePair = {
          id: dynamicId,
          reviewStatus: 'PENDING_REVIEW',
          proposedNmc: materialItem.mappedNmc || `NMC-${(materialItem.category || 'MAT').substring(0, 4).toUpperCase()}-00184`,
          initialRelationship: (materialItem.matchScore || 90) < 80 ? 'NEAR_DUPLICATE' : 'IDENTICAL',
          cpseA: {
            node: materialItem.cpse || 'DEMO-CPCL',
            code: materialItem.code || 'MAT-10023',
            description: materialItem.normalizedDescription || materialItem.rawErpFeed || 'Selected Material Record',
            facility: `${materialItem.cpse || 'DEMO-CPCL'} Primary Plant`,
            category: materialItem.category || 'Piping Materials',
            uom: materialItem.uom || 'NOS',
            mfr: materialItem.mfr,
            specimenLabel: `SPECIMEN A (${materialItem.code || 'CATALOG'})`,
          },
          cpseB: {
            node: firstCand?.cpse || 'DEMO-NTPC',
            code: firstCand?.code || `${materialItem.code || 'MAT'}-EQUIV`,
            description: firstCand?.description || `${materialItem.normalizedDescription || 'Material'} (Equivalent Spec)`,
            facility: `${firstCand?.cpse || 'DEMO-NTPC'} Sovereign Unit`,
            category: materialItem.category || 'Piping Materials',
            uom: materialItem.uom || 'NOS',
            mfr: materialItem.mfr,
            specimenLabel: `SPECIMEN B (${firstCand?.code || 'EQUIV'})`,
          },
          attributes: [
            {
              name: 'Material Grade / Spec',
              cpseAValue: materialItem.specifications?.standardSpec || 'Standard Technical Grade',
              cpseBValue: 'Standard Technical Grade',
              status: 'MATCH',
              note: 'Technical specification verified equivalent by AI Engine.',
            },
            {
              name: 'Nominal Dimension / Size',
              cpseAValue: materialItem.specifications?.nominalBore || 'Standard Dimension',
              cpseBValue: 'Standard Dimension',
              status: 'MATCH',
              note: 'Dimension parameters align across CPSE catalogs.',
            },
            {
              name: 'Unit of Measure (UOM)',
              cpseAValue: materialItem.uom || 'NOS',
              cpseBValue: materialItem.uom || 'NOS',
              status: 'MATCH',
            }
          ],
          conflict: {
            attribute: 'Specification Alignment',
            valueA: materialItem.uom ? `UOM: ${materialItem.uom}` : 'Standard Grade',
            valueB: firstCand ? `Equiv Score: ${firstCand.score}%` : 'Catalog Equiv',
            isCritical: (materialItem.matchScore || 90) < 80,
            hazardDescription: `Cross-CPSE evaluation requested for ${materialItem.normalizedDescription}. Technical attribute matrix audited before committing to National Master code.`,
            recommendation: (materialItem.matchScore || 90) < 80 ? 'SPLIT INTO DISTINCT NMCs' : 'APPROVE HARMONIZATION',
          },
          evidence: {
            overallScore: materialItem.matchScore || 89,
            descriptionSimilarity: 93,
            semanticEmbeddings: 91,
            extractedAttributeCompatibility: 95,
            taxonomyConcordance: 100,
            uomCompatibility: 100,
            manufacturerPartReference: materialItem.mfr ? 85 : 60,
          },
        };

        setReviewPairs((prev) => [newPair, ...prev]);
        setSelectedPairId(dynamicId);
      }
    } else if (candidateId) {
      setSelectedPairId(candidateId);
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
        /* Mobile Handheld Device View */
        <div className="w-full max-w-[440px] h-screen sm:h-[880px] sm:max-h-[92vh] sm:my-auto sm:rounded-2xl sm:border sm:border-slate-300 sm:shadow-2xl overflow-hidden flex flex-col bg-[#faf8ff] relative">
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
            {activeView === 'import' && (
              <ImportView
                onImportSuccess={handleImportSuccess}
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
        <div className="w-full h-screen flex flex-col overflow-hidden bg-[#faf8ff]">
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
                  nationalRegistry={nationalRegistry}
                />
              )}
              {activeView === 'import' && (
                <ImportView
                  onImportSuccess={handleImportSuccess}
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
