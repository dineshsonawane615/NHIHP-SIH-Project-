🚀 MATRA --- Material Alignment & Reconciliation Assistant

Smart India Hackathon 2026 --- SIH26099
AI-assisted cross-CPSE material master standardization, conflict
detection, and harmonization platform.

MATRA helps participating CPSEs identify potentially duplicate or
functionally similar material records, normalize technical descriptions,
detect critical specification conflicts, and create governed mappings to
a common National Material Code (NMC).

AI recommends. Engineering rules verify. Officers decide. MATRA
governs.

🔗 Live Demo

https://matra-material-alignment-reconcilia.vercel.app/

📌 Problem

Different CPSEs can maintain similar materials using different:

Material codes

Descriptions and abbreviations

Units of measurement

Technical specifications

Material grades

Standards

Classifications

For example:

CPSE A: PIPE CS 100NB SCH40 ASTM A106
CPSE B: SEAMLESS CS PIPE 4 INCH S/40 A106

Exact-text search may treat these as different records even when their
technical attributes indicate a potential relationship.

The opposite problem is equally important: two descriptions can look
very similar while having a critical engineering difference such as
pressure class, material grade, schedule, or standard.

MATRA therefore treats similarity as a recommendation, not automatic
approval.

🎯 Objectives

Standardize inconsistent material descriptions.

Extract important technical attributes from unstructured
descriptions.

Identify potential identical, near-duplicate, and functionally
equivalent records.

Detect critical engineering conflicts before approval.

Support human-in-the-loop material governance.

Create a common National Material Code (NMC) mapping.

Preserve original CPSE material codes for traceability.

Provide analytics and an audit/governance trail.

Provide a foundation for future ERP/SAP integration.

🚀 Key Features

Material Master Import

Upload existing CPSE material data using CSV and validate the records
before processing.

Technical Attribute Extraction

Extract attributes such as:

Material grade

Nominal size

Schedule

Pressure class

Standard

Unit of measure

Manufacturer/part references

Hybrid Matching

MATRA combines deterministic normalization, fuzzy matching, attribute
comparison, and optional AI-assisted extraction.

Conflict Detection

Critical differences are surfaced instead of allowing similarity alone
to create a merge.

Example:

Material A → 150 PSI
Material B → 600 PSI

Result → Critical conflict → Human review

Human-in-the-Loop Review

Reviewers can:

Approve

Modify

Reject

Split

The final material relationship remains a human governance decision.

National Material Registry

Approved relationships can be mapped to a common NMC:

CPSE Material Code
        ↓
National Material Code
        ↓
Standardized Material Identity

Original CPSE codes remain available for traceability.

Analytics

The platform can support:

Harmonization status

Candidate match counts

Pending reviews

Material category analysis

Cross-CPSE demand visibility

Procurement opportunity analysis

Audit & Governance

Review actions can record:

User/role

Timestamp

Action

Decision

Justification

Before/after information where applicable

🔄 System Workflow

CPSE Material Master
        ↓
CSV / API Ingestion
        ↓
Validation
        ↓
Normalization
        ↓
Technical Attribute Extraction
        ↓
Candidate Matching
        ↓
Conflict Detection
        ↓
AI-Assisted Recommendation
        ↓
Human Review
        ↓
Approve / Modify / Reject / Split
        ↓
National Material Code Mapping
        ↓
Registry + Analytics + Audit
        ↓
Future ERP/SAP Integration

🏗️ Architecture

┌──────────────────────────────────────────────┐
│              PRESENTATION LAYER              │
│ React + TypeScript + Vite + TailwindCSS     │
│ Dashboard | AI Review | Registry | Analytics │
└──────────────────────┬───────────────────────┘
                       │ REST / JSON
                       ▼
┌──────────────────────────────────────────────┐
│                  API LAYER                   │
│ FastAPI + Uvicorn + Pydantic + CORS        │
│ Validation + Authentication + Rate Limits  │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          HARMONIZATION ENGINE                │
│ Normalization → Extraction → Matching       │
│ → Conflict Detection → Recommendation       │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 DATA LAYER                   │
│ SQLAlchemy + SQLite (prototype)             │
│ Materials | Attributes | Mappings | NMC     │
│ Audit Events                                 │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│           FUTURE INTEGRATION                 │
│ SAP / Oracle / ERP APIs and Webhooks        │
└──────────────────────────────────────────────┘

🧠 AI & Matching Methodology

MATRA uses a layered approach instead of relying on an LLM alone.

Raw Description
      ↓
Text & Unit Normalization
      ↓
Regex / Dictionary Extraction
      ↓
Fuzzy Similarity
      ↓
Technical Attribute Comparison
      ↓
Conflict Evaluation
      ↓
AI-Assisted Interpretation
      ↓
Human Review

Normalization Examples

CS      → CARBON STEEL
SS      → STAINLESS STEEL
SCH 40  → SCH40

Matching Evidence

The matching engine can consider:

Description similarity

Token similarity

Normalized attributes

Dimensions

Material grade

Standards

Pressure/class information

Other configured domain rules

Important Safety Principle

A high similarity score does not automatically mean two materials
are interchangeable.

High textual similarity
        +
Critical attribute conflict
        =
Human Review Required

🛠️ Technology Stack

Layer                 Technology

Frontend              React, TypeScript, Vite
Styling               TailwindCSS
Backend               Python, FastAPI, Uvicorn
Validation            Pydantic
ORM                   SQLAlchemy
Prototype Database    SQLite
Matching              RapidFuzz
Extraction            Regex + dictionaries
AI                    Google Gemini API, when configured
Security              CORS, validation, rate limiting
Testing               Python security/functional tests
Frontend Deployment   Vercel
Backend Deployment    Render / Cloud Run-style deployment

📁 Project Structure

NHIHP-SIH-Project-/
│
├── backend/
│   ├── database.py
│   ├── harmonization_engine.py
│   ├── main.py
│   ├── models.py
│   ├── seed_data.py
│   └── nmihp.db
│
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon.jpg
│   └── logo.jpg
│
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── views/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── tests_security.py
├── .env.example
├── package.json
├── requirements.txt
├── tsconfig.json
├── vite.config.ts
└── README.md

⚙️ Prerequisites

Install:

Node.js 18+

npm 9+

Python 3.10+

Git

Verify:

node --version
npm --version
python --version
git --version

📥 Installation

1. Clone

git clone https://github.com/dineshsonawane615/NHIHP-SIH-Project-.git
cd NHIHP-SIH-Project-

2. Frontend dependencies

npm install

3. Backend dependencies

python -m pip install -r requirements.txt

4. Environment file

Windows PowerShell:

Copy-Item .env.example .env

Linux/macOS:

cp .env.example .env

5. Start backend

python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

Backend:

http://localhost:8000

Swagger:

http://localhost:8000/docs

6. Start frontend

Open another terminal:

npm run dev

Frontend:

http://localhost:3000

🔐 Environment Variables

Create .env in the project root.

Example:

GEMINI_API_KEY=your-gemini-api-key

ENVIRONMENT=development

ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

APP_URL=http://localhost:3000

JWT_SECRET_KEY=change-this-in-production

VITE_AUTH_TOKEN=development-token

⚠️ Never commit secrets

Do not commit:

.env

Commit:

.env.example

Never put real API keys, passwords, JWT secrets, or production
credentials in the repository.

🗄️ Database

The current prototype uses:

SQLite + SQLAlchemy

Database:

backend/nmihp.db

Conceptual entities include:

Entity                Purpose

Materials             Source and normalized CPSE materials
Material Attributes   Extracted technical properties
National Materials    Canonical NMC records
Material Mappings     Candidate relationships and matching evidence
Audit Logs            Governance and review events

For a large concurrent enterprise deployment, PostgreSQL or another
managed relational database would be a suitable next step.

🔌 API

Representative endpoints:

Method   Endpoint                            Description

GET      /                                 API health/status
GET      /api/materials                    Retrieve materials
GET      /api/materials/{material_id}      Material details
GET      /api/matches                      Candidate matches
POST     /api/matches/{pair_id}/decision   Human review decision
GET      /api/national-materials           NMC registry
GET      /api/analytics                    Analytics
GET      /api/audit                        Audit events
POST     /api/materials/upload             Upload material CSV
POST     /api/materials                    Create material
POST     /api/ai/harmonize                 AI-assisted harmonization
GET      /api/corpus                       Material corpus search

Interactive API documentation:

http://localhost:8000/docs

🔒 Security

The prototype includes security-oriented controls such as:

SQLAlchemy parameterized database operations

Pydantic input validation

CORS configuration

Rate limiting

Input length validation

File extension/type restrictions

Role-aware review workflow

Environment-based secret configuration

Production deployment should additionally include organization-specific
identity, network security, penetration testing, logging, monitoring,
and compliance controls.

🧪 Testing

Run the available test suite:

$env:PYTHONIOENCODING="utf-8"
python tests_security.py

The tests cover areas such as:

Backend reachability

Material retrieval

Input validation

Decision validation

AI request schema validation

File upload restrictions

Security-related request handling

🚀 Deployment

Prototype deployment architecture:

User Browser
     ↓
Vercel
React / Vite Frontend
     ↓
REST API
     ↓
FastAPI Backend
     ↓
SQLite / PostgreSQL

The frontend and backend are separated so they can be deployed and
scaled independently.

📈 Scalability Roadmap

Current Prototype

React + FastAPI + SQLite

Production Evolution

PostgreSQL
      ↓
Vector / Semantic Retrieval
      ↓
Background Processing
      ↓
Enterprise SSO / RBAC
      ↓
SAP / Oracle Integration
      ↓
Centralized CPSE Governance

Large catalogs can be processed using asynchronous/background workers
and batch pipelines.

⚠️ Current Limitations

The prototype uses demonstration/synthetic data and should not be
interpreted as live CPSE master data.

AI-assisted extraction depends on API availability and configured
model quotas.

SQLite is suitable for a prototype but is not the preferred database
for high-concurrency enterprise deployment.

Engineering rules need to be expanded and validated for additional
material categories.

AI similarity does not prove engineering equivalence; human
validation remains important.

Real SAP/Oracle integration requires organization-specific APIs,
authentication, data contracts, and security approvals.

🔮 Future Scope

ERP Integration

SAP S/4HANA integration

Oracle EBS integration

Controlled ERP writeback

Master-data synchronization

Advanced Search

Embedding-based retrieval

Vector database

Hybrid keyword + semantic search

Cross-CPSE similarity search

Sovereign / Offline AI

Local LLM deployment

Private inference

Zero-external-API environments

Organization-controlled model serving

Mobile Material Verification

Barcode scanning

QR scanning

Warehouse lookup

Field verification

Photo-assisted identification

Advanced Governance

Enterprise SSO

Fine-grained RBAC

Approval hierarchies

Data lineage

Versioned material masters

Advanced audit and retention controls

🌍 Use Cases

Cross-CPSE Harmonization

Identify potential relationships between material records maintained by
different CPSEs.

Inventory Visibility

Create a common view of related materials and their source records.

Procurement Analytics

Analyze aggregated material demand and identify potential
joint-procurement opportunities.

Material Master Governance

Help material stewards review and maintain standardized material
identities.

Engineering Review

Surface critical technical differences before a proposed relationship is
approved.

🎥 Demo

Live Application

https://matra-material-alignment-reconcilia.vercel.app/

Recommended Demo Flow

Sign In
  ↓
Import Material Master
  ↓
Dashboard
  ↓
AI Review
  ↓
Technical Attribute Comparison
  ↓
Conflict Detection
  ↓
Approve / Modify / Reject / Split
  ↓
National Material Registry
  ↓
Audit Trail
  ↓
Procurement Analytics

📸 Screenshots

Recommended repository screenshots:

docs/screenshots/dashboard.png
docs/screenshots/ai-review.png
docs/screenshots/import-material.png
docs/screenshots/national-registry.png
docs/screenshots/audit-log.png

Example:

![MATRA Dashboard](docs/screenshots/dashboard.png)

🎯 Project Vision

MATRA aims to move from:

Many Codes
Many Descriptions
Fragmented Visibility
        ↓
Common Material Intelligence
        ↓
Governed National Material Identity

The platform is designed as an intelligence and governance layer rather
than a replacement for existing ERP systems.

AI recommends. Engineering rules verify. Officers decide. MATRA
governs.

📚 References

Smart India Hackathon 2026 --- SIH26099

FastAPI Documentation --- https://fastapi.tiangolo.com/

React Documentation --- https://react.dev/

Google Gemini API Documentation --- https://ai.google.dev/

SQLAlchemy Documentation --- https://www.sqlalchemy.org/

RapidFuzz Documentation --- https://rapidfuzz.github.io/RapidFuzz/

Tailwind CSS Documentation --- https://tailwindcss.com/

👥 Team

Team Legal Predators

Project: MATRA --- Material Alignment & Reconciliation Assistant

Smart India Hackathon 2026 --- SIH26099

⭐ Support

If you find the project useful, consider giving the repository a ⭐.

MATRA --- From fragmented material catalogs to a governed material
identity.
