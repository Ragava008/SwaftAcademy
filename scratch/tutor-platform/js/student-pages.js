/**
 * Swaft Academy - Student & Parent Dashboard Pages
 * Student: Study-only (no finance)
 * Parent: Finance + academic overview
 */

// ======= HELPERS =======
function getSubjectTag(subject) {
  const tags = {
    'Physics': 'tag-physics',
    'Math': 'tag-math',
    'Chemistry': 'tag-chemistry',
    'Science': 'tag-science',
    'Social': 'tag-social',
    'English': 'tag-english'
  };
  return `<span class="subject-tag ${tags[subject] || 'badge-primary'}">${subject}</span>`;
}

// ======= STUDENT PAGES =======
function renderStudentPage(page, container) {
  refreshData();
  const renderers = {
    dashboard: renderStudentDashboard,
    videos: renderVideoLibrary,
    practice: renderPractice,
    flashcards: renderFlashcards,
    leaderboard: renderLeaderboard,
    progress: renderStudentProgress,
    doubts: renderStudentDoubts,
    syllabus: renderSyllabus,
    tests: renderStudentTests,
    settings: renderStudentSettings,
  };
  const renderer = renderers[page] || renderStudentDashboard;
  container.innerHTML = renderer();
  afterRenderStudent(page);
}

function afterRenderStudent(page) {
  if (page === 'flashcards') { flashcardIndex = 0; updateFlashcard(); }
  if (page === 'practice') { quizState = { current: 0, answers: {}, submitted: false }; }
}

// ===== STUDENT DASHBOARD =====
function renderStudentDashboard() {
  const s = APP.currentUser || { name: 'Student', class: '—', batch: '—', attendance: 0, marks: 0 };
  const tests = Store_getTests();
  const myScores = tests.flatMap(t => (t.scores||[]).filter(sc => sc.studentId === APP.currentStudentId));
  const allStudents = Store_getStudents();
  const rank = allStudents.sort((a,b) => b.marks - a.marks).findIndex(st => st.id === APP.currentStudentId) + 1;

  return `
  <div class="page-header">
    <h1>Hello, <span class="gradient-text">${s.name}</span> 👋</h1>
    <p>Class ${s.class} – ${s.batch} | Keep up the great work!</p>
  </div>
  ${Store_getNotifications().filter(n => n.type === 'broadcast').slice(0, 1).map(n => `
    <div class="card interactive-card mb-2" style="background:rgba(0,212,170,0.1);border-color:rgba(0,212,170,0.3)">
      <div style="display:flex;align-items:center;gap:1rem">
        <div style="font-size:2rem">📢</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:700;color:var(--secondary)">${n.title}</div>
              <div style="font-size:0.9rem;color:var(--text-secondary);margin-top:0.2rem">${n.message}</div>
            </div>
            ${(n.acknowledgments || []).includes(APP.currentStudentId) 
              ? '<span class="badge badge-success">✓ Acknowledged</span>' 
              : `<button class="btn btn-sm btn-secondary" onclick="doAcknowledge(${n.id})">Got it! 👍</button>`
            }
          </div>
        </div>
      </div>
    </div>
  `).join('')}
  <div class="grid-4 mb-2">
    <div class="stat-card interactive-card" style="border-top:3px solid var(--primary)">
      <div class="stat-icon" style="background:rgba(108,99,255,0.15)">🏆</div>
      <div class="stat-value gradient-text">${rank > 0 ? rank + (rank===1?'st':rank===2?'nd':rank===3?'rd':'th') : '—'}</div>
      <div class="stat-label">Class Rank</div>
    </div>
    <div class="stat-card interactive-card" style="border-top:3px solid var(--secondary)">
      <div class="stat-icon" style="background:rgba(0,212,170,0.15)">📊</div>
      <div class="stat-value" style="color:var(--secondary)">${s.marks}%</div>
      <div class="stat-label">Average Score</div>
    </div>
    <div class="stat-card interactive-card" style="border-top:3px solid var(--accent-yellow)">
      <div class="stat-icon" style="background:rgba(255,217,61,0.15)">📅</div>
      <div class="stat-value" style="color:var(--accent-yellow)">${s.attendance}%</div>
      <div class="stat-label">Attendance</div>
    </div>
    <div class="stat-card interactive-card" style="border-top:3px solid var(--accent-orange)">
      <div class="stat-icon" style="background:rgba(255,154,60,0.15)">🧪</div>
      <div class="stat-value" style="color:var(--accent-orange)">${myScores.length}</div>
      <div class="stat-label">Tests Taken</div>
    </div>
  </div>
  <div class="grid-2 mb-2">
    <div class="card interactive-card">
      <div class="card-header"><div class="card-title">📈 Score Trend</div></div>
      <div class="chart-wrapper"><canvas id="studentProgressChart"></canvas></div>
    </div>
    <div class="card interactive-card">
      <div class="card-header"><div class="card-title">📚 Quick Links</div></div>
      <div class="grid-2">
        <button class="btn btn-secondary interactive-card" onclick="navigateTo('videos','student')" style="justify-content:center;padding:1rem">🎬<br>Videos</button>
        <button class="btn btn-secondary interactive-card" onclick="navigateTo('tests','student')" style="justify-content:center;padding:1rem">🧪<br>Tests</button>
        <button class="btn btn-secondary interactive-card" onclick="navigateTo('practice','student')" style="justify-content:center;padding:1rem">✏️<br>Practice</button>
        <button class="btn btn-secondary interactive-card" onclick="navigateTo('flashcards','student')" style="justify-content:center;padding:1rem">🃏<br>Flashcards</button>
      </div>
    </div>
  </div>

  ${myScores.length > 0 ? `
  <div class="card interactive-card mt-2">
    <div class="card-header"><div class="card-title">🧪 Recent Test Results</div></div>
    ${tests.filter(t => (t.scores||[]).some(sc => sc.studentId === APP.currentStudentId)).map(t => {
      const myScore = t.scores.find(sc => sc.studentId === APP.currentStudentId);
      const pct = myScore ? Math.round(myScore.marks / t.maxMarks * 100) : 0;
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:0.5rem">
        <div><div style="font-weight:600;font-size:0.88rem">${t.name}</div><div style="font-size:0.72rem;color:var(--text-muted)">${t.subject} · ${t.date}</div></div>
        <div style="text-align:right"><div style="font-weight:800;color:${pct>=80?'var(--secondary)':pct>=60?'var(--accent-yellow)':'var(--accent)'}">${myScore?.marks}/${t.maxMarks}</div><div style="font-size:0.72rem;color:var(--text-muted)">${pct}%</div></div>
      </div>`;
    }).join('')}
  </div>` : ''}
  
  <div class="card interactive-card mt-2">
    <div class="card-header"><div class="card-title">🎖️ My Badges</div></div>
    <div style="display:flex;gap:1.5rem;flex-wrap:wrap;padding:0.5rem">
      ${(s.badges || []).map(bid => {
        const b = Store_getBadges().find(x => x.id === bid);
        if (!b) return '';
        const label = s.gender === 'female' ? b.female : s.gender === 'male' ? b.male : b.neutral;
        return `
          <div style="text-align:center;width:80px">
            <div style="font-size:2rem;margin-bottom:0.4rem;filter:drop-shadow(0 0 5px rgba(255,217,61,0.5))">${b.icon}</div>
            <div style="font-size:0.75rem;font-weight:700;line-height:1.2">${label}</div>
          </div>
        `;
      }).join('') || '<div style="color:var(--text-muted);font-size:0.85rem">No badges yet. Keep learning!</div>'}
    </div>
  </div>
  `;
}

// ===== VIDEO LIBRARY =====
function renderVideoLibrary() {
  const s = APP.currentUser || {};
  const mySubjects = s.subjects || [];
  const videos = Store_getVideos().filter(v => mySubjects.includes(v.subject));
  const subjects = [...new Set(videos.map(v => v.subject))];
  return `
  <div class="page-header"><h1>Video Library</h1><p>Watch recorded lectures organized by subject</p></div>
  <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
    <select class="form-control" style="width:160px" id="vidSubjectFilter" onchange="filterVideos()">
      <option value="">All Subjects</option>
      ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
    </select>
  </div>
  <div id="videosGrid" class="grid-3">
    ${videos.map(v => renderVideoCard(v)).join('')}
  </div>
  `;
}

function renderVideoCard(v) {
  const gradients = { Physics: 'rgba(108,99,255,0.3)', Math: 'rgba(0,212,170,0.2)' };
  return `
  <div class="video-card" onclick="openVideoModal(${v.id})">
    <div class="video-thumb" style="background:linear-gradient(135deg,${gradients[v.subject]||'rgba(108,99,255,0.2)'},rgba(0,0,0,0.4))">
      <div class="play-btn">▶</div>
      <div class="video-duration">${v.duration}</div>
    </div>
    <div class="video-info">
      <div class="video-title">Lecture ${v.lecture}: ${v.title}</div>
      <div class="video-meta">
        ${getSubjectTag(v.subject)}
        <span>${v.chapter}</span>
      </div>
    </div>
  </div>`;
}

function openVideoModal(id) {
  const v = Store_getVideos().find(x => x.id === id);
  if (!v) return;
  const existing = document.getElementById('videoPlayerModal');
  if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.id = 'videoPlayerModal';
  modal.innerHTML = `
    <div class="modal" style="max-width:700px">
      <div class="modal-header">
        <span class="modal-title">Lecture ${v.lecture}: ${v.title}</span>
        <button class="modal-close" onclick="closeVideoModal()">✕</button>
      </div>
      <div style="background:var(--bg-secondary);border-radius:var(--radius-md);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;overflow:hidden">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${v.ytId}" frameborder="0" allowfullscreen style="border-radius:var(--radius-md)"></iframe>
      </div>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <button class="btn btn-primary btn-sm" onclick="showToast('Lecture marked as complete!','success'); fireConfetti();">✓ Mark Complete</button>
        <button class="btn btn-secondary btn-sm" onclick="closeVideoModal();navigateTo('doubts','student')">💬 Ask Doubt</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}
function closeVideoModal() { document.getElementById('videoPlayerModal')?.remove(); }

function filterVideos() {
  const sub = document.getElementById('vidSubjectFilter')?.value;
  const filtered = Store_getVideos().filter(v => !sub || v.subject === sub);
  const grid = document.getElementById('videosGrid');
  if (grid) grid.innerHTML = filtered.map(v => renderVideoCard(v)).join('') || '<div style="text-align:center;padding:2rem;color:var(--text-muted)">No videos found</div>';
}

// ===== PRACTICE / QUIZ =====
function renderPractice() {
  const s = APP.currentUser || {};
  const mySubjects = s.subjects || [];
  const stuGrade = String(s.class || '').replace(/\D/g, '') || '11';
  const stuBoard = String(s.board || '').toLowerCase();
  
  const questions = Store_getQuestions().filter(q => 
    (mySubjects.includes(q.subject) || q.subject === 'All') && 
    (String(q.grade) === stuGrade || q.grade === 'All') && 
    (String(q.board).toLowerCase() === stuBoard || q.board === 'All')
  );

  if (questions.length === 0) {
    return `
    <div class="page-header"><h1>Practice MCQs</h1><p>Test your understanding with interactive questions</p></div>
    <div class="card" style="text-align:center;padding:3rem;color:var(--text-muted)">
      <div style="font-size:3rem;margin-bottom:1rem">✏️</div>
      <h3>No questions available yet</h3>
      <p>Your tutor hasn't uploaded practice MCQs for your class (${stuGrade} ${stuBoard.toUpperCase()}) and subjects yet.</p>
    </div>`;
  }

  // Initialize session if not exists
  if (!window.practiceSession || window.practiceSession.stuId !== s.id) {
    window.practiceSession = {
      stuId: s.id,
      questions: questions,
      currentIndex: 0,
      answers: {}, // { qid: selectedIndex }
      submitted: {} // { qid: bool }
    };
  }

  const session = window.practiceSession;
  const q = session.questions[session.currentIndex];
  const isSubmitted = session.submitted[q.id];
  const selectedIdx = session.answers[q.id];

  return `
  <div class="page-header">
    <h1>Practice MCQs</h1>
    <p>Question ${session.currentIndex + 1} of ${session.questions.length}</p>
  </div>
  
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
    <div class="badge badge-primary">Grade ${stuGrade} · ${stuBoard.toUpperCase()}</div>
    <div style="font-size:0.9rem;font-weight:700;color:var(--primary)">${session.currentIndex + 1} / ${session.questions.length}</div>
  </div>

  <div class="card" style="border-left:5px solid var(--primary);animation: fadeIn 0.3s ease">
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
      ${getSubjectTag(q.subject)}
      <span class="badge badge-outline">1 Point</span>
    </div>
    <div style="font-size:1.15rem;font-weight:700;line-height:1.6;margin-bottom:1.5rem">${q.question}</div>
    
    <div style="display:grid;gap:0.75rem">
      ${q.options.map((opt, i) => {
        let style = '';
        let icon = '';
        if (isSubmitted) {
          if (i === q.correct) {
            style = 'background:rgba(0,212,170,0.1);border-color:var(--secondary);color:var(--secondary);font-weight:700';
            icon = ' ✅';
          } else if (i === selectedIdx) {
            style = 'background:rgba(255,107,107,0.1);border-color:var(--accent);color:var(--accent)';
            icon = ' ❌';
          } else {
            style = 'opacity:0.6';
          }
        } else if (i === selectedIdx) {
          style = 'border-color:var(--primary);background:rgba(108,99,255,0.05);box-shadow:var(--shadow-glow)';
        }

        return `
          <div class="mcq-option" style="${style};cursor:${isSubmitted ? 'default' : 'pointer'}" onclick="${isSubmitted ? '' : `selectPracticeOption(${i})`}">
            <div style="display:flex;align-items:center;gap:1rem">
              <div class="option-letter" style="${i === selectedIdx ? 'background:var(--primary);color:white' : ''}">${String.fromCharCode(65+i)}</div>
              <div style="flex:1">${opt}</div>
              <span>${icon}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    ${isSubmitted ? `
      <div style="margin-top:2rem;padding:1.25rem;background:var(--bg-secondary);border-radius:var(--radius-md);border-left:4px solid ${selectedIdx === q.correct ? 'var(--secondary)' : 'var(--accent)'};animation: slideDown 0.3s ease">
        <div style="font-weight:800;font-size:0.95rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem">
          ${selectedIdx === q.correct ? '✨ Correct!' : '📕 Incorrect'}
        </div>
        <div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.5">
          <strong>Explanation:</strong> ${q.explanation || 'The correct answer is Option ' + String.fromCharCode(65 + q.correct) + '.'}
        </div>
      </div>
    ` : ''}

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2rem;pt-1;border-top:1px solid var(--border-light)">
      <button class="btn btn-outline" ${session.currentIndex === 0 ? 'disabled' : ''} onclick="prevPracticeQuestion()">← Previous</button>
      
      ${!isSubmitted ? `
        <button class="btn btn-primary" ${selectedIdx === undefined ? 'disabled' : ''} onclick="submitPracticeAnswer()">Check Answer</button>
      ` : `
        ${session.currentIndex < session.questions.length - 1 ? `
          <button class="btn btn-primary" onclick="nextPracticeQuestion()">Next Question →</button>
        ` : `
          <button class="btn btn-success" onclick="finishPracticeSession()">🏁 Finish Practice</button>
        `}
      `}
    </div>
  </div>
  `;
}

function selectPracticeOption(idx) {
  if (!window.practiceSession) return;
  const qId = window.practiceSession.questions[window.practiceSession.currentIndex].id;
  window.practiceSession.answers[qId] = idx;
  navigateTo('practice', 'student');
}

function submitPracticeAnswer() {
  if (!window.practiceSession) return;
  const qId = window.practiceSession.questions[window.practiceSession.currentIndex].id;
  window.practiceSession.submitted[qId] = true;
  navigateTo('practice', 'student');
}

function nextPracticeQuestion() {
  if (!window.practiceSession) return;
  if (window.practiceSession.currentIndex < window.practiceSession.questions.length - 1) {
    window.practiceSession.currentIndex++;
    navigateTo('practice', 'student');
  }
}

function prevPracticeQuestion() {
  if (!window.practiceSession) return;
  if (window.practiceSession.currentIndex > 0) {
    window.practiceSession.currentIndex--;
    navigateTo('practice', 'student');
  }
}

function finishPracticeSession() {
  if (!window.practiceSession) return;
  const correctCount = window.practiceSession.questions.filter(q => window.practiceSession.answers[q.id] === q.correct).length;
  alert(`Great job! You answered ${correctCount} out of ${window.practiceSession.questions.length} questions correctly.`);
  window.practiceSession = null;
  navigateTo('dashboard', 'student');
}

// ===== FLASHCARDS =====
function renderFlashcards() {
  const s = APP.currentUser || {};
  const mySubjects = s.subjects || [];
  const stuGrade = String(s.class || '').replace(/\D/g, '') || '11';
  const stuBoard = String(s.board || '').toLowerCase();

  let cards = DATA.flashcards.filter(fc => 
    mySubjects.includes(fc.subject) && 
    String(fc.grade) === stuGrade && 
    String(fc.board).toLowerCase() === stuBoard
  );

  // Removed dummy fallback generation
  return `
  <div class="page-header"><h1>Revision Flashcards</h1><p>Quick revision with interactive flip cards</p></div>
  ${cards.length === 0 ? '<div style="text-align:center;padding:3rem;color:var(--text-muted)">No flashcards available for your subjects.</div>' : `
  <div style="max-width:500px;margin:0 auto">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <span class="badge badge-primary" id="flashcardCounter">1 / ${cards.length}</span>
      <span style="font-size:0.82rem;color:var(--text-muted)">👆 Click to flip</span>
    </div>
    <div class="flashcard-container">
      <div class="flashcard" id="mainFlashcard" onclick="flipFlashcard()">
        <div class="flashcard-front">
          <div class="flashcard-label">❓ Question</div>
          <div class="flashcard-text fc-question">${cards[0]?.q || ''}</div>
          <div style="margin-top:1rem;font-size:0.75rem;color:var(--text-muted)">Tap to reveal answer</div>
        </div>
        <div class="flashcard-back">
          <div class="flashcard-label" style="color:var(--secondary)">✅ Answer</div>
          <div class="flashcard-text fc-answer">${cards[0]?.a || ''}</div>
        </div>
      </div>
    </div>
    <div style="display:flex;gap:1rem;justify-content:center;margin-top:1.5rem">
      <button class="btn btn-secondary" onclick="prevFlashcard()">← Previous</button>
      <button class="btn btn-primary" onclick="flipFlashcard()">Flip Card</button>
      <button class="btn btn-secondary" onclick="nextFlashcard()">Next →</button>
    </div>
  </div>
  <div style="margin-top:2.5rem">
    <div style="font-size:1rem;font-weight:700;margin-bottom:1rem">📚 All Cards</div>
    <div class="grid-2">
      ${cards.map((fc, i) => `
        <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-md);padding:1rem;cursor:pointer" onclick="flashcardIndex=${i};updateFlashcard();window.scrollTo({top:0,behavior:'smooth'})">
          <div style="font-size:0.75rem;color:var(--primary-light);font-weight:600;margin-bottom:0.35rem">Card ${i+1}</div>
          <div style="font-size:0.85rem;font-weight:600">${fc.q}</div>
        </div>
      `).join('')}
    </div>
  </div>`}
  `;
}

// ===== LEADERBOARD =====
function renderLeaderboard() {
  const students = Store_getStudents().sort((a,b) => b.marks - a.marks);
  return `
  <div class="page-header"><h1>Class Leaderboard</h1><p>See how you rank among classmates</p></div>
  ${students.length >= 3 ? `
  <div style="display:flex;justify-content:center;align-items:flex-end;gap:1rem;margin-bottom:2rem;flex-wrap:wrap">
    ${[1,0,2].map((ri, pi) => {
      if (!students[ri]) return '';
      const s = students[ri];
      const heights = ['180px','140px','120px'];
      const colors = ['#FFD700','#6C63FF','#CD7F32'];
      return `<div style="text-align:center">
        <div class="avatar avatar-lg" style="background:${colors[pi]};margin:0 auto 0.5rem;box-shadow:0 0 20px ${colors[pi]}60">${s.avatar}</div>
        <div style="font-weight:700;font-size:0.88rem">${s.name}</div>
        <div style="font-size:1rem;font-weight:800;color:${colors[pi]};margin-top:0.2rem">${s.marks}%</div>
        <div style="background:${colors[pi]};color:${pi===0?'#000':'#fff'};border-radius:var(--radius-md) var(--radius-md) 0 0;padding:.75rem 2rem;margin-top:.5rem;height:${heights[pi]};display:flex;align-items:flex-start;justify-content:center;font-size:1.5rem;font-weight:800">${ri===0?'🥇':ri===1?'🥈':'🥉'}</div>
      </div>`;
    }).join('')}
  </div>` : ''}
  <div class="card">
    <div class="card-header"><div class="card-title">📊 Full Rankings</div></div>
    ${students.map((s, i) => `
      <div class="leaderboard-item ${s.id === APP.currentStudentId ? 'style=\"border:1px solid var(--primary)\"' : ''}">
        <div class="rank-badge ${i===0?'rank-1':i===1?'rank-2':i===2?'rank-3':'rank-other'}">${i+1}</div>
        <div class="avatar avatar-sm" style="background:var(--grad-primary)">${s.avatar}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:0.9rem">${s.name} ${s.id===APP.currentStudentId?'<span class="badge badge-primary" style="font-size:0.65rem">You</span>':''}</div>
          <div style="font-size:0.75rem;color:var(--text-secondary)">Class ${s.class} · ${s.board}</div>
        </div>
        <div style="text-align:right"><div style="font-weight:800;font-size:1rem">${s.marks}%</div></div>
      </div>
    `).join('')}
  </div>`;
}

// ===== STUDENT PROGRESS =====
function renderStudentProgress() {
  const s = APP.currentUser || {};
  const allStudents = Store_getStudents();
  const rank = allStudents.sort((a,b) => b.marks - a.marks).findIndex(st => st.id === APP.currentStudentId) + 1;
  return `
  <div class="page-header"><h1>My Progress</h1><p>Your academic performance analysis</p></div>
  <div class="grid-3 mb-2">
    <div class="stat-card" style="border-top:3px solid var(--primary)"><div class="stat-value gradient-text">${s.marks||0}%</div><div class="stat-label">Overall Score</div></div>
    <div class="stat-card" style="border-top:3px solid var(--secondary)"><div class="stat-value" style="color:var(--secondary)">${s.attendance||0}%</div><div class="stat-label">Attendance</div></div>
    <div class="stat-card" style="border-top:3px solid var(--accent-orange)"><div class="stat-value" style="color:var(--accent-orange)">${rank > 0 ? '#'+rank : '—'}</div><div class="stat-label">Class Rank</div></div>
  </div>
  <div class="grid-2 mb-2">
    <div class="card"><div class="card-header"><div class="card-title">🕸️ Performance Radar</div></div><div class="chart-wrapper"><canvas id="subjectProgressChart"></canvas></div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">🧪 Test History</div></div>
      ${Store_getTests().filter(t => (t.scores||[]).some(sc => sc.studentId === APP.currentStudentId)).map(t => {
        const sc = t.scores.find(x => x.studentId === APP.currentStudentId);
        const pct = sc ? Math.round(sc.marks / t.maxMarks * 100) : 0;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.65rem;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:0.4rem">
          <div><div style="font-weight:600;font-size:0.85rem">${t.name}</div><div style="font-size:0.72rem;color:var(--text-muted)">${t.subject}</div></div>
          <div style="font-weight:800;color:${pct>=80?'var(--secondary)':'var(--accent-yellow)'}">${sc?.marks}/${t.maxMarks}</div>
        </div>`;
      }).join('') || '<div style="padding:1rem;text-align:center;color:var(--text-muted)">No tests yet</div>'}
    </div>
  </div>`;
}

// ===== STUDENT DOUBTS (study only, no finance) =====
function renderStudentDoubts() {
  const myDoubts = Store_getDoubts(APP.currentStudentId);
  const allDoubts = Store_getDoubts();
  return `
  <div class="page-header"><h1>Doubt Forum</h1><p>Ask questions and get answers from your teacher</p></div>
  <div style="display:flex;justify-content:flex-end;margin-bottom:1.25rem">
    <button class="btn btn-primary" onclick="openModal('askDoubtModal')">+ Ask a Doubt</button>
  </div>
  ${allDoubts.length === 0 ? '<div class="card" style="text-align:center;padding:3rem"><div style="font-size:2.5rem;margin-bottom:1rem">💬</div><div style="font-size:1.1rem;font-weight:700">No doubts yet</div><div style="color:var(--text-secondary)">Be the first to ask!</div></div>' : ''}
  ${allDoubts.map(d => `
    <div class="doubt-item">
      <div class="doubt-header">
        <div class="avatar" style="background:var(--grad-primary)">${(d.studentName||'??').slice(0,2).toUpperCase()}</div>
        <div style="flex:1">
          <div class="doubt-question">${d.question}</div>
          <div class="doubt-meta">${d.studentName||'Student'} · ${d.subject} · ${d.time}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem">
          ${d.answered ? '<span class="badge badge-success">✓ Answered</span>' : '<span class="badge badge-warning">Pending</span>'}
          <button class="btn btn-sm" style="background:none;border:none;padding:0;font-size:1.2rem;cursor:pointer" onclick="deleteDoubtStudent(${d.id})" title="Unsend Doubt">🗑️</button>
        </div>
      </div>
      ${d.answered ? `<div class="doubt-answer">🎓 <strong>Teacher's Answer:</strong> ${d.answer}</div>` : ''}
    </div>
  `).join('')}
  <div class="modal-overlay" id="askDoubtModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Ask a Doubt</span><button class="modal-close" onclick="closeModal('askDoubtModal')">✕</button></div>
    <div class="form-group"><label class="form-label">Subject</label><select id="doubtSubject" class="form-control">${Store_getStudent(APP.currentStudentId)?.subjects?.map(s => `<option value="${s}">${s}</option>`).join('') || '<option value="General">General</option>'}</select></div>
    <div class="form-group"><label class="form-label">Your Question</label><textarea id="doubtQuestion" class="form-control" rows="4" placeholder="Describe your doubt..."></textarea></div>
    <button class="btn btn-primary" onclick="doPostDoubt()">Post Doubt</button>
  </div></div>`;
}

function doPostDoubt() {
  const question = document.getElementById('doubtQuestion').value.trim();
  if (!question) { showToast('Enter your question', 'warning'); return; }
  Store_addDoubt({
    studentId: APP.currentStudentId,
    studentName: APP.currentUser?.name || 'Student',
    question,
    subject: document.getElementById('doubtSubject').value,
  });
  closeModal('askDoubtModal');
  showToast('Doubt posted! Teacher will answer soon.', 'success');
  navigateTo('doubts', 'student');
}

function deleteDoubtStudent(doubtId) {
  if (confirm('Are you sure you want to unsend this doubt?')) {
    Store_deleteDoubt(doubtId);
    showToast('Doubt unsent', 'success');
    navigateTo('doubts', 'student');
  }
}

function doRequestCredentialChange() {
  const s = APP.currentUser || {};
  Store_addNotification({
    title: 'Credential Update Request',
    message: `Student <strong>${s.name}</strong> is requesting to update their login credentials.`,
    date: new Date().toISOString().split('T')[0],
    type: 'request',
    requestingStudentId: APP.currentStudentId,
    targetStudentId: 0
  });
  showToast('Request sent to tutor!', 'success');
}

function renderStudentTests() {
  const s = APP.currentUser || {};
  const mySubjects = s.subjects || [];
  const tests = Store_getTests().filter(t => 
    (mySubjects.includes(t.subject) || t.subject === 'All') &&
    (t.grade === s.class || t.grade === 'All') &&
    (t.board === s.board || t.board === 'All')
  );
  const now = new Date();

  return `
  <div class="page-header"><h1>My Tests</h1><p>View upcoming and active test papers allotted to you</p></div>
  ${tests.length === 0 ? '<div style="text-align:center;padding:3rem;color:var(--text-muted)">No tests allotted for your subjects yet.</div>' : ''}
  <div class="grid-2">
    ${tests.map(t => {
      const start = t.startTime ? new Date(t.startTime) : null;
      const end = t.endTime ? new Date(t.endTime) : null;
      let access = 'locked'; // locked, active, ended
      let accessMsg = '';
      
      if (!start || !end) {
        access = 'locked';
        accessMsg = 'Time not scheduled yet';
      } else if (now < start) {
        access = 'locked';
        accessMsg = `Available at ${start.toLocaleString()}`;
      } else if (now <= end) {
        access = 'active';
        accessMsg = `Ends at ${end.toLocaleString()}`;
      } else {
        access = 'ended';
        accessMsg = `Ended on ${end.toLocaleString()}`;
      }

      return `
      <div class="card ${access === 'active' ? 'glow-border' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">
          <div>
            <div style="font-weight:700;font-size:1.1rem;color:var(--primary-light)">${t.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem">${t.subject} · ${t.date}</div>
          </div>
          <span class="badge ${access === 'active' ? 'badge-success' : access === 'ended' ? 'badge-danger' : 'badge-primary'}">${access.toUpperCase()}</span>
        </div>
        
        <div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);margin-bottom:1rem">
          <div style="font-size:0.85rem;font-weight:600;margin-bottom:0.35rem">🕒 Access Window:</div>
          <div style="font-size:0.8rem;color:var(--text-secondary)">${accessMsg}</div>
        </div>

        <div style="display:flex;gap:0.75rem;align-items:center">
          ${access === 'active' && t.pdfData 
            ? `<button class="btn btn-primary" style="flex:1" onclick="viewStudentPDF(${t.id})">📄 View Test Paper</button>` 
            : `<button class="btn btn-secondary" style="flex:1" disabled>${access === 'ended' ? 'Test Ended' : 'View Paper'}</button>`
          }
          <div style="font-size:0.8rem;font-weight:700;color:var(--text-secondary)">${t.maxMarks} Marks</div>
        </div>
        ${access === 'locked' && start ? `<div style="font-size:0.7rem;color:var(--accent-yellow);margin-top:0.5rem;text-align:center">⏳ Test paper will unlock automatically.</div>` : ''}
      </div>`;
    }).join('')}
  </div>
  `;
}

function viewStudentPDF(testId) {
  const t = Store_getTests().find(x => x.id === testId);
  if (!t || !t.pdfData) return;
  const win = window.open();
  win.document.write(`
    <html>
      <head><title>${t.name} - Test Paper</title></head>
      <body style="margin:0;padding:0;background:#333;">
        <iframe src="${t.pdfData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>
      </body>
    </html>
  `);
}

function doAcknowledge(notifId) {
  if (Store_acknowledgeNotification(notifId, APP.currentStudentId)) {
    showToast('Acknowledge sent! 👍', 'success');
    navigateTo(APP.currentPage, APP.currentRole);
  }
}

window.selectPracticeOption = selectPracticeOption;
window.submitPracticeAnswer = submitPracticeAnswer;
window.nextPracticeQuestion = nextPracticeQuestion;
window.prevPracticeQuestion = prevPracticeQuestion;
window.finishPracticeSession = finishPracticeSession;
window.doAcknowledge = doAcknowledge;
window.renderStudentPage = renderStudentPage;
// ======= PARENT PAGES (Finance + Overview) =======
function renderParentPage(page, container) {
  refreshData();
  const renderers = {
    dashboard: renderParentDashboard,
    fees: renderParentFees,
    report: renderParentReport,
    notifications: renderParentNotifications,
    settings: renderParentSettings,
  };
  const renderer = renderers[page] || renderParentDashboard;
  container.innerHTML = renderer();
}

function renderParentDashboard() {
  const s = APP.currentUser || { name: 'Student', class: '—', batch: '—', attendance: 0, marks: 0, fees: 'pending' };
  const allStudents = Store_getStudents();
  const rank = allStudents.sort((a,b) => b.marks - a.marks).findIndex(st => st.id === APP.currentStudentId) + 1;
  return `
  <div class="page-header"><h1>Parent Dashboard</h1><p>Track <strong>${s.name}</strong>'s academic progress and fees</p></div>
  <div class="card mb-2" style="background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,170,0.05));border-color:var(--border)">
    <div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap">
      <div class="avatar avatar-xl" style="background:var(--grad-primary);box-shadow:var(--shadow-glow)">${getInitials(s.name)}</div>
      <div style="flex:1">
        <div style="font-size:1.4rem;font-weight:800">${s.name}</div>
        <div style="color:var(--text-secondary);margin-top:0.2rem">Class ${s.class} · ${s.board || ''} · ${s.batch}</div>
        <div style="display:flex;gap:0.75rem;margin-top:0.75rem;flex-wrap:wrap">
          <span class="badge badge-primary">📅 Attendance: ${s.attendance}%</span>
          <span class="badge badge-success">📊 Score: ${s.marks}%</span>
          <span class="badge badge-orange">🏆 Rank: ${rank > 0 ? '#'+rank : '—'}</span>
          <span class="${s.fees==='paid'?'badge badge-success':'badge badge-danger'}">${s.fees==='paid'?'✓ Fee Paid':'⚠ Fee Pending'}</span>
        </div>
      </div>
      <div style="text-align:center">${circularProgress(s.marks||0, '#6C63FF', 110)}<div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem">Score</div></div>
    </div>
  </div>
  <div class="grid-2 mb-2">
    <div class="card">
      <div class="card-header"><div class="card-title">📈 Progress</div></div>
      <div class="chart-wrapper"><canvas id="childProgressChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🧪 Recent Tests</div></div>
      ${Store_getTests().filter(t => (t.scores||[]).some(sc => sc.studentId === APP.currentStudentId)).map(t => {
        const sc = t.scores.find(x => x.studentId === APP.currentStudentId);
        const pct = sc ? Math.round(sc.marks / t.maxMarks * 100) : 0;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem;background:var(--bg-secondary);border-radius:var(--radius-md);margin-bottom:0.5rem">
          <div><div style="font-weight:600;font-size:0.88rem">${t.name}</div><div style="font-size:0.72rem;color:var(--text-muted)">${t.subject} · ${t.date}</div></div>
          <div style="text-align:right"><div style="font-weight:800;color:${pct>=80?'var(--secondary)':'var(--accent-yellow)'}">${sc?.marks}/${t.maxMarks}</div><div style="font-size:0.72rem;color:var(--text-muted)">${pct}%</div></div>
        </div>`;
      }).join('') || '<div style="padding:1rem;text-align:center;color:var(--text-muted)">No tests yet</div>'}
    </div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><div class="card-title">💰 Fee Status</div></div>
      <div style="background:${s.fees==='paid'?'rgba(0,212,170,0.1)':'rgba(255,107,107,0.1)'};border:1px solid ${s.fees==='paid'?'rgba(0,212,170,0.3)':'rgba(255,107,107,0.3)'};border-radius:var(--radius-md);padding:1.25rem;text-align:center">
        <div style="font-size:2rem;margin-bottom:0.5rem">${s.fees==='paid'?'✅':'⚠️'}</div>
        <div style="font-size:1.1rem;font-weight:700">${s.fees==='paid'?'Fee Paid':'Fee Pending'}</div>
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.3rem">Monthly: ₹${(s.monthlyFee||2500).toLocaleString()}</div>
      </div>
      <button class="btn btn-secondary w-100 mt-1" onclick="navigateTo('fees','parent')">View Payment History →</button>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Attendance Summary</div></div>
      <div style="text-align:center;padding:1rem">
        ${circularProgress(s.attendance||0, '#00D4AA', 120)}
        <div style="font-size:0.9rem;font-weight:700;margin-top:0.5rem">Attendance Rate</div>
      </div>
    </div>
  </div>`;
}

// ===== PARENT FEES PAGE =====
function renderParentFees() {
  const s = APP.currentUser || {};
  const payments = Store_getFeePayments(APP.currentStudentId);
  return `
  <div class="page-header"><h1>💰 Fee Details</h1><p>Payment history for ${s.name||'student'}</p></div>
  <div class="card mb-2" style="border-top:3px solid ${s.fees==='paid'?'var(--secondary)':'var(--accent)'}">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
      <div>
        <div style="font-size:1.1rem;font-weight:700">Current Month Status</div>
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.25rem">Monthly Fee: ₹${(s.monthlyFee||2500).toLocaleString()}</div>
      </div>
      ${feeBadge(s.fees||'pending')}
    </div>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-title">📋 Payment History</div></div>
    ${payments.length === 0 ? '<div style="padding:2rem;text-align:center;color:var(--text-muted)">No payment records yet</div>' : `
    <div class="table-wrapper"><table class="data-table">
      <thead><tr><th>Date</th><th>Amount</th><th>Month</th><th>Status</th></tr></thead>
      <tbody>
        ${payments.map(p => `<tr>
          <td>${p.paidDate || '—'}</td>
          <td style="font-weight:700">₹${(p.amount||0).toLocaleString()}</td>
          <td>${p.month}/${p.year}</td>
          <td>${feeBadge(p.status||'paid')}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`}
  </div>`;
}

function renderParentReport() {
  const s = APP.currentUser || {};
  return `
  <div class="page-header"><h1>📋 Progress Report</h1><p>Academic report for ${s.name||'student'}</p></div>
  <div class="card mb-2" style="border:2px solid var(--primary)">
    <div style="text-align:center;padding:1rem 0;border-bottom:1px solid var(--border-light);margin-bottom:1.5rem">
      <div style="font-size:1.4rem;font-weight:800">📜 Academic Progress Report</div>
    </div>
    <div class="grid-3 mb-2">
      <div style="text-align:center;background:var(--bg-secondary);border-radius:var(--radius-lg);padding:1.25rem">
        <div style="font-size:2rem;font-weight:900;color:var(--primary)">${s.marks||0}%</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Overall Score</div>
      </div>
      <div style="text-align:center;background:var(--bg-secondary);border-radius:var(--radius-lg);padding:1.25rem">
        <div style="font-size:2rem;font-weight:900;color:var(--secondary)">${s.attendance||0}%</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Attendance</div>
      </div>
      <div style="text-align:center;background:var(--bg-secondary);border-radius:var(--radius-lg);padding:1.25rem">
        <div style="font-size:2rem;font-weight:900;color:var(--accent-orange)">${s.fees==='paid'?'✓':'⚠'}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Fee Status</div>
      </div>
    </div>
  </div>
  
  <div class="card mb-2">
    <div class="card-header"><div class="card-title">📝 Recent Test Results</div></div>
    <div class="table-container">
      <table class="table">
        <thead><tr><th>Date</th><th>Test Name</th><th>Score</th></tr></thead>
        <tbody>
          ${Store_getTests().map(t => {
            const score = t.scores?.find(x => x.studentId === APP.currentStudentId);
            if(!score) return '';
            return `<tr>
              <td>${t.date}</td>
              <td>${t.name}</td>
              <td><span style="font-weight:700">${score.marks}/${t.totalMarks}</span></td>
            </tr>`;
          }).join('')}
          ${Store_getTests().filter(t => t.scores?.find(x => x.studentId === APP.currentStudentId)).length === 0 ? '<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">No tests taken yet.</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  </div>
  
  <div class="card mb-2">
    <div class="card-header"><div class="card-title">📅 Attendance History</div></div>
    <div class="table-container">
      <table class="table">
        <thead><tr><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          ${Store_getAttendance().filter(a => a.records[APP.currentStudentId]).slice(0, 10).map(a => {
            const status = a.records[APP.currentStudentId];
            return `<tr>
              <td>${a.date}</td>
              <td>
                <span class="badge ${status === 'present' ? 'badge-primary' : status === 'absent' ? 'badge-orange' : 'badge-secondary'}">
                  ${status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </td>
            </tr>`;
          }).join('')}
          ${Store_getAttendance().filter(a => a.records[APP.currentStudentId]).length === 0 ? '<tr><td colspan="2" style="text-align:center;color:var(--text-muted)">No attendance records found.</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  </div>
  ${(s.remarks && s.remarks.length > 0) ? `
  <div class="card">
    <div class="card-header"><div class="card-title">👨‍🏫 Teacher Remarks</div></div>
    ${s.remarks.map(r => `
      <div style="background:rgba(255,154,60,0.1);border-left:4px solid var(--accent-orange);border-radius:var(--radius-md);padding:1rem;margin-bottom:0.75rem">
        <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.35rem">🕒 ${r.date}</div>
        <div style="font-size:0.95rem;color:var(--text-primary);line-height:1.5">${r.text}</div>
      </div>
    `).join('')}
  </div>` : ''}
  `;
}

function renderParentNotifications() {
  const notifs = Store_getNotifications(APP.currentStudentId);
  return `
  <div class="page-header"><h1>Updates & Notifications</h1><p>All updates from your child's teacher</p></div>
  ${notifs.length === 0 ? `
  <div style="text-align:center;padding:3rem;color:var(--text-muted)">
    <div style="font-size:2.5rem;margin-bottom:1rem">🔔</div>
    <div style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">No notifications yet</div>
    <div>Updates about attendance, tests, and fees will appear here</div>
  </div>` : `
  <div class="card">
    ${notifs.map(n => `
      <div style="display:flex;align-items:flex-start;gap:1rem;padding:1rem;border-bottom:1px solid var(--border-light)">
        <div style="font-size:1.8rem">${n.type === 'homework' ? '📝' : n.type === 'test' ? '🧪' : n.type === 'fee' ? '💰' : '📢'}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2rem">
            <span style="font-weight:700;color:var(--text-primary)">${n.title}</span>
            <span style="font-size:0.75rem;color:var(--text-muted)">${n.date}</span>
          </div>
          <div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:0.5rem">${n.message}</div>
          ${(n.acknowledgments || []).includes(APP.currentStudentId) 
            ? '<span class="badge badge-success">✓ Acknowledged</span>' 
            : `<button class="btn btn-xs btn-outline" style="padding:0.2rem 0.5rem;font-size:0.7rem" onclick="doAcknowledge(${n.id})">Acknowledge 👍</button>`
          }
        </div>
      </div>
    `).join('')}
  </div>
  `}
  `;
}

function renderStudentSettings() {
  const s = APP.currentUser || {};
  const creds = Store_getCredentials();
  const myCred = Store_getCredentialInfo(APP.currentStudentId) || { username: '', pin: '' };
  
  return `
  <div class="page-header">
    <h1>⚙️ Profile Settings</h1>
    <p>Update your login credentials</p>
  </div>
  
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><div class="card-title">🔑 Login Credentials</div></div>
      <div class="form-group">
        <label class="form-label">Username</label>
        <input type="text" id="setStudentUsername" class="form-control" value="${myCred.username}" placeholder="Enter new username">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Current username: <strong>${myCred.username}</strong></div>
      </div>
      <div class="form-group">
        <label class="form-label">Update 4-Digit PIN</label>
        <input type="password" id="setStudentPin" class="form-control" placeholder="Enter new 4-digit PIN" maxlength="4" inputmode="numeric">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Current PIN: <strong>${myCred.pin}</strong></div>
      </div>
      <button class="btn btn-primary" onclick="doUpdateStudentCredentials('student')">💾 Save Changes</button>
    </div>
    
    <div class="card">
      <div class="card-header"><div class="card-title">👤 Student Info</div></div>
      <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem">
        <div class="avatar avatar-lg" style="background:var(--grad-primary)">${getInitials(s.name||'??')}</div>
        <div>
          <div style="font-size:1.1rem;font-weight:700">${s.name}</div>
          <div style="font-size:0.85rem;color:var(--text-secondary)">Class ${s.class} · ${s.batch}</div>
        </div>
      </div>
      <button class="btn btn-secondary w-100" onclick="doRequestCredentialChange()">Request Credential Change</button>
    </div>
  </div>
  `;
}

function renderParentSettings() {
  const s = APP.currentUser || {};
  const myCred = Store_getCredentialInfo(APP.currentStudentId) || { username: '', pin: '' };
  
  return `
  <div class="page-header">
    <h1>⚙️ Profile Settings</h1>
    <p>Update credentials for <strong>${s.name}</strong>'s parent portal</p>
  </div>
  
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><div class="card-title">🔑 Login Credentials</div></div>
      <div class="form-group">
        <label class="form-label">Username</label>
        <input type="text" id="setParentUsername" class="form-control" value="${myCred.username}" placeholder="Enter new username">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Current username: <strong>${myCred.username}</strong></div>
      </div>
      <div class="form-group">
        <label class="form-label">Update 4-Digit PIN</label>
        <input type="password" id="setParentPin" class="form-control" placeholder="Enter new 4-digit PIN" maxlength="4" inputmode="numeric">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Current PIN: <strong>${myCred.pin}</strong></div>
      </div>
      <button class="btn btn-primary" onclick="doUpdateStudentCredentials('parent')">💾 Save Changes</button>
    </div>
    
    <div class="card">
      <div class="card-header"><div class="card-title">ℹ️ Parent Portal Info</div></div>
      <p style="font-size:0.88rem;color:var(--text-secondary);line-height:1.6">
        Login credentials for the parent portal are shared with the student portal. 
        Changing them here will update them for both.
      </p>
    </div>
  </div>
  `;
}

function doUpdateStudentCredentials(role) {
  const prefix = role === 'student' ? 'setStudent' : 'setParent';
  const newUsername = document.getElementById(`${prefix}Username`).value.toLowerCase().replace(/\s+/g,'').trim();
  const newPin = document.getElementById(`${prefix}Pin`).value.trim();
  
  if (!newUsername) { showToast('Username required', 'warning'); return; }
  if (!newPin) { showToast('New PIN required', 'warning'); return; }
  if (!/^\d{4}$/.test(newPin)) { showToast('PIN must be 4 digits', 'warning'); return; }
  
  const currentCred = Store_getCredentialInfo(APP.currentStudentId);
  if (!currentCred) { showToast('Error fetching current credentials', 'error'); return; }
  
  const res = Store_updateCredentials(currentCred.username, newUsername, newPin, role, APP.currentStudentId);
  if (res.success) {
    showToast('Credentials updated successfully!', 'success');
    navigateTo('settings', role);
  } else {
    showToast(res.message, 'error');
  }
}

function renderSyllabus() {
  const s = APP.currentUser || {};
  const mySubjects = s.subjects || [];
  const mapedSyllabus = SYLLABUS_MAP[s.class]?.[s.board] || {};
  
  return `
  <div class="page-header"><h1>My Syllabus</h1><p>Detailed overview of chapters, important questions, and FAQs</p></div>
  ${mySubjects.map(sub => {
    const chapters = mapedSyllabus[sub] || [];
    return `
    <div class="card mb-2">
      <div class="card-header" style="background:rgba(108,99,255,0.05);margin:-1.5rem -1.5rem 1.5rem;padding:1rem 1.5rem;border-bottom:1px solid var(--border-light)">
        <div class="card-title">${getSubjectTag(sub)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        ${chapters.map(ch => {
          const isObj = typeof ch === 'object';
          const name = isObj ? ch.name : ch;
          return `
          <div style="border-bottom:1px solid var(--border-light);padding-bottom:1rem">
            <div style="font-weight:700;font-size:1.1rem;margin-bottom:0.5rem;color:var(--primary-light)">${name}</div>
            ${isObj ? `
              <div style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:1rem">${ch.details}</div>
              <div class="grid-2">
                <div>
                  <div style="font-weight:600;font-size:0.85rem;color:var(--text-primary);margin-bottom:0.5rem">💡 Important Questions</div>
                  <ul style="list-style:disc;padding-left:1.5rem;font-size:0.82rem;color:var(--text-secondary)">
                    ${ch.questions.map(q => `<li>${q}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <div style="font-weight:600;font-size:0.85rem;color:var(--text-primary);margin-bottom:0.5rem">❓ FAQs</div>
                  <ul style="list-style:disc;padding-left:1.5rem;font-size:0.82rem;color:var(--text-secondary)">
                    ${ch.faqs.map(f => `<li>${f}</li>`).join('')}
                  </ul>
                </div>
              </div>
            ` : '<div style="font-size:0.85rem;color:var(--text-muted);font-style:italic">Detailed content coming soon...</div>'}
          </div>
          `;
        }).join('')}
      </div>
    </div>`;
  }).join('')}
  `;
}

// Expose globally
window.renderStudentPage = renderStudentPage;
window.renderParentPage = renderParentPage;
window.renderStudentSettings = renderStudentSettings;
window.renderParentSettings = renderParentSettings;
window.doUpdateStudentCredentials = doUpdateStudentCredentials;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.filterVideos = filterVideos;
window.doPostDoubt = doPostDoubt;
window.deleteDoubtStudent = deleteDoubtStudent;
window.doRequestCredentialChange = doRequestCredentialChange;
