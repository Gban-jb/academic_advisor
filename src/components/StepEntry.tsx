"use client";

import { useState } from "react";
import { COURSES, norm, gradeIsPassing, gradeIsRegistered, SAMPLE_STUDENT, type StudentData, type Grade, type Concentration } from "@/lib/data";

const ALL_GRADES: Grade[] = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F","W","WF","I","TA","TB","TC","S","CR","P","REG"];
const CONCENTRATIONS: { value: Concentration; label: string }[] = [
  { value: "AI", label: "Artificial Intelligence" },
  { value: "CYB", label: "Cybersecurity" },
  { value: "GCS", label: "General Computer Science" },
];

interface Props {
  student: StudentData;
  onChange: (s: StudentData) => void;
  onNext: () => void;
}

export default function StepEntry({ student, onChange, onNext }: Props) {
  const [newCode, setNewCode] = useState("");
  const [newGrade, setNewGrade] = useState<Grade>("A");
  const [newTerm, setNewTerm] = useState("");
  const [error, setError] = useState("");

  function addCourse() {
    const code = norm(newCode);
    if (!code) { setError("Enter a course code."); return; }
    const course = COURSES[code];
    if (!course) { setError(`Unknown course: ${code}. Check the code and try again.`); return; }
    const alreadyHas = student.transcript.find((e) => e.code === code);
    if (alreadyHas) { setError(`${code} is already in your transcript.`); return; }
    setError("");
    onChange({
      ...student,
      transcript: [
        ...student.transcript,
        { code, grade: newGrade, credits: course.credits, term: newTerm || undefined },
      ],
    });
    setNewCode("");
    setNewTerm("");
  }

  function removeCourse(code: string) {
    onChange({ ...student, transcript: student.transcript.filter((e) => e.code !== code) });
  }

  function updateGrade(code: string, grade: Grade) {
    onChange({
      ...student,
      transcript: student.transcript.map((e) => e.code === code ? { ...e, grade } : e),
    });
  }

  function resetToSample() {
    onChange(SAMPLE_STUDENT);
  }

  const totalCredits = student.transcript
    .filter((e) => gradeIsPassing(e.grade) || gradeIsRegistered(e.grade))
    .reduce((sum, e) => sum + e.credits, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Course History</h2>
          <p className="text-gray-500 text-sm mt-1">Add courses you've completed or are registered for. Minimum grade C to count.</p>
        </div>
        <button
          onClick={resetToSample}
          className="text-xs text-blue-600 hover:underline border border-blue-200 rounded px-3 py-1.5"
        >
          Load sample (Jeeban)
        </button>
      </div>

      {/* Student info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.name}
            onChange={(e) => onChange({ ...student, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.id}
            onChange={(e) => onChange({ ...student, id: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">GPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.gpa}
            onChange={(e) => onChange({ ...student, gpa: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Concentration</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.concentration}
            onChange={(e) => onChange({ ...student, concentration: e.target.value as Concentration })}
          >
            {CONCENTRATIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add course row */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Course code (e.g. CS 215)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCourse()}
        />
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newGrade}
          onChange={(e) => setNewGrade(e.target.value as Grade)}
        >
          {ALL_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Term (optional)"
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
        />
        <button
          onClick={addCourse}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Transcript table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Code</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Cr</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Grade</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Term</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {student.transcript.map((entry) => {
              const course = COURSES[entry.code];
              const passing = gradeIsPassing(entry.grade);
              const registered = gradeIsRegistered(entry.grade);
              return (
                <tr key={entry.code} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-2 font-mono text-xs text-gray-700">{entry.code}</td>
                  <td className="px-4 py-2 text-gray-600">{course?.title ?? "Unknown"}</td>
                  <td className="px-4 py-2 text-gray-500">{entry.credits}</td>
                  <td className="px-4 py-2">
                    <select
                      className={`text-xs font-semibold rounded px-2 py-0.5 border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                        registered
                          ? "bg-blue-100 text-blue-700"
                          : passing
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      value={entry.grade}
                      onChange={(e) => updateGrade(entry.code, e.target.value as Grade)}
                    >
                      {ALL_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-400 text-xs">{entry.term ?? "—"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeCourse(entry.code)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
            {student.transcript.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No courses added yet. Add a course above or load the sample transcript.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary + next */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{totalCredits}</span> / 125 credits · {student.transcript.length} entries
        </p>
        <button
          onClick={onNext}
          className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 transition-colors"
        >
          Review &rarr;
        </button>
      </div>
    </div>
  );
}
