/**
 * Swaft Academy - Tutor Content Management System
 * Handles Videos, Flashcards, and Practice Questions.
 */

window.currentContentTab = 'videos';
window.contentFilters = { grade: '', board: '', subject: '' };
window.editingContentId = null; 

function renderTutorContentLibrary() {
  const tabs = [
    { id: 'videos', label: '🎬 Videos' },
    { id: 'flashcards', label: '🃏 Flashcards' },
    { id: 'questions', label: '✏️ Practice MCQs' }
  ];

  let tabContent = '';
  if (window.currentContentTab === 'videos') tabContent = renderContentVideos();
  else if (window.currentContentTab === 'flashcards') tabContent = renderContentFlashcards();
  else if (window.currentContentTab === 'questions') tabContent = renderContentQuestions();

  const students = Store_getStudents();
  const allSubjects = [...new Set(students.flatMap(s => s.subjects || []))];
  const allClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return `
  <div class="page-header">
    <h1>📚 Content Library</h1>
    <p>Manage videos, flashcards, and practice questions for all classes and subjects</p>
  </div>
  
  <div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);margin-bottom:1.5rem;display:flex;gap:1rem;align-items:flex-end;flex-wrap:wrap">
    <div class="form-group" style="margin:0;flex:1;min-width:120px">
      <label class="form-label">Filter by Class</label>
      <select class="form-control" onchange="contentFilters.grade=this.value;navigateTo('content','tutor')">
        <option value="">All Classes</option>
        ${allClasses.map(c => `<option value="${c}" ${contentFilters.grade===String(c)?'selected':''}>Class ${c}</option>`).join('')}
      </select>
    </div>
    <div class="form-group" style="margin:0;flex:1;min-width:120px">
      <label class="form-label">Filter by Board</label>
      <select class="form-control" onchange="contentFilters.board=this.value;navigateTo('content','tutor')">
        <option value="">All Boards</option>
        <option value="ICSE" ${contentFilters.board==='ICSE'?'selected':''}>ICSE</option>
        <option value="CBSE" ${contentFilters.board==='CBSE'?'selected':''}>CBSE</option>
        <option value="State" ${contentFilters.board==='State'?'selected':''}>State Board</option>
      </select>
    </div>
    <div class="form-group" style="margin:0;flex:1;min-width:120px">
      <label class="form-label">Filter by Subject</label>
      <select class="form-control" onchange="contentFilters.subject=this.value;navigateTo('content','tutor')">
        <option value="">All Subjects</option>
        ${allSubjects.map(s => `<option value="${s}" ${contentFilters.subject===s?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
  </div>

  <div style="display:flex;gap:1rem;margin-bottom:1.5rem;border-bottom:2px solid var(--border-light)">
    ${tabs.map(t => `
      <div style="padding:0.5rem 1rem;cursor:pointer;font-weight:600;color:${window.currentContentTab === t.id ? 'var(--primary)' : 'var(--text-muted)'};border-bottom:3px solid ${window.currentContentTab === t.id ? 'var(--primary)' : 'transparent'};margin-bottom:-2px" 
           onclick="switchContentTab('${t.id}')">
        ${t.label}
      </div>
    `).join('')}
  </div>
  
  <div id="contentTabBody">
    ${tabContent}
  </div>
  `;
}

function switchContentTab(tabId) {
  window.currentContentTab = tabId;
  navigateTo('content', 'tutor');
}

// ================= VIDEOS =================
function renderContentVideos() {
  let videos = Store_getVideos();
  const students = Store_getStudents();
  const allSubjects = [...new Set(students.flatMap(s => s.subjects || []))];

  // Apply Filters (Videos don't have board/grade strictly mapped yet, maybe just subject)
  if (contentFilters.subject) videos = videos.filter(v => v.subject === contentFilters.subject);

  let html = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:1rem">
    <button class="btn btn-primary" onclick="openAddVideoModal()">+ Add Video</button>
  </div>
  <div class="table-container">
    <table class="data-table">
      <thead><tr><th>Title & Description</th><th>Subject</th><th>Chapter</th><th>Duration</th><th>Action</th></tr></thead>
      <tbody>
  `;
  
  if (videos.length === 0) {
    html += `<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">No videos match your filters</td></tr>`;
  } else {
    videos.forEach(v => {
      html += `
        <tr>
          <td><div style="font-weight:600">${v.title}</div><div style="font-size:0.8rem;color:var(--text-muted)">Lecture ${v.lecture}</div></td>
          <td><span class="badge badge-primary">${v.subject}</span></td>
          <td>${v.chapter}</td>
          <td>${v.duration}</td>
          <td>
            <button class="btn-sm btn-outline" style="margin-right:0.5rem" onclick="openEditVideoModal(${v.id})">Edit</button>
            <button class="btn-sm btn-outline" style="color:var(--danger);border-color:var(--danger)" onclick="deleteVideo(${v.id})">Delete</button>
          </td>
        </tr>
      `;
    });
  }
  html += `</tbody></table></div>`;

  // Add/Edit Video Modal
  html += `
  <div class="modal-overlay" id="vidModal"><div class="modal">
    <div class="modal-header"><span class="modal-title" id="vidModalTitle">Add Video Lecture</span><button class="modal-close" onclick="closeModal('vidModal')">✕</button></div>
    <div class="form-group"><label class="form-label">Title</label><input type="text" id="vidTitle" class="form-control" placeholder="e.g. Newton's First Law"></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Subject</label><select id="vidSubject" class="form-control">${allSubjects.map(s => `<option value="${s}">${s}</option>`).join('') || '<option value="General">General</option>'}</select></div>
      <div class="form-group"><label class="form-label">Chapter</label><input type="text" id="vidChapter" class="form-control" placeholder="e.g. Kinematics"></div>
      <div class="form-group"><label class="form-label">Lecture Number</label><input type="number" id="vidLecture" class="form-control" value="1"></div>
      <div class="form-group"><label class="form-label">Duration (mm:ss)</label><input type="text" id="vidDuration" class="form-control" placeholder="45:00"></div>
    </div>
    <div class="form-group"><label class="form-label">YouTube Video ID</label><input type="text" id="vidYtId" class="form-control" placeholder="e.g. dQw4w9WgXcQ"></div>
    <button class="btn btn-primary" onclick="saveVideo()">Save Video</button>
  </div></div>
  `;
  return html;
}

function openAddVideoModal() {
  window.editingContentId = null;
  document.getElementById('vidModalTitle').textContent = 'Add Video Lecture';
  document.getElementById('vidTitle').value = '';
  document.getElementById('vidChapter').value = '';
  document.getElementById('vidLecture').value = '1';
  document.getElementById('vidDuration').value = '45:00';
  document.getElementById('vidYtId').value = '';
  openModal('vidModal');
}

function openEditVideoModal(id) {
  const v = Store_getVideos().find(x => x.id === id);
  if (!v) return;
  window.editingContentId = id;
  document.getElementById('vidModalTitle').textContent = 'Edit Video Lecture';
  document.getElementById('vidTitle').value = v.title;
  document.getElementById('vidSubject').value = v.subject;
  document.getElementById('vidChapter').value = v.chapter;
  document.getElementById('vidLecture').value = v.lecture;
  document.getElementById('vidDuration').value = v.duration;
  document.getElementById('vidYtId').value = v.ytId;
  openModal('vidModal');
}

function saveVideo() {
  const title = document.getElementById('vidTitle').value.trim();
  const subject = document.getElementById('vidSubject').value;
  const chapter = document.getElementById('vidChapter').value.trim();
  const lecture = document.getElementById('vidLecture').value.trim();
  const duration = document.getElementById('vidDuration').value.trim() || '00:00';
  const ytId = document.getElementById('vidYtId').value.trim();

  if (!title || !chapter || !ytId) { showToast('Title, Chapter, and YouTube ID are required', 'warning'); return; }

  const payload = { title, subject, chapter, lecture, duration, ytId, progress: 0 };
  
  if (window.editingContentId) Store_updateVideo(window.editingContentId, payload);
  else Store_addVideo(payload);

  closeModal('vidModal');
  showToast(window.editingContentId ? 'Video updated' : 'Video added', 'success');
  navigateTo('content', 'tutor');
}

function deleteVideo(id) {
  if (confirm('Are you sure you want to delete this video?')) {
    Store_deleteVideo(id);
    showToast('Video deleted', 'success');
    navigateTo('content', 'tutor');
  }
}

// ================= FLASHCARDS =================
function renderContentFlashcards() {
  let cards = Store_getFlashcards();
  const students = Store_getStudents();
  const allSubjects = [...new Set(students.flatMap(s => s.subjects || []))];
  const allClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  if (contentFilters.grade) cards = cards.filter(c => String(c.grade) === String(contentFilters.grade));
  if (contentFilters.board) cards = cards.filter(c => String(c.board).toLowerCase() === contentFilters.board.toLowerCase());
  if (contentFilters.subject) cards = cards.filter(c => c.subject === contentFilters.subject);

  let html = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:1rem">
    <button class="btn btn-primary" onclick="openAddFlashcardModal()">+ Add Flashcard</button>
  </div>
  <div class="grid-3">
  `;
  
  if (cards.length === 0) {
    html += `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">No flashcards match your filters</div>`;
  } else {
    cards.forEach(c => {
      html += `
        <div class="card" style="position:relative;background:var(--bg-secondary);border:1px solid var(--border-light)">
          <div style="position:absolute;top:0.5rem;right:0.5rem;display:flex;gap:0.3rem">
            <button style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:1.1rem" onclick="openEditFlashcardModal(${c.id})" title="Edit">✎</button>
            <button style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:1.1rem" onclick="deleteFlashcard(${c.id})" title="Delete">✕</button>
          </div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.5rem">Class ${c.grade} • ${c.board} • ${c.subject}</div>
          <div style="font-weight:700;margin-bottom:0.5rem;color:var(--primary-light)">Q: ${c.q}</div>
          <div style="font-size:0.85rem;color:var(--secondary)">A: ${c.a}</div>
        </div>
      `;
    });
  }
  html += `</div>`;

  // Add/Edit Flashcard Modal
  html += `
  <div class="modal-overlay" id="fcModal"><div class="modal">
    <div class="modal-header"><span class="modal-title" id="fcModalTitle">Add Flashcard</span><button class="modal-close" onclick="closeModal('fcModal')">✕</button></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Class</label><select id="fcGrade" class="form-control">${allClasses.length ? allClasses.map(c=>`<option value="${c}">${c}</option>`).join('') : '<option value="11">11</option>'}</select></div>
      <div class="form-group"><label class="form-label">Board</label><select id="fcBoard" class="form-control"><option value="ICSE">ICSE</option><option value="CBSE">CBSE</option></select></div>
      <div class="form-group" style="grid-column:1/-1"><label class="form-label">Subject</label><select id="fcSubject" class="form-control">${allSubjects.map(s => `<option value="${s}">${s}</option>`).join('') || '<option value="General">General</option>'}</select></div>
    </div>
    <div class="form-group"><label class="form-label">Question (Front)</label><textarea id="fcQ" class="form-control" rows="2" placeholder="What is the powerhouse of the cell?"></textarea></div>
    <div class="form-group"><label class="form-label">Answer (Back)</label><textarea id="fcA" class="form-control" rows="2" placeholder="Mitochondria"></textarea></div>
    <button class="btn btn-primary" onclick="saveFlashcard()">Save Flashcard</button>
  </div></div>
  `;
  return html;
}

function openAddFlashcardModal() {
  window.editingContentId = null;
  document.getElementById('fcModalTitle').textContent = 'Add Flashcard';
  document.getElementById('fcQ').value = '';
  document.getElementById('fcA').value = '';
  openModal('fcModal');
}

function openEditFlashcardModal(id) {
  const f = Store_getFlashcards().find(x => x.id === id);
  if (!f) return;
  window.editingContentId = id;
  document.getElementById('fcModalTitle').textContent = 'Edit Flashcard';
  document.getElementById('fcGrade').value = f.grade;
  document.getElementById('fcBoard').value = f.board;
  document.getElementById('fcSubject').value = f.subject;
  document.getElementById('fcQ').value = f.q;
  document.getElementById('fcA').value = f.a;
  openModal('fcModal');
}

function saveFlashcard() {
  const grade = document.getElementById('fcGrade').value;
  const board = document.getElementById('fcBoard').value;
  const subject = document.getElementById('fcSubject').value;
  const q = document.getElementById('fcQ').value.trim();
  const a = document.getElementById('fcA').value.trim();

  if (!q || !a) { showToast('Question and Answer are required', 'warning'); return; }

  const payload = { grade, board, subject, q, a, chapter: 'General' };
  
  if (window.editingContentId) Store_updateFlashcard(window.editingContentId, payload);
  else Store_addFlashcard(payload);

  closeModal('fcModal');
  showToast(window.editingContentId ? 'Flashcard updated' : 'Flashcard added', 'success');
  navigateTo('content', 'tutor');
}

function deleteFlashcard(id) {
  if (confirm('Delete this flashcard?')) {
    Store_deleteFlashcard(id);
    showToast('Flashcard deleted', 'success');
    navigateTo('content', 'tutor');
  }
}

// ================= PRACTICE QUESTIONS =================
function renderContentQuestions() {
  let questions = Store_getQuestions();
  const students = Store_getStudents();
  const allSubjects = [...new Set(students.flatMap(s => s.subjects || []))];
  const allClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  if (contentFilters.grade) questions = questions.filter(q => String(q.grade) === String(contentFilters.grade));
  if (contentFilters.board) questions = questions.filter(q => String(q.board).toLowerCase() === contentFilters.board.toLowerCase());
  if (contentFilters.subject) questions = questions.filter(q => q.subject === contentFilters.subject);

  let html = `
  <div style="display:flex;justify-content:flex-end;margin-bottom:1rem">
    <button class="btn btn-primary" onclick="openAddQuestionModal()">+ Add MCQ</button>
  </div>
  <div class="table-container">
    <table class="data-table">
      <thead><tr><th>Question</th><th>Class/Subject</th><th>Options & Correct</th><th>Action</th></tr></thead>
      <tbody>
  `;
  
  if (questions.length === 0) {
    html += `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:2rem">No practice questions match your filters</td></tr>`;
  } else {
    questions.forEach(q => {
      html += `
        <tr>
          <td><div style="font-weight:600;max-width:300px;overflow:hidden;text-overflow:ellipsis">${q.question}</div><div style="font-size:0.75rem;color:var(--text-muted)">${q.explanation||''}</div></td>
          <td><div style="font-size:0.8rem">Class ${q.grade} ${q.board}</div><span class="badge badge-primary">${q.subject}</span></td>
          <td>
            <ul style="margin:0;padding-left:1rem;font-size:0.8rem">
              ${q.options.map((o,i)=>`<li style="${i==q.correct ? 'font-weight:bold;color:var(--secondary)' : ''}">${o}</li>`).join('')}
            </ul>
          </td>
          <td>
            <div style="display:flex;gap:0.5rem">
              <button class="btn-sm btn-outline" onclick="openEditQuestionModal(${q.id})">Edit</button>
              <button class="btn-sm btn-outline" style="color:var(--danger);border-color:var(--danger)" onclick="deleteQuestion(${q.id})">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });
  }

  html += `</tbody></table></div>`;

  // Add/Edit Question Modal
  html += `
  <div class="modal-overlay" id="qModal"><div class="modal" style="max-width:600px">
    <div class="modal-header"><span class="modal-title" id="qModalTitle">Add Practice MCQ</span><button class="modal-close" onclick="closeModal('qModal')">✕</button></div>
    <div class="grid-3" style="margin-bottom:1rem">
      <div class="form-group"><label class="form-label">Class</label><select id="qGrade" class="form-control">${allClasses.length ? allClasses.map(c=>`<option value="${c}">${c}</option>`).join('') : '<option value="11">11</option>'}</select></div>
      <div class="form-group"><label class="form-label">Board</label><select id="qBoard" class="form-control"><option value="ICSE">ICSE</option><option value="CBSE">CBSE</option></select></div>
      <div class="form-group"><label class="form-label">Subject</label><select id="qSubject" class="form-control">${allSubjects.map(s => `<option value="${s}">${s}</option>`).join('') || '<option value="General">General</option>'}</select></div>
    </div>
    <div class="form-group"><label class="form-label">Question</label><textarea id="qQ" class="form-control" rows="2" placeholder="Type the question here..."></textarea></div>
    
    <label class="form-label">Options & Correct Answer (Select the radio button)</label>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:0.5rem;align-items:center;margin-bottom:1rem">
      <input type="radio" name="qCorrect" value="0" id="qC0" checked>
      <input type="text" id="qOpt0" class="form-control" placeholder="Option A">
      
      <input type="radio" name="qCorrect" value="1" id="qC1">
      <input type="text" id="qOpt1" class="form-control" placeholder="Option B">
      
      <input type="radio" name="qCorrect" value="2" id="qC2">
      <input type="text" id="qOpt2" class="form-control" placeholder="Option C">
      
      <input type="radio" name="qCorrect" value="3" id="qC3">
      <input type="text" id="qOpt3" class="form-control" placeholder="Option D">
    </div>

    <div class="form-group"><label class="form-label">Explanation (Optional)</label><input type="text" id="qExp" class="form-control" placeholder="Why is this correct?"></div>
    <button class="btn btn-primary" onclick="saveQuestion()">Save MCQ</button>
  </div></div>
  `;
  return html;
}

function openAddQuestionModal() {
  window.editingContentId = null;
  document.getElementById('qModalTitle').textContent = 'Add Practice MCQ';
  document.getElementById('qQ').value = '';
  document.getElementById('qExp').value = '';
  document.getElementById('qOpt0').value = '';
  document.getElementById('qOpt1').value = '';
  document.getElementById('qOpt2').value = '';
  document.getElementById('qOpt3').value = '';
  document.getElementById('qC0').checked = true;
  openModal('qModal');
}

function openEditQuestionModal(id) {
  const q = Store_getQuestions().find(x => x.id === id);
  if (!q) return;
  window.editingContentId = id;
  document.getElementById('qModalTitle').textContent = 'Edit Practice MCQ';
  document.getElementById('qGrade').value = q.grade;
  document.getElementById('qBoard').value = q.board;
  document.getElementById('qSubject').value = q.subject;
  document.getElementById('qQ').value = q.question;
  document.getElementById('qExp').value = q.explanation || '';
  document.getElementById('qOpt0').value = q.options[0] || '';
  document.getElementById('qOpt1').value = q.options[1] || '';
  document.getElementById('qOpt2').value = q.options[2] || '';
  document.getElementById('qOpt3').value = q.options[3] || '';
  document.getElementById(`qC${q.correct}`).checked = true;
  openModal('qModal');
}

function saveQuestion() {
  const grade = document.getElementById('qGrade').value;
  const board = document.getElementById('qBoard').value;
  const subject = document.getElementById('qSubject').value;
  const question = document.getElementById('qQ').value.trim();
  const explanation = document.getElementById('qExp').value.trim();
  
  const options = [
    document.getElementById('qOpt0').value.trim(),
    document.getElementById('qOpt1').value.trim(),
    document.getElementById('qOpt2').value.trim(),
    document.getElementById('qOpt3').value.trim()
  ];
  const correct = parseInt(document.querySelector('input[name="qCorrect"]:checked').value);

  if (!question || options.some(o => !o)) { showToast('Question and all 4 options are required', 'warning'); return; }

  const payload = { grade, board, subject, question, options, correct, explanation, type: 'mcq' };
  
  if (window.editingContentId) Store_updateQuestion(window.editingContentId, payload);
  else Store_addQuestion(payload);

  closeModal('qModal');
  showToast(window.editingContentId ? 'Question updated' : 'Question added', 'success');
  navigateTo('content', 'tutor');
}

function deleteQuestion(id) {
  if (confirm('Delete this question?')) {
    Store_deleteQuestion(id);
    showToast('Question deleted', 'success');
    navigateTo('content', 'tutor');
  }
}

// Ensure functions are exposed to the global scope
window.renderTutorContentLibrary = renderTutorContentLibrary;
window.switchContentTab = switchContentTab;
window.openAddVideoModal = openAddVideoModal;
window.openEditVideoModal = openEditVideoModal;
window.saveVideo = saveVideo;
window.deleteVideo = deleteVideo;
window.openAddFlashcardModal = openAddFlashcardModal;
window.openEditFlashcardModal = openEditFlashcardModal;
window.saveFlashcard = saveFlashcard;
window.deleteFlashcard = deleteFlashcard;
window.openAddQuestionModal = openAddQuestionModal;
window.openEditQuestionModal = openEditQuestionModal;
window.saveQuestion = saveQuestion;
window.deleteQuestion = deleteQuestion;
