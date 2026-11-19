import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  FolderUp,
  HelpCircle,
  Layers,
  Sparkles,
  Wrench,
} from "lucide-react";
import { ALL_LESSONS, getChapterById } from "../data/curriculumIndex";
import { AppPage, Lesson, StudentProgress } from "../types/curriculum";
import { CodeBlockVSCode } from "../components/CodeBlockVSCode";
import { InteractiveVisualLab } from "../components/InteractiveVisualLab";
import {
  LessonPracticeSection,
  LessonQuizSection,
} from "../components/LessonQuizAndPractice";

interface LessonPageProps {
  lesson: Lesson;
  progress: StudentProgress;
  onNavigate: (page: AppPage, lessonId?: string) => void;
  onMarkVisited: (lessonId: string) => void;
  onToggleComplete: (lessonId: string) => void;
  onSaveQuiz: (
    lessonId: string,
    score: number,
    total: number,
    answers: Record<string, number>
  ) => void;
  onSaveDraft: (exerciseId: string, code: string) => void;
  onCompleteExercise: (exerciseId: string, code: string) => void;
  onOpenTutor: () => void;
  onExportDrive: () => void;
}

type LessonTab = "explain" | "visual" | "examples" | "quiz" | "practice";

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  progress,
  onNavigate,
  onMarkVisited,
  onToggleComplete,
  onSaveQuiz,
  onSaveDraft,
  onCompleteExercise,
  onOpenTutor,
  onExportDrive,
}) => {
  const [activeTab, setActiveTab] = useState<LessonTab>("explain");

  useEffect(() => {
    onMarkVisited(lesson.id);
    setActiveTab("explain");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lesson.id, onMarkVisited]);

  const chapter = getChapterById(lesson.chapterId);
  const currentIndex = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? ALL_LESSONS[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < ALL_LESSONS.length - 1 ? ALL_LESSONS[currentIndex + 1] : null;
  const isCompleted = progress.completedLessons.includes(lesson.id);

  const tabs: Array<{ id: LessonTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "explain", label: `الشرح والمفاهيم (${lesson.topics.length})`, icon: BookOpen },
    { id: "visual", label: "المختبر البصري التفاعلي", icon: Cpu },
    { id: "examples", label: `الأمثلة العملية (${lesson.examples.length})`, icon: Code2 },
    { id: "quiz", label: `اختبار الدرس (${lesson.mcqs.length})`, icon: HelpCircle },
    { id: "practice", label: `التدريبات العملية (${lesson.exercises.length})`, icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <header className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate("chapters")}
              className="text-cyan-300 hover:underline cursor-pointer"
            >
              الفصول الدراسية
            </button>
            <span>/</span>
            <span>{chapter?.titleAr}</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold">درس {lesson.number}</span>
          </div>
          <div className="flex items-center gap-3 tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {lesson.estimatedMinutes} دقيقة
            </span>
            <span>·</span>
            <span>{lesson.lectureRef}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {lesson.titleAr}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-cyan-300" dir="ltr">
              {lesson.titleEn}
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1">
              {lesson.overview}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onExportDrive}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-cyan-500/15 border border-cyan-400/40 text-cyan-100 hover:bg-cyan-500/25 cursor-pointer"
            >
              <FolderUp className="w-4 h-4 text-cyan-300" />
              <span>حفظ في Google Drive</span>
            </button>

            <button
              type="button"
              onClick={onOpenTutor}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-violet-500/20 border border-violet-400/40 text-violet-100 hover:bg-violet-500/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-300" />
              <span>اسأل المساعد عن الدرس</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleComplete(lesson.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border cursor-pointer transition-colors ${
                isCompleted
                  ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200"
                  : "bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400/50"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? "تم إكمال الدرس" : "تحديد الدرس كمكتمل"}</span>
            </button>
          </div>
        </div>

        {/* Objectives */}
        <div className="rounded-2xl bg-slate-950/75 border border-slate-800/90 p-4 space-y-2">
          <div className="text-xs font-bold text-cyan-300">أهداف هذا الدرس:</div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200">
            {lesson.objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-mono text-xs mt-1 tabular-nums">
                  {idx + 1}.
                </span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Interactive Sub-Navigation Tabs */}
      <div className="glass-panel-subtle rounded-2xl p-2 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? "gradient-btn-brand text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/80"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "explain" && (
        <div className="space-y-6">
          {lesson.topics.map((topic, idx) => (
            <article key={topic.id} className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="border-b border-slate-800 pb-4 space-y-1">
                <div className="text-xs font-semibold text-cyan-300">
                  الموضوع {idx + 1} · <span className="font-mono" dir="ltr">{topic.titleEn}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{topic.titleAr}</h2>
              </div>

              {/* Simple Introduction */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-cyan-300">مقدمة مبسطة</h3>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">{topic.intro}</p>
              </div>

              {/* Step by Step */}
              <div className="rounded-2xl bg-slate-950/75 border border-slate-800 p-5 space-y-3">
                <h3 className="text-sm font-bold text-violet-300">الشرح خطوة بخطوة</h3>
                <ol className="space-y-2.5 text-sm text-slate-200">
                  {topic.stepByStep.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-400/30 text-violet-200 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                        {sIdx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Importance & How it works */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-900/65 border border-slate-800 p-4 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-300">أهمية المفهوم</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">{topic.importance}</p>
                </div>
                <div className="rounded-2xl bg-slate-900/65 border border-slate-800 p-4 space-y-2">
                  <h3 className="text-sm font-bold text-cyan-300">كيف يعمل داخلياً؟</h3>
                  <p className="text-sm text-slate-200 leading-relaxed">{topic.howItWorks}</p>
                </div>
              </div>

              {/* IT Real World Examples */}
              <div className="rounded-2xl bg-slate-950/75 border border-slate-800 p-4 space-y-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>تطبيقات من عالم تكنولوجيا المعلومات (IT)</span>
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  {topic.itRealWorldExamples.map((ex, eIdx) => (
                    <li key={eIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Code Example + Expected Output for this topic */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>مثال عملي والناتج الذي سيظهر: {topic.codeExample.title}</span>
                </h3>
                <CodeBlockVSCode
                  code={topic.codeExample.code}
                  filename={`${topic.id}.py`}
                  expectedOutput={topic.codeExample.expectedOutput}
                />
                {topic.codeExample.explanation && (
                  <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 leading-relaxed">
                    {topic.codeExample.explanation}
                  </p>
                )}
              </div>

              {/* Warning Note if present */}
              {topic.warningNote && (
                <div className="rounded-2xl bg-amber-950/35 border border-amber-500/35 p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-100 leading-relaxed">
                    <span className="font-bold text-amber-300 ml-1">تنبيه مهم:</span>
                    {topic.warningNote}
                  </div>
                </div>
              )}

              {/* Comparison Table if present */}
              {topic.comparisonTable && (
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-white">{topic.comparisonTable.title}</h3>
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-right text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-cyan-300">
                          {topic.comparisonTable.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-4 py-3 font-bold border-b border-slate-800">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 bg-slate-950/70">
                        {topic.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-3 text-slate-200 leading-relaxed">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Glossary */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold text-white">المصطلحات التقنية المهمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topic.glossary.map((term, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-xl bg-slate-900/70 border border-slate-800 p-3.5 space-y-1"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-sm text-white">{term.ar}</span>
                        <span className="font-mono text-xs text-cyan-300" dir="ltr">
                          {term.en}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "visual" && (
        <InteractiveVisualLab labType={lesson.visualLabType} title={lesson.visualLabTitle} />
      )}

      {activeTab === "examples" && (
        <div className="space-y-6">
          {lesson.examples.map((ex, idx) => (
            <section key={ex.id} className="glass-panel rounded-2xl p-6 space-y-5">
              <div className="border-b border-slate-800 pb-4 space-y-1">
                <div className="text-xs font-semibold text-cyan-300 tabular-nums">
                  مثال عملي {idx + 1} من {lesson.examples.length}
                </div>
                <h3 className="text-xl font-bold text-white">{ex.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{ex.problemStatement}</p>
              </div>

              <CodeBlockVSCode
                code={ex.code}
                filename={`example_${lesson.id}_${idx + 1}.py`}
                expectedOutput={ex.expectedOutput}
                lineByLine={ex.lineByLine}
              />

              {/* Full Line-by-line Reference */}
              <div className="rounded-2xl bg-slate-950/75 border border-slate-800 p-4 space-y-3">
                <h4 className="text-sm font-bold text-violet-300">تتبع الأسطر خطوة بخطوة</h4>
                <div className="space-y-2">
                  {ex.lineByLine.map((line) => (
                    <div
                      key={line.lineNumber}
                      className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                    >
                      <span
                        dir="ltr"
                        className="font-mono text-xs text-cyan-300 shrink-0 tabular-nums"
                      >
                        Line {line.lineNumber}: {line.code}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {line.explanation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-emerald-950/25 border border-emerald-500/30 p-4 space-y-1.5">
                  <h4 className="text-sm font-bold text-emerald-300">لماذا يعمل هذا الحل؟</h4>
                  <p className="text-sm text-slate-200 leading-relaxed">{ex.whyItWorks}</p>
                </div>

                <div className="rounded-2xl bg-rose-950/25 border border-rose-500/30 p-4 space-y-1.5">
                  <h4 className="text-sm font-bold text-rose-300">أخطاء شائعة وكيف تتجنبها</h4>
                  <ul className="space-y-1.5 text-sm text-slate-200">
                    {ex.commonMistakes.map((m, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2">
                        <span className="text-rose-400">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === "quiz" && (
        <LessonQuizSection
          lessonId={lesson.id}
          mcqs={lesson.mcqs}
          savedQuiz={progress.quizScores[lesson.id]}
          onSaveQuiz={onSaveQuiz}
        />
      )}

      {activeTab === "practice" && (
        <LessonPracticeSection
          exercises={lesson.exercises}
          completedExercises={progress.completedExercises}
          exerciseDrafts={progress.exerciseDrafts}
          onSaveDraft={onSaveDraft}
          onCompleteExercise={onCompleteExercise}
        />
      )}

      {/* Next / Prev Lesson Footer */}
      <footer className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => onNavigate("lesson", prevLesson.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/40 text-sm text-slate-200 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span>الدرس السابق: {prevLesson.titleAr}</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            type="button"
            onClick={() => onNavigate("lesson", nextLesson.id)}
            className="gradient-btn-brand inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          >
            <span>الدرس التالي: {nextLesson.titleAr}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate("exams")}
            className="gradient-btn-brand inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          >
            <span>الانتقال إلى الاختبارات النهائية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};
