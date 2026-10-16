/* =========================================
   NoorKit — Core Fonts (v1)
   20 خط عربي
   ========================================= */

window.NoorFonts = {
  list: [
    { id: "Amiri",        name: "أميري",       family: "'Amiri', serif" },
    { id: "Tajawal",      name: "تجوّل",       family: "'Tajawal', sans-serif" },
    { id: "Cairo",        name: "القاهرة",     family: "'Cairo', sans-serif" },
    { id: "ReemKufi",     name: "ريم كوفي",    family: "'Reem Kufi', sans-serif" },
    { id: "Scheherazade", name: "شهرزاد",      family: "'Scheherazade New', serif" },
    { id: "Lateef",       name: "لطيف",        family: "'Lateef', serif" },
    { id: "ArefRuqaa",    name: "عارف رقعة",   family: "'Aref Ruqaa', serif" },
    { id: "NotoNaskh",    name: "نوتو نسخ",    family: "'Noto Naskh Arabic', serif" },
    { id: "NotoKufi",     name: "نوتو كوفي",   family: "'Noto Kufi Arabic', sans-serif" },
    { id: "ElMessiri",    name: "المسيري",     family: "'El Messiri', sans-serif" },
    { id: "Almarai",      name: "المراعي",     family: "'Almarai', sans-serif" },
    { id: "Harmattan",    name: "هرمتان",      family: "'Harmattan', sans-serif" },
    { id: "Mirza",        name: "ميرزا",       family: "'Mirza', serif" },
    { id: "Markazi",      name: "مركزي",       family: "'Markazi Text', serif" },
    { id: "Vazirmatn",    name: "وزيرمتن",     family: "'Vazirmatn', sans-serif" },
    { id: "Changa",       name: "شنغا",        family: "'Changa', sans-serif" },
    { id: "IBMPlex",      name: "IBM بلكس",    family: "'IBM Plex Sans Arabic', sans-serif" },
    { id: "NotoSans",     name: "نوتو سانس",   family: "'Noto Sans Arabic', sans-serif" },
    { id: "Readex",       name: "ريدكس",       family: "'Readex Pro', sans-serif" },
    { id: "Qahiri",       name: "قاهري",       family: "'Qahiri', sans-serif" },
  ],

  get(id) {
    return this.list.find((f) => f.id === id) || this.list[0];
  },

  async loadAll() {
    if (!document.fonts) return;

    const loads = this.list.map((font) => {
      try {
        return document.fonts.load(`400 64px ${font.family}`);
      } catch (e) {
        return Promise.resolve();
      }
    });

    try {
      await Promise.all(loads);
    } catch (e) {
      console.warn("NoorFonts: some fonts failed to load");
    }
  },

  renderOptions(selectedId) {
    return this.list
      .map((font) => {
        const isActive = font.id === selectedId ? "active" : "";
        return `
          <button class="font-option ${isActive}" data-font="${font.id}" title="${font.name}">
            <span class="font-name">${font.name}</span>
          </button>
        `;
      })
      .join("");
  },
};
