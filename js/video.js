/* =========================================
   NoorKit — Video Editor (v1)
   شاشة الفيديو
   ========================================= */

window.NoorVideo = {
  audioFile: null,
  audioUrl: null,
  audioEl: null,
  isPlaying: false,
  activeTool: null,

  /* حالة الفيديو */
  state: {
    title: "فيديو بدون عنوان",
    imageUrl: null,
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    textColor: "#ffffff",
    textSize: 28,
    textFont: "'Amiri', serif",
    audioUrl: null,
    audioName: "",
    duration: 0,
  },

  init() {
    this.bindHeader();
    this.bindToolbar();
    this.bindPanelClose();
    this.bindPlayButton();
    this.bindTitle();
    this.loadFromUrl();
    this.updatePreview();
  },

  bindHeader() {
    document.getElementById("video-export-btn")?.addEventListener("click", () => {
      this.exportVideo();
    });

    document.getElementById("video-save-btn")?.addEventListener("click", () => {
      this.save();
    });
  },

  bindTitle() {
    const titleInput = document.getElementById("video-title");
    titleInput?.addEventListener("input", () => {
      this.state.title = titleInput.value.trim() || "فيديو بدون عنوان";
    });
  },

  bindToolbar() {
    document.querySelectorAll("[data-video-tool]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tool = btn.dataset.videoTool;
        if (this.activeTool === tool) {
          this.closePanel();
          return;
        }
        this.activeTool = tool;
        document.querySelectorAll("[data-video-tool]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.openPanel(tool);
      });
    });
  },

  bindPanelClose() {
    document.getElementById("video-panel-close")?.addEventListener("click", () => {
      this.closePanel();
    });
  },

  bindPlayButton() {
    document.getElementById("video-play-btn")?.addEventListener("click", () => {
      if (!this.audioUrl) {
        this.showToast("ارفع صوتاً أولاً");
        return;
      }
      this.togglePlay();
    });
  },

  openPanel(tool) {
    const panel = document.getElementById("video-panel");
    const title = document.getElementById("video-panel-title");
    const content = document.getElementById("video-panel-content");
    if (!panel || !content) return;

    let html = "";

    if (tool === "audio") {
      title.textContent = "الصوت";
      html = `
        <div style="text-align:center;padding:10px;">
          <input type="file" id="video-audio-input" accept="audio/*" style="display:none;" />
          <button id="video-audio-btn" style="background:#ffffff;color:#b91c1c;border:none;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:4px;">
            🎵 اختيار ملف صوتي
          </button>
          ${this.audioFile ? `<p style="margin-top:12px;font-size:12px;color:#fecaca;">الملف الحالي: ${this.audioFile.name}</p>` : ""}
        </div>
      `;
    } else if (tool === "image") {
      title.textContent = "الصورة";
      html = `
        <div style="text-align:center;padding:10px;">
          <input type="file" id="video-image-input" accept="image/*" style="display:none;" />
          <button id="video-image-btn" style="background:#ffffff;color:#b91c1c;border:none;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:4px;">
            🖼️ اختيار صورة خلفية
          </button>
          ${this.state.imageUrl ? `<button id="video-image-remove" style="margin-top:12px;background:#7f1d1d;color:#ffffff;border:none;padding:10px 24px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:4px;">إزالة الصورة</button>` : ""}
        </div>
      `;
    } else if (tool === "text") {
      title.textContent = "النص";
      html = `
        <div style="padding:10px;">
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin-bottom:6px;">النص</label>
          <textarea id="video-text-input" style="width:100%;padding:10px;background:#7f1d1d;color:#ffffff;border:1px solid #991b1b;font-family:inherit;font-size:14px;font-weight:600;resize:none;border-radius:4px;box-sizing:border-box;min-height:80px;">${this.state.text}</textarea>
          
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin:12px 0 6px;">حجم الخط</label>
          <input type="range" id="video-text-size" min="16" max="60" value="${this.state.textSize}" style="width:100%;">
          
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin:12px 0 6px;">اللون</label>
          <input type="color" id="video-text-color" value="${this.state.textColor}" style="width:100%;height:40px;background:transparent;border:none;border-radius:4px;">
        </div>
      `;
    } else if (tool === "settings") {
      title.textContent = "الإعدادات";
      html = `
        <div style="padding:10px;">
          <p style="font-size:13px;color:#fecaca;margin-bottom:12px;">مدة الفيديو: <span id="video-duration">${this.state.duration || 0}</span> ثانية</p>
          <p style="font-size:11px;color:#fecaca;line-height:1.6;">لإنشاء الفيديو: ارفع صورة، ارفع صوتاً، ثم اضغط "تصدير".<br>سيتم إنشاء فيديو MP4 بالصوت والصورة.</p>
        </div>
      `;
    }

    content.innerHTML = html;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("open"));

    this.bindPanelContent(tool);
  },

  bindPanelContent(tool) {
    if (tool === "audio") {
      const input = document.getElementById("video-audio-input");
      const btn = document.getElementById("video-audio-btn");

      btn?.addEventListener("click", () => input?.click());

      input?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        this.audioFile = file;
        this.audioUrl = URL.createObjectURL(file);
        this.state.audioUrl = this.audioUrl;
        this.state.audioName = file.name;

        /* حفظ الصوت في الذاكرة */
        if (!this.audioEl) {
          this.audioEl = new Audio();
          this.audioEl.addEventListener("timeupdate", () => this.updateProgress());
          this.audioEl.addEventListener("ended", () => {
            this.isPlaying = false;
            document.getElementById("video-play-btn")?.classList.remove("playing");
            this.updateProgress(0);
          });
        }
        this.audioEl.src = this.audioUrl;

        this.audioEl.addEventListener("loadedmetadata", () => {
          this.state.duration = Math.round(this.audioEl.duration);
          const dur = document.getElementById("video-duration");
          if (dur) dur.textContent = this.state.duration;
        });

        this.showToast("تم تحميل الصوت");
        this.openPanel("audio"); // إعادة رسم
      });
    }

    if (tool === "image") {
      const input = document.getElementById("video-image-input");
      const btn = document.getElementById("video-image-btn");

      btn?.addEventListener("click", () => input?.click());

      input?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.state.imageUrl = ev.target.result;
          this.updatePreview();
          this.showToast("تم تحميل الصورة");
          this.openPanel("image");
        };
        reader.readAsDataURL(file);
      });

      document.getElementById("video-image-remove")?.addEventListener("click", () => {
        this.state.imageUrl = null;
        this.updatePreview();
        this.openPanel("image");
      });
    }

    if (tool === "text") {
      const textInput = document.getElementById("video-text-input");
      const sizeInput = document.getElementById("video-text-size");
      const colorInput = document.getElementById("video-text-color");

      textInput?.addEventListener("input", () => {
        this.state.text = textInput.value;
        this.updatePreview();
      });

      sizeInput?.addEventListener("input", () => {
        this.state.textSize = parseInt(sizeInput.value);
        this.updatePreview();
      });

      colorInput?.addEventListener("input", () => {
        this.state.textColor = colorInput.value;
        this.updatePreview();
      });
    }
  },

  closePanel() {
    const panel = document.getElementById("video-panel");
    if (!panel) return;
    panel.classList.remove("open");
    setTimeout(() => panel.hidden = true, 300);
    this.activeTool = null;
    document.querySelectorAll("[data-video-tool]").forEach((b) => b.classList.remove("active"));
  },

  updatePreview() {
    const bg = document.getElementById("video-bg");
    const text = document.getElementById("video-text");

    if (bg) {
      if (this.state.imageUrl) {
        bg.style.backgroundImage = `url('${this.state.imageUrl}')`;
      } else {
        bg.style.backgroundImage = "";
        bg.style.background = "#1a1a1a";
      }
    }

    if (text) {
      text.textContent = this.state.text || "";
      text.style.fontSize = this.state.textSize + "px";
      text.style.color = this.state.textColor;
      text.style.fontFamily = this.state.textFont;
    }
  },

  togglePlay() {
    if (!this.audioEl) return;

    if (this.isPlaying) {
      this.audioEl.pause();
      this.isPlaying = false;
      document.getElementById("video-play-btn")?.classList.remove("playing");
    } else {
      this.audioEl.play();
      this.isPlaying = true;
      document.getElementById("video-play-btn")?.classList.add("playing");
    }
  },

  updateProgress(forceVal) {
    const progress = document.getElementById("video-progress");
    if (!progress) return;

    if (typeof forceVal === "number") {
      progress.style.width = forceVal + "%";
      return;
    }

    if (!this.audioEl || !this.audioEl.duration) return;
    const percent = (this.audioEl.currentTime / this.audioEl.duration) * 100;
    progress.style.width = percent + "%";
  },

  save() {
    try {
      const data = { ...this.state, audioUrl: null }; // لا نحفظ روابط blob
      localStorage.setItem("noorkit_video", JSON.stringify(data));
      this.showToast("تم حفظ الفيديو");
    } catch (e) {
      console.error("Save failed:", e);
      this.showToast("تعذر الحفظ");
    }
  },

  loadFromUrl() {
    try {
      const saved = localStorage.getItem("noorkit_video");
      if (!saved) return;
      const data = JSON.parse(saved);
      this.state = { ...this.state, ...data };
      document.getElementById("video-title").value = this.state.title;
      this.updatePreview();
    } catch (e) {
      console.error("Load failed:", e);
    }
  },

  async exportVideo() {
    if (!this.state.imageUrl && !this.state.text) {
      this.showToast("أضف صورة أو نصاً أولاً");
      return;
    }
    if (!this.audioUrl) {
      this.showToast("أضف صوتاً أولاً");
      return;
    }

    this.showToast("جاري التصدير...");

    try {
      // رسم الصورة على Canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");

      // خلفية سوداء
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // صورة الخلفية
      if (this.state.imageUrl) {
        await this.loadImageToCanvas(ctx, this.state.imageUrl, 0, 0, canvas.width, canvas.height);
      }

      // النص
      if (this.state.text) {
        ctx.font = `400 ${this.state.textSize * 3}px 'Amiri', serif`;
        ctx.fillStyle = this.state.textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.direction = "rtl";

        // تقسيم النص إلى أسطر
        const words = this.state.text.split(" ");
        const lines = [];
        let currentLine = "";
        const maxWidth = canvas.width - 120;

        words.forEach((word) => {
          const test = currentLine ? currentLine + " " + word : word;
          if (ctx.measureText(test).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = test;
          }
        });
        if (currentLine) lines.push(currentLine);

        const lineHeight = this.state.textSize * 3 * 1.6;
        const startY = canvas.height / 2 - (lines.length * lineHeight) / 2 + lineHeight / 2;

        lines.forEach((line, i) => {
          ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
        });
      }

      // تحويل الصورة إلى blob
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

      // تنزيل الصورة (مؤقتاً قبل دمج FFmpeg)
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.state.title || "video"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 2000);

      this.showToast("تم تنزيل الصورة. الفيديو قريباً!");
    } catch (err) {
      console.error("Export failed:", err);
      this.showToast("تعذر التصدير");
    }
  },

  loadImageToCanvas(ctx, src, x, y, w, h) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // fit cover
        const ratio = Math.max(w / img.width, h / img.height);
        const imgW = img.width * ratio;
        const imgH = img.height * ratio;
        const dx = (w - imgW) / 2;
        const dy = (h - imgH) / 2;
        ctx.drawImage(img, dx, dy, imgW, imgH);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  },

  showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  NoorVideo.init();
});
