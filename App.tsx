import React, { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Code2,
  Compass,
  FolderUp,
  Home,
  LayoutDashboard,
  Layers,
  Menu,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { ALL_LESSONS, CHAPTERS, getLessonById } from "./data/curriculumIndex";
import { useStudentProgress } from "./hooks/useStudentProgress";
import { AppPage } from "./types/curriculum";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { ChaptersPage } from "./pages/ChaptersPage";
import { LessonPage } from "./pages/LessonPage";
import { PracticePage } from "./pages/PracticePage";
import { ExamsPage } from "./pages/ExamsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AiTutorDrawer } from "./components/AiTutorDrawer";
import { GoogleDriveExportModal } from "./components/GoogleDriveExportModal";

interface RouteState {
  page: AppPage;
  lessonId: string;
}

function parseHash(): RouteState {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  const first = parts[0] as AppPage | undefined;

  if (first === "lesson" && parts[1] && getLessonById(parts[1])) {
    return { page: "lesson", lessonId: parts[1] };
  }
  const validPages: AppPage[] = [
    "home",
    "courses",
    "chapters",
    "lesson",
    "practice",
    "exams",
    "dashboard",
  ];
  if (first && validPages.includes(first)) {
    return { page: first, lessonId: "L2-1" };
  }
  return { page: "home", lessonId: "L2-1" };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(parseHash);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [expandedChapterId, setExpandedChapterId] = useState<string>("chapter-2");

  const {
    progress,
    unlockedAchievementIds,
    allAchievements,
    markLessonVisited,
    toggleLessonComplete,
    saveQuizResult,
    saveExerciseComplete,
    saveExerciseDraft,
    saveExamResult,
    resetProgress,
  } = useStudentProgress();

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const activeLesson =
    getLessonById(route.lessonId) ??
    getLessonById(progress.lastVisitedLessonId) ??
    ALL_LESSONS[0];

  useEffect(() => {
    if (route.page === "lesson" && activeLesson) {
      setExpandedChapterId(activeLesson.chapterId);
    }
  }, [route.page, activeLesson]);

  const navigate = (page: AppPage, lessonId?: string) => {
    const targetLessonId = lessonId ?? progress.lastVisitedLessonId ?? "L2-1";
    if (page === "lesson") {
      window.location.hash = `#/lesson/${targetLessonId}`;
      setRoute({ page: "lesson", lessonId: targetLessonId });
    } else {
      window.location.hash = `#/${page}`;
      setRoute({ page, lessonId: targetLessonId });
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems: Array<{
    id: AppPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "courses", label: "الكورسات", icon: Compass },
    { id: "chapters", label: "الفصول", icon: Layers },
    { id: "lesson", label: "صفحة الدرس", icon: BookOpen },
    { id: "practice", label: "التدريبات", icon: Wrench },
    { id: "exams", label: "الاختبارات", icon: Award },
    { id: "dashboard", label: "لوحة الطالب", icon: LayoutDashboard },
  ];

  const lessonContextText =
    route.page === "lesson"
      ? `الدرس الحالي: ${activeLesson.number} - ${activeLesson.titleAr} (${activeLesson.titleEn}).\nالملخص: ${activeLesson.overview}`
      : undefined;

  return (
    <div dir="rtl" className="min-h-screen cs-grid-bg text-slate-100 flex flex-col">
      {/* Topmost Attribution Bar */}
      <div className="border-b border-slate-800/70 bg-[#040711] py-1.5 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center sm:justify-end">
          <span dir="ltr" className="font-mono text-xs font-semibold text-cyan-300 tracking-wide">
            Created by Mohamed Adel
          </span>
        </div>
      </div>

      {/* Top Navigation Bar (Strict 3-zone single-row contract) */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#050914]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 cursor-pointer"
              aria-label="القائمة الجانبية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => navigate("home")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg gradient-btn-brand flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-base sm:text-lg text-white">
                بايثون أكاديمي
              </span>
            </button>
          </div>

          {/* Zone 2: Concise Top Nav Links */}
          <nav className="hidden md:flex items-center gap-1 whitespace-nowrap shrink-0">
            {navItems.slice(0, 6).map((item) => {
              const active = route.page === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "text-slate-300 hover:text-white hover:bg-slate-900/70"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={() => setTutorOpen(true)}
              className="gradient-btn-brand inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>المساعد الذكي</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex gap-6 px-4 sm:px-6 py-6">
        {/* Desktop & Mobile Sidebar */}
        <aside
          className={`${
            mobileMenuOpen
              ? "fixed inset-y-0 right-0 z-50 w-72 bg-[#060b18] p-4 border-l border-slate-800 overflow-y-auto shadow-2xl"
              : "hidden"
          } lg:block lg:static lg:w-72 lg:shrink-0`}
        >
          <div className="glass-panel rounded-2xl p-4 space-y-5 lg:sticky lg:top-22">
            {mobileMenuOpen && (
              <div className="flex items-center justify-between lg:hidden border-b border-slate-800 pb-3">
                <span className="font-bold text-white">التنقل السريع</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Main Pages */}
            <div className="space-y-1">
              <div className="px-2 pb-1 text-[11px] font-bold text-slate-400">أقسام المنصة</div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = route.page === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-cyan-500/15 border border-cyan-400/35 text-cyan-200"
                        : "text-slate-300 hover:bg-slate-900/80 hover:text-white border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setDriveModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/15 border border-emerald-400/35 text-emerald-200 hover:bg-emerald-500/25 transition-colors cursor-pointer mt-2"
              >
                <FolderUp className="w-4 h-4 shrink-0" />
                <span>مشاركة وحفظ الموقع (Drive / ملف)</span>
              </button>
            </div>

            {/* Independent Lesson Pages Tree */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="px-2 text-[11px] font-bold text-slate-400">
                الدروس المستقلة (15 درساً)
              </div>
              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pl-1">
                {CHAPTERS.map((ch) => {
                  const expanded = expandedChapterId === ch.id;
                  const chLessons = ALL_LESSONS.filter((l) => l.chapterId === ch.id);
                  return (
                    <div key={ch.id} className="rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedChapterId((prev) => (prev === ch.id ? "" : ch.id))
                        }
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-200 cursor-pointer"
                      >
                        <span>
                          فصل {ch.number} (محاضرة {ch.lectureNumber})
                        </span>
                        {expanded ? (
                          <ChevronDown className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ChevronLeft className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      {expanded && (
                        <div className="px-2 pb-2 space-y-1">
                          {chLessons.map((lesson) => {
                            const isCurrent =
                              route.page === "lesson" && activeLesson.id === lesson.id;
                            const isDone = progress.completedLessons.includes(lesson.id);

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => navigate("lesson", lesson.id)}
                                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-right text-xs transition-colors cursor-pointer ${
                                  isCurrent
                                    ? "bg-violet-500/20 text-white font-semibold"
                                    : "text-slate-300 hover:bg-slate-900"
                                }`}
                              >
                                <span className="truncate">
                                  {lesson.number} {lesson.titleAr}
                                </span>
                                {isDone && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 pb-12">
          {route.page === "home" && (
            <HomePage progress={progress} onNavigate={navigate} />
          )}
          {route.page === "courses" && (
            <CoursesPage progress={progress} onNavigate={navigate} />
          )}
          {route.page === "chapters" && (
            <ChaptersPage progress={progress} onNavigate={navigate} />
          )}
          {route.page === "lesson" && (
            <LessonPage
              lesson={activeLesson}
              progress={progress}
              onNavigate={navigate}
              onMarkVisited={markLessonVisited}
              onToggleComplete={toggleLessonComplete}
              onSaveQuiz={saveQuizResult}
              onSaveDraft={saveExerciseDraft}
              onCompleteExercise={saveExerciseComplete}
              onOpenTutor={() => setTutorOpen(true)}
              onExportDrive={() => setDriveModalOpen(true)}
            />
          )}
          {route.page === "practice" && (
            <PracticePage
              progress={progress}
              onNavigate={navigate}
              onSaveDraft={saveExerciseDraft}
              onCompleteExercise={saveExerciseComplete}
            />
          )}
          {route.page === "exams" && (
            <ExamsPage progress={progress} onSaveExam={saveExamResult} />
          )}
          {route.page === "dashboard" && (
            <DashboardPage
              progress={progress}
              unlockedAchievementIds={unlockedAchievementIds}
              allAchievements={allAchievements}
              onNavigate={navigate}
              onResetProgress={resetProgress}
            />
          )}
        </main>
      </div>

      {/* Site Footer */}
      <footer className="border-t border-slate-800/80 bg-[#050914]/90 py-5 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
          <span>بايثون أكاديمي · منصة طلاب تكنولوجيا المعلومات وعلوم الحاسب</span>
          <span dir="ltr" className="font-mono font-semibold text-cyan-300">
            Created by Mohamed Adel
          </span>
        </div>
      </footer>

      {/* Multi-turn Gemini AI Tutor Drawer */}
      <AiTutorDrawer
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        lessonContext={lessonContextText}
        lessonTitle={route.page === "lesson" ? activeLesson.titleAr : undefined}
      />

      {/* Google Drive Export & Share Modal */}
      <GoogleDriveExportModal
        open={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        currentLessonId={activeLesson.id}
        currentChapterId={activeLesson.chapterId}
        progress={progress}
      />
    </div>
  );
}
