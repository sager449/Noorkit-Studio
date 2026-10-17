/* =========================================
   NoorKit — Paper Tools (v1)
   أدوات تبويب الخلفية (الورقة)
   ========================================= */

window.NoorPaperTools = {
  /* ═══ تدرجات جاهزة ═══ */
  GRADIENTS: [
    { name: "ذهبي",      css: "linear-gradient(135deg, #c9a227 0%, #fff8d0 100%)" },
    { name: "نار",       css: "linear-gradient(135deg, #f59e0b 0%, #b91c1c 100%)" },
    { name: "سماء",      css: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)" },
    { name: "زمرد",      css: "linear-gradient(135deg, #0d8b5f 0%, #c9a227 100%)" },
    { name: "غروب",      css: "linear-gradient(135deg, #be185d 0%, #f59e0b 100%)" },
    { name: "فضي",       css: "linear-gradient(135deg, #e8e8e8 0%, #888888 100%)" },
    { name: "وردي",      css: "linear-gradient(135deg, #fda4af 0%, #be185d 100%)" },
    { name: "كريمي",     css: "linear-gradient(135deg, #f5ede0 0%, #d4c5a0 100%)" },
    { name: "ليلي",      css: "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)" },
    { name: "زمردي",     css: "linear-gradient(135deg, #0d8b5f 0%, #0891b2 100%)" },
    { name: "بنفسجي",    css: "linear-gradient(135deg, #4c1d95 0%, #c084fc 100%)" },
    { name: "ذهبي غامق", css: "linear-gradient(135deg, #78350f 0%, #c9a227 100%)" },
  ],

  /* ═══ نقوش ═══ */
  PATTERNS: [
    { id: "none",      name: "بدون" },
    { id: "arabesque", name: "عربي" },
    { id: "geometric", name: "هندسي" },
    { id: "diamond",   name: "معينات" },
    { id: "stripes",   name: "خطوط" },
    { id: "dots",      name: "نقاط" },
    { id: "grid",      name: "شبكة" },
    { id: "waves",     name: "أمواج" },
  ],

  ensure() {
    const b = NoorState.design.background;
    if (!b) return null;
    if (!b.pattern) b.pattern = "none";
    if (!b.lighting) b.lighting = { enabled: false, angle: 135, intensity: 30 };
    if (!b.fog) b.fog = { enabled: false, intensity: 20 };
    if (!b.imageSettings) b.imageSettings = { opacity: 100, brightness: 100, blur: 0 };
    return b;
  },

  renderContent(toolId) {
    const b = this.ensure();
    if (!b) return "<p>خطأ</p>";

    /* ═══ اللون ═══ */
    if (toolId === "paper-color") {
      const colors = NoorColors.renderSwatches(
        b.type === "solid" ? b.value : "",
        "paper-color"
      );
      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-paper-color-picker></button>
          <div class="nk-color-scroll">${colors}</div>
        </div>
      `;
    }

    /* ═══ تدرج ═══ */
    if (toolId === "paper-gradient") {
      const grads = this.GRADIENTS.map(
        (g) =>
          `<button class="nk-grad-chip ${b.type === "gradient" && b.value === g.css ? "active" : ""}" data-paper-grad="${this.escape(g.css)}" title="${g.name}"><span style="background:${g.css};"></span></button>`
      ).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">تدرجات</span></div>
        <div class="nk-grad-scroll">${grads}</div>
      `;
    }

    /* ═══ من الهاتف ═══ */
    if (toolId === "paper-from-device") {
      return `
        <div style="padding:16px;text-align:center;">
          <p style="color:#b0b0b0;font-size:13px;margin:0 0 12px;">اختر صورة من جهازك</p>
          <input type="file" id="paper-upload-input" accept="image/*" style="display:none;" />
          <button id="paper-upload-btn" style="background:#ffffff;color:#111;border:none;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;">
            📱 اختيار صورة
          </button>
        </div>
      `;
    }

    /* ═══ من الإنترنت ═══ */
    if (toolId === "paper-from-web") {
      return `
        <div style="padding:16px;text-align:center;">
          <p style="color:#b0b0b0;font-size:13px;margin:0 0 12px;">جلب صورة عشوائية من الإنترنت</p>
          <button id="paper-random-btn" style="background:#ffffff;color:#111;border:none;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;">
            🌐 جلب صورة
          </button>
          <p style="color:#666;font-size:11px;margin-top:12px;">المصدر: Unsplash (صور مجانية)</p>
        </div>
      `;
    }

    /* ═══ نقش ═══ */
    if (toolId === "paper-pattern") {
      const pats = this.PATTERNS.map((p) => {
        let previewStyle = "background:#1f1f1f;";
        if (p.id === "dots") previewStyle += "background-image:radial-gradient(#c9a227 1px,transparent 1.5px);background-size:10px 10px;";
        if (p.id === "grid") previewStyle += "background-image:linear-gradient(#c9a22755 1px,transparent 1px),linear-gradient(90deg,#c9a22755 1px,transparent 1px);background-size:10px 10px;";
        if (p.id === "stripes") previewStyle += "background-image:repeating-linear-gradient(45deg,#c9a22755 0,#c9a22755 1px,transparent 1px,transparent 6px);";
        if (p.id === "diamond") previewStyle += "background-image:linear-gradient(45deg,#c9a22755 25%,transparent 25%),linear-gradient(-45deg,#c9a22755 25%,transparent 25%);background-size:12px 12px;";
        if (p.id === "geometric") previewStyle += "background-image:linear-gradient(45deg,#c9a22755 25%,transparent 25%,transparent 75%,#c9a22755 75%);background-size:12px 12px;";
        if (p.id === "arabesque") previewStyle += "background-image:radial-gradient(circle,#c9a22755 2px,transparent 3px);background-size:12px 12px;";
        if (p.id === "waves") previewStyle += "background-image:repeating-linear-gradient(0deg,#c9a22755 0,#c9a22755 1px,transparent 1px,transparent 6px);";

        return `<button class="nk-pattern-chip ${b.pattern === p.id ? "active" : ""}" data-paper-pattern="${p.id}"><span style="${previewStyle}"></span><small>${p.name}</small></button>`;
      }).join("");
      return `
        <div class="nk-row"><span class="nk-row-label">النقوش</span></div>
        <div class="nk-pattern-scroll">${pats}</div>
      `;
    }

    /* ═══ إضاءة ═══ */
    if (toolId === "paper-lighting") {
      const l = b.lighting;
      return `
        <div class="nk-row"><span class="nk-row-label">الزاوية</span><span class="nk-row-value" id="paper-light-angle-val">${l.angle}°</span></div>
        <input type="range" class="ts-slider" id="paper-light-angle" min="0" max="360" value="${l.angle}" style="width:100%;margin-bottom:10px;" />
        <div class="nk-row"><span class="nk-row-label">القوة</span><span class="nk-row-value" id="paper-light-int-val">${l.intensity}</span></div>
        <input type="range" class="ts-slider" id="paper-light-int" min="0" max="100" value="${l.intensity}" style="width:100%;" />
      `;
    }

    /* ═══ ضباب ═══ */
    if (toolId === "paper-fog") {
      const f = b.fog;
      return `
        <div class="nk-row"><span class="nk-row-label">القوة</span><span class="nk-row-value" id="paper-fog-int-val">${f.intensity}</span></div>
        <input type="range" class="ts-slider" id="paper-fog-int" min="0" max="100" value="${f.intensity}" style="width:100%;" />
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  bindContent(toolId) {
    const b = this.ensure();
    if (!b) return;

    /* ═══ اللون ═══ */
    if (toolId === "paper-color") {
      document.querySelectorAll("[data-paper-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.type = "solid";
          b.value = btn.dataset.paperColor;
          b.imageUrl = null;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      document.querySelector("[data-paper-color-picker]")?.addEventListener("click", () => {
        NoorColors.openPicker(b.value || "#f5ede0", async (c) => {
          b.type = "solid";
          b.value = c;
          b.imageUrl = null;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ تدرج ═══ */
    if (toolId === "paper-gradient") {
      document.querySelectorAll("[data-paper-grad]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.type = "gradient";
          b.value = btn.dataset.paperGrad;
          b.imageUrl = null;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ من الهاتف ═══ */
    if (toolId === "paper-from-device") {
      const input = document.getElementById("paper-upload-input");
      const btn = document.getElementById("paper-upload-btn");

      btn?.addEventListener("click", () => input?.click());

      input?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
          b.type = "image";
          b.imageUrl = ev.target.result;
          NoorState.pushHistory();
          await NoorRenderer.render();

          if (typeof window.showToast === "function") {
            window.showToast("تم تحميل صورة الورقة");
          }
        };
        reader.readAsDataURL(file);
      });
    }

    /* ═══ من الإنترنت ═══ */
    if (toolId === "paper-from-web") {
      document.getElementById("paper-random-btn")?.addEventListener("click", async () => {
        try {
          const w = NoorState.design.width;
          const h = NoorState.design.height;
          const url = `https://source.unsplash.com/${w}x${h}/?islamic,nature,mosque&random=${Date.now()}`;

          b.type = "image";
          b.imageUrl = url;
          NoorState.pushHistory();
          await NoorRenderer.render();

          if (typeof window.showToast === "function") {
            window.showToast("تم جلب صورة");
          }
        } catch (err) {
          console.error("fetch failed:", err);
          if (typeof window.showToast === "function") {
            window.showToast("تعذر جلب الصورة");
          }
        }
      });
    }

    /* ═══ نقش ═══ */
    if (toolId === "paper-pattern") {
      document.querySelectorAll("[data-paper-pattern]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          b.pattern = btn.dataset.paperPattern;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ إضاءة ═══ */
    if (toolId === "paper-lighting") {
      const angle = document.getElementById("paper-light-angle");
      const angleVal = document.getElementById("paper-light-angle-val");
      const int = document.getElementById("paper-light-int");
      const intVal = document.getElementById("paper-light-int-val");

      angle?.addEventListener("input", () => {
        b.lighting.angle = parseInt(angle.value);
        b.lighting.enabled = true;
        if (angleVal) angleVal.textContent = b.lighting.angle + "°";
        NoorRenderer.debouncedRender();
      });
      angle?.addEventListener("change", () => NoorState.pushHistory());

      int?.addEventListener("input", () => {
        b.lighting.intensity = parseInt(int.value);
        b.lighting.enabled = true;
        if (intVal) intVal.textContent = b.lighting.intensity;
        NoorRenderer.debouncedRender();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ ضباب ═══ */
    if (toolId === "paper-fog") {
      const int = document.getElementById("paper-fog-int");
      const intVal = document.getElementById("paper-fog-int-val");
      int?.addEventListener("input", () => {
        b.fog.intensity = parseInt(int.value);
        b.fog.enabled = true;
        if (intVal) intVal.textContent = b.fog.intensity;
        NoorRenderer.debouncedRender();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }
  },

  escape(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },
};
