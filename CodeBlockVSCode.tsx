import React, { useState } from "react";
import { Check, Copy, Play, RotateCcw, StepForward, Terminal } from "lucide-react";
import { LineExplanation } from "../types/curriculum";

interface CodeBlockVSCodeProps {
  code: string;
  filename?: string;
  expectedOutput?: string;
  lineByLine?: LineExplanation[];
}

const KEYWORDS = new Set([
  "def",
  "if",
  "elif",
  "else",
  "while",
  "for",
  "in",
  "return",
  "try",
  "except",
  "finally",
  "raise",
  "break",
  "continue",
  "pass",
  "and",
  "or",
  "not",
  "is",
  "import",
  "from",
  "as",
  "class",
  "with",
  "yield",
  "lambda",
  "global",
  "del",
  "assert",
]);

const BOOLEANS = new Set(["True", "False", "None"]);

const BUILTINS = new Set([
  "print",
  "input",
  "type",
  "int",
  "float",
  "str",
  "bool",
  "len",
  "range",
  "min",
  "max",
  "sum",
  "sorted",
  "list",
  "round",
  "repr",
]);

function highlightPythonLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < line.length) {
    // Comment
    if (line[i] === "#") {
      tokens.push(
        <span key={key++} className="text-emerald-400/75 italic">
          {line.slice(i)}
        </span>
      );
      break;
    }

    // Strings (triple or single/double)
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      const isTriple = line.slice(i, i + 3) === quote.repeat(3);
      if (isTriple) {
        const end = line.indexOf(quote.repeat(3), i + 3);
        const sliceEnd = end === -1 ? line.length : end + 3;
        tokens.push(
          <span key={key++} className="text-amber-300">
            {line.slice(i, sliceEnd)}
          </span>
        );
        i = sliceEnd;
        continue;
      } else {
        let j = i + 1;
        while (j < line.length && line[j] !== quote) {
          if (line[j] === "\\") j++;
          j++;
        }
        const sliceEnd = Math.min(line.length, j + 1);
        tokens.push(
          <span key={key++} className="text-amber-300">
            {line.slice(i, sliceEnd)}
          </span>
        );
        i = sliceEnd;
        continue;
      }
    }

    // Numbers
    if (/[0-9]/.test(line[i]) && (i === 0 || !/[A-Za-z_]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      tokens.push(
        <span key={key++} className="text-cyan-300">
          {line.slice(i, j)}
        </span>
      );
      i = j;
      continue;
    }

    // Identifiers / Keywords / Builtins
    if (/[A-Za-z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push(
          <span key={key++} className="text-violet-400 font-semibold">
            {word}
          </span>
        );
      } else if (BOOLEANS.has(word)) {
        tokens.push(
          <span key={key++} className="text-sky-400 font-semibold">
            {word}
          </span>
        );
      } else if (BUILTINS.has(word)) {
        tokens.push(
          <span key={key++} className="text-cyan-400">
            {word}
          </span>
        );
      } else {
        tokens.push(
          <span key={key++} className="text-slate-100">
            {word}
          </span>
        );
      }
      i = j;
      continue;
    }

    // Operators & punctuation
    if (/[+\-*/%=<>!:()[\]{},\\.]/.test(line[i])) {
      tokens.push(
        <span key={key++} className="text-slate-400">
          {line[i]}
        </span>
      );
      i++;
      continue;
    }

    // Whitespace or other characters
    let j = i;
    while (j < line.length && !/[#"'0-9A-Za-z_+\-*/%=<>!:()[\]{},\\.]/.test(line[j])) j++;
    tokens.push(<span key={key++}>{line.slice(i, j)}</span>);
    i = j;
  }

  return tokens;
}

export const CodeBlockVSCode: React.FC<CodeBlockVSCodeProps> = ({
  code,
  filename = "main.py",
  expectedOutput,
  lineByLine,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);
  const [showOutput, setShowOutput] = useState(Boolean(expectedOutput));

  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const activeExplanation =
    activeStepIdx !== null && lineByLine ? lineByLine[activeStepIdx] : null;

  const handleStep = () => {
    if (!lineByLine || lineByLine.length === 0) return;
    setActiveStepIdx((prev) => {
      if (prev === null) return 0;
      return prev + 1 < lineByLine.length ? prev + 1 : 0;
    });
    setShowOutput(true);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-[#0b1020] shadow-lg">
      {/* VS Code Window Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#11182c] border-b border-slate-800">
        <div className="flex items-center gap-3" dir="ltr">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-mono text-slate-300 border-b-2 border-cyan-400 pb-0.5 px-1">
            {filename}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lineByLine && lineByLine.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-500/20 text-violet-200 border border-violet-400/30 hover:bg-violet-500/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>
                  {activeStepIdx === null
                    ? "تتبع الكود خطوة بخطوة"
                    : `الخطوة التالية (${activeStepIdx + 1}/${lineByLine.length})`}
                </span>
              </button>
              {activeStepIdx !== null && (
                <button
                  type="button"
                  onClick={() => setActiveStepIdx(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="إعادة ضبط التتبع"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}

          {expectedOutput && (
            <button
              type="button"
              onClick={() => setShowOutput((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{showOutput ? "إخفاء الناتج" : "عرض الناتج"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "تم النسخ" : "نسخ"}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body (strictly LTR) */}
      <div className="overflow-x-auto py-3 px-2 font-mono text-sm leading-6" dir="ltr">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = activeExplanation?.lineNumber === lineNumber;
          const matchingStep = lineByLine?.findIndex((s) => s.lineNumber === lineNumber) ?? -1;

          return (
            <div
              key={lineNumber}
              onClick={() => {
                if (matchingStep !== -1) setActiveStepIdx(matchingStep);
              }}
              className={`flex items-start px-3 py-0.5 rounded transition-colors ${
                matchingStep !== -1 ? "cursor-pointer hover:bg-slate-800/60" : ""
              } ${
                isHighlighted
                  ? "bg-cyan-500/15 ring-1 ring-cyan-400/40"
                  : ""
              }`}
            >
              <span className="select-none w-8 shrink-0 text-right pr-4 text-xs text-slate-500 tabular-nums leading-6">
                {lineNumber}
              </span>
              <pre className="whitespace-pre text-slate-100 flex-1">
                {line.length > 0 ? highlightPythonLine(line) : " "}
              </pre>
            </div>
          );
        })}
      </div>

      {/* Active Step Explanation Callout */}
      {activeExplanation && (
        <div className="px-4 py-3 bg-violet-950/50 border-t border-violet-500/30 flex items-start gap-3">
          <span className="text-xs font-mono text-cyan-300 shrink-0 mt-0.5 tabular-nums">
            سطر {activeExplanation.lineNumber}
          </span>
          <p className="text-sm text-slate-100 leading-relaxed">
            {activeExplanation.explanation}
          </p>
        </div>
      )}

      {/* Terminal Output Panel */}
      {expectedOutput && showOutput && (
        <div className="border-t border-slate-800 bg-[#060913] px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>الناتج المتوقع (Terminal Output)</span>
          </div>
          <pre
            dir="ltr"
            className="font-mono text-xs sm:text-sm text-emerald-300 whitespace-pre-wrap leading-6 overflow-x-auto"
          >
            {expectedOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
