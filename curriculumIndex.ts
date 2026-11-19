import { ACHIEVEMENTS, CHAPTERS, COURSES } from "./curriculumMeta";
import { LESSONS_LECTURE_2 } from "./lessonsLecture2";
import { LESSONS_LECTURE_3 } from "./lessonsLecture3";
import { LESSONS_LECTURE_4 } from "./lessonsLecture4";
import { LESSONS_LECTURE_5 } from "./lessonsLecture5";
import { LESSONS_LECTURE_6 } from "./lessonsLecture6";
import { CHAPTER_EXAMS } from "./chapterExams";
import { Chapter, ChapterExam, Course, Lesson } from "../types/curriculum";

export const ALL_LESSONS: Lesson[] = [
  ...LESSONS_LECTURE_2,
  ...LESSONS_LECTURE_3,
  ...LESSONS_LECTURE_4,
  ...LESSONS_LECTURE_5,
  ...LESSONS_LECTURE_6,
];

export { COURSES, CHAPTERS, CHAPTER_EXAMS, ACHIEVEMENTS };

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getExamById(id: string): ChapterExam | undefined {
  return CHAPTER_EXAMS.find((e) => e.id === id);
}

export function getLessonsForChapter(chapterId: string): Lesson[] {
  return ALL_LESSONS.filter((l) => l.chapterId === chapterId);
}

export function getLessonsForCourse(courseId: string): Lesson[] {
  return ALL_LESSONS.filter((l) => l.courseId === courseId);
}
