"use client";

import { CONCENTRATION_COURSES, COURSES, type Concentration } from "@/lib/data";

interface Props {
  current: Concentration;
  onChange: (c: Concentration) => void;
  onBack: () => void;
  onNext: () => void;
}

const OPTIONS: { value: Concentration; label: string; icon: string; description: string }[] = [
  {
    value: "AI",
    label: "Artificial Intelligence",
    icon: "🤖",
    description: "Machine learning, robotics, computer vision, and AI fundamentals.",
  },
  {
    value: "CYB",
    label: "Cybersecurity",
    icon: "🔐",
    description: "Information security, cryptography, forensics, and network defense.",
  },
  {
    value: "GCS",
    label: "General Computer Science",
    icon: "💻",
    description: "Broad CS foundation with flexible elective choices.",
  },
];

export default function StepConcentration({ current, onChange, onBack, onNext }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose Your Concentration</h2>
      <p className="text-gray-500 text-sm mb-6">21 credit hours required. All three share CS 381, CS 384, and CS 488 as common courses.</p>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {OPTIONS.map((opt) => {
          const selected = current === opt.value;
          const courses = CONCENTRATION_COURSES[opt.value];
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`text-left rounded-xl border-2 p-4 transition-all ${
                selected
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
              }`}
            >
              <div className="text-2xl mb-2">{opt.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{opt.label}</div>
              <div className="text-xs text-gray-500 mb-3">{opt.description}</div>
              <div className="space-y-0.5">
                {courses.map((code) => (
                  <div key={code} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="font-mono text-gray-400 shrink-0">{code}</span>
                    <span className="truncate">{COURSES[code]?.title}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border border-gray-200 text-gray-600 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
          &larr; Back
        </button>
        <button onClick={onNext} className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 transition-colors">
          Generate Plan &rarr;
        </button>
      </div>
    </div>
  );
}
