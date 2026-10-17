/* =========================================
   NoorKit — Text Tools (v1)
   أدوات تبويب النص
   ========================================= */

window.NoorTextTools = {
  renderContent(toolId) {
    const d = NoorState.design;

    /* ═══ الخط ═══ */
    if (toolId === "font") {
      const fonts = NoorFonts.list
        .map(
          (f) =>
            `<button class="nk-font-chip ${d.text.fontId === f.id ? "active" : ""}" data-font-id="${f.id}" style="font-family:${f.family};">${f.name}</button>`
        )
        .join("");
      return `
        <div class="nk-row"><span class="nk-row-label">الخط</span></div>
        <div class="nk-font-scroll">${fonts}</div>
      `;
    }

    /* ═══ الحجم ═══ */
    if (toolId === "size") {
      return `
        <div class="nk-row"><span class="nk-row-label">حجم الخط</span><span class="nk-row-value" id="text-size-val">${d.text.size}</span></div>
        <input type="range" class="ts-slider" id="text-size-slider" min="10" max="999" value="${d.text.size}" style="width:100%;margin-bottom:10px;" />
        <div class="nk-size-row">
          <button class="nk-size-btn" data-size-action="minus">−</button>
          <input type="number" id="text-size-num" value="${d.text.size}" min="10" max="999" style="flex:1;padding:10px;background:#2a2a2a;color:#fff;border:none;text-align:center;font-family:inherit;font-weight:700;font-size:16px;" />
          <button class="nk-size-btn" data-size-action="plus">+</button>
        </div>
      `;
    }

    /* ═══ اللون ═══ */
    if (toolId === "color") {
      const colors = NoorColors.renderSwatches(d.text.color, "text-color");
      return `
        <div class="nk-row"><span class="nk-row-label">اللون</span></div>
        <div class="nk-color-row">
          <button class="nk-color-picker-btn" data-text-color-picker></button>
          <div class="nk-color-scroll">${colors}</div>
        </div>
      `;
    }

    /* ═══ المحاذاة ═══ */
    if (toolId === "align") {
      return `
        <div class="nk-row"><span class="nk-row-label">المحاذاة</span></div>
        <div class="nk-align-row">
          <button class="nk-align-btn ${d.text.align === "right" ? "active" : ""}" data-align="right">يمين</button>
          <button class="nk-align-btn ${d.text.align === "center" ? "active" : ""}" data-align="center">وسط</button>
          <button class="nk-align-btn ${d.text.align === "left" ? "active" : ""}" data-align="left">يسار</button>
        </div>
      `;
    }

    /* ═══ التباعد ═══ */
    if (toolId === "line-height") {
      const lh = d.text.lineHeight || 1.8;
      const quick = [1.2, 1.5, 1.8, 2.2, 2.8];
      return `
        <div class="nk-row"><span class="nk-row-label">تباعد الأسطر</span><span class="nk-row-value" id="text-lh-val">${lh.toFixed(1)}</span></div>
        <input type="range" class="ts-slider" id="text-lh-slider" min="1" max="3" step="0.1" value="${lh}" style="width:100%;margin-bottom:10px;" />
        <div class="nk-quick-row">
          ${quick
            .map(
              (v) =>
                `<button class="nk-quick-btn ${Math.abs(lh - v) < 0.05 ? "active" : ""}" data-lh-quick="${v}">${v}</button>`
            )
            .join("")}
        </div>
      `;
    }

    /* ═══ الحركة ═══ */
    if (toolId === "move") {
      const rotation = d.ayah.rotation || 0;
      return `
        <div class="nk-row"><span class="nk-row-label">الحركة</span></div>
        <div class="nk-move-grid">
          <div class="nk-move-col">
            <button class="nk-arrow-btn" data-move="up">↑</button>
            <div class="nk-arrow-mid">
              <button class="nk-arrow-btn" data-move="left">←</button>
              <button class="nk-arrow-btn center" data-move="center">⊙</button>
              <button class="nk-arrow-btn" data-move="right">→</button>
            </div>
            <button class="nk-arrow-btn" data-move="down">↓</button>
          </div>
          <div class="nk-rotate-col">
            <div class="nk-row"><span class="nk-row-label">التدوير</span><span class="nk-row-value" id="text-rotate-val">${rotation}°</span></div>
            <input type="range" class="ts-slider" id="text-rotate" min="-360" max="360" value="${rotation}" style="width:100%;" />
          </div>
        </div>
      `;
    }

    /* ═══ تحرير النص ═══ */
    if (toolId === "edit-text") {
      return `
        <div class="nk-row"><span class="nk-row-label">نص التصميم</span></div>
        <textarea id="text-edit-area" placeholder="اكتب النص هنا..." style="width:100%;min-height:100px;padding:10px;background:#2a2a2a;color:#fff;border:none;font-family:inherit;font-size:14px;font-weight:600;resize:none;margin-bottom:10px;box-sizing:border-box;">${d.ayah.text || ""}</textarea>
        <button id="text-edit-save" style="width:100%;padding:12px;background:#ffffff;color:#111;border:none;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;">تطبيق</button>
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  bindContent(toolId) {
    const d = NoorState.design;

    /* ═══ الخط ═══ */
    if (toolId === "font") {
      document.querySelectorAll("[data-font-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          document.querySelectorAll("[data-font-id]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          d.text.fontId = btn.dataset.fontId;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ الحجم ═══ */
    if (toolId === "size") {
      const slider = document.getElementById("text-size-slider");
      const num = document.getElementById("text-size-num");
      const val = document.getElementById("text-size-val");

      const update = async (v) => {
        const c = Math.max(10, Math.min(999, parseInt(v) || 64));
        d.text.size = c;
        if (slider) slider.value = c;
        if (num) num.value = c;
        if (val) val.textContent = c;
        await NoorRenderer.render();
      };

      slider?.addEventListener("input", () => {
        const v = parseInt(slider.value);
        d.text.size = v;
        if (num) num.value = v;
        if (val) val.textContent = v;
        NoorRenderer.debouncedRender();
      });
      slider?.addEventListener("change", () => NoorState.pushHistory());

      num?.addEventListener("change", async () => {
        await update(num.value);
        NoorState.pushHistory();
      });

      document.querySelectorAll("[data-size-action]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const cur = d.text.size || 64;
          const step = cur < 100 ? 4 : cur < 300 ? 10 : 20;
          const next = btn.dataset.sizeAction === "plus" ? cur + step : cur - step;
          await update(next);
          NoorState.pushHistory();
        });
      });
    }

    /* ═══ اللون ═══ */
    if (toolId === "color") {
      document.querySelectorAll("[data-text-color]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          document.querySelectorAll("[data-text-color]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          d.text.color = btn.dataset.textColor;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      document.querySelector("[data-text-color-picker]")?.addEventListener("click", () => {
        NoorColors.openPicker(d.text.color, async (c) => {
          d.text.color = c;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ المحاذاة ═══ */
    if (toolId === "align") {
      document.querySelectorAll("[data-align]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          document.querySelectorAll("[data-align]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          d.text.align = btn.dataset.align;
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ التباعد ═══ */
    if (toolId === "line-height") {
      const slider = document.getElementById("text-lh-slider");
      const val = document.getElementById("text-lh-val");

      slider?.addEventListener("input", () => {
        const v = parseFloat(slider.value);
        d.text.lineHeight = v;
        if (val) val.textContent = v.toFixed(1);
        NoorRenderer.debouncedRender();
      });
      slider?.addEventListener("change", () => NoorState.pushHistory());

      document.querySelectorAll("[data-lh-quick]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const v = parseFloat(btn.dataset.lhQuick);
          d.text.lineHeight = v;
          if (slider) slider.value = v;
          if (val) val.textContent = v.toFixed(1);
          document.querySelectorAll("[data-lh-quick]").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ الحركة ═══ */
    if (toolId === "move") {
      const step = 20;

      document.querySelectorAll("[data-move]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const dir = btn.dataset.move;
          if (dir === "up") d.ayah.y = (d.ayah.y || d.height / 2) - step;
          if (dir === "down") d.ayah.y = (d.ayah.y || d.height / 2) + step;
          if (dir === "left") d.ayah.x = (d.ayah.x || d.width / 2) - step;
          if (dir === "right") d.ayah.x = (d.ayah.x || d.width / 2) + step;
          if (dir === "center") {
            d.ayah.x = d.width / 2;
            d.ayah.y = d.height / 2;
          }
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });

      const rot = document.getElementById("text-rotate");
      const rotVal = document.getElementById("text-rotate-val");

      rot?.addEventListener("input", () => {
        const v = parseInt(rot.value);
        d.ayah.rotation = v;
        if (rotVal) rotVal.textContent = v + "°";
        NoorRenderer.debouncedRender();
      });
      rot?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ تحرير النص ═══ */
    if (toolId === "edit-text") {
      document.getElementById("text-edit-save")?.addEventListener("click", async () => {
        const area = document.getElementById("text-edit-area");
        if (!area) return;
        d.ayah.text = area.value;
        NoorState.pushHistory();
        await NoorRenderer.render();
        if (typeof window.showToast === "function") {
          window.showToast("تم تحديث النص");
        }
      });
    }
  },
};
