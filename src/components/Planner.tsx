"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EMPTY_STUDENT, type StudentData, type Concentration } from "@/lib/data";
import StepEntry from "@/components/StepEntry";
import StepReview from "@/components/StepReview";
import StepConcentration from "@/components/StepConcentration";
import StepPlan from "@/components/StepPlan";

const STEPS = ["Courses", "Review", "Concentration", "Plan"] as const;

const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -40 }),
};

interface Props {
  onExit: () => void; // leave the planner, back to university detail
}

export default function Planner({ onExit }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [student, setStudent] = useState<StudentData>(EMPTY_STUDENT);

  const go = (target: number) => {
    setDir(target > step ? 1 : -1);
    setStep(Math.max(0, Math.min(target, STEPS.length - 1)));
  };
  const next = () => go(step + 1);
  const back = () => (step === 0 ? onExit() : go(step - 1));

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center shadow-soft">
            <span className="text-gold-300 font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-maroon-900 leading-none">The Lab</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">AAMU · BS Computer Science · Degree Planner</p>
          </div>
        </div>
        <button onClick={onExit} className="no-print text-sm text-slate-500 hover:text-maroon-700 transition-colors">
          ← Exit
        </button>
      </motion.header>

      {/* Stepper */}
      <div className="mb-8 no-print">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-200 -z-0" />
          <motion.div
            className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-maroon-600 to-gold-400 -z-0"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button key={label} onClick={() => i < step && go(i)} disabled={i > step}
                className="relative z-10 flex flex-col items-center gap-2">
                <motion.span
                  animate={{
                    scale: active ? 1.12 : 1,
                    backgroundColor: active ? "#7c1530" : done ? "#9e234b" : "#ffffff",
                    color: active || done ? "#ffffff" : "#94a3b8",
                    borderColor: active || done ? "#7c1530" : "#e2e8f0",
                  }}
                  transition={{ duration: 0.3 }}
                  className={`h-8 w-8 rounded-full border-2 text-sm font-semibold flex items-center justify-center shadow-sm ${
                    i <= step ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </motion.span>
                <span className={`text-xs font-medium transition-colors hidden sm:block ${
                  active ? "text-maroon-800" : done ? "text-maroon-600" : "text-slate-400"
                }`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="surface rounded-3xl shadow-soft border border-white/60 p-5 sm:p-7"
          >
            {step === 0 && <StepEntry student={student} onChange={setStudent} onNext={next} />}
            {step === 1 && <StepReview student={student} onBack={back} onNext={next} />}
            {step === 2 && (
              <StepConcentration
                current={student.concentration}
                onChange={(c: Concentration) => setStudent((s) => ({ ...s, concentration: c }))}
                onBack={back}
                onNext={next}
              />
            )}
            {step === 3 && <StepPlan student={student} onBack={back} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8 no-print">
        Built for AAMU students · Not an official advising document
      </p>
    </div>
  );
}
