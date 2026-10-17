/* =========================================
   NoorKit — Video Editor (v3) - Part 1
   حالة + تهيئة + لوحة الخيارات
   ========================================= */

window.NoorVideo = {
  audioFile: null,
  audioUrl: null,
  audioEl: null,
  isPlaying: false,
  activeTool: null,
  exportedBlob: null,

  state: {
    title: "فيديو بدون عنوان",
    imageUrl: null,
    text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    textColor: "#ffffff",
    textSize: 32,
    audioUrl: null,
    audioName: "",
    duration: 0,
    quality: "1080p",
  },

  init() {
    this.bindHeader();
    this.bindToolbar();
    this.bindPanelClose();
    this.bindPlayButton();
    this.bindTitle();
    this.loadFromStorage();
    this.updatePreview();
  },

  bindHeader() {
    document.getElementById("video-export-btn")?.addEventListener("click", () => this.exportVideo());
    document.getElementById("video-save-btn")?.addEventListener("click", () => this.save());
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
    document.getElementById("video-panel-close")?.addEventListener("click", () => this.closePanel());
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

  /* ═══════════════════════════════════════════════
     لوحة الخيارات
     ═══════════════════════════════════════════════ */
  openPanel(tool) {
    const panel = document.getElementById("video-panel");
    const title = document.getElementById("video-panel-title");
    const content = document.getElementById("video-panel-content");
    if (!panel || !content) return;

    let html = "";

    /* ═══ الصوت ═══ */
    if (tool === "audio") {
      title.textContent = "الصوت";
      html = `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <input type="file" id="video-audio-input" accept="audio/*" style="display:none;" />
          <button id="video-audio-btn" style="background:#b91c1c;color:#fff;border:none;padding:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:8px;">
            🎵 اختيار ملف صوتي
          </button>
          ${this.audioFile ? `<p style="font-size:12px;color:#fecaca;text-align:center;">الملف: ${this.audioFile.name}</p>` : ""}
          
          <hr style="border-color:#333;margin:8px 0;">
          
          <p style="font-size:11px;color:#888;text-align:center;margin:0;">أو من فيديو</p>
          
          <input type="file" id="video-extract-input" accept="video/*" style="display:none;" />
          <button id="video-extract-btn" style="background:#2a2a2a;color:#fff;border:none;padding:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:8px;">
            🎬 استخراج صوت من فيديو
          </button>
          
          <input type="file" id="video-remove-audio-input" accept="video/*" style="display:none;" />
          <button id="video-remove-audio-btn" style="background:#2a2a2a;color:#fff;border:none;padding:12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:8px;">
            🔇 إزالة الصوت من فيديو
          </button>
        </div>
      `;
    }

    /* ═══ الصورة ═══ */
    else if (tool === "image") {
      title.textContent = "الصورة";
      html = `
        <div style="text-align:center;">
          <input type="file" id="video-image-input" accept="image/*" style="display:none;" />
          <button id="video-image-btn" style="background:#b91c1c;color:#fff;border:none;padding:14px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:8px;">
            🖼️ اختيار صورة خلفية
          </button>
          ${this.state.imageUrl ? `<button id="video-image-remove" style="margin-top:12px;background:#2a2a2a;color:#fff;border:none;padding:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;border-radius:8px;">إزالة الصورة</button>` : ""}
        </div>
      `;
    }

    /* ═══ النص ═══ */
    else if (tool === "text") {
      title.textContent = "النص";
      html = `
        <div>
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin-bottom:6px;">النص</label>
          <textarea id="video-text-input" style="width:100%;padding:10px;background:#2a2a2a;color:#fff;border:1px solid #333;font-family:inherit;font-size:14px;font-weight:600;resize:none;border-radius:8px;box-sizing:border-box;min-height:80px;">${this.state.text}</textarea>
          
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin:12px 0 6px;">حجم الخط: <span id="video-text-size-val">${this.state.textSize}</span></label>
          <input type="range" id="video-text-size" min="16" max="60" value="${this.state.textSize}" style="width:100%;">
          
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin:12px 0 6px;">اللون</label>
          <input type="color" id="video-text-color" value="${this.state.textColor}" style="width:100%;height:40px;background:transparent;border:none;border-radius:8px;">
        </div>
      `;
    }

    /* ═══ الإعدادات ═══ */
    else if (tool === "settings") {
      title.textContent = "الإعدادات";
      html = `
        <div>
          <label style="font-size:12px;font-weight:700;color:#fecaca;display:block;margin-bottom:6px;">جودة التصدير</label>
          <select id="video-quality" style="width:100%;padding:12px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:14px;font-weight:700;border-radius:8px;margin-bottom:12px;">
            <option value="720p" ${this.state.quality === "720p" ? "selected" : ""}>720p — سريع</option>
            <option value="1080p" ${this.state.quality === "1080p" ? "selected" : ""}>1080p — متوسط</option>
            <option value="4k" ${this.state.quality === "4k" ? "selected" : ""}>4K — احترافي (أبطأ)</option>
          </select>
          
          <p style="font-size:11px;color:#888;line-height:1.6;">
            لإنشاء الفيديو: ارفع صورة، ارفع صوتاً، ثم اضغط "تصدير" من الأعلى.
          </p>
        </div>
      `;
    }

    content.innerHTML = html;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("open"));

    this.bindPanelContent(tool);
  },
   
  bindPanelContent(tool) {
    /* ═══ الصوت ═══ */
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
        });

        this.updateTimelineTrack("audio", file.name);
        this.showToast("تم تحميل الصوت");
        this.openPanel("audio");
      });

      /* استخراج الصوت من فيديو */
      const extractInput = document.getElementById("video-extract-input");
      const extractBtn = document.getElementById("video-extract-btn");

      extractBtn?.addEventListener("click", () => extractInput?.click());

      extractInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        this.showProgressModal("جاري استخراج الصوت...");

        try {
          const blob = await NoorVideoExporter.extractAudio(file, (msg, p) => {
            this.updateProgressModal(msg, p);
          });

          const audioFile = new File([blob], "extracted-audio.mp3", { type: "audio/mp3" });
          this.audioFile = audioFile;
          this.audioUrl = URL.createObjectURL(blob);
          this.state.audioUrl = this.audioUrl;

          if (!this.audioEl) {
            this.audioEl = new Audio();
            this.audioEl.addEventListener("timeupdate", () => this.updateProgress());
          }
          this.audioEl.src = this.audioUrl;

          this.updateTimelineTrack("audio", "صوت مستخرج");
          this.closeProgressModal();
          this.showToast("تم استخراج الصوت");
          this.openPanel("audio");
        } catch (err) {
          console.error("Extract failed:", err);
          this.closeProgressModal();
          this.showToast("تعذر الاستخراج");
        }
      });

      /* إزالة الصوت من فيديو */
      const removeInput = document.getElementById("video-remove-audio-input");
      const removeBtn = document.getElementById("video-remove-audio-btn");

      removeBtn?.addEventListener("click", () => removeInput?.click());

      removeInput?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        this.showProgressModal("جاري إزالة الصوت...");

        try {
          const blob = await NoorVideoExporter.removeAudio(file, (msg, p) => {
            this.updateProgressModal(msg, p);
          });

          NoorVideoExporter.download(blob, "no-audio-video.mp4");
          this.closeProgressModal();
          this.showToast("تم تنزيل الفيديو بدون صوت");
        } catch (err) {
          console.error("Remove failed:", err);
          this.closeProgressModal();
          this.showToast("تعذر الإزالة");
        }
      });
    }

    /* ═══ الصورة ═══ */
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
          this.updateTimelineTrack("image", file.name);
          this.showToast("تم تحميل الصورة");
          this.openPanel("image");
        };
        reader.readAsDataURL(file);
      });

      document.getElementById("video-image-remove")?.addEventListener("click", () => {
        this.state.imageUrl = null;
        this.updatePreview();
        this.updateTimelineTrack("image", null);
        this.openPanel("image");
      });
    }

    /* ═══ النص ═══ */
    if (tool === "text") {
      const textInput = document.getElementById("video-text-input");
      const sizeInput = document.getElementById("video-text-size");
      const sizeVal = document.getElementById("video-text-size-val");
      const colorInput = document.getElementById("video-text-color");

      textInput?.addEventListener("input", () => {
        this.state.text = textInput.value;
        this.updatePreview();
        this.updateTimelineTrack("text", textInput.value ? "نص مخصص" : null);
      });

      sizeInput?.addEventListener("input", () => {
        this.state.textSize = parseInt(sizeInput.value);
        if (sizeVal) sizeVal.textContent = this.state.textSize;
        this.updatePreview();
      });

      colorInput?.addEventListener("input", () => {
        this.state.textColor = colorInput.value;
        this.updatePreview();
      });
    }

    /* ═══ الإعدادات ═══ */
    if (tool === "settings") {
      const qualitySelect = document.getElementById("video-quality");
      qualitySelect?.addEventListener("change", () => {
        this.state.quality = qualitySelect.value;
      });
    }
  },

  /* ═══════════════════════════════════════════════
     شاشة التقدم
     ═══════════════════════════════════════════════ */
  showProgressModal(title) {
    let modal = document.getElementById("video-progress-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "video-progress-modal";
      modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0,0,0,0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        padding: 20px;
      `;
      modal.innerHTML = `
        <div style="background:#1a1a1a;padding:30px;border-radius:16px;width:100%;max-width:320px;text-align:center;border:2px solid #b91c1c;">
          <h3 id="video-progress-title" style="color:#fff;font-size:16px;margin:0 0 20px;">جاري المعالجة...</h3>
          <div style="width:100%;height:8px;background:#2a2a2a;border-radius:4px;overflow:hidden;">
            <div id="video-progress-bar" style="height:100%;width:0%;background:#b91c1c;transition:width 0.3s;"></div>
          </div>
          <p id="video-progress-percent" style="color:#fecaca;font-size:12px;margin:12px 0 0;">0%</p>
          <p style="color:#888;font-size:11px;margin:16px 0 0;line-height:1.5;">قد يستغرق 1-3 دقائق حسب حجم الفيديو</p>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.hidden = false;
    document.getElementById("video-progress-title").textContent = title;
  },

  updateProgressModal(message, percent) {
    const title = document.getElementById("video-progress-title");
    const bar = document.getElementById("video-progress-bar");
    const pct = document.getElementById("video-progress-percent");
    if (title) title.textContent = message;
    if (bar) bar.style.width = percent + "%";
    if (pct) pct.textContent = percent + "%";
  },

  closeProgressModal() {
    const modal = document.getElementById("video-progress-modal");
    if (modal) modal.hidden = true;
  },

  /* ═══════════════════════════════════════════════
     تحديث الـ Timeline
     ═══════════════════════════════════════════════ */
  updateTimelineTrack(type, content) {
    const track = document.getElementById(`track-${type}`);
    if (!track) return;

    if (content) {
      track.classList.add("has-content");
      track.innerHTML = `<div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${content}</div>`;
    } else {
      track.classList.remove("has-content");
      const texts = {
        audio: "اسحب ملفاً هنا",
        image: "اسحب صورة هنا",
        text: "أضف نصاً"
      };
      track.innerHTML = `<div class="video-track-empty">${texts[type]}</div>`;
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
      this.animatePlayhead();
    }
  },

  animatePlayhead() {
    if (!this.isPlaying || !this.audioEl) return;
    const percent = (this.audioEl.currentTime / this.audioEl.duration) * 100;
    const playhead = document.getElementById("video-playhead");
    if (playhead) playhead.style.left = `calc(${percent}% - ${percent * 0.36}px + 20px)`;
    requestAnimationFrame(() => this.animatePlayhead());
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
      const data = { ...this.state, audioUrl: null };
      localStorage.setItem("noorkit_video", JSON.stringify(data));
      this.showToast("تم حفظ الفيديو");
    } catch (e) {
      this.showToast("تعذر الحفظ");
    }
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("noorkit_video");
      if (!saved) return;
      const data = JSON.parse(saved);
      this.state = { ...this.state, ...data };
      document.getElementById("video-title").value = this.state.title;
      this.updatePreview();
      if (this.state.imageUrl) this.updateTimelineTrack("image", "صورة محفوظة");
      if (this.state.text) this.updateTimelineTrack("text", "نص محفوظ");
    } catch (e) {}
  },

  /* ═══════════════════════════════════════════════
     تصدير الفيديو
     ═══════════════════════════════════════════════ */
  async exportVideo() {
    if (!this.state.imageUrl) {
      this.showToast("أضف صورة أولاً");
      return;
    }
    if (!this.audioFile) {
      this.showToast("أضف صوتاً أولاً");
      return;
    }

    this.showProgressModal("جاري تحضير الفيديو...");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (this.state.imageUrl) {
        await this.loadImageToCanvas(ctx, this.state.imageUrl, 0, 0, canvas.width, canvas.height);
      }

      if (this.state.text) {
        ctx.font = `400 ${this.state.textSize * 3}px 'Amiri', serif`;
        ctx.fillStyle = this.state.textColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.direction = "rtl";

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

      const imageDataUrl = canvas.toDataURL("image/png");

      const videoBlob = await NoorVideoExporter.exportVideo({
        imageUrl: imageDataUrl,
        audioBlob: this.audioFile,
        quality: this.state.quality,
        onProgress: (msg, p) => this.updateProgressModal(msg, p),
      });

      this.exportedBlob = videoBlob;

      NoorVideoExporter.download(videoBlob, `${this.state.title || "video"}.mp4`);

      this.closeProgressModal();
      this.showToast("تم تصدير الفيديو");
    } catch (err) {
      console.error("Export failed:", err);
      this.closeProgressModal();
      this.showToast("تعذر التصدير");
    }
  },

  loadImageToCanvas(ctx, src, x, y, w, h) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
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
