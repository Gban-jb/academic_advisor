"use client";

import { motion } from "framer-motion";
import { CONCENTRATION_COURSES, COURSES, type Concentration } from "@/lib/data";

interface Props {
  current: Concentration;
  onChange: (c: Concentration) => void;
  onBack: () => void;
  onNext: () => void;
}

const OPTIONS: { value: Concentration; label: string; icon: string; description: string; gradient: string }[] = [
  { value: "AI",  label: "Artificial Intelligence", icon: "🤖", description: "Machine learning, robotics, computer vision, and AI fundamentals.", gradient: "from-maroon-600 to-maroon-800" },
  { value: "CYB", label: "Cybersecurity", icon: "🔐", description: "Information security, cryptography, forensics, and network defense.", gradient: "from-gold-500 to-gold-700" },
  { value: "GCS", label: "General Computer Science", icon: "💻", description: "Broad CS foundation with flexible elective choices.", gradient: "from-slate-600 to-slate-800" },
];

export default function StepConcentration({ current, onChange, onBack, onNext }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Choose Your Concentration</h2>
      <p className="text-slate-500 text-sm mb-6">21 credit hours. All three share CS 381, CS 384, and CS 488 as common courses.</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {OPTIONS.map((opt, i) => {
          const selected = current === opt.value;
          const courses = CONCENTRATION_COURSES[opt.value];
          return (
            <motion.button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative text-left rounded-2xl border-2 p-4 transition-colors overflow-hidden ${
                selected ? "border-maroon-500 bg-maroon-50/60 shadow-lift" : "border-slate-100 bg-white hover:border-maroon-200 shadow-sm"
              }`}
            >
              {selected && (
                <motion.div layoutId="conc-check" className="absolute top-3 right-3 h-6 w-6 rounded-full bg-maroon-700 flex items-center justify-center text-white text-xs shadow">
                  ✓
                </motion.div>
              )}
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center text-xl mb-3 shadow-soft`}>
                {opt.icon}
              </div>
              <div className="font-semibold text-slate-900 text-sm mb-1">{opt.label}</div>
              <div className="text-xs text-slate-500 mb-3 leading-relaxed">{opt.description}</div>
              <div className="space-y-1 pt-3 border-t border-slate-100">
                {courses.map((code) => (
                  <div key={code} className="text-xs text-slate-500 flex gap-1.5">
                    <span className="font-mono text-slate-400 shrink-0 w-14">{code}</span>
                    <span className="truncate">{COURSES[code]?.title}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border border-slate-200 text-slate-600 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">← Back</button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext}
          className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-xl px-6 py-2.5 font-medium shadow-soft hover:shadow-lift transition-shadow">
          Generate Plan →
        </motion.button>
      </div>
    </div>
  );
}
