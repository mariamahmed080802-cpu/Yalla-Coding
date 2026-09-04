/*
  ============================================
  بيانات الكورسات — الملف الوحيد اللي هتعدلي فيه
  ============================================

  كل "عقدة" (node) لازم يكون فيها واحدة من اتنين:
    - "children": array فيها عُقد تانية (يعني لسه فيه مستوى جوّاها)
    - "link": رابط جوجل شيت/فورم (يعني دي آخر نقطة، تدوس تفتح اللينك)

  ملحوظة: أي عقدة ممكن يكون فيها كمان "color" (هيكس كود) لتلوين
  الكارت بتاعها، و"subtitle" لسطر وصف صغير تحت العنوان (اختياري).

  عشان تضيفي كورس جديد: انسخي أي بلوك { ... } جوه "courses"
  وعدّلي القيم. مفيش أي حاجة تانية محتاجة تتغير في باقي الملفات.
*/

var coursesData = {
  "courses": [
    {
      "id": "bac2",
      "title": "تانية بكالوريا",
      "subtitle": "المسار النظري والعملي",
      "color": "#16324F",
      "children": [
        {
          "id": "theory",
          "title": "نظري",
          "children": [
            {
              "id": "ai",
              "title": "AI",
              "children": [
                { "id": "ai_1", "title": "Sheet 1", "link": "https://docs.google.com/spreadsheets/d/example1" },
                { "id": "ai_2", "title": "Sheet 2", "link": "https://docs.google.com/spreadsheets/d/example2" },
                { "id": "ai_3", "title": "تمارين", "link": "https://docs.google.com/spreadsheets/d/example3" }
              ]
            },
            {
              "id": "cybersecurity",
              "title": "Cybersecurity",
              "children": [
                { "id": "cy_1", "title": "Sheet 1", "link": "https://docs.google.com/spreadsheets/d/example4" },
                { "id": "cy_2", "title": "Sheet 2", "link": "https://docs.google.com/spreadsheets/d/example5" }
              ]
            },
            {
              "id": "webdev",
              "title": "Web Development",
              "children": [
                { "id": "wd_1", "title": "Sheet 1", "link": "https://docs.google.com/spreadsheets/d/example6" },
                { "id": "wd_2", "title": "Sheet 2", "link": "https://docs.google.com/spreadsheets/d/example7" },
                { "id": "wd_3", "title": "مشروع نهائي", "link": "https://docs.google.com/spreadsheets/d/example8" }
              ]
            }
          ]
        },
        {
          "id": "practical",
          "title": "عملي",
          "children": [
            { "id": "prac_1", "title": "مشروع 1", "link": "https://docs.google.com/spreadsheets/d/example9" },
            { "id": "prac_2", "title": "مشروع 2", "link": "https://docs.google.com/spreadsheets/d/example10" }
          ]
        }
      ]
    },
    {
      "id": "sec1",
      "title": "اولى ثانوي",
      "subtitle": "المحتوى الأسبوعي",
      "color": "#2E6B5E",
      "children": [
        { "id": "week1", "title": "الأسبوع 1", "link": "https://docs.google.com/spreadsheets/d/example11" },
        { "id": "week2", "title": "الأسبوع 2", "link": "https://docs.google.com/spreadsheets/d/example12" },
        { "id": "week3", "title": "الأسبوع 3", "link": "https://docs.google.com/spreadsheets/d/example13" }
      ]
    }
  ]
};
