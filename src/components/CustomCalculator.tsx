import React, { useState, useEffect } from "react";
import { X, Delete } from "lucide-react";

export const CustomCalculator: React.FC = () => {
  //   AC  (  )  Del
  //   7   8  9   ÷
  //   4   5  6   ×
  //   1   2  3   -
  //   0   .  =   +

  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<string>("");

  // Handle keyboard events for better accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9.]/.test(key)) handleInput(key);
      if (["+", "-", "*", "/", "(", ")"].includes(key)) handleInput(key);
      if (key === "Enter") calculate();
      if (key === "Backspace") handleDelete();
      if (key === "Escape") handleClear();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const handleInput = (val: string) => {
    // Prevent multiple decimals in a row or invalid operator sequences
    if (val === "." && input.slice(-1) === ".") return;
    // 123    +
    if (
      ["+", "-", "*", "/"].includes(val) &&
      ["+", "-", "*", "/"].includes(input.slice(-1))
    ) {
      // Replace the last operator if a new one is clicked
      setInput(input.slice(0, -1) + val);
      return;
    }
    setInput((prev) => prev + val);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
    setHistory("");
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    if (!input) return;
    try {
      // Create a safe evaluation environment
      // eslint-disable-next-line no-new-func
      const calc = new Function("return " + input);
      const res = calc();

      // Format to avoid long decimals
      const formattedResult = Number.isInteger(res)
        ? res
        : res.toFixed(4).replace(/\.?0+$/, "");

      setResult(formattedResult.toString());
      setHistory(input);
      setInput(formattedResult.toString());
    } catch (error) {
      setResult("Error");
    }
  };

  // Helper component for consistent button styling
  const CalcButton = ({
    label,
    onClick,
    className = "",
    icon = null,
  }: {
    label?: string;
    onClick: () => void;
    className?: string;
    icon?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`
        h-14 rounded-lg text-lg font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm
        ${className}
      `}
    >
      {icon || label}
    </button>
  );

  // Professional Color Palette
  const THEME = {
    primary: "bg-[#0e4a7b] hover:bg-[#0b3d66]", // The requested color
    secondary: "bg-slate-700 hover:bg-slate-600", // Neutral for special keys
    number: "bg-slate-800 hover:bg-slate-700", // Dark neutral for numbers
    text: "text-white",
    textSoft: "text-gray-300",
  };

  return (
    <div className="w-full flex flex-col items-center pt-[5vh]">
      {/* Container with Shadow and Border */}
      <div className="rounded-xl shadow-2xl border border-slate-700 overflow-hidden bg-slate-900 w-[320px]">
        {/* Header - Using the requested color for branding */}
        <div className="bg-[#0e4a7b] px-4 py-3 flex justify-between items-center border-b border-[#0b3d66]">
          <span className="text-white text-xs font-semibold tracking-wider uppercase opacity-90">
            Calculator
          </span>
          <button className="hover:bg-white/10 p-1 rounded transition-colors">
            <X className="w-4 h-4 text-white hover:text-white" />
          </button>
        </div>

        {/* Display Screen - Neutral dark background for eye comfort */}
        <div className="bg-slate-900 p-5 flex flex-col items-end justify-end h-32 break-all border-b border-slate-800">
          <span className="text-slate-400 text-sm h-6 font-mono mb-1">
            {history}
          </span>
          <span className="text-white text-4xl font-light font-mono tracking-wide">
            {input || "0"}
          </span>
          {result && input !== result && (
            <span className="text-[#0e4a7b] text-sm mt-1 font-mono font-bold bg-blue-50/10 px-2 rounded">
              = {result}
            </span>
          )}
        </div>

        {/* Keypad - Dark neutral background */}
        <div className="bg-slate-800 p-4 grid grid-cols-4 gap-3">
          {/* Row 1 - Utility Keys (Soft neutral) */}
          <CalcButton
            label="AC"
            onClick={handleClear}
            className={`${THEME.secondary} text-rose-300`}
          />
          <CalcButton
            label="("
            onClick={() => handleInput("(")}
            className={`${THEME.secondary} ${THEME.textSoft}`}
          />
          <CalcButton
            label=")"
            onClick={() => handleInput(")")}
            className={`${THEME.secondary} ${THEME.textSoft}`}
          />
          <CalcButton
            icon={<Delete className="w-5 h-5" />}
            onClick={handleDelete}
            className={`${THEME.secondary} text-orange-300`}
          />

          {/* Row 2 */}
          <CalcButton
            label="7"
            onClick={() => handleInput("7")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="8"
            onClick={() => handleInput("8")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="9"
            onClick={() => handleInput("9")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="÷"
            onClick={() => handleInput("/")}
            className={`${THEME.primary} ${THEME.text}`}
          />

          {/* Row 3 */}
          <CalcButton
            label="4"
            onClick={() => handleInput("4")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="5"
            onClick={() => handleInput("5")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="6"
            onClick={() => handleInput("6")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="×"
            onClick={() => handleInput("*")}
            className={`${THEME.primary} ${THEME.text}`}
          />

          {/* Row 4 */}
          <CalcButton
            label="1"
            onClick={() => handleInput("1")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="2"
            onClick={() => handleInput("2")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="3"
            onClick={() => handleInput("3")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="-"
            onClick={() => handleInput("-")}
            className={`${THEME.primary} ${THEME.text}`}
          />

          {/* Row 5 */}
          <CalcButton
            label="0"
            onClick={() => handleInput("0")}
            className={`col-span-1 ${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="."
            onClick={() => handleInput(".")}
            className={`${THEME.number} ${THEME.text}`}
          />
          <CalcButton
            label="="
            onClick={calculate}
            className="bg-[#0b3d66] hover:bg-[#092e4d] text-white shadow-lg border border-[#0e4a7b]"
          />
          <CalcButton
            label="+"
            onClick={() => handleInput("+")}
            className={`${THEME.primary} ${THEME.text}`}
          />
        </div>
      </div>
    </div>
  );
};
