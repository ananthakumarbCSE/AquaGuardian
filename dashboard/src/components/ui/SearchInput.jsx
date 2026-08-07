import { useState, useCallback, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
}) {
  const [localValue, setLocalValue] = useState(value || "");
  const timerRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setLocalValue(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange?.(val);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange?.("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [onChange]);

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-4 py-2.5"
      style={{
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        transition: "border-color var(--transition-fast)",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.borderColor = "var(--glass-hover-border)")
      }
      onBlur={(e) =>
        (e.currentTarget.style.borderColor = "var(--glass-border)")
      }
    >
      <FiSearch size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-sm"
        style={{
          color: "var(--text-primary)",
          caretColor: "var(--accent-cyan)",
        }}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0.5 rounded"
          style={{ color: "var(--text-muted)" }}
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
}
