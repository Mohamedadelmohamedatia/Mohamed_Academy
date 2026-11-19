import React, { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, Trash2, User, X } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface AiTutorDrawerProps {
  open: boolean;
  onClose: () => void;
  lessonContext?: string;
  lessonTitle?: string;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  open,
  onClose,
  lessonContext,
  lessonTitle,
}) => {
  const [model, setModel] = useState<"gemini-4-hydrogen" | "gemini-3.1-flash-lite">(
    "gemini-4-hydrogen"
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "أهلاً بك! أنا المساعد الأكاديمي لمنهج بايثون لطلاب تكنولوجيا المعلومات. اسألني عن أي مفهوم أو كود أو مثال وسأشرحه لك خطوة بخطوة.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!open) return null;

  const quickQuestions = [
    "اشرح لي هذا الدرس ببساطة مع مثال إضافي",
    "ما أشهر الأخطاء التي يقع فيها الطلاب في هذا الموضوع؟",
    "قارن لي بين return و print() في بايثون",
  ];

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");

    const isStandaloneOffline =
      typeof window !== "undefined" &&
      ((window as unknown as { __STANDALONE_OFFLINE__?: boolean }).__STANDALONE_OFFLINE__ ||
        window.location.protocol === "file:");

    if (isStandaloneOffline) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "تعمل الآن على النسخة المستقلة أوفلاين (جميع الدروس والأمثلة والاختبارات والمختبرات متاحة بالكامل). لاستخدام المساعد الذكي المباشر، يرجى فتح الرابط الحي المتصل بالإنترنت.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          model,
          lessonContext,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: data.error || "تعذر الحصول على رد من المساعد." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "حدث خطأ في الاتصال بالخادم. يرجى المحاولة مجدداً." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg h-full bg-[#070d1e] border-r border-slate-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0a1228]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-btn-brand flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">المساعد الأكاديمي الذكي</h3>
              <p className="text-xs text-slate-400 truncate max-w-[230px]">
                {lessonTitle ? `سياق: ${lessonTitle}` : "منهج بايثون · تكنولوجيا المعلومات"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    role: "model",
                    text: "تم بدء محادثة جديدة. كيف أساعدك في دروس بايثون اليوم؟",
                  },
                ])
              }
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="إغلاق المساعد"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-400">نموذج الشرح:</span>
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800" dir="ltr">
            <button
              type="button"
              onClick={() => setModel("gemini-4-hydrogen")}
              className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                model === "gemini-4-hydrogen"
                  ? "bg-cyan-500/20 text-cyan-200 border border-cyan-400/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              gemini-4-hydrogen
            </button>
            <button
              type="button"
              onClick={() => setModel("gemini-3.1-flash-lite")}
              className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer ${
                model === "gemini-3.1-flash-lite"
                  ? "bg-violet-500/20 text-violet-200 border border-violet-400/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3.1-flash-lite
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  m.role === "user"
                    ? "bg-violet-500/25 text-violet-200"
                    : "bg-cyan-500/20 text-cyan-300"
                }`}
              >
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-violet-600/25 border border-violet-400/30 text-white"
                    : "bg-slate-900/90 border border-slate-800 text-slate-100"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-cyan-300 px-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري صياغة الشرح...</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 bg-slate-950/50">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-4 border-t border-slate-800 bg-[#0a1228] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عن أي سطر برمجي أو قاعدة في المنهج..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="gradient-btn-brand p-2.5 rounded-xl text-white disabled:opacity-40 cursor-pointer"
            aria-label="إرسال"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
