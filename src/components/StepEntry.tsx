"use client";

import { useRef, useState } from "react";
import {
  COURSES, norm, gradeIsPassing, gradeIsRegistered,
  SAMPLE_STUDENT, type StudentData, type Grade, type Concentration, type TranscriptEntry,
} from "@/lib/data";

const ALL_GRADES: Grade[] = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F","W","WF","I","TA","TB","TC","S","CR","P","REG"];
const CONCENTRATIONS: { value: Concentration; label: string }[] = [
  { value: "AI",  label: "Artificial Intelligence" },
  { value: "CYB", label: "Cybersecurity" },
  { value: "GCS", label: "General Computer Science" },
];

interface Props {
  student: StudentData;
  onChange: (s: StudentData) => void;
  onNext: () => void;
}

export default function StepEntry({ student, onChange, onNext }: Props) {
  const [newCode, setNewCode]   = useState("");
  const [newGrade, setNewGrade] = useState<Grade>("A");
  const [newTerm, setNewTerm]   = useState("");
  const [error, setError]       = useState("");

  // Upload state
  const fileRef                         = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadError, setUploadError]   = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // ── Manual add ────────────────────────────────────────────────────────────
  function addCourse() {
    const code = norm(newCode);
    if (!code) { setError("Enter a course code."); return; }
    const course = COURSES[code];
    if (!course) { setError(`Unknown course: ${code}. Check the code and try again.`); return; }
    if (student.transcript.find((e) => e.code === code)) {
      setError(`${code} is already in your transcript.`); return;
    }
    setError("");
    onChange({
      ...student,
      transcript: [...student.transcript, { code, grade: newGrade, credits: course.credits, term: newTerm || undefined }],
    });
    setNewCode("");
    setNewTerm("");
  }

  function removeCourse(code: string) {
    onChange({ ...student, transcript: student.transcript.filter((e) => e.code !== code) });
  }

  function updateGrade(code: string, grade: Grade) {
    onChange({ ...student, transcript: student.transcript.map((e) => e.code === code ? { ...e, grade } : e) });
  }

  // ── Transcript upload ─────────────────────────────────────────────────────
  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/extract-transcript", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Extraction failed. Please try again.");
        return;
      }

      const extracted: TranscriptEntry[] = data.courses ?? [];
      if (extracted.length === 0) {
        setUploadError("No courses found in the transcript. Try a clearer scan.");
        return;
      }

      // Merge: skip duplicates already in transcript
      const existing = new Set(student.transcript.map((e) => e.code));
      const merged = [
        ...student.transcript,
        ...extracted.filter((e) => !existing.has(e.code)),
      ];

      onChange({ ...student, transcript: merged });
      setUploadSuccess(`Extracted ${extracted.length} courses — ${extracted.length - (extracted.length - merged.length + student.transcript.length - student.transcript.length)} new added. Review and edit below.`);
    } catch (err) {
      setUploadError(`Network error: ${err}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const passing  = student.transcript.filter((e) => gradeIsPassing(e.grade));
  const failing  = student.transcript.filter((e) => !gradeIsPassing(e.grade) && !gradeIsRegistered(e.grade));
  const reg      = student.transcript.filter((e) => gradeIsRegistered(e.grade));
  const totalCredits = [...passing, ...reg].reduce((s, e) => s + e.credits, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Course History</h2>
          <p className="text-gray-500 text-sm mt-1">Upload your transcript or add courses manually. Grade C or above counts toward your degree.</p>
        </div>
        <button
          onClick={() => onChange(SAMPLE_STUDENT)}
          className="text-xs text-blue-600 hover:underline border border-blue-200 rounded px-3 py-1.5 shrink-0"
        >
          Load sample
        </button>
      </div>

      {/* ── Upload zone ── */}
      <div
        className="border-2 border-dashed border-blue-200 rounded-xl p-5 mb-6 bg-blue-50/40 flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm mb-0.5">Upload Transcript</p>
          <p className="text-xs text-gray-500">PDF, PNG, or JPG · max 20 MB · AI extracts your courses automatically</p>
          {uploadError  && <p className="text-red-600 text-xs mt-2">{uploadError}</p>}
          {uploadSuccess && <p className="text-green-600 text-xs mt-2">{uploadSuccess}</p>}
        </div>
        <div className="shrink-0">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={onFileChange}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              uploading
                ? "bg-blue-300 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Extracting…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"/>
                </svg>
                Upload Transcript
              </>
            )}
          </button>
        </div>
      </div>

      {/* Student info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.name} onChange={(e) => onChange({ ...student, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Student ID</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.id} onChange={(e) => onChange({ ...student, id: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">GPA</label>
          <input type="number" step="0.01" min="0" max="4"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.gpa} onChange={(e) => onChange({ ...student, gpa: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Concentration</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={student.concentration} onChange={(e) => onChange({ ...student, concentration: e.target.value as Concentration })}>
            {CONCENTRATIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Manual add row */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Or add manually</p>
      <div className="flex gap-2 mb-3 flex-wrap">
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Course code (e.g. CS 215)"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCourse()}
        />
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newGrade} onChange={(e) => setNewGrade(e.target.value as Grade)}
        >
          {ALL_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <input
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Term (optional)"
          value={newTerm} onChange={(e) => setNewTerm(e.target.value)}
        />
        <button onClick={addCourse}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Grade legend */}
      <div className="flex gap-3 mb-3 text-xs text-gray-500">
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"/>Counts toward degree</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-red-400 mr-1"/>Excluded — must retake</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"/>Pre-registered</span>
      </div>

      {/* Transcript table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Code</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Cr</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Grade</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Counts?</th>
              <th className="text-left px-4 py-2.5 font-medium text-gray-500">Term</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {student.transcript.map((entry) => {
              const course    = COURSES[entry.code];
              const isPassing = gradeIsPassing(entry.grade);
              const isReg     = gradeIsRegistered(entry.grade);
              return (
                <tr key={entry.code} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-2 font-mono text-xs text-gray-700">{entry.code}</td>
                  <td className="px-4 py-2 text-gray-600">{course?.title ?? <span className="text-amber-500">Unknown course</span>}</td>
                  <td className="px-4 py-2 text-gray-500">{entry.credits}</td>
                  <td className="px-4 py-2">
                    <select
                      className={`text-xs font-semibold rounded px-2 py-0.5 border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                        isReg ? "bg-blue-100 text-blue-700" : isPassing ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                      value={entry.grade}
                      onChange={(e) => updateGrade(entry.code, e.target.value as Grade)}
                    >
                      {ALL_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {isReg
                      ? <span className="text-blue-500">Registered</span>
                      : isPassing
                      ? <span className="text-green-600 font-medium">✓ {entry.credits} cr</span>
                      : <span className="text-red-500 font-medium">✗ Retake</span>
                    }
                  </td>
                  <td className="px-4 py-2 text-gray-400 text-xs">{entry.term ?? "—"}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeCourse(entry.code)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                  </td>
                </tr>
              );
            })}
            {student.transcript.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  Upload your transcript above or add courses manually.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 flex gap-4">
          <span><span className="font-semibold text-gray-900">{totalCredits}</span> / 125 credits</span>
          {failing.length > 0 && (
            <span className="text-red-500"><span className="font-semibold">{failing.length}</span> course{failing.length > 1 ? "s" : ""} to retake</span>
          )}
        </div>
        <button onClick={onNext}
          className="bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium hover:bg-blue-700 transition-colors">
          Review &rarr;
        </button>
      </div>
    </div>
  );
}
