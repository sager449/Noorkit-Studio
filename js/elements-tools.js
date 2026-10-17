/* =========================================
   NoorKit — Elements Tools (v1)
   أدوات العناصر: أشكال، رموز، ملصقات، أسهم، خطوط
   ========================================= */

window.NoorElementsTools = {
  currentElementId: null,

  /* ═══ أشكال ═══ */
  SHAPES: [
    { id: "circle",   symbol: "●", name: "دائرة" },
    { id: "square",   symbol: "■", name: "مربع" },
    { id: "triangle", symbol: "▲", name: "مثلث" },
    { id: "diamond",  symbol: "◆", name: "معيّن" },
    { id: "star5",    symbol: "★", name: "نجمة" },
    { id: "star6",    symbol: "✶", name: "نجمة 6" },
    { id: "hexagon",  symbol: "⬢", name: "سداسي" },
    { id: "heart",    symbol: "♥", name: "قلب" },
    { id: "rect",     symbol: "▬", name: "مستطيل" },
    { id: "line",     symbol: "━", name: "خط" },
  ],

  /* ═══ رموز إسلامية ═══ */
  ISLAMIC: [
    { id: "bismillah", symbol: "﷽", name: "البسملة" },
    { id: "salawat",   symbol: "ﷺ", name: "الصلاة" },
    { id: "allah",     symbol: "ﷲ", name: "الله" },
    { id: "crescent",  symbol: "☪", name: "هلال" },
    { id: "star8",     symbol: "✵", name: "نجمة 8" },
    { id: "star",      symbol: "✦", name: "نجمة" },
    { id: "flower",    symbol: "❁", name: "زهرة" },
    { id: "bracket",   symbol: "﴾ ﴿", name: "أقواس" },
    { id: "mosque",    symbol: "🕌", name: "مسجد" },
    { id: "quran",     symbol: "📖", name: "قرآن" },
  ],

  /* ═══ ملصقات ═══ */
  STICKERS: [
    { id: "star",      symbol: "⭐", name: "نجمة" },
    { id: "sparkle",   symbol: "✨", name: "بريق" },
    { id: "heart",     symbol: "❤️", name: "قلب" },
    { id: "sun",       symbol: "☀️", name: "شمس" },
    { id: "moon",      symbol: "🌙", name: "قمر" },
    { id: "flower",    symbol: "🌸", name: "زهرة" },
    { id: "leaf",      symbol: "🌿", name: "ورقة" },
    { id: "droplet",   symbol: "💧", name: "قطرة" },
    { id: "crown",     symbol: "👑", name: "تاج" },
    { id: "gem",       symbol: "💎", name: "جوهرة" },
    { id: "sparkles",  symbol: "🌟", name: "نجمة مشعة" },
    { id: "rainbow",   symbol: "🌈", name: "قوس قزح" },
  ],

  /* ═══ أسهم ═══ */
  ARROWS: [
    { id: "right",     symbol: "→", name: "يمين" },
    { id: "left",      symbol: "←", name: "يسار" },
    { id: "up",        symbol: "↑", name: "أعلى" },
    { id: "down",      symbol: "↓", name: "أسفل" },
    { id: "right-bold",symbol: "➡", name: "يمين سميك" },
    { id: "left-bold", symbol: "⬅", name: "يسار سميك" },
    { id: "up-bold",   symbol: "⬆", name: "أعلى سميك" },
    { id: "down-bold", symbol: "⬇", name: "أسفل سميك" },
    { id: "curve",     symbol: "↪", name: "منحني" },
    { id: "round",     symbol: "↻", name: "دائري" },
  ],

  /* ═══ خطوط وفواصل ═══ */
  LINES: [
    { id: "line-thin",    symbol: "─────────", name: "خط رفيع" },
    { id: "line-bold",    symbol: "━━━━━━━━━", name: "خط سميك" },
    { id: "line-dotted",  symbol: "┈┈┈┈┈┈┈┈┈", name: "خط منقط" },
    { id: "line-wavy",    symbol: "〰〰〰〰〰", name: "خط مموج" },
    { id: "divider1",     symbol: "❁ ❁ ❁", name: "زخرفة 1" },
    { id: "divider2",     symbol: "✦ ✦ ✦", name: "زخرفة 2" },
    { id: "divider3",     symbol: "◆ ◆ ◆", name: "زخرفة 3" },
    { id: "divider4",     symbol: "﴿ ۞ ﴾", name: "زخرفة 4" },
    { id: "divider5",     symbol: "❦ ❦ ❦", name: "زخرفة 5" },
    { id: "divider6",     symbol: "✵ ✵ ✵", name: "زخرفة 6" },
  ],

  renderContent(toolId) {
    const d = NoorState.design;

    /* ═══ أشكال ═══ */
    if (toolId === "elements-shapes") {
      const items = this.SHAPES.map(
        (s) =>
          `<button class="nk-elem-chip" data-add-element="${s.id}" data-symbol="${s.symbol}" data-type="shape" title="${s.name}">
            <span class="nk-elem-symbol">${s.symbol}</span>
            <small>${s.name}</small>
          </button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">الأشكال</span></div>
        <div class="nk-elem-scroll">${items}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">الأشكال المضافة (${(d.decorations || []).length})</span>
        </div>
        ${this.renderElementList()}
      `;
    }

    /* ═══ رموز إسلامية ═══ */
    if (toolId === "elements-islamic") {
      const items = this.ISLAMIC.map(
        (s) =>
          `<button class="nk-elem-chip" data-add-element="${s.id}" data-symbol="${s.symbol}" data-type="islamic" title="${s.name}">
            <span class="nk-elem-symbol">${s.symbol}</span>
            <small>${s.name}</small>
          </button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">الرموز الإسلامية</span></div>
        <div class="nk-elem-scroll">${items}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">العناصر المضافة (${(d.decorations || []).length})</span>
        </div>
        ${this.renderElementList()}
      `;
    }

    /* ═══ ملصقات ═══ */
    if (toolId === "elements-stickers") {
      const items = this.STICKERS.map(
        (s) =>
          `<button class="nk-elem-chip" data-add-element="${s.id}" data-symbol="${s.symbol}" data-type="sticker" title="${s.name}">
            <span class="nk-elem-symbol">${s.symbol}</span>
            <small>${s.name}</small>
          </button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">الملصقات</span></div>
        <div class="nk-elem-scroll">${items}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">العناصر المضافة (${(d.decorations || []).length})</span>
        </div>
        ${this.renderElementList()}
      `;
    }

    /* ═══ أسهم ═══ */
    if (toolId === "elements-arrows") {
      const items = this.ARROWS.map(
        (s) =>
          `<button class="nk-elem-chip" data-add-element="${s.id}" data-symbol="${s.symbol}" data-type="arrow" title="${s.name}">
            <span class="nk-elem-symbol">${s.symbol}</span>
            <small>${s.name}</small>
          </button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">الأسهم</span></div>
        <div class="nk-elem-scroll">${items}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">العناصر المضافة (${(d.decorations || []).length})</span>
        </div>
        ${this.renderElementList()}
      `;
    }

    /* ═══ خطوط ═══ */
    if (toolId === "elements-lines") {
      const items = this.LINES.map(
        (s) =>
          `<button class="nk-elem-chip" data-add-element="${s.id}" data-symbol="${s.symbol}" data-type="line" title="${s.name}">
            <span class="nk-elem-symbol">${s.symbol}</span>
            <small>${s.name}</small>
          </button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">الخطوط والفواصل</span></div>
        <div class="nk-elem-scroll">${items}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">العناصر المضافة (${(d.decorations || []).length})</span>
        </div>
        ${this.renderElementList()}
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  renderElementList() {
    const d = NoorState.design;
    const list = d.decorations || [];
    if (list.length === 0) {
      return `<p style="padding:10px;text-align:center;color:#555;font-size:11px;">لا توجد عناصر</p>`;
    }
    return list
      .map(
        (el, i) =>
          `<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;padding:6px;background:#1a1a1a;">
            <span style="font-size:20px;color:${el.color || "#c9a227"};">${el.symbol}</span>
            <span style="flex:1;color:#ccc;font-size:11px;">عنصر ${i + 1}</span>
            <button class="nk-del-elem" data-del-elem="${el.id}" style="background:#ff4d4d;color:#fff;border:none;padding:6px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;">حذف</button>
          </div>`
      )
      .join("");
  },

  bindContent(toolId) {
    const d = NoorState.design;

    /* ═══ إضافة عنصر ═══ */
    document.querySelectorAll("[data-add-element]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const symbol = btn.dataset.symbol;
        const type = btn.dataset.type;
        if (!symbol) return;

        if (!d.decorations) d.decorations = [];

        const el = {
          id: "el_" + Date.now() + Math.random(),
          symbol: symbol,
          type: type,
          x: d.width / 2,
          y: d.height / 2,
          size: 60,
          color: "#c9a227",
          rotation: 0,
        };

        d.decorations.push(el);
        NoorState.pushHistory();
        await NoorRenderer.render();

        const content = document.getElementById("nk-mini-content");
        if (content) {
          content.innerHTML = this.renderContent(toolId);
          this.bindContent(toolId);
        }

        if (typeof window.showToast === "function") {
          window.showToast("تمت إضافة العنصر");
        }
      });
    });

    /* ═══ حذف عنصر ═══ */
    document.querySelectorAll("[data-del-elem]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.delElem;
        d.decorations = (d.decorations || []).filter((e) => e.id !== id);
        NoorState.pushHistory();
        await NoorRenderer.render();

        const content = document.getElementById("nk-mini-content");
        if (content) {
          content.innerHTML = this.renderContent(toolId);
          this.bindContent(toolId);
        }
      });
    });
  },
};
