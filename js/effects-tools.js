/* =========================================
   NoorKit — Effects Tools (v1)
   أدوات تأثيرات النص
   ========================================= */

window.NoorEffectsTools = {
  COLORS: [
    "#000000", "#ffffff", "#c9a227", "#7c3aed",
    "#1e40af", "#b91c1c", "#0d8b5f", "#f59e0b",
    "#78350f", "#be185d", "#0891b2", "#78716c",
  ],

  ensure(toolId) {
    const t = NoorState.design.text;

    if (toolId === "shadow" && !t.shadow) {
      t.shadow = { enabled: false, color: "#000000", blur: 8, x: 0, y: 4, opacity: 100 };
    }
    if (toolId === "outline" && !t.outline) {
      t.outline = { enabled: false, color: "#ffffff", width: 2 };
    }
    if (toolId === "gradient" && !t.gradient) {
      t.gradient = { enabled: false, color1: "#c9a227", color2: "#ffffff", angle: 90 };
    }
    if (toolId === "glow" && !t.glow) {
      t.glow = { enabled: false, color: "#c9a227", intensity: 15 };
    }
    if (toolId === "highlight" && !t.highlight) {
      t.highlight = { enabled: false, color: "#c9a227", padding: 12, radius: 8, opacity: 100 };
    }
    if (toolId === "opacity" && typeof t.opacity !== "number") {
      t.opacity = 100;
    }
  },

  renderContent(toolId) {
    this.ensure(toolId);
    const t = NoorState.design.text;

    /* ═══ ظل ═══ */
    if (toolId === "shadow") {
      const s = t.shadow;
      const colors = this.COLORS.map(
        (c) =>
          `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-fx-shadow-color="${c}" style="background:${c};"></button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-fx-shadow-picker></button>
          <div class="nk-color-scroll">${colors}</div>
        </div>

        <div class="nk-row" style="margin-top:8px;"><span class="nk-row-label">الشفافية</span><span class="nk-row-value" id="fx-shadow-op-val">${s.opacity}%</span></div>
        <input type="range" class="ts-slider" id="fx-shadow-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">الضبابية</span><span class="nk-row-value" id="fx-shadow-blur-val">${s.blur}</span></div>
        <input type="range" class="ts-slider" id="fx-shadow-blur" min="0" max="40" value="${s.blur}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">إزاحة X</span><span class="nk-row-value" id="fx-shadow-x-val">${s.x}</span></div>
        <input type="range" class="ts-slider" id="fx-shadow-x" min="-30" max="30" value="${s.x}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">إزاحة Y</span><span class="nk-row-value" id="fx-shadow-y-val">${s.y}</span></div>
        <input type="range" class="ts-slider" id="fx-shadow-y" min="-30" max="30" value="${s.y}" style="width:100%;" />
      `;
    }

    /* ═══ حدود ═══ */
    if (toolId === "outline") {
      const s = t.outline;
      const colors = this.COLORS.map(
        (c) =>
          `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-fx-outline-color="${c}" style="background:${c};"></button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-fx-outline-picker></button>
          <div class="nk-color-scroll">${colors}</div>
        </div>

        <div class="nk-row" style="margin-top:8px;"><span class="nk-row-label">السماكة</span><span class="nk-row-value" id="fx-outline-width-val">${s.width}</span></div>
        <input type="range" class="ts-slider" id="fx-outline-width" min="1" max="12" value="${s.width}" style="width:100%;" />
      `;
    }

    /* ═══ تدرج ═══ */
    if (toolId === "gradient") {
      const s = t.gradient;
      const presets = [
        { name: "ذهبي", c1: "#c9a227", c2: "#ffffff" },
        { name: "نار", c1: "#f59e0b", c2: "#b91c1c" },
        { name: "سماء", c1: "#0891b2", c2: "#7c3aed" },
        { name: "زمرد", c1: "#0d8b5f", c2: "#c9a227" },
        { name: "غروب", c1: "#be185d", c2: "#f59e0b" },
        { name: "فضي", c1: "#e8e8e8", c2: "#888888" },
      ];
      const presetsHTML = presets
        .map(
          (p) =>
            `<button class="nk-grad-chip" data-fx-grad-c1="${p.c1}" data-fx-grad-c2="${p.c2}" title="${p.name}"><span style="background:linear-gradient(135deg, ${p.c1} 0%, ${p.c2} 100%);"></span></button>`
        )
        .join("");

      return `
        <div class="nk-row"><span class="nk-row-label">تدرجات</span></div>
        <div class="nk-grad-scroll">${presetsHTML}</div>

        <div class="nk-row" style="margin-top:10px;"><span class="nk-row-label">اللون الأول</span>
          <div class="nk-color-picker-btn" style="background:${s.color1};width:36px;height:28px;" data-fx-grad-picker1></div>
        </div>
        <div class="nk-row"><span class="nk-row-label">اللون الثاني</span>
          <div class="nk-color-picker-btn" style="background:${s.color2};width:36px;height:28px;" data-fx-grad-picker2></div>
        </div>

        <div class="nk-row"><span class="nk-row-label">الزاوية</span><span class="nk-row-value" id="fx-grad-angle-val">${s.angle}°</span></div>
        <input type="range" class="ts-slider" id="fx-grad-angle" min="0" max="360" value="${s.angle}" style="width:100%;" />
      `;
    }

    /* ═══ توهج ═══ */
    if (toolId === "glow") {
      const s = t.glow;
      const colors = this.COLORS.map(
        (c) =>
          `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-fx-glow-color="${c}" style="background:${c};"></button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-fx-glow-picker></button>
          <div class="nk-color-scroll">${colors}</div>
        </div>

        <div class="nk-row" style="margin-top:8px;"><span class="nk-row-label">القوة</span><span class="nk-row-value" id="fx-glow-int-val">${s.intensity}</span></div>
        <input type="range" class="ts-slider" id="fx-glow-int" min="2" max="40" value="${s.intensity}" style="width:100%;" />
      `;
    }

    /* ═══ شفافية ═══ */
    if (toolId === "opacity") {
      const val = t.opacity;
      const quick = [25, 50, 75, 100];
      return `
        <div class="nk-row"><span class="nk-row-label">الشفافية</span><span class="nk-row-value" id="fx-op-val">${val}%</span></div>
        <input type="range" class="ts-slider" id="fx-op-slider" min="0" max="100" value="${val}" style="width:100%;margin-bottom:10px;" />

        <div class="nk-quick-row">
          ${quick
            .map(
              (v) =>
                `<button class="nk-quick-btn ${val === v ? "active" : ""}" data-fx-op-quick="${v}">${v}%</button>`
            )
            .join("")}
        </div>
      `;
    }

    /* ═══ خلفية نص ═══ */
    if (toolId === "highlight") {
      const s = t.highlight;
      const colors = this.COLORS.map(
        (c) =>
          `<button class="nk-color-dot ${s.color === c ? "active" : ""}" data-fx-hl-color="${c}" style="background:${c};"></button>`
      ).join("");

      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-fx-hl-picker></button>
          <div class="nk-color-scroll">${colors}</div>
        </div>

        <div class="nk-row" style="margin-top:8px;"><span class="nk-row-label">الشفافية</span><span class="nk-row-value" id="fx-hl-op-val">${s.opacity}%</span></div>
        <input type="range" class="ts-slider" id="fx-hl-op" min="0" max="100" value="${s.opacity}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">الحشو</span><span class="nk-row-value" id="fx-hl-pad-val">${s.padding}</span></div>
        <input type="range" class="ts-slider" id="fx-hl-pad" min="0" max="40" value="${s.padding}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-row"><span class="nk-row-label">الاستدارة</span><span class="nk-row-value" id="fx-hl-rad-val">${s.radius}</span></div>
        <input type="range" class="ts-slider" id="fx-hl-rad" min="0" max="30" value="${s.radius}" style="width:100%;" />
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  bindContent(toolId) {
    this.ensure(toolId);
    const t = NoorState.design.text;

    /* ═══ ظل ═══ */
    if (toolId === "shadow") {
      const s = t.shadow;

      const setColor = async (c) => {
        s.color = c;
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      };

      document.querySelectorAll("[data-fx-shadow-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const c = btn.dataset.fxShadowColor;
          if (s.color === c && s.enabled) {
            s.enabled = false;
            document.querySelectorAll("[data-fx-shadow-color]").forEach((b) => b.classList.remove("active"));
            NoorState.pushHistory();
            await NoorRenderer.render();
            return;
          }
          document.querySelectorAll("[data-fx-shadow-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          await setColor(c);
        });
      });

      document.querySelector("[data-fx-shadow-picker]")?.addEventListener("click", () => {
        NoorColors.openPicker(s.color, setColor);
      });

      const op = document.getElementById("fx-shadow-op");
      const opVal = document.getElementById("fx-shadow-op-val");
      op?.addEventListener("input", () => {
        s.opacity = parseInt(op.value);
        s.enabled = true;
        if (opVal) opVal.textContent = s.opacity + "%";
        NoorRenderer.debouncedRender();
      });
      op?.addEventListener("change", () => NoorState.pushHistory());

      const blur = document.getElementById("fx-shadow-blur");
      const blurVal = document.getElementById("fx-shadow-blur-val");
      blur?.addEventListener("input", () => {
        s.blur = parseInt(blur.value);
        s.enabled = true;
        if (blurVal) blurVal.textContent = s.blur;
        NoorRenderer.debouncedRender();
      });
      blur?.addEventListener("change", () => NoorState.pushHistory());

      const x = document.getElementById("fx-shadow-x");
      const xVal = document.getElementById("fx-shadow-x-val");
      x?.addEventListener("input", () => {
        s.x = parseInt(x.value);
        s.enabled = true;
        if (xVal) xVal.textContent = s.x;
        NoorRenderer.debouncedRender();
      });
      x?.addEventListener("change", () => NoorState.pushHistory());

      const y = document.getElementById("fx-shadow-y");
      const yVal = document.getElementById("fx-shadow-y-val");
      y?.addEventListener("input", () => {
        s.y = parseInt(y.value);
        s.enabled = true;
        if (yVal) yVal.textContent = s.y;
        NoorRenderer.debouncedRender();
      });
      y?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ حدود ═══ */
    if (toolId === "outline") {
      const s = t.outline;
      const setColor = async (c) => {
        s.color = c;
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      };

      document.querySelectorAll("[data-fx-outline-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const c = btn.dataset.fxOutlineColor;
          if (s.color === c && s.enabled) {
            s.enabled = false;
            document.querySelectorAll("[data-fx-outline-color]").forEach((b) => b.classList.remove("active"));
            NoorState.pushHistory();
            await NoorRenderer.render();
            return;
          }
          document.querySelectorAll("[data-fx-outline-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          await setColor(c);
        });
      });

      document.querySelector("[data-fx-outline-picker]")?.addEventListener("click", () => {
        NoorColors.openPicker(s.color, setColor);
      });

      const w = document.getElementById("fx-outline-width");
      const wVal = document.getElementById("fx-outline-width-val");
      w?.addEventListener("input", () => {
        s.width = parseInt(w.value);
        s.enabled = true;
        if (wVal) wVal.textContent = s.width;
        NoorRenderer.debouncedRender();
      });
      w?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ تدرج ═══ */
    if (toolId === "gradient") {
      const s = t.gradient;

      document.querySelectorAll("[data-fx-grad-c1]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          s.color1 = btn.dataset.fxGradC1;
          s.color2 = btn.dataset.fxGradC2;
          s.enabled = true;
          const p1 = document.querySelector("[data-fx-grad-picker1]");
          const p2 = document.querySelector("[data-fx-grad-picker2]");
          if (p1) p1.style.background = s.color1;
          if (p2) p2.style.background = s.color2;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      document.querySelector("[data-fx-grad-picker1]")?.addEventListener("click", () => {
        NoorColors.openPicker(s.color1, async (c) => {
          s.color1 = c;
          s.enabled = true;
          const p1 = document.querySelector("[data-fx-grad-picker1]");
          if (p1) p1.style.background = c;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      document.querySelector("[data-fx-grad-picker2]")?.addEventListener("click", () => {
        NoorColors.openPicker(s.color2, async (c) => {
          s.color2 = c;
          s.enabled = true;
          const p2 = document.querySelector("[data-fx-grad-picker2]");
          if (p2) p2.style.background = c;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      const angle = document.getElementById("fx-grad-angle");
      const angleVal = document.getElementById("fx-grad-angle-val");
      angle?.addEventListener("input", () => {
        s.angle = parseInt(angle.value);
        s.enabled = true;
        if (angleVal) angleVal.textContent = s.angle + "°";
        NoorRenderer.debouncedRender();
      });
      angle?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ توهج ═══ */
    if (toolId === "glow") {
      const s = t.glow;
      const setColor = async (c) => {
        s.color = c;
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      };

      document.querySelectorAll("[data-fx-glow-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const c = btn.dataset.fxGlowColor;
          if (s.color === c && s.enabled) {
            s.enabled = false;
            document.querySelectorAll("[data-fx-glow-color]").forEach((b) => b.classList.remove("active"));
            NoorState.pushHistory();
            await NoorRenderer.render();
            return;
          }
          document.querySelectorAll("[data-fx-glow-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          await setColor(c);
        });
      });

      document.querySelector("[data-fx-glow-picker]")?.addEventListener("click", () => {
        NoorColors.openPicker(s.color, setColor);
      });

      const int = document.getElementById("fx-glow-int");
      const intVal = document.getElementById("fx-glow-int-val");
      int?.addEventListener("input", () => {
        s.intensity = parseInt(int.value);
        s.enabled = true;
        if (intVal) intVal.textContent = s.intensity;
        NoorRenderer.debouncedRender();
      });
      int?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ شفافية ═══ */
    if (toolId === "opacity") {
      const slider = document.getElementById("fx-op-slider");
      const val = document.getElementById("fx-op-val");

      slider?.addEventListener("input", () => {
        const v = parseInt(slider.value);
        t.opacity = v;
        if (val) val.textContent = v + "%";
        NoorRenderer.debouncedRender();
      });
      slider?.addEventListener("change", () => NoorState.pushHistory());

      document.querySelectorAll("[data-fx-op-quick]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const v = parseInt(btn.dataset.fxOpQuick);
          t.opacity = v;
          if (slider) slider.value = v;
          if (val) val.textContent = v + "%";
          document.querySelectorAll("[data-fx-op-quick]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ خلفية نص ═══ */
    if (toolId === "highlight") {
      const s = t.highlight;
      const setColor = async (c) => {
        s.color = c;
        s.enabled = true;
        NoorState.pushHistory();
        await NoorRenderer.render();
      };

      document.querySelectorAll("[data-fx-hl-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const c = btn.dataset.fxHlColor;
          if (s.color === c && s.enabled) {
            s.enabled = false;
            document.querySelectorAll("[data-fx-hl-color]").forEach((b) => b.classList.remove("active"));
            NoorState.pushHistory();
            await NoorRenderer.render();
            return;
          }
          document.querySelectorAll("[data-fx-hl-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          await setColor(c);
        });
      });

      document.querySelector("[data-fx-hl-picker]")?.addEventListener("click", () => {
        NoorColors.openPicker(s.color, setColor);
      });

      const op = document.getElementById("fx-hl-op");
      const opVal = document.getElementById("fx-hl-op-val");
      op?.addEventListener("input", () => {
        s.opacity = parseInt(op.value);
        s.enabled = true;
        if (opVal) opVal.textContent = s.opacity + "%";
        NoorRenderer.debouncedRender();
      });
      op?.addEventListener("change", () => NoorState.pushHistory());

      const pad = document.getElementById("fx-hl-pad");
      const padVal = document.getElementById("fx-hl-pad-val");
      pad?.addEventListener("input", () => {
        s.padding = parseInt(pad.value);
        s.enabled = true;
        if (padVal) padVal.textContent = s.padding;
        NoorRenderer.debouncedRender();
      });
      pad?.addEventListener("change", () => NoorState.pushHistory());

      const rad = document.getElementById("fx-hl-rad");
      const radVal = document.getElementById("fx-hl-rad-val");
      rad?.addEventListener("input", () => {
        s.radius = parseInt(rad.value);
        s.enabled = true;
        if (radVal) radVal.textContent = s.radius;
        NoorRenderer.debouncedRender();
      });
      rad?.addEventListener("change", () => NoorState.pushHistory());
    }
  },
};
