/**
 * Swaft Academy — localStorage-backed Data Store
 * All data lives in localStorage so the tutor can manage everything from the frontend.
 * Key: 'swaft_data'
 */

const STORE_KEY = 'swaft_data';

const SYLLABUS_MAP = {
  "11": {
    "ICSE": {
      "Physics": [
        { name: "Units and Measurements", details: "Scope of Physics, units, significant figures, dimensional analysis, and errors.", questions: ["Define significant figures.", "What is dimensional analysis?"], faqs: ["Why are units important?", "What is the difference between fundamental and derived units?"] },
        { name: "Kinematics", details: "Motion in a straight line and plane, vectors, projectile motion.", questions: ["Define displacement.", "State the equation for projectile height."], faqs: ["What is a scalar vs vector?", "Why is acceleration due to gravity constant?"] },
        { name: "Laws of Motion", details: "Force, inertia, Newton's laws, momentum, friction, circular motion.", questions: ["State Newton's Second Law.", "What is limiting friction?"], faqs: ["Can 1st law be derived from 2nd?", "Why are roads banked?"] },
        { name: "Work, Energy and Power", details: "Work done by constant/variable forces, Kinetic/Potential energy, Work-energy theorem, Power.", questions: ["State Work-Energy Theorem.", "Define Power."], faqs: ["Is work a vector?", "Difference between conservative and non-conservative forces?"] },
        { name: "System of Particles and Rotational Motion", details: "Center of mass, torque, angular momentum, moment of inertia, rolling motion.", questions: ["Define torque.", "State the parallel axis theorem."], faqs: ["Why do divers curl their bodies?", "What is planetary motion?"] },
        { name: "Gravitation", details: "Kepler's laws, universal law of gravitation, gravitational potential, escape velocity, satellites.", questions: ["State Kepler's 3rd Law.", "What is escape velocity?"], faqs: ["Why is G called universal constant?", "How do geostationary satellites work?"] },
        { name: "Mechanical Properties of Solids", details: "Elasticity, stress, strain, Hooke's law, Young's modulus.", questions: ["State Hooke's Law.", "Define Young's Modulus."], faqs: ["Why is steel more elastic than rubber?", "What is plastic deformation?"] },
        { name: "Mechanical Properties of Fluids", details: "Pressure, Pascal's law, Archimedes' principle, Bernoulli's principle, viscosity, surface tension.", questions: ["State Bernoulli's Principle.", "What is terminal velocity?"], faqs: ["Why do ships float?", "How does an airplane wing get lift?"] },
        { name: "Thermal Properties of Matter", details: "Heat, temperature, expansion, specific heat, calorimetry, latent heat.", questions: ["Define calorimetry.", "What is latent heat?"], faqs: ["What is anomalous expansion of water?", "Difference between heat and temperature?"] },
        { name: "Thermodynamics", details: "Thermal equilibrium, laws of thermodynamics, heat engines, refrigerators.", questions: ["State 1st Law of Thermodynamics.", "What is an adiabatic process?"], faqs: ["Can 100% heat be converted to work?", "What is entropy?"] },
        { name: "Kinetic Theory", details: "Molecular nature of matter, ideal gas, kinetic interpretation of temperature.", questions: ["State Postulates of Kinetic Theory.", "What is RMS speed?"], faqs: ["What is an ideal gas?", "Why pressure increases with temperature?"] },
        { name: "Oscillations", details: "Periodic/SHM, simple pendulum, resonance.", questions: ["Define SHM.", "State the formula for pendulum period."], faqs: ["Why is SHM periodic?", "What is damping?"] },
        { name: "Waves", details: "Transverse/longitudinal waves, superposition, Doppler effect.", questions: ["What is Doppler Effect?", "Define wave intensity."], faqs: ["Why does sound travel faster in solids?", "Difference between echo and resonance?"] }
      ],
      "Chemistry": [
        { name: "Basic Concepts", details: "Laws of chemical combination, mole concept, stoichiometry.", questions: ["Define one mole.", "State Law of Definite Proportions."], faqs: ["What is molarity vs molality?", "How to calculate empirical formula?"] },
        { name: "Structure of Atom", details: "Atomic models, quantum numbers, electronic configuration.", questions: ["State Heisenberg's Uncertainty Principle.", "Explain Pauli's Exclusion Principle."], faqs: ["What is an orbital?", "Why is half-filled subshell stable?"] },
        { name: "Classification of Elements", details: "Periodic table history, electronic configs, trends (radius, ionization, electronegativity).", questions: ["What is ionization enthalpy?", "Explain electronegativity trend."], faqs: ["Why do noble gases have high IE?", "What is shielding effect?"] },
        { name: "Chemical Bonding", details: "Octet rule, ionic/covalent bonds, VSEPR theory, hybridization, MO theory.", questions: ["Explain VSEPR theory.", "What is sp3 hybridization?"], faqs: ["Why is H2O bent?", "Difference between sigma and pi bonds?"] },
        { name: "States of Matter", details: "Gaseous/liquid states, gas laws, intermolecular forces.", questions: ["State Boyle's Law.", "Define viscosity."], faqs: ["Why do liquids flow?", "What is surface tension?"] },
        { name: "Thermodynamics", details: "System/surroundings, enthalpy, entropy, Gibbs free energy, spontaneity.", questions: ["State Hess's Law.", "Define Gibbs free energy."], faqs: ["What is an exothermic reaction?", "How to predict spontaneity?"] },
        { name: "Equilibrium", details: "Law of mass action, Le Chatelier's principle, pH, buffers, solubility product.", questions: ["State Le Chatelier's Principle.", "Calculate pH of 0.01M HCl."], faqs: ["What are buffers?", "Effect of temperature on Keq?"] },
        { name: "Redox Reactions", details: "Oxidation/reduction, oxidation numbers, balancing equations.", questions: ["Balance MnO4- + Fe2+.", "Define oxidation number."], faqs: ["Is photosynthesis redox?", "What is a reducing agent?"] },
        { name: "Hydrogen", details: "Position in periodic table, isotopes, hydrides, water, H2O2.", questions: ["Why is Hydrogen unique?", "Types of hydrides."], faqs: ["What is heavy water?", "Is hydrogen a metal or non-metal?"] },
        { name: "s-Block Elements", details: "Group 1 (Alkali) & Group 2 (Alkaline earth) metals, characteristics.", questions: ["Flame colors of s-block.", "Solubility trends."], faqs: ["Why is Lithium anomalous?", "Uses of Magnesium?"] },
        { name: "p-Block Elements", details: "Group 13 & 14 elements introduction.", questions: ["Explain Inert Pair Effect.", "Uses of Boron."], faqs: ["What are allotropes of Carbon?", "Why is CO toxic?"] },
        { name: "Organic Chemistry Basics", details: "Classification, IUPAC nomenclature, isomerism, inductive/electromeric effects.", questions: ["Name CH3-CH(OH)-CH3.", "What are functional isomers?"], faqs: ["Why carbon forms so many compounds?", "What is resonance in organic chemistry?"] },
        { name: "Hydrocarbons", details: "Alkanes, alkenes, alkynes, aromatic hydrocarbons, preparations, reactions.", questions: ["Explain Markovnikov's rule.", "Describe Ozonolysis."], faqs: ["Why benzene is stable?", "How to distinguish alkane from alkene?"] },
        { name: "Environmental Chemistry", details: "Atmospheric/water/soil pollution, greenhouse effect, smog.", questions: ["Explain Acid Rain.", "What is BOD?"], faqs: ["How to prevent ozone depletion?", "Sources of soil pollution?"] }
      ],
      "Math": [
        "Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction", 
        "Complex Numbers", "Quadratic Equations", "Linear Inequalities", 
        "Permutations and Combinations", "Binomial Theorem", "Sequence and Series", 
        "Straight Lines", "Circles", "Locus", "Conic Sections (Parabola, Ellipse, Hyperbola)", 
        "Introduction to 3D Geometry", "Limits and Derivatives", "Mathematical Reasoning", 
        "Statistics", "Probability", "Correlation Analysis", "Index Numbers and Moving Averages"
      ]
    },
    // ...other boards
  },
  "6": {
    "ICSE": {
      "Math": [
        { name: "Number System", details: "Natural numbers, integers, HCF and LCM.", questions: ["Find HCF of 12 and 18.", "What are prime numbers?"], faqs: ["What is a twin prime?", "Is 1 a prime number?"] },
        "Integers", "Fractions", "Decimals",
        { name: "Ratio and Proportion", details: "Comparing quantities, unitary method, equivalent ratios.", questions: ["Simplify 12:18.", "Find x if 2:3 = x:6."], faqs: ["What is a proportion?", "Difference between ratio and fraction?"] },
        { name: "Algebra", details: "Variables, constants, expressions, simple equations.", questions: ["Write '5 more than x'.", "Solve 2x = 10."], faqs: ["What is a variable?", "How to frame an equation?"] },
        { name: "Geometry", details: "Points, lines, rays, angles, triangles, circles.", questions: ["Define an obtuse angle.", "Parts of a circle."], faqs: ["Is a ray infinite?", "Sum of angles in a triangle?"] },
        { name: "Mensuration", details: "Perimeter and area of squares and rectangles.", questions: ["Find area of rectangle (5x4).", "Perimeter of square side 3."], faqs: ["Definition of perimeter?", "Units of area?"] },
        { name: "Data Handling", details: "Collecting data, tally marks, pictographs, bar graphs.", questions: ["What is a pictograph?", "Draw frequency for 5."], faqs: ["Why use tally marks?", "How to read a bar graph?"] }
      ],
      "Science": [
        "Introduction to Biology", "Living and Non-Living Things", 
        "Plant Life: The Leaf", "Plant Life: The Flower", "Cell Structure and Function",
        { name: "The Body", details: "Digestive, respiratory, and circulatory systems basics.", questions: ["Name organs of digestion.", "Path of air to lungs."], faqs: ["What is pulse?", "Why do we breathe?"] },
        { name: "Health and Hygiene", details: "Balanced diet, nutrients, deficiency diseases, clean surroundings.", questions: ["List 5 nutrients.", "Vitamin A deficiency disease?"], faqs: ["What is a balanced diet?", "Importance of exercise?"] },
        "Adaptation",
        { name: "Matter", details: "States of matter, physical and chemical changes.", questions: ["Define sublimation.", "Give examples of chemical changes."], faqs: ["Why is ice less dense than water?", "Difference between boiling and evaporation?"] },
        "Elements, Compounds and Mixtures", "Fundamentals of Chemistry", "Air and Water",
        "Introduction to Physics", 
        { name: "Measurement", details: "SI units, measuring length, mass, time.", questions: ["Define SI unit.", "How to measure irregular objects?"], faqs: ["Why standard units?", "1 km = ? meters"] },
        "Force", "Work and Pressure", "Simple Machines", "Energy", "Light", "Magnetism"
      ],
      "Social": [
        { name: "History Introduction", details: "Sources of history, timeline (BC/AD), significance of studying history.", questions: ["Define history.", "What are secondary sources?"], faqs: ["Difference between BC and AD?", "Why study the past?"] },
        "History: Early Man",
        { name: "Indus Valley", details: "Discovery, major cities, urban planning.", questions: ["Describe the Great Bath.", "Who discovered Harappa?"], faqs: ["Why did the civilization decline?", "What was the main occupation?"] },
        "History: River Valley Civilizations (Mesopotamian, Egyptian, Chinese)",
        "History: The Vedic Civilization", "History: Mahavira and Buddha", 
        "History: Rise of Kingdoms and Republics", "History: The Mauryan Empire", "History: The Golden Age: Gupta Empire",
        { name: "Local Government", details: "Panchayati Raj, Municipalities, functions of local bodies.", questions: ["What is Gram Sabha?", "Functions of a Mayor."], faqs: ["Why local government?", "What are ward councilors?"] },
        "Civics: Urban Self-Government",
        "Geography: Understanding Geography: Globe and Maps", "Geography: Major Landforms on Earth", 
        "Geography: Major Water Bodies", "Geography: Agriculture", "Geography: Minerals", 
        "Geography: Study of Continents: North America", "Geography: Study of Continents: South America"
      ],
      "English": [
        "Nouns", "Pronouns", "Adjectives", "Verbs", "Tenses", 
        "Adverbs", "Subject-Verb Agreement", "Articles and Determiners", 
        "Prepositions", "Conjunctions", "Punctuation", 
        "Direct and Indirect Speech", "Active and Passive Voice", 
        "Literature: Stories and Poems (Prescribed Reader)"
      ]
    }
  }
};

// ======= DEFAULT SEED DATA (4 students) =======
function getDefaultData() {
  return {
    tutor: {
      name: "Tutor",
      subject: "Physics & Mathematics",
    },
    students: [
      { id: 1, name: "Eva",        class: "11", board: "ICSE", gender: "female", batch: "11th ICSE", attendance: 0, marks: 0, fees: "pending", avatar: "EV", phone: "", parentName: "", parentPhone: "", monthlyFee: 2500, subjects: ["Physics", "Chemistry", "Math"], remarks: [], badges: ['consistent'] },
      { id: 2, name: "Rushat",     class: "11", board: "ICSE", gender: "male",   batch: "11th ICSE", attendance: 0, marks: 0, fees: "pending", avatar: "RU", phone: "", parentName: "", parentPhone: "", monthlyFee: 2500, subjects: ["Physics", "Math"], remarks: [], badges: ['math_whiz'] },
      { id: 3, name: "Mia",        class: "6",  board: "ICSE", gender: "female", batch: "6th ICSE",  attendance: 0, marks: 0, fees: "pending", avatar: "MI", phone: "", parentName: "", parentPhone: "", monthlyFee: 2500, subjects: ["Math", "Science", "Social", "English"], remarks: [], badges: ['creative'] },
      { id: 4, name: "New Student", class: "11", board: "CBSE", gender: "neutral", batch: "11th CBSE", attendance: 0, marks: 0, fees: "pending", avatar: "NS", phone: "", parentName: "", parentPhone: "", monthlyFee: 2500, subjects: ["Physics", "Math"], remarks: [], badges: [] },
    ],
    batches: [
      { id: 1, name: "11th ICSE", students: 2, subject: "Physics + Math", time: "TBD", color: "primary" },
      { id: 2, name: "6th ICSE",  students: 1, subject: "Math",           time: "TBD", color: "secondary" },
      { id: 3, name: "11th CBSE", students: 1, subject: "Physics + Math", time: "TBD", color: "accent" },
    ],
    credentials: {
      // username: { pin, studentId, name, role }
      tutor:  { pin: '0000', role: 'tutor', name: 'Tutor' },
      eva:    { pin: '1111', studentId: 1, name: 'Eva', role: 'student' },
      rushat: { pin: '2222', studentId: 2, name: 'Rushat', role: 'student' },
      mia:    { pin: '3333', studentId: 3, name: 'Mia', role: 'student' },
    },
    attendanceRecords: [],
    // { id, studentId, date, status: 'present'|'absent'|'late' }
    testRecords: [],
    // { id, name, subject, batch, date, maxMarks, scores: [{studentId, marks}] }
    homeworkRecords: [],
    // { id, title, subject, batch, dueDate, description, submissions: [{studentId, submitted: bool, date}] }
    teachingLog: [],
    // { id, date, batch, subject, topic, duration, homework, notes }
    feePayments: [],
    // { id, studentId, month, year, amount, paidDate, status: 'paid'|'pending'|'overdue' }
    doubts: [],
    // { id, studentId, studentName, question, subject, time, answered, answer }
    videos: [],
    flashcards: [],
    questions: [
      { id: 101, question: "If A = {1, 2, 3} and B = {3, 4, 5}, what is A ∩ B?", options: ["{1, 2}", "{3}", "{1, 2, 3, 4, 5}", "∅"], correct: 1, explanation: "The intersection (∩) of two sets contains only the elements present in both sets. Here, 3 is the only common element.", grade: "11", board: "ICSE", subject: "Math" },
      { id: 102, question: "Which of the following is a null set?", options: ["{0}", "{x : x is an even prime > 2}", "{x : x² = 4, x is odd}", "None of these"], correct: 2, explanation: "x² = 4 gives x = 2 or -2. Neither is odd, so the set has no elements.", grade: "11", board: "ICSE", subject: "Math" },
      { id: 103, question: "The power set of an empty set has how many elements?", options: ["0", "1", "2", "Infinite"], correct: 1, explanation: "The power set of any set A has 2^n elements where n is the number of elements in A. For an empty set, n=0, so 2^0 = 1. The only element is the empty set itself.", grade: "11", board: "ICSE", subject: "Math" }
    ],
    notifications: [],
    schedule: [
      { day: "Mon", classes: [] },
      { day: "Tue", classes: [] },
      { day: "Wed", classes: [] },
      { day: "Thu", classes: [] },
      { day: "Fri", classes: [] },
      { day: "Sat", classes: [] },
      { day: "Sun", classes: [] },
    ],
    nextId: 100, // Global auto-increment for new records
  };
}

// ======= CORE LOAD / SAVE =======
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error('Store load error', e); }
  return null;
}

function saveStore(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch (e) { console.error('Store save error', e); }
}

function getStore() {
  let data = loadStore();
  if (!data) {
    data = getDefaultData();
    saveStore(data);
  }
  return data;
}

function resetStore() {
  const data = getDefaultData();
  saveStore(data);
  return data;
}

function getNextId() {
  const data = getStore();
  const id = data.nextId || 100;
  data.nextId = id + 1;
  saveStore(data);
  return id;
}

// ======= STUDENT CRUD =======
function Store_getStudents() {
  return getStore().students || [];
}

function Store_getStudent(id) {
  return Store_getStudents().find(s => s.id === id) || null;
}

function Store_addStudent(student) {
  const data = getStore();
  student.id = getNextId();
  student.avatar = student.name.slice(0, 2).toUpperCase();
  student.remarks = [];
  data.students.push(student);
  saveStore(data);
  return student;
}

function Store_updateStudent(id, updates) {
  const data = getStore();
  const idx = data.students.findIndex(s => s.id === id);
  if (idx === -1) return false;
  Object.assign(data.students[idx], updates);
  if (updates.name) data.students[idx].avatar = updates.name.slice(0, 2).toUpperCase();
  saveStore(data);
  return true;
}

function Store_deleteStudent(id) {
  const data = getStore();
  data.students = data.students.filter(s => s.id !== id);
  // Also remove credentials
  Object.keys(data.credentials).forEach(k => {
    if (data.credentials[k].studentId === id && data.credentials[k].role !== 'tutor') delete data.credentials[k];
  });
  saveStore(data);
}

// ======= STUDENT REMARKS =======
function Store_addRemark(studentId, text) {
  const data = getStore();
  const student = data.students.find(s => s.id === studentId);
  if (!student) return false;
  if (!student.remarks) student.remarks = [];
  student.remarks.unshift({
    id: getNextId(),
    date: new Date().toISOString().split('T')[0],
    text: text
  });
  saveStore(data);
  return true;
}

// ======= CREDENTIALS =======
function Store_getCredentials() {
  return getStore().credentials || {};
}

function Store_setCredential(studentId, username, pin) {
  const data = getStore();
  const lowerUsername = username.toLowerCase().trim();
  // Remove old credential for this student
  Object.keys(data.credentials).forEach(k => {
    if (data.credentials[k].studentId === studentId && data.credentials[k].role !== 'tutor') delete data.credentials[k];
  });
  const student = data.students.find(s => s.id === studentId);
  data.credentials[lowerUsername] = {
    pin: pin.trim(),
    studentId: studentId,
    name: student ? student.name : '',
    role: 'student'
  };
  saveStore(data);
}

function Store_updateCredentials(oldUsername, newUsername, newPin, role, studentId) {
  const data = getStore();
  const lowerOld = oldUsername.toLowerCase().trim();
  const lowerNew = newUsername.toLowerCase().trim();
  
  // If username is changing, check for collision
  if (lowerOld !== lowerNew && data.credentials[lowerNew]) {
    return { success: false, message: 'Username already exists' };
  }

  const cred = data.credentials[lowerOld];
  if (!cred) return { success: false, message: 'Current credentials not found' };

  // Delete old if username changed
  if (lowerOld !== lowerNew) {
    delete data.credentials[lowerOld];
  }

  // Update/Set new
  data.credentials[lowerNew] = {
    ...cred,
    pin: newPin.trim(),
    name: cred.name || (role === 'tutor' ? 'Tutor' : '')
  };

  saveStore(data);
  return { success: true };
}

function Store_validateLogin(username, pin) {
  const creds = Store_getCredentials();
  const entry = creds[username.toLowerCase().trim()];
  if (!entry) return null;
  if (entry.pin !== pin.trim()) return null;
  if (entry.role === 'tutor') return { role: 'tutor' };
  return Store_getStudent(entry.studentId);
}

function Store_getCredentialInfo(studentId) {
  const creds = Store_getCredentials();
  for (const [username, data] of Object.entries(creds)) {
    if (data.studentId === studentId) return { username, pin: data.pin };
  }
  return null;
}

// ======= ATTENDANCE =======
function Store_getAttendance(filters) {
  const records = getStore().attendanceRecords || [];
  if (!filters) return records;
  return records.filter(r => {
    if (filters.studentId && r.studentId !== filters.studentId) return false;
    if (filters.date && r.date !== filters.date) return false;
    if (filters.batch) {
      const student = Store_getStudent(r.studentId);
      if (!student || student.batch !== filters.batch) return false;
    }
    return true;
  });
}

function Store_markAttendance(studentId, date, status) {
  const data = getStore();
  // Remove existing record for same student+date
  data.attendanceRecords = data.attendanceRecords.filter(
    r => !(r.studentId === studentId && r.date === date)
  );
  
  // If status is specific, add the new record
  if (status !== 'clear') {
    data.attendanceRecords.push({ id: getNextId(), studentId, date, status });
  }

  // Update student's overall attendance percentage
  const allRecords = data.attendanceRecords.filter(r => r.studentId === studentId);
  const present = allRecords.filter(r => r.status === 'present').length;
  const total = allRecords.length;
  const student = data.students.find(s => s.id === studentId);
  if (student) student.attendance = total > 0 ? Math.round((present / total) * 100) : 0;
  saveStore(data);
}

// ======= CSV EXPORT EXTRAS =======
function Store_exportAttendanceCSV(year, month) {
  const students = Store_getStudents();
  const records = getStore().attendanceRecords || [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Create Headers
  let csvContent = "Student,Class,Batch,";
  for (let i = 1; i <= daysInMonth; i++) {
    csvContent += `Day ${i},`;
  }
  csvContent += "Present,Absent,Late\n";

  // Create Rows
  students.forEach(student => {
    let row = `"${student.name}","${student.class}","${student.batch}",`;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dStr = day.toString().padStart(2, '0');
      const mStr = month.toString().padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      
      const record = records.find(r => r.studentId === student.id && r.date === dateStr);
      if (record) {
        if (record.status === 'present') { row += "P,"; presentCount++; }
        else if (record.status === 'absent') { row += "A,"; absentCount++; }
        else if (record.status === 'late') { row += "L,"; lateCount++; }
        else { row += "-,"; }
      } else {
        row += "-,";
      }
    }
    row += `${presentCount},${absentCount},${lateCount}\n`;
    csvContent += row;
  });

  return csvContent;
}

function Store_downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ======= TESTS =======
function Store_getTests() {
  return getStore().testRecords || [];
}

function Store_addTest(test) {
  const data = getStore();
  test.id = getNextId();
  test.scores = test.scores || [];
  test.pdfData = test.pdfData || null;
  test.startTime = test.startTime || null;
  test.endTime = test.endTime || null;
  test.grade = test.grade || "All";
  test.board = test.board || "All";
  data.testRecords.push(test);
  saveStore(data);
  return test;
}

function Store_bulkAddTests(commonParams, files) {
  const data = getStore();
  files.forEach(f => {
    const test = {
      ...commonParams,
      id: getNextId(),
      name: f.name || `Test - ${new Date().toLocaleDateString()}`,
      pdfData: f.pdfData,
      scores: []
    };
    data.testRecords.push(test);
  });
  saveStore(data);
}

function Store_updateTest(id, updates) {
  const data = getStore();
  const idx = data.testRecords.findIndex(t => t.id === id);
  if (idx === -1) return false;
  Object.assign(data.testRecords[idx], updates);
  saveStore(data);
  return true;
}

function Store_addTestScore(testId, studentId, marks) {
  const data = getStore();
  const test = data.testRecords.find(t => t.id === testId);
  if (!test) return false;
  test.scores = test.scores.filter(s => s.studentId !== studentId);
  test.scores.push({ studentId, marks });
  // Update student's average marks
  const allScores = data.testRecords
    .flatMap(t => t.scores.filter(s => s.studentId === studentId).map(s => ({ marks: s.marks, max: t.maxMarks })));
  if (allScores.length > 0) {
    const avgPct = Math.round(allScores.reduce((sum, s) => sum + (s.marks / s.max * 100), 0) / allScores.length);
    const student = data.students.find(s => s.id === studentId);
    if (student) student.marks = avgPct;
  }
  saveStore(data);
  return true;
}

// ======= HOMEWORK =======
function Store_getHomework() {
  return getStore().homeworkRecords || [];
}

function Store_addHomework(hw) {
  const data = getStore();
  hw.id = getNextId();
  hw.submissions = hw.submissions || [];
  data.homeworkRecords.push(hw);
  saveStore(data);
  return hw;
}

function Store_toggleSubmission(hwId, studentId) {
  const data = getStore();
  const hw = data.homeworkRecords.find(h => h.id === hwId);
  if (!hw) return;
  const existing = hw.submissions.find(s => s.studentId === studentId);
  if (existing) {
    existing.submitted = !existing.submitted;
    existing.date = new Date().toISOString().split('T')[0];
  } else {
    hw.submissions.push({ studentId, submitted: true, date: new Date().toISOString().split('T')[0] });
  }
  saveStore(data);
}

// ======= TEACHING LOG =======
function Store_getTeachingLog() {
  return getStore().teachingLog || [];
}

function Store_addTeachingLog(entry) {
  const data = getStore();
  entry.id = getNextId();
  data.teachingLog.unshift(entry); // newest first
  saveStore(data);
  return entry;
}

// ======= FEE PAYMENTS =======
function Store_getFeePayments(studentId) {
  const payments = getStore().feePayments || [];
  if (studentId) return payments.filter(p => p.studentId === studentId);
  return payments;
}

function Store_addFeePayment(payment) {
  const data = getStore();
  payment.id = getNextId();
  data.feePayments.push(payment);
  // Update student fee status
  const student = data.students.find(s => s.id === payment.studentId);
  if (student) student.fees = 'paid';
  saveStore(data);
  return payment;
}

function Store_updateFeeStatus(studentId, status) {
  const data = getStore();
  const student = data.students.find(s => s.id === studentId);
  if (student) student.fees = status;
  saveStore(data);
}

function Store_updateFeeDetails(studentId, monthlyFee, status) {
  const data = getStore();
  const student = data.students.find(s => s.id === studentId);
  if (student) {
    student.monthlyFee = monthlyFee;
    student.fees = status;
    saveStore(data);
    return true;
  }
  return false;
}

// ======= DOUBTS =======
function Store_getDoubts(studentId) {
  const doubts = getStore().doubts || [];
  if (studentId) return doubts.filter(d => d.studentId === studentId);
  return doubts;
}

function Store_addDoubt(doubt) {
  const data = getStore();
  doubt.id = getNextId();
  doubt.answered = false;
  doubt.answer = '';
  doubt.time = 'Just now';
  data.doubts.unshift(doubt);
  saveStore(data);
  return doubt;
}

function Store_answerDoubt(doubtId, answer) {
  const data = getStore();
  const doubt = data.doubts.find(d => d.id === doubtId);
  if (!doubt) return;
  doubt.answered = true;
  doubt.answer = answer;
  saveStore(data);
}

function Store_deleteDoubt(doubtId) {
  const data = getStore();
  const initialLength = data.doubts.length;
  data.doubts = data.doubts.filter(d => d.id !== doubtId);
  if (data.doubts.length < initialLength) {
    saveStore(data);
    return true;
  }
  return false;
}

// ======= NOTIFICATIONS =======
function Store_addNotification(notif) {
  const data = getStore();
  notif.id = getNextId();
  notif.unread = true;
  notif.acknowledgments = []; // NEW: Array of studentIds who acknowledged
  notif.date = notif.date || new Date().toISOString().split('T')[0];
  data.notifications.unshift(notif);
  // Keep only last 50
  if (data.notifications.length > 50) data.notifications = data.notifications.slice(0, 50);
  saveStore(data);
}

function Store_deleteNotification(id) {
  const data = getStore();
  data.notifications = data.notifications.filter(n => n.id !== id);
  saveStore(data);
}

function Store_acknowledgeNotification(notifId, studentId) {
  const data = getStore();
  const notif = data.notifications.find(n => n.id === notifId);
  if (notif) {
    if (!notif.acknowledgments) notif.acknowledgments = [];
    if (!notif.acknowledgments.includes(studentId)) {
      notif.acknowledgments.push(studentId);
      saveStore(data);
      return true;
    }
  }
  return false;
}

function Store_addParentNotification(studentId, title, message, type) {
  Store_addNotification({
    targetStudentId: studentId,
    title, message, type,
    date: new Date().toISOString().split('T')[0]
  });
}

function Store_getNotifications(targetStudentId) {
  const notifs = getStore().notifications || [];
  if (targetStudentId) {
    // Return broadcast rules + specific targeted student rules
    return notifs.filter(n => !n.targetStudentId || n.targetStudentId === targetStudentId);
  }
  return notifs;
}

// ======= SCHEDULE =======
function Store_getSchedule() {
  return getStore().schedule || [];
}

function Store_addClassToSchedule(dayIndex, classInfo) {
  const data = getStore();
  if (data.schedule[dayIndex]) {
    data.schedule[dayIndex].classes.push(classInfo);
    saveStore(data);
  }
}

// ======= VIDEOS =======
function Store_getVideos() {
  return getStore().videos || [];
}

function Store_addVideo(video) {
  const data = getStore();
  video.id = getNextId();
  video.progress = 0;
  data.videos.push(video);
  saveStore(data);
  return video;
}

function Store_deleteVideo(id) {
  const data = getStore();
  data.videos = data.videos.filter(v => v.id !== id);
  saveStore(data);
}

function Store_updateVideo(id, updates) {
  const data = getStore();
  const v = data.videos.find(x => x.id === id);
  if (v) { Object.assign(v, updates); saveStore(data); }
}

// ======= FLASHCARDS =======
function Store_getFlashcards() {
  return getStore().flashcards || [];
}

function Store_addFlashcard(card) {
  const data = getStore();
  card.id = getNextId();
  data.flashcards.push(card);
  saveStore(data);
  return card;
}

function Store_deleteFlashcard(id) {
  const data = getStore();
  data.flashcards = data.flashcards.filter(f => f.id !== id);
  saveStore(data);
}

function Store_updateFlashcard(id, updates) {
  const data = getStore();
  const f = data.flashcards.find(x => x.id === id);
  if (f) { Object.assign(f, updates); saveStore(data); }
}

// ======= QUESTIONS =======
function Store_getQuestions() {
  return getStore().questions || [];
}

function Store_addQuestion(q) {
  const data = getStore();
  q.id = getNextId();
  q.options = q.options || ["", "", "", ""];
  q.correct = q.correct || 0; // index 0-3
  q.explanation = q.explanation || "";
  q.grade = q.grade || "All";
  q.board = q.board || "All";
  q.subject = q.subject || "All";
  data.questions.push(q);
  saveStore(data);
  return q;
}

function Store_deleteQuestion(id) {
  const data = getStore();
  data.questions = data.questions.filter(q => q.id !== id);
  saveStore(data);
}

function Store_updateQuestion(id, updates) {
  const data = getStore();
  const q = data.questions.find(x => x.id === id);
  if (q) { Object.assign(q, updates); saveStore(data); }
}

// ======= BATCHES =======
function Store_getBatches() {
  return getStore().batches || [];
}

function Store_addBatch(batch) {
  const data = getStore();
  batch.id = getNextId();
  data.batches.push(batch);
  saveStore(data);
  return batch;
}

// ======= TUTOR PROFILE =======
function Store_getTutorProfile() {
  return getStore().tutor || { name: 'Tutor', subject: 'Physics & Mathematics' };
}

function Store_updateTutorProfile(updates) {
  const data = getStore();
  if (!data.tutor) data.tutor = { name: 'Tutor', subject: 'Physics & Mathematics' };
  Object.assign(data.tutor, updates);
  saveStore(data);
  return data.tutor;
}

// ======= GLOBAL ACCESSORS (for backward compat) =======
// Build a DATA-like object so existing render functions work
function buildDataObject() {
  const store = getStore();
  return {
    tutor: store.tutor,
    students: store.students,
    batches: store.batches,
    videos: store.videos,
    flashcards: store.flashcards,
    questions: store.questions,
    doubts: store.doubts,
    notifications: store.notifications,
    schedule: store.schedule,
    teachingLog: store.teachingLog,
    leaderboard: store.students.map((s, i) => ({
      rank: i + 1, name: s.name, class: s.class, score: s.marks, streak: 0, avatar: s.avatar
    })).sort((a, b) => b.score - a.score).map((s, i) => ({ ...s, rank: i + 1 })),
  };
}

// Expose everything globally
const BADGE_MASTER = [
  { id: 'math_whiz', icon: '🔢', neutral: 'Math Whiz', male: 'Math King', female: 'Math Queen', desc: 'Achieve 90%+ in 3 Math tests' },
  { id: 'science_star', icon: '🧬', neutral: 'Science Star', male: 'Science Hero', female: 'Science Heroine', desc: 'Complete all Science flashcards' },
  { id: 'consistent', icon: '📅', neutral: 'Steady Learner', male: 'Consistent Boy', female: 'Consistent Girl', desc: '100% attendance for a month' },
  { id: 'creative', icon: '🎨', neutral: 'Creative Thinker', male: 'Creative Mind', female: 'Creative Muse', desc: 'Ask 5 relevant doubts' }
];

function Store_getBadges() {
  return BADGE_MASTER;
}

function Store_awardBadge(studentId, badgeId) {
  const data = getStore();
  const s = data.students.find(x => x.id === studentId);
  if (s && !s.badges.includes(badgeId)) {
    s.badges.push(badgeId);
    saveStore(data);
    return true;
  }
  return false;
}

// Expose everything globally
window.Store_getStudents = Store_getStudents;
window.Store_getStudent = Store_getStudent;
window.Store_addStudent = Store_addStudent;
window.Store_updateStudent = Store_updateStudent;
window.Store_deleteStudent = Store_deleteStudent;
window.Store_addRemark = Store_addRemark;
window.Store_getCredentials = Store_getCredentials;
window.Store_setCredential = Store_setCredential;
window.Store_validateLogin = Store_validateLogin;
window.Store_updateCredentials = Store_updateCredentials;
window.Store_getCredentialInfo = Store_getCredentialInfo;
window.Store_getAttendance = Store_getAttendance;
window.Store_markAttendance = Store_markAttendance;
window.Store_getTests = Store_getTests;
window.Store_addTest = Store_addTest;
window.Store_bulkAddTests = Store_bulkAddTests;
window.Store_updateTest = Store_updateTest;
window.Store_addTestScore = Store_addTestScore;
window.Store_getHomework = Store_getHomework;
window.Store_addHomework = Store_addHomework;
window.Store_toggleSubmission = Store_toggleSubmission;
window.Store_getTeachingLog = Store_getTeachingLog;
window.Store_addTeachingLog = Store_addTeachingLog;
window.Store_getFeePayments = Store_getFeePayments;
window.Store_addFeePayment = Store_addFeePayment;
window.Store_updateFeeStatus = Store_updateFeeStatus;
window.Store_getDoubts = Store_getDoubts;
window.Store_addDoubt = Store_addDoubt;
window.Store_answerDoubt = Store_answerDoubt;
window.Store_deleteDoubt = Store_deleteDoubt;
window.Store_addNotification = Store_addNotification;
window.Store_deleteNotification = Store_deleteNotification;
window.Store_addParentNotification = Store_addParentNotification;
window.Store_getNotifications = Store_getNotifications;
window.Store_acknowledgeNotification = Store_acknowledgeNotification;
window.Store_getSchedule = Store_getSchedule;
window.Store_addClassToSchedule = Store_addClassToSchedule;
window.Store_getVideos = Store_getVideos;
window.Store_addVideo = Store_addVideo;
window.Store_deleteVideo = Store_deleteVideo;
window.Store_updateVideo = Store_updateVideo;
window.Store_getFlashcards = Store_getFlashcards;
window.Store_addFlashcard = Store_addFlashcard;
window.Store_deleteFlashcard = Store_deleteFlashcard;
window.Store_updateFlashcard = Store_updateFlashcard;
window.Store_getQuestions = Store_getQuestions;
window.Store_addQuestion = Store_addQuestion;
window.Store_deleteQuestion = Store_deleteQuestion;
window.Store_updateQuestion = Store_updateQuestion;
window.Store_getBatches = Store_getBatches;
window.Store_addBatch = Store_addBatch;
window.Store_exportAttendanceCSV = Store_exportAttendanceCSV;
window.Store_downloadCSV = Store_downloadCSV;
window.Store_updateFeeDetails = Store_updateFeeDetails;
window.Store_getBadges = Store_getBadges;
window.Store_awardBadge = Store_awardBadge;
window.Store_getTutorProfile = Store_getTutorProfile;
window.Store_updateTutorProfile = Store_updateTutorProfile;
window.buildDataObject = buildDataObject;
window.resetStore = resetStore;
window.getStore = getStore;
window.saveStore = saveStore;
