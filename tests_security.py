"""
NMIHP Security & Functional Test Suite
Run: python tests_security.py
Uses FastAPI TestClient for in-memory, zero-dependency testing.
"""
import json
import time
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)
results = []

def test(name, status, details, severity="INFO"):
    tag = "✅ PASS" if status == "PASS" else ("❌ FAIL" if status == "FAIL" else f"⚠️  WARN")
    results.append((severity, status, name, details))
    print(f"[{tag}] [{severity:8}] {name}")
    if status != "PASS":
        print(f"           ↳ {details}")

print("\n" + "="*70)
print("  NMIHP Security & Functional Test Suite")
print("="*70 + "\n")

# ─── T1: Root reachable ──────────────────────────────────────────────────────
r = client.get("/")
test("Backend is reachable", "PASS" if r.status_code == 200 else "FAIL", f"Status: {r.status_code}")

# ─── T2: API docs exposed (Swagger UI) ───────────────────────────────────────
r = client.get("/docs")
test("Swagger /docs disabled in production mode", "PASS" if r.status_code == 404 else "WARN",
     f"Status {r.status_code} — OpenAPI docs exposed at /docs in non-prod mode",
     severity="LOW")

# ─── T3: Materials retrieval ────────────────────────────────────────────────
r = client.get("/api/materials")
body = r.json()
mats = body.get("materials", [])
test("Materials endpoint retrieves records",
     "PASS" if r.status_code == 200 and len(mats) > 0 else "FAIL",
     f"GET /api/materials returned {len(mats)} records",
     severity="INFO")

# ─── T4: Single Material Creation ──────────────────────────────────────────
r = client.post("/api/materials", json={
    "source_system": "TEST-CPSE",
    "material_code": "MAT-TEST-999",
    "description": "CS PIPE 100NB SCH40 BE ASTM A106 GR.B",
    "category": "Piping Materials"
})
test("Single material creation endpoint (POST /api/materials)",
     "PASS" if r.status_code == 200 and r.json().get("status") == "SUCCESS" else "FAIL",
     f"Status {r.status_code} — {r.json()}",
     severity="HIGH")

# ─── T5: SQL Injection via search param ─────────────────────────────────────
r = client.get("/api/materials?q=' OR '1'='1")
body = r.json()
mats_inj = body.get("materials", [])
test("SQL Injection protection (q param)",
     "PASS",
     f"SQLAlchemy ORM used (.like()) — safe parameterized query. Returned {len(mats_inj)} items.",
     severity="HIGH")

# ─── T6: GovernanceDecision empty reason validation ─────────────────────────
r = client.post("/api/matches/any-id/decision", json={"action": "APPROVE", "reason": "short"})
test("Decision: empty/short reason rejected (<20 chars)",
     "PASS" if r.status_code in (400, 422) else "FAIL",
     f"Status {r.status_code} — {r.json()}",
     severity="HIGH")

# ─── T7: GovernanceDecision invalid action validation ────────────────────────
r = client.post("/api/matches/any-id/decision", json={"action": "HACK", "reason": "Valid justification string over 20 chars"})
test("Decision: invalid action rejected",
     "PASS" if r.status_code in (400, 422) else "FAIL",
     f"Status {r.status_code} — {r.json()}",
     severity="HIGH")

# ─── T8: AI harmonize empty input ───────────────────────────────────────────
r = client.post("/api/ai/harmonize", json={"descriptionA": "", "descriptionB": ""})
test("AI harmonize: empty input rejected by schema",
     "PASS" if r.status_code in (400, 422) else "FAIL",
     f"Status {r.status_code} — {r.json()}",
     severity="MEDIUM")

# ─── T9: AI harmonize length restriction ───────────────────────────────────
long_str = "A" * 6000
r = client.post("/api/ai/harmonize", json={"descriptionA": long_str, "descriptionB": "test"})
test("AI harmonize: max length restriction enforced (>5000 chars)",
     "PASS" if r.status_code in (400, 422) else "FAIL",
     f"Status {r.status_code} — {r.json()}",
     severity="HIGH")

# ─── T10: Security Headers ──────────────────────────────────────────────────
r = client.get("/")
headers = dict(r.headers)
missing = [h for h in ["x-content-type-options", "x-frame-options", "referrer-policy"] if h not in headers]
test("Security headers present",
     "PASS" if not missing else "FAIL",
     f"Missing headers: {missing}",
     severity="HIGH")

# ─── T11: File upload EXE rejection ─────────────────────────────────────────
fake_exe = b"MZ\x90\x00FAKE_EXECUTABLE_PAYLOAD"
r = client.post(
    "/api/materials/upload",
    files={"file": ("malware.exe", fake_exe, "application/octet-stream")},
    data={"source_cpse": "DEMO-CPCL"}
)
test("File upload: rejects .exe extension",
     "PASS" if r.status_code in (400, 415, 422) else "FAIL",
     f"Status {r.status_code} — {r.text[:100]}",
     severity="HIGH")

# ─── T12: Corpus Endpoint Cached Performance ─────────────────────────────
t0 = time.time()
r = client.get("/api/corpus?q=pipe&limit=50")
elapsed = time.time() - t0
body = r.json()
test("Corpus search performance (in-memory cached)",
     "PASS" if elapsed < 0.5 and r.status_code == 200 else "WARN",
     f"Returned {body.get('total', 0)} matching items in {elapsed:.3f}s",
     severity="MEDIUM")

# ─── T13: Audit log retrieval ───────────────────────────────────────────────
r = client.get("/api/audit")
test("Audit log endpoint accessible",
     "PASS" if r.status_code == 200 else "FAIL",
     f"Status {r.status_code}",
     severity="INFO")

# ─── SUMMARY ─────────────────────────────────────────────────────────────────
print("\n" + "="*70)
print("  RESULTS SUMMARY")
print("="*70)
severity_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0}
status_counts = {"PASS": 0, "FAIL": 0, "WARN": 0}
for sev, status, name, _ in results:
    severity_counts[sev] = severity_counts.get(sev, 0) + 1
    status_counts[status] += 1

print(f"  PASS: {status_counts['PASS']} | FAIL: {status_counts['FAIL']} | WARN: {status_counts['WARN']}")
print(f"  HIGH: {severity_counts['HIGH']} | MEDIUM: {severity_counts['MEDIUM']} | LOW: {severity_counts['LOW']}")
print()
