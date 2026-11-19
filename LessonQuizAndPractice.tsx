import React, { useState } from "react";
import {
  CheckCircle2,
  Code2,
  Eye,
  HelpCircle,
  RotateCcw,
  Terminal,
  XCircle,
} from "lucide-react";
import { McqQuestion, PracticalExercise } from "../types/curriculum";
import { CodeBlockVSCode } from "./CodeBlockVSCode";

interface LessonQuizSectionProps {
  lessonId: string;
  mcqs: McqQuestion[];
  savedQuiz?: { score: number; total: number; answers: Record<string, number> };
  onSaveQuiz: (lessonId: string, score: number, total: number, answers: Record<string, number>) => void;
}

export const LessonQuizSection: React.FC<LessonQuizSectionProps> = ({
  lessonId,
  mcqs,
  savedQuiz,
  onSaveQuiz,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>(savedQuiz?.answers ?? {});
  const [submitted, setSubmitted] = useState(Boolean(savedQuiz));

  const answeredCount = Object.keys(answers).length;
  const score = mcqs.reduce(
    (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
    0
  );

  const handleSelect = (qId: string, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSaveQuiz(lessonId, score, mcqs.length, answers);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">اختبار الفهم (10 أسئلة اختيار من متعدد)</h3>
          <p className="text-xs text-slate-300 mt-1">
            اختر الإجابة الصحيحة لكل سؤال ثم اضغط تصحيح الإجابات لعرض الدرجة والشرح التفصيلي.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {submitted && (
            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-400/40 text-sm font-bold text-cyan-300 tabular-nums">
              النتيجة: {score} / {mcqs.length} ({Math.round((score / mcqs.length) * 100)}%)
            </div>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mcqs.map((q, qIndex) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={q.id} className="glass-panel rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="text-xs text-cyan-300 font-semibold tabular-nums">
                    سؤال {qIndex + 1} من {mcqs.length}
                  </div>
                  <h4 className="text-base font-semibold text-white leading-relaxed">{q.question}</h4>
                </div>
                {submitted && (
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 ${
                      isCorrect
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30"
                        : "bg-rose-500/15 text-rose-300 border border-rose-400/30"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>إجابة صحيحة</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>إجابة خاطئة</span>
                      </>
                    )}
                  </div>
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
                {q.options.map((opt, optIdx) => {
                  const chosen = selected === optIdx;
                  const rightOption = optIdx === q.correctIndex;

                  let styleClass =
                    "bg-slate-900/75 border-slate-700/60 text-slate-200 hover:border-slate-500";
                  if (submitted) {
                    if (rightOption) {
                      styleClass =
                        "bg-emerald-500/15 border-emerald-400/60 text-emerald-100";
                    } else if (chosen && !rightOption) {
                      styleClass =
                        "bg-rose-500/15 border-rose-400/60 text-rose-100";
                    } else {
                      styleClass = "bg-slate-950/60 border-slate-800 text-slate-400";
                    }
                  } else if (chosen) {
                    styleClass = "bg-cyan-500/20 border-cyan-400 text-white";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={`text-right px-4 py-3 rounded-xl border text-sm transition-colors flex items-center justify-between gap-2 cursor-pointer disabled:cursor-default ${styleClass}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      {submitted && rightOption && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {submitted && chosen && !rightOption && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="rounded-xl bg-violet-950/35 border border-violet-500/30 p-3.5 text-sm text-slate-200 leading-relaxed">
                  <span className="font-bold text-violet-300 ml-1">التفسير العلمي:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex items-center justify-between glass-panel rounded-2xl p-4">
          <span className="text-sm text-slate-300 tabular-nums">
            أجبت عن {answeredCount} من {mcqs.length} سؤال
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className="gradient-btn-brand px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 cursor-pointer"
          >
            تصحيح الإجابات وحفظ الدرجة
          </button>
        </div>
      )}
    </div>
  );
};

interface LessonPracticeSectionProps {
  exercises: PracticalExercise[];
  completedExercises: string[];
  exerciseDrafts: Record<string, string>;
  onSaveDraft: (exerciseId: string, code: string) => void;
  onCompleteExercise: (exerciseId: string, code: string) => void;
}

export const LessonPracticeSection: React.FC<LessonPracticeSectionProps> = ({
  exercises,
  completedExercises,
  exerciseDrafts,
  onSaveDraft,
  onCompleteExercise,
}) => {
  return (
    <div className="space-y-5">
      {exercises.map((ex, idx) => (
        <ExerciseCard
          key={ex.id}
          index={idx + 1}
          exercise={ex}
          isCompleted={completedExercises.includes(ex.id)}
          initialCode={exerciseDrafts[ex.id] ?? ex.starterCode}
          onSaveDraft={onSaveDraft}
          onCompleteExercise={onCompleteExercise}
        />
      ))}
    </div>
  );
};

interface ExerciseCardProps {
  index: number;
  exercise: PracticalExercise;
  isCompleted: boolean;
  initialCode: string;
  onSaveDraft: (exerciseId: string, code: string) => void;
  onCompleteExercise: (exerciseId: string, code: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  index,
  exercise,
  isCompleted,
  initialCode,
  onSaveDraft,
  onCompleteExercise,
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleCheck = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setFeedback({ ok: false, msg: "يرجى كتابة كود بايثون أولاً قبل التحقق." });
      return;
    }

    const nonCommentCode = code
      .split("\n")
      .filter((line) => !line.trim().startsWith("#"))
      .join("\n");

    const missing = exercise.requiredPatterns.filter(
      (pattern) => !nonCommentCode.includes(pattern)
    );

    if (missing.length === 0) {
      onCompleteExercise(exercise.id, code);
      setFeedback({
        ok: true,
        msg: "ممتاز! يحتوي حلك على البنية المطلوبة والعناصر الأساسية. تم تسجيل التدريب كمكتمل.",
      });
    } else {
      onSaveDraft(exercise.id, code);
      setFeedback({
        ok: false,
        msg: `حاول مجدداً: تأكد من استخدام (${missing.join(" , ")}) داخل الكود الفعلي وليس في التعليقات.`,
      });
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-cyan-300 font-semibold">تدريب عملي {index}</span>
            <span>·</span>
            <span>المستوى: {exercise.difficulty}</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white">{exercise.title}</h4>
        </div>

        {isCompleted && (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>تدريب مكتمل</span>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-200 leading-relaxed">{exercise.prompt}</p>

      {/* Editable LTR Code Area */}
      <div className="rounded-xl overflow-hidden border border-slate-700/70 bg-[#080d1a]">
        <div className="flex items-center justify-between px-4 py-2 bg-[#10172b] border-b border-slate-800">
          <span className="text-xs font-mono text-slate-300 flex items-center gap-2" dir="ltr">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>exercise_{index}.py</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setCode(exercise.starterCode);
              setFeedback(null);
            }}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            إعادة القالب المبدئي
          </button>
        </div>
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            onSaveDraft(exercise.id, e.target.value);
          }}
          rows={6}
          dir="ltr"
          spellCheck={false}
          className="w-full bg-transparent p-4 font-mono text-sm text-slate-100 focus:outline-none leading-6 resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-800/90 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>{showHint ? "إخفاء التلميح" : "عرض تلميح"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSolution((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-800/90 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-violet-300" />
            <span>{showSolution ? "إخفاء الحل النموذجي" : "عرض الحل النموذجي"}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCheck}
          className="gradient-btn-brand px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white cursor-pointer"
        >
          تحقق من الحل
        </button>
      </div>

      {showHint && (
        <div className="rounded-xl bg-amber-950/35 border border-amber-500/30 p-3.5 text-sm text-amber-100">
          <span className="font-bold text-amber-300 ml-1">تلميح:</span>
          {exercise.hint}
        </div>
      )}

      {feedback && (
        <div
          className={`rounded-xl p-3.5 text-sm flex items-start gap-2.5 border ${
            feedback.ok
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-100"
              : "bg-rose-950/40 border-rose-500/40 text-rose-100"
          }`}
        >
          {feedback.ok ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="rounded-xl bg-[#050912] border border-slate-800 p-3.5">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>الناتج المتوقع للتدريب</span>
        </div>
        <pre dir="ltr" className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-5">
          {exercise.expectedOutput}
        </pre>
      </div>

      {showSolution && (
        <div className="space-y-3 pt-2">
          <CodeBlockVSCode
            code={exercise.solutionCode}
            filename={`solution_${index}.py`}
            expectedOutput={exercise.expectedOutput}
          />
          <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 text-sm text-slate-200 leading-relaxed">
            <span className="font-bold text-cyan-300 ml-1">شرح الحل النموذجي:</span>
            {exercise.solutionExplanation}
          </div>
        </div>
      )}
    </div>
  );
};
