/**
 * Swaft Academy - Tutor Dashboard Pages (localStorage CRUD)
 */

function renderTutorPage(page, container) {
  refreshData();
  const renderers = {
    dashboard: renderTutorDashboard,
    students: renderStudents,
    attendance: renderAttendance,
    homework: renderHomework,
    tests: renderTests,
    fees: renderFees,
    schedule: renderSchedule,
    teachinglog: renderTeachingLog,
    doubts: renderDoubts,
    content: window.renderTutorContentLibrary || (() => '<h2>Coming Soon</h2>'),
    settings: renderTutorSettings,
  };
  const renderer = renderers[page] || renderTutorDashboard;
  container.innerHTML = renderer();
  afterRenderTutor(page);
}

function afterRenderTutor(page) {
  if (page === 'schedule') generateCalendar('scheduleCalendar');
  if (page === 'dashboard') animateCounters();
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 30;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current) + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// ===== TUTOR DASHBOARD =====
function renderTutorDashboard() {
  const students = Store_getStudents();
  const avgAtt = students.length > 0 ? Math.round(students.reduce((s,st) => s + st.attendance, 0) / students.length) : 0;
  const paidFees = students.filter(s => s.fees === 'paid').length;
  const pendingFees = students.filter(s => s.fees !== 'paid').length;
  const tests = Store_getTests();
  const recentDoubts = Store_getDoubts().slice(0, 3);

  return `
  <div class="page-header">
    <h1>Welcome back, <span class="gradient-text">Tutor</span> 👋</h1>
    <p>Here's your teaching overview for today</p>
  </div>
  <div class="grid-4 mb-2">
    <div class="stat-card" style="border-top:3px solid var(--primary)">
      <div class="stat-icon" style="background:rgba(108,99,255,0.15)">👩‍🎓</div>
      <div class="stat-value gradient-text" data-count="${students.length}">0</div>
      <div class="stat-label">Total Students</div>
    </div>
    <div class="stat-card" style="border-top:3px solid var(--secondary)">
      <div class="stat-icon" style="background:rgba(0,212,170,0.15)">📚</div>
      <div class="stat-value" style="color:var(--secondary)" data-count="${Store_getBatches().length}">0</div>
      <div class="stat-label">Active Batches</div>
    </div>
    <div class="stat-card" style="border-top:3px solid var(--accent-yellow)">
      <div class="stat-icon" style="background:rgba(255,217,61,0.15)">📅</div>
      <div class="stat-value" style="color:var(--accent-yellow)" data-count="${avgAtt}" data-suffix="%">0%</div>
      <div class="stat-label">Avg Attendance</div>
    </div>
    <div class="stat-card" style="border-top:3px solid var(--accent)">
      <div class="stat-icon" style="background:rgba(255,107,107,0.15)">💰</div>
      <div class="stat-value" style="color:var(--accent)">${pendingFees}</div>
      <div class="stat-label">Fees Pending</div>
    </div>
  </div>
  <div class="grid-3 mb-2">
    <div class="card">
      <div class="card-header"><div class="card-title">📊 Batch Performance</div></div>
      <div class="chart-wrapper"><canvas id="batchPerformanceChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📈 Attendance Trends</div></div>
      <div class="chart-wrapper"><canvas id="attendanceTrendsChart"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">⚡ Quick Actions</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
        <button class="btn btn-secondary" onclick="navigateTo('attendance','tutor')" style="justify-content:center;padding:1rem;border-radius:var(--radius-md)"><span style="font-size:1.3rem">📅</span><br>Mark Attendance</button>
        <button class="btn btn-secondary" onclick="navigateTo('homework','tutor')" style="justify-content:center;padding:1rem;border-radius:var(--radius-md)"><span style="font-size:1.3rem">📝</span><br>Homework</button>
        <button class="btn btn-secondary" onclick="navigateTo('tests','tutor')" style="justify-content:center;padding:1rem;border-radius:var(--radius-md)"><span style="font-size:1.3rem">🧪</span><br>Tests</button>
        <button class="btn btn-secondary" onclick="openModal('broadcastModal')" style="justify-content:center;padding:1rem;border-radius:var(--radius-md)"><span style="font-size:1.3rem">📢</span><br>Broadcast</button>
        <button class="btn btn-secondary" onclick="navigateTo('students','tutor')" style="justify-content:center;padding:1rem;border-radius:var(--radius-md)"><span style="font-size:1.3rem">👩‍🎓</span><br>Students</button>
        <button class="btn btn-secondary" onclick="navigateTo('fees','tutor')" style="justify-content:center;padding:1rem;border-radius:var(--radius-md)"><span style="font-size:1.3rem">💳</span><br>Fee Tracker</button>
      </div>
    </div>
  </div>
  ${recentDoubts.length > 0 ? `
  <div class="card">
    <div class="card-header"><div class="card-title">💬 Recent Doubts</div>
    <button class="btn btn-sm btn-outline" onclick="navigateTo('doubts','tutor')">View All</button></div>
    ${recentDoubts.map(d => `
      <div class="doubt-item">
        <div class="doubt-header">
          <div class="avatar avatar-sm" style="background:var(--grad-primary)">${(d.studentName||'??').slice(0,2).toUpperCase()}</div>
          <div><div class="doubt-question">${d.question}</div>
          <div class="doubt-meta">${d.studentName||'Student'} · ${d.subject} · ${d.time}</div></div>
        </div>
        ${d.answered ? '<span class="badge badge-success">✓ Answered</span>' : '<span class="badge badge-danger">⚡ New</span>'}
      </div>
    `).join('')}
  </div>` : ''}
  
  <div class="card mt-2">
    <div class="card-header"><div class="card-title">📝 Pending Requests</div></div>
    <div id="tutorRequestsContainer">
      ${Store_getNotifications().filter(n => n.type === 'request').map(n => {
        const reqStudent = n.requestingStudentId ? Store_getStudent(n.requestingStudentId) : null;
        return `
        <div style="background:rgba(108,99,255,0.05);border-left:3px solid var(--primary);border-radius:var(--radius-md);padding:0.75rem;margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">
          <div>
            <div style="font-weight:700;font-size:0.9rem">${n.title}</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">${n.message}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem">📅 ${n.date}</div>
          </div>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            ${reqStudent ? `<button class="btn btn-sm btn-primary" onclick="openSetLoginModal(${reqStudent.id});doResolveRequest(${n.id})">🔑 Update Credentials</button>` : ''}
            <button class="btn btn-sm btn-outline" style="padding:0.3rem 0.6rem;font-size:0.75rem" onclick="doResolveRequest(${n.id})">✓ Dismiss</button>
          </div>
        </div>`;
      }).join('') || '<div style="text-align:center;color:var(--text-muted);padding:1rem">No pending requests</div>'}
    </div>
  </div>
  
  <!-- Broadcast Modal -->
  <div class="modal-overlay" id="broadcastModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">📢 Broadcast Announcement</span><button class="modal-close" onclick="closeModal('broadcastModal')">✕</button></div>
    <div style="background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.25);border-radius:var(--radius-md);padding:0.85rem 1rem;margin-bottom:1.25rem;font-size:0.85rem;color:var(--text-secondary)">
      <strong style="color:var(--text-primary)">Send to all students</strong><br>This announcement will be pinned to all student dashboards.
    </div>
    <div class="form-group">
      <label class="form-label">Message</label>
      <textarea id="broadcastMessage" class="form-control" rows="4" placeholder="Type your instruction or announcement here..."></textarea>
    </div>
    <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
      <button class="btn btn-primary" onclick="doBroadcast()">📢 Send Broadcast</button>
      <button class="btn btn-secondary" onclick="closeModal('broadcastModal')">Cancel</button>
    </div>
  </div></div>
  `;
}

// ===== STUDENTS PAGE =====
function renderStudents() {
  const students = Store_getStudents();
  const batches = Store_getBatches();
  return `
  <div class="page-header"><h1>Student Management</h1><p>Manage enrolled students, set login PINs, and track performance</p></div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:1rem">
    <input type="text" class="form-control" placeholder="🔍 Search students..." style="width:220px" oninput="filterStudents(this.value)">
    <button class="btn btn-primary" onclick="openAddStudentModal()">+ Add Student</button>
  </div>
  <div class="grid-2 mb-2">
    <div class="card"><div class="card-header"><div class="card-title">📊 Grade Distribution</div></div><div class="chart-wrapper"><canvas id="gradeDistributionChart"></canvas></div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">📋 Student Summary</div></div>
      <div style="padding:0.5rem 0">
        ${students.map((s,i) => `
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0;border-bottom:1px solid var(--border-light)">
            <div class="avatar avatar-sm" style="background:${getAvatarColor(i)}">${s.avatar}</div>
            <div style="flex:1"><div style="font-weight:600;font-size:0.88rem">${s.name}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">Class ${s.class} · ${s.board} · ${s.batch}</div></div>
            <div style="font-weight:700;font-size:0.85rem">${s.marks}%</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  <div class="table-wrapper">
    <table class="data-table">
      <thead><tr><th>Student</th><th>Username</th><th>Class / Board</th><th>Attendance</th><th>Avg Marks</th><th>Actions</th></tr></thead>
      <tbody id="studentsTableBody">
        ${students.map((s, i) => `
          <tr>
            <td><div style="display:flex;align-items:center;gap:0.75rem">
              <div class="avatar avatar-sm" style="background:${getAvatarColor(i)}">${s.avatar}</div>
              <div><div style="font-weight:600;font-size:0.9rem">${s.name}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${s.batch}</div></div>
            </div></td>
            <td style="font-weight:600;color:var(--primary-light)">${Store_getCredentialInfo(s.id)?.username || '—'}</td>
            <td><span style="font-weight:600">Class ${s.class}</span><br><span class="text-small text-muted">${s.board}</span></td>
            <td><div>${s.attendance}%</div>
              <div class="progress-bar" style="width:80px;margin-top:4px">
                <div class="progress-fill" style="width:${s.attendance}%;background:${s.attendance<80?'var(--accent)':s.attendance<90?'var(--accent-yellow)':'var(--secondary)'}"></div>
              </div></td>
            <td><span style="font-weight:700">${s.marks}%</span> ${marksBadge(s.marks)}</td>
            <td><div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              <button class="btn btn-sm btn-outline" onclick="openEditStudentModal(${s.id})">✏️ Edit</button>
              <button class="btn btn-sm btn-outline" onclick="openRemarksModal(${s.id})">📝 Remark</button>
              <button class="btn btn-sm" style="background:rgba(108,99,255,0.2);color:var(--primary-light);border:1px solid rgba(108,99,255,0.35)" onclick="openSetLoginModal(${s.id})">🔑 PIN</button>
              <button class="btn btn-sm" style="background:rgba(255,107,107,0.15);color:var(--accent);border:1px solid rgba(255,107,107,0.3)" onclick="deleteStudentConfirm(${s.id},'${s.name.replace(/'/g,"\\'")}')">🗑️</button>
            </div></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  <!-- Add Student Modal -->
  <div class="modal-overlay" id="addStudentModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Add New Student</span><button class="modal-close" onclick="closeModal('addStudentModal')">✕</button></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="addStuName" class="form-control" placeholder="Student name"></div>
      <div class="form-group"><label class="form-label">Class</label><input type="text" id="addStuClass" class="form-control" placeholder="e.g. 11" oninput="refreshSubjectsList('add')" value="11"></div>
      <div class="form-group"><label class="form-label">Board</label><select id="addStuBoard" class="form-control" onchange="refreshSubjectsList('add')"><option>ICSE</option><option>CBSE</option><option>State Board</option></select></div>
      <div class="form-group"><label class="form-label">Phone</label><input type="tel" id="addStuPhone" class="form-control" placeholder="+91-XXXXXXXXXX"></div>
      <div class="form-group"><label class="form-label">Parent Name</label><input type="text" id="addStuParent" class="form-control" placeholder="Parent name"></div>
      <div class="form-group"><label class="form-label">Parent Phone</label><input type="tel" id="addStuParentPhone" class="form-control" placeholder="+91-XXXXXXXXXX"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Assign Subjects <span style="font-weight:normal;color:var(--text-muted);font-size:0.75rem">(auto-generated based on Class)</span></label>
      <div id="addStuSubjects" style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
        <!-- populated by refreshSubjectsList -->
      </div>
    </div>
    <div class="form-group"><label class="form-label">Monthly Fee (₹)</label><input type="number" id="addStuFee" class="form-control" placeholder="2500" value="2500"></div>
    <button class="btn btn-primary" onclick="doAddStudent()">Enroll Student</button>
  </div></div>
  <!-- Edit Student Modal -->
  <div class="modal-overlay" id="editStudentModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Edit Student</span><button class="modal-close" onclick="closeModal('editStudentModal')">✕</button></div>
    <input type="hidden" id="editStuId">
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="editStuName" class="form-control"></div>
      <div class="form-group"><label class="form-label">Class</label><input type="text" id="editStuClass" class="form-control" oninput="refreshSubjectsList('edit', window._currentEditSubjects)"></div>
      <div class="form-group"><label class="form-label">Board</label><select id="editStuBoard" class="form-control" onchange="refreshSubjectsList('edit', window._currentEditSubjects)"><option>ICSE</option><option>CBSE</option><option>State Board</option></select></div>
      <div class="form-group"><label class="form-label">Phone</label><input type="tel" id="editStuPhone" class="form-control"></div>
      <div class="form-group"><label class="form-label">Parent Name</label><input type="text" id="editStuParent" class="form-control"></div>
      <div class="form-group"><label class="form-label">Parent Phone</label><input type="tel" id="editStuParentPhone" class="form-control"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Assign Subjects <span style="font-weight:normal;color:var(--text-muted);font-size:0.75rem">(auto-generated based on Class)</span></label>
      <div id="editStuSubjects" style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">
        <!-- populated by refreshSubjectsList -->
      </div>
    </div>
    <div class="form-group"><label class="form-label">Monthly Fee (₹)</label><input type="number" id="editStuFee" class="form-control"></div>
    <button class="btn btn-primary" onclick="doEditStudent()">Save Changes</button>
  </div></div>
  <!-- Set Login Modal -->
  <div class="modal-overlay" id="setLoginModal"><div class="modal" style="max-width:420px">
    <div class="modal-header"><span class="modal-title">🔑 Set Student Login</span><button class="modal-close" onclick="closeModal('setLoginModal')">✕</button></div>
    <div style="background:rgba(108,99,255,0.1);border:1px solid rgba(108,99,255,0.25);border-radius:var(--radius-md);padding:0.85rem 1rem;margin-bottom:1.25rem;font-size:0.85rem;color:var(--text-secondary)">
      <strong style="color:var(--text-primary)" id="setLoginStudentName">Student</strong><br>Create or update login credentials for this student.
    </div>
    <div class="form-group"><label class="form-label">Username</label><input type="text" id="setLoginUsername" class="form-control" placeholder="e.g. eva"><div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Lowercase, no spaces.</div></div>
    <div class="form-group"><label class="form-label">4-Digit PIN</label><input type="text" id="setLoginPin" class="form-control" placeholder="e.g. 1234" maxlength="4" inputmode="numeric"><div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Share this PIN privately with the student.</div></div>
    <div style="display:flex;gap:0.75rem;margin-top:0.5rem">
      <button class="btn btn-primary" onclick="saveStudentLogin()">💾 Save Credentials</button>
      <button class="btn btn-secondary" onclick="closeModal('setLoginModal')">Cancel</button>
    </div>
  </div></div>
  `;
}

function openAddStudentModal() {
  const clsInput = document.getElementById('addStuClass');
  if (clsInput && !clsInput.value) clsInput.value = '11';
  refreshSubjectsList('add');
  openModal('addStudentModal');
}

function refreshSubjectsList(prefix, preselected = []) {
  if (prefix === 'edit') window._currentEditSubjects = preselected; // store for re-renders
  const cls = document.getElementById(prefix + 'StuClass').value || '11';
  const board = document.getElementById(prefix + 'StuBoard').value || 'ICSE';
  const subjects = window.SwaftSyllabus ? SwaftSyllabus.getSubjects(cls, board) : ['English', 'Mathematics', 'Science'];
  
  const container = document.getElementById(prefix + 'StuSubjects');
  if (!container) return;
  
  container.innerHTML = subjects.map(sub => {
    const isChecked = preselected.includes(sub) ? 'checked' : '';
    // if creating new student, check common subjects by default
    const defaultCheck = (prefix === 'add' && ['Mathematics', 'Science', 'Physics', 'Chemistry', 'English'].includes(sub)) ? 'checked' : '';
    return `<label style="font-size:0.85rem"><input type="checkbox" value="${sub}" ${preselected.length > 0 ? isChecked : defaultCheck}> ${sub}</label>`;
  }).join('');
}

function doAddStudent() {
  const name = document.getElementById('addStuName').value.trim();
  if (!name) { showToast('Please enter student name', 'warning'); return; }
  const cls = document.getElementById('addStuClass').value.trim() || '11';
  const board = document.getElementById('addStuBoard').value;
  const batch = cls + (cls.endsWith('th') ? '' : 'th') + ' ' + board;
  Store_addStudent({
    name, class: cls, board, batch,
    attendance: 0, marks: 0, fees: 'pending',
    phone: document.getElementById('addStuPhone').value.trim(),
    parentName: document.getElementById('addStuParent').value.trim(),
    parentPhone: document.getElementById('addStuParentPhone').value.trim(),
    monthlyFee: parseInt(document.getElementById('addStuFee').value) || 2500,
    subjects: Array.from(document.querySelectorAll('#addStuSubjects input:checked')).map(i => i.value),
  });
  closeModal('addStudentModal');
  showToast(`${name} enrolled successfully!`, 'success');
  navigateTo('students', 'tutor');
}

function openEditStudentModal(id) {
  const s = Store_getStudent(id);
  if (!s) return;
  document.getElementById('editStuId').value = id;
  document.getElementById('editStuName').value = s.name;
  document.getElementById('editStuClass').value = s.class;
  document.getElementById('editStuBoard').value = s.board || 'ICSE';
  document.getElementById('editStuPhone').value = s.phone || '';
  document.getElementById('editStuParent').value = s.parentName || '';
  document.getElementById('editStuParentPhone').value = s.parentPhone || '';
  document.getElementById('editStuFee').value = s.monthlyFee || 2500;
  
  refreshSubjectsList('edit', s.subjects || []);
  
  openModal('editStudentModal');
}

function doEditStudent() {
  const id = parseInt(document.getElementById('editStuId').value);
  const name = document.getElementById('editStuName').value.trim();
  if (!name) { showToast('Name required', 'warning'); return; }
  const cls = document.getElementById('editStuClass').value.trim();
  const board = document.getElementById('editStuBoard').value;
  Store_updateStudent(id, {
    name, class: cls, board,
    batch: cls + (cls.endsWith('th') ? '' : 'th') + ' ' + board,
    phone: document.getElementById('editStuPhone').value.trim(),
    parentName: document.getElementById('editStuParent').value.trim(),
    parentPhone: document.getElementById('editStuParentPhone').value.trim(),
    monthlyFee: parseInt(document.getElementById('editStuFee').value) || 2500,
    subjects: Array.from(document.querySelectorAll('#editStuSubjects input:checked')).map(i => i.value),
  });
  closeModal('editStudentModal');
  showToast(`${name} updated!`, 'success');
  navigateTo('students', 'tutor');
}

function deleteStudentConfirm(id, name) {
  if (confirm(`Are you sure you want to remove ${name}?`)) {
    Store_deleteStudent(id);
    showToast(`${name} removed`, 'warning');
    navigateTo('students', 'tutor');
  }
}

function openRemarksModal(studentId) {
  const student = Store_getStudent(studentId);
  if (!student) return;
  document.getElementById('addRemarkStudentName').textContent = student.name;
  document.getElementById('addRemarkText').value = '';
  document.getElementById('addRemarkModal').dataset.studentId = studentId;
  openModal('addRemarkModal');
}

function doAddRemark() {
  const studentId = parseInt(document.getElementById('addRemarkModal').dataset.studentId);
  const text = document.getElementById('addRemarkText').value.trim();
  if (!text) { showToast('Please enter a remark', 'warning'); return; }
  
  Store_addRemark(studentId, text);
  closeModal('addRemarkModal');
  
  const student = Store_getStudent(studentId);
  showToast(`Remark added for ${student?.name}!`, 'success');
}

function openSetLoginModal(studentId) {
  const student = Store_getStudent(studentId);
  if (!student) return;
  document.getElementById('setLoginStudentName').textContent = student.name;
  const existing = Store_getCredentialInfo(studentId);
  document.getElementById('setLoginUsername').value = existing ? existing.username : student.name.split(' ')[0].toLowerCase();
  document.getElementById('setLoginPin').value = existing ? existing.pin : '';
  document.getElementById('setLoginModal').dataset.studentId = studentId;
  openModal('setLoginModal');
}

function saveStudentLogin() {
  const studentId = parseInt(document.getElementById('setLoginModal').dataset.studentId);
  const username = document.getElementById('setLoginUsername').value.toLowerCase().replace(/\s+/g,'').trim();
  const pin = document.getElementById('setLoginPin').value.trim();
  if (!username) { showToast('Please enter a username', 'warning'); return; }
  if (!/^\d{4}$/.test(pin)) { showToast('PIN must be exactly 4 digits', 'warning'); return; }
  Store_setCredential(studentId, username, pin);
  closeModal('setLoginModal');
  const student = Store_getStudent(studentId);
  showToast(`Login set for ${student?.name}: username "${username}", PIN saved ✓`, 'success');
}

// ===== ATTENDANCE PAGE =====
function renderAttendance() {
  const students = Store_getStudents();
  // Preserve selected date across re-renders
  const inputEl = document.getElementById('attendanceDate');
  if (inputEl) APP.attendanceDate = inputEl.value;
  
  const selectedDate = APP.attendanceDate || new Date().toISOString().split('T')[0];
  const todayRecords = Store_getAttendance({ date: selectedDate });

  // For Monthly Report
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return `
  <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem">
    <div>
      <h1>Attendance Tracker</h1>
      <p>Mark and review student attendance</p>
    </div>
    <div>
      <button class="btn btn-outline" style="border-color:var(--secondary);color:var(--secondary)" onclick="doExportAttendance()">
        📊 Export Excel (CSV)
      </button>
    </div>
  </div>

  <div class="grid-2 mb-2">
    <!-- Daily Marking -->
    <div class="card" style="grid-column: 1 / -1">
      <div class="card-header" style="justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div class="card-title">📅 Daily Attendance</div>
        <input type="date" class="form-control" style="width:180px;padding:0.4rem 0.8rem" value="${selectedDate}" id="attendanceDate" onchange="APP.attendanceDate = this.value; navigateTo('attendance','tutor')">
      </div>
      <div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Student</th><th>Batch</th><th>Present</th><th>Absent</th><th>Late</th><th>Clear</th><th>Status</th></tr></thead>
        <tbody>
          ${students.map((s, i) => {
            const rec = todayRecords.find(r => r.studentId === s.id);
            const status = rec ? rec.status : 'unmarked';
            return `<tr>
              <td><div style="display:flex;align-items:center;gap:0.5rem"><div class="avatar avatar-sm" style="background:${getAvatarColor(i)}">${s.avatar}</div><span style="font-weight:600">${s.name}</span></div></td>
              <td style="font-size:0.82rem;color:var(--text-secondary)">${s.batch}</td>
              <td><button class="btn btn-sm ${status==='present'?'btn-primary':'btn-secondary'}" onclick="doMarkAttendance(${s.id},'present')">✓</button></td>
              <td><button class="btn btn-sm ${status==='absent'?'btn-danger':'btn-secondary'}" onclick="doMarkAttendance(${s.id},'absent')">✗</button></td>
              <td><button class="btn btn-sm ${status==='late'?'btn-warning':'btn-secondary'}" onclick="doMarkAttendance(${s.id},'late')">⏰</button></td>
              <td><button class="btn btn-sm btn-outline" onclick="doMarkAttendance(${s.id},'clear')" title="Clear/Undo Attendance">↺</button></td>
              <td>${status === 'unmarked' ? '<span class="text-muted">—</span>' : `<span class="badge ${status==='present'?'badge-success':status==='absent'?'badge-danger':'badge-warning'}">${status}</span>`}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    </div>
    
    <!-- Monthly Summary -->
    <div class="card" style="grid-column: 1 / -1">
      <div class="card-header" style="justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div class="card-title">🗓️ Monthly Overview</div>
        <div style="display:flex;gap:0.5rem">
          <select id="reportMonth" class="form-control" style="min-width:140px;padding:0.4rem 0.8rem" onchange="updateMonthlyReportView()">
            ${monthNames.map((m, i) => `<option value="${i+1}" ${i+1 === currentMonth ? 'selected' : ''}>${m}</option>`).join('')}
          </select>
          <select id="reportYear" class="form-control" style="min-width:100px;padding:0.4rem 0.8rem" onchange="updateMonthlyReportView()">
            <option value="${currentYear-1}">${currentYear-1}</option>
            <option value="${currentYear}" selected>${currentYear}</option>
            <option value="${currentYear+1}">${currentYear+1}</option>
          </select>
        </div>
      </div>
      <div id="monthlyReportContainer" style="overflow-x:auto">
        ${generateMonthlyReportHTML(currentYear, currentMonth, students)}
      </div>
    </div>
  </div>
  `;
}

function generateMonthlyReportHTML(year, month, students) {
  const records = Store_getAttendance();
  const daysInMonth = new Date(year, month, 0).getDate();
  
  let html = `<table class="data-table" style="font-size:0.8rem"><thead><tr><th style="min-width:120px;position:sticky;left:0;background:var(--bg-card);z-index:2;box-shadow: 2px 0 5px rgba(0,0,0,0.1)">Student</th>`;
  
  for(let i=1; i<=daysInMonth; i++) {
    html += `<th style="min-width:30px;text-align:center;padding:0.4rem">${i}</th>`;
  }
  html += `<th style="text-align:center;color:var(--secondary);min-width:35px">P</th>
           <th style="text-align:center;color:var(--accent);min-width:35px">A</th>
           <th style="text-align:center;color:var(--accent-yellow);min-width:35px">L</th></tr></thead><tbody>`;

  students.forEach((s, idx) => {
    html += `<tr><td style="position:sticky;left:0;background:var(--bg-card);z-index:1;font-weight:600;display:flex;align-items:center;gap:0.4rem;box-shadow: 2px 0 5px rgba(0,0,0,0.1)">
      <div class="avatar avatar-sm" style="width:24px;height:24px;font-size:0.6rem;background:${getAvatarColor(idx)}">${s.avatar}</div>
      <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px" title="${s.name}">${s.name}</span>
    </td>`;
    
    let p=0, a=0, l=0;
    
    for(let day=1; day<=daysInMonth; day++) {
      const dStr = day.toString().padStart(2, '0');
      const mStr = month.toString().padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      const rec = records.find(r => r.studentId === s.id && r.date === dateStr);
      let cell = `<td style="text-align:center;color:var(--text-muted)">-</td>`;
      if(rec) {
        if(rec.status==='present') { cell = `<td style="text-align:center;color:var(--secondary);font-weight:700">P</td>`; p++; }
        else if(rec.status==='absent') { cell = `<td style="text-align:center;color:var(--accent);font-weight:700">A</td>`; a++; }
        else if(rec.status==='late') { cell = `<td style="text-align:center;color:var(--accent-yellow);font-weight:700">L</td>`; l++; }
      }
      html += cell;
    }
    
    html += `<td style="text-align:center;font-weight:700;color:var(--text-primary)">${p}</td>
             <td style="text-align:center;font-weight:700;color:var(--text-primary)">${a}</td>
             <td style="text-align:center;font-weight:700;color:var(--text-primary)">${l}</td></tr>`;
  });
  
  html += `</tbody></table>`;
  return html;
}

function updateMonthlyReportView() {
  const m = parseInt(document.getElementById('reportMonth').value);
  const y = parseInt(document.getElementById('reportYear').value);
  const students = Store_getStudents();
  document.getElementById('monthlyReportContainer').innerHTML = generateMonthlyReportHTML(y, m, students);
}

function doExportAttendance() {
  const m = parseInt(document.getElementById('reportMonth').value || (new Date().getMonth()+1));
  const y = parseInt(document.getElementById('reportYear').value || (new Date().getFullYear()));
  const mStr = m.toString().padStart(2, '0');
  
  const csv = Store_exportAttendanceCSV(y, m);
  Store_downloadCSV(`Attendance_Report_${y}_${mStr}.csv`, csv);
  showToast(`Attendance Report for ${y}-${mStr} exported!`, 'success');
}

function doMarkAttendance(studentId, status) {
  const date = APP.attendanceDate || new Date().toISOString().split('T')[0];
  Store_markAttendance(studentId, date, status);
  const student = Store_getStudent(studentId);
  showToast(`${student?.name} marked ${status}`, 'success');
  navigateTo('attendance', 'tutor');
}

// ===== HOMEWORK PAGE =====
function renderHomework() {
  const homework = Store_getHomework();
  const students = Store_getStudents();
  return `
  <div class="page-header"><h1>Homework Management</h1><p>Assign and track homework</p></div>
  <div style="display:flex;justify-content:flex-end;margin-bottom:1.25rem">
    <button class="btn btn-primary" onclick="openModal('assignHWModal')">+ Assign Homework</button>
  </div>
  ${homework.length === 0 ? '<div class="card" style="text-align:center;padding:3rem"><div style="font-size:2.5rem;margin-bottom:1rem">📝</div><div style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">No homework assigned yet</div><div style="color:var(--text-secondary)">Click "+ Assign Homework" to create your first assignment</div></div>' : ''}
  ${homework.map(a => {
    const submitted = a.submissions ? a.submissions.filter(s => s.submitted).length : 0;
    const total = students.length;
    return `
    <div class="card mb-2" style="border-left:4px solid var(--primary)">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div>
          <div style="font-size:1rem;font-weight:700">${a.title}</div>
          <div style="margin-top:0.4rem;display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="subject-tag ${a.subject==='Physics'?'tag-physics':'tag-math'}">${a.subject}</span>
            <span class="badge badge-primary">Due: ${a.dueDate}</span>
          </div>
          ${a.description ? `<div style="margin-top:0.4rem;font-size:0.82rem;color:var(--text-secondary)">${a.description}</div>` : ''}
        </div>
        <div style="text-align:right">
          <div style="font-size:1.3rem;font-weight:800;color:${submitted===total?'var(--secondary)':'var(--accent-yellow)'}">${submitted}/${total}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">Submitted</div>
        </div>
      </div>
      <div style="margin-top:0.85rem">
        <div class="progress-bar"><div class="progress-fill" style="width:${total>0?(submitted/total*100):0}%;background:${submitted===total?'var(--secondary)':'var(--primary)'}"></div></div>
      </div>
    </div>`;
  }).join('')}
  <!-- Assign Modal -->
  <div class="modal-overlay" id="assignHWModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Assign Homework</span><button class="modal-close" onclick="closeModal('assignHWModal')">✕</button></div>
    <div class="form-group"><label class="form-label">Title</label><input type="text" id="hwTitle" class="form-control" placeholder="e.g., Solve Problems 6.1-6.5"></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Subject</label><select id="hwSubject" class="form-control">${[...new Set(Store_getStudents().flatMap(s => s.subjects || []))].map(sub => `<option value="${sub}">${sub}</option>`).join('') || '<option>General</option>'}</select></div>
      <div class="form-group"><label class="form-label">Due Date</label><input type="date" id="hwDue" class="form-control"></div>
    </div>
    <div class="form-group"><label class="form-label">Description</label><textarea id="hwDesc" class="form-control" rows="2" placeholder="Instructions..."></textarea></div>
    <button class="btn btn-primary" onclick="doAssignHomework()">Assign & Notify</button>
  </div></div>
  `;
}

function doAssignHomework() {
  const title = document.getElementById('hwTitle').value.trim();
  if (!title) { showToast('Please enter a title', 'warning'); return; }
  Store_addHomework({
    title, subject: document.getElementById('hwSubject').value,
    dueDate: document.getElementById('hwDue').value || 'TBD',
    description: document.getElementById('hwDesc').value.trim(),
  });
  
  // Notify all parents
  Store_getStudents().forEach(s => {
    Store_addParentNotification(s.id, 'New Homework Assigned', `${title} (${document.getElementById('hwSubject').value}). Due on ${document.getElementById('hwDue').value || 'TBD'}`, 'homework');
  });

  closeModal('assignHWModal');
  showToast('Homework assigned!', 'success');
  navigateTo('homework', 'tutor');
}

// ===== TESTS PAGE =====
function renderTests() {
  const tests = Store_getTests();
  const students = Store_getStudents();
  const now = new Date();

  return `
  <div class="page-header"><h1>Test Management</h1><p>Create scheduled tests, upload PDFs, and record scores</p></div>
  <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-bottom:1.25rem">
    <button class="btn btn-outline" onclick="openBulkUploadModal()">📤 Bulk Upload PDFs</button>
    <button class="btn btn-primary" onclick="openModal('createTestModal')">+ Create Single Test</button>
  </div>
  ${tests.length === 0 ? '<div class="card" style="text-align:center;padding:3rem"><div style="font-size:2.5rem;margin-bottom:1rem">🧪</div><div style="font-size:1.1rem;font-weight:700;margin-bottom:0.5rem">No tests created yet</div><div style="color:var(--text-secondary)">Click "+ Create Test" to get started</div></div>' : ''}
  ${tests.map(t => {
    const start = t.startTime ? new Date(t.startTime) : null;
    const end = t.endTime ? new Date(t.endTime) : null;
    let status = 'Draft';
    let statusClass = 'badge-secondary';

    if (start && end) {
      if (now < start) { status = 'Scheduled'; statusClass = 'badge-primary'; }
      else if (now <= end) { status = 'Active'; statusClass = 'badge-success'; }
      else { status = 'Ended'; statusClass = 'badge-danger'; }
    }

    return `
    <div class="card mb-2" style="border-left:4px solid ${status === 'Active' ? 'var(--secondary)' : 'var(--primary)'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
        <div>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <div style="font-size:1rem;font-weight:700">${t.name}</div>
            <span class="badge ${statusClass}">${status}</span>
          </div>
          <div style="margin-top:0.4rem;display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="subject-tag ${(t.subject||'').includes('Physics')?'tag-physics':'tag-math'}">${t.subject}</span>
            <span class="badge badge-outline">🎓 ${t.grade} ${t.board}</span>
            <span class="badge badge-primary">📅 ${t.date}</span>
            <span class="badge badge-primary">${t.maxMarks} Marks</span>
            ${t.pdfData ? '<span class="badge badge-success">📄 PDF Attached</span>' : '<span class="badge badge-outline">No PDF</span>'}
          </div>
          ${(start && end) ? `
            <div style="margin-top:0.4rem;font-size:0.75rem;color:var(--text-muted)">
              🕒 ${new Date(start).toLocaleString()} – ${new Date(end).toLocaleString()}
            </div>
          ` : ''}
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${(t.scores||[]).length}/${students.length} scored</div>
        </div>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.5rem">
        <button class="btn btn-sm btn-primary" onclick="openEnterScoresModal(${t.id})">📝 Enter Scores</button>
        <button class="btn btn-sm btn-outline" onclick="openEditTestModal(${t.id})">✏️ Edit Details</button>
        ${t.pdfData ? `<button class="btn btn-sm btn-outline" onclick="viewTestPDF(${t.id})">👁️ View Paper</button>` : ''}
      </div>
    </div>`;
  }).join('')}
  ${tests.length > 0 ? '<div class="card"><div class="card-header"><div class="card-title">📈 Student Scores</div></div><div class="chart-wrapper"><canvas id="testResultsChart"></canvas></div></div>' : ''}
  
  <!-- Create Test Modal -->
  <div class="modal-overlay" id="createTestModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Create Scheduled Test</span><button class="modal-close" onclick="closeModal('createTestModal')">✕</button></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Test Name</label><input type="text" id="testName" class="form-control" placeholder="e.g., Unit Test 1"></div>
      <div class="form-group"><label class="form-label">Subject</label><select id="testSubject" class="form-control"><option value="All">All Subjects</option>${[...new Set(Store_getStudents().flatMap(s => s.subjects || []))].map(sub => `<option value="${sub}">${sub}</option>`).join('')}</select></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Class/Grade</label><select id="testGrade" class="form-control"><option value="All">All Classes</option>${[...new Set(Store_getStudents().map(s => s.class))].sort((a,b)=>a-b).map(c => `<option value="${c}">Class ${c}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Board</label><select id="testBoard" class="form-control"><option value="All">All Boards</option><option value="ICSE">ICSE</option><option value="CBSE">CBSE</option><option value="State">State Board</option></select></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Display Date (Simple)</label><input type="date" id="testDate" class="form-control"></div>
      <div class="form-group"><label class="form-label">Total Marks</label><input type="number" id="testMaxMarks" class="form-control" value="50"></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Start Time (Student Access)</label><input type="datetime-local" id="testStart" class="form-control"></div>
      <div class="form-group"><label class="form-label">End Time (Student Access)</label><input type="datetime-local" id="testEnd" class="form-control"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Test Paper (PDF)</label>
      <input type="file" id="testPDF" class="form-control" accept=".pdf">
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Students can only view this during the scheduled time window.</div>
    </div>
    <button class="btn btn-primary" onclick="doCreateTest()">Create & Schedule Test</button>
  </div></div>

  <!-- Edit Test Modal -->
  <div class="modal-overlay" id="editTestModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Edit Test Details</span><button class="modal-close" onclick="closeModal('editTestModal')">✕</button></div>
    <input type="hidden" id="editTestId">
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Test Name</label><input type="text" id="editTestName" class="form-control"></div>
      <div class="form-group"><label class="form-label">Subject</label><select id="editTestSubject" class="form-control"><option value="All">All Subjects</option>${[...new Set(Store_getStudents().flatMap(s => s.subjects || []))].map(sub => `<option value="${sub}">${sub}</option>`).join('')}</select></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Class/Grade</label><select id="editTestGrade" class="form-control"><option value="All">All Classes</option>${[...new Set(Store_getStudents().map(s => s.class))].sort((a,b)=>a-b).map(c => `<option value="${c}">Class ${c}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Board</label><select id="editTestBoard" class="form-control"><option value="All">All Boards</option><option value="ICSE">ICSE</option><option value="CBSE">CBSE</option><option value="State">State Board</option></select></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Display Date</label><input type="date" id="editTestDate" class="form-control"></div>
      <div class="form-group"><label class="form-label">Total Marks</label><input type="number" id="editTestMaxMarks" class="form-control"></div>
    </div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Start Time</label><input type="datetime-local" id="editTestStart" class="form-control"></div>
      <div class="form-group"><label class="form-label">End Time</label><input type="datetime-local" id="editTestEnd" class="form-control"></div>
    </div>
    <div class="form-group">
      <label class="form-label">Update Test Paper (PDF)</label>
      <input type="file" id="editTestPDF" class="form-control" accept=".pdf">
      <div id="editTestPDFCurrent" style="font-size:0.75rem;color:var(--secondary);margin-top:0.3rem"></div>
    </div>
    <button class="btn btn-primary" onclick="doEditTest()">Save Test Details</button>
  </div></div>

  <!-- Enter Scores Modal -->
  <div class="modal-overlay" id="enterScoresModal"><div class="modal" style="max-width:550px">
    <div class="modal-header"><span class="modal-title">📝 Enter Scores</span><button class="modal-close" onclick="closeModal('enterScoresModal')">✕</button></div>
    <div id="scoresFormBody"></div>
    <button class="btn btn-primary mt-1" onclick="doSaveScores()">💾 Save All Scores</button>
  </div></div>

  <!-- Bulk Upload Modal -->
  <div class="modal-overlay" id="bulkUploadModal"><div class="modal" style="max-width:700px">
    <div class="modal-header"><span class="modal-title">📤 Bulk Upload Test Papers</span><button class="modal-close" onclick="closeModal('bulkUploadModal')">✕</button></div>
    <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);margin-bottom:1.5rem;border:1px dashed var(--border)">
      <div class="grid-3 mb-1">
        <div class="form-group"><label class="form-label">Batch Class</label><select id="bulkGrade" class="form-control">${[...new Set(Store_getStudents().map(s => s.class))].sort((a,b)=>a-b).map(c => `<option value="${c}">Class ${c}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Batch Board</label><select id="bulkBoard" class="form-control"><option value="ICSE">ICSE</option><option value="CBSE">CBSE</option><option value="State">State Board</option></select></div>
        <div class="form-group"><label class="form-label">Subject</label><select id="bulkSubject" class="form-control">${[...new Set(Store_getStudents().flatMap(s => s.subjects || []))].map(sub => `<option value="${sub}">${sub}</option>`).join('')}</select></div>
      </div>
      <div class="form-group">
        <label class="form-label">Select PDF Files</label>
        <input type="file" id="bulkFiles" class="form-control" accept=".pdf" multiple onchange="handleBulkFileSelection()">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">You can select multiple PDF files at once. Each file will create a separate test.</div>
      </div>
    </div>
    <div id="bulkFilesList" style="max-height:300px;overflow-y:auto;margin-bottom:1.5rem">
      <div style="text-align:center;color:var(--text-muted);padding:1rem">No files selected</div>
    </div>
    <button class="btn btn-primary w-100" id="bulkSubmitBtn" disabled onclick="doBulkUpload()">🚀 Create All Tests</button>
  </div></div>
  `;
}

function doCreateTest() {
  const name = document.getElementById('testName').value.trim();
  if (!name) { showToast('Enter test name', 'warning'); return; }
  
  const fileInput = document.getElementById('testPDF');
  const file = fileInput.files[0];

  const processAdd = (pdfData = null) => {
    Store_addTest({
      name, 
      subject: document.getElementById('testSubject').value,
      date: document.getElementById('testDate').value || 'TBD',
      maxMarks: parseInt(document.getElementById('testMaxMarks').value) || 50,
      startTime: document.getElementById('testStart').value || null,
      endTime: document.getElementById('testEnd').value || null,
      grade: document.getElementById('testGrade').value,
      board: document.getElementById('testBoard').value,
      pdfData: pdfData
    });
    closeModal('createTestModal');
    showToast('Test created and scheduled!', 'success');
    navigateTo('tests', 'tutor');
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = e => processAdd(e.target.result);
    reader.readAsDataURL(file);
  } else {
    processAdd();
  }
}

let bulkFilesCache = [];

function handleBulkFileSelection() {
  const input = document.getElementById('bulkFiles');
  const list = document.getElementById('bulkFilesList');
  const btn = document.getElementById('bulkSubmitBtn');
  const files = Array.from(input.files);
  
  if (files.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:1rem">No files selected</div>';
    btn.disabled = true;
    bulkFilesCache = [];
    return;
  }

  bulkFilesCache = [];
  list.innerHTML = '';
  btn.disabled = false;

  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      bulkFilesCache.push({
        name: file.name.replace('.pdf', ''),
        pdfData: e.target.result,
        lastModified: file.lastModified
      });
      
      const fileRow = document.createElement('div');
      fileRow.className = 'card mb-1';
      fileRow.style = 'padding:0.75rem;background:var(--bg-card);display:flex;flex-direction:column;gap:0.5rem';
      fileRow.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:600;font-size:0.85rem">📄 ${file.name}</div>
          <div style="font-size:0.7rem;color:var(--text-muted)">${(file.size/1024).toFixed(1)} KB</div>
        </div>
        <div class="grid-2">
          <input type="text" class="form-control bulk-name-input" data-index="${index}" value="${file.name.replace('.pdf', '')}" placeholder="Test Name">
          <input type="date" class="form-control bulk-date-input" data-index="${index}" value="${new Date().toISOString().split('T')[0]}">
        </div>
      `;
      list.appendChild(fileRow);
    };
    reader.readAsDataURL(file);
  });
}

function doBulkUpload() {
  const grade = document.getElementById('bulkGrade').value;
  const board = document.getElementById('bulkBoard').value;
  const subject = document.getElementById('bulkSubject').value;
  
  const nameInputs = document.querySelectorAll('.bulk-name-input');
  const dateInputs = document.querySelectorAll('.bulk-date-input');
  
  const testsToCreate = bulkFilesCache.map((file, i) => ({
    name: nameInputs[i].value.trim() || file.name,
    date: dateInputs[i].value || 'TBD',
    subject: subject,
    grade: grade,
    board: board,
    pdfData: file.pdfData,
    maxMarks: 50, // Default for bulk
    startTime: dateInputs[i].value ? `${dateInputs[i].value}T09:00` : null,
    endTime: dateInputs[i].value ? `${dateInputs[i].value}T11:00` : null,
  }));

  testsToCreate.forEach(t => Store_addTest(t));
  
  closeModal('bulkUploadModal');
  showToast(`${testsToCreate.length} tests created successfully!`, 'success');
  navigateTo('tests', 'tutor');
}

function openEditTestModal(testId) {
  const t = Store_getTests().find(x => x.id === testId);
  if (!t) return;
  document.getElementById('editTestId').value = testId;
  document.getElementById('editTestName').value = t.name;
  document.getElementById('editTestSubject').value = t.subject;
  document.getElementById('editTestGrade').value = t.grade || 'All';
  document.getElementById('editTestBoard').value = t.board || 'All';
  document.getElementById('editTestDate').value = t.date;
  document.getElementById('editTestMaxMarks').value = t.maxMarks;
  document.getElementById('editTestStart').value = t.startTime || '';
  document.getElementById('editTestEnd').value = t.endTime || '';
  document.getElementById('editTestPDFCurrent').textContent = t.pdfData ? '✓ PDF Attached' : 'No PDF attached';
  
  openModal('editTestModal');
}

function doEditTest() {
  const id = parseInt(document.getElementById('editTestId').value);
  const fileInput = document.getElementById('editTestPDF');
  const file = fileInput.files[0];

  const processEdit = (pdfData = null) => {
    const updates = {
      name: document.getElementById('editTestName').value,
      subject: document.getElementById('editTestSubject').value,
      grade: document.getElementById('editTestGrade').value,
      board: document.getElementById('editTestBoard').value,
      date: document.getElementById('editTestDate').value,
      maxMarks: parseInt(document.getElementById('editTestMaxMarks').value),
      startTime: document.getElementById('editTestStart').value,
      endTime: document.getElementById('editTestEnd').value
    };
    if (pdfData) updates.pdfData = pdfData;
    Store_updateTest(id, updates);
    closeModal('editTestModal');
    showToast('Test details updated!', 'success');
    navigateTo('tests', 'tutor');
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = e => processEdit(e.target.result);
    reader.readAsDataURL(file);
  } else {
    processEdit();
  }
}

function viewTestPDF(testId) {
  const t = Store_getTests().find(x => x.id === testId);
  if (!t || !t.pdfData) return;
  const win = window.open();
  win.document.write(`<iframe src="${t.pdfData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
}

function openEnterScoresModal(testId) {
  const test = Store_getTests().find(t => t.id === testId);
  if (!test) return;
  const students = Store_getStudents();
  document.getElementById('enterScoresModal').dataset.testId = testId;
  let html = `<div style="margin-bottom:1rem;font-weight:700">${test.name} — Max: ${test.maxMarks}</div>`;
  students.forEach(s => {
    const existing = (test.scores||[]).find(sc => sc.studentId === s.id);
    html += `<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.65rem">
      <span style="font-weight:600;min-width:100px">${s.name}</span>
      <input type="number" class="form-control score-input" data-sid="${s.id}" style="width:100px" placeholder="/${test.maxMarks}" max="${test.maxMarks}" value="${existing ? existing.marks : ''}">
      <span style="font-size:0.75rem;color:var(--text-muted)">/ ${test.maxMarks}</span>
    </div>`;
  });
  document.getElementById('scoresFormBody').innerHTML = html;
  openModal('enterScoresModal');
}

function doSaveScores() {
  const testId = parseInt(document.getElementById('enterScoresModal').dataset.testId);
  document.querySelectorAll('.score-input').forEach(inp => {
    const sid = parseInt(inp.dataset.sid);
    const marks = inp.value.trim();
    if (marks !== '') {
      Store_addTestScore(testId, sid, parseInt(marks));
      const testName = Store_getTests().find(t => t.id === testId)?.name;
      Store_addParentNotification(sid, 'Test Graded', `Scores are out for ${testName}.`, 'test');
    }
  });
  closeModal('enterScoresModal');
  showToast('Scores saved!', 'success');
  navigateTo('tests', 'tutor');
}

// ===== FEES PAGE =====
function renderFees() {
  const students = Store_getStudents();
  const payments = Store_getFeePayments();
  const paid = students.filter(s => s.fees === 'paid').length;
  const pending = students.filter(s => s.fees === 'pending').length;
  const overdue = students.filter(s => s.fees === 'overdue').length;
  const totalCollected = payments.reduce((s,p) => s + (p.amount||0), 0);
  return `
  <div class="page-header"><h1>Fee Management</h1><p>Track payments and send reminders</p></div>
  <div class="grid-3 mb-2">
    <div class="stat-card" style="border-top:3px solid var(--secondary)"><div class="stat-icon" style="background:rgba(0,212,170,0.15)">✅</div><div class="stat-value" style="color:var(--secondary)">₹${totalCollected.toLocaleString()}</div><div class="stat-label">Total Collected</div></div>
    <div class="stat-card" style="border-top:3px solid var(--accent-yellow)"><div class="stat-icon" style="background:rgba(255,217,61,0.15)">⏳</div><div class="stat-value" style="color:var(--accent-yellow)">${pending}</div><div class="stat-label">Pending</div></div>
    <div class="stat-card" style="border-top:3px solid var(--accent)"><div class="stat-icon" style="background:rgba(255,107,107,0.15)">⚠️</div><div class="stat-value" style="color:var(--accent)">${overdue}</div><div class="stat-label">Overdue</div></div>
  </div>
  <div class="grid-2 mb-2">
    <div class="card"><div class="card-header"><div class="card-title">📊 Fee Status</div></div><div class="chart-wrapper"><canvas id="feeStatusChart"></canvas></div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">💳 Quick Actions</div></div>
      <button class="btn btn-secondary w-100 mb-1" onclick="sendNotification('fee')">📢 Send Reminders to Pending</button>
      <button class="btn btn-secondary w-100" onclick="showToast('Fee report generated','success')">📄 Generate Fee Report</button>
    </div>
  </div>
  <div class="card">
    <div class="table-wrapper"><table class="data-table">
      <thead><tr><th>Student</th><th>Monthly Fee</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        ${students.map((s,i) => `<tr>
          <td><div style="display:flex;align-items:center;gap:0.5rem"><div class="avatar avatar-sm" style="background:${getAvatarColor(i)}">${s.avatar}</div>${s.name}</div></td>
          <td>₹${(s.monthlyFee||2500).toLocaleString()}</td>
          <td>${feeBadge(s.fees)}</td>
          <td>
            <div style="display:flex;gap:0.5rem">
              ${s.fees !== 'paid' ? `<button class="btn btn-sm btn-primary" onclick="doMarkPaid(${s.id})">Mark Paid</button>` : '<span class="badge badge-success" style="padding:0.4rem 0.6rem">✓ Paid</span>'}
              <button class="btn btn-sm btn-outline" onclick="openEditFeeModal(${s.id})" title="Edit Monthly Fee & Status">✏️ Edit</button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>
  
  <!-- Edit Fee Modal -->
  <div class="modal-overlay" id="editFeeModal"><div class="modal" style="max-width:400px">
    <div class="modal-header"><span class="modal-title">✏️ Edit Fee Details</span><button class="modal-close" onclick="closeModal('editFeeModal')">✕</button></div>
    <div id="editFeeContent"></div>
  </div></div>
  `;
}

function doMarkPaid(studentId) {
  const s = Store_getStudent(studentId);
  Store_addFeePayment({ studentId, month: new Date().getMonth()+1, year: new Date().getFullYear(), amount: s?.monthlyFee || 2500, paidDate: new Date().toISOString().split('T')[0], status: 'paid' });
  Store_addParentNotification(studentId, 'Payment Received', `Thank you for your fee payment of ₹${s?.monthlyFee || 2500}.`, 'fee');
  showToast(`Payment recorded for ${s?.name}!`, 'success');
  navigateTo('fees', 'tutor');
}

// ===== SCHEDULE =====
function renderSchedule() {
  const schedule = Store_getSchedule();
  return `
  <div class="page-header"><h1>Class Schedule</h1><p>Plan your weekly teaching schedule</p></div>
  <div class="grid-3-2">
    <div class="card"><div class="card-header"><div class="card-title">🗓️ Calendar</div></div><div id="scheduleCalendar"></div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Weekly Classes</div><button class="btn btn-sm btn-primary" onclick="openModal('addClassModal')">+ Add</button></div>
      ${schedule.map(day => `
        <div style="margin-bottom:0.85rem">
          <div style="font-weight:700;font-size:0.85rem;color:var(--text-secondary);text-transform:uppercase;margin-bottom:0.4rem">${day.day}</div>
          ${day.classes.length === 0 ? '<div style="font-size:0.8rem;color:var(--text-muted);font-style:italic">No classes</div>'
            : day.classes.map(c => `<div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:0.6rem 0.85rem;margin-bottom:0.3rem;border-left:3px solid var(--primary);font-size:0.82rem"><strong>${c.batch}</strong> · ${c.subject} · ${c.time}</div>`).join('')}
        </div>
      `).join('')}
    </div>
  </div>
  <div class="modal-overlay" id="addClassModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Add Class</span><button class="modal-close" onclick="closeModal('addClassModal')">✕</button></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Batch</label><input type="text" id="schedBatch" class="form-control" placeholder="e.g. 11th ICSE"></div>
      <div class="form-group"><label class="form-label">Subject</label><select id="schedSubject" class="form-control">${[...new Set(Store_getStudents().flatMap(s => s.subjects || []))].map(sub => `<option value="${sub}">${sub}</option>`).join('') || '<option>General</option>'}</select></div>
      <div class="form-group"><label class="form-label">Day</label><select id="schedDay" class="form-control"><option value="0">Mon</option><option value="1">Tue</option><option value="2">Wed</option><option value="3">Thu</option><option value="4">Fri</option><option value="5">Sat</option><option value="6">Sun</option></select></div>
      <div class="form-group"><label class="form-label">Time</label><input type="time" id="schedTime" class="form-control" value="16:00"></div>
    </div>
    <button class="btn btn-primary" onclick="doAddClass()">Add to Schedule</button>
  </div></div>
  `;
}

function doAddClass() {
  const dayIdx = parseInt(document.getElementById('schedDay').value);
  Store_addClassToSchedule(dayIdx, {
    batch: document.getElementById('schedBatch').value.trim(),
    subject: document.getElementById('schedSubject').value,
    time: document.getElementById('schedTime').value,
  });
  closeModal('addClassModal');
  showToast('Class added!', 'success');
  navigateTo('schedule', 'tutor');
}

// ===== TEACHING LOG & NOTIFICATIONS =====
function renderTeachingLog() {
  const logs = Store_getTeachingLog();
  const notifs = Store_getNotifications();
  return `
  <div class="page-header">
    <h1>Log & Notifications</h1>
    <p>Record teaching sessions and view automated notifications sent to parents</p>
  </div>
  <div style="display:flex;justify-content:flex-end;margin-bottom:1.25rem">
    <button class="btn btn-primary" onclick="openModal('addLogModal')">+ Add Today's Log</button>
  </div>
  
  <div class="grid-2">
    <!-- Manual Teaching Logs -->
    <div class="card">
      <div class="card-header"><div class="card-title">📖 Class Logs</div></div>
      ${logs.length === 0 ? '<div style="color:var(--text-muted);text-align:center;padding:2rem">No logs recorded yet.</div>' : ''}
      <div style="display:flex;flex-direction:column;gap:1rem">
        ${logs.map(log => `
          <div style="border-left:3px solid var(--primary);padding-left:1rem">
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;margin-bottom:0.25rem">${log.date} • ${log.batch}</div>
            <div style="font-weight:700;color:var(--text-primary);margin-bottom:0.25rem">${log.topic} <span class="badge ${log.subject==='Physics'?'tag-physics':'tag-math'}">${log.subject}</span></div>
            <div style="font-size:0.9rem;color:var(--text-secondary)">${log.notes || 'No notes'}</div>
            ${log.duration ? `<div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.2rem">⏱️ ${log.duration}</div>` : ''}
            ${log.homework ? `<div style="font-size:0.8rem;color:var(--primary);margin-top:0.2rem">📝 HW: ${log.homework}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Automated Notification Logs -->
    <div class="card">
      <div class="card-header"><div class="card-title">📨 Sent Parent Notifications</div></div>
      ${notifs.length === 0 ? '<div style="color:var(--text-muted);text-align:center;padding:2rem">No notifications sent yet.</div>' : ''}
      <div style="display:flex;flex-direction:column;gap:1rem;max-height:600px;overflow-y:auto">
        ${notifs.map(n => {
          const s = Store_getStudent(n.targetStudentId);
          return `
          <div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:0.75rem">
            <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
              <strong style="color:var(--text-primary);font-size:0.9rem">${n.title}</strong>
              <span style="font-size:0.75rem;color:var(--text-muted)">${n.date}</span>
            </div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">${n.message}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.5rem">
              ${n.targetStudentId && s ? `<div style="font-size:0.75rem;color:var(--primary);font-weight:600">▶ Sent to: ${s.name}'s Parent</div>` : '<div style="font-size:0.75rem;color:var(--secondary);font-weight:600">📢 Broadcast</div>'}
              <div style="font-size:0.75rem;color:var(--text-muted);background:rgba(255,255,255,0.05);padding:0.1rem 0.4rem;border-radius:4px">
                👥 ${(n.acknowledgments || []).length} Acknowledged
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="addLogModal"><div class="modal">
    <div class="modal-header"><span class="modal-title">Add Teaching Log</span><button class="modal-close" onclick="closeModal('addLogModal')">✕</button></div>
    <div class="grid-2">
      <div class="form-group"><label class="form-label">Batch</label><input type="text" id="logBatch" class="form-control" placeholder="e.g. 11th ICSE"></div>
      <div class="form-group"><label class="form-label">Subject</label><select id="logSubject" class="form-control">${[...new Set(Store_getStudents().flatMap(s => s.subjects || []))].map(sub => `<option value="${sub}">${sub}</option>`).join('') || '<option>General</option>'}</select></div>
      <div class="form-group"><label class="form-label">Date</label><input type="date" id="logDate" class="form-control" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label class="form-label">Duration</label><select id="logDuration" class="form-control"><option>1h</option><option>1.5h</option><option>2h</option><option>2.5h</option></select></div>
    </div>
    <div class="form-group"><label class="form-label">Topic Covered</label><input type="text" id="logTopic" class="form-control" placeholder="e.g., Capacitance"></div>
    <div class="form-group"><label class="form-label">Homework (optional)</label><input type="text" id="logHW" class="form-control" placeholder="e.g., Problems 6.1-6.5"></div>
    <div class="form-group"><label class="form-label">Notes (optional)</label><textarea id="logNotes" class="form-control" rows="2"></textarea></div>
    <button class="btn btn-primary" onclick="doAddLog()">Save Log</button>
  </div></div>
  `;
}

function doAddLog() {
  const topic = document.getElementById('logTopic').value.trim();
  if (!topic) { showToast('Enter the topic covered', 'warning'); return; }
  Store_addTeachingLog({
    batch: document.getElementById('logBatch').value.trim(),
    subject: document.getElementById('logSubject').value,
    date: document.getElementById('logDate').value,
    duration: document.getElementById('logDuration').value,
    topic, homework: document.getElementById('logHW').value.trim(),
    notes: document.getElementById('logNotes').value.trim(),
  });
  closeModal('addLogModal');
  showToast('Teaching log saved!', 'success');
  navigateTo('teachinglog', 'tutor');
}

// ===== DOUBTS =====
function renderDoubts() {
  const doubts = Store_getDoubts();
  const unanswered = doubts.filter(d => !d.answered).length;
  return `
  <div class="page-header"><h1>Doubt Management</h1><p>Review and answer student doubts</p></div>
  <div style="margin-bottom:1.25rem"><span class="badge badge-danger">${unanswered} Unanswered</span></div>
  ${doubts.length === 0 ? '<div class="card" style="text-align:center;padding:3rem"><div style="font-size:2.5rem;margin-bottom:1rem">💬</div><div style="font-size:1.1rem;font-weight:700">No doubts yet</div><div style="color:var(--text-secondary)">Students will post doubts here</div></div>' : ''}
  ${doubts.map(d => `
    <div class="doubt-item">
      <div class="doubt-header">
        <div class="avatar" style="background:var(--grad-primary)">${(d.studentName||'??').slice(0,2).toUpperCase()}</div>
        <div style="flex:1">
          <div class="doubt-question">${d.question}</div>
          <div class="doubt-meta">${d.studentName||'Student'} · ${d.subject} · ${d.time}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem">
          ${d.answered ? '<span class="badge badge-success">✓ Answered</span>' : '<span class="badge badge-danger">⚡ New</span>'}
          <button class="btn btn-sm" style="background:none;border:none;padding:0;font-size:1.2rem;cursor:pointer" onclick="deleteDoubtTutor(${d.id})" title="Delete Doubt">🗑️</button>
        </div>
      </div>
      ${d.answered ? `<div class="doubt-answer">📣 <strong>Your Answer:</strong> ${d.answer}</div>` : `
        <div style="margin-top:0.75rem;display:flex;gap:0.75rem">
          <textarea class="form-control" rows="2" placeholder="Type your answer..." style="flex:1" id="answerInput_${d.id}"></textarea>
          <button class="btn btn-sm btn-primary" onclick="doAnswerDoubt(${d.id})">Post</button>
        </div>
      `}
    </div>
  `).join('')}
  `;
}

function doAnswerDoubt(doubtId) {
  const input = document.getElementById(`answerInput_${doubtId}`);
  const answer = input ? input.value.trim() : '';
  if (!answer) { showToast('Please type an answer', 'warning'); return; }
  Store_answerDoubt(doubtId, answer);
  showToast('Answer posted!', 'success');
  navigateTo('doubts', 'tutor');
}

function deleteDoubtTutor(doubtId) {
  if (confirm('Are you sure you want to delete this doubt?')) {
    Store_deleteDoubt(doubtId);
    showToast('Doubt deleted', 'warning');
    navigateTo('doubts', 'tutor');
  }
}

function doBroadcast() {
  const msg = document.getElementById('broadcastMessage').value.trim();
  if (!msg) { showToast('Please enter a message', 'warning'); return; }
  Store_addNotification({
    title: 'Announcement from Tutor',
    message: msg,
    date: new Date().toISOString().split('T')[0],
    type: 'broadcast'
  });
  closeModal('broadcastModal');
  showToast('Announcement sent to all students!', 'success');
}

function renderTutorSettings() {
  const creds = Store_getCredentials();
  const tutorCred = creds['tutor'] || { pin: '0000' };
  const tutorProfile = Store_getTutorProfile();
  
  return `
  <div class="page-header">
    <h1>⚙️ Profile Settings</h1>
    <p>Update your login credentials and personal information</p>
  </div>
  
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><div class="card-title">🔑 Login Credentials</div></div>
      <div class="form-group" style="opacity:0.7">
        <label class="form-label">Username</label>
        <input type="text" id="setTutorUsername" class="form-control" value="tutor" disabled>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Username "tutor" is fixed for the administrator.</div>
      </div>
      <div class="form-group">
        <label class="form-label">Update 4-Digit PIN</label>
        <input type="password" id="setTutorPin" class="form-control" placeholder="Enter new 4-digit PIN" maxlength="4" inputmode="numeric">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Current PIN is <strong>${tutorCred.pin}</strong></div>
      </div>
      <button class="btn btn-primary" onclick="doUpdateTutorCredentials()">💾 Save Changes</button>
    </div>
    
    <div class="card">
      <div class="card-header"><div class="card-title">📝 Profile Information</div></div>
      <div class="form-group">
        <label class="form-label">Display Name</label>
        <input type="text" id="setTutorName" class="form-control" value="${tutorProfile.name || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Subjects</label>
        <input type="text" id="setTutorSubject" class="form-control" value="${tutorProfile.subject || ''}">
      </div>
      <button class="btn btn-secondary" onclick="doUpdateTutorProfile()">Update Info</button>
    </div>
  </div>
  `;
}

function doUpdateTutorProfile() {
  const name = document.getElementById('setTutorName').value.trim();
  const subject = document.getElementById('setTutorSubject').value.trim();
  if (!name) { showToast('Please enter a display name', 'warning'); return; }
  Store_updateTutorProfile({ name, subject });
  buildSidebar('tutor');
  showToast('Profile information updated!', 'success');
  navigateTo('settings', 'tutor');
}

function doUpdateTutorCredentials() {
  const pin = document.getElementById('setTutorPin').value.trim();
  if (!pin) { showToast('Please enter a new PIN', 'warning'); return; }
  if (!/^\d{4}$/.test(pin)) { showToast('PIN must be exactly 4 digits', 'warning'); return; }
  
  const res = Store_updateCredentials('tutor', 'tutor', pin, 'tutor');
  if (res.success) {
    showToast('Tutor PIN updated successfully!', 'success');
    document.getElementById('setTutorPin').value = '';
    navigateTo('settings', 'tutor');
  } else {
    showToast(res.message, 'error');
  }
}

function doResolveRequest(notifId) {
  Store_deleteNotification(notifId);
  showToast('Request resolved', 'success');
  navigateTo('dashboard', 'tutor');
}

function openEditFeeModal(studentId) {
  const s = Store_getStudent(studentId);
  if (!s) return;
  const content = document.getElementById('editFeeContent');
  content.innerHTML = `
    <div class="form-group">
      <label class="form-label">Monthly Fee (₹)</label>
      <input type="number" id="editFeeAmount" class="form-control" value="${s.monthlyFee || 2500}">
    </div>
    <div class="form-group">
      <label class="form-label">Fee Status</label>
      <select id="editFeeStatus" class="form-control">
        <option value="paid" ${s.fees === 'paid' ? 'selected' : ''}>Paid</option>
        <option value="pending" ${s.fees === 'pending' || !s.fees ? 'selected' : ''}>Pending</option>
        <option value="overdue" ${s.fees === 'overdue' ? 'selected' : ''}>Overdue</option>
      </select>
    </div>
    <div style="display:flex;gap:0.75rem;margin-top:1rem">
      <button class="btn btn-primary" onclick="saveFeeDetails(${studentId})">💾 Save Changes</button>
      <button class="btn btn-secondary" onclick="closeModal('editFeeModal')">Cancel</button>
    </div>
  `;
  openModal('editFeeModal');
}

function saveFeeDetails(studentId) {
  const amount = parseInt(document.getElementById('editFeeAmount').value);
  const status = document.getElementById('editFeeStatus').value;
  if (isNaN(amount)) { showToast('Invalid amount', 'warning'); return; }
  
  Store_updateFeeDetails(studentId, amount, status);
  closeModal('editFeeModal');
  showToast('Fee details updated!', 'success');
  navigateTo('fees', 'tutor');
}

// Expose all functions globally
window.renderTutorPage = renderTutorPage;
window.doAddStudent = doAddStudent;
window.openAddStudentModal = openAddStudentModal;
window.refreshSubjectsList = refreshSubjectsList;
window.openEditStudentModal = openEditStudentModal;
window.doEditStudent = doEditStudent;
window.deleteStudentConfirm = deleteStudentConfirm;
window.openSetLoginModal = openSetLoginModal;
window.openRemarksModal = openRemarksModal;
window.doAddRemark = doAddRemark;
window.saveStudentLogin = saveStudentLogin;
window.doMarkAttendance = doMarkAttendance;
window.doAssignHomework = doAssignHomework;
window.doCreateTest = doCreateTest;
window.openBulkUploadModal = () => openModal('bulkUploadModal');
window.handleBulkFileSelection = handleBulkFileSelection;
window.doBulkUpload = doBulkUpload;
window.openEnterScoresModal = openEnterScoresModal;
window.doSaveScores = doSaveScores;
window.doMarkPaid = doMarkPaid;
window.doAddClass = doAddClass;
window.doAddLog = doAddLog;
window.doAnswerDoubt = doAnswerDoubt;
window.doBroadcast = doBroadcast;
window.deleteDoubtTutor = deleteDoubtTutor;
window.renderTutorSettings = renderTutorSettings;
window.doUpdateTutorCredentials = doUpdateTutorCredentials;
window.doUpdateTutorProfile = doUpdateTutorProfile;
window.openEditFeeModal = openEditFeeModal;
window.saveFeeDetails = saveFeeDetails;
window.doResolveRequest = doResolveRequest;
window.updateMonthlyReportView = updateMonthlyReportView;
window.doExportAttendance = doExportAttendance;
