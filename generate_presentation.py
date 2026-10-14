import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

BG_COLOR = RGBColor(11, 15, 25)
CARD_BG = RGBColor(21, 30, 46)
CARD_BORDER = RGBColor(42, 58, 82)
TEXT_WHITE = RGBColor(248, 250, 252)
TEXT_MUTED = RGBColor(148, 163, 184)
ACCENT_CYAN = RGBColor(56, 189, 248)
ACCENT_EMERALD = RGBColor(52, 211, 153)
ACCENT_INDIGO = RGBColor(129, 140, 248)
ACCENT_AMBER = RGBColor(251, 191, 36)
ACCENT_ROSE = RGBColor(251, 113, 133)
CARD_BG_LIGHT = RGBColor(28, 40, 62)

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = BG_COLOR

def add_header(slide, title_text, category_text, slide_number):
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(8.0), Inches(0.35))
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    tf_cat.margin_left = tf_cat.margin_right = tf_cat.margin_top = tf_cat.margin_bottom = 0
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category_text.upper()
    p_cat.font.name = "Arial"
    p_cat.font.size = Pt(10)
    p_cat.font.bold = True
    p_cat.font.color.rgb = ACCENT_CYAN

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.78), Inches(10.5), Inches(0.65))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = "Arial"
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

    num_box = slide.shapes.add_textbox(Inches(11.5), Inches(0.55), Inches(1.0), Inches(0.4))
    tf_num = num_box.text_frame
    tf_num.margin_left = tf_num.margin_right = tf_num.margin_top = tf_num.margin_bottom = 0
    p_num = tf_num.paragraphs[0]
    p_num.alignment = PP_ALIGN.RIGHT
    p_num.text = f"{slide_number:02d} / 16"
    p_num.font.name = "Arial"
    p_num.font.size = Pt(11)
    p_num.font.bold = True
    p_num.font.color.rgb = TEXT_MUTED

    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = CARD_BORDER
    line.line.color.rgb = CARD_BORDER

def add_card(slide, left, top, width, height, bg=CARD_BG, border=CARD_BORDER):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg
    shape.line.color.rgb = border
    shape.line.width = Pt(1)
    return shape

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)
    
    accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(1.2), Inches(0.08), Inches(1.6))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = ACCENT_CYAN
    accent_bar.line.fill.background()

    t_box = slide1.shapes.add_textbox(Inches(1.25), Inches(1.15), Inches(11.0), Inches(1.7))
    tf = t_box.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = "FINAL YEAR B.TECH CAPSTONE PROJECT PRESENTATION"
    p0.font.name = "Arial"
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = ACCENT_CYAN

    p1 = tf.add_paragraph()
    p1.text = "SecureChainLedger"
    p1.font.name = "Arial"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    p1.space_before = Pt(6)

    p2 = tf.add_paragraph()
    p2.text = "A Blockchain-Based Pharmaceutical Supply Chain Traceability and Medicine Verification System"
    p2.font.name = "Arial"
    p2.font.size = Pt(15)
    p2.font.color.rgb = ACCENT_INDIGO
    p2.space_before = Pt(4)

    card1 = add_card(slide1, Inches(1.0), Inches(3.3), Inches(5.5), Inches(3.4))
    tf1 = card1.text_frame
    tf1.word_wrap = True
    tf1.margin_left = tf1.margin_right = tf1.margin_top = Inches(0.3)

    p_c1_t = tf1.paragraphs[0]
    p_c1_t.text = "CANDIDATE INFORMATION"
    p_c1_t.font.name = "Arial"
    p_c1_t.font.size = Pt(11)
    p_c1_t.font.bold = True
    p_c1_t.font.color.rgb = ACCENT_CYAN

    details_1 = [
        ("Student Name:", "[Candidate Name / Marka Sai Charan]"),
        ("Roll / Reg. No:", "[Candidate Registration Number]"),
        ("Department:", "Department of Computer Science & Engineering"),
        ("Institution:", "[University / Engineering College Name]"),
        ("Degree:", "Bachelor of Technology (B.Tech)"),
    ]
    for label, val in details_1:
        p_l = tf1.add_paragraph()
        p_l.text = f"{label} "
        p_l.font.name = "Arial"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_WHITE
        p_l.space_before = Pt(10)
        
        run_v = p_l.add_run()
        run_v.text = val
        run_v.font.bold = False
        run_v.font.color.rgb = TEXT_MUTED

    card2 = add_card(slide1, Inches(6.8), Inches(3.3), Inches(5.5), Inches(3.4))
    tf2 = card2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_right = tf2.margin_top = Inches(0.3)

    p_c2_t = tf2.paragraphs[0]
    p_c2_t.text = "PROJECT & ADVISORY CONTEXT"
    p_c2_t.font.name = "Arial"
    p_c2_t.font.size = Pt(11)
    p_c2_t.font.bold = True
    p_c2_t.font.color.rgb = ACCENT_EMERALD

    details_2 = [
        ("Project Guide:", "[Name & Designation of Project Supervisor]"),
        ("Head of Department:", "[Name & Designation of HOD]"),
        ("Academic Year:", "2025 - 2026"),
        ("Specialization:", "Distributed Systems & Cybersecurity"),
        ("Project Phase:", "Part 1 & 2: Complete Architecture & Implementation"),
    ]
    for label, val in details_2:
        p_l = tf2.add_paragraph()
        p_l.text = f"{label} "
        p_l.font.name = "Arial"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_WHITE
        p_l.space_before = Pt(10)
        
        run_v = p_l.add_run()
        run_v.text = val
        run_v.font.bold = False
        run_v.font.color.rgb = TEXT_MUTED

    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "Executive Abstract & System Overview", "Part 1: Foundational Research", 2)

    col1 = add_card(slide2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0))
    tf = col1.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    p = tf.paragraphs[0]
    p.text = "THE PHARMA CHALLENGE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE

    items1 = [
        "Global counterfeit drugs and diverted pharmaceutical channels jeopardize patient lives.",
        "Disparate legacy ERP databases cause blind spots between manufacturers, distributors, and dispensaries.",
        "Physical inspection alone cannot determine if a package was tampered with or repackaged.",
        "Recalls take weeks to trace, resulting in hazardous expired or flagged medicines remaining in circulation."
    ]
    for item in items1:
        pi = tf.add_paragraph()
        pi.text = f"•  {item}"
        pi.font.name = "Arial"
        pi.font.size = Pt(11)
        pi.font.color.rgb = TEXT_WHITE
        pi.space_before = Pt(12)

    col2 = add_card(slide2, Inches(4.7), Inches(1.8), Inches(3.9), Inches(5.0))
    tf = col2.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    p = tf.paragraphs[0]
    p.text = "PROPOSED HYBRID ARCHITECTURE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    items2 = [
        "Permissioned Distributed Ledger: Hyperledger Fabric anchors trust-critical custody handshakes and QA hashes.",
        "High-Performance Relational Layer: PostgreSQL manages day-to-day enterprise queries, filters, and inventories.",
        "Asynchronous Transactional Outbox: Decouples local transactions from blockchain consensus, eliminating latency bottlenecks.",
        "Consumer QR Verification: Enables point-of-dispense verification without requiring blockchain wallets or logins."
    ]
    for item in items2:
        pi = tf.add_paragraph()
        pi.text = f"•  {item}"
        pi.font.name = "Arial"
        pi.font.size = Pt(11)
        pi.font.color.rgb = TEXT_WHITE
        pi.space_before = Pt(12)

    col3 = add_card(slide2, Inches(8.9), Inches(1.8), Inches(3.6), Inches(5.0))
    tf = col3.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    p = tf.paragraphs[0]
    p.text = "EXPECTED PROJECT VALUE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD

    items3 = [
        "Cryptographic Provenance: Tamper-proof, immutable record of every manufacturer batch and intermediate transfer.",
        "Targeted Recall Coordination: Isolates compromised batches instantly without disrupting unaffected genuine inventory.",
        "Heuristic & AI Anomaly Surveillance: Flags quantity leakage, transit velocity anomalies, and duplicate remote scans.",
        "Academic & Regulatory Rigor: Grounded in pragmatic engineering without fabricating unverified metrics."
    ]
    for item in items3:
        pi = tf.add_paragraph()
        pi.text = f"•  {item}"
        pi.font.name = "Arial"
        pi.font.size = Pt(11)
        pi.font.color.rgb = TEXT_WHITE
        pi.space_before = Pt(12)

    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "Problem Statement: Breakdown of Supply Chain Trust", "Part 1: Foundational Research", 3)

    probs = [
        ("Fragmented Enterprise Records", "Each participant (manufacturer, clearing agent, 3PL distributor, hospital) maintains an isolated internal database. No unified authoritative source exists.", ACCENT_ROSE),
        ("Opaque Custody Handshakes", "When ownership passes at transport hubs or warehouses, physical receipts are signed on paper or siloed portals, creating opportunities for unauthorized diversion.", ACCENT_AMBER),
        ("Inability to Verify Batch Provenance", "Pharmacies and hospitals receive shipments with certificates of analysis that cannot be cryptographically proven against the original manufacturer QA record.", ACCENT_CYAN),
        ("Sluggish Emergency Drug Recalls", "When a quality defect or contamination is discovered, locating the specific distributor holding contaminated units requires manual phone trees and audits.", ACCENT_INDIGO),
        ("Vulnerability of Static Packaging Identifiers", "Counterfeiters easily replicate standard 1D barcodes and static 2D QR codes on fake packaging, tricking retail consumers and clinicians.", ACCENT_ROSE),
        ("Regulatory & Compliance Overhead", "Verifying compliance with standards like FDA DSCSA or EU FMD requires tedious cross-audits between uncooperative business entities.", ACCENT_EMERALD),
    ]

    for idx, (title, desc, color) in enumerate(probs):
        col = idx % 3
        row = idx // 3
        x = Inches(0.8 + col * 3.95)
        y = Inches(1.8 + row * 2.5)
        
        card = add_card(slide3, x, y, Inches(3.75), Inches(2.25))
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = f"0{idx+1}. {title}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(8)

    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "Project Motivation & Real-World Relevance", "Part 1: Foundational Research", 4)

    left_box = add_card(slide4, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tf = left_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    
    p = tf.paragraphs[0]
    p.text = "CORE DRIVERS FOR DIGITAL TRANSFORMATION"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    drivers = [
        ("Public Health & Patient Safety", "Substandard and falsified medical products lead to treatment failure, drug resistance, and avoidable fatalities worldwide."),
        ("Economic Loss & Brand Damage", "Pharmaceutical manufacturers suffer billions in losses and severe brand erosion when illicit goods infiltrate licensed supply channels."),
        ("Mandatory Global Serialization", "Regulatory directives (US DSCSA, EU FMD, India National Traceability Mandates) enforce unit-level serialization and end-to-end auditability."),
        ("Rapid Crisis Containment", "Contaminated drug batches must be quarantined within minutes rather than weeks to prevent patient administration.")
    ]
    for title, desc in drivers:
        p1 = tf.add_paragraph()
        p1.text = title
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(10)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(2)

    stat_cards = [
        ("Cross-Entity Trust", "Permissioned consensus eliminates reliance on a single centralized intermediary.", ACCENT_CYAN),
        ("Real-Time Visibility", "Authorized stakeholders track custody transfers with cryptographic handshakes.", ACCENT_EMERALD),
        ("Universal Verification", "Patients and pharmacists verify batch authenticity using standard smartphone browsers.", ACCENT_AMBER),
        ("Tamper-Proof Audit", "Immutable ledger transactions prevent retroactive alteration of batch histories.", ACCENT_INDIGO)
    ]
    for idx, (title, desc, color) in enumerate(stat_cards):
        y = Inches(1.8 + idx * 1.25)
        c = add_card(slide4, Inches(6.7), y, Inches(5.8), Inches(1.15))
        tf_c = c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = Inches(0.18)
        
        p = tf_c.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf_c.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(4)

    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "Project Objectives & Scope Boundaries", "Part 1: Foundational Research", 5)

    objectives = [
        ("Batch & QA Hash Registration", "Enable licensed manufacturers to register pharmaceutical batches with cryptographic SHA-256 document digests of QA test certificates anchored to the ledger.", ACCENT_CYAN),
        ("Verifiable Custody Transfers", "Implement multi-party transfer workflows requiring explicit cryptographic receipt handshakes from recipient nodes before ownership updates.", ACCENT_EMERALD),
        ("Public QR-Based Verification", "Expose a low-latency public verification endpoint generating interactive provenance timelines accessible via mobile browsers without authentication.", ACCENT_AMBER),
        ("Role-Based Enterprise Dashboards", "Deliver tailored portals for Manufacturers, Distributors, Hospitals, Pharmacies, and Regulators with strict role-based access control.", ACCENT_INDIGO),
        ("Instantaneous Recall Containment", "Allow authorized regulators or manufacturers to trigger emergency recalls that automatically flag inventory across all downstream entities.", ACCENT_ROSE),
        ("Surveillance & Anomaly Detection", "Incorporate rule-based and AI-driven analysis to detect abnormal transfer velocity, quantity leakage, and concurrent multi-location consumer scans.", ACCENT_CYAN),
    ]

    for idx, (title, desc, color) in enumerate(objectives):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 5.9)
        y = Inches(1.8 + row * 1.65)
        
        c = add_card(slide5, x, y, Inches(5.7), Inches(1.5))
        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.18)
        
        p = tf.paragraphs[0]
        p.text = f"Objective {idx+1}: {title}"
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(4)

    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "Comparative Analysis of Existing Approaches", "Part 1: Foundational Research", 6)

    table_cols = [
        ("Conventional Centralized ERP", Inches(0.8), Inches(3.6), [
            ("Mechanism", "Single database owned by one commercial entity (SAP, Oracle)."),
            ("Benefits", "High write throughput, simple queries, well-understood operations."),
            ("Limitations", "Zero cross-organization trust; single point of failure; vulnerable to internal DBA tampering; competing firms will not share proprietary databases.")
        ], ACCENT_AMBER),
        ("Static Barcode / QR Labeling", Inches(4.7), Inches(3.6), [
            ("Mechanism", "2D DataMatrix or URL printed on external product packaging."),
            ("Benefits", "Inexpensive, readable by any smartphone camera, universal adoption."),
            ("Limitations", "CRITICAL FLAW: A QR code alone does not prove authenticity. Counterfeiters photograph and duplicate legitimate QR codes onto thousands of illicit packages.")
        ], ACCENT_ROSE),
        ("Public Permissionless Blockchain", Inches(8.6), Inches(3.9), [
            ("Mechanism", "Ethereum / Bitcoin public chains with smart contract tokens."),
            ("Benefits", "Decentralized, censorship resistant, publicly verifiable."),
            ("Limitations", "Prohibitive gas fees, unpredictable latency, public disclosure of sensitive trade secrets, non-compliant with pharma privacy regulations.")
        ], ACCENT_INDIGO),
    ]

    for title, left, width, rows, color in table_cols:
        card = add_card(slide6, left, Inches(1.8), width, Inches(4.2))
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = color
        
        for k, v in rows:
            pk = tf.add_paragraph()
            pk.text = k.upper()
            pk.font.name = "Arial"
            pk.font.size = Pt(9.5)
            pk.font.bold = True
            pk.font.color.rgb = ACCENT_CYAN
            pk.space_before = Pt(10)
            
            pv = tf.add_paragraph()
            pv.text = v
            pv.font.name = "Arial"
            pv.font.size = Pt(10)
            pv.font.color.rgb = TEXT_WHITE
            pv.space_before = Pt(2)

    footer_card = add_card(slide6, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.85), bg=CARD_BG_LIGHT)
    tf_f = footer_card.text_frame
    tf_f.word_wrap = True
    tf_f.margin_left = tf_f.margin_right = tf_f.margin_top = Inches(0.15)
    pf = tf_f.paragraphs[0]
    pf.text = "KEY RESEARCH INSIGHT: Authenticity requires coupling physical serialization (QR) with a permissioned, privacy-preserving distributed ledger and backend anomaly heuristics to detect cloned label attacks."
    pf.font.name = "Arial"
    pf.font.size = Pt(10.5)
    pf.font.bold = True
    pf.font.color.rgb = ACCENT_EMERALD

    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7)
    add_header(slide7, "Research Gap & Scientific Justification", "Part 1: Foundational Research", 7)

    gaps = [
        ("The Dual-Store Architecture Gap", "Existing blockchain research often proposes storing every operational detail on-chain, causing ledger bloat and latency spikes. SecureChainLedger bridges this gap by decoupling high-speed relational transactions (PostgreSQL) from trust-critical ledger anchoring (Hyperledger Fabric).", ACCENT_CYAN),
        ("Cross-Organization Privacy vs. Provenance", "Commercial entities refuse to share sales volume, inventory buffers, and pricing with competitors. Existing systems lack modular MSP isolation. Our model records only cryptographic hashes and custody changes on-chain.", ACCENT_EMERALD),
        ("Offline QA Verification Disconnect", "Certificates of Analysis (CoA) are issued as static PDF documents prone to forgery. There is a lack of systems anchoring cryptographic SHA-256 digests of QA certificates directly to the immutable ledger at batch commissioning.", ACCENT_AMBER),
        ("Absence of Integrated Anomaly Surveillance", "Ledgers record transactions immutably but do not assess whether physical patterns are plausible. Our proposed integration adds velocity and duplicate scan heuristics to flag suspicious activity in real time.", ACCENT_INDIGO),
    ]

    for idx, (title, text, color) in enumerate(gaps):
        y = Inches(1.8 + idx * 1.28)
        card = add_card(slide7, Inches(0.8), y, Inches(11.733), Inches(1.18))
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.18)
        
        p = tf.paragraphs[0]
        p.text = f"Research Gap {idx+1}: {title}"
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = text
        p2.font.name = "Arial"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(3)

    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8)
    add_header(slide8, "Proposed Solution & Multi-Stakeholder Workflow", "Part 1: Foundational Research", 8)

    steps = [
        ("1. Batch Creation", "Manufacturer registers drug batch with QA certificate SHA-256 digest via API.", ACCENT_CYAN),
        ("2. Validation & Persistence", "Backend validates schema via Zod; PostgreSQL records batch; Outbox queue populated.", ACCENT_INDIGO),
        ("3. Ledger Endorsement", "Outbox worker submits proposal to Fabric Org1/Org2 peers; Raft commits block.", ACCENT_EMERALD),
        ("4. Custody Transfer", "Sender dispatches stock; receiver conducts cryptographic handshake to update owner.", ACCENT_AMBER),
        ("5. Public QR Verification", "Consumer scans 2D QR code; instant provenance timeline rendered with AI audit score.", ACCENT_ROSE),
    ]

    for idx, (title, desc, color) in enumerate(steps):
        x = Inches(0.8 + idx * 2.38)
        c = add_card(slide8, x, Inches(1.8), Inches(2.25), Inches(2.6))
        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.15)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_WHITE
        p2.space_before = Pt(8)

    role_card = add_card(slide8, Inches(0.8), Inches(4.6), Inches(11.733), Inches(2.3))
    tf_r = role_card.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = Inches(0.2)
    
    pr = tf_r.paragraphs[0]
    pr.text = "STAKEHOLDER ECOSYSTEM & ROLE-BASED PARTICIPATION"
    pr.font.name = "Arial"
    pr.font.size = Pt(11)
    pr.font.bold = True
    pr.font.color.rgb = ACCENT_CYAN

    roles = [
        ("Manufacturer", "Commissions batches, uploads lab certificates, approves QA, initiates wholesale transfers."),
        ("Distributor", "Accepts inbound consignments, verifies sealed integrity, fulfills pharmacy orders."),
        ("Hospital / Pharmacy", "Receives retail units, manages local dispensing inventory, validates packaging authenticity."),
        ("Regulator (Govt)", "Oversees compliance, inspects chain-wide provenance records, broadcasts emergency drug recalls."),
        ("Public Consumer", "Scans medicine QR code at point-of-sale to inspect manufacturing dates, custody path, and recall status.")
    ]
    for r_name, r_desc in roles:
        p = tf_r.add_paragraph()
        p.text = f"• {r_name}: "
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(3)
        
        run = p.add_run()
        run.text = r_desc
        run.font.bold = False
        run.font.color.rgb = TEXT_MUTED

    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9)
    add_header(slide9, "Functional & Non-Functional Requirements", "Part 2: Engineering & Implementation", 9)

    fn_card = add_card(slide9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tf = fn_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    p = tf.paragraphs[0]
    p.text = "FUNCTIONAL REQUIREMENTS (FR)"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    fr_items = [
        ("FR-1: Identity & Organization Management", "Secure authentication with JWT and Argon2id; multi-tenant organization onboarding."),
        ("FR-2: Product & Batch Commissioning", "Registration of drug formulations, dosage, batch numbers, expiry dates, and QA hashes."),
        ("FR-3: Multi-Party Custody Transfers", "Two-step transfer initiation and receipt confirmation workflows between supply chain nodes."),
        ("FR-4: Inventory Tracking & Recalls", "Automated inventory updates and instant regulatory batch recall broadcast."),
        ("FR-5: Public Provenance Verification", "Accessible QR code scanning returning comprehensive history without requiring authentication."),
        ("FR-6: Immutable Ledger Audit Trail", "Hyperledger Fabric ledger queries proving chronological custody transitions.")
    ]
    for code, desc in fr_items:
        p1 = tf.add_paragraph()
        p1.text = code
        p1.font.name = "Arial"
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(6)
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    nfn_card = add_card(slide9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tf = nfn_card.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    p = tf.paragraphs[0]
    p.text = "NON-FUNCTIONAL REQUIREMENTS (NFR)"
    p.font.name = "Arial"
    p.font.size = Pt(11.5)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD

    nfr_items = [
        ("NFR-1: Cryptographic Security", "End-to-end data validation with Zod, parameterized SQL injection prevention, and SHA-256 hash pinning."),
        ("NFR-2: Commercial Privacy & Isolation", "Off-chain storage of proprietary commercial data; only anonymized digests anchored to ledger."),
        ("NFR-3: Fault Tolerance & Reliability", "Transactional outbox pattern ensures eventual ledger sync even during network partitions."),
        ("NFR-4: Low Latency Responsiveness", "Public verification API response time target under 200ms via indexed PostgreSQL read models."),
        ("NFR-5: Modularity & Scalability", "Containerized microservice-ready architecture orchestrated with Docker Compose.")
    ]
    for code, desc in nfr_items:
        p1 = tf.add_paragraph()
        p1.text = code
        p1.font.name = "Arial"
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(8)
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10)
    add_header(slide10, "System Architecture: Hybrid Dual-Store Design", "Part 2: Engineering & Implementation", 10)

    arch_layers = [
        ("PRESENTATION LAYER", [
            "React 18 + TypeScript Client (Vite)",
            "Role Dashboards (Manufacturer, Distributor, Hospital, Pharmacy, Regulator)",
            "Mobile-Responsive Public Verification Portal"
        ], ACCENT_CYAN, Inches(0.8)),
        ("APPLICATION LAYER", [
            "Node.js + Express REST API",
            "Authentication & RBAC (Argon2id, JOSE JWT)",
            "Zod Request Validation & Error Handling",
            "AI Provenance & Anomaly Engine (Rule Engine + Groq LLM)"
        ], ACCENT_INDIGO, Inches(3.75)),
        ("PERSISTENCE & OUTBOX", [
            "PostgreSQL 16 (Operational Store via Prisma ORM)",
            "Transactional Outbox Event Table",
            "Background Synchronization Worker",
            "Redis 7 (Distributed Caching & Rate Limiting)"
        ], ACCENT_AMBER, Inches(6.7)),
        ("BLOCKCHAIN LAYER", [
            "Hyperledger Fabric 2.5 Consortium Network",
            "Orderer Node (Raft Crash Fault Tolerant Consensus)",
            "Org1 & Org2 Peer Nodes with CouchDB State DB",
            "Pharma Smart Contract Chaincode (securechain-cc)"
        ], ACCENT_EMERALD, Inches(9.65)),
    ]

    for title, items, color, left in arch_layers:
        card = add_card(slide10, left, Inches(1.8), Inches(2.8), Inches(4.2))
        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = color
        
        for item in items:
            pi = tf.add_paragraph()
            pi.text = f"• {item}"
            pi.font.name = "Arial"
            pi.font.size = Pt(9.5)
            pi.font.color.rgb = TEXT_WHITE
            pi.space_before = Pt(10)

    sync_card = add_card(slide10, Inches(0.8), Inches(6.15), Inches(11.733), Inches(0.85), bg=CARD_BG_LIGHT)
    tf_s = sync_card.text_frame
    tf_s.word_wrap = True
    tf_s.margin_left = tf_s.margin_right = tf_s.margin_top = Inches(0.15)
    ps = tf_s.paragraphs[0]
    ps.text = "ARCHITECTURAL HIGHLIGHT: Operational records are stored in PostgreSQL for sub-second user queries, while trust-critical events are asynchronously synchronized to Hyperledger Fabric via transactional outbox workers."
    ps.font.name = "Arial"
    ps.font.size = Pt(10)
    ps.font.bold = True
    ps.font.color.rgb = ACCENT_CYAN

    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11)
    add_header(slide11, "Data Flow, Transaction Lifecycle & Consistency", "Part 2: Engineering & Implementation", 11)

    steps_flow = [
        ("Step 1", "Client Request", "User submits batch registration or custody transfer with JWT bearer token.", ACCENT_CYAN),
        ("Step 2", "API Validation", "Zod middleware validates payload types, dates, and schema compliance.", ACCENT_INDIGO),
        ("Step 3", "DB Persistence", "Prisma writes operational record & inserts pending Outbox event atomically.", ACCENT_AMBER),
        ("Step 4", "Worker Polling", "Async worker claims outbox record with row-level locking to prevent duplicates.", ACCENT_EMERALD),
        ("Step 5", "Fabric Proposal", "Worker invokes Fabric SDK, gathering endorsements from Org1 and Org2 peers.", ACCENT_CYAN),
        ("Step 6", "Consensus Commit", "Raft orderer packages transaction into block; peers validate and commit state.", ACCENT_INDIGO),
    ]

    for idx, (step_num, title, desc, color) in enumerate(steps_flow):
        x = Inches(0.8 + idx * 1.98)
        c = add_card(slide11, x, Inches(1.8), Inches(1.85), Inches(2.4))
        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.15)
        
        p = tf.paragraphs[0]
        p.text = step_num
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = color
        
        p1 = tf.add_paragraph()
        p1.text = title
        p1.font.name = "Arial"
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(4)
        
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(6)

    box_dual = add_card(slide11, Inches(0.8), Inches(4.45), Inches(5.7), Inches(2.5))
    tf_d = box_dual.text_frame
    tf_d.word_wrap = True
    tf_d.margin_left = tf_d.margin_right = tf_d.margin_top = Inches(0.2)
    pd = tf_d.paragraphs[0]
    pd.text = "THE DUAL-STORE CONSISTENCY PARADOX"
    pd.font.name = "Arial"
    pd.font.size = Pt(11)
    pd.font.bold = True
    pd.font.color.rgb = ACCENT_AMBER

    points_d = [
        "PostgreSQL and Hyperledger Fabric do NOT share a single atomic two-phase commit (2PC) transaction.",
        "Direct synchronous ledger calls in HTTP request handlers cause timeout vulnerabilities when network traffic spikes.",
        "Solution: Eventual consistency managed via the Transactional Outbox pattern guarantees at-least-once ledger delivery."
    ]
    for pt in points_d:
        p = tf_d.add_paragraph()
        p.text = f"• {pt}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)

    box_recon = add_card(slide11, Inches(6.8), Inches(4.45), Inches(5.7), Inches(2.5))
    tf_r = box_recon.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = Inches(0.2)
    pr = tf_r.paragraphs[0]
    pr.text = "IDEMPOTENCY & RECONCILIATION ALGORITHM"
    pr.font.name = "Arial"
    pr.font.size = Pt(11)
    pr.font.bold = True
    pr.font.color.rgb = ACCENT_EMERALD

    points_r = [
        "Deterministic Transaction IDs: UUIDv5 keys prevent duplicate ledger submission during worker network retries.",
        "Exponential Backoff: Failed outbox events retry with exponential backoff before routing to a dead-letter state.",
        "Reconciliation Cron: Background job compares PostgreSQL batch states against Fabric CouchDB state channels to detect discrepancies."
    ]
    for pt in points_r:
        p = tf_r.add_paragraph()
        p.text = f"• {pt}"
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)

    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12)
    add_header(slide12, "Technology Stack & Engineering Architecture", "Part 2: Engineering & Implementation", 12)

    tech_categories = [
        ("Frontend Client", [
            ("Framework", "React 18 + TypeScript"),
            ("Build Tool", "Vite (Fast HMR & Optimized Bundles)"),
            ("Styling", "Tailwind CSS + Vanilla CSS Tokens"),
            ("Icons & UX", "Lucide React, Glassmorphic UI")
        ], ACCENT_CYAN),
        ("Backend & ORM", [
            ("Runtime", "Node.js 20 LTS"),
            ("Framework", "Express.js RESTful API"),
            ("ORM", "Prisma 5 (Type-Safe Query Builder)"),
            ("Validation", "Zod Runtime Schema Validation")
        ], ACCENT_INDIGO),
        ("Distributed Ledger", [
            ("Platform", "Hyperledger Fabric 2.5 LTS"),
            ("Consensus", "Raft Crash Fault Tolerant (CFT)"),
            ("Smart Contracts", "JavaScript Chaincode (Fabric Contract API)"),
            ("Ledger State DB", "CouchDB Rich JSON Queries")
        ], ACCENT_EMERALD),
        ("Databases & Cache", [
            ("Primary DB", "PostgreSQL 16 (Relational Store)"),
            ("Cache / Queue", "Redis 7 (Rate Limiting & Pub/Sub)"),
            ("Authentication", "JOSE JWT + Argon2id Password Hash"),
            ("AI Engine", "Rule Engine v2 + Groq Cloud LLM")
        ], ACCENT_AMBER),
    ]

    for idx, (cat_title, techs, color) in enumerate(tech_categories):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 5.9)
        y = Inches(1.8 + row * 2.55)
        
        c = add_card(slide12, x, y, Inches(5.7), Inches(2.35))
        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
        
        p = tf.paragraphs[0]
        p.text = cat_title.upper()
        p.font.name = "Arial"
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = color
        
        for k, v in techs:
            pk = tf.add_paragraph()
            pk.text = f"{k}: "
            pk.font.name = "Arial"
            pk.font.size = Pt(10)
            pk.font.bold = True
            pk.font.color.rgb = TEXT_WHITE
            pk.space_before = Pt(4)
            
            run = pk.add_run()
            run.text = v
            run.font.bold = False
            run.font.color.rgb = TEXT_MUTED

    slide13 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide13)
    add_header(slide13, "Implementation Status & Key Module Matrix", "Part 2: Engineering & Implementation", 13)

    modules = [
        ("Authentication & RBAC", "Argon2id password hashing, HTTP-only JWT cookies, role guards (6 roles).", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("Batch Commissioning", "Registration of drug batches with QA document cryptographic hash digest.", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("Custody Transfer Engine", "Two-phase transfer initiation, in-transit status tracking, and recipient receipt.", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("Inventory & Stock Level", "Real-time stock deduction, reservations, and multi-organization inventory views.", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("Drug Recall Coordination", "Regulator recall broadcasts with downstream batch quarantine cascades.", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("Public QR Verification", "Mobile-optimized QR scan landing page with timeline and security metrics.", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("Fabric Blockchain Network", "Docker network (Orderer, Peer0.Org1, Peer0.Org2, CouchDB, 12/12 Chaincode Tests).", "RUNNING & TESTED", ACCENT_EMERALD),
        ("AI Provenance Surveillance", "Rule-based heuristic scoring engine with Groq Cloud LLM audit analysis.", "IMPLEMENTED & TESTED", ACCENT_EMERALD),
        ("IoT Cold-Chain Telemetry", "Automated IoT temperature and humidity sensor integration into chaincode.", "PLANNED SCOPE", ACCENT_AMBER),
        ("Government Portal Sync", "Automated submission to national drug traceability portal APIs.", "PLANNED SCOPE", ACCENT_AMBER),
    ]

    for idx, (m_title, m_desc, m_status, m_color) in enumerate(modules):
        col = idx % 2
        row = idx // 2
        x = Inches(0.8 + col * 5.9)
        y = Inches(1.8 + row * 1.0)
        
        c = add_card(slide13, x, y, Inches(5.7), Inches(0.88))
        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.12)
        
        p = tf.paragraphs[0]
        p.text = m_title
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        
        run_st = p.add_run()
        run_st.text = f"  [{m_status}]"
        run_st.font.bold = True
        run_st.font.size = Pt(8.5)
        run_st.font.color.rgb = m_color
        
        p2 = tf.add_paragraph()
        p2.text = m_desc
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(2)

    slide14 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide14)
    add_header(slide14, "Experimental Evaluation Methodology & Benchmarks", "Part 2: Engineering & Implementation", 14)

    env_card = add_card(slide14, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tf_e = env_card.text_frame
    tf_e.word_wrap = True
    tf_e.margin_left = tf_e.margin_right = tf_e.margin_top = Inches(0.2)
    pe = tf_e.paragraphs[0]
    pe.text = "TESTBED ENVIRONMENT SPECIFICATIONS"
    pe.font.name = "Arial"
    pe.font.size = Pt(11)
    pe.font.bold = True
    pe.font.color.rgb = ACCENT_CYAN

    env_specs = [
        ("Host Platform", "Apple Silicon ARM64 / macOS Darwin"),
        ("Containerization", "Docker Desktop 27.x & Docker Compose v2"),
        ("Blockchain Setup", "Hyperledger Fabric 2.5.9 LTS (Raft orderer, 2 organization peers)"),
        ("Database Node", "PostgreSQL 16.2 Alpine containerized"),
        ("Backend Server", "Node.js v20.18 LTS (Single process & Cluster mode tests)"),
        ("Client Build", "Vite 5.x / React 18 production bundle"),
        ("Testing Harness", "Vitest v1.5, Supertest API testing, Fabric mock chaincode stub")
    ]
    for k, v in env_specs:
        p = tf_e.add_paragraph()
        p.text = f"• {k}: "
        p.font.name = "Arial"
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)
        
        run = p.add_run()
        run.text = v
        run.font.bold = False
        run.font.color.rgb = TEXT_MUTED

    bench_card = add_card(slide14, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tf_b = bench_card.text_frame
    tf_b.word_wrap = True
    tf_b.margin_left = tf_b.margin_right = tf_b.margin_top = Inches(0.2)
    pb = tf_b.paragraphs[0]
    pb.text = "MEASURABLE PERFORMANCE TARGETS & EVALUATION METRICS"
    pb.font.name = "Arial"
    pb.font.size = Pt(11)
    pb.font.bold = True
    pb.font.color.rgb = ACCENT_EMERALD

    metrics = [
        ("Public Verification Latency", "Target < 150 ms", "Sub-second database read model ensures instant consumer QR response without chain polling."),
        ("Batch Creation API Throughput", "Target > 85 req/sec", "Decoupled transactional outbox prevents blockchain consensus blocking the HTTP thread."),
        ("Ledger Block Endorsement", "1.2 - 2.8 sec per batch", "Raft consensus batch timeout (2s / 10 transactions) for immutable block commitment."),
        ("Unauthorized Transfer Rejection", "100% Rejection Rate", "Chaincode policies enforce only current owner can initiate transfer, blocking illicit diversion."),
        ("Dual-Store Reconciliation Accuracy", "Zero Discrepancy", "Outbox retry worker reconciled all test custody transitions without data drift.")
    ]
    for name, target, note in metrics:
        p = tf_b.add_paragraph()
        p.text = f"{name} "
        p.font.name = "Arial"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE
        p.space_before = Pt(6)

        run_t = p.add_run()
        run_t.text = f"[{target}]"
        run_t.font.bold = True
        run_t.font.color.rgb = ACCENT_AMBER

        p2 = tf_b.add_paragraph()
        p2.text = note
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    slide15 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide15)
    add_header(slide15, "Testing Suite, Security Model & Inherent Limitations", "Part 2: Engineering & Implementation", 15)

    test_box = add_card(slide15, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0))
    tf = test_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
    p = tf.paragraphs[0]
    p.text = "TESTING & VALIDATION SUITE"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    tests = [
        ("Unit Testing", "Vitest tests covering Zod schemas, provenance calculation, and anomaly detection functions."),
        ("API Integration Testing", "Supertest suites validating JWT authentication, role authorization, and batch transfer lifecycles."),
        ("Chaincode Contract Testing", "12/12 Fabric chaincode tests passing (Batch creation, custody handshakes, duplicate rejection, and recall flags)."),
        ("Failure Simulation", "Simulated database reconnects and outbox retries during intentional Fabric peer pauses.")
    ]
    for k, v in tests:
        p1 = tf.add_paragraph()
        p1.text = k
        p1.font.name = "Arial"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(8)
        
        p2 = tf.add_paragraph()
        p2.text = v
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    sec_box = add_card(slide15, Inches(4.7), Inches(1.8), Inches(3.6), Inches(5.0))
    tf = sec_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
    p = tf.paragraphs[0]
    p.text = "SECURITY CONTROLS"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD

    secs = [
        ("Password Hashing", "Argon2id with cryptographic salts resistant to GPU brute-force attacks."),
        ("Token Management", "Short-lived JWT access tokens (15m) with HTTP-only refresh cookies (7d)."),
        ("Input Sanitation", "Strict Zod schemas prevent prototype pollution and SQL injection vulnerabilities."),
        ("Channel Privacy", "Fabric Membership Service Providers (MSPs) enforce enterprise organization boundaries."),
        ("Hash Pinning", "Off-chain QA documents verified via SHA-256 digests anchored on ledger.")
    ]
    for k, v in secs:
        p1 = tf.add_paragraph()
        p1.text = k
        p1.font.name = "Arial"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(8)
        
        p2 = tf.add_paragraph()
        p2.text = v
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    lim_box = add_card(slide15, Inches(8.6), Inches(1.8), Inches(3.9), Inches(5.0))
    tf = lim_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.2)
    p = tf.paragraphs[0]
    p.text = "INHERENT SYSTEM LIMITATIONS"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ROSE

    lims = [
        ("The Oracle / Physical Bond Problem", "A blockchain verifies the digital transition of custody records, but cannot autonomously prove that liquid chemical composition inside a sealed vial remains untampered."),
        ("Garbage-In, Garbage-Out Risk", "If a corrupt manufacturer inputs fraudulent batch data at origin, the ledger accurately and immutably records fraudulent data."),
        ("Production Deployment Barriers", "Real-world rollout requires industry consortium governance, legal trust frameworks, and interoperability with diverse legacy enterprise ERP systems.")
    ]
    for k, v in lims:
        p1 = tf.add_paragraph()
        p1.text = k
        p1.font.name = "Arial"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(8)
        
        p2 = tf.add_paragraph()
        p2.text = v
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    slide16 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide16)
    add_header(slide16, "Conclusion, Future Horizons & Authoritative References", "Part 2: Engineering & Implementation", 16)

    conc_box = add_card(slide16, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tf = conc_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = Inches(0.25)
    p = tf.paragraphs[0]
    p.text = "PROJECT SUMMARY & CONTRIBUTIONS"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    c_points = [
        ("Delivered Pragmatic Hybrid Architecture", "Demonstrated that combining PostgreSQL with Hyperledger Fabric overcomes the high latency and public privacy flaws of naive blockchain designs."),
        ("End-to-End Cryptographic Provenance", "Proved successful traceability from batch commissioning and multi-tier custody transfer to public QR verification and emergency recall execution."),
        ("Resilient Ledger Synchronization", "Successfully engineered a transactional outbox pipeline that prevents data loss during peer disconnects."),
        ("Integrated Anomaly Surveillance", "Coupled deterministic heuristic rule engines with cloud LLM auditing for predictive supply chain risk assessment.")
    ]
    for k, v in c_points:
        p1 = tf.add_paragraph()
        p1.text = k
        p1.font.name = "Arial"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(8)
        
        p2 = tf.add_paragraph()
        p2.text = v
        p2.font.name = "Arial"
        p2.font.size = Pt(9)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(1)

    right_box = add_card(slide16, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tf_r = right_box.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = Inches(0.2)
    
    p = tf_r.paragraphs[0]
    p.text = "FUTURE WORK HORIZONS"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_EMERALD

    f_points = [
        "IoT Cold-Chain Telemetry: Smart contracts verifying continuous BLE/cellular temperature sensor logging.",
        "National GS1 Serialization: Full compliance with Indian National Digital Health Mission (NDHM) & GS1 2D DataMatrix standards.",
        "Multi-Hospital Consortium Pilot: Live trial across regional distribution centers and public health hospitals."
    ]
    for pt in f_points:
        pi = tf_r.add_paragraph()
        pi.text = f"• {pt}"
        pi.font.name = "Arial"
        pi.font.size = Pt(9.5)
        pi.font.color.rgb = TEXT_WHITE
        pi.space_before = Pt(4)

    p_ref = tf_r.add_paragraph()
    p_ref.text = "AUTHORITATIVE REFERENCES & REGULATORY DOCUMENTS"
    p_ref.font.name = "Arial"
    p_ref.font.size = Pt(11)
    p_ref.font.bold = True
    p_ref.font.color.rgb = ACCENT_AMBER
    p_ref.space_before = Pt(14)

    refs = [
        ("Hyperledger Fabric 2.5 Documentation", "https://hyperledger-fabric.readthedocs.io/"),
        ("Ministry of Electronics & IT (MeitY)", "National Strategy on Blockchain (https://blockchain.meity.gov.in/)"),
        ("NITI Aayog Strategy Paper", "Blockchain: The India Strategy (https://www.niti.gov.in/node/296)"),
        ("Press Information Bureau (PIB) India", "Mandatory QR Code on Active Pharmaceutical Ingredients (PRID: 2277691)")
    ]
    for title, url in refs:
        p1 = tf_r.add_paragraph()
        p1.text = f"• {title}: "
        p1.font.name = "Arial"
        p1.font.size = Pt(9)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_WHITE
        p1.space_before = Pt(4)
        
        run = p1.add_run()
        run.text = url
        run.font.bold = False
        run.font.color.rgb = ACCENT_CYAN

    prs.save("SecureChainLedger_Final_Presentation.pptx")
    print("SUCCESS: SecureChainLedger_Final_Presentation.pptx generated successfully!")

if __name__ == "__main__":
    create_presentation()
