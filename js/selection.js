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
