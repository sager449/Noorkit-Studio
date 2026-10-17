/* =========================================
   NoorKit — Editor Main (v1)
   المُحرك الرئيسي للمحرر
   ========================================= */

(function () {
  "use strict";

  let autoSaveTimer = null;
  const AUTO_SAVE = true;
  const AUTO_SAVE_DELAY = 3000;

  /* ═══════════════════════════════════════════════
     التهيئة
     ═══════════════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      /* تحميل الخطوط */
      if (typeof NoorFonts !== "undefined") {
        NoorFonts.loadAll();
      }

      /* إعادة تعيين الحالة */
      NoorState.reset(1080, 1080);

      /* تهيئة الـ Canvas */
      const canvas = document.getElementById("main-canvas");
      if (!canvas) {
        console.error("Editor: canvas not found");
        return;
      }

      NoorRenderer.init(canvas);

      /* تحميل التصميم من الرابط */
      await loadDesignFromUrl();

      /* الرسم الأول */
      await NoorRenderer.render();

      /* ربط الأحداث */
      setupHeader();
      setupTitle();
      setupKeyboard();

      /* حفظ الحالة الأولى */
      NoorState.pushHistory();

      /* رسالة ترحيب */
      showToast("مرحباً بك في نور كيت");
    } catch (err) {
      console.error("Editor init failed:", err);
    }
  }
   async function loadDesignFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    if (typeof NoorDB === "undefined") return;
    const project = await NoorDB.get(id);
    if (project && project.design) {
      NoorState.load(project.design);
      NoorState.design.id = parseInt(id); // ربط الـ ID بالتصميم الحالي
      
      const titleInput = document.getElementById("design-title");
      if (titleInput) {
        titleInput.value = project.design.title || "تصميم بدون عنوان";
      }
      showToast("تم تحميل التصميم");
    }
  } catch (err) {
    console.error("loadDesign failed:", err);
  }
   }

  /* ═══════════════════════════════════════════════
     ربط الهيدر
     ═══════════════════════════════════════════════ */
  function setupHeader() {
    /* تراجع */
    document.getElementById("undo-btn")?.addEventListener("click", async () => {
      if (NoorState.undo()) {
        await NoorRenderer.render();
        showToast("تم التراجع");
      }
    });

    /* إعادة */
    document.getElementById("redo-btn")?.addEventListener("click", async () => {
      if (NoorState.redo()) {
        await NoorRenderer.render();
        showToast("تم الإعادة");
      }
    });

    /* حفظ */
    document.getElementById("save-btn")?.addEventListener("click", () => {
      saveDesignNow(true);
    });

    /* تصدير */
    document.getElementById("export-btn")?.addEventListener("click", exportDesign);
  }

  /* ═══════════════════════════════════════════════
     ربط حقل العنوان
     ═══════════════════════════════════════════════ */
  function setupTitle() {
    const titleInput = document.getElementById("design-title");
    if (!titleInput) return;

    titleInput.addEventListener("input", () => {
      if (NoorState.design) {
        NoorState.design.title = titleInput.value.trim() || "تصميم بدون عنوان";
      }
      if (AUTO_SAVE) scheduleAutoSave();
    });

    titleInput.addEventListener("blur", () => {
      saveDesignNow(false);
    });
  }

  /* ═══════════════════════════════════════════════
     اختصارات لوحة المفاتيح
     ═══════════════════════════════════════════════ */
  function setupKeyboard() {
    document.addEventListener("keydown", (e) => {
      /* Ctrl+Z — تراجع */
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        document.getElementById("undo-btn")?.click();
      }

      /* Ctrl+Y / Ctrl+Shift+Z — إعادة */
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.shiftKey && e.key === "Z"))
      ) {
        e.preventDefault();
        document.getElementById("redo-btn")?.click();
      }

      /* Ctrl+S — حفظ */
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        document.getElementById("save-btn")?.click();
      }

      /* Ctrl+E — تصدير */
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        document.getElementById("export-btn")?.click();
      }

      /* Escape — إغلاق */
      if (e.key === "Escape") {
        if (typeof NoorToolbar !== "undefined") {
          NoorToolbar.closeMiniSheet();
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════
     الحفظ التلقائي
     ═══════════════════════════════════════════════ */
  function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveDesignNow(false), AUTO_SAVE_DELAY);
  }

  /* ═══════════════════════════════════════════════
     حفظ التصميم
     ═══════════════════════════════════════════════ */
  async function saveDesignNow(showMessage) {
    try {
      if (!NoorState.design) return;

      const titleInput = document.getElementById("design-title");
      if (titleInput) {
        NoorState.design.title = titleInput.value.trim() || "تصميم بدون عنوان";
      }

      if (typeof NoorDB !== "undefined" && NoorDB.save) {
        await NoorDB.save(NoorState.design);
      }

      if (showMessage) showToast("تم الحفظ");
    } catch (err) {
      console.error("Save failed:", err);
      if (showMessage) showToast("تعذر الحفظ");
    }
  }

  /* ═══════════════════════════════════════════════
     تصدير التصميم
     ═══════════════════════════════════════════════ */
  async function exportDesign() {
    try {
      showToast("جاري التصدير...");
      await NoorRenderer.export();
      showToast("تم التصدير");
    } catch (err) {
      console.error("Export failed:", err);
      showToast("تعذر التصدير");
    }
  }

  /* ═══════════════════════════════════════════════
     Toast
     ═══════════════════════════════════════════════ */
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  /* إتاحة للاستخدام الخارجي */
  window.showToast = showToast;
})();
