// Single source of truth — AAMU BS Computer Science, 2025-2026 Bulletin

export type Grade =
  | "A+" | "A" | "A-"
  | "B+" | "B" | "B-"
  | "C+" | "C" | "C-"
  | "D+" | "D" | "D-"
  | "F" | "W" | "WF" | "I"
  | "TA" | "TB" | "TC"
  | "S" | "CR" | "P"
  | "REG"; // currently registered

export type Concentration = "CYB" | "AI" | "GCS";

export interface Course {
  code: string;
  title: string;
  credits: number;
  prereqs: string[]; // direct prereqs only
}

export interface TranscriptEntry {
  code: string;
  grade: Grade;
  credits: number;
  term?: string;
}

export interface StudentData {
  name: string;
  id: string;
  gpa: number;
  concentration: Concentration;
  transcript: TranscriptEntry[];
}

// Normalize course code: "CS102" → "CS 102"
export function norm(code: string): string {
  return code.trim().replace(/([A-Z]+)(\d)/, "$1 $2").toUpperCase();
}

// ─── Grade Logic ───────────────────────────────────────────────────────────────

export function gradeIsPassing(grade: Grade): boolean {
  return ["A+","A","A-","B+","B","B-","C+","C","C-","TA","TB","TC","S","CR","P"].includes(grade);
}

export function gradeIsRegistered(grade: Grade): boolean {
  return grade === "REG";
}

// ─── Course Database ──────────────────────────────────────────────────────────

export const COURSES: Record<string, Course> = {
  "CS 101": { code: "CS 101", title: "Intro to CS", credits: 3, prereqs: [] },
  "CS 102": { code: "CS 102", title: "Intro to Programming I", credits: 3, prereqs: [] },
  "CS 104": { code: "CS 104", title: "Intro to Computers & Ethics", credits: 3, prereqs: [] },
  "CS 109": { code: "CS 109", title: "Intro to Programming II", credits: 3, prereqs: ["CS 102"] },
  "CS 203": { code: "CS 203", title: "Discrete Structures", credits: 3, prereqs: ["CS 102"] },
  "CS 206": { code: "CS 206", title: "Intro Java Programming", credits: 3, prereqs: ["CS 102"] },
  "CS 209": { code: "CS 209", title: "Intro to Digital Logic Design", credits: 3, prereqs: ["CS 203"] },
  "CS 215": { code: "CS 215", title: "Data Structures", credits: 3, prereqs: ["CS 109"] },
  "CS 303L": { code: "CS 303L", title: "CS Lab", credits: 1, prereqs: ["CS 109", "CS 203"] },
  "CS 305": { code: "CS 305", title: "Computer Architecture", credits: 3, prereqs: ["CS 109", "CS 209"] },
  "CS 306": { code: "CS 306", title: "Advanced Java", credits: 3, prereqs: ["CS 206"] },
  "CS 309": { code: "CS 309", title: "Algorithms", credits: 3, prereqs: ["CS 215", "CS 203"] },
  "CS 314": { code: "CS 314", title: "Advanced Programming", credits: 3, prereqs: ["CS 109", "CS 206"] },
  "CS 315": { code: "CS 315", title: "Advanced Data Structures", credits: 3, prereqs: ["CS 215"] },
  "CS 321": { code: "CS 321", title: "Principles of Information Security", credits: 3, prereqs: ["CS 104"] },
  "CS 328": { code: "CS 328", title: "Web Development", credits: 3, prereqs: ["CS 109", "CS 206"] },
  "CS 330": { code: "CS 330", title: "Network Fundamentals", credits: 3, prereqs: ["CS 104"] },
  "CS 381": { code: "CS 381", title: "Computer Organization", credits: 3, prereqs: ["CS 203", "CS 209"] },
  "CS 384": { code: "CS 384", title: "Operating Systems", credits: 3, prereqs: ["CS 215", "CS 209"] },
  "CS 386": { code: "CS 386", title: "Cryptography", credits: 3, prereqs: ["CS 215", "CS 203"] },
  "CS 389": { code: "CS 389", title: "Programming in Robotics System", credits: 3, prereqs: ["CS 109", "CS 206"] },
  "CS 401": { code: "CS 401", title: "Software Engineering", credits: 3, prereqs: ["CS 314", "CS 215"] },
  "CS 403": { code: "CS 403", title: "Senior Problems (Capstone)", credits: 3, prereqs: ["CS 401"] },
  "CS 405": { code: "CS 405", title: "Linux w/ Applied Programming", credits: 3, prereqs: ["CS 215", "CS 209"] },
  "CS 409": { code: "CS 409", title: "Intro to Digital Image Processing", credits: 3, prereqs: ["CS 203", "CS 209"] },
  "CS 410": { code: "CS 410", title: "Senior Seminar", credits: 3, prereqs: [] },
  "CS 412": { code: "CS 412", title: "Compiler Design", credits: 3, prereqs: ["CS 215"] },
  "CS 414": { code: "CS 414", title: "Forensic Computing", credits: 3, prereqs: ["CS 215", "CS 209"] },
  "CS 421": { code: "CS 421", title: "Computer Security", credits: 3, prereqs: ["CS 215", "CS 209"] },
  "CS 425": { code: "CS 425", title: "Theory of Algorithms", credits: 3, prereqs: ["CS 215", "CS 203"] },
  "CS 430": { code: "CS 430", title: "Machine Learning", credits: 3, prereqs: ["CS 215", "CS 203"] },
  "CS 440": { code: "CS 440", title: "Software Architecture", credits: 3, prereqs: ["CS 206", "CS 314"] },
  "CS 450": { code: "CS 450", title: "Artificial Intelligence", credits: 3, prereqs: ["CS 215"] },
  "CS 483": { code: "CS 483", title: "Computer Networks", credits: 3, prereqs: ["CS 215"] },
  "CS 484": { code: "CS 484", title: "Computer Graphics", credits: 3, prereqs: ["CS 206", "CS 314"] },
  "CS 485": { code: "CS 485", title: "Advanced Computer Architecture", credits: 3, prereqs: ["CS 203", "CS 209", "CS 381"] },
  "CS 486": { code: "CS 486", title: "Parallel Processing", credits: 3, prereqs: ["CS 381", "CS 485"] },
  "CS 488": { code: "CS 488", title: "Database Systems", credits: 3, prereqs: ["CS 215"] },
  "CS 490": { code: "CS 490", title: "Advanced Topics in CS", credits: 3, prereqs: ["CS 215", "CS 381"] },
  // GenEd / Math / Physics
  "ENG 101": { code: "ENG 101", title: "Composition I", credits: 3, prereqs: [] },
  "ENG 102": { code: "ENG 102", title: "Composition II", credits: 3, prereqs: ["ENG 101"] },
  "ENG 201": { code: "ENG 201", title: "World Literature I", credits: 3, prereqs: [] },
  "ENG 202": { code: "ENG 202", title: "Survey of English Literature", credits: 3, prereqs: [] },
  "ENG 203": { code: "ENG 203", title: "American Literature I", credits: 3, prereqs: [] },
  "ENG 204": { code: "ENG 204", title: "American Literature II", credits: 3, prereqs: [] },
  "ENG 207": { code: "ENG 207", title: "World Literature I (Alt)", credits: 3, prereqs: [] },
  "ENG 208": { code: "ENG 208", title: "World Literature II (Alt)", credits: 3, prereqs: [] },
  "MTH 125": { code: "MTH 125", title: "Calculus I", credits: 4, prereqs: [] },
  "MTH 126": { code: "MTH 126", title: "Calculus II", credits: 4, prereqs: ["MTH 125"] },
  "MTH 111": { code: "MTH 111", title: "Elementary Statistics I", credits: 3, prereqs: [] },
  "MTH 227": { code: "MTH 227", title: "Calculus III", credits: 4, prereqs: ["MTH 126"] },
  "MTH 237": { code: "MTH 237", title: "Linear Algebra", credits: 3, prereqs: [] },
  "MTH 453": { code: "MTH 453", title: "Probability & Statistics", credits: 3, prereqs: [] },
  "PHY 213": { code: "PHY 213", title: "General Physics with Calculus I", credits: 4, prereqs: [] },
  "PHY 214": { code: "PHY 214", title: "General Physics with Calculus II", credits: 4, prereqs: ["PHY 213"] },
  "ORI 101": { code: "ORI 101", title: "First Year Experience", credits: 1, prereqs: [] },
  "ORI 102": { code: "ORI 102", title: "Second Year Experience", credits: 1, prereqs: [] },
  "HED 101": { code: "HED 101", title: "Personal & Community Health", credits: 2, prereqs: [] },
  "ECO 231": { code: "ECO 231", title: "Principles of Macroeconomics", credits: 3, prereqs: [] },
  "ECO 230": { code: "ECO 230", title: "Principles of Microeconomics", credits: 3, prereqs: [] },
  "MUS 101": { code: "MUS 101", title: "Music Appreciation", credits: 3, prereqs: [] },
  "ART 101": { code: "ART 101", title: "Art Appreciation", credits: 3, prereqs: [] },
  "COMM 101": { code: "COMM 101", title: "Public Speaking", credits: 3, prereqs: [] },
  "PHL 201": { code: "PHL 201", title: "Introduction to Philosophy", credits: 3, prereqs: [] },
  "PHL 203": { code: "PHL 203", title: "Ethics", credits: 3, prereqs: [] },
  "PSY 201": { code: "PSY 201", title: "General Psychology", credits: 3, prereqs: [] },
  "SOC 201": { code: "SOC 201", title: "Introduction to Sociology", credits: 3, prereqs: [] },
  "SOC 210": { code: "SOC 210", title: "Sociology of Race", credits: 3, prereqs: [] },
  "HIS 101": { code: "HIS 101", title: "World History I", credits: 3, prereqs: [] },
  "HIS 102": { code: "HIS 102", title: "World History II", credits: 3, prereqs: [] },
  "HIS 201": { code: "HIS 201", title: "American History I", credits: 3, prereqs: [] },
  "HIS 202": { code: "HIS 202", title: "American History II", credits: 3, prereqs: [] },
  "GEO 213": { code: "GEO 213", title: "Physical Geography", credits: 3, prereqs: [] },
  "UPL 103": { code: "UPL 103", title: "Urban Planning", credits: 3, prereqs: [] },
  "SPA 101": { code: "SPA 101", title: "Spanish I", credits: 3, prereqs: [] },
  "FRE 101": { code: "FRE 101", title: "French I", credits: 3, prereqs: [] },
};

// ─── Degree Requirements ──────────────────────────────────────────────────────

export const CS_MAJOR_REQUIRED: string[] = [
  "CS 102", "CS 104", "CS 109", "CS 203", "CS 206", "CS 209",
  "CS 215", "CS 314", "CS 401", "CS 403", "CS 405", "CS 410", "CS 425",
];

export const CONCENTRATION_COURSES: Record<Concentration, string[]> = {
  CYB: ["CS 381", "CS 384", "CS 488", "CS 321", "CS 386", "CS 414", "CS 421"],
  AI:  ["CS 381", "CS 384", "CS 488", "CS 389", "CS 409", "CS 430", "CS 450"],
  GCS: ["CS 381", "CS 384", "CS 488"],
};

export const CORE_CMP: string[] = ["MTH 237", "MTH 453"];

// Program electives (can be satisfied by transfer)
export const PROGRAM_ELECTIVES: string[] = ["MTH 111", "MTH 227"];

// Fixed GenEd (always required)
export const GENED_FIXED: string[] = [
  "ENG 101", "ENG 102", "PHY 213", "PHY 214",
  "MTH 125", "MTH 126", "ORI 101", "ORI 102",
  "HED 101", "ECO 231", "CS 104",
];

// GenEd choice groups — student must fulfill each group
export interface GenEdGroup {
  id: string;
  label: string;
  creditsNeeded: number;
  options: string[][]; // each inner array = one valid selection
}

export const GENED_GROUPS: GenEdGroup[] = [
  {
    id: "literature",
    label: "Literature Sequence",
    creditsNeeded: 3,
    options: [["ENG 202"], ["ENG 201"], ["ENG 203", "ENG 204"], ["ENG 207", "ENG 208"]],
  },
  {
    id: "finearts",
    label: "Fine Arts / Language",
    creditsNeeded: 3,
    options: [
      ["ART 101"], ["MUS 101"], ["COMM 101"], ["PHL 201"], ["PHL 203"],
      ["SPA 101"], ["FRE 101"], ["ENG 201"], ["ENG 202"],
    ],
  },
  {
    id: "history",
    label: "History (2 classes)",
    creditsNeeded: 6,
    options: [
      ["HIS 101", "HIS 102"], ["HIS 101", "HIS 201"], ["HIS 101", "HIS 202"],
      ["HIS 102", "HIS 201"], ["HIS 102", "HIS 202"], ["HIS 201", "HIS 202"],
    ],
  },
  {
    id: "socialscience",
    label: "Social / Behavioral Science",
    creditsNeeded: 3,
    options: [["SOC 201"], ["SOC 210"], ["GEO 213"], ["PSY 201"], ["UPL 103"]],
  },
];

export const TOTAL_CREDITS_REQUIRED = 125;
export const MIN_RESIDENCE_CREDITS = 20;
export const CREDIT_MIN = 12;
export const CREDIT_TARGET = 15;
export const CREDIT_MAX = 18;

// ─── Sample Transcript (Jeeban Bashyal) ──────────────────────────────────────

export const SAMPLE_STUDENT: StudentData = {
  name: "Jeeban Bashyal",
  id: "A00597565",
  gpa: 3.91,
  concentration: "AI",
  transcript: [
    // Transfer from Gettysburg College
    { code: "CS 102", grade: "TA", credits: 3, term: "Fall 2024 (Transfer)" },
    { code: "CS 109", grade: "TB", credits: 3, term: "Spring 2025 (Transfer)" },
    { code: "MTH 126", grade: "TA", credits: 4, term: "Fall 2024 (Transfer)" },
    { code: "MTH 111", grade: "TA", credits: 3, term: "Spring 2025 (Transfer)" },
    { code: "MTH 227", grade: "TA", credits: 4, term: "Spring 2025 (Transfer)" },
    { code: "ECO 231", grade: "TA", credits: 3, term: "Spring 2025 (Transfer)" },
    { code: "ECO 230", grade: "TA", credits: 3, term: "Fall 2024 (Transfer)" },
    // AAMU Fall 2025
    { code: "ENG 101", grade: "A", credits: 3, term: "Fall 2025" },
    { code: "MUS 101", grade: "A", credits: 3, term: "Fall 2025" },
    { code: "PHY 213", grade: "A", credits: 4, term: "Fall 2025" },
    { code: "MTH 125", grade: "A", credits: 4, term: "Fall 2025" },
    { code: "ORI 101", grade: "A", credits: 1, term: "Fall 2025" },
    { code: "CS 203", grade: "A", credits: 3, term: "Fall 2025" },
    // AAMU Spring 2026
    { code: "ENG 102", grade: "A", credits: 3, term: "Spring 2026" },
    { code: "PHY 214", grade: "A", credits: 4, term: "Spring 2026" },
    { code: "HED 101", grade: "A", credits: 2, term: "Spring 2026" },
    { code: "CS 206", grade: "A", credits: 3, term: "Spring 2026" },
    { code: "CS 209", grade: "A", credits: 3, term: "Spring 2026" },
    { code: "CS 215", grade: "B", credits: 3, term: "Spring 2026" },
    // Pre-registered Fall 2026
    { code: "CS 104", grade: "REG", credits: 3, term: "Fall 2026" },
    { code: "CS 314", grade: "REG", credits: 3, term: "Fall 2026" },
    { code: "ENG 202", grade: "REG", credits: 3, term: "Fall 2026" },
    { code: "MTH 237", grade: "REG", credits: 3, term: "Fall 2026" },
  ],
};
