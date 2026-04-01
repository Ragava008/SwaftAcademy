/**
 * Swaft Academy - Main Application JavaScript
 * Handles routing, state, interactions, and dynamic data
 * Uses data-store.js for all persistent data
 */

// ======= APP STATE =======
const APP = {
  currentRole: null,
  currentPage: 'dashboard',
  currentUser: null,      // logged-in student object (for student/parent role)
  currentStudentId: null,  // id of the logged-in student
};

// Build DATA from store (backward compat for render functions)
let DATA = buildDataObject();

function refreshData() {
  DATA = buildDataObject();
}

// ======= CHART COLORS =======
const CHART_COLORS = {
  primary: 'rgba(108, 99, 255, 1)',
  primaryAlpha: 'rgba(108, 99, 255, 0.2)',
  secondary: 'rgba(0, 212, 170, 1)',
  secondaryAlpha: 'rgba(0, 212, 170, 0.2)',
  accent: 'rgba(255, 107, 107, 1)',
  accentAlpha: 'rgba(255, 107, 107, 0.2)',
  warning: 'rgba(255, 217, 61, 1)',
  warningAlpha: 'rgba(255, 217, 61, 0.2)',
  orange: 'rgba(255, 154, 60, 1)',
};

// ======= CHART.JS DEFAULT CONFIG =======
function setChartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.color = '#A0A8CC';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Inter', sans-serif";
}

// ======= UTILITY FUNCTIONS =======
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(index) {
  const gradients = [
    'linear-gradient(135deg,#6C63FF,#8B85FF)',
    'linear-gradient(135deg,#00D4AA,#00FFD0)',
    'linear-gradient(135deg,#FF6B6B,#FF9A9A)',
    'linear-gradient(135deg,#FF9A3C,#FFD93D)',
    'linear-gradient(135deg,#A855F7,#D946EF)',
    'linear-gradient(135deg,#0EA5E9,#38BDF8)',
  ];
  return gradients[index % gradients.length];
}

function feeBadge(status) {
  const map = {
    paid: '<span class="badge badge-success">✓ Paid</span>',
    pending: '<span class="badge badge-warning">⏳ Pending</span>',
    overdue: '<span class="badge badge-danger">⚠ Overdue</span>',
  };
  return map[status] || '';
}

function marksBadge(marks) {
  if (marks >= 90) return '<span class="badge badge-success">Excellent</span>';
  if (marks >= 75) return '<span class="badge badge-primary">Good</span>';
  if (marks >= 60) return '<span class="badge badge-warning">Average</span>';
  return '<span class="badge badge-danger">Needs Help</span>';
}

// ======= PAGE ROUTER =======
function navigateTo(page, role) {
  const r = role || APP.currentRole;
  APP.currentPage = page;
  refreshData();

  // Update nav active state
  $$('.nav-item').forEach(item => item.classList.remove('active'));
  const activeNav = $(`[data-page="${page}"]`);
  if (activeNav) activeNav.classList.add('active');

  // Update topbar title
  const pageTitles = {
    dashboard: '📊 Dashboard',
    students: '👩‍🎓 Students',
    batches: '📚 Batches',
    attendance: '📅 Attendance',
    homework: '📝 Homework',
    tests: '🧪 Tests',
    classes: '🎥 Classes',
    fees: '💰 Fee Management',
    schedule: '🗓️ Schedule',
    teachinglog: '📔 Teaching Log',
    doubts: '💬 Doubts',
    videos: '🎬 Video Library',
    practice: '✏️ Practice',
    flashcards: '🃏 Flashcards',
    leaderboard: '🏆 Leaderboard',
    progress: '📈 My Progress',
    report: '📋 Report Card',
    notifications: '🔔 Updates',
    settings: '⚙️ Profile Settings',
  };
  const titleEl = document.getElementById('topbarTitle');
  if (titleEl) titleEl.textContent = pageTitles[page] || page;

  // Render page
  const pageEl = document.getElementById('pageContent');
  if (!pageEl) return;
  pageEl.innerHTML = '';

  switch (r) {
    case 'tutor': renderTutorPage(page, pageEl); break;
    case 'student': renderStudentPage(page, pageEl); break;
    case 'parent': renderParentPage(page, pageEl); break;
  }

  // Animate in
  pageEl.classList.add('fade-in');
  setTimeout(() => pageEl.classList.remove('fade-in'), 400);

  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');

  // Re-init charts after render
  setTimeout(() => initChartsForPage(page, r), 100);
}

// ======= SIDEBAR TOGGLE =======
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('mobile-open');
  overlay.classList.toggle('active');
}

// ======= TAB SWITCHING =======
function switchTab(tabGroup, tabId) {
  $$(`[data-tabgroup="${tabGroup}"] .tab-btn`).forEach(btn => btn.classList.remove('active'));
  $$(`[data-tabgroup="${tabGroup}"] .tab-content`).forEach(panel => panel.classList.remove('active'));
  const activeBtn = $(`[data-tabgroup="${tabGroup}"] [data-tab="${tabId}"]`);
  const activePanel = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

// ======= MODAL =======
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// ======= CHART INIT =======
let chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function createChart(id, config) {
  destroyChart(id);
  const canvas = document.getElementById(id);
  if (!canvas) return;
  chartInstances[id] = new Chart(canvas.getContext('2d'), config);
  return chartInstances[id];
}

function initChartsForPage(page, role) {
  if (typeof Chart === 'undefined') return;
  setChartDefaults();

  if (role === 'tutor') {
    if (page === 'dashboard') initTutorDashboardCharts();
    if (page === 'students') initStudentAnalyticsCharts();
    if (page === 'tests') initTestCharts();
    if (page === 'fees') initFeeCharts();
  }
  if (role === 'student') {
    if (page === 'dashboard') initStudentDashCharts();
    if (page === 'progress') initProgressCharts();
  }
  if (role === 'parent') {
    if (page === 'dashboard') initParentCharts();
  }
}

function initTutorDashboardCharts() {
  const students = Store_getStudents();
  const batches = Store_getBatches();
  createChart('batchPerformanceChart', {
    type: 'bar',
    data: {
      labels: batches.map(b => b.name),
      datasets: [{
        label: 'Average Score %',
        data: batches.map(b => {
          const batchStudents = students.filter(s => s.batch === b.name);
          if (batchStudents.length === 0) return 0;
          return Math.round(batchStudents.reduce((sum, s) => sum + s.marks, 0) / batchStudents.length);
        }),
        backgroundColor: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.orange],
        borderRadius: 8, borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });

  // Attendance Trends Chart (Past 7 Days)
  const records = Store_getAttendance();
  const past7Days = [];
  const past7Labels = [];
  for(let i=6; i>=0; i--) {
     const d = new Date();
     d.setDate(d.getDate() - i);
     past7Days.push(d.toISOString().split('T')[0]);
     past7Labels.push(d.toLocaleDateString('en-US', {weekday:'short'}));
  }
  
  const dailyAttendanceAvg = past7Days.map(dateStr => {
     const dayRecs = records.filter(r => r.date === dateStr);
     if(dayRecs.length === 0) return 0; // Or carry over previous data, but 0 is safe assuming unmarked is 0
     const present = dayRecs.filter(r => r.status === 'present' || r.status === 'late').length;
     return Math.round((present / dayRecs.length) * 100);
  });

  createChart('attendanceTrendsChart', {
    type: 'line',
    data: {
      labels: past7Labels,
      datasets: [{
        label: 'Attendance %',
        data: dailyAttendanceAvg,
        borderColor: CHART_COLORS.secondary,
        backgroundColor: CHART_COLORS.secondaryAlpha,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: CHART_COLORS.secondary
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function initStudentAnalyticsCharts() {
  const students = Store_getStudents();
  createChart('gradeDistributionChart', {
    type: 'doughnut',
    data: {
      labels: ['Excellent (90+)', 'Good (75-90)', 'Average (60-75)', 'Below (< 60)'],
      datasets: [{
        data: [
          students.filter(s => s.marks >= 90).length,
          students.filter(s => s.marks >= 75 && s.marks < 90).length,
          students.filter(s => s.marks >= 60 && s.marks < 75).length,
          students.filter(s => s.marks < 60).length,
        ],
        backgroundColor: [CHART_COLORS.secondary, CHART_COLORS.primary, CHART_COLORS.warning, CHART_COLORS.accent],
        borderWidth: 0, spacing: 3
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { padding: 15 } } },
      cutout: '65%'
    }
  });
}

function initTestCharts() {
  const students = Store_getStudents();
  createChart('testResultsChart', {
    type: 'bar',
    data: {
      labels: students.map(s => s.name),
      datasets: [{
        label: 'Average Score',
        data: students.map(s => s.marks),
        backgroundColor: students.map(s =>
          s.marks >= 90 ? CHART_COLORS.secondary : s.marks >= 75 ? CHART_COLORS.primary : s.marks >= 60 ? CHART_COLORS.warning : CHART_COLORS.accent
        ),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function initFeeCharts() {
  const students = Store_getStudents();
  const paid = students.filter(s => s.fees === 'paid').length;
  const pending = students.filter(s => s.fees === 'pending').length;
  const overdue = students.filter(s => s.fees === 'overdue').length;

  createChart('feeStatusChart', {
    type: 'doughnut',
    data: {
      labels: ['Paid', 'Pending', 'Overdue'],
      datasets: [{
        data: [paid, pending, overdue],
        backgroundColor: [CHART_COLORS.secondary, CHART_COLORS.warning, CHART_COLORS.accent],
        borderWidth: 0, spacing: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      cutout: '70%'
    }
  });
}

function initStudentDashCharts() {
  createChart('studentProgressChart', {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'Score %', data: [0, 0, APP.currentUser ? APP.currentUser.marks : 0],
        borderColor: CHART_COLORS.primary, backgroundColor: CHART_COLORS.primaryAlpha,
        tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: CHART_COLORS.primary
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function initProgressCharts() {
  createChart('subjectProgressChart', {
    type: 'radar',
    data: {
      labels: ['Attendance', 'Tests', 'Homework'],
      datasets: [{
        label: 'You', data: [APP.currentUser?.attendance || 0, APP.currentUser?.marks || 0, 0],
        borderColor: CHART_COLORS.primary, backgroundColor: CHART_COLORS.primaryAlpha, pointRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { r: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#A0A8CC' } } }
    }
  });
}

function initParentCharts() {
  createChart('childProgressChart', {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'Score %', data: [0, 0, APP.currentUser ? APP.currentUser.marks : 0],
        borderColor: CHART_COLORS.primary, backgroundColor: CHART_COLORS.primaryAlpha,
        tension: 0.4, fill: true, pointRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ======= GENERATE CALENDAR =======
function generateCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const todayDate = today.getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  let html = '<div class="calendar-grid">';
  daysOfWeek.forEach(d => { html += `<div class="cal-header-day">${d}</div>`; });
  for (let i = 0; i < firstDay; i++) html += '<div class="cal-day other-month"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === todayDate;
    html += `<div class="cal-day${isToday ? ' today' : ''}" onclick="showToast('Day ${d}','info')">${d}</div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

// ======= QUIZ STATE =======
let quizState = { current: 0, answers: {}, submitted: false };

function selectOption(qId, optIndex) {
  if (quizState.submitted) return;
  quizState.answers[qId] = optIndex;
  $$(`[data-qid="${qId}"] .mcq-option`).forEach((opt, i) => {
    opt.classList.toggle('selected', i === optIndex);
  });
}

function submitQuiz() {
  quizState.submitted = true;
  let correct = 0;
  const questions = window.currentPracticeQuestions || Store_getQuestions();
  questions.forEach(q => {
    const chosen = quizState.answers[q.id];
    $$(`[data-qid="${q.id}"] .mcq-option`).forEach((opt, i) => {
      if (i === q.correct) opt.classList.add('correct');
      else if (i === chosen && i !== q.correct) opt.classList.add('wrong');
    });
    if (chosen === q.correct) correct++;
    
    // Show explanation
    const exp = document.getElementById(`exp-${q.id}`);
    if (exp) exp.style.display = 'block';
  });
  const score = Math.round((correct / questions.length) * 100);
  showToast(`Quiz complete! Score: ${correct}/${questions.length} (${score}%)`, score >= 70 ? 'success' : 'warning');
  document.getElementById('submitQuizBtn')?.setAttribute('disabled', true);
}

// ======= FLASHCARD STATE =======
let flashcardIndex = 0;

function flipFlashcard() {
  document.getElementById('mainFlashcard')?.classList.toggle('flipped');
}

function nextFlashcard() {
  flashcardIndex = (flashcardIndex + 1) % DATA.flashcards.length;
  updateFlashcard();
}

function prevFlashcard() {
  flashcardIndex = (flashcardIndex - 1 + DATA.flashcards.length) % DATA.flashcards.length;
  updateFlashcard();
}

function updateFlashcard() {
  const card = DATA.flashcards[flashcardIndex];
  if (!card) return;
  const el = document.getElementById('mainFlashcard');
  if (el) {
    el.classList.remove('flipped');
    el.querySelector('.fc-question').textContent = card.q;
    el.querySelector('.fc-answer').textContent = card.a;
    document.getElementById('flashcardCounter').textContent = `${flashcardIndex + 1} / ${DATA.flashcards.length}`;
  }
}

// ======= SEARCH/FILTER =======
function filterStudents(query) {
  const rows = $$('#studentsTableBody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
  });
}

// ======= SEND NOTIFICATION =======
function sendNotification(type) {
  const messages = {
    parent: 'Parent notifications sent via WhatsApp & Email ✓',
    homework: 'Homework reminder sent to all students ✓',
    fee: 'Fee reminder sent to pending students ✓',
    test: 'Test reminder sent to all students ✓',
  };
  showToast(messages[type] || 'Notification sent!', 'success');
}

// ======= CIRCULAR PROGRESS SVG =======
function circularProgress(percent, color = '#6C63FF', size = 100) {
  const r = 40, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  const bg = color === '#6C63FF' ? '#1E2138' : '#1a2a2a';
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${bg}" stroke-width="10"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="10"
      stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ / 4}" stroke-linecap="round"
      transform="rotate(-90 50 50)"/>
    <text x="50" y="46" text-anchor="middle" font-size="18" font-weight="800" fill="white" font-family="Inter">${percent}%</text>
    <text x="50" y="62" text-anchor="middle" font-size="10" fill="#A0A8CC" font-family="Inter">Score</text>
  </svg>`;
}

function logout() {
  localStorage.removeItem('swaft_last_session');
  window.location.href = 'index.html';
}

// ======= INIT APP =======
window.APP = APP;
window.DATA = DATA;
window.refreshData = refreshData;
window.navigateTo = navigateTo;
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.switchTab = switchTab;
window.toggleSidebar = toggleSidebar;
window.filterStudents = filterStudents;
window.sendNotification = sendNotification;
window.selectOption = selectOption;
window.submitQuiz = submitQuiz;
window.flipFlashcard = flipFlashcard;
window.nextFlashcard = nextFlashcard;
window.prevFlashcard = prevFlashcard;
window.circularProgress = circularProgress;
window.generateCalendar = generateCalendar;
window.getAvatarColor = getAvatarColor;
window.getInitials = getInitials;
window.formatDate = formatDate;
window.feeBadge = feeBadge;
window.marksBadge = marksBadge;
window.createChart = createChart;
window.destroyChart = destroyChart;
window.CHART_COLORS = CHART_COLORS;
window.logout = logout;
