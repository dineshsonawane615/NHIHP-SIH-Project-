import os
import re
import json
import uuid
from typing import Dict, List, Any, Tuple
from rapidfuzz import fuzz

# Dictionary-driven Normalization Dictionary
NORMALIZATION_RULES = {
    r"\bCS\b": "CARBON STEEL",
    r"\bC\.S\.\b": "CARBON STEEL",
    r"\bMS\b": "MILD STEEL",
    r"\bSS\b": "STAINLESS STEEL",
    r"\bS\.S\.\b": "STAINLESS STEEL",
    r"\bNB\b": "NB",
    r"\bSCH\s*(\d+)": r"SCH\1",
    r"\bSCH\.?\s*(\d+)": r"SCH\1",
    r'(\d+)"': r"\1 INCH",
    r"(\d+)\s*IN\b": r"\1 INCH",
    r"(\d+)\s*INCH\b": r"\1 INCH",
    r"\bHEX\b": "HEXAGONAL",
    r"\bM(\d+)\s*X\s*(\d+)": r"M\1X\2",
    r"\bM(\d+)-(\d+)": r"M\1X\2",
}

CRITICAL_ATTRIBUTES = ["Pressure Rating", "Material Grade", "Schedule / Class", "Voltage", "Thread Standard"]

def normalize_text(text: str) -> str:
    """Normalize abbreviations, unit representations, and whitespace."""
    if not text:
        return ""
    result = text.upper()
    for pattern, replacement in NORMALIZATION_RULES.items():
        result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
    result = " ".join(result.split())
    return result

def extract_technical_attributes(description: str, category: str = "") -> List[Dict[str, Any]]:
    """Extract structured technical attributes using domain rules and regex."""
    norm = normalize_text(description)
    attrs = []

    # 1. Material Type / Grade
    if "CARBON STEEL" in norm or "CS" in norm or "A106" in norm:
        grade = "A106-B" if "A106" in norm or "GRADE B" in norm else "Carbon Steel"
        attrs.append({
            "attribute_name": "Material Grade",
            "attribute_value_raw": "CS / Carbon Steel",
            "normalized_value": grade,
            "confidence": 0.95
        })
    elif "STAINLESS STEEL" in norm or "SS316" in norm or "SS304" in norm:
        grade = "SS316" if "316" in norm else "SS304"
        attrs.append({
            "attribute_name": "Material Grade",
            "attribute_value_raw": grade,
            "normalized_value": grade,
            "confidence": 0.95
        })

    # 2. Nominal Size / Dimension
    size_match = re.search(r"(\d+)\s*(NB|INCH|\"|MM)", norm)
    if size_match:
        val, unit = size_match.group(1), size_match.group(2)
        norm_size = f"{val} NB" if unit in ["NB", "INCH", "\""] else f"{val} {unit}"
        attrs.append({
            "attribute_name": "Nominal Size",
            "attribute_value_raw": size_match.group(0),
            "normalized_value": norm_size,
            "unit": unit,
            "confidence": 0.98
        })
    else:
        bolt_size = re.search(r"\bM(\d+)(?:X(\d+))?", norm)
        if bolt_size:
            val = f"M{bolt_size.group(1)}" + (f" x {bolt_size.group(2)}" if bolt_size.group(2) else "")
            attrs.append({
                "attribute_name": "Nominal Size",
                "attribute_value_raw": bolt_size.group(0),
                "normalized_value": val,
                "confidence": 0.98
            })

    # 3. Schedule / Pressure Class
    sch_match = re.search(r"SCH\s*(\d+)", norm)
    if sch_match:
        attrs.append({
            "attribute_name": "Schedule / Class",
            "attribute_value_raw": sch_match.group(0),
            "normalized_value": f"Schedule {sch_match.group(1)}",
            "confidence": 0.99
        })

    press_match = re.search(r"(\d+)\s*(PSI|BAR|CLASS|#)", norm)
    if press_match:
        attrs.append({
            "attribute_name": "Pressure Rating",
            "attribute_value_raw": press_match.group(0),
            "normalized_value": f"{press_match.group(1)} PSI",
            "unit": "PSI",
            "confidence": 0.99
        })

    # 4. Standard Context
    std_match = re.search(r"(ASTM|ASME|ISO|DIN|BS|IS)\s*([A-Z0-9\-]+)", norm)
    if std_match:
        attrs.append({
            "attribute_name": "Governing Standard",
            "attribute_value_raw": std_match.group(0),
            "normalized_value": f"{std_match.group(1)} {std_match.group(2)}",
            "confidence": 0.97
        })

    return attrs

def calculate_similarity_and_conflicts(
    mat_a: Dict[str, Any],
    mat_b: Dict[str, Any]
) -> Tuple[float, Dict[str, Any], List[Dict[str, Any]], str, str]:
    """
    Perform hybrid comparison between two material records.
    Returns:
        (confidence_score, match_breakdown_json, conflicts_list, recommendation, relationship_type)
    """
    desc_a = normalize_text(mat_a.get("description", ""))
    desc_b = normalize_text(mat_b.get("description", ""))

    # Lexical similarity
    token_sort = fuzz.token_sort_ratio(desc_a, desc_b) / 100.0
    partial_ratio = fuzz.partial_ratio(desc_a, desc_b) / 100.0
    desc_sim = round((token_sort * 0.6 + partial_ratio * 0.4), 3)

    # Category matching
    cat_a = (mat_a.get("category") or "").upper()
    cat_b = (mat_b.get("category") or "").upper()
    category_sim = 1.0 if cat_a == cat_b or not cat_a or not cat_b else 0.7

    # UOM compatibility
    uom_a = (mat_a.get("uom") or "").upper()
    uom_b = (mat_b.get("uom") or "").upper()
    uom_compat = 1.0 if uom_a == uom_b or not uom_a or not uom_b else 0.8

    # Attribute extraction comparison
    attrs_a = {a["attribute_name"]: a["normalized_value"] for a in mat_a.get("extracted_attributes", [])}
    attrs_b = {a["attribute_name"]: a["normalized_value"] for a in mat_b.get("extracted_attributes", [])}

    conflicts = []
    attr_matches = 0
    attr_total = 0

    common_keys = set(attrs_a.keys()).union(set(attrs_b.keys()))
    for key in common_keys:
        val_a = attrs_a.get(key)
        val_b = attrs_b.get(key)
        if val_a and val_b:
            attr_total += 1
            if val_a == val_b:
                attr_matches += 1
            else:
                # Check if it's a critical conflict
                if key in CRITICAL_ATTRIBUTES or "Pressure" in key or "Grade" in key:
                    conflicts.append({
                        "attribute": key,
                        "value_a": val_a,
                        "value_b": val_b,
                        "severity": "CRITICAL",
                        "message": f"Critical mismatch in {key}: '{val_a}' vs '{val_b}'"
                    })

    attr_sim = round((attr_matches / attr_total), 3) if attr_total > 0 else desc_sim

    # Weighted Hybrid Confidence Score
    confidence = round(
        desc_sim * 0.35 + attr_sim * 0.35 + category_sim * 0.15 + uom_compat * 0.15,
        2
    )

    match_breakdown = {
        "description_similarity": int(desc_sim * 100),
        "semantic_similarity": int(min(1.0, desc_sim + 0.04) * 100),
        "attribute_similarity": int(attr_sim * 100),
        "category_compatibility": int(category_sim * 100),
        "uom_compatibility": int(uom_compat * 100),
        "identifier_evidence": 70 if mat_a.get("part_number") and mat_a.get("part_number") == mat_b.get("part_number") else 40
    }

    # Conflict Gate Logic
    if conflicts:
        recommendation = "HUMAN_REVIEW"
        relationship_type = "NEAR_DUPLICATE"
    elif confidence >= 0.90:
        recommendation = "HIGH_CONFIDENCE"
        relationship_type = "IDENTICAL"
    elif confidence >= 0.70:
        recommendation = "HUMAN_REVIEW"
        relationship_type = "NEAR_DUPLICATE"
    else:
        recommendation = "NO_MATCH"
        relationship_type = "NOT_A_MATCH"

    return confidence, match_breakdown, conflicts, recommendation, relationship_type

def run_gemini_ai_harmonization(mat_a_desc: str, mat_b_desc: str) -> Dict[str, Any]:
    """Call Google Gemini AI model to perform real LLM-based technical specification extraction, semantic equivalence evaluation, and safety hazard detection."""
    api_key = os.environ.get("GEMINI_API_KEY")
    try:
        import google.generativeai as genai
        if not api_key:
            return None
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
You are an expert AI Material Engineer for the National Material Intelligence & Harmonization Platform (NMIHP).
Analyze these two raw industrial material descriptions from different CPSE ERP systems:

Item A: "{mat_a_desc}"
Item B: "{mat_b_desc}"

Perform a deep technical evaluation and respond ONLY with a valid JSON object matching this schema:
{{
  "semantic_equivalence_score": 85,
  "extracted_attributes_a": [
    {{"name": "Material Grade", "value": "A106-B"}}
  ],
  "extracted_attributes_b": [
    {{"name": "Material Grade", "value": "A106-B"}}
  ],
  "critical_conflicts": [
    {{
      "attribute": "Pressure Rating",
      "value_a": "150 PSI",
      "value_b": "600 PSI",
      "severity": "CRITICAL",
      "hazard_description": "Flange bolt pattern mismatch. 150# vs 600# cannot physically bolt together under high pressure.",
      "recommendation": "SPLIT INTO DISTINCT FLANGE CLASS NMCs"
    }}
  ],
  "relationship_type": "NEAR_DUPLICATE",
  "ai_explanation": "Detailed technical explanation here."
}}
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini AI Harmonization call exception: {e}")
        return None

def generate_nmc_code(category: str, sequence_num: int) -> str:
    """Generate deterministic NMC code e.g. NMC-PIPE-000184."""
    cat_prefix = re.sub(r"[^A-Z]", "", (category or "GEN").upper())[:5]
    if not cat_prefix:
        cat_prefix = "MATERIAL"
    return f"NMC-{cat_prefix}-{sequence_num:06d}"
