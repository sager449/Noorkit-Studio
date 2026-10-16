/* =========================================
   NoorKit — Core Colors (v1)
   68 لوناً مميزاً + منتقي
   ========================================= */

window.NoorColors = {
  /* ═══════════════════════════════════════════════
     اللوحة الكاملة — 68 لوناً
     ═══════════════════════════════════════════════ */
  palette: [
    /* رمادي */
    "#000000", "#1a1a1a", "#2a2a2a", "#3a3a3a",
    "#555555", "#78716c", "#888888", "#b0b0b0",
    "#d4d4d4", "#ffffff",

    /* ذهبي / أصفر */
    "#c9a227", "#d4af37", "#e6c34a", "#f0d878",
    "#fff8d0", "#f59e0b", "#fbbf24", "#fcd34d",

    /* برتقالي / نار */
    "#ea580c", "#f97316", "#fb923c", "#fdba74",
    "#b91c1c", "#dc2626", "#ef4444", "#f87171",
    "#7c1d00", "#c2410c",

    /* بني */
    "#78350f", "#a16207", "#b45309", "#92400e",
    "#8b4513", "#a0522d",

    /* أخضر */
    "#0d8b5f", "#059669", "#10b981", "#34d399",
    "#65a30d", "#84cc16", "#4ade80", "#166534",

    /* أزرق */
    "#1e40af", "#2563eb", "#3b82f6", "#60a5fa",
    "#0891b2", "#06b6d4", "#22d3ee", "#0e7490",

    /* بنفسجي */
    "#7c3aed", "#8b5cf6", "#a855f7", "#c084fc",
    "#6366f1", "#818cf8", "#a78bfa", "#4c1d95",

    /* وردي */
    "#be185d", "#db2777", "#ec4899", "#f472b6",
    "#e11d48", "#f43f5e", "#fb7185", "#fda4af",

    /* كريمي / ورقي */
    "#f5ede0", "#faf5eb", "#e8dcc0", "#d4c5a0",
  ],

  /* ═══════════════════════════════════════════════
     توليد شبكة الألوان
     ═══════════════════════════════════════════════ */
  renderSwatches(selectedColor, dataAttr) {
    const attr = dataAttr || "color";
    return this.palette
      .map((c) => {
        const isActive = c === selectedColor ? "active" : "";
        return `<button class="nk-color-dot ${isActive}" data-${attr}="${c}" style="background:${c};"></button>`;
      })
      .join("");
  },

  /* ═══════════════════════════════════════════════
     Hex + Opacity → RGBA
     ═══════════════════════════════════════════════ */
  toRgba(hex, opacity) {
    if (!hex) return `rgba(0,0,0,${(opacity ?? 100) / 100})`;

    let h = hex.replace("#", "");
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(h.substring(0, 2), 16) || 0;
    const g = parseInt(h.substring(2, 4), 16) || 0;
    const b = parseInt(h.substring(4, 6), 16) || 0;
    const a = (typeof opacity === "number" ? opacity : 100) / 100;

    return `rgba(${r},${g},${b},${a})`;
  },

  /* ═══════════════════════════════════════════════
     التحقق من صحة Hex
     ═══════════════════════════════════════════════ */
  isValidHex(str) {
    if (!str) return false;
    let s = str.trim();
    if (!s.startsWith("#")) s = "#" + s;
    return /^#[0-9A-Fa-f]{6}$/.test(s);
  },

  /* ═══════════════════════════════════════════════
     تنسيق Hex (إضافة # إذا لزم)
     ═══════════════════════════════════════════════ */
  normalizeHex(str) {
    if (!str) return null;
    let s = str.trim().toUpperCase();
    if (!s.startsWith("#")) s = "#" + s;
    return this.isValidHex(s) ? s : null;
  },

  /* ═══════════════════════════════════════════════
     منتقي اللون (iro.js) — نافذة كاملة
     ═══════════════════════════════════════════════ */
  openPicker(initialColor, onConfirm) {
    let modal = document.getElementById("nk-iro-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "nk-iro-modal";
      modal.className = "nk-iro-modal";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="nk-iro-body">
          <div id="nk-iro-picker"></div>
        </div>
        <div class="nk-iro-footer">
          <button class="nk-iro-btn nk-iro-cancel" id="nk-iro-cancel">✕</button>
          <button class="nk-iro-btn nk-iro-confirm" id="nk-iro-confirm">✓</button>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("nk-iro-cancel").addEventListener("click", () => {
        modal.hidden = true;
      });
    }

    let currentColor = initialColor || "#ffffff";
    modal.hidden = false;

    setTimeout(() => {
      const container = document.getElementById("nk-iro-picker");
      if (!container || typeof iro === "undefined") return;

      container.innerHTML = "";

      const picker = new iro.ColorPicker(container, {
        width: Math.min(window.innerWidth - 80, 260),
        color: currentColor,
        borderWidth: 0,
        layoutDirection: "horizontal",
        layout: [
          { component: iro.ui.Wheel },
          { component: iro.ui.Slider, options: { sliderType: "value" } },
        ],
      });

      picker.on("color:change", (color) => {
        currentColor = color.hexString;
      });

      const confirmBtn = document.getElementById("nk-iro-confirm");
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

      newBtn.addEventListener("click", async () => {
        modal.hidden = true;
        if (typeof onConfirm === "function") {
          await onConfirm(currentColor);
        }
      });
    }, 20);
  },
};
