"""
PDF Service — generates a professional PDF placement report using ReportLab.
"""
import io
from datetime import datetime
from typing import Any, Dict, List

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT


# ── Brand colours ──────────────────────────────────────────────────────────────
VIOLET  = colors.HexColor("#7c3aed")
CYAN    = colors.HexColor("#06b6d4")
DARK    = colors.HexColor("#0a0a0f")
LIGHT   = colors.HexColor("#f0f0ff")
MUTED   = colors.HexColor("#8888aa")
SUCCESS = colors.HexColor("#10b981")
DANGER  = colors.HexColor("#ef4444")
WARNING = colors.HexColor("#f59e0b")
WHITE   = colors.white
BLACK   = colors.black


class PDFService:
    def generate_report(
        self,
        user: Dict[str, Any],
        placement_result: Dict[str, Any],
        salary_result: Dict[str, Any],
        career_recs: List[Dict[str, Any]],
        shap_data: Dict[str, Any],
    ) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm,
        )

        styles = getSampleStyleSheet()
        title_style   = ParagraphStyle("Title",   fontName="Helvetica-Bold", fontSize=22, leading=26, textColor=VIOLET,  spaceAfter=4)
        h2_style      = ParagraphStyle("H2",      fontName="Helvetica-Bold", fontSize=14, leading=18, textColor=VIOLET,  spaceAfter=6, spaceBefore=12)
        h3_style      = ParagraphStyle("H3",      fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=DARK,    spaceAfter=4)
        normal_style  = ParagraphStyle("Normal",  fontName="Helvetica",      fontSize=10, leading=12, textColor=BLACK,   spaceAfter=4)
        muted_style   = ParagraphStyle("Muted",   fontName="Helvetica",      fontSize=9,  leading=11, textColor=MUTED,   spaceAfter=2)
        center_style  = ParagraphStyle("Center",  fontName="Helvetica-Bold", fontSize=12, leading=14, textColor=DARK,    alignment=TA_CENTER)

        story = []

        # ── Header ──────────────────────────────────────────────────────────────
        story.append(Paragraph("PlaceWise", title_style))
        story.append(Paragraph("AI-Powered Placement Intelligence Report", muted_style))
        story.append(HRFlowable(width="100%", thickness=2, color=VIOLET, spaceAfter=10))

        # Student info table
        student_name = user.get("name", "Student")
        info_data = [
            ["Student", student_name,   "Branch", user.get("branch", "—")],
            ["CGPA",    str(user.get("cgpa", "—")), "Gender", user.get("gender", "—")],
            ["Email",   user.get("email", "—"),    "Date",   datetime.now().strftime("%d %b %Y")],
        ]
        info_table = Table(info_data, colWidths=[3*cm, 7*cm, 3*cm, 5*cm])
        info_table.setStyle(TableStyle([
            ("FONTNAME",    (0,0), (-1,-1), "Helvetica"),
            ("FONTNAME",    (0,0), (0,-1),  "Helvetica-Bold"),
            ("FONTNAME",    (2,0), (2,-1),  "Helvetica-Bold"),
            ("FONTSIZE",    (0,0), (-1,-1), 9),
            ("TEXTCOLOR",   (0,0), (0,-1),  MUTED),
            ("TEXTCOLOR",   (2,0), (2,-1),  MUTED),
            ("BOTTOMPADDING",(0,0),(-1,-1), 4),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 12))

        # ── Placement Result ─────────────────────────────────────────────────────
        story.append(Paragraph("📊 Placement Prediction", h2_style))
        placed = placement_result.get("placed", False)
        prob   = placement_result.get("probability", 0.0)
        conf   = placement_result.get("confidence", "—")
        verdict_color = SUCCESS if placed else DANGER
        verdict_text  = "LIKELY TO BE PLACED ✓" if placed else "AT RISK — NOT PLACED ✗"

        placement_data = [
            ["Verdict",     verdict_text],
            ["Probability", f"{prob*100:.1f}%"],
            ["Confidence",  conf],
        ]
        pt = Table(placement_data, colWidths=[5*cm, 12*cm])
        pt.setStyle(TableStyle([
            ("FONTNAME",    (0,0), (-1,-1), "Helvetica"),
            ("FONTNAME",    (0,0), (0,-1),  "Helvetica-Bold"),
            ("FONTSIZE",    (0,0), (-1,-1), 10),
            ("TEXTCOLOR",   (1,0), (1,0),   verdict_color),
            ("FONTNAME",    (1,0), (1,0),   "Helvetica-Bold"),
            ("FONTSIZE",    (1,0), (1,0),   11),
            ("GRID",        (0,0), (-1,-1), 0.5, colors.lightgrey),
            ("BACKGROUND",  (0,0), (0,-1),  colors.HexColor("#f5f5ff")),
            ("ROWBACKGROUNDS", (0,0), (-1,-1), [WHITE, colors.HexColor("#fafafa")]),
            ("BOTTOMPADDING",(0,0),(-1,-1), 6),
            ("TOPPADDING",  (0,0), (-1,-1), 6),
            ("LEFTPADDING", (0,0), (-1,-1), 8),
        ]))
        story.append(pt)
        story.append(Spacer(1, 8))

        # ── Salary Prediction ────────────────────────────────────────────────────
        story.append(Paragraph("💰 Salary Estimate", h2_style))
        salary = salary_result.get("salary_lpa", 0.0)
        s_min  = salary_result.get("salary_range", {}).get("min", 0)
        s_max  = salary_result.get("salary_range", {}).get("max", 0)

        salary_data = [
            ["Estimated CTC",   f"₹ {salary:.2f} LPA"],
            ["Expected Range",  f"₹ {s_min:.2f} – ₹ {s_max:.2f} LPA"],
        ]
        st = Table(salary_data, colWidths=[5*cm, 12*cm])
        st.setStyle(TableStyle([
            ("FONTNAME",    (0,0), (-1,-1), "Helvetica"),
            ("FONTNAME",    (0,0), (0,-1),  "Helvetica-Bold"),
            ("FONTNAME",    (1,0), (1,0),   "Helvetica-Bold"),
            ("FONTSIZE",    (1,0), (1,0),   13),
            ("TEXTCOLOR",   (1,0), (1,0),   VIOLET),
            ("FONTSIZE",    (0,0), (-1,-1), 10),
            ("GRID",        (0,0), (-1,-1), 0.5, colors.lightgrey),
            ("ROWBACKGROUNDS",(0,0),(-1,-1),[WHITE, colors.HexColor("#fafafa")]),
            ("BOTTOMPADDING",(0,0),(-1,-1), 6),
            ("TOPPADDING",  (0,0), (-1,-1), 6),
            ("LEFTPADDING", (0,0), (-1,-1), 8),
        ]))
        story.append(st)
        story.append(Spacer(1, 8))

        # ── SHAP Insights ────────────────────────────────────────────────────────
        story.append(Paragraph("🔍 SHAP Feature Importance (Top 5)", h2_style))
        story.append(Paragraph(
            "The following factors had the most impact on your placement prediction:",
            normal_style
        ))

        feat_names = shap_data.get("features", [])
        feat_vals  = shap_data.get("values", [])
        paired = sorted(zip(feat_vals, feat_names), key=lambda x: abs(x[0]), reverse=True)[:5]

        shap_table_data = [["Feature", "Impact", "Direction"]]
        for val, name in paired:
            direction = "Positive ↑" if val > 0 else "Negative ↓"
            shap_table_data.append([name, f"{abs(val):.4f}", direction])

        shap_tbl = Table(shap_table_data, colWidths=[7*cm, 4*cm, 6*cm])
        shap_tbl.setStyle(TableStyle([
            ("FONTNAME",    (0,0), (-1,0),  "Helvetica-Bold"),
            ("FONTNAME",    (0,1), (-1,-1), "Helvetica"),
            ("FONTSIZE",    (0,0), (-1,-1), 9),
            ("BACKGROUND",  (0,0), (-1,0),  VIOLET),
            ("TEXTCOLOR",   (0,0), (-1,0),  WHITE),
            ("GRID",        (0,0), (-1,-1), 0.5, colors.lightgrey),
            ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, colors.HexColor("#f9f9ff")]),
            ("ALIGN",       (1,0), (1,-1),  "CENTER"),
            ("BOTTOMPADDING",(0,0),(-1,-1), 5),
            ("TOPPADDING",  (0,0), (-1,-1), 5),
            ("LEFTPADDING", (0,0), (-1,-1), 8),
        ]))
        story.append(shap_tbl)
        story.append(Spacer(1, 8))

        # ── Career Recommendations ───────────────────────────────────────────────
        if career_recs:
            story.append(Paragraph("🎯 Top Career Recommendations", h2_style))
            rec_data = [["Role", "Match %", "Avg Salary", "Growth"]]
            for rec in career_recs[:3]:
                rec_data.append([
                    rec.get("role_name", "—"),
                    f"{rec.get('match_percentage', 0):.0f}%",
                    rec.get("avg_salary_range", "—"),
                    rec.get("growth_outlook", "—"),
                ])
            rec_tbl = Table(rec_data, colWidths=[6*cm, 3*cm, 5*cm, 4*cm])
            rec_tbl.setStyle(TableStyle([
                ("FONTNAME",    (0,0), (-1,0),  "Helvetica-Bold"),
                ("FONTNAME",    (0,1), (-1,-1), "Helvetica"),
                ("FONTSIZE",    (0,0), (-1,-1), 9),
                ("BACKGROUND",  (0,0), (-1,0),  CYAN),
                ("TEXTCOLOR",   (0,0), (-1,0),  WHITE),
                ("GRID",        (0,0), (-1,-1), 0.5, colors.lightgrey),
                ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE, colors.HexColor("#f0fffe")]),
                ("BOTTOMPADDING",(0,0),(-1,-1), 5),
                ("TOPPADDING",  (0,0), (-1,-1), 5),
                ("LEFTPADDING", (0,0), (-1,-1), 8),
            ]))
            story.append(rec_tbl)
            story.append(Spacer(1, 8))

        # ── Footer ──────────────────────────────────────────────────────────────
        story.append(Spacer(1, 20))
        story.append(HRFlowable(width="100%", thickness=1, color=MUTED))
        story.append(Spacer(1, 6))
        story.append(Paragraph(
            f"Generated by PlaceWise AI • {datetime.now().strftime('%d %b %Y, %I:%M %p')} • Confidential",
            ParagraphStyle("Footer", fontName="Helvetica", fontSize=8, textColor=MUTED, alignment=TA_CENTER)
        ))

        doc.build(story)
        return buffer.getvalue()


# Singleton
pdf_service = PDFService()
