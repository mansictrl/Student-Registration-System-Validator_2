# Student Registration System Validator
### TOC Mini-Project · Topic #1 · Course: 2304220T · AY 2025–26
### Department of Computer Engineering

---

## 📁 Project Structure

```
regex_project/
│
├── index.html            ← Main web form (8 input fields)
├── style.css             ← All styling: dark theme, error/success states, animations
├── validate.js           ← All regex patterns + JavaScript validation engine
│
├── test_report.html      ← 48 test cases (3 valid + 3 invalid per field)
├── theory_supplement.html← Formal L={} notation, DFA diagrams, automata justification
├── group_report.html     ← 1-page group report: roles, challenges, learnings
│
└── README.md             ← This file
```

---

## 🚀 How to Run

### Option 1 — VS Code + Live Server (Recommended)
```bash
# 1. Extract ZIP
unzip PRN_GroupLeader_Topic1.zip
cd regex_project

# 2. Open in VS Code
code .

# 3. Install Live Server extension (if not already installed)
#    Ctrl+Shift+X → search "Live Server" → Install

# 4. Right-click index.html → "Open with Live Server"
#    Opens at: http://127.0.0.1:5500/regex_project/index.html
```

### Option 2 — Direct Browser (No setup needed)
```
Double-click index.html → opens in any browser (Chrome/Edge/Firefox)
```

> ⚠️ No Node.js, npm, or server setup required. Pure HTML + CSS + JS.

---

## 📋 Fields & Regex Patterns

| # | Field | HTML Type | Regex Pattern | Formal Language |
|---|-------|-----------|---------------|-----------------|
| 1 | Full Name | `text` | `/^[A-Za-z][A-Za-z\s]{1,49}$/` | L₁ = { w \| w[0]∈[A-Za-z], 2≤\|w\|≤50 } |
| 2 | PRN Number | `text` | `/^\d{12}$/` | L₂ = { w \| w∈[0-9]¹², \|w\|=12 } |
| 3 | College Email | `email` | `/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/` | L₃ = { local@domain.tld } |
| 4 | Mobile Number | `tel` | `/^[6-9]\d{9}$/` | L₄ = { w \| w[0]∈{6-9}, \|w\|=10 } |
| 5 | Date of Birth | `date` | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | L₅ = { YYYY-MM-DD \| year∈[1990,2010] } |
| 6 | Year of Admission | `number` | `/^(20[0-2]\d\|2030)$/` | L₆ = { w \| w∈{2000…2030} } |
| 7 | Password | `password` | `/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/` | L₇ = L_upper ∩ L_lower ∩ L_digit ∩ L_sym ∩ L_len≥8 |
| 8 | Profile Photo | `file` | `/^[\w\-]+\.(jpg\|jpeg\|png)$/i` | L₈ = { w.ext \| w∈[A-Za-z0-9_\-]⁺, ext∈{jpg,jpeg,png} } |

---

## ✅ Features Implemented

### Phase 1 — Form Design
- 8 input fields using **varied HTML5 input types**: text, email, tel, date, number, password, file
- Semantic HTML with `<main>`, `<header>`, `<footer>`, `<label>`, `<form>`

### Phase 2 — Regex Theory
- Formal language notation L = { w | ... } for all 8 fields
- **DFA diagrams** for Field 1 (Full Name) and Field 2 (PRN Number) in `theory_supplement.html`
- Automata-class justification for all 8 fields
- CO.5 decidability comparison table (regex vs natural language parsing)

### Phase 3 — Validation Script (JavaScript)
- All patterns implemented using `RegExp` via JavaScript
- **Sanitization**: whitespace collapse for names, trim for all fields
- **Edge-case handling**: DOB year range check (1990–2010), file size ≤ 2MB, file extension via regex
- `DOMContentLoaded` wrapper ensures script runs after HTML loads
- Modular structure: `VALIDATORS` object, `validateField()`, `setValid()`, `setInvalid()`, `clearState()`

### Phase 4 — UI & Feedback
- **Real-time validation**: blur-first (no premature errors), then live as user types
- **Password strength meter**: WEAK → FAIR → GOOD → STRONG with color bar
- **File preview**: shows thumbnail + filename + size after upload
- **ARIA accessibility**: `aria-describedby`, `aria-required`, `aria-invalid`, `aria-live="polite"` on all fields
- Success/error CSS states with animations (`is-valid` / `is-invalid`)
- Scroll-to-first-error on failed submit

### Phase 5 — Testing & Documentation
- **48 test cases** in `test_report.html` (exactly 3 valid + 3 invalid per field)
- Boundary cases explicitly noted (min/max values, edge lengths)
- Theory supplement with formal DFA descriptions
- 1-page group report with team roles and contribution percentages

---

## 👥 Team Roles

| Role | Member | Responsibility |
|------|--------|----------------|
| Team Lead + Script Dev | [Member 1] | Regex design, validate.js, edge cases |
| UI Developer | Mansi Shinde  | index.html, style.css, UX, ARIA |
| Documentation Lead | [Member 3] | Theory supplement, DFA diagrams, report |
| QA + Testing | [Member 4] | Test report, boundary cases, ZIP submission |

---



## 🔗 Course Details

- **Course**: Theory of Computation (2304220T)
- **Topic**: #1 — Student Registration System Validator  
- **CO Mapped**: CO.1, CO.2, CO.3, CO.4, CO.5
- **Total Marks**: 20
- **Department**: Computer Engineering · AY 2025–26
