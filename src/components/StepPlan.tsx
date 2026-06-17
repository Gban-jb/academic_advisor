"use client";

import { useMemo } from "react";
import { COURSES, type StudentData } from "@/lib/data";
import { buildSchedule, type ScheduledSemester } from "@/lib/scheduler";

interface Props {
  student: StudentData;
  onBack: () => void;
}

const LOAD_LABELS: Record<ScheduledSemester["load"], { label: string; color: string }> = {
  light:    { label: "Light (< 15)", color: "bg-yellow-100 text-yellow-700" },
  standard: { label: "Full load (15)", color: "bg-green-100 text-green-700" },
  full:     { label: "Full load", color: "bg-green-100 text-green-700" },
  max:      { label: "Max load (18)", color: "bg-orange-100 text-orange-700" },
};

const CONC_LABELS = { AI: "Artificial Intelligence", CYB: "Cybersecurity", GCS: "General CS" };

export default function StepPlan({ student, onBack }: Props) {
  const result = useMemo(() => buildSchedule(student), [student]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Degree Plan</h2>
          <p className="text-gray-500 text-sm mt-1">
            {student.name} · {CONC_LABELS[student.concentration]} · Est. graduation: <span className="font-semibold text-gray-800">{result.graduationSemester}</span>
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm border border-gray-200 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          Print Plan
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Credits Completed", value: result.completedCredits },
          { label: "Credits Remaining", value: 125 - result.completedCredits },
          { label: "Semesters Left", value: result.semesters.length },
          { label: "GPA", value: student.gpa.toFixed(2) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Semester cards */}
      <div className="space-y-4">
        {result.semesters.map((sem, i) => (
          <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
            {/* Semester header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-semibold text-gray-800 text-sm">{sem.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{sem.totalCredits} credits</span>
                <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${LOAD_LABELS[sem.load].color}`}>
                  {LOAD_LABELS[sem.load].label}
                </span>
              </div>
            </div>

            {/* Courses */}
            <div className="divide-y divide-gray-50">
              {sem.courses.map((code) => {
                const course = COURSES[code];
                const isRetake = sem.retakes.includes(code);
                return (
                  <div key={code} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-400 w-16 shrink-0">{code}</span>
                      <span className="text-sm text-gray-700">{course?.title ?? code}</span>
                      {isRetake && (
                        <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded px-1.5 py-0.5 font-medium">
                          Retake
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{course?.credits ?? 3} cr</span>
                  </div>
                );
              })}
              {sem.courses.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400">No courses scheduled.</div>
              )}
            </div>

            {/* Warnings */}
            {sem.warnings.length > 0 && (
              <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
                {sem.warnings.map((w, j) => (
                  <p key={j} className="text-xs text-amber-700">{w}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="border border-gray-200 text-gray-600 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
          &larr; Back
        </button>
        <p className="text-xs text-gray-400 self-center">
          Projected graduation: {result.graduationSemester} · {result.semesters.length} semesters from Fall 2026
        </p>
      </div>
    </div>
  );
}
