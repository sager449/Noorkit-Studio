/* =========================================
   NoorKit — Debug Console
   نافذة مرئية لكشف الأخطاء
   ========================================= */

(function () {
  "use strict";

  const ENABLED = true;
  const seen = new Set();
  let box = null;

  function ensureBox() {
    if (box) return box;
    box = document.createElement("div");
    box.id = "nk-debug-box";
    box.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      max-height: 50vh;
      overflow-y: auto;
      background: rgba(20, 20, 20, 0.96);
      color: #fff;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #ff4d4d;
      z-index: 999999;
      direction: ltr;
      text-align: left;
      display: none;
      box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    `;
    document.body.appendChild(box);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = `
      position: absolute;
      top: 6px;
      right: 8px;
      background: transparent;
      color: #ff4d4d;
      border: none;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    `;
    closeBtn.addEventListener("click", () => {
      box.style.display = "none";
    });
    box.appendChild(closeBtn);

    const messages = document.createElement("div");
    messages.id = "nk-debug-messages";
    box.appendChild(messages);

    return box;
  }

  function log(type, message, extra) {
    if (!ENABLED) return;

    const key = type + "::" + message;
    if (seen.has(key)) return;
    seen.add(key);

    const box = ensureBox();
    box.style.display = "block";

    const msgEl = document.getElementById("nk-debug-messages");
    if (!msgEl) return;

    const color =
      type === "ERROR" ? "#ff4d4d" : type === "WARN" ? "#f59e0b" : "#0d8b5f";

    const div = document.createElement("div");
    div.style.cssText = `
      padding: 6px 8px;
      margin: 4px 0;
      border-left: 3px solid ${color};
      background: rgba(255,255,255,0.05);
      border-radius: 4px;
      word-break: break-word;
    `;

    const time = new Date().toLocaleTimeString("en-GB");

    div.innerHTML = `
      <div style="color:${color};font-weight:bold;">[${type}] ${time}</div>
      <div style="color:#e8e8e8;margin-top:2px;">${escapeHtml(message)}</div>
      ${
        extra
          ? `<div style="color:#888;margin-top:2px;font-size:10px;">${escapeHtml(String(extra))}</div>`
          : ""
      }
    `;

    msgEl.appendChild(div);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.addEventListener("error", (e) => {
    if (e.message) {
      log("ERROR", e.message, e.filename + ":" + e.lineno);
    }
  });

  window.addEventListener("unhandledrejection", (e) => {
    log("ERROR", "Promise: " + (e.reason?.message || e.reason), "");
  });

  const origError = console.error;
  console.error = function (...args) {
    origError.apply(console, args);
    log("ERROR", args.map((a) => (a?.message || a)).join(" "), "");
  };

  const origWarn = console.warn;
  console.warn = function (...args) {
    origWarn.apply(console, args);
    log("WARN", args.map((a) => (a?.message || a)).join(" "), "");
  };

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      checkGlobals();
    }, 800);
  });

  function checkGlobals() {
    const required = [
      "NoorState",
      "NoorRenderer",
      "NoorFonts",
      "NoorColors",
      "NoorToolbar",
      "NoorDB",
      "NoorQuranAPI",
      "NoorQuranTools",
    ];

    const missing = [];
    required.forEach((name) => {
      if (typeof window[name] === "undefined") {
        missing.push(name);
      }
    });

    if (missing.length > 0) {
      log("WARN", "متغيرات مفقودة: " + missing.join(", "), "");
    } else {
      log("OK", "كل الأنظمة محمّلة بنجاح ✅", "");
    }

    const toolbar = document.getElementById("nk-toolbars");
    if (toolbar) {
      log("OK", "الشريط السفلي موجود ✅", "");
    } else {
      log("ERROR", "الشريط السفلي مفقود ❌", "NoorToolbar.init() فشل؟");
    }

    const canvas = document.getElementById("main-canvas");
    if (canvas) {
      log("OK", "Canvas موجود ✅", "");
    }
  }

  window.NoorDebug = {
    log: (msg, extra) => log("OK", msg, extra),
    warn: (msg, extra) => log("WARN", msg, extra),
    error: (msg, extra) => log("ERROR", msg, extra),
    clear: () => {
      const m = document.getElementById("nk-debug-messages");
      if (m) m.innerHTML = "";
      seen.clear();
    },
    show: () => {
      const b = ensureBox();
      b.style.display = "block";
    },
    hide: () => {
      if (box) box.style.display = "none";
    },
  };
})();
