/**
 * validate.js — Student Registration System Validator
 * =====================================================
 * Course  : Theory of Computation (2304220T)
 * Topic   : #1 — Student Registration System Validator
 * Method  : Client-side JavaScript using RegExp
 * AY      : 2025–26
 *
 * FIELDS COVERED:
 *  1. fullName  — type="text"     — Regex: /^[A-Za-z][A-Za-z\s]{1,49}$/
 *  2. prn       — type="text"     — Regex: /^\d{12}$/
 *  3. email     — type="email"    — Regex: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
 *  4. mobile    — type="tel"      — Regex: /^[6-9]\d{9}$/
 *  5. dob       — type="date"     — Regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
 *  6. admYear   — type="number"   — Regex: /^(20[0-2]\d|2030)$/
 *  7. password  — type="password" — Regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
 *  8. photo     — type="file"     — Regex: /^[\w\-]+\.(jpg|jpeg|png)$/i  +  size ≤ 2MB
 */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     1. REGEX VALIDATORS — Formal Language Definitions
     ========================================================== */

  const VALIDATORS = {

    /**
     * FIELD 1: Full Name
     * type       : text
     * Regex      : /^[A-Za-z][A-Za-z\s]{1,49}$/
     * Formal     : L₁ = { w | w[0] ∈ [A-Za-z], w[1..] ∈ ([A-Za-z]∪{space})*, 2 ≤ |w| ≤ 50 }
     * Automaton  : Regular — DFA (finite counting states, fixed alphabet)
     * Valid Ex   : "Riya Sharma", "Aarav Kumar", "Jo"
     * Invalid Ex : "123Riya", "R", "Riya@Sharma"
     */
    fullName: {
      pattern:  /^[A-Za-z][A-Za-z\s]{1,49}$/,
      errorMsg: "Name must be 2–50 letters/spaces and must start with a letter.",
    },

    /**
     * FIELD 2: PRN Number
     * type       : text (inputmode=numeric)
     * Regex      : /^\d{12}$/
     * Formal     : L₂ = { w | w ∈ [0-9]¹², |w| = 12 }
     * Automaton  : Regular — DFA (13-state counter: q₀…q₁₂, q₁₂ accepting)
     * Valid Ex   : "230422001234", "000000000001", "123456789012"
     * Invalid Ex : "23042200123" (11 digits), "2304220012345" (13 digits), "2304220012AB"
     */
    prn: {
      pattern:  /^\d{12}$/,
      errorMsg: "PRN must be exactly 12 digits (e.g. 230422001234).",
    },

    /**
     * FIELD 3: College Email
     * type       : email
     * Regex      : /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
     * Formal     : L₃ = { local@domain.tld | local ∈ Σ₁⁺, domain ∈ Σ₂⁺, tld ∈ [a-zA-Z]{2,} }
     *              where Σ₁ = [a-zA-Z0-9._%+\-], Σ₂ = [a-zA-Z0-9.\-]
     * Automaton  : Regular — DFA (zones: local → '@' → domain → '.' → tld)
     * Valid Ex   : "riya@college.edu.in", "user.name+tag@example.org", "a@b.co"
     * Invalid Ex : "noatsign.com", "user@.com", "user@domain"
     */
    email: {
      pattern:  /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
      errorMsg: "Enter a valid email address (e.g. name@college.edu.in).",
    },

    /**
     * FIELD 4: Mobile Number (India)
     * type       : tel
     * Regex      : /^[6-9]\d{9}$/
     * Formal     : L₄ = { w | w[0] ∈ {6,7,8,9}, w[1..9] ∈ [0-9], |w| = 10 }
     * Automaton  : Regular — DFA (11-state: first restricted, then 9 any-digit states)
     * Valid Ex   : "9876543210", "6000000000", "8123456789"
     * Invalid Ex : "5123456789" (starts 5), "987654321" (9 digits), "98765ABCDE"
     */
    mobile: {
      pattern:  /^[6-9]\d{9}$/,
      errorMsg: "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.",
    },

    /**
     * FIELD 5: Date of Birth
     * type       : date  (browser returns value in YYYY-MM-DD)
     * Regex      : /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
     * Formal     : L₅ = { YYYY-MM-DD | YYYY ∈ [0-9]⁴, MM ∈ {01..12}, DD ∈ {01..31} }
     * Automaton  : Regular — DFA (structural format check; calendar correctness
     *              e.g. Feb-30 is not regular — requires context-sensitive power)
     * Additional : Range check: year must be 1990–2010 (done in JS, not regex)
     * Valid Ex   : "2004-08-15", "1999-12-31", "1990-01-01"
     * Invalid Ex : "2004-13-01" (month>12), "2004-00-15" (month=0), "2004-08-32" (day>31)
     */
    dob: {
      pattern:  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
      errorMsg: "Please select a valid date of birth between 1990 and 2010.",
      extraCheck: function(value) {
        // Additional range validation beyond regex
        const year = parseInt(value.split("-")[0], 10);
        if (year < 1990 || year > 2010) {
          return "Year must be between 1990 and 2010.";
        }
        return null; // null = no extra error
      },
    },

    /**
     * FIELD 6: Year of Admission
     * type       : number
     * Regex      : /^(20[0-2]\d|2030)$/
     * Formal     : L₆ = { w | w ∈ {2000,2001,...,2029,2030} }
     * Automaton  : Regular — DFA (alternation of finite set of strings)
     * Valid Ex   : "2023", "2000", "2030"
     * Invalid Ex : "1999" (before 2000), "2031" (after 2030), "20AB"
     */
    admYear: {
      pattern:  /^(20[0-2]\d|2030)$/,
      errorMsg: "Admission year must be a 4-digit year between 2000 and 2030.",
    },

    /**
     * FIELD 7: Password
     * type       : password
     * Regex      : /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
     * Formal     : L₇ = L_upper ∩ L_lower ∩ L_digit ∩ L_sym ∩ L_len8
     *              Each Lᵢ is regular; intersection of regular langs is regular.
     *              Lookaheads in JS implement zero-width conjunction assertions.
     * Automaton  : Regular — Product-DFA of 5 component DFAs
     * Valid Ex   : "Secure@123", "P@ssw0rd!", "Abc$5678"
     * Invalid Ex : "password1" (no uppercase/symbol), "Short1!" (7 chars), "ALLCAPS123!"
     */
    password: {
      pattern:  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      errorMsg: "Min 8 chars — needs uppercase, lowercase, digit & symbol (@$!%*?&).",
    },

    /**
     * FIELD 8: Profile Photo (file upload)
     * type       : file
     * Regex      : /^[\w\-]+\.(jpg|jpeg|png)$/i   (applied to filename)
     * Formal     : L₈ = { w.ext | w ∈ ([A-Za-z0-9_\-])⁺, ext ∈ {jpg, jpeg, png} }
     * Automaton  : Regular — DFA (filename body + literal dot + alternation of extensions)
     * Additional : File size ≤ 2MB (checked in JS, not regex — numeric comparison)
     * Valid Ex   : "photo.jpg", "my-photo.png", "student_1.jpeg"
     * Invalid Ex : "photo.gif" (wrong ext), "my photo.jpg" (space in name), ".jpg" (empty name)
     */
    photo: {
      pattern:  /^[\w\-]+\.(jpg|jpeg|png)$/i,
      errorMsg: "Upload a JPG or PNG file. Filename must use only letters, numbers, _ or -.",
      isFile:   true,
      maxBytes: 2 * 1024 * 1024, // 2 MB
    },
  };

  /* ==========================================================
     2. SANITIZATION HELPERS
     ========================================================== */

  /**
   * sanitizeText — strips leading/trailing whitespace and
   * collapses internal multiple spaces to single space.
   * Prevents whitespace-only inputs from passing name validation.
   */
  function sanitizeText(value) {
    return value.trim().replace(/\s{2,}/g, " ");
  }

  /**
   * sanitizeNumericString — removes any non-digit characters.
   * Used for PRN and mobile to handle accidental dashes/spaces.
   */
  function sanitizeNumericString(value) {
    return value.replace(/\D/g, "");
  }

  /* ==========================================================
     3. DOM HELPERS
     ========================================================== */

  function getGroup(fieldId) {
    return document.getElementById("fg-" + fieldId);
  }

  function setValid(fieldId) {
    const group = getGroup(fieldId);
    const input = document.getElementById(fieldId);
    group.classList.remove("is-invalid");
    group.classList.add("is-valid");
    const errEl = document.getElementById(fieldId + "-error");
    if (errEl) errEl.textContent = "";
    if (input) input.setAttribute("aria-invalid", "false");
  }

  function setInvalid(fieldId, message) {
    const group = getGroup(fieldId);
    const input = document.getElementById(fieldId);
    group.classList.remove("is-valid");
    group.classList.add("is-invalid");
    const errEl = document.getElementById(fieldId + "-error");
    if (errEl) errEl.textContent = message;
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearState(fieldId) {
    const group = getGroup(fieldId);
    const input = document.getElementById(fieldId);
    if (!group) return;
    group.classList.remove("is-valid", "is-invalid");
    const errEl = document.getElementById(fieldId + "-error");
    if (errEl) errEl.textContent = "";
    if (input) input.removeAttribute("aria-invalid");
  }

  /* ==========================================================
     4. VALIDATE SINGLE FIELD
     ========================================================== */

  function validateField(fieldId) {
    const validator = VALIDATORS[fieldId];
    if (!validator) return true;

    const input = document.getElementById(fieldId);
    if (!input) return true;

    /* ── FILE FIELD (photo) ── */
    if (validator.isFile) {
      if (!input.files || input.files.length === 0) {
        setInvalid(fieldId, "Please upload a profile photo.");
        return false;
      }
      const file     = input.files[0];
      const filename = file.name;

      if (!validator.pattern.test(filename)) {
        setInvalid(fieldId, validator.errorMsg);
        return false;
      }
      if (file.size > validator.maxBytes) {
        setInvalid(fieldId, "File is too large. Maximum allowed size is 2 MB.");
        return false;
      }
      setValid(fieldId);
      return true;
    }

    /* ── TEXT / NUMBER / DATE / TEL / EMAIL / PASSWORD FIELDS ── */
    let raw   = input.value;
    let value = raw;

    // Sanitize based on field type
    if (fieldId === "fullName") {
      value = sanitizeText(raw);
      // Sync sanitized value back to field
      if (value !== raw) input.value = value;
    }
    if (fieldId === "prn" || fieldId === "mobile") {
      // Show error if non-digits typed, but don't auto-strip (let regex catch it)
      value = raw.trim();
    }
    if (fieldId === "email" || fieldId === "password" || fieldId === "dob" || fieldId === "admYear") {
      value = raw.trim();
    }

    if (!value && value !== "0") {
      setInvalid(fieldId, "This field is required.");
      return false;
    }

    if (!validator.pattern.test(value)) {
      setInvalid(fieldId, validator.errorMsg);
      return false;
    }

    // Extra checks beyond regex (e.g. DOB year range)
    if (validator.extraCheck) {
      const extraError = validator.extraCheck(value);
      if (extraError) {
        setInvalid(fieldId, extraError);
        return false;
      }
    }

    setValid(fieldId);
    return true;
  }

  /* ==========================================================
     5. PASSWORD STRENGTH METER
     ========================================================== */

  function updateStrengthMeter(value) {
    const bar   = document.getElementById("strengthBar");
    const label = document.getElementById("strengthLabel");
    if (!bar || !label) return;

    if (!value) {
      bar.className = "strength-bar";
      label.textContent = "";
      label.style.color = "";
      return;
    }

    let score = 0;
    if (value.length >= 8)          score++;
    if (/[A-Z]/.test(value))        score++;
    if (/[a-z]/.test(value))        score++;
    if (/\d/.test(value))           score++;
    if (/[@$!%*?&]/.test(value))    score++;

    const levels = [
      { cls: "",       text: "",       color: "" },
      { cls: "weak",   text: "WEAK",   color: "var(--error)" },
      { cls: "fair",   text: "FAIR",   color: "var(--warn)" },
      { cls: "good",   text: "GOOD",   color: "#7dffb3" },
      { cls: "good",   text: "GOOD",   color: "#7dffb3" },
      { cls: "strong", text: "STRONG", color: "var(--success)" },
    ];
    const lvl = levels[score] || levels[0];
    bar.className       = "strength-bar " + lvl.cls;
    label.textContent   = lvl.text;
    label.style.color   = lvl.color;
    bar.parentElement.setAttribute("aria-valuenow", score);
  }

  /* ==========================================================
     6. FILE PREVIEW (photo field)
     ========================================================== */

  function handleFilePreview(file) {
    const preview     = document.getElementById("filePreview");
    const previewImg  = document.getElementById("previewImg");
    const previewName = document.getElementById("previewName");

    if (!file) {
      preview.hidden = true;
      return;
    }

    previewName.textContent = file.name + " (" + (file.size / 1024).toFixed(1) + " KB)";
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  /* ==========================================================
     7. REAL-TIME VALIDATION — blur-first, then on every input
     ========================================================== */

  Object.keys(VALIDATORS).forEach(function(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return;

    let touched = false; // Only show errors after first blur

    input.addEventListener("blur", function () {
      touched = true;
      validateField(fieldId);
      if (fieldId === "password") updateStrengthMeter(input.value);
    });

    input.addEventListener("input", function () {
      if (fieldId === "password") updateStrengthMeter(input.value);

      // Clear state if field becomes empty
      if (input.value === "" && fieldId !== "photo") {
        clearState(fieldId);
        return;
      }

      if (touched) validateField(fieldId);
    });

    // Special: file input uses "change" event
    if (fieldId === "photo") {
      input.addEventListener("change", function () {
        touched = true;
        if (input.files && input.files.length > 0) {
          handleFilePreview(input.files[0]);
        } else {
          document.getElementById("filePreview").hidden = true;
        }
        validateField(fieldId);
      });
    }
  });

  /* ==========================================================
     8. FORM SUBMIT — validate all, show success or scroll to error
     ========================================================== */

  document.getElementById("registrationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let allValid = true;

    Object.keys(VALIDATORS).forEach(function(fieldId) {
      const ok = validateField(fieldId);
      if (!ok) allValid = false;
    });

    const successBox = document.getElementById("formSuccess");

    if (allValid) {
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      successBox.hidden = true;
      // Scroll to first invalid field so user sees what to fix
      const firstInvalid = document.querySelector(".field-group.is-invalid input, .field-group.is-invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  /* ==========================================================
     9. RESET — clear all states and previews
     ========================================================== */

  document.getElementById("resetBtn").addEventListener("click", function () {
    document.getElementById("registrationForm").reset();

    Object.keys(VALIDATORS).forEach(function(fieldId) {
      clearState(fieldId);
    });

    // Reset strength meter
    updateStrengthMeter("");

    // Reset file preview
    const preview = document.getElementById("filePreview");
    if (preview) preview.hidden = true;

    // Hide success banner
    document.getElementById("formSuccess").hidden = true;
  });

}); // ── end DOMContentLoaded ──
