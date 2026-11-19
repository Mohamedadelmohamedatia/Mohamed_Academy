import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  FolderUp,
  Globe,
  Link2,
  Loader2,
  LogOut,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { CHAPTERS } from "../data/curriculumIndex";
import { StudentProgress } from "../types/curriculum";
import {
  getDriveAccessToken,
  initDriveAuth,
  signInWithGoogleForDrive,
  signOutDrive,
} from "../services/googleDriveAuth";
import {
  buildHtmlDocument,
  deleteDriveFile,
  DriveFileItem,
  getLessonsForExportScope,
  listAppDriveFiles,
  makeDriveFileShareable,
  uploadToGoogleDrive,
} from "../services/googleDriveExport";

interface GoogleDriveExportModalProps {
  open: boolean;
  onClose: () => void;
  currentLessonId: string;
  currentChapterId: string;
  progress: StudentProgress;
}

type ExportScope = "standalone_app" | "full_curriculum" | "chapter" | "current_lesson";

export const GoogleDriveExportModal: React.FC<GoogleDriveExportModalProps> = ({
  open,
  onClose,
  currentLessonId,
  currentChapterId,
  progress,
}) => {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [shareUrl, setShareUrl] = useState<string>("");
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [downloadingStandalone, setDownloadingStandalone] = useState(false);

  const [exportScope, setExportScope] = useState<ExportScope>("standalone_app");
  const [selectedChapterId, setSelectedChapterId] = useState(currentChapterId);
  const [formatType, setFormatType] = useState<"gdoc" | "html">("html");
  const [customFileName, setCustomFileName] = useState(
    "python-academy-mohamed-adel.html"
  );

  const [uploading, setUploading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [uploadedFile, setUploadedFile] = useState<DriveFileItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [confirmShareTarget, setConfirmShareTarget] = useState<DriveFileItem | null>(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<DriveFileItem | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const isOfflineFile =
    typeof window !== "undefined" &&
    ((window as unknown as { __STANDALONE_OFFLINE__?: boolean }).__STANDALONE_OFFLINE__ ||
      window.location.protocol === "file:");

  useEffect(() => {
    setSelectedChapterId(currentChapterId);
  }, [currentChapterId]);

  useEffect(() => {
    if (!open || isOfflineFile) return;
    fetch("/api/share-info")
      .then((r) => r.json())
      .then((d) => {
        if (d?.sharedUrl) setShareUrl(d.sharedUrl);
      })
      .catch(() => {
        const origin = window.location.origin;
        setShareUrl(
          origin.includes("ais-dev-") ? origin.replace("ais-dev-", "ais-pre-") : origin
        );
      });
  }, [open, isOfflineFile]);

  useEffect(() => {
    if (exportScope === "standalone_app") {
      setFormatType("html");
      setCustomFileName("python-academy-mohamed-adel.html");
    } else {
      const { title } = getLessonsForExportScope(
        exportScope,
        currentLessonId,
        selectedChapterId
      );
      setCustomFileName(title);
    }
  }, [exportScope, currentLessonId, selectedChapterId]);

  const loadFiles = async (token: string) => {
    setLoadingFiles(true);
    try {
      const list = await listAppDriveFiles(token);
      setFiles(list);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "تعذر تحميل ملفات Drive.");
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    const unsub = initDriveAuth(
      (signedUser, token) => {
        setUser(signedUser);
        setNeedsAuth(false);
        if (open) loadFiles(token);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
        setFiles([]);
      }
    );
    return () => unsub();
  }, [open]);

  if (!open) return null;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg(null);
    try {
      const res = await signInWithGoogleForDrive();
      if (res) {
        setUser(res.user);
        setNeedsAuth(false);
        await loadFiles(res.accessToken);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "فشل تسجيل الدخول عبر Google.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDownloadStandalone = async (
    targetFilename: "python-academy-mohamed-adel.html" | "index.html" = "python-academy-mohamed-adel.html"
  ) => {
    setDownloadingStandalone(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/export-standalone?fresh=1");
      if (!res.ok) {
        throw new Error("تعذر تجهيز النسخة المستقلة.");
      }
      const html = await res.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = targetFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatusMsg(
        targetFilename === "index.html"
          ? "تم تحميل ملف index.html! اسحبه وأفلته داخل مجلد واحد على app.netlify.com/drop أو GitHub Pages لتحصل على رابط عام يعمل للأبد في 10 ثوانٍ."
          : "تم تحميل الموقع بالكامل في ملف واحد (python-academy-mohamed-adel.html)! يمكنك إرساله عبر واتساب أو تيليجرام وسيعمل مباشرة على أي جهاز."
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "تعذر تحميل النسخة المستقلة.");
    } finally {
      setDownloadingStandalone(false);
    }
  };

  const handleUpload = async () => {
    const token = getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      let htmlContent = "";
      let convertToGoogleDoc = formatType === "gdoc";

      if (exportScope === "standalone_app") {
        if (isOfflineFile) {
          htmlContent = "<!doctype html>\n" + document.documentElement.outerHTML;
        } else {
          const res = await fetch("/api/export-standalone?fresh=1");
          if (!res.ok) throw new Error("تعذر تجهيز النسخة التفاعلية للرفع.");
          htmlContent = await res.text();
        }
        convertToGoogleDoc = false;
      } else {
        const { title, lessons } = getLessonsForExportScope(
          exportScope,
          currentLessonId,
          selectedChapterId
        );
        htmlContent = buildHtmlDocument(title, lessons, progress);
      }

      const finalName =
        !convertToGoogleDoc && !customFileName.endsWith(".html")
          ? `${customFileName}.html`
          : customFileName;

      const created = await uploadToGoogleDrive({
        accessToken: token,
        fileName: finalName,
        htmlContent,
        convertToGoogleDoc,
      });
      setUploadedFile(created);
      setStatusMsg(
        exportScope === "standalone_app"
          ? "تم رفع الموقع التفاعلي كاملاً إلى Google Drive! فعّل المشاركة العامة ثم انسخ الرابط لإرساله."
          : "تم رفع الملف إلى Google Drive بنجاح! يمكنك الآن نسخه وإرساله."
      );
      await loadFiles(token);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "تعذر الرفع إلى Google Drive.");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmMakeShareable = async () => {
    if (!confirmShareTarget) return;
    const token = getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setMutatingId(confirmShareTarget.id);
    setErrorMsg(null);
    try {
      await makeDriveFileShareable(token, confirmShareTarget.id);
      setStatusMsg(
        `تم تفعيل المشاركة عبر الرابط للملف "${confirmShareTarget.name}". أي شخص لديه الرابط يمكنه فتحه وتحميله الآن.`
      );
      setConfirmShareTarget(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "تعذر تحديث صلاحيات المشاركة.");
    } finally {
      setMutatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteTarget) return;
    const token = getDriveAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setMutatingId(confirmDeleteTarget.id);
    setErrorMsg(null);
    try {
      await deleteDriveFile(token, confirmDeleteTarget.id);
      setStatusMsg(`تم حذف الملف "${confirmDeleteTarget.name}" من Google Drive.`);
      if (uploadedFile?.id === confirmDeleteTarget.id) setUploadedFile(null);
      setConfirmDeleteTarget(null);
      await loadFiles(token);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "تعذر حذف الملف.");
    } finally {
      setMutatingId(null);
    }
  };

  const copyLink = (file: DriveFileItem) => {
    if (!file.webViewLink) return;
    navigator.clipboard?.writeText(file.webViewLink);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyDirectDownloadLink = (file: DriveFileItem) => {
    const directUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(file.id)}`;
    navigator.clipboard?.writeText(directUrl);
    setCopiedId(`dl-${file.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyShareUrl = () => {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedShareUrl(true);
    setTimeout(() => setCopiedShareUrl(false), 2000);
  };

  const handleNativeShare = async () => {
    if (!shareUrl || !navigator.share) return;
    try {
      await navigator.share({
        title: "بايثون أكاديمي | منصة طلاب تكنولوجيا المعلومات",
        text: "منصة تعليم بايثون التفاعلية (15 درساً + مختبرات + اختبارات) - Created by Mohamed Adel",
        url: shareUrl,
      });
    } catch {
      // user cancelled share sheet
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/35 flex items-center justify-center text-cyan-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                مشاركة المنصة وإبقائها تعمل دائماً
              </h2>
              <p className="text-xs text-slate-400">
                اختر بين تنزيل نسخة تفاعلية كاملة تعمل للأبد أو الرفع إلى Google Drive أو نسخ رابط
                المنصة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method 1: Standalone Permanent Offline Interactive File + 10-second Static Hosting */}
        {!isOfflineFile && (
          <section className="rounded-2xl bg-gradient-to-l from-cyan-950/40 to-violet-950/40 border border-cyan-500/35 p-4 space-y-3">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">
                1) الطريقة المضمونة 100%: ملف تفاعلي دائم أو نشر برابط مجاني في 10 ثوانٍ
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                يحفظ المنصة بالكامل (الـ 15 درساً، المختبرات البصرية، الأمثلة الـ 75، والاختبارات) في
                ملف واحد يعمل بدون سيرفر للأبد:
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDownloadStandalone("python-academy-mohamed-adel.html")}
                disabled={downloadingStandalone}
                className="gradient-btn-brand inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer disabled:opacity-50"
              >
                {downloadingStandalone ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>تحميل ملف مباشر للمشاركة (واتساب / تيليجرام)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadStandalone("index.html")}
                disabled={downloadingStandalone}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 cursor-pointer disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                <span>تحميل index.html للحصول على رابط دائم</span>
              </button>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-cyan-300">كيف تحصل على رابط إنترنت دائم لا يتوقف مجاناً؟</p>
              <p>
                1. اضغط على <strong className="text-white">تحميل index.html</strong> وضعه داخل مجلد فارغ على جهازك.
              </p>
              <p>
                2. افتح موقع{" "}
                <span dir="ltr" className="font-mono text-emerald-300">
                  app.netlify.com/drop
                </span>{" "}
                (أو GitHub Pages) واسحب المجلد داخله، وسيعطيك رابطاً عاماً دائماً يعمل لدى جميع الطلاب فوراً.
              </p>
            </div>
          </section>
        )}

        {/* Method 2: Live Hosted URL (Works everywhere with AI Tutor when Deployed) */}
        {shareUrl && !isOfflineFile && (() => {
          const isPreviewOnly =
            shareUrl.includes("ais-pre-") ||
            shareUrl.includes("ais-dev-") ||
            shareUrl.includes("localhost");
          const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
            `منصة بايثون أكاديمي لطلاب تكنولوجيا المعلومات (شروحات + مختبرات تفاعلية + اختبارات + مساعد ذكي) - Created by Mohamed Adel\n${shareUrl}`
          )}`;

          return (
            <section
              className={`rounded-2xl bg-slate-950/75 border p-4 space-y-2.5 ${
                isPreviewOnly ? "border-amber-500/35" : "border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div
                  className={`flex items-center gap-2 text-xs font-bold ${
                    isPreviewOnly ? "text-amber-300" : "text-emerald-300"
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>
                    {isPreviewOnly
                      ? "2) للإرسال على واتساب مع عمل المساعد الذكي (يتطلب Deploy أولاً)"
                      : "2) الرابط الحي العام (كل الميزات والمساعد الذكي شغالة 100%)"}
                  </span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded border ${
                    isPreviewOnly
                      ? "bg-amber-500/15 border-amber-400/30 text-amber-200"
                      : "bg-emerald-500/15 border-emerald-400/30 text-emerald-200"
                  }`}
                >
                  {isPreviewOnly ? "فعّل Deploy من أعلى AI Studio" : "جاهز للإرسال على واتساب"}
                </span>
              </div>

              {isPreviewOnly ? (
                <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
                  <p>
                    لكي يعمل <strong className="text-white">المساعد الذكي والصور</strong> مع أي شخص
                    على واتساب <strong className="text-emerald-300">مجاناً بدون بطاقة بنكية</strong>:
                  </p>
                  <p className="text-slate-200">
                    • <strong className="text-cyan-300">من AI Studio مجاناً:</strong> اضغط على أيقونة{" "}
                    <strong className="text-white">Share</strong> (وليس Deploy) في أعلى الصفحة
                    لتفعيل الرابط بالأسفل.
                  </p>
                  <p className="text-slate-200">
                    • <strong className="text-emerald-300">رابط عام دائم مجاني 100% (Render.com):</strong>{" "}
                    صدّر المشروع إلى GitHub من AI Studio ثم اربطه بحساب مجاني على{" "}
                    <span dir="ltr" className="font-mono text-emerald-300">
                      render.com
                    </span>{" "}
                    (بدون فيزا) وضع مفتاح{" "}
                    <span dir="ltr" className="font-mono text-cyan-300">
                      GEMINI_API_KEY
                    </span>{" "}
                    المجاني في Environment Variables.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed">
                  هذا الرابط منشور ويعمل للجميع بالذكاء الاصطناعي وجميع الدروس. انسخه أو أرسله على
                  واتساب مباشرة:
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  dir="ltr"
                  className="flex-1 min-w-[200px] bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 font-mono text-xs text-slate-200"
                />
                <button
                  type="button"
                  onClick={handleCopyShareUrl}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                >
                  {copiedShareUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-cyan-300" />
                  )}
                  <span>{copiedShareUrl ? "تم النسخ" : "نسخ الرابط"}</span>
                </button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>إرسال على واتساب</span>
                </a>
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 border border-violet-400/40 text-violet-100 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة</span>
                  </button>
                )}
              </div>
            </section>
          );
        })()}

        {/* Method 3: Google Drive Export & Share */}
        <section className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FolderUp className="w-4 h-4 text-emerald-400" />
            <span>3) الحفظ والرفع المباشر إلى Google Drive</span>
          </div>

          {needsAuth ? (
            <div className="text-center space-y-3 py-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                سجّل الدخول بحساب Google لرفع الموقع التفاعلي أو الدروس كملف إلى Drive والحصول على
                رابط مشاركة.
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow cursor-pointer disabled:opacity-60"
                  dir="ltr"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isLoggingIn ? "Signing in..." : "Sign in with Google"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
                <span className="text-emerald-300 font-medium">
                  متصل بحساب: <span dir="ltr" className="font-mono">{user?.email}</span>
                </span>
                <button
                  type="button"
                  onClick={signOutDrive}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "standalone_app", label: "الموقع التفاعلي كاملاً (.html يعمل للأبد)" },
                  { id: "full_curriculum", label: "ملف قراءة المنهج الكامل (15 درساً)" },
                  { id: "chapter", label: "فصل دراسي محدد" },
                  { id: "current_lesson", label: "الدرس الحالي فقط" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExportScope(opt.id as ExportScope)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer text-right ${
                      exportScope === opt.id
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                        : "bg-slate-900 border-slate-800 text-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {exportScope === "chapter" && (
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                >
                  {CHAPTERS.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      الفصل {ch.number} (محاضرة {ch.lectureNumber}): {ch.titleAr}
                    </option>
                  ))}
                </select>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exportScope !== "standalone_app" && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">صيغة الملف:</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormatType("gdoc")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer ${
                          formatType === "gdoc"
                            ? "bg-violet-500/20 border-violet-400 text-violet-200"
                            : "bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        Google Doc
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormatType("html")}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer ${
                          formatType === "html"
                            ? "bg-violet-500/20 border-violet-400 text-violet-200"
                            : "bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                )}

                <div className={exportScope === "standalone_app" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs text-slate-400 mb-1.5">اسم الملف:</label>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    dir={exportScope === "standalone_app" ? "ltr" : "auto"}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !customFileName.trim()}
                className="gradient-btn-brand w-full py-2.5 rounded-xl text-sm font-bold text-white inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الرفع إلى Google Drive...</span>
                  </>
                ) : (
                  <>
                    <FolderUp className="w-4 h-4" />
                    <span>رفع وحفظ في Google Drive</span>
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {errorMsg && (
          <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-3 text-sm text-rose-200">
            {errorMsg}
          </div>
        )}

        {statusMsg && (
          <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-3 text-sm text-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {uploadedFile && (
          <div className="rounded-2xl bg-cyan-950/30 border border-cyan-500/40 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText className="w-4 h-4 text-cyan-300" />
                <span>{uploadedFile.name}</span>
              </div>
              {uploadedFile.webViewLink && (
                <a
                  href={uploadedFile.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline"
                >
                  <span>فتح في Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copyLink(uploadedFile)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-white cursor-pointer"
              >
                {copiedId === uploadedFile.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span>{copiedId === uploadedFile.id ? "تم نسخ الرابط" : "نسخ رابط العرض في Drive"}</span>
              </button>

              {uploadedFile.mimeType !== "application/vnd.google-apps.document" && (
                <button
                  type="button"
                  onClick={() => copyDirectDownloadLink(uploadedFile)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 cursor-pointer"
                >
                  {copiedId === `dl-${uploadedFile.id}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {copiedId === `dl-${uploadedFile.id}`
                      ? "تم نسخ رابط التحميل المباشر"
                      : "نسخ رابط تحميل مباشر (.html)"}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setConfirmShareTarget(uploadedFile)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 border border-violet-400/40 text-violet-100 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>تفعيل رابط عام للإرسال لأي شخص</span>
              </button>
            </div>
            {uploadedFile.mimeType !== "application/vnd.google-apps.document" && (
              <p className="text-[11px] text-slate-400">
                ملاحظة: ملفات .html على Google Drive تظهر كنص عند المعاينة، لذا فعّل الرابط العام ثم أرسل{" "}
                <strong className="text-slate-200">رابط التحميل المباشر</strong> ليحمّله الطالب ويفتحه في المتصفح.
              </p>
            )}
          </div>
        )}

        {confirmShareTarget && (
          <div className="rounded-2xl bg-amber-950/40 border border-amber-500/40 p-4 space-y-3">
            <div className="flex items-start gap-2 text-sm text-amber-100">
              <Globe className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">تأكيد تغيير صلاحية المشاركة</p>
                <p className="text-xs text-amber-200/90 mt-1">
                  سيصبح الملف "{confirmShareTarget.name}" قابلاً للقراءة والتحميل لأي شخص ترسل له
                  الرابط. هل تريد المتابعة؟
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmShareTarget(null)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmMakeShareable}
                disabled={mutatingId === confirmShareTarget.id}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 cursor-pointer"
              >
                {mutatingId === confirmShareTarget.id ? "جاري التفعيل..." : "تأكيد المشاركة"}
              </button>
            </div>
          </div>
        )}

        {confirmDeleteTarget && (
          <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 p-4 space-y-3">
            <p className="text-sm text-rose-100 font-semibold">
              هل أنت متأكد من حذف الملف "{confirmDeleteTarget.name}" نهائياً من Google Drive؟ لا
              يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDeleteTarget(null)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-200 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={mutatingId === confirmDeleteTarget.id}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white cursor-pointer"
              >
                {mutatingId === confirmDeleteTarget.id ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        )}

        {!needsAuth && (
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>الملفات المرفوعة من المنصة على Drive ({files.length})</span>
              {loadingFiles && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
            </div>

            {files.length === 0 ? (
              <p className="text-xs text-slate-400">لم ترفع أي ملفات من المنصة بعد.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950/75 border border-slate-800 text-xs"
                  >
                    <span className="truncate text-slate-200 font-medium">{f.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {f.webViewLink && (
                        <>
                          <button
                            type="button"
                            onClick={() => copyLink(f)}
                            className="p-1.5 rounded-lg bg-slate-900 text-cyan-300 hover:bg-slate-800 cursor-pointer"
                            title="نسخ الرابط"
                          >
                            {copiedId === f.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={f.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                            title="فتح في Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmShareTarget(f)}
                        className="p-1.5 rounded-lg bg-slate-900 text-violet-300 hover:bg-slate-800 cursor-pointer"
                        title="تفعيل المشاركة العامة"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteTarget(f)}
                        className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-slate-800 cursor-pointer"
                        title="حذف الملف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
