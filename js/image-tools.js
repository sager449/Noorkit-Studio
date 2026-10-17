/* =========================================
   NoorKit — Image Tools (v1)
   أدوات تبويب الصور — فوق الورقة
   ========================================= */

window.NoorImageTools = {
  currentImageId: null,

  renderContent(toolId) {
    const d = NoorState.design;
    const images = d.images || [];

    /* ═══ رفع ═══ */
    if (toolId === "image-upload") {
      return `
        <div style="padding:16px;text-align:center;">
          <p style="color:#b0b0b0;font-size:13px;margin:0 0 12px;">اختر صورة من جهازك</p>
          <input type="file" id="img-upload-input" accept="image/*" style="display:none;" />
          <button id="img-upload-btn" style="background:#ffffff;color:#111;border:none;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;">
            📷 اختيار صورة
          </button>
        </div>
      `;
    }

    /* ═══ تدوير ═══ */
    if (toolId === "image-rotate") {
      if (images.length === 0) {
        return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">لا توجد صور — ارفع صورة أولاً</p>`;
      }

      const imgList = images
        .map(
          (img, i) =>
            `<button class="nk-img-select ${this.currentImageId === img.id ? "active" : ""}" data-img-select="${img.id}">
              <img src="${img.src}" alt="صورة ${i + 1}" style="width:100%;height:100%;object-fit:cover;" />
            </button>`
        )
        .join("");

      const current = images.find((i) => i.id === this.currentImageId) || images[0];
      const rot = current?.rotation || 0;

      return `
        <div class="nk-row"><span class="nk-row-label">الصورة</span></div>
        <div class="nk-img-scroll">${imgList}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">التدوير</span>
          <span class="nk-row-value" id="img-rot-val">${rot}°</span>
        </div>
        <input type="range" class="ts-slider" id="img-rot-slider" min="-180" max="180" value="${rot}" style="width:100%;margin-bottom:8px;" />

        <div class="nk-quick-row">
          <button class="nk-quick-btn" data-img-rot="0">0°</button>
          <button class="nk-quick-btn" data-img-rot="90">90°</button>
          <button class="nk-quick-btn" data-img-rot="180">180°</button>
          <button class="nk-quick-btn" data-img-rot="-90">-90°</button>
        </div>
      `;
    }

    /* ═══ شفافية ═══ */
    if (toolId === "image-opacity") {
      if (images.length === 0) {
        return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">لا توجد صور</p>`;
      }

      const imgList = images
        .map(
          (img, i) =>
            `<button class="nk-img-select ${this.currentImageId === img.id ? "active" : ""}" data-img-select="${img.id}">
              <img src="${img.src}" alt="صورة ${i + 1}" style="width:100%;height:100%;object-fit:cover;" />
            </button>`
        )
        .join("");

      const current = images.find((i) => i.id === this.currentImageId) || images[0];
      const op = current?.opacity ?? 100;

      return `
        <div class="nk-row"><span class="nk-row-label">الصورة</span></div>
        <div class="nk-img-scroll">${imgList}</div>

        <div class="nk-row" style="margin-top:10px;">
          <span class="nk-row-label">الشفافية</span>
          <span class="nk-row-value" id="img-op-val">${op}%</span>
        </div>
        <input type="range" class="ts-slider" id="img-op-slider" min="0" max="100" value="${op}" style="width:100%;" />
      `;
    }

    /* ═══ حذف ═══ */
    if (toolId === "image-delete") {
      if (images.length === 0) {
        return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">لا توجد صور</p>`;
      }

      const imgList = images
        .map(
          (img, i) =>
            `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
              <img src="${img.src}" alt="صورة ${i + 1}" style="width:50px;height:50px;object-fit:cover;background:#2a2a2a;" />
              <span style="flex:1;color:#e8e8e8;font-size:12px;font-weight:600;">صورة ${i + 1}</span>
              <button class="nk-del-img" data-del-img="${img.id}" style="background:#ff4d4d;color:#fff;border:none;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">حذف</button>
            </div>`
        )
        .join("");

      return `
        <div class="nk-row"><span class="nk-row-label">الصور (${images.length})</span></div>
        ${imgList}
      `;
    }

    return `<p style="padding:20px;text-align:center;color:#666;font-size:13px;">قريباً</p>`;
  },

  bindContent(toolId) {
    const d = NoorState.design;
    const images = d.images || [];

    /* ═══ رفع ═══ */
    if (toolId === "image-upload") {
      const input = document.getElementById("img-upload-input");
      const btn = document.getElementById("img-upload-btn");

      btn?.addEventListener("click", () => input?.click());

      input?.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (ev) => {
          const img = new Image();
          img.onload = async () => {
            /* أبعاد الصورة الأولية (الربع من العرض) */
            const baseSize = Math.min(d.width, d.height) * 0.4;
            const ratio = img.width / img.height;
            const w = ratio >= 1 ? baseSize : baseSize * ratio;
            const h = ratio >= 1 ? baseSize / ratio : baseSize;

            if (!d.images) d.images = [];

            d.images.push({
              id: "img_" + Date.now(),
              src: ev.target.result,
              x: (d.width - w) / 2,
              y: (d.height - h) / 2,
              width: w,
              height: h,
              rotation: 0,
              opacity: 100,
            });

            NoorState.pushHistory();
            await NoorRenderer.render();

            if (typeof window.showToast === "function") {
              window.showToast("تمت إضافة الصورة");
            }
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    /* ═══ تدوير ═══ */
    if (toolId === "image-rotate") {
      /* اختيار صورة */
      document.querySelectorAll("[data-img-select]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentImageId = btn.dataset.imgSelect;
          const content = document.getElementById("nk-mini-content");
          if (content) {
            content.innerHTML = this.renderContent(toolId);
            this.bindContent(toolId);
          }
        });
      });

      const current = images.find((i) => i.id === this.currentImageId) || images[0];
      if (!current) return;

      const slider = document.getElementById("img-rot-slider");
      const val = document.getElementById("img-rot-val");

      slider?.addEventListener("input", () => {
        const v = parseInt(slider.value);
        current.rotation = v;
        if (val) val.textContent = v + "°";
        NoorRenderer.debouncedRender();
      });
      slider?.addEventListener("change", () => NoorState.pushHistory());

      document.querySelectorAll("[data-img-rot]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const v = parseInt(btn.dataset.imgRot);
          current.rotation = v;
          if (slider) slider.value = v;
          if (val) val.textContent = v + "°";
          NoorState.pushHistory();
          await NoorRenderer.render();
        });
      });
    }

    /* ═══ شفافية ═══ */
    if (toolId === "image-opacity") {
      document.querySelectorAll("[data-img-select]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentImageId = btn.dataset.imgSelect;
          const content = document.getElementById("nk-mini-content");
          if (content) {
            content.innerHTML = this.renderContent(toolId);
            this.bindContent(toolId);
          }
        });
      });

      const current = images.find((i) => i.id === this.currentImageId) || images[0];
      if (!current) return;

      const slider = document.getElementById("img-op-slider");
      const val = document.getElementById("img-op-val");

      slider?.addEventListener("input", () => {
        const v = parseInt(slider.value);
        current.opacity = v;
        if (val) val.textContent = v + "%";
        NoorRenderer.debouncedRender();
      });
      slider?.addEventListener("change", () => NoorState.pushHistory());
    }

    /* ═══ حذف ═══ */
    if (toolId === "image-delete") {
      document.querySelectorAll("[data-del-img]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.delImg;
          d.images = (d.images || []).filter((i) => i.id !== id);
          NoorState.pushHistory();
          await NoorRenderer.render();

          const content = document.getElementById("nk-mini-content");
          if (content) {
            content.innerHTML = this.renderContent(toolId);
            this.bindContent(toolId);
          }

          if (typeof window.showToast === "function") {
            window.showToast("تم حذف الصورة");
          }
        });
      });
    }
  },
};
