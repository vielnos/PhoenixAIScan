let scanInProgress = false;
let currentScanId = 0;

const API_SCAN_CODE = "https://phoenixaiscan-backend.onrender.com/scan";
const API_SCAN_FILE = "https://phoenixaiscan-backend.onrender.com/scan-file";

/* =========================
   MAIN ENTRY
========================= */

async function scanCode() {
  const codeEl = document.getElementById("code");
  const fileInput = document.getElementById("fileInput");
  const scanBtn = document.getElementById("scanBtn");

  if (scanInProgress) return;
  scanInProgress = true;

  const hasCode = codeEl && codeEl.value.trim().length > 0;
  const hasFile = fileInput && fileInput.files.length > 0;

  if (!hasCode && !hasFile) {
    shake(codeEl);
    scanInProgress = false;
    return;
  }

  const scanId = ++currentScanId;

  resetResultUI();
  showStatus("⏳ Waking up backend… first scan may take up to 60 seconds.");

  scanBtn.disabled = true;
  scanBtn.textContent = "⏳ Scanning…";

  try {
    let data;
    if (hasFile) {
      data = await scanUploadedFile(fileInput.files[0]);
    } else {
      data = await scanPastedCode(codeEl.value);
    }

    if (scanId !== currentScanId) return;

    renderResult(data);

  } catch (err) {
    console.error(err);
    showError(err.message || "❌ Scan failed. Please retry.");
  } finally {
    scanInProgress = false;
    scanBtn.disabled = false;
    scanBtn.textContent = "🔍 Scan Code";
  }
}

/* =========================
   API CALLS (WITH TIMEOUT)
========================= */

async function scanPastedCode(code) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(API_SCAN_CODE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language: "auto" }),
      signal: controller.signal
    });

    if (!res.ok) throw new Error("Scan API failed");
    return res.json();

  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Backend was sleeping. Please retry.");
    }
    throw err;

  } finally {
    clearTimeout(timeout);
  }
}

async function scanUploadedFile(file) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(API_SCAN_FILE, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    if (!res.ok) throw new Error("File scan API failed");
    return res.json();

  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Backend was sleeping. Please retry.");
    }
    throw err;

  } finally {
    clearTimeout(timeout);
  }
}

/* =========================
   RENDER RESULT
========================= */

function renderResult(data) {
  const resultEl = document.getElementById("result");
  const riskScoreEl = document.getElementById("riskScore");
  const riskBadgeEl = document.getElementById("riskBadge");
  const warningsEl = document.querySelector(".warnings");

  resultEl.classList.remove("hidden");
  warningsEl.innerHTML = "";

  animateNumber(riskScoreEl, data.risk_score);

  const level = data.risk_level.toLowerCase();
  riskBadgeEl.className = `risk-badge ${level}`;
  riskBadgeEl.textContent = data.risk_level;

  if (level === "high" || level === "critical") {
    pulse(resultEl);
  }

  if (!data.warnings || data.warnings.length === 0) {
    warningsEl.innerHTML = `
      <p style="color:#22c55e; margin-top:12px;">
        ✅ No dangerous operations detected.
      </p>
    `;
  } else {
    data.warnings.forEach((w, i) => {
      const div = document.createElement("div");
      div.className = "warning";
      div.style.animationDelay = `${i * 0.04}s`;

      div.innerHTML = `
        <strong>Line ${w.line}</strong>: ${escapeHtml(w.code)}<br>
        <em>${w.category}</em>
        ⚠️ ${w.explanation}
      `;
      warningsEl.appendChild(div);
    });
  }

  const codeEl = document.getElementById("code");
  if (codeEl && codeEl.value.trim()) {
    renderCodePreview(codeEl.value, data.warnings || []);
  }

  renderRiskSummary(data.warnings || []);
}

/* =========================
   CODE PREVIEW
========================= */

function renderCodePreview(code, warnings) {
  const section = document.getElementById("codePreviewSection");
  const preview = document.getElementById("codePreview");

  if (!section || !preview) return;

  section.classList.remove("hidden");
  preview.innerHTML = "";

  const lines = code.split("\n");
  const riskMap = {};

  warnings.forEach(w => {
    const r = w.risk.toLowerCase();
    if (!riskMap[w.line] || r === "critical") {
      riskMap[w.line] = r;
    }
  });

  lines.forEach((line, idx) => {
    const span = document.createElement("span");
    span.className = "code-line";
    span.dataset.line = String(idx + 1).padStart(3, " ");

    if (riskMap[idx + 1]) {
      span.classList.add(riskMap[idx + 1]);
    }

    span.textContent = line || " ";
    preview.appendChild(span);
  });

  const first = preview.querySelector(".critical, .high");
  if (first) {
    first.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* =========================
   RISK SUMMARY
========================= */

function renderRiskSummary(warnings) {
  const summarySection = document.getElementById("riskSummary");
  const summaryContent = document.getElementById("riskSummaryContent");

  if (!summarySection || !summaryContent) return;

  if (!warnings || warnings.length === 0) {
    summarySection.classList.add("hidden");
    summaryContent.innerHTML = "";
    return;
  }

  const grouped = {};

  warnings.forEach(w => {
    const risk = w.risk.toUpperCase();
    const category = w.category;

    if (!grouped[risk]) grouped[risk] = {};
    if (!grouped[risk][category]) grouped[risk][category] = 0;
    grouped[risk][category]++;
  });

  summaryContent.innerHTML = "";

  Object.keys(grouped).forEach(riskLevel => {
    const categories = grouped[riskLevel];
    const total = Object.values(categories).reduce((a, b) => a + b, 0);

    const block = document.createElement("div");
    block.style.marginBottom = "14px";

    block.innerHTML = `
      <strong>${riskLevel} (${total})</strong>
      <ul style="margin-top:6px; padding-left:18px;">
        ${Object.keys(categories).map(c => `<li>${c}</li>`).join("")}
      </ul>
    `;

    summaryContent.appendChild(block);
  });

  summarySection.classList.remove("hidden");
}

/* =========================
   UI RESET + STATUS
========================= */

function resetResultUI() {
  const resultEl = document.getElementById("result");
  const warningsEl = document.querySelector(".warnings");
  const previewSection = document.getElementById("codePreviewSection");
  const previewEl = document.getElementById("codePreview");
  const riskScoreEl = document.getElementById("riskScore");
  const riskBadgeEl = document.getElementById("riskBadge");

  if (resultEl) resultEl.classList.add("hidden");
  if (warningsEl) warningsEl.innerHTML = "";
  if (previewEl) previewEl.innerHTML = "";
  if (previewSection) previewSection.classList.add("hidden");

  if (riskScoreEl) riskScoreEl.textContent = "0";
  if (riskBadgeEl) {
    riskBadgeEl.textContent = "SAFE";
    riskBadgeEl.className = "risk-badge safe";
  }
}

function showStatus(msg) {
  const warningsEl = document.querySelector(".warnings");
  if (warningsEl) {
    warningsEl.innerHTML = `<p style="color:#facc15;">${msg}</p>`;
  }
}

/* =========================
   HELPERS
========================= */

function animateNumber(el, target) {
  let n = 0;
  const step = Math.max(1, Math.floor(target / 20));

  const t = setInterval(() => {
    n += step;
    if (n >= target) {
      n = target;
      clearInterval(t);
    }
    el.textContent = n;
  }, 20);
}

function shake(el) {
  if (!el) return;
  el.style.animation = "shake 0.4s";
  setTimeout(() => (el.style.animation = ""), 400);
}

function pulse(el) {
  el.style.animation = "pulse 0.6s ease-in-out 2";
  setTimeout(() => (el.style.animation = ""), 1200);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function showError(msg) {
  const warningsEl = document.querySelector(".warnings");
  warningsEl.innerHTML = `
    <p style="color:#ef4444;">
      ${msg}<br>
      <small>💡 Free backend may sleep after inactivity.</small>
    </p>
  `;
}
