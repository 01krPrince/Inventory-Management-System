import React, { useRef } from "react";
import { CalendarIcon } from "lucide-react";

type DateInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full h-[32px] ml-1">
      <input
        ref={inputRef}
        type="date"
        value={value || ""}
        onChange={onChange}
        className="w-full h-[32px] bg-white border border-gray-300 rounded-sm px-3 text-[13px] text-gray-700 focus:outline-none focus:border-[var(--theme-focus)] focus:ring-1 focus:ring-[var(--theme-focus)] pr-8 uppercase"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.showPicker()}
        className="absolute right-0 top-0 h-full w-8 flex items-center justify-center bg-[var(--theme-primary)] text-white rounded-r-sm hover:opacity-90 transition-opacity"
      >
        <CalendarIcon size={16} />
      </button>
    </div>
  );
};

export default DateInput;
