"use client";

import { useState } from "react";
import { SAMPLE_STUDENT, type StudentData, type Concentration } from "@/lib/data";
import StepEntry from "@/components/StepEntry";
import StepReview from "@/components/StepReview";
import StepConcentration from "@/components/StepConcentration";
import StepPlan from "@/components/StepPlan";

const STEPS = ["Enter Courses", "Review", "Concentration", "Degree Plan"] as const;

export default function Home() {
  const [step, setStep] = useState(0);
  const [student, setStudent] = useState<StudentData>(SAMPLE_STUDENT);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AAMU CS Degree Planner</h1>
        <p className="text-gray-500 mt-1">Alabama A&amp;M University · BS Computer Science · 2025–2026 Bulletin</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8 gap-0">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => i < step && setStep(i)}
              className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center shrink-0 transition-colors ${
                i === step
                  ? "bg-blue-600 text-white"
                  : i < step
                  ? "bg-green-500 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </button>
            <span className={`ml-2 text-sm font-medium hidden sm:inline ${i === step ? "text-blue-600" : i < step ? "text-green-600" : "text-gray-400"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {step === 0 && (
          <StepEntry student={student} onChange={setStudent} onNext={next} />
        )}
        {step === 1 && (
          <StepReview student={student} onBack={back} onNext={next} />
        )}
        {step === 2 && (
          <StepConcentration
            current={student.concentration}
            onChange={(c: Concentration) => setStudent((s) => ({ ...s, concentration: c }))}
            onBack={back}
            onNext={next}
          />
        )}
        {step === 3 && (
          <StepPlan student={student} onBack={back} />
        )}
      </div>
    </div>
  );
}
