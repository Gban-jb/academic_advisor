import {
  COURSES, CS_MAJOR_REQUIRED, CONCENTRATION_COURSES, CORE_CMP,
  PROGRAM_ELECTIVES, GENED_FIXED, GENED_GROUPS,
  TOTAL_CREDITS_REQUIRED, CREDIT_MIN, CREDIT_TARGET, CREDIT_MAX,
  gradeIsPassing, gradeIsRegistered,
  type Concentration, type StudentData, type TranscriptEntry,
} from "./data";

export interface ScheduledSemester {
  label: string;       // e.g. "Semester 1 (Fall 2026)"
  courses: string[];
  totalCredits: number;
  load: "light" | "standard" | "full" | "max";
  retakes: string[];
  warnings: string[];
}

export interface ScheduleResult {
  semesters: ScheduledSemester[];
  graduationSemester: string;
  totalRemaining: number;
  completedCredits: number;
}

// Courses with a passing grade in the transcript
export function getDoneSet(transcript: TranscriptEntry[]): Set<string> {
  const done = new Set<string>();
  for (const entry of transcript) {
    if (gradeIsPassing(entry.grade)) done.add(entry.code);
  }
  return done;
}

// Courses the student is currently registered for (REG)
export function getRegisteredSet(transcript: TranscriptEntry[]): Set<string> {
  const reg = new Set<string>();
  for (const entry of transcript) {
    if (gradeIsRegistered(entry.grade)) reg.add(entry.code);
  }
  return reg;
}

// Courses that failed and need to be retaken
export function getFailedSet(transcript: TranscriptEntry[]): Set<string> {
  const failed = new Set<string>();
  const passed = getDoneSet(transcript);
  for (const entry of transcript) {
    if (!gradeIsPassing(entry.grade) && !gradeIsRegistered(entry.grade)) {
      // Only count as failed if never subsequently passed
      if (!passed.has(entry.code)) failed.add(entry.code);
    }
  }
  return failed;
}

// All prereqs satisfied given a set of completed courses
export function prereqsMet(courseCode: string, completed: Set<string>): boolean {
  const course = COURSES[courseCode];
  if (!course) return true;
  return course.prereqs.every((p) => completed.has(p));
}

function creditLoadLabel(credits: number): ScheduledSemester["load"] {
  if (credits <= 14) return "light";
  if (credits === 15) return "standard";
  if (credits <= 17) return "full";
  return "max";
}

// Build the list of courses still needed for the degree
function buildQueue(student: StudentData): string[] {
  const done = getDoneSet(student.transcript);
  const registered = getRegisteredSet(student.transcript);
  const alreadyHave = new Set(Array.from(done).concat(Array.from(registered)));

  const needed: string[] = [];
  const addIfMissing = (code: string) => {
    if (!alreadyHave.has(code) && !needed.includes(code)) needed.push(code);
  };

  // CS Major required (13 courses)
  CS_MAJOR_REQUIRED.forEach(addIfMissing);

  // Concentration
  CONCENTRATION_COURSES[student.concentration].forEach(addIfMissing);

  // Core CMP
  CORE_CMP.forEach(addIfMissing);

  // Program electives
  PROGRAM_ELECTIVES.forEach(addIfMissing);

  // Fixed GenEd
  GENED_FIXED.forEach(addIfMissing);

  // GenEd choice groups — pick first option that student hasn't started
  for (const group of GENED_GROUPS) {
    // Check if any option is already fully satisfied
    const alreadySatisfied = group.options.some((opt) =>
      opt.every((c) => alreadyHave.has(c))
    );
    if (alreadySatisfied) continue;

    // Find the first option where at least one course is already in progress
    const partialOption = group.options.find((opt) =>
      opt.some((c) => alreadyHave.has(c))
    );
    const chosenOption = partialOption ?? group.options[0];
    chosenOption.forEach(addIfMissing);
  }

  return needed;
}

// Determine a semester term label given a starting semester
function semesterLabel(index: number, startTerm: string): string {
  // startTerm like "Fall 2026"
  const parts = startTerm.split(" ");
  let season = parts[0] as "Fall" | "Spring";
  let year = parseInt(parts[1], 10);

  for (let i = 0; i < index; i++) {
    if (season === "Fall") {
      season = "Spring";
      year += 1;
    } else {
      season = "Fall";
    }
  }
  return `${season} ${year}`;
}

export function buildSchedule(student: StudentData): ScheduleResult {
  const done = getDoneSet(student.transcript);
  const registered = getRegisteredSet(student.transcript);
  const failed = getFailedSet(student.transcript);

  // Semester 1 = the registered courses (already decided)
  const sem1Courses = Array.from(registered);
  const sem1Credits = sem1Courses.reduce(
    (sum, c) => sum + (COURSES[c]?.credits ?? 3), 0
  );

  const semesters: ScheduledSemester[] = [];

  if (sem1Courses.length > 0) {
    semesters.push({
      label: "Fall 2026 (Pre-registered)",
      courses: sem1Courses,
      totalCredits: sem1Credits,
      load: creditLoadLabel(sem1Credits),
      retakes: [],
      warnings: [],
    });
  }

  // After semester 1, registered courses count as done for prereq purposes
  const completedAfterSem1 = new Set(Array.from(done).concat(Array.from(registered)));

  // Build remaining queue
  const queue = buildQueue(student);

  // Add failed courses to the front (highest priority)
  const retakeQueue = Array.from(failed).filter((c) => !registered.has(c));
  const mainQueue = queue.filter((c) => !retakeQueue.includes(c));
  const fullQueue = [...retakeQueue, ...mainQueue];

  // Schedule remaining semesters
  let completed = new Set(completedAfterSem1);
  let remaining = fullQueue.filter((c) => !completed.has(c));
  let semIndex = semesters.length;
  const MAX_SEMESTERS = 20; // safety limit

  while (remaining.length > 0 && semIndex < MAX_SEMESTERS) {
    const semCourses: string[] = [];
    const semRetakes: string[] = [];
    const semWarnings: string[] = [];
    let semCredits = 0;

    // Try to fill this semester up to CREDIT_TARGET, never exceed CREDIT_MAX
    const available = remaining.filter((c) => prereqsMet(c, completed));

    if (available.length === 0) {
      // Circular dep or missing data — add warning and break
      semWarnings.push(`Cannot schedule remaining courses: ${remaining.join(", ")}`);
      semesters.push({
        label: `Semester ${semIndex + 1} (${semesterLabel(semIndex, "Fall 2026")})`,
        courses: [],
        totalCredits: 0,
        load: "light",
        retakes: semRetakes,
        warnings: semWarnings,
      });
      break;
    }

    for (const code of available) {
      const credits = COURSES[code]?.credits ?? 3;
      if (semCredits + credits > CREDIT_MAX) continue;
      semCourses.push(code);
      semCredits += credits;
      if (retakeQueue.includes(code)) semRetakes.push(code);
      if (semCredits >= CREDIT_TARGET) break;
    }

    // Ensure minimum load — add more if we're under
    if (semCredits < CREDIT_MIN && semCourses.length < available.length) {
      for (const code of available) {
        if (semCourses.includes(code)) continue;
        const credits = COURSES[code]?.credits ?? 3;
        if (semCredits + credits > CREDIT_MAX) continue;
        semCourses.push(code);
        semCredits += credits;
        if (semCredits >= CREDIT_MIN) break;
      }
    }

    if (semCredits < CREDIT_MIN && available.length > 0) {
      semWarnings.push(`Only ${semCredits} credits available — may be below full-time minimum.`);
    }

    const termLabel = semesterLabel(semIndex, "Fall 2026");
    semesters.push({
      label: `${termLabel}`,
      courses: semCourses,
      totalCredits: semCredits,
      load: creditLoadLabel(semCredits),
      retakes: semRetakes,
      warnings: semWarnings,
    });

    // Update completed for next semester
    semCourses.forEach((c) => completed.add(c));
    remaining = remaining.filter((c) => !completed.has(c));
    semIndex++;
  }

  const completedCredits = Array.from(done).concat(Array.from(registered)).reduce(
    (sum, c) => sum + (COURSES[c]?.credits ?? 3), 0
  );

  const lastSem = semesters[semesters.length - 1];

  return {
    semesters,
    graduationSemester: lastSem?.label ?? "Unknown",
    totalRemaining: remaining.length,
    completedCredits,
  };
}
