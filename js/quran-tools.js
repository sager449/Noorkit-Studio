/* =========================================
   NoorKit — Quran Tools (v1)
   محتوى الأدوات القرآنية
   ========================================= */

window.NoorQuranTools = {
  BASMALA: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  ISTIADHA: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",

  /* ═══════════════════════════════════════════════
     عرض المحتوى حسب الأداة
     ═══════════════════════════════════════════════ */
  renderContent(toolId) {
    const d = NoorState.design;

    /* ═══ السورة ═══ */
    if (toolId === "quran-surah") {
      const surahOptions = NoorQuranAPI.surahs
        .map(
          (s) =>
            `<option value="${s.number}" ${
              d.ayah.surah === s.number ? "selected" : ""
            }>${s.number}. ${s.name} (${s.verses})</option>`
        )
        .join("");

      return `
        <div class="nk-row"><span class="nk-row-label">السورة</span></div>
        <select id="quran-surah-select" style="width:100%;padding:10px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:600;margin-bottom:10px;">
          <option value="">-- اختر السورة --</option>
          ${surahOptions}
        </select>

        <div class="nk-row"><span class="nk-row-label">الآية</span></div>
        <select id="quran-ayah-select" style="width:100%;padding:10px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:600;" ${!d.ayah.surah ? "disabled" : ""}>
          <option value="">-- اختر السورة أولاً --</option>
        </select>

        <button id="quran-load-btn" style="width:100%;padding:12px;background:#ffffff;color:#111;border:none;font-family:inherit;font-size:14px;font-weight:700;margin-top:12px;cursor:pointer;">
          إضافة الآية
        </button>
      `;
    }

    /* ═══ البسملة ═══ */
    if (toolId === "quran-basmala") {
      return `
        <div style="padding:16px;text-align:center;">
          <p style="color:#b0b0b0;font-size:12px;margin:0 0 12px;line-height:1.6;">${this.BASMALA}</p>
          <button id="quran-add-basmala" style="background:#ffffff;color:#111;border:none;padding:12px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">
            إضافة البسملة
          </button>
        </div>
      `;
    }

    /* ═══ الاستعاذة ═══ */
    if (toolId === "quran-istiadha") {
      return `
        <div style="padding:16px;text-align:center;">
          <p style="color:#b0b0b0;font-size:12px;margin:0 0 12px;line-height:1.6;">${this.ISTIADHA}</p>
          <button id="quran-add-istiadha" style="background:#ffffff;color:#111;border:none;padding:12px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">
            إضافة الاستعاذة
          </button>
        </div>
      `;
    }

    /* ═══ عنوان الآية ═══ */
    if (toolId === "quran-title") {
      return `
        <div class="nk-row"><span class="nk-row-label">عنوان الآية</span></div>
        <input type="text" id="quran-title-input" placeholder="مثال: سورة الفاتحة" style="width:100%;padding:10px 12px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:600;margin-bottom:12px;" />

        <div class="nk-row"><span class="nk-row-label">الخط</span></div>
        <select id="quran-title-font" style="width:100%;padding:10px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:600;margin-bottom:12px;">
          ${NoorFonts.list
            .map(
              (f) =>
                `<option value="${f.id}">${f.name}</option>`
            )
            .join("")}
        </select>

        <button id="quran-add-title" style="width:100%;padding:12px;background:#ffffff;color:#111;border:none;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;">
          إضافة العنوان
        </button>
      `;
    }

    /* ═══ رقم الآية ═══ */
    if (toolId === "quran-number") {
      const isOn = d.ayah.decorNumber || false;
      return `
        <div class="nk-row"><span class="nk-row-label">إظهار رقم الآية</span></div>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button id="quran-num-on" style="flex:1;padding:12px;background:${isOn ? "#ffffff" : "#2a2a2a"};color:${isOn ? "#111" : "#ccc"};border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;">تشغيل</button>
          <button id="quran-num-off" style="flex:1;padding:12px;background:${!isOn ? "#ffffff" : "#2a2a2a"};color:${!isOn ? "#111" : "#ccc"};border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;">إيقاف</button>
        </div>
      `;
    }

    /* ═══ الترجمة ═══ */
    if (toolId === "quran-trans") {
      const tr = d.translation;
      const langs = [
        { id: "ar", name: "العربية" },
        { id: "en", name: "English" },
        { id: "fr", name: "Français" },
        { id: "es", name: "Español" },
        { id: "ur", name: "اردو" },
        { id: "id", name: "Indonesia" },
        { id: "tr", name: "Türkçe" },
        { id: "ru", name: "Русский" },
      ];

      const langOptions = langs
        .map(
          (l) =>
            `<option value="${l.id}" ${tr.lang === l.id ? "selected" : ""}>${l.name}</option>`
        )
        .join("");

      return `
        <div class="nk-row"><span class="nk-row-label">اللغة</span></div>
        <select id="quran-trans-lang" style="width:100%;padding:10px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:13px;font-weight:600;margin-bottom:10px;">
          ${langOptions}
        </select>

        <div class="nk-row"><span class="nk-row-label">حجم الترجمة</span><span class="nk-row-value" id="quran-trans-size-val">${tr.size}</span></div>
        <input type="range" class="ts-slider" id="quran-trans-size" min="16" max="60" value="${tr.size}" style="width:100%;margin-bottom:10px;" />

        <button id="quran-trans-load" style="width:100%;padding:12px;background:#ffffff;color:#111;border:none;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;">
          تحميل الترجمة
        </button>
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  /* ═══════════════════════════════════════════════
     ربط الأحداث
     ═══════════════════════════════════════════════ */
  bindContent(toolId) {
    const d = NoorState.design;

    /* ═══ السورة ═══ */
    if (toolId === "quran-surah") {
      const surahSel = document.getElementById("quran-surah-select");
      const ayahSel = document.getElementById("quran-ayah-select");

      surahSel?.addEventListener("change", () => {
        const surahNum = parseInt(surahSel.value);
        if (!surahNum) {
          ayahSel.innerHTML = '<option value="">-- اختر السورة أولاً --</option>';
          ayahSel.disabled = true;
          return;
        }

        const info = NoorQuranAPI.getSurahInfo(surahNum);
        if (!info) return;

        let opts = '<option value="">-- اختر الآية --</option>';
        for (let i = 1; i <= info.verses; i++) {
          opts += `<option value="${i}">${i}</option>`;
        }
        ayahSel.innerHTML = opts;
        ayahSel.disabled = false;
      });

      document.getElementById("quran-load-btn")?.addEventListener("click", async () => {
        const surah = parseInt(surahSel.value);
        const ayah = parseInt(ayahSel.value);
        if (!surah || !ayah) {
          if (typeof window.showToast === "function") {
            window.showToast("اختر السورة والآية");
          }
          return;
        }

        const text = await NoorQuranAPI.getAyah(surah, ayah);
        if (!text) {
          if (typeof window.showToast === "function") {
            window.showToast("تعذر تحميل الآية");
          }
          return;
        }

        d.ayah.text = text;
        d.ayah.surah = surah;
        d.ayah.ayahNumber = ayah;
        d.ayah.surahName = NoorQuranAPI.getSurahInfo(surah)?.name || "";
        d.ayah.decorNumber = true;
        d.ayah.ayahNumberArabic = this.toArabicNum(ayah);

        NoorState.pushHistory();
        await NoorRenderer.render();

        if (typeof window.showToast === "function") {
          window.showToast("تمت إضافة الآية");
        }
      });
    }

    /* ═══ البسملة ═══ */
    if (toolId === "quran-basmala") {
      document.getElementById("quran-add-basmala")?.addEventListener("click", async () => {
        const current = d.ayah.text || "";
        if (current.includes(this.BASMALA)) {
          if (typeof window.showToast === "function") {
            window.showToast("البسملة موجودة مسبقاً");
          }
          return;
        }
        d.ayah.text = current ? this.BASMALA + "\n\n" + current : this.BASMALA;
        NoorState.pushHistory();
        await NoorRenderer.render();
        if (typeof window.showToast === "function") {
          window.showToast("تمت إضافة البسملة");
        }
      });
    }

    /* ═══ الاستعاذة ═══ */
    if (toolId === "quran-istiadha") {
      document.getElementById("quran-add-istiadha")?.addEventListener("click", async () => {
        const current = d.ayah.text || "";
        if (current.includes(this.ISTIADHA)) {
          if (typeof window.showToast === "function") {
            window.showToast("الاستعاذة موجودة مسبقاً");
          }
          return;
        }
        d.ayah.text = current ? this.ISTIADHA + "\n\n" + current : this.ISTIADHA;
        NoorState.pushHistory();
        await NoorRenderer.render();
        if (typeof window.showToast === "function") {
          window.showToast("تمت إضافة الاستعاذة");
        }
      });
    }

    /* ═══ رقم الآية ═══ */
    if (toolId === "quran-number") {
      document.getElementById("quran-num-on")?.addEventListener("click", async () => {
        d.ayah.decorNumber = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });

      document.getElementById("quran-num-off")?.addEventListener("click", async () => {
        d.ayah.decorNumber = false;
        NoorState.pushHistory();
        await NoorRenderer.render();
      });
    }

    /* ═══ الترجمة ═══ */
    if (toolId === "quran-trans") {
      const langSel = document.getElementById("quran-trans-lang");
      const sizeSlider = document.getElementById("quran-trans-size");
      const sizeVal = document.getElementById("quran-trans-size-val");

      sizeSlider?.addEventListener("input", () => {
        d.translation.size = parseInt(sizeSlider.value);
        if (sizeVal) sizeVal.textContent = d.translation.size;
        NoorRenderer.debouncedRender();
      });

      document.getElementById("quran-trans-load")?.addEventListener("click", async () => {
        const surah = d.ayah.surah;
        const ayah = d.ayah.ayahNumber;
        if (!surah || !ayah) {
          if (typeof window.showToast === "function") {
            window.showToast("اختر الآية أولاً");
          }
          return;
        }

        d.translation.lang = langSel.value;
        const text = await NoorQuranAPI.getTranslation(surah, ayah, d.translation.lang);
        if (!text) {
          if (typeof window.showToast === "function") {
            window.showToast("تعذر تحميل الترجمة");
          }
          return;
        }

        d.translation.text = text;
        d.translation.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
        if (typeof window.showToast === "function") {
          window.showToast("تم تحميل الترجمة");
        }
      });
    }
  },

  /* ═══════════════════════════════════════════════
     تحويل الأرقام إلى عربية
     ═══════════════════════════════════════════════ */
  toArabicNum(num) {
    const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return String(num)
      .split("")
      .map((d) => digits[parseInt(d)] || d)
      .join("");
  },
};
