/*
  ============================================
  إعدادات مصدر البيانات
  ============================================

  mode:
    "sheet" → الصفحة هتجيب الكورسات من جوجل شيت (لينك CSV منشور)
    "local" → الصفحة هتستخدم data.js بس (النسخة المحلية)

  لو الشيت مش متاح لأي سبب (النت وقع، اللينك اتغيّر، إلخ)،
  الصفحة بترجع تلقائيًا لـ data.js عشان متفضلش فاضية.

  إزاي تجيبي sheetCsvUrl:
    1. من جوجل شيت: File → Share → Publish to web
    2. اختاري الشيت (الصفحة) اللي فيها الجدول
    3. اختاري صيغة CSV
    4. دوسي Publish وانسخي اللينك اللي هيظهرلك
    5. الصقيه هنا بدل النص PASTE_YOUR_PUBLISHED_CSV_LINK_HERE
*/

var dataSource = {
  mode: "sheet",
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0uVOO_YJ5v1OuskH6Gnzmj_2HYKHdq21KzvS2Ryl-2tl_fxChQYmOEo_Zj8DBQEVlD8d4SiH_WuTm/pub?output=csv"
};
