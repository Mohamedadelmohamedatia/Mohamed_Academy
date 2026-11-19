import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, type Content } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === "production";

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const TUTOR_SYSTEM_INSTRUCTION = `أنت المساعد الأكاديمي الذكي لمنصة "بايثون أكاديمي" المخصصة لطلاب تكنولوجيا المعلومات وعلوم الحاسب (IT & Computer Science).
مهمتك مساعدة طلاب تكنولوجيا المعلومات على فهم محاضرات لغة بايثون المعتمدة بدقة علمية وتقنية عالية.
نطاق المنهج المعتمد في المنصة:
- المحاضرة 2: تشغيل بايثون عبر Google Colab، برنامج Hello World ودالة print()، المتغيرات (Variables) وتخزينها في الذاكرة، أنواع البيانات (int, float, str, bool) ودالة type()، علامات التنصيص، أهمية النوع (Type Matters)، التحويل الصريح (int(), float(), str()) والضمني، قواعد المعرفات (Identifiers) وحساسية الأحرف، الكلمات المحجوزة (Reserved Words)، التعابير الرقمية وأولوية العمليات (Operator Precedence)، الإسناد المتعدد، إدخال المستخدم input()، كتابة الأسطر المتعددة (\ و الأقواس)، والتعليقات (# و """).
- المحاضرة 3: معالجة أخطاء الإدخال (try / except) و ValueError، عوامل الإسناد (=, +=, -=, *=, /=, %=, //=, **=)، عوامل المقارنة (==, !=, >, >=, <, <=)، العوامل المنطقية (and, or, not) وجداول الصواب، خرائط التدفق (Flowcharts)، الجمل الشرطية (if, if-else, if-elif-else)، المسافة البادئة (Indentation)، القرارات المتداخلة (Nested Decisions)، والفرق بين elif و multiple if.
- المحاضرة 4: الحلقات التكرارية (Loops)، حلقة while والحلقة اللانهائية (Infinite Loop) والحلقة الصفرية (Zero-Iteration Loop) و while + else، حلقة for ودالة range(start, stop, step)، التكرار على السلاسل النصية والقوائم، for + else، الحلقات المتداخلة (Nested Loops)، وتعليمات break و continue.
- المحاضرة 5: القوائم (Lists)، الفهرسة (Indexing) من 0، دالة len() وآخر فهرس len-1، تحديث العناصر، التكرار على القوائم (Simple loop vs Index loop)، تقطيع القوائم (List Slicing)، الدوال المدمجة (len, min, max, sum, sorted, list, type)، وطرق القوائم (append, insert, extend, remove, pop, clear, index, count, sort)، والسلاسل النصية (Strings) وفهرستها وطولها والتكرار عليها بـ while و for وتقطيعها وتنظيفها بـ strip().
- المحاضرة 6: الدوال البرمجية (Functions)، الدوال المدمجة مقابل المخصصة (def)، هيكل الدالة، الفرق بين التعريف والاستدعاء (store and reuse)، المعاملات والوسائط (Parameters & Arguments)، أنواع الوسائط (Default, Positional, Keyword)، جملة return مقابل print()، وإرجاع None.

قواعد أسلوبك:
1. اشرح باللغة العربية الواضحة والمبسطة للمبتدئين، مع الحفاظ على المصطلحات التقنية والكلمات البرمجية بالإنجليزية.
2. لا تخترع موضوعات متقدمة خارج المنهج (مثل OOP المتقدم أو Decorators) إلا إذا سأل الطالب صراحة، وحافظ على ربط الإجابات بالمفاهيم المعتمدة.
3. عند كتابة كود بايثون، ضعه داخل كتلة كود نظيفة واشرح كل سطر والنتيجة المتوقعة والأخطاء الشائعة.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Multi-turn Gemini AI Tutor Chat endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, model = "gemini-4-hydrogen", lessonContext } = req.body as {
        messages?: Array<{ role: "user" | "model"; text: string }>;
        model?: string;
        lessonContext?: string;
      };

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "يرجى إرسال رسالة صالحة للمساعد الذكي." });
        return;
      }

      const allowedModels = new Set(["gemini-4-hydrogen", "gemini-3.1-flash-lite"]);
      const selectedModel = allowedModels.has(model) ? model : "gemini-4-hydrogen";

      const ai = createGeminiClient();
      const lastMessage = messages[messages.length - 1];
      const priorHistory: Content[] = messages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const contextAddition = lessonContext
        ? `\n\nسياق الدرس الحالي الذي يتصفحه الطالب الآن:\n${lessonContext}`
        : "";

      const chat = ai.chats.create({
        model: selectedModel,
        history: priorHistory,
        config: {
          systemInstruction: TUTOR_SYSTEM_INSTRUCTION + contextAddition,
        },
      });

      const response = await chat.sendMessage({
        message: lastMessage.text,
      });

      res.json({
        reply: response.text ?? "لم يتمكن المساعد من توليد رد في هذه اللحظة.",
        model: selectedModel,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message === "GEMINI_API_KEY_MISSING") {
        res.status(503).json({
          error: "مفتاح GEMINI_API_KEY غير مضبوط في إعدادات الخادم (Settings > Secrets).",
        });
        return;
      }
      const status = (err as { status?: number })?.status || 500;
      if (status === 403 || status === 400) {
        res.status(status).json({
          error: "يرجى التحقق من صلاحية مفتاح API في لوحة Settings > Secrets.",
          details: message,
        });
        return;
      }
      if (status === 429) {
        res.status(429).json({
          error: "تم تجاوز الحد المسموح من الطلبات مؤقتاً. يرجى المحاولة بعد قليل أو استخدام مفتاح مدفوع.",
          details: message,
        });
        return;
      }
      res.status(500).json({
        error: "حدث خطأ أثناء الاتصال بالمساعد الذكي.",
        details: message,
      });
    }
  });

  // High-quality educational diagram/image generation using gemini-3-pro-image-preview
  app.post("/api/gemini/image", async (req, res) => {
    try {
      const {
        prompt,
        imageSize = "1K",
        aspectRatio = "16:9",
      } = req.body as {
        prompt?: string;
        imageSize?: "1K" | "2K" | "4K";
        aspectRatio?: "1:1" | "4:3" | "16:9" | "3:4" | "9:16";
      };

      if (!prompt || !prompt.trim()) {
        res.status(400).json({ error: "يرجى كتابة وصف المخطط أو الصورة التعليمية المطلوبة." });
        return;
      }

      const validSizes = new Set(["1K", "2K", "4K"]);
      const size = validSizes.has(imageSize) ? imageSize : "1K";
      const validRatios = new Set(["1:1", "4:3", "16:9", "3:4", "9:16"]);
      const ratio = validRatios.has(aspectRatio) ? aspectRatio : "16:9";

      const ai = createGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: {
          parts: [
            {
              text: `Clean computer science educational technical diagram illustration on a deep navy background with cyan and violet accents, high clarity, studio educational textbook style: ${prompt.trim()}`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: ratio,
            imageSize: size,
          },
        },
      });

      let imageDataUrl: string | null = null;
      let textNote = "";

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? "image/png";
          imageDataUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textNote += part.text;
        }
      }

      if (!imageDataUrl) {
        res.status(502).json({
          error: "لم يرجع النموذج بيانات صورة صالحة.",
          details: textNote,
        });
        return;
      }

      res.json({
        imageUrl: imageDataUrl,
        imageSize: size,
        aspectRatio: ratio,
        model: "gemini-3-pro-image-preview",
        note: textNote,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message === "GEMINI_API_KEY_MISSING") {
        res.status(503).json({
          error: "مفتاح GEMINI_API_KEY غير مضبوط في Settings > Secrets.",
        });
        return;
      }
      const status = (err as { status?: number })?.status || 500;
      if (status === 429 || status === 403) {
        res.status(status).json({
          error:
            "يتطلب نموذج توليد الصور فائق الجودة (gemini-3-pro-image-preview) مفتاح API مدفوعاً مفعّلاً في Settings > Secrets، أو تم بلوغ حد الحصة اليومية.",
          details: message,
        });
        return;
      }
      if (status === 404) {
        res.status(404).json({
          error: "نموذج الصور المطلوب غير متاح حالياً في هذا الإعداد.",
          details: message,
        });
        return;
      }
      res.status(500).json({
        error: "تعذر توليد المخطط التعليمي بالذكاء الاصطناعي.",
        details: message,
      });
    }
  });

  let cachedStandaloneHtml: string | null = null;

  app.get("/api/share-info", (req, res) => {
    const envUrl = process.env.APP_URL || "";
    const reqOrigin = `${req.protocol}://${req.get("host") || ""}`;
    const rawUrl = envUrl.startsWith("http") ? envUrl : reqOrigin;
    const sharedUrl = rawUrl.includes("ais-dev-")
      ? rawUrl.replace("ais-dev-", "ais-pre-")
      : rawUrl;
    res.json({
      sharedUrl,
      devUrl: rawUrl,
    });
  });

  // Generates a single self-contained interactive HTML file of the entire platform
  // that runs forever in any browser (even via file:// or static Drive download).
  app.get("/api/export-standalone", async (req, res) => {
    try {
      const distDir = path.resolve(__dirname, "dist");
      const distIndexPath = path.join(distDir, "index.html");
      const forceFresh = req.query.fresh === "1";

      if (!cachedStandaloneHtml || forceFresh || !fs.existsSync(distIndexPath)) {
        if (!isProduction) {
          const { build } = await import("vite");
          await build({ logLevel: "silent" });
        }

        if (!fs.existsSync(distIndexPath)) {
          res.status(500).json({ error: "تعذر بناء النسخة المستقلة من التطبيق." });
          return;
        }

        let html = fs.readFileSync(distIndexPath, "utf-8");

        // Inline stylesheet links (use callback to avoid special $ replacement tokens)
        html = html.replace(
          /<link\s+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/gi,
          (match, href: string) => {
            const relPath = href.replace(/^\//, "");
            const cssPath = path.join(distDir, relPath);
            if (fs.existsSync(cssPath)) {
              const css = fs.readFileSync(cssPath, "utf-8");
              return `<style>\n${css}\n</style>`;
            }
            return match;
          }
        );

        // Extract and inline JS scripts safely as classic inline script before </body>
        const inlinedScripts: string[] = [];
        html = html.replace(
          /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/gi,
          (match, src: string) => {
            const relPath = src.replace(/^\//, "");
            const jsPath = path.join(distDir, relPath);
            if (fs.existsSync(jsPath)) {
              const js = fs.readFileSync(jsPath, "utf-8").replace(/<\/script/gi, "<\\/script");
              inlinedScripts.push(js);
              return "";
            }
            return match;
          }
        );

        const runtimeScript =
          `<script>window.__STANDALONE_OFFLINE__ = true;</script>\n` +
          inlinedScripts.map((js) => `<script>\n${js}\n</script>`).join("\n");

        html = html.replace("</body>", () => `${runtimeScript}\n</body>`);
        cachedStandaloneHtml = html;
      }

      if (req.query.download === "1") {
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="python-academy-mohamed-adel.html"'
        );
      }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(cachedStandaloneHtml);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(500).json({
        error: "حدث خطأ أثناء تجهيز النسخة التفاعلية المستقلة.",
        details: message,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      const indexFile = path.join(distDir, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build output not found.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
