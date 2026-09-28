from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Material(Base):
    __tablename__ = "materials"

    id = Column(String, primary_key=True, index=True)
    source_system = Column(String, index=True)  # CPSE ID, e.g., DEMO-IOCL, DEMO-CPCL, DEMO-NTPC
    material_code = Column(String, index=True)
    description = Column(Text)
    category = Column(String, index=True)
    uom = Column(String)
    manufacturer = Column(String)
    part_number = Column(String, index=True)
    specification_raw = Column(Text)
    status = Column(String, default="NEW")  # NEW, NORMALIZED, ANALYZED, PENDING_REVIEW, APPROVED, HARMONIZED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    attributes = relationship("MaterialAttribute", back_populates="material", cascade="all, delete-orphan")

class MaterialAttribute(Base):
    __tablename__ = "material_attributes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    material_id = Column(String, ForeignKey("materials.id"))
    attribute_name = Column(String, index=True)
    attribute_value_raw = Column(String)
    normalized_value = Column(String)
    unit = Column(String, nullable=True)
    standard_context = Column(String, nullable=True)
    extraction_source = Column(String, default="REGEX_NLP")
    confidence = Column(Float, default=1.0)

    material = relationship("Material", back_populates="attributes")

class NationalMaterial(Base):
    __tablename__ = "national_materials"

    nmc_id = Column(String, primary_key=True, index=True)  # e.g., NMC-PIPE-000184
    canonical_description = Column(Text)
    category = Column(String, index=True)
    classification_code = Column(String, default="UNSPSC-40172600")
    status = Column(String, default="APPROVED")
    version = Column(String, default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MaterialMapping(Base):
    __tablename__ = "material_mappings"

    id = Column(String, primary_key=True, index=True)
    source_material_id = Column(String, ForeignKey("materials.id"))
    candidate_material_id = Column(String, ForeignKey("materials.id"))
    nmc_id = Column(String, ForeignKey("national_materials.nmc_id"), nullable=True)
    relationship_type = Column(String, default="IDENTICAL")  # IDENTICAL, NEAR_DUPLICATE, FUNCTIONALLY_EQUIVALENT, NOT_A_MATCH
    confidence = Column(Float)
    match_breakdown_json = Column(JSON)
    conflicts_json = Column(JSON)
    review_status = Column(String, default="PENDING_REVIEW")  # PENDING_REVIEW, APPROVED, MODIFIED, SPLIT, REJECTED
    recommendation = Column(String, default="HUMAN_REVIEW")  # HIGH_CONFIDENCE, HUMAN_REVIEW, NO_MATCH
    decision = Column(String, nullable=True)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    entity_type = Column(String)
    entity_id = Column(String)
    action = Column(String)  # Create, Approve, Modify, Split, Reject, Override, Deprecate, Ingest
    old_value_json = Column(Text, nullable=True)
    new_value_json = Column(Text, nullable=True)
    actor = Column(String)
    reason = Column(Text)
    session_hash = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
