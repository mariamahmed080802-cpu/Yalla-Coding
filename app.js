/* ============================================
   حالة التنقل: مسار العقد اللي دخلناها لحد دلوقتي
   ============================================ */
let path = []; // array of nodes, من الجذر (كورس) لحد المكان الحالي

const root = document.getElementById('app');

/* أيقونات SVG بسيطة (مفيش أي مكتبة خارجية مطلوبة) */
const icons = {
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  sheet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/><path d="M9 12h6M9 16h6M9 8h2"/></svg>`
};

/* ============================================
   قراءة CSV (بارسر بسيط، بيتعامل مع فواصل جوه علامات
   تنصيص "..." عشان لو أي عنوان فيه فاصلة عادية)
   ============================================ */
function splitCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else {
        cur += char;
      }
    } else {
      if (char === '"') inQuotes = true;
      else if (char === ',') { result.push(cur); cur = ''; }
      else cur += char;
    }
  }
  result.push(cur);
  return result;
}

function parseCSV(text) {
  const lines = text.split(/\r\n|\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = splitCSVLine(lines[0]).map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (values[idx] || '').trim(); });
    rows.push(obj);
  }
  return rows;
}

/* ============================================
   تحويل صفوف الشيت (flat) لشجرة (nested) —
   كل صف عنده id و parent_id، والباقي بيتبني من العلاقة دي
   ============================================ */
function buildTreeFromRows(rows) {
  const byId = {};
  rows.forEach(r => {
    if (!r.id) return;
    byId[r.id] = {
      id: r.id,
      title: r.title || '',
      subtitle: r.subtitle || undefined,
      color: r.color || undefined,
      link: r.link || undefined,
      children: []
    };
  });

  const roots = [];
  rows.forEach(r => {
    if (!r.id) return;
    const node = byId[r.id];
    if (r.parent_id && byId[r.parent_id]) {
      byId[r.parent_id].children.push(node);
    } else {
      roots.push(node);
    }
  });

  // شيلي خانة children الفاضية عشان isLeaf() تشتغل صح
  function clean(node) {
    if (node.children.length === 0) delete node.children;
    else node.children.forEach(clean);
  }
  roots.forEach(clean);
  return roots;
}

/* ============================================
   تحميل البيانات: نجرّب الشيت الأول، ولو فشل
   (النت وقع / اللينك مش متظبط) نرجع للنسخة المحلية
   ============================================ */
async function loadData() {
  const usingSheet = typeof dataSource !== 'undefined' && dataSource.mode === 'sheet' &&
    dataSource.sheetCsvUrl && !dataSource.sheetCsvUrl.includes('PASTE_YOUR');

  if (!usingSheet) return; // سيبي coursesData زي ما هي من data.js

  try {
    const res = await fetch(dataSource.sheetCsvUrl);
    if (!res.ok) throw new Error('فشل تحميل الشيت');
    const text = await res.text();
    const rows = parseCSV(text);
    const tree = buildTreeFromRows(rows);
    if (tree.length > 0) {
      coursesData = { courses: tree };
      hideStatusBanner();
    } else {
      throw new Error('الشيت اتحمّل لكن مفيش بيانات صحيحة فيه');
    }
  } catch (err) {
    console.warn('تعذر تحميل البيانات من جوجل شيت، هيتم استخدام النسخة المحلية:', err);
    showStatusBanner('⚠️ مقدرش أجيب البيانات من جوجل شيت دلوقتي — الصفحة بتعرض نسخة محلية قديمة. راجعي لينك الشيت في config.js.');
    // coursesData هتفضل زي ما هي من data.js (fallback تلقائي)
  }
}

function showStatusBanner(message) {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = message;
  banner.classList.add('visible');
}

function hideStatusBanner() {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.classList.remove('visible');
}

function renderLoadingState() {
  root.innerHTML = `<div class="empty">جاري تحميل الكورسات...</div>`;
}

/* ============================================
   نقطة الدخول: هل العقدة "ورقة" (leaf) وليها لينك،
   ولا لسه فيها children؟
   ============================================ */
function isLeaf(node) {
  return !node.children || node.children.length === 0;
}

/* ============================================
   الدخول جوه عقدة / الرجوع خطوة
   ============================================ */
function enter(node) {
  if (isLeaf(node)) {
    window.open(node.link, '_blank', 'noopener');
    return;
  }
  path.push(node);
  render();
}

function goBack() {
  path.pop();
  render();
}

function goHome() {
  path = [];
  render();
}

/* ============================================
   العرض الرئيسي
   ============================================ */
function render() {
  root.innerHTML = '';

  if (path.length === 0) {
    renderLanding();
  } else {
    renderLevel();
  }
}

function renderLanding() {
  const hero = document.createElement('section');
  hero.className = 'hero view';
  hero.innerHTML = `
    <h1>اختار الكورس، وابدأ من مكانك</h1>
  `;
  root.appendChild(hero);

  const grid = document.createElement('div');
  grid.className = 'grid view';
  coursesData.courses.forEach(course => {
    grid.appendChild(makeNodeCard(course));
  });
  root.appendChild(grid);
}

function renderLevel() {
  const current = path[path.length - 1];

  // شريط التنقل + زرار الرجوع
  const crumbRow = document.createElement('div');
  crumbRow.className = 'crumb-row view';

  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.setAttribute('aria-label', 'رجوع');
  backBtn.innerHTML = icons.back;
  backBtn.addEventListener('click', goBack);
  crumbRow.appendChild(backBtn);

  const trail = document.createElement('div');
  trail.className = 'crumb-trail';
  const trailParts = path.map((n, i) => {
    if (i === path.length - 1) return `<span class="current">${n.title}</span>`;
    return `<span>${n.title}</span>`;
  });
  trail.innerHTML = trailParts.join('<span class="crumb-sep">/</span>');
  crumbRow.appendChild(trail);

  root.appendChild(crumbRow);

  // محتوى المستوى الحالي
  if (isLeaf(current)) {
    // من المفروض ميوصلش هنا (leaf بتفتح لينك على طول)، لكن احتياطًا:
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'مفيش محتوى هنا لسه.';
    root.appendChild(empty);
    return;
  }

  const allLeaves = current.children.every(isLeaf);

  const container = document.createElement('div');
  container.className = allLeaves ? 'icon-grid view' : 'grid view';

  current.children.forEach(child => {
    container.appendChild(allLeaves ? makeIconCard(child) : makeNodeCard(child));
  });

  root.appendChild(container);
}

/* ============================================
   بناء كارت "مستوى" (كورس / فرع / شابتر)
   ============================================ */
function makeNodeCard(node) {
  const card = document.createElement('button');
  card.className = 'node-card';
  if (node.color) card.style.setProperty('--card-accent', node.color);

  card.innerHTML = `
    <span class="node-title">${node.title}</span>
    ${node.subtitle ? `<span class="node-sub">${node.subtitle}</span>` : ''}
    <span class="node-arrow">${icons.arrow}</span>
  `;
  card.addEventListener('click', () => enter(node));
  return card;
}

/* ============================================
   بناء كارت "أيقونة" (leaf — بتفتح لينك جوجل شيت)
   ============================================ */
function makeIconCard(node) {
  const card = document.createElement('button');
  card.className = 'icon-card';
  card.innerHTML = `
    <span class="icon-glyph">${icons.sheet}</span>
    <span class="icon-title">${node.title}</span>
  `;
  card.addEventListener('click', () => enter(node));
  return card;
}

/* ============================================
   البداية
   ============================================ */
renderLoadingState();
loadData().then(render);