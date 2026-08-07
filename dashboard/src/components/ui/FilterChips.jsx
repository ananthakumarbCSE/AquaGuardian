import { motion } from "framer-motion";

export default function FilterChips({ options, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = active === option.value;
        return (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(option.value)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none outline-none"
            style={{
              background: isActive ? "var(--accent-glow)" : "var(--bg-surface)",
              color: isActive ? "var(--accent-cyan)" : "var(--text-muted)",
              border: `1px solid ${
                isActive ? "rgba(6, 182, 212, 0.3)" : "var(--glass-border)"
              }`,
              boxShadow: isActive ? "0 0 16px var(--accent-glow)" : "none",
              transition:
                "background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast)",
            }}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className="ml-1.5 opacity-60"
              >
                {option.count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
