/* =========================================
   NoorKit — Settings Tools (v1)
   إعدادات: الحجم، اللغة، حول
   ========================================= */

window.NoorSettingsTools = {
  SIZES: [
    { id: "square",   name: "مربع",         w: 1080, h: 1080, icon: "⬜" },
    { id: "portrait", name: "عمودي",        w: 1080, h: 1350, icon: "📱" },
    { id: "story",    name: "ستوري",        w: 1080, h: 1920, icon: "📲" },
    { id: "phone",    name: "خلفية جوال",  w: 1080, h: 2340, icon: "📱" },
    { id: "twitter",  name: "تويتر",        w: 1200, h: 675,  icon: "🐦" },
    { id: "youtube",  name: "يوتيوب",       w: 1280, h: 720,  icon: "▶️" },
    { id: "a4",       name: "A4 طباعة",    w: 2480, h: 3508, icon: "📄" },
  ],

  renderContent(toolId) {
    const d = NoorState.design;

    /* ═══ حجم التصميم ═══ */
    if (toolId === "settings-size") {
      const current = d.width === 1080 && d.height === 1080 ? "square" : "";

      const cards = this.SIZES.map(
        (s) => {
          const isActive = d.width === s.w && d.height === s.h ? "active" : "";
          return `
            <button class="nk-size-card ${isActive}" data-size-id="${s.id}" data-w="${s.w}" data-h="${s.h}">
              <span class="nk-size-icon">${s.icon}</span>
              <span class="nk-size-name">${s.name}</span>
              <span class="nk-size-dims">${s.w}×${s.h}</span>
            </button>
          `;
        }
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">حجم التصميم</span></div>
        <div class="nk-size-grid">${cards}</div>
      `;
    }

    /* ═══ اللغة ═══ */
    if (toolId === "settings-language") {
      return `
        <div style="padding:20px;text-align:center;">
          <p style="color:#b0b0b0;font-size:13px;margin:0 0 12px;">اللغة الحالية: العربية</p>
          <p style="color:#666;font-size:11px;">— قريباً —</p>
        </div>
      `;
    }

    /* ═══ حول ═══ */
    if (toolId === "settings-about") {
      return `
        <div style="padding:20px;text-align:center;">
          <div style="font-size:40px;margin-bottom:10px;">✨</div>
          <h3 style="color:#fff;font-size:18px;font-weight:800;margin:0 0 6px;">نور كيت</h3>
          <p style="color:#c9a227;font-size:12px;font-weight:700;margin:0 0 16px;">NoorKit Studio</p>
          <p style="color:#888;font-size:11px;margin:0 0 4px;">الإصدار: 1.0.0</p>
          <p style="color:#666;font-size:11px;margin:0;">استوديو تصميم احترافي + القرآن الكريم</p>
        </div>
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  bindContent(toolId) {
    /* ═══ حجم التصميم ═══ */
    if (toolId === "settings-size") {
      document.querySelectorAll("[data-size-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const w = parseInt(btn.dataset.w);
          const h = parseInt(btn.dataset.h);

          const d = NoorState.design;
          d.width = w;
          d.height = h;

          NoorState.pushHistory();

          /* تغيير حجم الـ Canvas */
          NoorRenderer.resize();
          await NoorRenderer.render();

          /* إعادة رسم البطاقات */
          const content = document.getElementById("nk-mini-content");
          if (content) {
            content.innerHTML = this.renderContent(toolId);
            this.bindContent(toolId);
          }

          if (typeof window.showToast === "function") {
            window.showToast(`الحجم: ${w}×${h}`);
          }
        });
      });
    }
  },
};
