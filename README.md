# بايثون أكاديمي — نسخة النشر

## النشر على Render
1. ارفع محتويات هذا المجلد إلى مستودع GitHub.
2. في Render اختر **New → Blueprint** واربط المستودع، أو أنشئ **Web Service** واختر المستودع.
3. استخدم إعدادات `render.yaml` الموجودة في جذر المشروع.
4. في إعدادات الخدمة على Render أضف متغير البيئة `GEMINI_API_KEY` وضع فيه مفتاح Gemini API الخاص بك. لا تضع المفتاح داخل ملفات المشروع ولا ترفعه إلى GitHub.
5. ابدأ النشر. أمر البناء هو `npm install --include=dev && npm run build` وأمر التشغيل `npm start`.

## تنبيه بخصوص Firebase وGoogle Drive
المشروع يحتوي على `firebase-applet-config.json`، وهو إعداد عميل Firebase الذي يستخدمه التطبيق. وجود Firebase Web API key في هذا الملف أمر معتاد في تطبيقات الويب، لكنه ليس بديلًا عن تأمين Firebase Security Rules.
بعد ظهور نطاق Render (مثل `اسم-الخدمة.onrender.com`)، أضفه إلى **Authorized domains** في إعدادات Firebase Authentication، وراجع إعدادات OAuth/Google Drive المسموح بها في Google Cloud إذا كنت تستخدم ميزة Drive.

## ملاحظات
- تم استبعاد مجلد `.aistudio` لأنه يحتوي على سجلات وملفات عمل داخلية غير مطلوبة لتشغيل الموقع.
- تم الإبقاء على ملفات `src` و`public` وملفات PDF المستخدمة داخل الموقع.
- لا ترفع ملفات `.env` أو مفاتيح API أو أسرار OAuth إلى مستودع عام.
