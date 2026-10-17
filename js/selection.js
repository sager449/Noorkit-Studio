/* =========================================
   NoorKit — Selection System (v1)
   نظام تحديد العناصر + السحب + التكبير + التدوير
   ========================================= */

window.NoorSelection = {
  active: null,          // العنصر المحدد حالياً
  activeType: null,      // نوع العنصر: 'text' | 'image' | 'element'
  container: null,       // حاوية التحديد
  isDragging: false,
  isResizing: false,
  isRotating: false,
  startX: 0,
  startY: 0,
  startVal: null,

  /* ═══════════════════════════════════════════════
     التهيئة
     ═══════════════════════════════════════════════ */
  init() {
    this.buildOverlay();
    this.bindCanvas();
    this.bindOverlay();
    window.addEventListener("resize", () => this.updateOverlay());
  },

  /* ═══════════════════════════════════════════════
     بناء الطبقة العلوية (Overlay)
     ═══════════════════════════════════════════════ */
  buildOverlay() {
    if (document.getElementById("nk-selection")) return;

    const overlay = document.createElement("div");
    overlay.id = "nk-selection";
    overlay.className = "nk-selection";
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="nk-sel-border">
        <button class="nk-sel-handle nk-sel-delete" id="nk-sel-delete" title="حذف">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <button class="nk-sel-handle nk-sel-rotate" id="nk-sel-rotate" title="تدوير">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
        </button>

        <div class="nk-sel-handle nk-sel-resize" id="nk-sel-resize" title="تكبير">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.container = overlay;
  },

  /* ═══════════════════════════════════════════════
     ربط الـ Canvas — الضغط والسحب
     ═══════════════════════════════════════════════ */
  bindCanvas() {
    const canvas = document.getElementById("main-canvas");
    if (!canvas) return;

    /* ═══ الضغط ═══ */
    canvas.addEventListener("pointerdown", (e) => {
      if (this.isOnHandle(e)) return;

      const point = this.getCanvasPoint(e);
      const hit = this.hitTest(point.x, point.y);

      if (hit) {
        this.select(hit.type, hit.element);
      } else {
        this.deselect();
      }
    });
  },

  /* ═══════════════════════════════════════════════
     اختبار الضغط على العناصر
     ═══════════════════════════════════════════════ */
  hitTest(x, y) {
    const d = NoorState.design;

    /* ═══ العناصر (أشكال، رموز) ═══ */
    if (d.decorations && d.decorations.length > 0) {
      for (let i = d.decorations.length - 1; i >= 0; i--) {
        const el = d.decorations[i];
        const size = el.size || 60;
        const half = size / 2;
        if (x >= el.x - half && x <= el.x + half && y >= el.y - half && y <= el.y + half) {
          return { type: "element", element: el };
        }
      }
    }

    /* ═══ الصور ═══ */
    if (d.images && d.images.length > 0) {
      for (let i = d.images.length - 1; i >= 0; i--) {
        const img = d.images[i];
        if (x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height) {
          return { type: "image", element: img };
        }
      }
    }

    /* ═══ النص ═══ */
    if (d.ayah && d.ayah.text) {
      const padding = Math.round(d.width * 0.1);
      const maxW = d.width - padding * 2;
      const cx = d.ayah.x || d.width / 2;
      const cy = d.ayah.y || d.height / 2;

      const canvas = document.getElementById("main-canvas");
      const ctx = canvas.getContext("2d");
      const font = NoorFonts.get(d.text.fontId);
      ctx.font = `400 ${d.text.size}px ${font.family}`;
      const lines = NoorRenderer.wrapText(ctx, d.ayah.text, maxW);
      const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
      const totalH = lines.length * lineHeight;
      const startY = cy - totalH / 2;

      if (x >= padding && x <= d.width - padding && y >= startY && y <= startY + totalH) {
        return { type: "text", element: d.ayah };
      }
    }

    return null;
  },

  /* ═══════════════════════════════════════════════
     تحديد عنصر
     ═══════════════════════════════════════════════ */
  select(type, element) {
    this.active = element;
    this.activeType = type;
    this.container.hidden = false;
    this.updateOverlay();
  },

  /* ═══════════════════════════════════════════════
     إلغاء التحديد
     ═══════════════════════════════════════════════ */
  deselect() {
    this.active = null;
    this.activeType = null;
    this.container.hidden = true;
  },

  /* ═══════════════════════════════════════════════
     تحديث موقع مربع التحديد
     ═══════════════════════════════════════════════ */
  updateOverlay() {
    if (!this.active || !this.container) return;

    const canvas = document.getElementById("main-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scale = NoorRenderer.previewScale;

    let x, y, w, h;
    const d = NoorState.design;

    if (this.activeType === "text") {
      const padding = Math.round(d.width * 0.1);
      const maxW = d.width - padding * 2;
      const cx = this.active.x || d.width / 2;
      const cy = this.active.y || d.height / 2;

      const ctx = canvas.getContext("2d");
      const font = NoorFonts.get(d.text.fontId);
      ctx.font = `400 ${d.text.size}px ${font.family}`;
      const lines = NoorRenderer.wrapText(ctx, this.active.text, maxW);
      const lineHeight = d.text.size * (d.text.lineHeight || 1.8);
      const totalH = lines.length * lineHeight;

      const maxLineW = Math.max(...lines.map((line) => ctx.measureText(line).width));

      x = cx - maxLineW / 2;
      y = cy - totalH / 2;
      w = maxLineW;
      h = totalH;
    } else if (this.activeType === "image") {
      x = this.active.x;
      y = this.active.y;
      w = this.active.width;
      h = this.active.height;
    } else if (this.activeType === "element") {
      const size = this.active.size || 60;
      x = this.active.x - size / 2;
      y = this.active.y - size / 2;
      w = size;
      h = size;
    }

    const left = rect.left + x * scale;
    const top = rect.top + y * scale;
    const width = w * scale;
    const height = h * scale;

    this.container.style.left = left + "px";
    this.container.style.top = top + "px";
    this.container.style.width = width + "px";
    this.container.style.height = height + "px";
  },
   
  /* ═══════════════════════════════════════════════
     ربط مقابض التحديد (حذف، تدوير، تكبير)
     ═══════════════════════════════════════════════ */
  bindOverlay() {
    /* ═══ حذف ═══ */
    document.getElementById("nk-sel-delete")?.addEventListener("click", async () => {
      if (!this.active) return;

      const d = NoorState.design;

      if (this.activeType === "text") {
        d.ayah.text = "";
      } else if (this.activeType === "image") {
        d.images = (d.images || []).filter((i) => i.id !== this.active.id);
      } else if (this.activeType === "element") {
        d.decorations = (d.decorations || []).filter((e) => e.id !== this.active.id);
      }

      this.deselect();
      NoorState.pushHistory();
      await NoorRenderer.render();
    });

    /* ═══ تدوير ═══ */
    const rotateBtn = document.getElementById("nk-sel-rotate");
    rotateBtn?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (!this.active) return;

      this.isRotating = true;
      const rect = rotateBtn.getBoundingClientRect();
      this.startX = rect.left + rect.width / 2;
      this.startY = rect.top + rect.height / 2;
      this.startVal = this.active.rotation || 0;

      document.addEventListener("pointermove", this.onRotateMove);
      document.addEventListener("pointerup", this.onRotateEnd);
    });

    /* ═══ تكبير ═══ */
    const resizeBtn = document.getElementById("nk-sel-resize");
    resizeBtn?.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (!this.active) return;

      this.isResizing = true;
      this.startX = e.clientX;
      this.startY = e.clientY;

      if (this.activeType === "text") {
        this.startVal = NoorState.design.text.size;
      } else if (this.activeType === "image") {
        this.startVal = { w: this.active.width, h: this.active.height };
      } else if (this.activeType === "element") {
        this.startVal = this.active.size || 60;
      }

      document.addEventListener("pointermove", this.onResizeMove);
      document.addEventListener("pointerup", this.onResizeEnd);
    });
  },

  /* ═══════════════════════════════════════════════
     تدوير — حركة
     ═══════════════════════════════════════════════ */
  onRotateMove: (e) => {
    if (!NoorSelection.isRotating || !NoorSelection.active) return;

    const canvas = document.getElementById("main-canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

    /* نطرح 90 درجة — لأن المقبض أعلى العنصر */
    const rotation = Math.round(angle + 90);

    NoorSelection.active.rotation = rotation;
    NoorRenderer.debouncedRender();
    NoorSelection.updateOverlay();
  },

  onRotateEnd: () => {
    NoorSelection.isRotating = false;
    document.removeEventListener("pointermove", NoorSelection.onRotateMove);
    document.removeEventListener("pointerup", NoorSelection.onRotateEnd);
    NoorState.pushHistory();
  },

  /* ═══════════════════════════════════════════════
     تكبير — حركة
     ═══════════════════════════════════════════════ */
  onResizeMove: (e) => {
    if (!NoorSelection.isResizing || !NoorSelection.active) return;

    const dx = e.clientX - NoorSelection.startX;
    const dy = e.clientY - NoorSelection.startY;
    const delta = (dx + dy) / 2;

    if (NoorSelection.activeType === "text") {
      const newSize = Math.max(10, Math.min(999, NoorSelection.startVal + delta));
      NoorState.design.text.size = Math.round(newSize);
    } else if (NoorSelection.activeType === "image") {
      const ratio = NoorSelection.startVal.w / NoorSelection.startVal.h;
      const newW = Math.max(30, NoorSelection.startVal.w + delta);
      const newH = newW / ratio;
      NoorSelection.active.width = newW;
      NoorSelection.active.height = newH;
      NoorSelection.active.x = NoorState.design.width / 2 - newW / 2;
      NoorSelection.active.y = NoorState.design.height / 2 - newH / 2;
    } else if (NoorSelection.activeType === "element") {
      const newSize = Math.max(20, Math.min(300, NoorSelection.startVal + delta));
      NoorSelection.active.size = newSize;
    }

    NoorRenderer.debouncedRender();
    NoorSelection.updateOverlay();
  },

  onResizeEnd: () => {
    NoorSelection.isResizing = false;
    document.removeEventListener("pointermove", NoorSelection.onResizeMove);
    document.removeEventListener("pointerup", NoorSelection.onResizeEnd);
    NoorState.pushHistory();
  },

  /* ═══════════════════════════════════════════════
     سحب العنصر
     ═══════════════════════════════════════════════ */
  startDrag(e) {
    if (!this.active) return;

    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    if (this.activeType === "text") {
      this.startVal = {
        x: this.active.x || NoorState.design.width / 2,
        y: this.active.y || NoorState.design.height / 2,
      };
    } else if (this.activeType === "image") {
      this.startVal = { x: this.active.x, y: this.active.y };
    } else if (this.activeType === "element") {
      this.startVal = { x: this.active.x, y: this.active.y };
    }

    document.addEventListener("pointermove", this.onDragMove);
    document.addEventListener("pointerup", this.onDragEnd);
  },

  onDragMove: (e) => {
    if (!NoorSelection.isDragging || !NoorSelection.active) return;

    const scale = NoorRenderer.previewScale || 1;
    const dx = (e.clientX - NoorSelection.startX) / scale;
    const dy = (e.clientY - NoorSelection.startY) / scale;

    if (NoorSelection.activeType === "text") {
      NoorSelection.active.x = NoorSelection.startVal.x + dx;
      NoorSelection.active.y = NoorSelection.startVal.y + dy;
    } else if (NoorSelection.activeType === "image") {
      NoorSelection.active.x = NoorSelection.startVal.x + dx;
      NoorSelection.active.y = NoorSelection.startVal.y + dy;
    } else if (NoorSelection.activeType === "element") {
      NoorSelection.active.x = NoorSelection.startVal.x + dx;
      NoorSelection.active.y = NoorSelection.startVal.y + dy;
    }

    NoorRenderer.debouncedRender();
    NoorSelection.updateOverlay();
  },

  onDragEnd: () => {
    NoorSelection.isDragging = false;
    document.removeEventListener("pointermove", NoorSelection.onDragMove);
    document.removeEventListener("pointerup", NoorSelection.onDragEnd);
    NoorState.pushHistory();
  },

  /* ═══════════════════════════════════════════════
     تحويل إحداثيات اللمس إلى إحداثيات Canvas
     ═══════════════════════════════════════════════ */
  getCanvasPoint(e) {
    const canvas = document.getElementById("main-canvas");
    const rect = canvas.getBoundingClientRect();
    const scale = NoorRenderer.previewScale;

    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  },

  /* ═══════════════════════════════════════════════
     التحقق من الضغط على مقبض
     ═══════════════════════════════════════════════ */
  isOnHandle(e) {
    const target = e.target;
    return target && target.classList && target.classList.contains("nk-sel-handle");
  },
};

/* ═══════════════════════════════════════════════
   تشغيل تلقائي
   ═══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof NoorSelection !== "undefined") {
    /* تأخير بسيط حتى يُهيأ الـ Canvas */
    setTimeout(() => NoorSelection.init(), 500);
  }
});
