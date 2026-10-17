/* =========================================
   NoorKit — Templates Tools (v1)
   قوالب جاهزة — 6 قوالب
   ========================================= */

window.NoorTemplatesTools = {
  TEMPLATES: [
    {
      id: "classic",
      name: "كلاسيكي",
      icon: "📜",
      preview: "linear-gradient(135deg, #f5ede0, #e8dcc0)",
      data: {
        background: { type: "solid", value: "#f5ede0" },
        text: { color: "#1a1a1a", fontId: "Amiri", size: 72, align: "center", lineHeight: 1.8 },
        frame: { type: "simple", color: "#c9a227", thickness: 4 },
      },
    },
    {
      id: "gold",
      name: "ذهبي",
      icon: "👑",
      preview: "linear-gradient(135deg, #c9a227, #fff8d0)",
      data: {
        background: { type: "gradient", value: "linear-gradient(135deg, #c9a227 0%, #fff8d0 100%)" },
        text: { color: "#1a1a1a", fontId: "Amiri", size: 76, align: "center", lineHeight: 1.8 },
        frame: { type: "double", color: "#7a5a00", thickness: 3 },
        shadow: { enabled: true, color: "#7a5a00", blur: 8, x: 0, y: 3, opacity: 60 },
      },
    },
    {
      id: "night",
      name: "ليلي",
      icon: "🌙",
      preview: "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
      data: {
        background: { type: "solid", value: "#1a1a1a" },
        text: { color: "#ffffff", fontId: "Amiri", size: 72, align: "center", lineHeight: 1.8 },
        glow: { enabled: true, color: "#c9a227", intensity: 20 },
      },
    },
    {
      id: "emerald",
      name: "زمردي",
      icon: "💚",
      preview: "linear-gradient(135deg, #0d8b5f, #166534)",
      data: {
        background: { type: "solid", value: "#0d8b5f" },
        text: { color: "#fff8d0", fontId: "Amiri", size: 72, align: "center", lineHeight: 1.8 },
        frame: { type: "simple", color: "#fff8d0", thickness: 3 },
      },
    },
    {
      id: "rose",
      name: "وردي",
      icon: "🌸",
      preview: "linear-gradient(135deg, #fda4af, #be185d)",
      data: {
        background: { type: "gradient", value: "linear-gradient(135deg, #fda4af 0%, #be185d 100%)" },
        text: { color: "#ffffff", fontId: "Amiri", size: 72, align: "center", lineHeight: 1.8 },
        shadow: { enabled: true, color: "#4a0420", blur: 6, x: 0, y: 2, opacity: 70 },
      },
    },
    {
      id: "simple",
      name: "بسيط",
      icon: "⬜",
      preview: "linear-gradient(135deg, #ffffff, #f0f0f0)",
      data: {
        background: { type: "solid", value: "#ffffff" },
        text: { color: "#1a1a1a", fontId: "Amiri", size: 64, align: "center", lineHeight: 1.8 },
        frame: { type: "none", color: "#c9a227", thickness: 4 },
      },
    },
  ],

  renderContent(toolId) {
    /* ═══ قوالب الآيات ═══ */
    if (toolId === "templates-ayat" || toolId === "templates-text" || toolId === "templates-social") {
      const cards = this.TEMPLATES.map(
        (t) => `
          <button class="nk-template-card" data-template="${t.id}">
            <span class="nk-template-preview" style="background:${t.preview};">
              <span class="nk-template-icon">${t.icon}</span>
            </span>
            <span class="nk-template-name">${t.name}</span>
          </button>
        `
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">اختر قالباً</span></div>
        <div class="nk-template-grid">${cards}</div>
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  bindContent(toolId) {
    document.querySelectorAll("[data-template]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.template;
        const tpl = this.TEMPLATES.find((t) => t.id === id);
        if (!tpl) return;

        const d = NoorState.design;

        /* ═══ تطبيق الخلفية ═══ */
        if (tpl.data.background) {
          d.background.type = tpl.data.background.type;
          d.background.value = tpl.data.background.value;
          d.background.imageUrl = null;
        }

        /* ═══ تطبيق النص ═══ */
        if (tpl.data.text) {
          Object.assign(d.text, tpl.data.text);
        }

        /* ═══ تطبيق الإطار ═══ */
        if (tpl.data.frame) {
          d.frame = { ...tpl.data.frame };
        }

        /* ═══ تطبيق التأثيرات ═══ */
        if (tpl.data.shadow) {
          d.text.shadow = { ...tpl.data.shadow };
        } else {
          d.text.shadow = { enabled: false, color: "#000000", blur: 8, x: 0, y: 4, opacity: 100 };
        }

        if (tpl.data.glow) {
          d.text.glow = { ...tpl.data.glow };
        } else {
          d.text.glow = { enabled: false, color: "#c9a227", intensity: 15 };
        }

        if (tpl.data.outline) {
          d.text.outline = { ...tpl.data.outline };
        } else {
          d.text.outline = { enabled: false, color: "#ffffff", width: 2 };
        }

        if (tpl.data.gradient) {
          d.text.gradient = { ...tpl.data.gradient };
        } else {
          d.text.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
        }

        if (tpl.data.highlight) {
          d.text.highlight = { ...tpl.data.highlight };
        } else {
          d.text.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
        }

        /* ═══ إعادة الرسم ═══ */
        NoorState.pushHistory();
        await NoorRenderer.render();

        if (typeof window.showToast === "function") {
          window.showToast("تم تطبيق القالب: " + tpl.name);
        }
      });
    });
  },
};
