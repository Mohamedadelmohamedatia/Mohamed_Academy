import {
  ALL_LESSONS,
  CHAPTER_EXAMS,
  CHAPTERS,
  getChapterById,
} from "../data/curriculumIndex";
import { Lesson, StudentProgress } from "../types/curriculum";

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderLessonHtmlSection(lesson: Lesson): string {
  const topicsHtml = lesson.topics
    .map(
      (t, idx) => `
      <div style="margin-bottom:24px;padding:16px;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;">
        <h3 style="color:#0f172a;margin:0 0 8px 0;">${idx + 1}. ${escapeHtml(t.titleAr)} (${escapeHtml(t.titleEn)})</h3>
        <p><strong>مقدمة:</strong> ${escapeHtml(t.intro)}</p>
        <p><strong>الخطوات:</strong></p>
        <ol>${t.stepByStep.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
        <p><strong>الأهمية:</strong> ${escapeHtml(t.importance)}</p>
        <p><strong>طريقة العمل:</strong> ${escapeHtml(t.howItWorks)}</p>
        <p><strong>مثال برمجي (${escapeHtml(t.codeExample.title)}):</strong></p>
        <pre dir="ltr" style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;overflow:auto;">${escapeHtml(t.codeExample.code)}</pre>
        <p><strong>الناتج المتوقع:</strong></p>
        <pre dir="ltr" style="background:#064e3b;color:#d1fae5;padding:10px;border-radius:8px;overflow:auto;">${escapeHtml(t.codeExample.expectedOutput)}</pre>
        ${
          t.comparisonTable
            ? `<p><strong>${escapeHtml(t.comparisonTable.title)}</strong></p>
               <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px;">
                 <thead><tr style="background:#e2e8f0;">${t.comparisonTable.headers
                   .map((h) => `<th>${escapeHtml(h)}</th>`)
                   .join("")}</tr></thead>
                 <tbody>${t.comparisonTable.rows
                   .map(
                     (r) =>
                       `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
                   )
                   .join("")}</tbody>
               </table>`
            : ""
        }
        <p><strong>المصطلحات:</strong></p>
        <ul>${t.glossary
          .map(
            (g) =>
              `<li><strong dir="ltr">${escapeHtml(g.en)}</strong> (${escapeHtml(g.ar)}): ${escapeHtml(g.definition)}</li>`
          )
          .join("")}</ul>
      </div>
    `
    )
    .join("");

  const examplesHtml = lesson.examples
    .map(
      (ex, idx) => `
      <div style="margin-bottom:20px;padding:14px;border:1px solid #cbd5e1;border-radius:8px;">
        <h4 style="margin:0 0 6px 0;">مثال ${idx + 1}: ${escapeHtml(ex.title)}</h4>
        <p>${escapeHtml(ex.problemStatement)}</p>
        <pre dir="ltr" style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;">${escapeHtml(ex.code)}</pre>
        <p><strong>الناتج المتوقع:</strong></p>
        <pre dir="ltr" style="background:#064e3b;color:#d1fae5;padding:10px;border-radius:8px;">${escapeHtml(ex.expectedOutput)}</pre>
        <p><strong>لماذا يعمل:</strong> ${escapeHtml(ex.whyItWorks)}</p>
      </div>
    `
    )
    .join("");

  const mcqsHtml = lesson.mcqs
    .map(
      (q, idx) => `
      <div style="margin-bottom:12px;">
        <p><strong>س${idx + 1}: ${escapeHtml(q.question)}</strong></p>
        ${q.codeSnippet ? `<pre dir="ltr" style="background:#0f172a;color:#e2e8f0;padding:8px;border-radius:6px;">${escapeHtml(q.codeSnippet)}</pre>` : ""}
        <ul>${q.options
          .map(
            (opt, oIdx) =>
              `<li>${oIdx === q.correctIndex ? "✅ " : ""}${escapeHtml(opt)}</li>`
          )
          .join("")}</ul>
        <p style="color:#475569;"><em>التفسير: ${escapeHtml(q.explanation)}</em></p>
      </div>
    `
    )
    .join("");

  return `
    <section style="margin-bottom:40px;page-break-after:always;">
      <h2 style="color:#1e3a8a;border-bottom:2px solid #0891b2;padding-bottom:6px;">
        الدرس ${escapeHtml(lesson.number)}: ${escapeHtml(lesson.titleAr)}
      </h2>
      <p dir="ltr" style="color:#64748b;font-family:monospace;">${escapeHtml(lesson.titleEn)} · ${escapeHtml(lesson.lectureRef)}</p>
      <p>${escapeHtml(lesson.overview)}</p>
      <h3>الشرح التفصيلي والمفاهيم</h3>
      ${topicsHtml}
      <h3>الأمثلة العملية</h3>
      ${examplesHtml}
      <h3>الاختبار التقييمي (10 أسئلة بالإجابات)</h3>
      ${mcqsHtml}
    </section>
  `;
}

export function buildHtmlDocument(
  title: string,
  lessons: Lesson[],
  progress?: StudentProgress
): string {
  const progressHtml = progress
    ? `<div style="padding:14px;background:#ecfeff;border:1px solid #06b6d4;border-radius:10px;margin-bottom:24px;">
         <strong>ملخص تقدم الطالب:</strong>
         تم إكمال ${progress.completedLessons.length} من أصل ${ALL_LESSONS.length} درساً ·
         التدريبات المنجزة: ${progress.completedExercises.length} ·
         الاختبارات المجتازة: ${Object.values(progress.examScores).filter((e) => e.passed).length} من ${CHAPTER_EXAMS.length}
       </div>`
    : "";

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif; line-height: 1.7; color: #0f172a; max-width: 960px; margin: 24px auto; padding: 0 18px; }
    pre { font-family: 'Consolas', 'Courier New', monospace; font-size: 13px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div style="text-align:center;border-bottom:3px solid #6366f1;padding-bottom:16px;margin-bottom:24px;">
    <p dir="ltr" style="font-family:monospace;color:#0891b2;font-weight:bold;margin:0;">Created by Mohamed Adel</p>
    <h1 style="margin:8px 0;color:#0f172a;">${escapeHtml(title)}</h1>
    <p style="margin:0;color:#475569;">منصة بايثون أكاديمي لطلاب تكنولوجيا المعلومات وعلوم الحاسب</p>
  </div>
  ${progressHtml}
  ${lessons.map(renderLessonHtmlSection).join("")}
</body>
</html>`;
}

export async function uploadToGoogleDrive(params: {
  accessToken: string;
  fileName: string;
  htmlContent: string;
  convertToGoogleDoc: boolean;
}): Promise<DriveFileItem> {
  const { accessToken, fileName, htmlContent, convertToGoogleDoc } = params;

  const metadata = {
    name: fileName,
    mimeType: convertToGoogleDoc
      ? "application/vnd.google-apps.document"
      : "text/html",
  };

  const boundary = "python_academy_drive_boundary_2026";
  const body =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
    `${htmlContent}\r\n` +
    `--${boundary}--`;

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "فشل رفع الملف إلى Google Drive.");
  }

  return data as DriveFileItem;
}

export async function listAppDriveFiles(accessToken: string): Promise<DriveFileItem[]> {
  const res = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=trashed=false&orderBy=createdTime desc&pageSize=15&fields=files(id,name,mimeType,webViewLink,createdTime)",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "تعذر جلب قائمة الملفات من Google Drive.");
  }
  return (data.files ?? []) as DriveFileItem[];
}

export async function makeDriveFileShareable(
  accessToken: string,
  fileId: string
): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/permissions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "reader",
        type: "anyone",
      }),
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "تعذر تفعيل مشاركة الرابط.");
  }
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "تعذر حذف الملف من Google Drive.");
  }
}

export function getLessonsForExportScope(
  scope: "current_lesson" | "chapter" | "full_curriculum",
  currentLessonId: string,
  chapterId: string
): { title: string; lessons: Lesson[] } {
  if (scope === "current_lesson") {
    const l = ALL_LESSONS.find((item) => item.id === currentLessonId) ?? ALL_LESSONS[0];
    return {
      title: `بايثون أكاديمي - درس ${l.number} - ${l.titleAr}`,
      lessons: [l],
    };
  }
  if (scope === "chapter") {
    const ch = getChapterById(chapterId) ?? CHAPTERS[0];
    return {
      title: `بايثون أكاديمي - الفصل ${ch.number} - ${ch.titleAr}`,
      lessons: ALL_LESSONS.filter((l) => l.chapterId === ch.id),
    };
  }
  return {
    title: "بايثون أكاديمي - المنهج الكامل لطلاب تكنولوجيا المعلومات",
    lessons: ALL_LESSONS,
  };
}
