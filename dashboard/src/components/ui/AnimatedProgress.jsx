import { motion } from "framer-motion";

export default function AnimatedProgress({
  value = 0,
  max = 100,
  color = "var(--accent-cyan)",
  height = 6,
  delay = 0,
  showLabel = false,
  className = "",
}) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{
          height: `${height}px`,
          background: "var(--border-primary)",
        }}
      >
        <motion.div
          className="h-full rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          style={{
            background: color,
            boxShadow: `0 0 12px ${color}50`,
          }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
            style={{
              width: "50%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          />
        </motion.div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {value}
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {max}
          </span>
        </div>
      )}
    </div>
  );
}
