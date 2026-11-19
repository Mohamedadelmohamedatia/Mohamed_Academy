import React, { useState } from "react";
import { AlertCircle, Download, Image as ImageIcon, Loader2, Sparkles } from "lucide-react";

type ImageSize = "1K" | "2K" | "4K";
type AspectRatio = "16:9" | "4:3" | "1:1";

const PRESET_PROMPTS = [
  "مخطط معماري يوضح كيف يحجز بايثون المتغيرات في خلايا الذاكرة RAM مع العنوان والاسم والقيمة",
  "خريطة تدفق تفاعلية توضح قرار if / elif / else ومعالجة الأخطاء try / except",
  "رسم تقني يوضح فهارس القائمة List Indexes من 0 إلى len-1 وعملية التقطيع Slicing",
  "مخطط يوضح الفرق بين print() و return داخل استدعاء الدوال في الذاكرة Call Stack",
];

export const AiDiagramStudio: React.FC = () => {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0]);
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const isStandaloneOffline =
      typeof window !== "undefined" &&
      ((window as unknown as { __STANDALONE_OFFLINE__?: boolean }).__STANDALONE_OFFLINE__ ||
        window.location.protocol === "file:");

    if (isStandaloneOffline) {
      setError(
        "تعمل الآن على النسخة المستقلة أوفلاين (جميع الدروس والمختبرات التفاعلية والاختبارات متاحة بالكامل). لتوليد رسومات ذكاء اصطناعي جديدة، يرجى فتح الرابط الحي المتصل بالخادم."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gemini/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageSize, aspectRatio }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذر توليد الرسم التوضيحي.");
      } else {
        setGeneratedUrl(data.imageUrl);
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم أثناء توليد الصورة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-400" />
            <span>استوديو توليد الرسومات والمخططات التقنية عالية الدقة</span>
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            ولّد رسومات ومخططات تعليمية مخصصة لمفاهيم علوم الحاسب بدقة تصل إلى 4K باستخدام نموذج
            <span className="font-mono text-cyan-300 mx-1" dir="ltr">gemini-3-pro-image-preview</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            اختر فكرة جاهزة أو اكتب وصف المخطط التقني المطلوب
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  prompt === preset
                    ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200"
                    : "bg-slate-900/70 border-slate-700/60 text-slate-300 hover:border-slate-500"
                }`}
              >
                مخطط {idx + 1}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-700/70 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            placeholder="صف الرسم التوضيحي أو المخطط البرمجي الذي تريد توليده..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              دقة الصورة (Image Resolution)
            </span>
            <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              {(["1K", "2K", "4K"] as ImageSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setImageSize(sz)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    imageSize === sz
                      ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300 mb-2">
              نسبة الأبعاد (Aspect Ratio)
            </span>
            <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              {(["16:9", "4:3", "1:1"] as AspectRatio[]).map((ar) => (
                <button
                  key={ar}
                  type="button"
                  onClick={() => setAspectRatio(ar)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    aspectRatio === ar
                      ? "bg-slate-800 text-cyan-300 border border-cyan-400/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="gradient-btn-brand inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري توليد المخطط بدقة {imageSize}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توليد المخطط التعليمي ({imageSize})</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-xl bg-amber-950/40 border border-amber-500/40 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-100 space-y-1">
            <p className="font-semibold">تعذر توليد الصورة عبر الذكاء الاصطناعي</p>
            <p className="text-amber-200/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {generatedUrl && (
        <div className="rounded-xl overflow-hidden border border-slate-700/70 bg-slate-950/70">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
            <span className="text-xs text-slate-300">
              المخطط المولّد · الدقة {imageSize} · الأبعاد {aspectRatio}
            </span>
            <a
              href={generatedUrl}
              download={`python-diagram-${imageSize}.png`}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل الصورة</span>
            </a>
          </div>
          <img
            src={generatedUrl}
            alt={prompt}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[480px] object-contain mx-auto"
          />
        </div>
      )}
    </section>
  );
};
