"use client";

import { COURSES, gradeIsPassing, gradeIsRegistered, type StudentData, type TranscriptEntry } from "@/lib/data";

interface Props {
  student: StudentData;
  onBack: () => void;
  onNext: () => void;
}

type Group = { label: string; color: string; entries: TranscriptEntry[] };

function gradeBadge(entry: TranscriptEntry) {
  const passing = gradeIsPassing(entry.grade);
  const registered = gradeIsRegistered(entry.grade);
  if (registered) return "bg-blue-100 text-blue-700";
  if (passing) return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
}

export default function StepReview({ student, onBack, onNext }: Props) {
  const transfer = student.transcript.filter(
    (e) => e.grade.startsWith("T") || (e.term?.includes("Transfer") ?? false)
  );
  const registered = student.transcript.filter((e) => gradeIsRegistered(e.grade));
  const passed = student.transcript.filter(
    (e) => gradeIsPassing(e.grade) && !transfer.includes(e) && !registered.includes(e)
  );
  const failed = student.transcript.filter(
    (e) => !gradeIsPassing(e.grade) && !gradeIsRegistered(e.grade) && !transfer.includes(e)
  );

  const groups: Group[] = [
    { label: "Transfer Credits", color: "border-purple-300", entries: transfer },
    { label: "Completed at AAMU", color: "border-green-300", entries: passed },
    { label: "Pre-Registered", color: "border-blue-300", entries: registered },
    { label: "Failed / Withdrawn (need retake)", color: "border-red-300", entries: failed },
  ].filter((g) => g.entries.length > 0);

  const totalCompleted = [...transfer, ...passed, ...registered]
    .reduce((sum, e) => sum + e.credits, 0);

  const completedPct = Math.round((totalCompleted / 125) * 100);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Transcript Review</h2>
      <p className="text-gray-500 text-sm mb-6">
        {student.name} · GPA {student.gpa.toFixed(2)} · {totalCompleted} / 125 credits ({completedPct}%)
      </p>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all"
          style={{ width: `${completedPct}%` }}
        />
      </div>

      {groups.map((group) => (
        <div key={group.label} className={`mb-5 border-l-4 ${group.color} pl-4`}>
          <h3 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">
            {group.label} ({group.entries.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.entries.map((entry) => (
              <div
                key={entry.code}
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5"
              >
                <span className="font-mono text-xs text-gray-600">{entry.code}</span>
                <span className="text-xs text-gray-400">{COURSES[entry.code]?.title ?? entry.code}</span>
                <span className={`text-xs font-semibold rounded px-1.5 py-0.5 ${gradeBadge(entry)}`}>
                  {entry.grade}
                </span>
                <span className="text-xs text-gray-400">{entry.credits}cr</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {failed.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-sm text-red-700">
          {failed.length} course{failed.length > 1 ? "s" : ""} need to be retaken. They'll be prioritized in your plan.
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="border border-gray-200 text-gray-600 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
          &larr; Back
        </button>
        <button onClick={onNext} className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 transition-colors">
          Choose Concentration &rarr;
        </button>
      </div>
    </div>
  );
}
