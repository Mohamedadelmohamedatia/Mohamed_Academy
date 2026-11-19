import React, { useMemo, useState } from "react";
import { CheckCircle2, Code2, Filter, Wrench } from "lucide-react";
import { ALL_LESSONS, CHAPTERS } from "../data/curriculumIndex";
import { AppPage, StudentProgress } from "../types/curriculum";
import { LessonPracticeSection } from "../components/LessonQuizAndPractice";
import { AiDiagramStudio } from "../components/AiDiagramStudio";

interface PracticePageProps {
  progress: StudentProgress;
  onNavigate: (page: AppPage, lessonId?: string) => void;
  onSaveDraft: (exerciseId: string, code: string) => void;
  onCompleteExercise: (exerciseId: string, code: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  progress,
  onNavigate,
  onSaveDraft,
  onCompleteExercise,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>("chapter-2");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "done">("all");

  const totalExercises = useMemo(
    () => ALL_LESSONS.reduce((acc, l) => acc + l.exercises.length, 0),
    []
  );

  const chapterLessons = ALL_LESSONS.filter((l) => l.chapterId === selectedChapterId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">مختبر التدريبات العملية</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
            يضم المنهج 75 تدريباً برمجياً عملياً (5 تدريبات لكل درس) مع تلميحات ذكية وفحص فوري
            لبنية الكود والحل النموذجي.
          </p>
        </div>

        <div className="glass-panel-subtle rounded-2xl px-4 py-3 text-sm text-slate-200 tabular-nums">
          المنجز:{" "}
          <span className="font-bold text-cyan-300">
            {progress.completedExercises.length} / {totalExercises}
          </span>{" "}
          تدريباً
        </div>
      </div>

      {/* Chapter & Status Filters */}
      <div className="glass-panel rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>اختر الفصل الدراسي لعرض تدريباته:</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "الكل" },
              { id: "pending", label: "قيد الحل" },
              { id: "done", label: "المكتملة" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id as "all" | "pending" | "done")}
                className={`px-3 py-1.5 rounded-lg text-xs border cursor-pointer ${
                  statusFilter === st.id
                    ? "bg-violet-500/20 border-violet-400 text-violet-200"
                    : "bg-slate-900 border-slate-800 text-slate-400"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setSelectedChapterId(ch.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border cursor-pointer transition-colors ${
                selectedChapterId === ch.id
                  ? "gradient-btn-brand border-transparent text-white"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600"
              }`}
            >
              الفصل {ch.number} (محاضرة {ch.lectureNumber})
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Exercises in Selected Chapter */}
      <div className="space-y-8">
        {chapterLessons.map((lesson) => {
          const filteredExercises = lesson.exercises.filter((ex) => {
            const done = progress.completedExercises.includes(ex.id);
            if (statusFilter === "done") return done;
            if (statusFilter === "pending") return !done;
            return true;
          });

          return (
            <section key={lesson.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">
                    درس {lesson.number}: {lesson.titleAr}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("lesson", lesson.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>مراجعة شرح الدرس</span>
                </button>
              </div>

              {filteredExercises.length === 0 ? (
                <div className="glass-panel-subtle rounded-2xl p-6 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>لا توجد تدريبات مطابقة لخيار التصفية المحدد في هذا الدرس.</span>
                </div>
              ) : (
                <LessonPracticeSection
                  exercises={filteredExercises}
                  completedExercises={progress.completedExercises}
                  exerciseDrafts={progress.exerciseDrafts}
                  onSaveDraft={onSaveDraft}
                  onCompleteExercise={onCompleteExercise}
                />
              )}
            </section>
          );
        })}
      </div>

      {/* AI Technical Diagram Studio */}
      <AiDiagramStudio />
    </div>
  );
};
