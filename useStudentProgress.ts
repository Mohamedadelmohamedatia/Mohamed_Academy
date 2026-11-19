import { useCallback, useEffect, useState } from "react";
import { StudentProgress } from "../types/curriculum";
import { ACHIEVEMENTS, ALL_LESSONS, CHAPTER_EXAMS } from "../data/curriculumIndex";

const STORAGE_KEY = "python_it_academy_progress_v1";

const DEFAULT_PROGRESS: StudentProgress = {
  completedLessons: [],
  quizScores: {},
  completedExercises: [],
  exerciseDrafts: {},
  examScores: {},
  lastVisitedLessonId: "L2-1",
  lastVisitedPage: "home",
  studyMinutesAccumulated: 0,
};

function loadProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedExercises: Array.isArray(parsed.completedExercises) ? parsed.completedExercises : [],
      quizScores: parsed.quizScores ?? {},
      exerciseDrafts: parsed.exerciseDrafts ?? {},
      examScores: parsed.examScores ?? {},
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage quota errors
    }
  }, [progress]);

  const markLessonVisited = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.lastVisitedLessonId === lessonId && prev.lastVisitedPage === "lesson") {
        return prev;
      }
      return {
        ...prev,
        lastVisitedLessonId: lessonId,
        lastVisitedPage: "lesson",
      };
    });
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    const lesson = ALL_LESSONS.find((l) => l.id === lessonId);
    const mins = lesson?.estimatedMinutes ?? 30;
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      const completedLessons = exists
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      const studyMinutesAccumulated = exists
        ? Math.max(0, prev.studyMinutesAccumulated - mins)
        : prev.studyMinutesAccumulated + mins;
      return {
        ...prev,
        completedLessons,
        studyMinutesAccumulated,
      };
    });
  }, []);

  const saveQuizResult = useCallback(
    (lessonId: string, score: number, total: number, answers: Record<string, number>) => {
      setProgress((prev) => {
        const completedLessons = prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : score / total >= 0.6
          ? [...prev.completedLessons, lessonId]
          : prev.completedLessons;
        return {
          ...prev,
          completedLessons,
          quizScores: {
            ...prev.quizScores,
            [lessonId]: {
              score,
              total,
              answers,
              completedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    []
  );

  const saveExerciseComplete = useCallback((exerciseId: string, code: string) => {
    setProgress((prev) => ({
      ...prev,
      completedExercises: prev.completedExercises.includes(exerciseId)
        ? prev.completedExercises
        : [...prev.completedExercises, exerciseId],
      exerciseDrafts: {
        ...prev.exerciseDrafts,
        [exerciseId]: code,
      },
    }));
  }, []);

  const saveExerciseDraft = useCallback((exerciseId: string, code: string) => {
    setProgress((prev) => ({
      ...prev,
      exerciseDrafts: {
        ...prev.exerciseDrafts,
        [exerciseId]: code,
      },
    }));
  }, []);

  const saveExamResult = useCallback(
    (examId: string, score: number, total: number, answers: Record<string, number>) => {
      const exam = CHAPTER_EXAMS.find((e) => e.id === examId);
      const pct = Math.round((score / total) * 100);
      const passed = pct >= (exam?.passingScore ?? 60);
      setProgress((prev) => ({
        ...prev,
        examScores: {
          ...prev.examScores,
          [examId]: {
            score,
            total,
            passed,
            answers,
            completedAt: new Date().toISOString(),
          },
        },
      }));
    },
    []
  );

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const unlockedAchievementIds = (() => {
    const unlocked: string[] = [];
    const completedCount = progress.completedLessons.length;
    if (completedCount >= 1) unlocked.push("first-lesson");
    if (completedCount >= 5) unlocked.push("five-lessons");
    if (completedCount >= ALL_LESSONS.length) unlocked.push("all-lessons");

    const highQuizzes = Object.values(progress.quizScores).filter(
      (q) => q.total > 0 && q.score / q.total >= 0.8
    ).length;
    if (highQuizzes >= 3) unlocked.push("quiz-master");

    if (progress.completedExercises.length >= 10) unlocked.push("practice-builder");

    const passedExams = Object.values(progress.examScores).filter((e) => e.passed).length;
    if (passedExams >= 2) unlocked.push("chapter-champion");

    return unlocked;
  })();

  return {
    progress,
    unlockedAchievementIds,
    allAchievements: ACHIEVEMENTS,
    markLessonVisited,
    toggleLessonComplete,
    saveQuizResult,
    saveExerciseComplete,
    saveExerciseDraft,
    saveExamResult,
    resetProgress,
  };
}
