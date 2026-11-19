import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Pause,
  Play,
  RotateCcw,
  StepForward,
  Terminal,
} from "lucide-react";
import { VisualLabType } from "../types/curriculum";

interface InteractiveVisualLabProps {
  labType: VisualLabType;
  title: string;
}

export const InteractiveVisualLab: React.FC<InteractiveVisualLabProps> = ({ labType, title }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400">
              مختبر بصري تفاعلي لمحاكاة سلوك مفسر بايثون خطوة بخطوة
            </p>
          </div>
        </div>
      </div>

      {renderLabBody(labType)}
    </div>
  );
};

function renderLabBody(labType: VisualLabType): React.ReactNode {
  switch (labType) {
    case "colab-print":
      return <ColabPrintLab />;
    case "memory-variables":
      return <MemoryVariablesLab />;
    case "precedence-input":
      return <PrecedenceInputLab />;
    case "try-operators-logic":
      return <TryOperatorsLogicLab />;
    case "flowchart-if-else":
      return <FlowchartIfElseLab />;
    case "elif-nested":
      return <ElifNestedLab />;
    case "while-loop":
      return <WhileLoopLab />;
    case "for-range":
      return <ForRangeLab />;
    case "nested-break-continue":
      return <NestedBreakContinueLab />;
    case "list-indexing":
      return <ListIndexingLab />;
    case "list-slicing-methods":
      return <ListSlicingMethodsLab />;
    case "string-slicing-loops":
      return <StringSlicingLoopsLab />;
    case "function-structure":
      return <FunctionStructureLab />;
    case "function-arguments":
      return <FunctionArgumentsLab />;
    case "return-vs-print":
      return <ReturnVsPrintLab />;
    default:
      return <ColabPrintLab />;
  }
}

/* 1. L2-1: Google Colab & print() + Add Two Numbers */
const ColabPrintLab: React.FC = () => {
  const [step, setStep] = useState(0);
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(8);
  const [playing, setPlaying] = useState(false);

  const steps = [
    { label: "Start", desc: "بدء تنفيذ الخلية في بيئة Google Colab السحابية.", code: "# Start Algorithm" },
    { label: "Read num1", desc: `إسناد القيمة الأولى إلى المتغير num1 = ${num1}`, code: `num1 = ${num1}` },
    { label: "Read num2", desc: `إسناد القيمة الثانية إلى المتغير num2 = ${num2}`, code: `num2 = ${num2}` },
    { label: "sum = num1 + num2", desc: `جمع القيمتين وحفظ الناتج ${num1 + num2} في المتغير sum`, code: `sum = num1 + num2  # ${num1 + num2}` },
    { label: "print(sum)", desc: `طباعة النتيجة النهائية على الشاشة: ${num1 + num2}`, code: `print("Sum =", sum)` },
  ];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => (s + 1 < steps.length ? s + 1 : 0));
    }, 1200);
    return () => clearInterval(t);
  }, [playing, steps.length]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="glass-panel-subtle rounded-xl p-3 flex flex-col gap-1.5">
          <span className="text-xs text-slate-300">المدخل الأول (num1)</span>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(Number(e.target.value) || 0)}
            dir="ltr"
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-cyan-300 text-sm"
          />
        </label>
        <label className="glass-panel-subtle rounded-xl p-3 flex flex-col gap-1.5">
          <span className="text-xs text-slate-300">المدخل الثاني (num2)</span>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(Number(e.target.value) || 0)}
            dir="ltr"
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-cyan-300 text-sm"
          />
        </label>
        <div className="glass-panel-subtle rounded-xl p-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="gradient-btn-brand px-3 py-2 rounded-lg text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? "إيقاف" : "تشغيل تلقائي"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep((s) => (s + 1) % steps.length);
            }}
            className="px-3 py-2 rounded-lg text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>خطوة</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep(0);
            }}
            className="p-2 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Flowchart Pipeline */}
      <div className="bg-slate-950/75 border border-slate-800 rounded-xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between gap-2 min-w-[600px]" dir="ltr">
          {steps.map((st, idx) => {
            const active = idx === step;
            const passed = idx < step;
            return (
              <React.Fragment key={st.label}>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setStep(idx);
                  }}
                  className={`flex-1 rounded-xl p-3 border text-center transition-all cursor-pointer ${
                    active
                      ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10"
                      : passed
                      ? "bg-violet-500/15 border-violet-400/40 text-violet-200"
                      : "bg-slate-900/80 border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="text-[11px] font-mono text-cyan-300 mb-1">Step {idx + 1}</div>
                  <div className="text-xs font-mono font-bold">{st.label}</div>
                </button>
                {idx < steps.length - 1 && (
                  <span className={`font-mono text-sm ${passed ? "text-cyan-400" : "text-slate-600"}`}>
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-2">
          <div className="text-xs text-slate-400">السطر النشط في الخلية</div>
          <pre dir="ltr" className="font-mono text-sm text-cyan-300">
            {steps[step].code}
          </pre>
          <p className="text-sm text-slate-200">{steps[step].desc}</p>
        </div>
        <div className="rounded-xl bg-[#050811] border border-slate-800 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>مخرجات خلية Colab</span>
          </div>
          <div dir="ltr" className="font-mono text-sm text-emerald-300 tabular-nums">
            {step >= 4 ? `Sum = ${num1 + num2}` : "Waiting for print(sum)..."}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 2. L2-2: Memory Variables & Reassignment + Type Matters */
const MemoryVariablesLab: React.FC = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  const states = [
    {
      code: "a = 5",
      aVal: "5",
      aType: "int",
      xVal: "0.2",
      xFormula: "x = 0.2",
      note: "حجز خلية باسم a وتخزين القيمة 5 من النوع int.",
    },
    {
      code: "a = 8",
      aVal: "8",
      aType: "int",
      xVal: "0.2",
      xFormula: "x = 0.2",
      note: "إعادة الإسناد (Reassignment): تم استبدال 5 بالقيمة الجديدة 8 في نفس الخلية a.",
    },
    {
      code: "x = 3 * x * (1 - x)",
      aVal: "8",
      aType: "int",
      xVal: "0.48",
      xFormula: "3 * 0.2 * (1 - 0.2) = 0.48",
      note: "يحسب بايثون الطرف الأيمن أولاً باستخدام القيمة القديمة لـ x (0.2) ثم يحدّث x إلى 0.48.",
    },
    {
      code: 'type("123") vs int("123") + 1',
      aVal: '"123" → 124',
      aType: "str → int",
      xVal: "0.48",
      xFormula: 'int("123") + 1 = 124',
      note: "النوع يهم (Type Matters): النص '123' لا يُجمع حسابياً قبل تحويله الصريح عبر int().",
    },
  ];

  const current = states[step];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {states.map((s, idx) => (
          <button
            key={s.code}
            type="button"
            onClick={() => setStep(idx as 0 | 1 | 2 | 3)}
            dir="ltr"
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
              step === idx
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                : "bg-slate-900/70 border-slate-700/60 text-slate-300 hover:border-slate-500"
            }`}
          >
            {idx + 1}. {s.code}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RAM Cell a */}
        <div className="rounded-xl border border-violet-500/30 bg-slate-950/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>خلية الذاكرة RAM #0x104</span>
            <span className="font-mono text-violet-300" dir="ltr">type: {current.aType}</span>
          </div>
          <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-800" dir="ltr">
            <span className="font-mono text-sm text-slate-300">label: a</span>
            <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums">{current.aVal}</span>
          </div>
        </div>

        {/* RAM Cell x */}
        <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>خلية الذاكرة RAM #0x208</span>
            <span className="font-mono text-cyan-300" dir="ltr">type: float</span>
          </div>
          <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-800" dir="ltr">
            <span className="font-mono text-sm text-slate-300">label: x</span>
            <span className="font-mono text-lg font-bold text-emerald-300 tabular-nums">{current.xVal}</span>
          </div>
          <div className="text-xs font-mono text-slate-400" dir="ltr">{current.xFormula}</div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 text-sm text-slate-200 leading-relaxed">
        {current.note}
      </div>
    </div>
  );
};

/* 3. L2-3: Operator Precedence Tree & input() */
const PrecedenceInputLab: React.FC = () => {
  const [phase, setPhase] = useState(0);
  const [rawInput, setRawInput] = useState("4.5");

  const stages = [
    { expr: "3 * (6 + 2) / 12 - (7 - 5) ** 2 * 3", detail: "التعبير الأصلي: الأقواس () لها الأولوية القصوى" },
    { expr: "3 * 8 / 12 - 2 ** 2 * 3", detail: "الخطوة 1 (Parentheses): حساب (6 + 2) = 8 و (7 - 5) = 2" },
    { expr: "3 * 8 / 12 - 4 * 3", detail: "الخطوة 2 (Power **): حساب 2 ** 2 = 4" },
    { expr: "24 / 12 - 4 * 3  →  2.0 - 12", detail: "الخطوة 3 (Mult & Div من اليسار لليمين): 24/12=2.0 و 4*3=12" },
    { expr: "-10.0", detail: "الخطوة 4 (Subtraction): 2.0 - 12 = -10.0 (لاحظ أن القسمة / تعطي float)" },
  ];

  const parsedNum = Number(rawInput);
  const isValidNum = rawInput.trim() !== "" && !Number.isNaN(parsedNum);

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white">
            تتبع أولوية العمليات الحسابية (PEMDAS) من المحاضرة 2
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPhase((p) => (p + 1) % stages.length)}
              className="gradient-btn-brand px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
            >
              الخطوة التالية ({phase + 1}/{stages.length})
            </button>
            <button
              type="button"
              onClick={() => setPhase(0)}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-200 cursor-pointer"
            >
              إعادة
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-2">
          <div dir="ltr" className="font-mono text-base sm:text-lg text-cyan-300 font-bold tabular-nums">
            {stages[phase].expr}
          </div>
          <p className="text-sm text-slate-300">{stages[phase].detail}</p>
        </div>
      </div>

      {/* input() conversion simulator */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
        <div className="text-sm font-semibold text-white">
          محاكاة التحويل بعد دالة <span className="font-mono text-cyan-300" dir="ltr">input()</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <label className="space-y-1">
            <span className="text-xs text-slate-400">ما يكتبه المستخدم في لوحة المفاتيح:</span>
            <input
              type="text"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              dir="ltr"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-amber-300"
            />
          </label>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3" dir="ltr">
            <div className="text-[11px] font-mono text-slate-400">raw = input()</div>
            <div className="font-mono text-sm text-amber-300">
              "{rawInput}" <span className="text-slate-500">→ str</span>
            </div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3" dir="ltr">
            <div className="text-[11px] font-mono text-slate-400">val = float(raw)</div>
            <div className={`font-mono text-sm ${isValidNum ? "text-emerald-300" : "text-rose-400"}`}>
              {isValidNum ? `${parsedNum} → float` : "ValueError: could not convert string"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 4. L3-1: try/except & Truth Table (and/or/not) */
const TryOperatorsLogicLab: React.FC = () => {
  const [userStr, setUserStr] = useState("forty");
  const [condA, setCondA] = useState(true);
  const [condB, setCondB] = useState(false);

  const parsed = Number(userStr);
  const isNumeric = userStr.trim() !== "" && !Number.isNaN(parsed);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* try / except interactive box */}
      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
        <div className="text-sm font-bold text-white">
          محاكاة مسار <span className="font-mono text-cyan-300" dir="ltr">try / except</span>
        </div>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">أدخل نصاً أو رقماً لاختبار int(x):</span>
          <input
            type="text"
            value={userStr}
            onChange={(e) => setUserStr(e.target.value)}
            dir="ltr"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-white"
          />
        </label>
        <div className="space-y-2 text-xs font-mono" dir="ltr">
          <div
            className={`p-2.5 rounded-lg border ${
              isNumeric
                ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                : "bg-slate-900/60 border-slate-800 text-slate-500"
            }`}
          >
            try: val = int("{userStr}") {isNumeric ? `→ Success (${Math.trunc(parsed)})` : "→ Raises ValueError!"}
          </div>
          <div
            className={`p-2.5 rounded-lg border ${
              !isNumeric
                ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
                : "bg-slate-900/60 border-slate-800 text-slate-500"
            }`}
          >
            except: print("Error, please enter numeric input") {!isNumeric ? "← Executed safely" : "← Skipped"}
          </div>
        </div>
      </div>

      {/* Logical Operators Interactive Truth Evaluator */}
      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
        <div className="text-sm font-bold text-white">مختبر العوامل المنطقية (and · or · not)</div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setCondA((v) => !v)}
            dir="ltr"
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
              condA
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                : "bg-rose-500/20 border-rose-400 text-rose-200"
            }`}
          >
            A = {String(condA)}
          </button>
          <button
            type="button"
            onClick={() => setCondB((v) => !v)}
            dir="ltr"
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border cursor-pointer ${
              condB
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                : "bg-rose-500/20 border-rose-400 text-rose-200"
            }`}
          >
            B = {String(condB)}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs" dir="ltr">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 mb-1">A and B</div>
            <div className={condA && condB ? "text-emerald-300 font-bold" : "text-rose-300 font-bold"}>
              {condA && condB ? "True" : "False"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 mb-1">A or B</div>
            <div className={condA || condB ? "text-emerald-300 font-bold" : "text-rose-300 font-bold"}>
              {condA || condB ? "True" : "False"}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-400 mb-1">not A</div>
            <div className={!condA ? "text-emerald-300 font-bold" : "text-rose-300 font-bold"}>
              {!condA ? "True" : "False"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 5. L3-2: SVG Flowchart if-else with Temperature Slider */
const FlowchartIfElseLab: React.FC = () => {
  const [temp, setTemp] = useState(39);
  const isFever = temp > 38;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <div className="space-y-1">
          <span className="text-sm font-semibold text-white">درجة حرارة المريض (temp)</span>
          <p className="text-xs text-slate-400">حرّك المؤشر لرؤية المسار النشط داخل خريطة التدفق</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={35}
            max={42}
            step={0.5}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-40 accent-cyan-400"
          />
          <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums" dir="ltr">
            {temp}°C
          </span>
        </div>
      </div>

      {/* SVG Flowchart */}
      <div className="bg-slate-950/85 border border-slate-800 rounded-xl p-4 overflow-x-auto">
        <svg viewBox="0 0 640 230" className="w-full max-w-2xl mx-auto h-auto">
          {/* Condition Diamond */}
          <polygon
            points="320,20 430,75 320,130 210,75"
            fill="rgba(14, 165, 233, 0.14)"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text x="320" y="79" textAnchor="middle" fill="#e2e8f0" fontSize="14" fontFamily="monospace">
            temp &gt; 38 ?
          </text>

          {/* True Branch (Left) */}
          <path
            d="M210,75 L120,75 L120,145"
            fill="none"
            stroke={isFever ? "#34d399" : "#334155"}
            strokeWidth={isFever ? "3" : "1.5"}
          />
          <text x="155" y="65" fill={isFever ? "#34d399" : "#64748b"} fontSize="12" fontWeight="bold">
            True (نعم)
          </text>
          <rect
            x="30"
            y="145"
            width="180"
            height="56"
            rx="10"
            fill={isFever ? "rgba(16, 185, 129, 0.2)" : "rgba(15, 23, 42, 0.8)"}
            stroke={isFever ? "#34d399" : "#334155"}
            strokeWidth="2"
          />
          <text x="120" y="178" textAnchor="middle" fill={isFever ? "#a7f3d0" : "#64748b"} fontSize="13" fontFamily="monospace">
            print("Fever detected")
          </text>

          {/* False Branch (Right) */}
          <path
            d="M430,75 L520,75 L520,145"
            fill="none"
            stroke={!isFever ? "#a78bfa" : "#334155"}
            strokeWidth={!isFever ? "3" : "1.5"}
          />
          <text x="465" y="65" fill={!isFever ? "#a78bfa" : "#64748b"} fontSize="12" fontWeight="bold">
            False (لا)
          </text>
          <rect
            x="430"
            y="145"
            width="180"
            height="56"
            rx="10"
            fill={!isFever ? "rgba(139, 92, 246, 0.22)" : "rgba(15, 23, 42, 0.8)"}
            stroke={!isFever ? "#a78bfa" : "#334155"}
            strokeWidth="2"
          />
          <text x="520" y="178" textAnchor="middle" fill={!isFever ? "#ddd6fe" : "#64748b"} fontSize="13" fontFamily="monospace">
            print("Normal temp")
          </text>
        </svg>
      </div>
    </div>
  );
};

/* 6. L3-3: elif vs multiple if Comparator */
const ElifNestedLab: React.FC = () => {
  const [age, setAge] = useState(14);

  const elifOutput = age < 13 ? ["Child"] : age < 20 ? ["Teen"] : ["Adult"];
  const multiIfOutput: string[] = [];
  if (age < 13) multiIfOutput.push("Child");
  if (age < 20) multiIfOutput.push("Teen");
  if (age >= 20) multiIfOutput.push("Adult");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <span className="text-sm font-semibold text-white">
          أدخل العمر (age) لمقارنة سلوك <span className="font-mono text-cyan-300" dir="ltr">elif</span> مع{" "}
          <span className="font-mono text-violet-300" dir="ltr">Multiple if</span>:
        </span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={40}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-40 accent-violet-400"
          />
          <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums" dir="ltr">
            age = {age}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="ltr">
        <div className="rounded-xl bg-slate-950/85 border border-cyan-500/30 p-4 space-y-2">
          <div className="text-xs font-mono text-cyan-300 font-bold">Using if / elif / else</div>
          <pre className="text-xs font-mono text-slate-300 leading-6">
            {`if age < 13: print("Child")\nelif age < 20: print("Teen")\nelse: print("Adult")`}
          </pre>
          <div className="pt-2 border-t border-slate-800 text-xs font-mono text-emerald-300">
            Output: {elifOutput.join(", ")} (شرط واحد فقط يُنفّذ)
          </div>
        </div>

        <div className="rounded-xl bg-slate-950/85 border border-violet-500/30 p-4 space-y-2">
          <div className="text-xs font-mono text-violet-300 font-bold">Using Multiple independent if</div>
          <pre className="text-xs font-mono text-slate-300 leading-6">
            {`if age < 13: print("Child")\nif age < 20: print("Teen")\nif age >= 20: print("Adult")`}
          </pre>
          <div className="pt-2 border-t border-slate-800 text-xs font-mono text-amber-300">
            Output: {multiIfOutput.join(", ")} {multiIfOutput.length > 1 ? "(تنفيذ أكثر من فرع!)" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 7. L4-1: while Loop Stepper (Normal / Zero-iteration / Infinite risk) */
const WhileLoopLab: React.FC = () => {
  const [mode, setMode] = useState<"normal" | "zero" | "infinite">("normal");
  const [stepIdx, setStepIdx] = useState(0);

  const traceMap = {
    normal: [
      { n: 3, out: [], status: "بداية: n = 3 (الشرط n > 0 صحيح)" },
      { n: 2, out: ["3"], status: "طباعة 3 ثم n = n - 1 لتصبح n = 2" },
      { n: 1, out: ["3", "2"], status: "طباعة 2 ثم n = n - 1 لتصبح n = 1" },
      { n: 0, out: ["3", "2", "1"], status: "طباعة 1 ثم n = 0 ← توقف الشرط وطباعة Blastoff!" },
    ],
    zero: [
      { n: 0, out: [], status: "بداية: n = 0. الشرط while n > 0 يعطي False من المرة الأولى (Zero-trip Loop)." },
      { n: 0, out: ["All done!"], status: "لم تدخل الحلقة أبداً، وانتقل التنفيذ مباشرة لما بعد الحلقة." },
    ],
    infinite: [
      { n: 5, out: ["Lather", "Rinse"], status: "تحذير: المتغير n = 5 لا يتغير داخل الحلقة!" },
      { n: 5, out: ["Lather", "Rinse", "Lather", "Rinse"], status: "الشرط n > 0 يبقى True للأبد ← Infinite Loop!" },
    ],
  };

  const frames = traceMap[mode];
  const current = frames[Math.min(stepIdx, frames.length - 1)];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "normal", label: "حالة طبيعية (n = 3)" },
            { id: "zero", label: "حلقة صفرية (n = 0)" },
            { id: "infinite", label: "خطر الحلقة اللانهائية" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id as "normal" | "zero" | "infinite");
                setStepIdx(0);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
                mode === m.id
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                  : "bg-slate-900/70 border-slate-800 text-slate-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setStepIdx((i) => (i + 1) % frames.length)}
          className="gradient-btn-brand px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
        >
          <StepForward className="w-3.5 h-3.5" />
          <span>خطوة تالية ({stepIdx + 1}/{frames.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-950/85 border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>قيمة متغير التكرار</span>
            <span className="font-mono text-cyan-300 font-bold tabular-nums" dir="ltr">
              n = {current.n}
            </span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed">{current.status}</p>
          {mode === "infinite" && (
            <div className="flex items-center gap-2 text-xs text-amber-300 pt-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>يجب تحديث متغير التكرار داخل جسم while لتجنب تعليق البرنامج.</span>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#050811] border border-slate-800 p-4 space-y-2">
          <div className="text-xs text-slate-400">المخرجات المتراكمة</div>
          <div dir="ltr" className="font-mono text-sm text-emerald-300 space-y-1">
            {current.out.length === 0 ? (
              <span className="text-slate-500">(لا توجد مخرجات بعد)</span>
            ) : (
              current.out.map((o, idx) => <div key={idx}>{o}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 8. L4-2: for & range(start, stop, step) Interactive Generator */
const ForRangeLab: React.FC = () => {
  const [start, setStart] = useState(2);
  const [stop, setStop] = useState(11);
  const [step, setStep] = useState(2);

  const values: number[] = [];
  if (step !== 0) {
    let cur = start;
    let guard = 0;
    while ((step > 0 ? cur < stop : cur > stop) && guard < 18) {
      values.push(cur);
      cur += step;
      guard++;
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="glass-panel-subtle rounded-xl p-3 space-y-1">
          <span className="text-xs text-slate-300 font-mono" dir="ltr">start = {start}</span>
          <input
            type="range"
            min={0}
            max={10}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </label>
        <label className="glass-panel-subtle rounded-xl p-3 space-y-1">
          <span className="text-xs text-slate-300 font-mono" dir="ltr">stop = {stop} (غير شامل)</span>
          <input
            type="range"
            min={1}
            max={20}
            value={stop}
            onChange={(e) => setStop(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </label>
        <label className="glass-panel-subtle rounded-xl p-3 space-y-1">
          <span className="text-xs text-slate-300 font-mono" dir="ltr">step = {step}</span>
          <input
            type="range"
            min={1}
            max={5}
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </label>
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3">
        <div dir="ltr" className="font-mono text-sm text-cyan-300">
          for i in range({start}, {stop}, {step}):
        </div>
        <div className="flex flex-wrap gap-2" dir="ltr">
          {values.length === 0 ? (
            <span className="text-xs text-rose-300 font-mono">Empty sequence (0 iterations)</span>
          ) : (
            values.map((v, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg bg-violet-500/15 border border-violet-400/35 font-mono text-sm text-white tabular-nums"
              >
                {v}
              </div>
            ))
          )}
        </div>
        <p className="text-xs text-slate-400">
          لاحظ أن القيمة {stop} لا تدخل ضمن الناتج أبداً لأن دالة range تتوقف قبل stop مباشرة.
        </p>
      </div>
    </div>
  );
};

/* 9. L4-3: Nested Loop & break/continue on "Python" */
const NestedBreakContinueLab: React.FC = () => {
  const [mode, setMode] = useState<"break" | "continue">("break");
  const word = "Python";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-white">
          مقارنة <span className="font-mono text-rose-300" dir="ltr">break</span> مقابل{" "}
          <span className="font-mono text-amber-300" dir="ltr">continue</span> عند الحرف{" "}
          <span className="font-mono text-cyan-300" dir="ltr">'h'</span> في كلمة "Python"
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("break")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer border ${
              mode === "break"
                ? "bg-rose-500/20 border-rose-400 text-rose-200"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            if ch == 'h': break
          </button>
          <button
            type="button"
            onClick={() => setMode("continue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer border ${
              mode === "continue"
                ? "bg-amber-500/20 border-amber-400 text-amber-200"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            if ch == 'h': continue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2" dir="ltr">
        {word.split("").map((ch, idx) => {
          const isH = ch === "h";
          const hIdx = word.indexOf("h");
          const skipped = mode === "break" ? idx >= hIdx : isH;
          return (
            <div
              key={idx}
              className={`rounded-xl p-3 text-center border font-mono ${
                isH
                  ? "bg-rose-500/20 border-rose-400 text-rose-200"
                  : skipped
                  ? "bg-slate-900/40 border-slate-800 text-slate-600 line-through"
                  : "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
              }`}
            >
              <div className="text-lg font-bold">{ch}</div>
              <div className="text-[11px] mt-1">
                {isH ? (mode === "break" ? "BREAK" : "SKIP") : skipped ? "NOT RUN" : "PRINTED"}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-slate-300">
        {mode === "break"
          ? "عند الوصول إلى 'h' توقفت الحلقة تماماً، فطُبعت الأحرف P, y, t فقط."
          : "عند الوصول إلى 'h' تم تخطي دورة واحدة فقط (continue)، واستمرت الحلقة لطباعة o و n."}
      </p>
    </div>
  );
};

/* 10. L5-1: List Indexing & len() Inspector */
const ListIndexingLab: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const temps = [37.0, 38.2, 36.8, 39.1];

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-300">
        اضغط على أي خلية في القائمة <span className="font-mono text-cyan-300" dir="ltr">temps</span> لفحص الفهرس (Index) وطول القائمة:
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" dir="ltr">
        {temps.map((val, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`rounded-xl p-4 border text-center transition-all cursor-pointer ${
              selectedIdx === idx
                ? "bg-cyan-500/20 border-cyan-400 text-white"
                : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-600"
            }`}
          >
            <div className="text-xs font-mono text-cyan-300 mb-1">temps[{idx}]</div>
            <div className="text-xl font-mono font-bold tabular-nums">{val}</div>
            <div className="text-[11px] font-mono text-slate-500 mt-1">neg index: {idx - temps.length}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono text-xs" dir="ltr">
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3">
          <div className="text-slate-400">len(temps)</div>
          <div className="text-base font-bold text-cyan-300 mt-1 tabular-nums">{temps.length}</div>
        </div>
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3">
          <div className="text-slate-400">Selected Expression</div>
          <div className="text-base font-bold text-violet-300 mt-1 tabular-nums">
            temps[{selectedIdx}] == {temps[selectedIdx]}
          </div>
        </div>
        <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3">
          <div className="text-slate-400">Last Valid Index (len - 1)</div>
          <div className="text-base font-bold text-emerald-300 mt-1 tabular-nums">{temps.length - 1}</div>
        </div>
      </div>
    </div>
  );
};

/* 11. L5-2: List Slicing & Methods Sandbox */
const ListSlicingMethodsLab: React.FC = () => {
  const [items, setItems] = useState<number[]>([9, 41, 12, 3, 74, 15]);
  const [sliceStart, setSliceStart] = useState(1);
  const [sliceEnd, setSliceEnd] = useState(4);

  const sliced = items.slice(sliceStart, sliceEnd);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" dir="ltr">
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, 99])}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 cursor-pointer"
          >
            .append(99)
          </button>
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev].sort((a, b) => a - b))}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-violet-500/20 border border-violet-400/40 text-violet-200 cursor-pointer"
          >
            .sort()
          </button>
          <button
            type="button"
            onClick={() => setItems((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/20 border border-amber-400/40 text-amber-200 cursor-pointer"
          >
            .pop()
          </button>
          <button
            type="button"
            onClick={() => setItems([9, 41, 12, 3, 74, 15])}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 text-slate-300 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" dir="ltr">
        {items.map((val, idx) => {
          const inSlice = idx >= sliceStart && idx < sliceEnd;
          return (
            <div
              key={`${idx}-${val}`}
              className={`px-4 py-3 rounded-xl border font-mono text-center min-w-[64px] ${
                inSlice
                  ? "bg-cyan-500/20 border-cyan-400 text-white"
                  : "bg-slate-950/80 border-slate-800 text-slate-400"
              }`}
            >
              <div className="text-[11px] text-slate-400">[{idx}]</div>
              <div className="text-base font-bold tabular-nums">{val}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="glass-panel-subtle rounded-xl p-3 space-y-1">
          <span className="text-xs font-mono text-slate-300" dir="ltr">start = {sliceStart}</span>
          <input
            type="range"
            min={0}
            max={items.length}
            value={sliceStart}
            onChange={(e) => setSliceStart(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </label>
        <label className="glass-panel-subtle rounded-xl p-3 space-y-1">
          <span className="text-xs font-mono text-slate-300" dir="ltr">end = {sliceEnd} (up to but not including)</span>
          <input
            type="range"
            min={0}
            max={items.length}
            value={sliceEnd}
            onChange={(e) => setSliceEnd(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </label>
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3 font-mono text-sm text-emerald-300" dir="ltr">
        t[{sliceStart}:{sliceEnd}] → [{sliced.join(", ")}]
      </div>
    </div>
  );
};

/* 12. L5-3: String Indexing, Slicing & strip() */
const StringSlicingLoopsLab: React.FC = () => {
  const [text, setText] = useState("   fever   ");
  const [stripApplied, setStripApplied] = useState(false);

  const activeText = stripApplied ? text.trim() : text;
  const displayChars = activeText.slice(0, 12).split("");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex-1 min-w-[220px] space-y-1">
          <span className="text-xs text-slate-400">السلسلة النصية الأصلية (جرّب وضع مسافات في البداية والنهاية):</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="ltr"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-sm text-amber-300"
          />
        </label>
        <button
          type="button"
          onClick={() => setStripApplied((s) => !s)}
          className={`px-4 py-2 rounded-xl text-xs font-mono border cursor-pointer mt-5 ${
            stripApplied
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
              : "bg-slate-800 border-slate-700 text-slate-200"
          }`}
        >
          {stripApplied ? "strip() مُطبّقة" : "تطبيق .strip()"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2" dir="ltr">
        {displayChars.map((ch, idx) => (
          <div
            key={idx}
            className="px-3 py-2 rounded-lg bg-slate-950/85 border border-slate-800 text-center font-mono min-w-[44px]"
          >
            <div className="text-[10px] text-cyan-300">{idx}</div>
            <div className="text-base font-bold text-white">{ch === " " ? "␣" : ch}</div>
          </div>
        ))}
      </div>

      <div className="text-xs font-mono text-slate-300 bg-slate-900/70 rounded-xl p-3 border border-slate-800" dir="ltr">
        len("{activeText}") = {activeText.length} · Note: السلاسل النصية Immutable لا تتغير مكانياً بل تُنشئ نسخة جديدة
      </div>
    </div>
  );
};

/* 13. L6-1: Function Store vs Reuse Stepper */
const FunctionStructureLab: React.FC = () => {
  const [phase, setPhase] = useState<"defined" | "called1" | "called2">("defined");

  const logs =
    phase === "defined"
      ? ["(لم يُطبع شيء بعد — بايثون حفظ الدالة greet فقط في الذاكرة)"]
      : phase === "called1"
      ? ["Hello IT Student!", "Welcome to Python"]
      : ["Hello IT Student!", "Welcome to Python", "Hello IT Student!", "Welcome to Python"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPhase("defined")}
          className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
            phase === "defined"
              ? "bg-violet-500/20 border-violet-400 text-violet-200"
              : "bg-slate-900 border-slate-800 text-slate-300"
          }`}
        >
          1. مرحلة التعريف فقط (Store)
        </button>
        <button
          type="button"
          onClick={() => setPhase("called1")}
          className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
            phase === "called1"
              ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
              : "bg-slate-900 border-slate-800 text-slate-300"
          }`}
        >
          2. الاستدعاء الأول greet() (Reuse)
        </button>
        <button
          type="button"
          onClick={() => setPhase("called2")}
          className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
            phase === "called2"
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
              : "bg-slate-900 border-slate-800 text-slate-300"
          }`}
        >
          3. الاستدعاء الثاني greet()
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="ltr">
        <pre className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 font-mono text-xs text-slate-200 leading-6">
          {`def greet():\n    print("Hello IT Student!")\n    print("Welcome to Python")\n\n${
            phase === "defined"
              ? "# No call yet"
              : phase === "called1"
              ? "greet()"
              : "greet()\ngreet()"
          }`}
        </pre>
        <div className="rounded-xl bg-[#050811] border border-slate-800 p-4 space-y-1.5 font-mono text-xs text-emerald-300">
          <div className="text-slate-400 mb-2">Console Output:</div>
          {logs.map((l, idx) => (
            <div key={idx}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 14. L6-2: Function Arguments Binder (Positional / Keyword / Default) */
const FunctionArgumentsLab: React.FC = () => {
  const [argMode, setArgMode] = useState<"default" | "positional" | "keyword">("default");

  const config = {
    default: {
      call: 'greet("Sara")',
      name: '"Sara"',
      msg: '"Good morning" (Default)',
      output: "Good morning Sara",
    },
    positional: {
      call: 'greet("Omar", "Welcome")',
      name: '"Omar" (الموضع 1)',
      msg: '"Welcome" (الموضع 2)',
      output: "Welcome Omar",
    },
    keyword: {
      call: 'greet(msg="Hi", name="Ali")',
      name: '"Ali" (بالاسم name=)',
      msg: '"Hi" (بالاسم msg=)',
      output: "Hi Ali",
    },
  }[argMode];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "default", label: "وسائط افتراضية (Default)" },
          { id: "positional", label: "وسائط موضعية (Positional)" },
          { id: "keyword", label: "وسائط مسماة (Keyword)" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setArgMode(item.id as "default" | "positional" | "keyword")}
            className={`px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer ${
              argMode === item.id
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                : "bg-slate-900 border-slate-800 text-slate-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3" dir="ltr">
        <div className="font-mono text-xs text-slate-400">
          def greet(name, msg="Good morning"):
        </div>
        <div className="font-mono text-sm text-cyan-300 font-bold">Call → {config.call}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Parameter name = </span>
            <span className="text-violet-300">{config.name}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Parameter msg = </span>
            <span className="text-amber-300">{config.msg}</span>
          </div>
        </div>
        <div className="font-mono text-sm text-emerald-300 pt-1">Output: {config.output}</div>
      </div>
    </div>
  );
};

/* 15. L6-3: return vs print() Comparator */
const ReturnVsPrintLab: React.FC = () => {
  const [celsius, setCelsius] = useState(37);
  const fahrenheit = Number(((celsius * 9) / 5 + 32).toFixed(1));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <span className="text-sm font-semibold text-white">درجة الحرارة المئوية (c)</span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={45}
            value={celsius}
            onChange={(e) => setCelsius(Number(e.target.value))}
            className="w-40 accent-cyan-400"
          />
          <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums" dir="ltr">
            {celsius}°C
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="ltr">
        <div className="rounded-xl bg-slate-950/85 border border-rose-500/30 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-300 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>show_fahrenheit(c) — uses print()</span>
          </div>
          <pre className="text-xs font-mono text-slate-300 leading-6">
            {`def show_fahrenheit(c):\n    print((c * 9/5) + 32)\n\nx = show_fahrenheit(${celsius})`}
          </pre>
          <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-rose-200">
            Printed: {fahrenheit} | Stored in x: <span className="font-bold">None</span> (لا يمكن جمعها أو مقارنة قيمتها!)
          </div>
        </div>

        <div className="rounded-xl bg-slate-950/85 border border-emerald-500/30 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>get_fahrenheit(c) — uses return</span>
          </div>
          <pre className="text-xs font-mono text-slate-300 leading-6">
            {`def get_fahrenheit(c):\n    return (c * 9/5) + 32\n\nx = get_fahrenheit(${celsius})`}
          </pre>
          <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-emerald-200">
            Returned to x: <span className="font-bold">{fahrenheit}</span> (قابلة للحساب والمقارنة والقرار!)
          </div>
        </div>
      </div>
    </div>
  );
};
