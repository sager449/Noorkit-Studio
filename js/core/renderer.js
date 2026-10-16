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
   
/* ═══════════════════════════════════════════════
   النقوش (Patterns)
   ═══════════════════════════════════════════════ */
drawPattern(ctx, d, patternId) {
  ctx.save();
  const color = "rgba(201,162,39,0.10)";
  const colorStrong = "rgba(201,162,39,0.18)";

  if (patternId === "dots") {
    ctx.fillStyle = colorStrong;
    for (let x = 0; x < d.width; x += 24) {
      for (let y = 0; y < d.height; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternId === "grid") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let x = 0; x < d.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, d.height);
      ctx.stroke();
    }
    for (let y = 0; y < d.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(d.width, y);
      ctx.stroke();
    }
  } else if (patternId === "stripes") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let i = -d.height; i < d.width; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + d.height, d.height);
      ctx.stroke();
    }
  } else if (patternId === "diamond") {
    ctx.strokeStyle = colorStrong;
    ctx.lineWidth = 1.2;
    const s = 36;
    for (let x = -s; x < d.width + s; x += s) {
      for (let y = -s; y < d.height + s; y += s) {
        ctx.beginPath();
        ctx.moveTo(x, y - s / 2);
        ctx.lineTo(x + s / 2, y);
        ctx.lineTo(x, y + s / 2);
        ctx.lineTo(x - s / 2, y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else if (patternId === "geometric") {
    ctx.fillStyle = color;
    const s = 25;
    for (let x = 0; x < d.width; x += s * 2) {
      for (let y = 0; y < d.height; y += s * 2) {
        ctx.fillRect(x, y, s, s);
        ctx.fillRect(x + s, y + s, s, s);
      }
    }
  } else if (patternId === "arabesque") {
    ctx.strokeStyle = colorStrong;
    ctx.lineWidth = 1.5;
    const r = 80;
    for (let x = r / 2; x < d.width; x += r) {
      for (let y = r / 2; y < d.height; y += r) {
        ctx.beginPath();
        ctx.arc(x, y, r / 2 - 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  } else if (patternId === "waves") {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let y = 0; y < d.height; y += 24) {
      ctx.beginPath();
      for (let x = 0; x < d.width; x += 8) {
        const yy = y + Math.sin(x / 40) * 4;
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  }

  ctx.restore();
},

/* ═══════════════════════════════════════════════
   الإضاءة (Lighting)
   ═══════════════════════════════════════════════ */
drawLighting(ctx, d, l) {
  ctx.save();
  const angle = ((l.angle || 135) - 90) * (Math.PI / 180);
  const cx = d.width / 2;
  const cy = d.height / 2;
  const r = Math.max(d.width, d.height);
  const x1 = cx - Math.cos(angle) * r;
  const y1 = cy - Math.sin(angle) * r;
  const x2 = cx + Math.cos(angle) * r;
  const y2 = cy + Math.sin(angle) * r;

  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  const alpha = (l.intensity || 30) / 100;
  grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
  grad.addColorStop(0.5, `rgba(255,255,255,0)`);
  grad.addColorStop(1, `rgba(0,0,0,${alpha * 0.5})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, d.width, d.height);
  ctx.restore();
},

/* ═══════════════════════════════════════════════
   الضباب (Fog)
   ═══════════════════════════════════════════════ */
drawFog(ctx, d, f) {
  ctx.save();
  const alpha = (f.intensity || 20) / 200;
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.fillRect(0, 0, d.width, d.height);
  ctx.restore();
},

/* ═══════════════════════════════════════════════
   HDR (Contrast + Saturation)
   ═══════════════════════════════════════════════ */
drawHDR(ctx, d, h) {
  ctx.save();
  ctx.globalCompositeOperation = "overlay";

  const c = (h.contrast || 0) / 100;
  const s = (h.saturation || 0) / 100;

  const grad = ctx.createLinearGradient(0, 0, d.width, d.height);
  grad.addColorStop(0, `rgba(255,255,255,${c * 0.15})`);
  grad.addColorStop(0.5, `rgba(255,200,100,${s * 0.08})`);
  grad.addColorStop(1, `rgba(0,0,0,${c * 0.15})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, d.width, d.height);
  ctx.restore();
},

/* ═══════════════════════════════════════════════
   الفينيت (Vignette)
   ═══════════════════════════════════════════════ */
drawVignette(ctx, d, v) {
  ctx.save();
  const cx = d.width / 2;
  const cy = d.height / 2;
  const r = Math.max(d.width, d.height) * 0.7;
  const alpha = (v.intensity || 40) / 100;
  const soft = (v.softness || 60) / 100;

  const grad = ctx.createRadialGradient(
    cx, cy, r * (1 - soft),
    cx, cy, r
  );
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, `rgba(0,0,0,${alpha})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, d.width, d.height);
  ctx.restore();
},

/* ═══════════════════════════════════════════════
   رسم مستطيل بزوايا دائرية
   ═══════════════════════════════════════════════ */
roundRect(ctx, x, y, w, h, r) {
  if (r <= 0) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    return;
  }
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
},

/* ═══════════════════════════════════════════════
   تفكيك النص إلى أسطر
   ═══════════════════════════════════════════════ */
wrapText(ctx, text, maxWidth) {
  const paragraphs = text.split("\n");
  const lines = [];

  paragraphs.forEach((para) => {
    if (!para.trim()) {
      lines.push("");
      return;
    }
    const words = para.split(/\s+/);
    let current = "";

    words.forEach((word) => {
      const test = current ? current + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    });

    if (current) lines.push(current);
  });

  return lines;
},
   
  /* ═══════════════════════════════════════════════
     رسم الآية
     ═══════════════════════════════════════════════ */
  drawAyah(d) {
    const ctx = this.ctx;
    const font = NoorFonts.get(d.text.fontId);
    const text = d.ayah.text || "";
    if (!text) return;

    const t = d.text;
    ctx.save();

    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;
    const cx = d.ayah.x || d.width / 2;
    const cy = d.ayah.y || d.height / 2;

    /* Rotation */
    const rotation = ((d.ayah.rotation || 0) * Math.PI) / 180;
    if (rotation !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);
    }

    ctx.font = `400 ${t.size}px ${font.family}`;
    ctx.textAlign = t.align || "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";

    /* Opacity */
    if (typeof t.opacity === "number" && t.opacity < 100) {
      ctx.globalAlpha = Math.max(0, Math.min(1, t.opacity / 100));
    }

    const lines = this.wrapText(ctx, text, maxW);
    const lineHeight = t.size * (t.lineHeight || 1.8);
    const totalH = lines.length * lineHeight;
    const startY = cy - totalH / 2 + lineHeight / 2;

    let x = cx;
    if (t.align === "right") x = d.width - padding;
    if (t.align === "left") x = padding;

    /* ═══ Highlight ═══ */
    if (t.highlight && t.highlight.enabled) {
      const hl = t.highlight;
      const pad = hl.padding || 12;
      const radius = hl.radius || 8;
      const fillColor = NoorColors.toRgba(
        hl.color || "#c9a227",
        hl.opacity || 100
      );

      ctx.save();
      ctx.fillStyle = fillColor;

      const lineBounds = lines.map((line) => {
        const m = ctx.measureText(line);
        const w = m.width;
        let lx;
        if (t.align === "right") lx = x - w;
        else if (t.align === "left") lx = x;
        else lx = x - w / 2;
        return { w, lx };
      });

      const minX = Math.min(...lineBounds.map((b) => b.lx));
      const maxX = Math.max(...lineBounds.map((b) => b.lx + b.w));

      this.roundRect(
        ctx,
        minX - pad,
        cy - totalH / 2 - pad,
        maxX - minX + pad * 2,
        totalH + pad * 2,
        radius
      );
      ctx.fill();
      ctx.restore();
    }

    /* ═══ Glow ═══ */
    if (t.glow && t.glow.enabled) {
      ctx.save();
      ctx.shadowColor = t.glow.color || "#c9a227";
      ctx.shadowBlur = t.glow.intensity || 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = t.color || "#1a1a1a";
      lines.forEach((line, i) => {
        ctx.fillText(line, x, startY + i * lineHeight);
      });
      ctx.restore();
    }

    /* ═══ Shadow ═══ */
    if (t.shadow && t.shadow.enabled) {
      ctx.save();
      ctx.shadowColor = NoorColors.toRgba(
        t.shadow.color || "#000000",
        t.shadow.opacity || 100
      );
      ctx.shadowBlur = t.shadow.blur || 8;
      ctx.shadowOffsetX = t.shadow.x || 0;
      ctx.shadowOffsetY = t.shadow.y || 4;
    }

    /* ═══ Fill (Gradient or Color) ═══ */
    let fillStyle = t.color || "#1a1a1a";

    if (t.gradient && t.gradient.enabled) {
      const g = t.gradient;
      const angle = ((g.angle || 90) - 90) * (Math.PI / 180);
      const r = Math.max(d.width, d.height) / 2;
      const x1 = cx - Math.cos(angle) * r;
      const y1 = cy - Math.sin(angle) * r;
      const x2 = cx + Math.cos(angle) * r;
      const y2 = cy + Math.sin(angle) * r;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, g.color1 || "#c9a227");
      grad.addColorStop(1, g.color2 || "#ffffff");
      fillStyle = grad;
    }

    ctx.fillStyle = fillStyle;
    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight);
    });

    if (t.shadow && t.shadow.enabled) {
      ctx.restore();
    }

    /* ═══ Outline ═══ */
    if (t.outline && t.outline.enabled) {
      ctx.save();
      ctx.strokeStyle = t.outline.color || "#ffffff";
      ctx.lineWidth = t.outline.width || 2;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;

      lines.forEach((line, i) => {
        ctx.strokeText(line, x, startY + i * lineHeight);
      });
      ctx.restore();
    }

    ctx.restore();
  },

  /* ═══════════════════════════════════════════════
     رسم الصور
     ═══════════════════════════════════════════════ */
  async drawImages(d) {
    if (!d.images || d.images.length === 0) return;
    const ctx = this.ctx;

    for (const item of d.images) {
      const img = await this.loadImage(item.src);
      if (!img) continue;

      ctx.save();
      const cx = item.x + item.width / 2;
      const cy = item.y + item.height / 2;

      if (item.rotation) {
        ctx.translate(cx, cy);
        ctx.rotate((item.rotation * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      if (typeof item.opacity === "number" && item.opacity < 100) {
        ctx.globalAlpha = item.opacity / 100;
      }

      ctx.drawImage(img, item.x, item.y, item.width, item.height);
      ctx.restore();
    }
  },

  /* ═══════════════════════════════════════════════
     رسم الملصقات
     ═══════════════════════════════════════════════ */
  drawStickers(d) {
    if (!d.stickers || d.stickers.length === 0) return;
    const ctx = this.ctx;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const stk of d.stickers) {
      ctx.save();
      if (stk.rotation) {
        ctx.translate(stk.x, stk.y);
        ctx.rotate((stk.rotation * Math.PI) / 180);
        ctx.translate(-stk.x, -stk.y);
      }
      ctx.font = `700 ${stk.size}px 'Amiri', serif`;
      ctx.fillStyle = stk.color || "#7c3aed";
      ctx.fillText(stk.text, stk.x, stk.y);
      ctx.restore();
    }

    ctx.restore();
  },

  /* ═══════════════════════════════════════════════
     رسم رقم الآية
     ═══════════════════════════════════════════════ */
  drawAyahNumber(d) {
    if (!d.ayah.decorNumber) return;
    const ctx = this.ctx;
    const size = 40;
    const margin = 20;
    const x = d.width - margin - size - 10;
    const y = d.height - margin - size - 10;

    ctx.save();
    ctx.fillStyle = "#c9a227";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, size - 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${size}px 'Cairo', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "rtl";
    ctx.fillText(d.ayah.ayahNumber || "١", x, y);
    ctx.restore();
  },

  /* ═══════════════════════════════════════════════
     رسم الزخارف
     ═══════════════════════════════════════════════ */
  drawDecorations(d) {
    if (!d.decorations || d.decorations.length === 0) return;
    const ctx = this.ctx;

    for (const deco of d.decorations) {
      ctx.save();
      ctx.font = `400 ${deco.size || 60}px 'Amiri', serif`;
      ctx.fillStyle = deco.color || "#c9a227";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.direction = "rtl";

      if (deco.rotation) {
        ctx.translate(deco.x, deco.y);
        ctx.rotate((deco.rotation * Math.PI) / 180);
        ctx.translate(-deco.x, -deco.y);
      }

      if (deco.symbol) {
        ctx.fillText(deco.symbol, deco.x, deco.y);
      }
      ctx.restore();
    }
  },

  /* ═══════════════════════════════════════════════
     رسم الترجمة
     ═══════════════════════════════════════════════ */
  drawTranslation(d) {
    const ctx = this.ctx;
    const tr = d.translation;
    if (!tr.text) return;

    ctx.save();
    const font = NoorFonts.get(tr.fontId || "Cairo");
    ctx.font = `400 ${tr.size || 32}px ${font.family}`;
    ctx.fillStyle = tr.color || "#4a4a4a";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.direction = "ltr";

    const padding = Math.round(d.width * 0.1);
    const maxW = d.width - padding * 2;
    const lines = this.wrapText(ctx, tr.text, maxW);
    const lineHeight = (tr.size || 32) * 1.5;

    /* احسب نهاية الآية */
    const ayahFont = NoorFonts.get(d.text.fontId);
    ctx.font = `400 ${d.text.size}px ${ayahFont.family}`;
    const ayahLines = this.wrapText(ctx, d.ayah.text, maxW);
    const ayahHeight =
      ayahLines.length * d.text.size * (d.text.lineHeight || 1.8);
    const ayahBottom = d.height / 2 + ayahHeight / 2;
    const startY = ayahBottom + 40;

    ctx.font = `400 ${(tr.size || 32)}px ${font.family}`;
    lines.forEach((line, i) => {
      ctx.fillText(line, d.width / 2, startY + i * lineHeight);
    });
    ctx.restore();
  },

  /* ═══════════════════════════════════════════════
     رسم الإطار
     ═══════════════════════════════════════════════ */
  drawFrame(d) {
    if (!d.frame || d.frame.type === "none") return;
    const ctx = this.ctx;
    const pad = Math.round(d.width * 0.05);
    const thick = d.frame.thickness || 4;

    ctx.save();
    ctx.strokeStyle = d.frame.color || "#c9a227";
    ctx.lineWidth = thick;

    if (d.frame.type === "simple") {
      ctx.strokeRect(pad, pad, d.width - pad * 2, d.height - pad * 2);
    } else if (d.frame.type === "double") {
      ctx.strokeRect(pad, pad, d.width - pad * 2, d.height - pad * 2);
      ctx.strokeRect(
        pad + 12,
        pad + 12,
        d.width - (pad + 12) * 2,
        d.height - (pad + 12) * 2
      );
    } else if (d.frame.type === "ornate") {
      ctx.lineWidth = thick + 1;
      ctx.strokeRect(pad, pad, d.width - pad * 2, d.height - pad * 2);
      const cs = 30;
      const corners = [
        [pad, pad],
        [d.width - pad, pad],
        [pad, d.height - pad],
        [d.width - pad, d.height - pad],
      ];
      corners.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c[0], c[1], cs / 2, 0, Math.PI * 2);
        ctx.stroke();
      });
    }

    ctx.restore();
  },

  /* ═══════════════════════════════════════════════
     رسم الزخرفة العلوية/السفلية
     ═══════════════════════════════════════════════ */
  drawDecor(d) {
    if (!d.decor) return;
    const ctx = this.ctx;
    const gold = "#c9a227";

    if (d.decor.top) {
      ctx.save();
      ctx.fillStyle = gold;
      ctx.font = `400 40px 'Amiri', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("﷽", d.width / 2, Math.round(d.height * 0.04));
      ctx.restore();
    }

    if (d.decor.bottom) {
      ctx.save();
      ctx.fillStyle = gold;
      ctx.font = `400 30px 'Amiri', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(
        "❁ ❁ ❁",
        d.width / 2,
        d.height - Math.round(d.height * 0.04)
      );
      ctx.restore();
    }
  },
};

/* ═══════════════════════════════════════════════
   Debounced Render — تحسين الأداء
   ═══════════════════════════════════════════════ */
window.NoorRenderer.debouncedRender = (function () {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      NoorRenderer.render();
    }, 60);
  };
})();

/* ═══════════════════════════════════════════════
   Export PNG
   ═══════════════════════════════════════════════ */
window.NoorRenderer.export = async function () {
  if (!this.canvas) return;

  await NoorFonts.loadAll();

  const d = NoorState.design;
  const exportCanvas = document.createElement("canvas");
  const scale = 2;
  exportCanvas.width = d.width * scale;
  exportCanvas.height = d.height * scale;

  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.scale(scale, scale);

  const originalCanvas = this.canvas;
  const originalCtx = this.ctx;
  this.canvas = exportCanvas;
  this.ctx = exportCtx;

  await this.render();

  this.canvas = originalCanvas;
  this.ctx = originalCtx;

  return new Promise((resolve) => {
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const safeTitle = (d.title || "noor-design").replace(
          /[\\/:*?"<>|]+/g,
          "-"
        );
        a.href = url;
        a.download = `${safeTitle}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve(blob);
      },
      "image/png",
      1.0
    );
  });
};
