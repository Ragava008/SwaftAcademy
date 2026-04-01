/**
 * Swaft Academy - Comprehensive Syllabus & Subject Data (Classes 1-12)
 * Separated to keep main logic files clean.
 */

const DATA_SUBJECTS = {
  // Primary (1-5)
  'primary': ['English', 'Mathematics', 'EVS', 'Hindi', 'Computer'],
  // Middle (6-8)
  'middle': ['English', 'Mathematics', 'Science', 'Social Studies', 'Hindi', 'Computer'],
  // Secondary (9-10)
  'secondary': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography', 'Computer Applications'],
  // Senior Secondary (11-12)
  'senior': ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Commerce', 'Economics']
};

function getSubjectsForClass(classNumStr, board) {
  const num = parseInt(classNumStr);
  if (isNaN(num)) return DATA_SUBJECTS['secondary']; // default
  
  if (num >= 1 && num <= 5) return DATA_SUBJECTS['primary'];
  if (num >= 6 && num <= 8) return DATA_SUBJECTS['middle'];
  if (num >= 9 && num <= 10) return DATA_SUBJECTS['secondary'];
  if (num >= 11 && num <= 12) return DATA_SUBJECTS['senior'];
  return DATA_SUBJECTS['secondary'];
}

// Extensive Syllabus Map
const DATA_SYLLABUS = {
  // ================= 6TH GRADE =================
  '6_ICSE_Mathematics': {
    chapters: [
      { id: 'math_6_1', title: 'Number System', questions: 15, duration: '2 hours', completed: true },
      { id: 'math_6_2', title: 'Fractions and Decimals', questions: 20, duration: '2.5 hours', completed: false },
      { id: 'math_6_3', title: 'Algebra (Introduction)', questions: 12, duration: '1.5 hours', completed: false },
      { id: 'math_6_4', title: 'Ratio and Proportion', questions: 18, duration: '2 hours', completed: false },
      { id: 'math_6_5', title: 'Geometry (Basic Ideas)', questions: 10, duration: '1 hour', completed: false }
    ]
  },
  '6_ICSE_Science': {
    chapters: [
      { id: 'sci_6_1', title: 'Matter and its Nature', questions: 12, duration: '1.5 hours', completed: true },
      { id: 'sci_6_2', title: 'Physical Quantities and Measurement', questions: 15, duration: '2 hours', completed: true },
      { id: 'sci_6_3', title: 'Force and Friction', questions: 10, duration: '1.5 hours', completed: false },
      { id: 'sci_6_4', title: 'The Cell', questions: 14, duration: '2 hours', completed: false },
      { id: 'sci_6_5', title: 'Light', questions: 18, duration: '2 hours', completed: false }
    ]
  },
  '6_ICSE_Social Studies': {
    chapters: [
      { id: 'sst_6_1', title: 'The River Valley Civilizations', questions: 10, duration: '1 hour', completed: true },
      { id: 'sst_6_2', title: 'The Vedic Civilization', questions: 15, duration: '1.5 hours', completed: false },
      { id: 'sst_6_3', title: 'Major Domains of the Earth', questions: 12, duration: '1.5 hours', completed: false }
    ]
  },
  '6_CBSE_Mathematics': {
    chapters: [
      { id: 'math_6c_1', title: 'Knowing Our Numbers', questions: 15, duration: '2 hours', completed: true },
      { id: 'math_6c_2', title: 'Whole Numbers', questions: 12, duration: '1.5 hours', completed: false },
      { id: 'math_6c_3', title: 'Playing with Numbers', questions: 20, duration: '2.5 hours', completed: false }
    ]
  },
  '6_CBSE_Science': {
    chapters: [
      { id: 'sci_6c_1', title: 'Components of Food', questions: 15, duration: '1.5 hours', completed: true },
      { id: 'sci_6c_2', title: 'Sorting Materials into Groups', questions: 10, duration: '1 hour', completed: false },
      { id: 'sci_6c_3', title: 'Getting to Know Plants', questions: 18, duration: '2 hours', completed: false }
    ]
  },

  // ================= 10TH GRADE =================
  '10_ICSE_Physics': {
    chapters: [
      { id: 'phy_10_1', title: 'Force, Work, Energy and Power', questions: 25, duration: '3 hours', completed: true },
      { id: 'phy_10_2', title: 'Light', questions: 30, duration: '4 hours', completed: false },
      { id: 'phy_10_3', title: 'Sound', questions: 15, duration: '2 hours', completed: false },
      { id: 'phy_10_4', title: 'Current Electricity', questions: 25, duration: '3.5 hours', completed: false },
      { id: 'phy_10_5', title: 'Electromagnetism', questions: 20, duration: '3 hours', completed: false }
    ]
  },
  '10_ICSE_Chemistry': {
    chapters: [
      { id: 'chem_10_1', title: 'Periodic Properties', questions: 20, duration: '2.5 hours', completed: true },
      { id: 'chem_10_2', title: 'Chemical Bonding', questions: 15, duration: '2 hours', completed: false },
      { id: 'chem_10_3', title: 'Acids, Bases and Salts', questions: 25, duration: '3 hours', completed: false },
      { id: 'chem_10_4', title: 'Analytical Chemistry', questions: 10, duration: '1.5 hours', completed: false }
    ]
  },
  '10_ICSE_Mathematics': {
    chapters: [
      { id: 'math_10_1', title: 'GST', questions: 15, duration: '2 hours', completed: true },
      { id: 'math_10_2', title: 'Banking', questions: 10, duration: '1 hour', completed: false },
      { id: 'math_10_3', title: 'Linear Inequations', questions: 12, duration: '1.5 hours', completed: false },
      { id: 'math_10_4', title: 'Quadratic Equations', questions: 25, duration: '3 hours', completed: false }
    ]
  },

  // ================= 11TH GRADE =================
  '11_ICSE_Physics': {
    chapters: [
      { id: 'phy_11_1', title: 'Physical World and Measurement', questions: 20, duration: '2.5 hours', completed: true },
      { id: 'phy_11_2', title: 'Kinematics', questions: 35, duration: '4 hours', completed: false },
      { id: 'phy_11_3', title: 'Laws of Motion', questions: 30, duration: '3.5 hours', completed: false },
      { id: 'phy_11_4', title: 'Work, Power and Energy', questions: 25, duration: '3 hours', completed: false },
      { id: 'phy_11_5', title: 'Motion of System of Particles', questions: 20, duration: '2.5 hours', completed: false }
    ]
  },
  '11_ICSE_Chemistry': {
    chapters: [
      { id: 'chem_11_1', title: 'Some Basic Concepts of Chemistry', questions: 25, duration: '3 hours', completed: true },
      { id: 'chem_11_2', title: 'Structure of Atom', questions: 30, duration: '4 hours', completed: false },
      { id: 'chem_11_3', title: 'Classification of Elements', questions: 15, duration: '2 hours', completed: false },
      { id: 'chem_11_4', title: 'Chemical Thermodynamics', questions: 35, duration: '4.5 hours', completed: false }
    ]
  },
  '11_CBSE_Physics': {
    chapters: [
      { id: 'cbse_phy_11_1', title: 'Units and Measurements', questions: 20, duration: '2.5 hours', completed: true },
      { id: 'cbse_phy_11_2', title: 'Motion in a Straight Line', questions: 25, duration: '3 hours', completed: false },
      { id: 'cbse_phy_11_3', title: 'Motion in a Plane', questions: 25, duration: '3 hours', completed: false },
      { id: 'cbse_phy_11_4', title: 'Laws of Motion', questions: 30, duration: '3.5 hours', completed: false }
    ]
  }
};

window.SwaftSyllabus = {
  getSubjects: getSubjectsForClass,
  getSyllabus: function(classNum, board, subject) {
    const key = `${classNum}_${board}_${subject}`;
    return DATA_SYLLABUS[key] || { chapters: [{ id: 'general_1', title: 'Chapter 1: Basics', questions: 10, duration: '1 hour', completed: false }] };
  }
};
