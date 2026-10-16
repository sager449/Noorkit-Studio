/* =========================================
   NoorKit — Core Renderer (v1)
   رسم التصميم على Canvas
   ========================================= */

window.NoorRenderer = {
  canvas: null,
  ctx: null,
  previewScale: 1,
  imageCache: new Map(),

  /* ═══════════════════════════════════════════════
     التهيئة
     ═══════════════════════════════════════════════ */
  init(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
      this.render();
    });
  },

  /* ═══════════════════════════════════════════════
     تغيير حجم الـ Canvas
     ═══════════════════════════════════════════════ */
  resize() {
    if (!this.canvas || !NoorState.design) return;

    const d = NoorState.design;
    const wrapper = document.getElementById("canvas-wrapper");
    const availW = (wrapper?.clientWidth || window.innerWidth) - 32;
    const availH = window.innerHeight - 220;

    const scaleW = availW / d.width;
    const scaleH = availH / d.height;
    this.previewScale = Math.min(scaleW, scaleH, 1);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = d.width * dpr;
    this.canvas.height = d.height * dpr;
    this.canvas.style.width = d.width * this.previewScale + "px";
    this.canvas.style.height = d.height * this.previewScale + "px";

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  /* ═══════════════════════════════════════════════
     الرسم الكامل
     ═══════════════════════════════════════════════ */
  async render() {
    if (!this.ctx || !NoorState.design) return;

    const d = NoorState.design;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, d.width, d.height);

    await this.drawBackground(d);
    this.drawAyah(d);
    await this.drawImages(d);
    this.drawStickers(d);

    if (d.translation && d.translation.enabled && d.translation.text) {
      this.drawTranslation(d);
    }

    this.drawAyahNumber(d);
    this.drawDecorations(d);
    this.drawFrame(d);
    this.drawDecor(d);
  },

  /* ═══════════════════════════════════════════════
     الورقة (الخلفية)
     ═══════════════════════════════════════════════ */
  async drawBackground(d) {
    const ctx = this.ctx;
    const bg = d.background;

    /* 1. اللون / التدرج / الصورة */
    if (bg.type === "solid") {
      ctx.fillStyle = bg.value || "#f5ede0";
      ctx.fillRect(0, 0, d.width, d.height);
    } else if (bg.type === "gradient") {
      const gradient = this.parseGradient(bg.value, d.width, d.height);
      ctx.fillStyle = gradient || "#f5ede0";
      ctx.fillRect(0, 0, d.width, d.height);
    } else if (bg.type === "image" && bg.imageUrl) {
      const img = await this.loadImage(bg.imageUrl);
      if (img) {
        const s = bg.imageSettings || { opacity: 100, brightness: 100, blur: 0 };
        const ratio = Math.max(d.width / img.width, d.height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (d.width - w) / 2;
        const y = (d.height - h) / 2;

        ctx.save();

        if (s.opacity < 100) {
          ctx.globalAlpha = Math.max(0, Math.min(1, s.opacity / 100));
        }

        let filterStr = "";
        if (s.brightness !== 100) filterStr += `brightness(${s.brightness / 100}) `;
        if (s.blur > 0) filterStr += `blur(${s.blur}px) `;
        if (filterStr) ctx.filter = filterStr.trim();

        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
      } else {
        ctx.fillStyle = "#f5ede0";
        ctx.fillRect(0, 0, d.width, d.height);
      }
    }

    /* 2. النقش */
    if (bg.pattern && bg.pattern !== "none") {
      this.drawPattern(ctx, d, bg.pattern);
    }

    /* 3. الإضاءة */
    if (bg.lighting && bg.lighting.enabled) {
      this.drawLighting(ctx, d, bg.lighting);
    }

    /* 4. الضباب */
    if (bg.fog && bg.fog.enabled) {
      this.drawFog(ctx, d, bg.fog);
    }

    /* 5. HDR */
    if (bg.hdr && bg.hdr.enabled) {
      this.drawHDR(ctx, d, bg.hdr);
    }

    /* 6. الفينيت */
    if (bg.vignette && bg.vignette.enabled) {
      this.drawVignette(ctx, d, bg.vignette);
    }
  },

  /* ═══════════════════════════════════════════════
     تحويل التدرج من CSS إلى Canvas
     ═══════════════════════════════════════════════ */
  parseGradient(css, w, h) {
    try {
      const match = css.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
      if (!match) return null;

      const angle = parseInt(match[1]);
      const stops = match[2].split(",").map((s) => s.trim());
      const rad = (angle - 90) * (Math.PI / 180);

      const x1 = w / 2 - Math.cos(rad) * w / 2;
      const y1 = h / 2 - Math.sin(rad) * h / 2;
      const x2 = w / 2 + Math.cos(rad) * w / 2;
      const y2 = h / 2 + Math.sin(rad) * h / 2;

      const grad = this.ctx.createLinearGradient(x1, y1, x2, y2);

      stops.forEach((stop) => {
        const parts = stop.split(/\s+(?=\d+%)/);
        grad.addColorStop(parseFloat(parts[1]) / 100 || 0, parts[0]);
      });

      return grad;
    } catch (e) {
      return null;
    }
  },

  /* ═══════════════════════════════════════════════
     تحميل صورة
     ═══════════════════════════════════════════════ */
  loadImage(src) {
    return new Promise((resolve) => {
      if (!src) {
        resolve(null);
        return;
      }
      if (this.imageCache.has(src)) {
        resolve(this.imageCache.get(src));
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  },
