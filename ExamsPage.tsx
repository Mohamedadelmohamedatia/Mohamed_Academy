import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { CHAPTERS, CHAPTER_EXAMS } from "../data/curriculumIndex";
import { ChapterExam, StudentProgress } from "../types/curriculum";

interface ExamsPageProps {
  progress: StudentProgress;
  onSaveExam: (
    examId: string,
    score: number,
    total: number,
    answers: Record<string, number>
  ) => void;
}

export const ExamsPage: React.FC<ExamsPageProps> = ({ progress, onSaveExam }) => {
  const [activeExamId, setActiveExamId] = useState<string | null>(null);

  const activeExam = activeExamId
    ? CHAPTER_EXAMS.find((e) => e.id === activeExamId) ?? null
    : null;

  if (activeExam) {
    return (
      <ExamRunner
        exam={activeExam}
        savedResult={progress.examScores[activeExam.id]}
        onSaveExam={onSaveExam}
        onBack={() => setActiveExamId(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">الاختبارات النهائية للفصول</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
          اختبر استيعابك الكامل لكل فصل عبر 5 اختبارات نهائية (12 سؤالاً لكل فصل) تحاكي أسئلة
          الامتحانات الجامعية مع تصحيح فوري وشرح تفصيلي لكل إجابة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHAPTER_EXAMS.map((exam) => {
          const chapter = CHAPTERS.find((c) => c.id === exam.chapterId);
          const record = progress.examScores[exam.id];

          return (
            <div
              key={exam.id}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-bold">
                    الفصل {chapter?.number} · محاضرة {chapter?.lectureNumber}
                  </span>
                  {record ? (
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        record.passed ? "text-emerald-300" : "text-amber-300"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="tabular-nums">
                        الدرجة: {record.score}/{record.total} (
                        {Math.round((record.score / record.total) * 100)}%)
                      </span>
                    </span>
                  ) : (
                    <span className="text-slate-400">لم يُؤدَّ بعد</span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white">{exam.titleAr}</h2>
                <p className="text-xs font-mono text-slate-400" dir="ltr">
                  {exam.titleEn}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{exam.description}</p>
              </div>

              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-cyan-400" />
                    {exam.questions.length} سؤالاً
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-violet-400" />
                    {exam.durationMinutes} دقيقة
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    درجة النجاح: {exam.passingScore}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveExamId(exam.id)}
                  className="gradient-btn-brand w-full py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
                >
                  {record ? "مراجعة أو إعادة الاختبار" : "بدء الاختبار النهائي"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ExamRunnerProps {
  exam: ChapterExam;
  savedResult?: {
    score: number;
    total: number;
    passed: boolean;
    answers: Record<string, number>;
  };
  onSaveExam: (
    examId: string,
    score: number,
    total: number,
    answers: Record<string, number>
  ) => void;
  onBack: () => void;
}

const ExamRunner: React.FC<ExamRunnerProps> = ({
  exam,
  savedResult,
  onSaveExam,
  onBack,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>(savedResult?.answers ?? {});
  const [submitted, setSubmitted] = useState(Boolean(savedResult));

  const score = exam.questions.reduce(
    (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
    0
  );
  const pct = Math.round((score / exam.questions.length) * 100);
  const passed = pct >= exam.passingScore;

  const handleSubmit = () => {
    setSubmitted(true);
    onSaveExam(exam.id, score, exam.questions.length, answers);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-cyan-300 hover:underline cursor-pointer"
          >
            ← العودة إلى قائمة الاختبارات
          </button>
          <h1 className="text-2xl font-extrabold text-white">{exam.titleAr}</h1>
          <p className="text-xs text-slate-400 tabular-nums">
            {exam.questions.length} سؤالاً · درجة النجاح {exam.passingScore}%
          </p>
        </div>

        <div className="flex items-center gap-3">
          {submitted && (
            <div
              className={`px-4 py-2 rounded-xl border text-sm font-bold tabular-nums ${
                passed
                  ? "bg-emerald-500/15 border-emerald-400/50 text-emerald-200"
                  : "bg-amber-500/15 border-amber-400/50 text-amber-200"
              }`}
            >
              النتيجة: {score}/{exam.questions.length} ({pct}%) · {passed ? "ناجح" : "يحتاج مراجعة"}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة الاختبار</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {exam.questions.map((q, idx) => {
          const selected = answers[q.id];
          const right = selected === q.correctIndex;

          return (
            <div key={q.id} className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-cyan-300 font-semibold tabular-nums">
                    سؤال {idx + 1} من {exam.questions.length}
                  </span>
                  <h3 className="text-base font-bold text-white leading-relaxed">{q.question}</h3>
                </div>
                {submitted && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg shrink-0 ${
                      right
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {right ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{right ? "صحيح" : "خطأ"}</span>
                  </span>
                )}
              </div>

              {q.codeSnippet && (
                <pre
                  dir="ltr"
                  className="rounded-xl bg-[#070b17] border border-slate-800 p-3.5 font-mono text-xs sm:text-sm text-cyan-200 overflow-x-auto leading-6"
                >
                  {q.codeSnippet}
                </pre>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt, oIdx) => {
                  const chosen = selected === oIdx;
                  const isCorrectOpt = oIdx === q.correctIndex;
                  let cls =
                    "bg-slate-900/75 border-slate-700/60 text-slate-200 hover:border-slate-500";
                  if (submitted) {
                    if (isCorrectOpt)
                      cls = "bg-emerald-500/15 border-emerald-400/60 text-emerald-100";
                    else if (chosen) cls = "bg-rose-500/15 border-rose-400/60 text-rose-100";
                    else cls = "bg-slate-950/60 border-slate-800 text-slate-400";
                  } else if (chosen) {
                    cls = "bg-cyan-500/20 border-cyan-400 text-white";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((p) => ({ ...p, [q.id]: oIdx }))}
                      className={`text-right px-4 py-3 rounded-xl border text-sm transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="rounded-xl bg-violet-950/35 border border-violet-500/30 p-3.5 text-sm text-slate-200">
                  <span className="font-bold text-violet-300 ml-1">التفسير:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm text-slate-300 tabular-nums">
            أجبت عن {Object.keys(answers).length} من {exam.questions.length} سؤال
          </span>
          <button
            type="button"
            disabled={Object.keys(answers).length === 0}
            onClick={handleSubmit}
            className="gradient-btn-brand px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 cursor-pointer"
          >
            اعتماد الاختبار وعرض النتيجة
          </button>
        </div>
      )}
    </div>
  );
};
