import os
import csv
import json
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models import Material, MaterialAttribute, NationalMaterial, MaterialMapping, AuditLog
from backend.harmonization_engine import extract_technical_attributes, calculate_similarity_and_conflicts, generate_nmc_code

CSV_PATH = r"c:\Users\Dinesh\Downloads\Unihack_ Sample Dataset - Input.csv"

def seed_database_if_empty(db: Session):
    """Seed initial materials, AI review pairs, National Registry, and Audit logs."""
    existing_count = db.query(Material).count()
    if existing_count > 0:
        return

    print("Seeding NMIHP database with sample records and dataset...")

    # 1. Seed Core Demo Scenarios required by PRD & Workflow docs
    scenarios_data = [
        # Scenario C: Critical Conflict
        {
            "pair_id": "conflict-pipe-01",
            "cpse_a": {
                "id": "MAT-CPCL-10023",
                "source_system": "DEMO-CPCL",
                "material_code": "MAT-10023",
                "description": "HIGH PRESSURE UTILITY VALVE 150 PSI 100NB",
                "category": "Valves & Piping",
                "uom": "NOS",
                "manufacturer": "L&T Valves",
                "part_number": "V-150-100",
                "specification_raw": "Standard 150 PSI ASME Class B16.34"
            },
            "cpse_b": {
                "id": "MAT-IOCL-P77821",
                "source_system": "DEMO-IOCL",
                "material_code": "P-77821",
                "description": "HIGH PRESSURE SUPERCRITICAL VALVE 600 PSI 100NB",
                "category": "Valves & Piping",
                "uom": "NOS",
                "manufacturer": "L&T Valves",
                "part_number": "V-600-100",
                "specification_raw": "Supercritical 600 PSI ASME Class B16.34"
            },
            "proposed_nmc": "NMC-VALVE-000027",
            "canonical_desc": "High Pressure Steel Control Valve 100NB"
        },
        # Scenario A: Obvious Duplicate
        {
            "pair_id": "duplicate-bolt-02",
            "cpse_a": {
                "id": "MAT-SAIL-BLT101",
                "source_system": "DEMO-SAIL",
                "material_code": "BLT-101",
                "description": "CS BOLT M10 X 50 FULL THREAD",
                "category": "Fasteners & Hardware",
                "uom": "PCS",
                "manufacturer": "Unbrako",
                "part_number": "UB-M10-50",
                "specification_raw": "Carbon Steel Hex Head Bolt Grade 8.8"
            },
            "cpse_b": {
                "id": "MAT-NTPC-55018",
                "source_system": "DEMO-NTPC",
                "material_code": "BOLT-55018",
                "description": "CARBON STEEL HEXAGONAL BOLT M10X50MM",
                "category": "Fasteners & Hardware",
                "uom": "PCS",
                "manufacturer": "Unbrako",
                "part_number": "UB-M10-50",
                "specification_raw": "CS Hex Bolt M10-50 ISO 4014"
            },
            "proposed_nmc": "NMC-BOLT-000001",
            "canonical_desc": "Carbon Steel Hexagonal Head Bolt M10 x 50mm"
        },
        # Scenario B: Engineering-aware match (100NB vs 4 Inch Pipe)
        {
            "pair_id": "eng-pipe-03",
            "cpse_a": {
                "id": "MAT-ONGC-P009",
                "source_system": "DEMO-ONGC",
                "material_code": "ONG-PIPE-009",
                "description": "SEAMLESS CS PIPE 100NB SCH40 ASTM A106 GRADE B",
                "category": "Pipes & Tubes",
                "uom": "MTR",
                "manufacturer": "Jindal SAW",
                "part_number": "JSAW-100-SCH40",
                "specification_raw": "ASTM A106-B Seamless Pipe 100NB SCH40"
            },
            "cpse_b": {
                "id": "MAT-BPCL-450009",
                "source_system": "DEMO-BPCL",
                "material_code": "BPCL-45000987",
                "description": "CARBON STEEL SEAMLESS PIPE 4 INCH SCH 40 A106-B",
                "category": "Pipes & Tubes",
                "uom": "MTR",
                "manufacturer": "Jindal SAW",
                "part_number": "JSAW-4IN-SCH40",
                "specification_raw": "4 Inch Nominal Bore Seamless Pipe ASTM A106 Gr B"
            },
            "proposed_nmc": "NMC-PIPE-000184",
            "canonical_desc": "Seamless Carbon Steel Pipe 100NB (4 Inch) SCH40 ASTM A106 Grade B"
        }
    ]

    # Create National Materials & Candidate Pairs
    for sc in scenarios_data:
        # Save Material A
        mat_a_data = sc["cpse_a"]
        mat_a = Material(
            id=mat_a_data["id"],
            source_system=mat_a_data["source_system"],
            material_code=mat_a_data["material_code"],
            description=mat_a_data["description"],
            category=mat_a_data["category"],
            uom=mat_a_data["uom"],
            manufacturer=mat_a_data["manufacturer"],
            part_number=mat_a_data["part_number"],
            specification_raw=mat_a_data["specification_raw"],
            status="ANALYZED"
        )
        db.add(mat_a)

        # Save Material B
        mat_b_data = sc["cpse_b"]
        mat_b = Material(
            id=mat_b_data["id"],
            source_system=mat_b_data["source_system"],
            material_code=mat_b_data["material_code"],
            description=mat_b_data["description"],
            category=mat_b_data["category"],
            uom=mat_b_data["uom"],
            manufacturer=mat_b_data["manufacturer"],
            part_number=mat_b_data["part_number"],
            specification_raw=mat_b_data["specification_raw"],
            status="ANALYZED"
        )
        db.add(mat_b)

        # Extract attributes
        attrs_a = extract_technical_attributes(mat_a.description, mat_a.category)
        attrs_b = extract_technical_attributes(mat_b.description, mat_b.category)

        for attr in attrs_a:
            db.add(MaterialAttribute(material_id=mat_a.id, **attr))
        for attr in attrs_b:
            db.add(MaterialAttribute(material_id=mat_b.id, **attr))

        # Calculate similarity
        mat_a_dict = {**mat_a_data, "extracted_attributes": attrs_a}
        mat_b_dict = {**mat_b_data, "extracted_attributes": attrs_b}

        confidence, match_breakdown, conflicts, recommendation, rel_type = calculate_similarity_and_conflicts(mat_a_dict, mat_b_dict)

        # Create proposed National Material Record
        nmc = NationalMaterial(
            nmc_id=sc["proposed_nmc"],
            canonical_description=sc["canonical_desc"],
            category=mat_a_data["category"],
            classification_code="UNSPSC-40172600",
            status="APPROVED" if sc["pair_id"] != "conflict-pipe-01" else "PENDING_REVIEW",
            version="1.0"
        )
        db.add(nmc)

        # Create Mapping Record
        mapping = MaterialMapping(
            id=sc["pair_id"],
            source_material_id=mat_a.id,
            candidate_material_id=mat_b.id,
            nmc_id=sc["proposed_nmc"],
            relationship_type=rel_type,
            confidence=confidence,
            match_breakdown_json=match_breakdown,
            conflicts_json=conflicts,
            review_status="PENDING_REVIEW",
            recommendation=recommendation
        )
        db.add(mapping)

    # 2. Process provided CSV dataset files if present
    corpus_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "material_description_corpus.csv.xls")
    
    if os.path.exists(corpus_path):
        try:
            with open(corpus_path, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                count = 0
                for row in reader:
                    desc = (row.get("description") or "").strip()
                    if not desc or len(desc) < 3:
                        continue
                    count += 1
                    if count > 100:  # Ingest top 100 material corpus items
                        break
                    
                    corp_id = row.get("corpus_id") or f"M{count:06d}"
                    org = row.get("organization") or "Indian Oil Corporation Limited"
                    cpse_code = "IOCL" if "Indian Oil" in org else "CPSE"
                    hint = row.get("item_type_hint") or row.get("product_category") or "Industrial Materials"
                    uom = row.get("unit") or "Nos."
                    tender_ref = row.get("tender_reference") or row.get("tender_id") or f"REF-{count}"
                    
                    mat_id = f"CORPUS-{corp_id}"
                    corpus_mat = Material(
                        id=mat_id,
                        source_system=f"DEMO-{cpse_code}",
                        material_code=corp_id,
                        description=desc,
                        category=hint.title(),
                        uom=uom,
                        manufacturer=org,
                        part_number=tender_ref,
                        specification_raw=f"Source: {row.get('source_system', '')} | Section: {row.get('source_section', '')}",
                        status="ANALYZED"
                    )
                    db.add(corpus_mat)

                    attrs = extract_technical_attributes(desc, hint)
                    for attr in attrs:
                        db.add(MaterialAttribute(material_id=mat_id, **attr))

            print(f"Successfully ingested {count} records from material_description_corpus.csv.xls.")
        except Exception as e:
            print(f"Error reading material corpus CSV: {e}")

    if os.path.exists(CSV_PATH):
        try:
            with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
                reader = csv.DictReader(f)
                count = 0
                for row in reader:
                    count += 1
                    if count > 50:  # Ingest top 50 records for smooth initial load
                        break
                    mfg_part = row.get("Mfg_Part_Num") or f"PART-{count:04d}"
                    desc = row.get("Part_Desc") or f"Item Description {count}"
                    brand = row.get("Unilog_Brand") or row.get("E1_Brand") or row.get("Part_Manuf") or "Generic"
                    
                    mat_id = f"CSV-MAT-{count:04d}"
                    csv_mat = Material(
                        id=mat_id,
                        source_system="DEMO-CPCL",
                        material_code=f"CPCL-{1000 + count}",
                        description=desc,
                        category="Industrial Components",
                        uom="EA",
                        manufacturer=brand,
                        part_number=mfg_part,
                        specification_raw=f"Brand: {brand}, Part Number: {mfg_part}",
                        status="ANALYZED"
                    )
                    db.add(csv_mat)

                    attrs = extract_technical_attributes(desc, "Industrial Components")
                    for attr in attrs:
                        db.add(MaterialAttribute(material_id=mat_id, **attr))

            print(f"Successfully ingested {count} dataset records from CSV file.")
        except Exception as e:
            print(f"Error reading dataset CSV: {e}")

    # 3. Add initial Audit Log Entries
    initial_logs = [
        AuditLog(
            id="AUD-90124",
            entity_type="Batch Pipeline",
            entity_id="CPCL Catalog Ingest",
            action="Ingest",
            reason="Ingested 1,250 raw material records from CPCL SAP MM extract.",
            actor="System Ingestion Gateway",
            session_hash="#HEX-89A01C",
            timestamp=datetime.utcnow()
        ),
        AuditLog(
            id="AUD-90125",
            entity_type="Governance Review",
            entity_id="NMC-PIPE-000184",
            action="Approve",
            reason="Confirmed 100NB to 4 INCH nominal pipe size equivalence as per ASME B36.10M standard.",
            actor="Rajesh Kumar (DS-78819)",
            session_hash="#HEX-C71A90",
            timestamp=datetime.utcnow()
        )
    ]
    for log in initial_logs:
        db.add(log)

    db.commit()
    print("Database seeding completed successfully.")
