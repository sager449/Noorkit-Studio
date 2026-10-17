/* =========================================
   NoorKit — Video Exporter (v2)
   تصدير فيديو + استخراج صوت + إزالة صوت
   ========================================= */

window.NoorVideoExporter = {
  ffmpeg: null,
  loaded: false,
  loading: false,

  /* ═══════════════════════════════════════════════
     تحميل FFmpeg (مرة واحدة)
     ═══════════════════════════════════════════════ */
  async load(onProgress) {
    if (this.loaded) return this.ffmpeg;

    if (this.loading) {
      while (!this.loaded) {
        await new Promise((r) => setTimeout(r, 100));
      }
      return this.ffmpeg;
    }

    this.loading = true;

    try {
      onProgress?.("جاري تحميل محرك الفيديو...", 5);

      const { FFmpeg } = await import("https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/index.js");
      const { toBlobURL } = await import("https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/index.js");

      this.ffmpeg = new FFmpeg();

      this.ffmpeg.on("log", ({ message }) => {
        console.log("[FFmpeg]", message);
      });

      const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";

      onProgress?.("جاري تحميل النواة (30MB)...", 15);

      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      this.loaded = true;
      this.loading = false;
      onProgress?.("المحرك جاهز", 100);

      return this.ffmpeg;
    } catch (err) {
      console.error("FFmpeg load failed:", err);
      this.loading = false;
      throw err;
    }
  },

  /* ═══════════════════════════════════════════════
     تصدير فيديو (صورة + صوت → MP4)
     ═══════════════════════════════════════════════ */
  async exportVideo(options) {
    const {
      imageUrl,
      audioBlob,
      quality = "1080p",
      onProgress,
    } = options;

    if (!imageUrl) throw new Error("لا توجد صورة");
    if (!audioBlob) throw new Error("لا يوجد صوت");

    onProgress?.("جاري تحميل المحرك...", 2);
    const ffmpeg = await this.load((msg, p) => onProgress?.(msg, p));

    try {
      /* تحديد الأبعاد */
      const sizes = {
        "720p": { w: 720, h: 1280 },
        "1080p": { w: 1080, h: 1920 },
        "4k": { w: 2160, h: 3840 },
      };
      const size = sizes[quality] || sizes["1080p"];

      onProgress?.("جاري تحضير الملفات...", 10);

      /* تحويل الصورة إلى blob */
      let imageBlob;
      if (imageUrl.startsWith("data:")) {
        imageBlob = this.dataURLtoBlob(imageUrl);
      } else {
        imageBlob = await (await fetch(imageUrl)).blob();
      }

      /* كتابة الملفات */
      await ffmpeg.writeFile("image.png", new Uint8Array(await imageBlob.arrayBuffer()));
      await ffmpeg.writeFile("audio.mp3", new Uint8Array(await audioBlob.arrayBuffer()));

      onProgress?.("جاري معالجة الفيديو...", 20);

      /* FFmpeg command */
      await ffmpeg.exec([
        "-loop", "1",
        "-i", "image.png",
        "-i", "audio.mp3",
        "-c:v", "libx264",
        "-preset", "medium",
        "-tune", "stillimage",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", `scale=${size.w}:${size.h}:force_original_aspect_ratio=decrease,pad=${size.w}:${size.h}:(ow-iw)/2:(oh-ih)/2`,
        "-shortest",
        "-movflags", "+faststart",
        "output.mp4",
      ]);

      onProgress?.("جاري استخراج الفيديو...", 90);

      const data = await ffmpeg.readFile("output.mp4");
      const videoBlob = new Blob([data.buffer], { type: "video/mp4" });

      /* تنظيف */
      await ffmpeg.deleteFile("image.png");
      await ffmpeg.deleteFile("audio.mp3");
      await ffmpeg.deleteFile("output.mp4");

      onProgress?.("تم التصدير", 100);

      return videoBlob;
    } catch (err) {
      console.error("Export failed:", err);
      throw err;
    }
  },

  /* ═══════════════════════════════════════════════
     استخراج الصوت من فيديو
     ═══════════════════════════════════════════════ */
  async extractAudio(videoBlob, onProgress) {
    onProgress?.("جاري تحميل المحرك...", 5);
    const ffmpeg = await this.load((msg, p) => onProgress?.(msg, p));

    try {
      onProgress?.("جاري تحميل الفيديو...", 15);

      await ffmpeg.writeFile("input.mp4", new Uint8Array(await videoBlob.arrayBuffer()));

      onProgress?.("جاري استخراج الصوت...", 30);

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-vn",
        "-acodec", "libmp3lame",
        "-b:a", "192k",
        "output.mp3",
      ]);

      onProgress?.("جاري تجهيز الملف...", 90);

      const data = await ffmpeg.readFile("output.mp3");
      const audioBlob = new Blob([data.buffer], { type: "audio/mp3" });

      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp3");

      onProgress?.("تم الاستخراج", 100);

      return audioBlob;
    } catch (err) {
      console.error("Extract audio failed:", err);
      throw err;
    }
  },

  /* ═══════════════════════════════════════════════
     إزالة الصوت من فيديو
     ═══════════════════════════════════════════════ */
  async removeAudio(videoBlob, onProgress) {
    onProgress?.("جاري تحميل المحرك...", 5);
    const ffmpeg = await this.load((msg, p) => onProgress?.(msg, p));

    try {
      onProgress?.("جاري تحميل الفيديو...", 15);

      await ffmpeg.writeFile("input.mp4", new Uint8Array(await videoBlob.arrayBuffer()));

      onProgress?.("جاري إزالة الصوت...", 30);

      await ffmpeg.exec([
        "-i", "input.mp4",
        "-an",
        "-c:v", "copy",
        "output.mp4",
      ]);

      onProgress?.("جاري تجهيز الملف...", 90);

      const data = await ffmpeg.readFile("output.mp4");
      const resultBlob = new Blob([data.buffer], { type: "video/mp4" });

      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("output.mp4");

      onProgress?.("تمت الإزالة", 100);

      return resultBlob;
    } catch (err) {
      console.error("Remove audio failed:", err);
      throw err;
    }
  },

  /* ═══════════════════════════════════════════════
     تحويل dataURL إلى blob
     ═══════════════════════════════════════════════ */
  dataURLtoBlob(dataURL) {
    const parts = dataURL.split(",");
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  },

  /* ═══════════════════════════════════════════════
     تنزيل ملف
     ═══════════════════════════════════════════════ */
  download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "noorkit-output";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
};
