import React from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Layers, PlayCircle } from "lucide-react";
import { ALL_LESSONS, CHAPTERS, COURSES } from "../data/curriculumIndex";
import { AppPage, StudentProgress } from "../types/curriculum";

interface CoursesPageProps {
  progress: StudentProgress;
  onNavigate: (page: AppPage, lessonId?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ progress, onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">الكورسات الدراسية</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
          تم تنظيم المحاضرات المرفوعة (من المحاضرة الثانية حتى السادسة) في 3 كورسات متدرجة تبني
          مهارات طلاب تكنولوجيا المعلومات من الصفر حتى تصميم الدوال البرمجية.
        </p>
      </div>

      <div className="space-y-6">
        {COURSES.map((course) => {
          const courseChapters = CHAPTERS.filter((ch) => course.chapterIds.includes(ch.id));
          const courseLessons = ALL_LESSONS.filter((l) => l.courseId === course.id);
          const completed = courseLessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;
          const pct = Math.round((completed / courseLessons.length) * 100);
          const nextLesson =
            courseLessons.find((l) => !progress.completedLessons.includes(l.id)) ??
            courseLessons[0];

          return (
            <section key={course.id} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold">كورس رقم {course.number}</span>
                    <span>·</span>
                    <span>{course.level}</span>
                    <span>·</span>
                    <span className="font-mono" dir="ltr">
                      {course.titleEn}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{course.titleAr}</h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-2xl font-extrabold text-cyan-300 tabular-nums">{pct}%</div>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {completed} من {courseLessons.length} دروس مكتملة
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseChapters.map((ch) => {
                  const chLessons = ALL_LESSONS.filter((l) => l.chapterId === ch.id);
                  return (
                    <div
                      key={ch.id}
                      className="rounded-2xl bg-slate-950/75 border border-slate-800 p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-violet-300 font-semibold">
                            الفصل {ch.number} · المحاضرة {ch.lectureNumber}
                          </div>
                          <h3 className="text-lg font-bold text-white mt-0.5">{ch.titleAr}</h3>
                        </div>
                        <Layers className="w-5 h-5 text-slate-500 shrink-0" />
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {ch.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {chLessons.map((lesson) => {
                          const isDone = progress.completedLessons.includes(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => onNavigate("lesson", lesson.id)}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-900/75 hover:bg-slate-800/90 border border-slate-800 text-right transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                                )}
                                <span className="text-sm text-slate-100 font-medium">
                                  {lesson.number}: {lesson.titleAr}
                                </span>
                              </div>
                              <ArrowLeft className="w-4 h-4 text-slate-500 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate("chapters")}
                  className="text-sm text-slate-300 hover:text-white cursor-pointer"
                >
                  عرض جميع الفصول والاختبارات النهائية
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("lesson", nextLesson.id)}
                  className="gradient-btn-brand inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>الانتقال إلى الدرس: {nextLesson.titleAr}</span>
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
