import { motion } from "framer-motion";

export default function SectionTitle({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="mb-6"
    >
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "28px",
              height: "28px",
              background: "var(--accent-glow)",
              color: "var(--accent-cyan)",
            }}
          >
            <Icon size={14} />
          </div>
        )}
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </h3>
      </div>
      {description && (
        <p
          className="text-xs mt-1.5"
          style={{ color: "var(--text-muted)", marginLeft: Icon ? "38px" : 0 }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
