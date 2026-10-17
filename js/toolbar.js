/* =========================================
   NoorKit — Toolbar System (v8 Final)
   يدعم: كل التبويبات الثمانية
   ========================================= */

window.NoorToolbar = {
  activePrimary: null,
  activeSecondary: null,
  lifted: false,
  containerEl: null,
  miniSheetEl: null,

  PRIMARY_TOOLS: [
    { id: "quran", label: "قرآن", svg: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>` },
    { id: "text", label: "نص", svg: `<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>` },
    { id: "image", label: "صور", svg: `<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>` },
    { id: "elements", label: "عناصر", svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>` },
    { id: "paper", label: "خلفية", svg: `<path d="M4 4h16v16H4z"></path><path d="M4 9h16"></path><path d="M9 4v16"></path>` },
    { id: "effects", label: "تأثير", svg: `<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line>` },
    { id: "templates", label: "قوالب", svg: `<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>` },
    { id: "settings", label: "إعدادات", svg: `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>` },
  ],

  SECONDARY_TOOLS: {
    quran: [
      { id: "quran-surah", label: "السورة", svg: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>` },
      { id: "quran-basmala", label: "بسملة", svg: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>` },
      { id: "quran-istiadha", label: "استعاذة", svg: `<path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>` },
      { id: "quran-title", label: "عنوان", svg: `<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>` },
      { id: "quran-number", label: "رقم", svg: `<circle cx="12" cy="12" r="9"></circle><text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">١</text>` },
      { id: "quran-trans", label: "ترجمة", svg: `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>` },
    ],

    text: [
      { id: "font", label: "خط", svg: `<polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line>` },
      { id: "size", label: "حجم", svg: `<path d="M21 3H3v18h18V3z"></path><path d="M9 9h6v6H9z"></path>` },
      { id: "color", label: "لون", svg: `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>` },
      { id: "align", label: "محاذاة", svg: `<line x1="3" y1="6" x2="21" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>` },
      { id: "line-height", label: "تباعد", svg: `<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>` },
      { id: "move", label: "حركة", svg: `<polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line>` },
      { id: "edit-text", label: "تحرير", svg: `<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>` },
    ],

    image: [
      { id: "image-upload", label: "رفع", svg: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>` },
      { id: "image-rotate", label: "تدوير", svg: `<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>` },
      { id: "image-opacity", label: "شفافية", svg: `<circle cx="12" cy="12" r="9" opacity="0.5"></circle><circle cx="12" cy="12" r="5"></circle>` },
      { id: "image-delete", label: "حذف", svg: `<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>` },
    ],

    elements: [
      { id: "elements-shapes", label: "أشكال", svg: `<circle cx="8" cy="8" r="5"></circle><rect x="13" y="3" width="8" height="8"></rect><polygon points="7 14 12 22 2 22"></polygon>` },
      { id: "elements-islamic", label: "رموز", svg: `<path d="M12 2L15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>` },
      { id: "elements-stickers", label: "ملصقات", svg: `<path d="M20 12v8H4v-8"></path><path d="M2 7h20v5H2z"></path><path d="M12 22V7"></path><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>` },
      { id: "elements-arrows", label: "أسهم", svg: `<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>` },
      { id: "elements-lines", label: "خطوط", svg: `<line x1="3" y1="12" x2="21" y2="12"></line>` },
    ],

    paper: [
      { id: "paper-color", label: "لون", svg: `<circle cx="12" cy="12" r="9"></circle>` },
      { id: "paper-gradient", label: "تدرج", svg: `<rect x="3" y="3" width="18" height="18"></rect><path d="M3 3l18 18"></path>` },
      { id: "paper-from-device", label: "من الهاتف", svg: `<rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>` },
      { id: "paper-from-web", label: "من الإنترنت", svg: `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>` },
      { id: "paper-pattern", label: "نقش", svg: `<rect x="3" y="3" width="18" height="18"></rect><path d="M3 9h18M3 15h18M9 3v18M15 3v18"></path>` },
      { id: "paper-lighting", label: "إضاءة", svg: `<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line>` },
      { id: "paper-fog", label: "ضباب", svg: `<path d="M3 12h18M5 16h14M7 8h10"></path>` },
    ],

    effects: [
      { id: "shadow", label: "ظل", svg: `<circle cx="12" cy="12" r="9"></circle><path d="M12 3v18"></path>` },
      { id: "outline", label: "حدود", svg: `<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle>` },
      { id: "gradient", label: "تدرج", svg: `<circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 0 0 18"></path>` },
      { id: "glow", label: "توهج", svg: `<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line>` },
      { id: "opacity", label: "شفافية", svg: `<circle cx="12" cy="12" r="9" opacity="0.4"></circle><circle cx="12" cy="12" r="5"></circle>` },
      { id: "highlight", label: "خلفية", svg: `<rect x="3" y="6" width="18" height="12" rx="2"></rect>` },
    ],

    templates: [
      { id: "templates-ayat", label: "آيات", svg: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>` },
      { id: "templates-text", label: "نصوص", svg: `<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="15" y2="18"></line>` },
      { id: "templates-social", label: "سوشيال", svg: `<rect x="3" y="3" width="18" height="18"></rect><circle cx="12" cy="12" r="4"></circle>` },
    ],

    settings: [
      { id: "settings-size", label: "حجم", svg: `<rect x="3" y="3" width="18" height="18"></rect><rect x="7" y="7" width="10" height="10"></rect>` },
      { id: "settings-language", label: "اللغة", svg: `<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>` },
      { id: "settings-about", label: "حول", svg: `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>` },
    ],
  },

  init() {
    this.build();
    this.bindLift();
    window.addEventListener("resize", () => {
      if (this.miniSheetEl?.classList.contains("open")) {
        this.positionMiniSheet();
      }
    });
  },

  build() {
    if (document.getElementById("nk-toolbars")) return;

    const container = document.createElement("div");
    container.id = "nk-toolbars";
    container.className = "nk-toolbars";
    container.innerHTML = `
      <div class="nk-toolbar-secondary" id="nk-toolbar-secondary"></div>
      <div class="nk-toolbar-primary" id="nk-toolbar-primary"></div>
      <div class="nk-lift-bar" id="nk-lift-bar">
        <div class="nk-lift-handle"></div>
      </div>
    `;

    document.body.appendChild(container);
    this.containerEl = container;
    this.renderPrimary();
  },

  renderPrimary() {
    const bar = document.getElementById("nk-toolbar-primary");
    if (!bar) return;

    bar.innerHTML = this.PRIMARY_TOOLS.map(
      (tool) => `
      <button class="nk-tool-btn" data-nk-primary="${tool.id}">
        <svg viewBox="0 0 24 24">${tool.svg}</svg>
        <span class="nk-tool-label">${tool.label}</span>
      </button>
    `
    ).join("");

    bar.querySelectorAll("[data-nk-primary]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectPrimary(btn.dataset.nkPrimary);
      });
    });
  },

  selectPrimary(id) {
    const bar = document.getElementById("nk-toolbar-primary");
    if (!bar) return;

    if (this.activePrimary === id) {
      this.activePrimary = null;
      this.activeSecondary = null;
      bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      this.hideSecondary();
      this.closeMiniSheet();
      return;
    }

    this.activePrimary = id;
    this.activeSecondary = null;

    bar.querySelectorAll(".nk-tool-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.nkPrimary === id);
    });

    const secondary = this.SECONDARY_TOOLS[id];
    if (secondary && secondary.length > 0) {
      this.renderSecondary(id);
      this.showSecondary();
    } else {
      this.hideSecondary();
    }

    this.closeMiniSheet();
  },

  renderSecondary(primaryId) {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (!bar) return;

    const tools = this.SECONDARY_TOOLS[primaryId] || [];

    bar.innerHTML = tools
      .map(
        (tool) => `
      <button class="nk-tool-btn" data-nk-secondary="${tool.id}">
        <svg viewBox="0 0 24 24">${tool.svg}</svg>
        <span class="nk-tool-label">${tool.label}</span>
      </button>
    `
      )
      .join("");

    bar.querySelectorAll("[data-nk-secondary]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.selectSecondary(btn.dataset.nkSecondary);
      });
    });
  },

  showSecondary() {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (bar) bar.classList.add("active");
  },

  hideSecondary() {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (bar) {
      bar.classList.remove("active");
      bar.innerHTML = "";
    }
  },

  selectSecondary(id) {
    const bar = document.getElementById("nk-toolbar-secondary");
    if (!bar) return;

    if (this.activeSecondary === id) {
      this.activeSecondary = null;
      bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      this.closeMiniSheet();
      return;
    }

    this.activeSecondary = id;

    bar.querySelectorAll(".nk-tool-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.nkSecondary === id);
    });

    this.openMiniSheet(id);
  },

  buildMiniSheet() {
    if (document.getElementById("nk-mini-sheet")) return;

    const sheet = document.createElement("div");
    sheet.id = "nk-mini-sheet";
    sheet.className = "nk-mini-sheet";
    sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = `
      <div class="nk-mini-header">
        <button class="nk-mini-close" id="nk-mini-close">✕</button>
        <span class="nk-mini-title" id="nk-mini-title">خيارات</span>
        <span class="nk-mini-spacer"></span>
      </div>
      <div class="nk-mini-content" id="nk-mini-content"></div>
    `;

    document.body.appendChild(sheet);
    this.miniSheetEl = sheet;

    document.getElementById("nk-mini-close").addEventListener("click", () => {
      this.activeSecondary = null;
      const bar = document.getElementById("nk-toolbar-secondary");
      if (bar) {
        bar.querySelectorAll(".nk-tool-btn").forEach((b) => b.classList.remove("active"));
      }
      this.closeMiniSheet();
    });
  },

  openMiniSheet(toolId) {
    if (!this.miniSheetEl) this.buildMiniSheet();
    if (!this.miniSheetEl) return;

    const content = document.getElementById("nk-mini-content");
    const title = document.getElementById("nk-mini-title");
    if (!content) return;

    const allTools = Object.values(this.SECONDARY_TOOLS).flat();
    const toolDef = allTools.find((t) => t.id === toolId);
    if (title && toolDef) title.textContent = toolDef.label;

    let html = "";

    if (toolId.startsWith("quran-") && typeof NoorQuranTools !== "undefined") {
      html = NoorQuranTools.renderContent(toolId);
    }

    if (
      !html &&
      typeof NoorTextTools !== "undefined" &&
      ["font", "size", "color", "align", "line-height", "move", "edit-text"].includes(toolId)
    ) {
      html = NoorTextTools.renderContent(toolId);
    }

    if (
      !html &&
      typeof NoorImageTools !== "undefined" &&
      ["image-upload", "image-rotate", "image-opacity", "image-delete"].includes(toolId)
    ) {
      html = NoorImageTools.renderContent(toolId);
    }

    if (!html && typeof NoorPaperTools !== "undefined" && toolId.startsWith("paper-")) {
      html = NoorPaperTools.renderContent(toolId);
    }

    if (
      !html &&
      typeof NoorEffectsTools !== "undefined" &&
      ["shadow", "outline", "gradient", "glow", "opacity", "highlight"].includes(toolId)
    ) {
      html = NoorEffectsTools.renderContent(toolId);
    }

    if (!html && typeof NoorElementsTools !== "undefined" && toolId.startsWith("elements-")) {
      html = NoorElementsTools.renderContent(toolId);
    }

    if (!html && typeof NoorTemplatesTools !== "undefined" && toolId.startsWith("templates-")) {
      html = NoorTemplatesTools.renderContent(toolId);
    }

    if (!html && typeof NoorSettingsTools !== "undefined" && toolId.startsWith("settings-")) {
      html = NoorSettingsTools.renderContent(toolId);
    }

    if (!html) {
      html = `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
    }

    content.innerHTML = html;

    if (toolId.startsWith("quran-") && typeof NoorQuranTools !== "undefined") {
      NoorQuranTools.bindContent(toolId);
    }

    if (
      typeof NoorTextTools !== "undefined" &&
      ["font", "size", "color", "align", "line-height", "move", "edit-text"].includes(toolId)
    ) {
      NoorTextTools.bindContent(toolId);
    }

    if (
      typeof NoorImageTools !== "undefined" &&
      ["image-upload", "image-rotate", "image-opacity", "image-delete"].includes(toolId)
    ) {
      NoorImageTools.bindContent(toolId);
    }

    if (typeof NoorPaperTools !== "undefined" && toolId.startsWith("paper-")) {
      NoorPaperTools.bindContent(toolId);
    }

    if (
      typeof NoorEffectsTools !== "undefined" &&
      ["shadow", "outline", "gradient", "glow", "opacity", "highlight"].includes(toolId)
    ) {
      NoorEffectsTools.bindContent(toolId);
    }

    if (typeof NoorElementsTools !== "undefined" && toolId.startsWith("elements-")) {
      NoorElementsTools.bindContent(toolId);
    }

    if (typeof NoorTemplatesTools !== "undefined" && toolId.startsWith("templates-")) {
      NoorTemplatesTools.bindContent(toolId);
    }

    if (typeof NoorSettingsTools !== "undefined" && toolId.startsWith("settings-")) {
      NoorSettingsTools.bindContent(toolId);
    }

    this.positionMiniSheet();

    const editorMain = document.querySelector(".editor-main");
    if (editorMain) editorMain.classList.add("mini-open");

    this.miniSheetEl.classList.add("open");
    this.miniSheetEl.setAttribute("aria-hidden", "false");
  },

  positionMiniSheet() {
    if (!this.miniSheetEl || !this.containerEl) return;
    const rect = this.containerEl.getBoundingClientRect();
    const barsHeight = window.innerHeight - rect.top;
    this.miniSheetEl.style.bottom = barsHeight + "px";
  },

  closeMiniSheet() {
    if (!this.miniSheetEl) return;
    this.miniSheetEl.classList.remove("open");
    this.miniSheetEl.setAttribute("aria-hidden", "true");

    const editorMain = document.querySelector(".editor-main");
    if (editorMain) editorMain.classList.remove("mini-open");
  },

  bindLift() {
    document.getElementById("nk-lift-bar")?.addEventListener("click", () => {
      this.lifted = !this.lifted;
      this.containerEl?.classList.toggle("lifted", this.lifted);
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorToolbar !== "undefined") {
    NoorToolbar.init();
  }
});
