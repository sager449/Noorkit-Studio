/* =========================================
   NoorKit — Core State (v1)
   إدارة حالة التصميم + History
   ========================================= */

window.NoorState = {
  design: null,
  history: [],
  historyIndex: -1,
  maxHistory: 50,

  /* ═══════════════════════════════════════════════
     إعادة تعيين التصميم
     ═══════════════════════════════════════════════ */
  reset(width, height) {
    this.design = {
      /* الأبعاد */
      width: width || 1080,
      height: height || 1080,
      title: "تصميم بدون عنوان",

      /* الورقة */
      background: {
        type: "solid",
        value: "#f5ede0",
        imageUrl: null,
        pattern: "none",
        lighting: { enabled: false, angle: 135, intensity: 30 },
        fog: { enabled: false, intensity: 20 },
        hdr: { enabled: false, contrast: 20, saturation: 20 },
        vignette: { enabled: false, intensity: 40, softness: 60 },
        imageSettings: { opacity: 100, brightness: 100, blur: 0 },
      },

      /* النص */
      text: {
        fontId: "Amiri",
        size: 64,
        color: "#1a1a1a",
        align: "center",
        lineHeight: 1.8,
        opacity: 100,

        /* التأثيرات */
        shadow: { enabled: false, color: "#000000", blur: 8, x: 0, y: 4, opacity: 100 },
        outline: { enabled: false, color: "#ffffff", width: 2 },
        gradient: { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 },
        glow: { enabled: false, color: "#c9a227", intensity: 15 },
        highlight: { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 },
      },

      /* الآية */
      ayah: {
        text: "",
        surah: null,
        surahName: "",
        ayahNumber: null,
        decorNumber: false,
        x: null,
        y: null,
        rotation: 0,
      },

      /* الترجمة */
      translation: {
        enabled: false,
        text: "",
        lang: "en",
        fontId: "Cairo",
        size: 32,
        color: "#4a4a4a",
      },

      /* الإطار */
      frame: {
        type: "none",
        color: "#c9a227",
        thickness: 4,
      },

      /* العناصر */
      images: [],
      stickers: [],
      decorations: [],

      /* الزخرفة العلوية/السفلية */
      decor: {
        top: false,
        bottom: false,
      },
    };

    /* حفظ التاريخ الأولي */
    this.history = [];
    this.historyIndex = -1;
    this.pushHistory();
  },

  /* ═══════════════════════════════════════════════
     History — التراجع والإعادة
     ═══════════════════════════════════════════════ */
  pushHistory() {
    if (!this.design) return;

    const snapshot = JSON.stringify(this.design);

    /* إذا كان الحالي هو نفسه السابق — لا تكرر */
    if (this.history[this.historyIndex] === snapshot) return;

    /* احذف أي شيء بعد current (إذا كنا في المنتصف) */
    this.history = this.history.slice(0, this.historyIndex + 1);

    /* أضف الحالي */
    this.history.push(snapshot);

    /* احتفظ بالحد الأقصى */
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.historyIndex = this.history.length - 1;
    this.updateHistoryButtons();
  },

  undo() {
    if (this.historyIndex <= 0) return false;

    this.historyIndex--;
    const snapshot = this.history[this.historyIndex];

    try {
      this.design = JSON.parse(snapshot);
      this.updateHistoryButtons();
      return true;
    } catch (e) {
      console.error("undo failed:", e);
      return false;
    }
  },

  redo() {
    if (this.historyIndex >= this.history.length - 1) return false;

    this.historyIndex++;
    const snapshot = this.history[this.historyIndex];

    try {
      this.design = JSON.parse(snapshot);
      this.updateHistoryButtons();
      return true;
    } catch (e) {
      console.error("redo failed:", e);
      return false;
    }
  },

  updateHistoryButtons() {
    const undoBtn = document.getElementById("undo-btn");
    const redoBtn = document.getElementById("redo-btn");

    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  },

  /* ═══════════════════════════════════════════════
     حفظ / تحميل
     ═══════════════════════════════════════════════ */
  export() {
    return JSON.parse(JSON.stringify(this.design));
  },

  load(design) {
    if (!design) return;
    this.design = JSON.parse(JSON.stringify(design));
    this.pushHistory();
  },
};
