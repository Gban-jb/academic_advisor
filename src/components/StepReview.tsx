"use client";

import { motion } from "framer-motion";
import { COURSES, gradeIsPassing, gradeIsRegistered, type StudentData, type TranscriptEntry } from "@/lib/data";

interface Props {
  student: StudentData;
  onBack: () => void;
  onNext: () => void;
}

function gradeBadge(entry: TranscriptEntry) {
  if (gradeIsRegistered(entry.grade)) return "bg-maroon-100 text-maroon-700";
  if (gradeIsPassing(entry.grade)) return "bg-green-100 text-green-700";
  return "bg-red-100 text-red-700";
}

export default function StepReview({ student, onBack, onNext }: Props) {
  const transfer = student.transcript.filter((e) => e.grade.startsWith("T") || (e.term?.includes("Transfer") ?? false));
  const registered = student.transcript.filter((e) => gradeIsRegistered(e.grade));
  const passed = student.transcript.filter((e) => gradeIsPassing(e.grade) && !transfer.includes(e) && !registered.includes(e));
  const failed = student.transcript.filter((e) => !gradeIsPassing(e.grade) && !gradeIsRegistered(e.grade) && !transfer.includes(e));

  const groups = [
    { label: "Transfer Credits", dot: "bg-gold-400", border: "border-gold-300", entries: transfer },
    { label: "Completed at AAMU", dot: "bg-green-400", border: "border-green-300", entries: passed },
    { label: "Pre-Registered", dot: "bg-maroon-400", border: "border-maroon-300", entries: registered },
    { label: "Need Retake", dot: "bg-red-400", border: "border-red-300", entries: failed },
  ].filter((g) => g.entries.length > 0);

  const totalCompleted = [...transfer, ...passed, ...registered].reduce((s, e) => s + e.credits, 0);
  const pct = Math.round((totalCompleted / 125) * 100);

  // Ring geometry
  const R = 52, C = 2 * Math.PI * R;

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Transcript Review</h2>
      <p className="text-slate-500 text-sm mb-6">{student.name} · GPA {student.gpa.toFixed(2)}</p>

      {/* Progress ring + stats */}
      <div className="flex items-center gap-6 mb-8 flex-wrap">
        <div className="relative h-32 w-32 shrink-0">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <motion.circle
              cx="60" cy="60" r={R} fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C - (pct / 100) * C }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c1530" />
                <stop offset="100%" stopColor="#ebb52a" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-maroon-900">{pct}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">complete</span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Credits Earned", value: totalCompleted, accent: "text-maroon-700" },
            { label: "Remaining", value: 125 - totalCompleted, accent: "text-gold-600" },
            { label: "Courses", value: student.transcript.length, accent: "text-slate-700" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-2xl px-5 py-4 min-w-[110px]">
              <div className={`text-2xl font-bold ${s.accent}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grouped cards */}
      <div className="space-y-5">
        {groups.map((group, gi) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`w-2 h-2 rounded-full ${group.dot}`} />
              <h3 className="font-semibold text-slate-700 text-sm">{group.label}</h3>
              <span className="text-xs text-slate-400">({group.entries.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.entries.map((entry, i) => (
                <motion.div key={entry.code}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05 + i * 0.025, duration: 0.3 }}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm">
                  <span className="font-mono text-xs text-slate-600">{entry.code}</span>
                  <span className="text-xs text-slate-400 max-w-[140px] truncate">{COURSES[entry.code]?.title ?? entry.code}</span>
                  <span className={`text-xs font-semibold rounded-md px-1.5 py-0.5 ${gradeBadge(entry)}`}>{entry.grade}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {failed.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-6 text-sm text-red-700">
          {failed.length} course{failed.length > 1 ? "s" : ""} need retaking — they'll be prioritized in your plan.
        </motion.div>
      )}

      {/* Nav */}
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="border border-slate-200 text-slate-600 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">← Back</button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext}
          className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-xl px-6 py-2.5 font-medium shadow-soft hover:shadow-lift transition-shadow">
          Choose Concentration →
        </motion.button>
      </div>
    </div>
  );
}
