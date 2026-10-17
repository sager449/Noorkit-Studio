/* =========================================
   NoorKit — DB (v2)
   قاعدة بيانات محلية (IndexedDB) - إصلاح الحفظ
   ========================================= */

window.NoorDB = {
  DB_NAME: "noorkit",
  DB_VERSION: 2,
  STORE_NAME: "projects",
  db: null,

  /* ═══════════════════════════════════════════════
     فتح قاعدة البيانات
     ═══════════════════════════════════════════════ */
  async open() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };

      req.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      req.onerror = () => {
        console.error("IndexedDB open failed");
        reject(req.error);
      };
    });
  },

  /* ═══════════════════════════════════════════════
     حفظ مشروع
     ═══════════════════════════════════════════════ */
  async save(design) {
    if (!design) return null;

    try {
      const db = await this.open();

      const project = {
        design: JSON.parse(JSON.stringify(design)),
        updatedAt: Date.now(),
      };

      /* إذا كان هناك id موجود — نحدثه */
      if (design.id) {
        project.id = design.id;
      }

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readwrite");
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.put(project);

        req.onsuccess = () => {
          /* حفظ الـ ID في التصميم الحالي */
          if (!design.id && req.result) {
            design.id = req.result;
          }
          resolve(req.result);
        };

        req.onerror = () => {
          console.error("Save failed:", req.error);
          reject(req.error);
        };
      });
    } catch (err) {
      console.error("NoorDB.save failed:", err);
      return null;
    }
  },

  /* ═══════════════════════════════════════════════
     جلب مشروع واحد
     ═══════════════════════════════════════════════ */
  async get(id) {
    if (!id) return null;

    try {
      const db = await this.open();
      const numericId = parseInt(id);

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readonly");
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.get(numericId);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error("NoorDB.get failed:", err);
      return null;
    }
  },

  /* ═══════════════════════════════════════════════
     جلب كل المشاريع
     ═══════════════════════════════════════════════ */
  async getAll() {
    try {
      const db = await this.open();

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readonly");
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const list = req.result || [];
          list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          resolve(list);
        };

        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error("NoorDB.getAll failed:", err);
      return [];
    }
  },

  /* ═══════════════════════════════════════════════
     حذف مشروع
     ═══════════════════════════════════════════════ */
  async delete(id) {
    if (!id) return false;

    try {
      const db = await this.open();
      const numericId = parseInt(id);

      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.STORE_NAME, "readwrite");
        const store = tx.objectStore(this.STORE_NAME);
        const req = store.delete(numericId);

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error("NoorDB.delete failed:", err);
      return false;
    }
  },
};
