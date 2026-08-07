import { motion } from "framer-motion";

export default function EmptyState({
  icon: Icon,
  title = "No Data Available",
  description = "There's nothing to display right now.",
  action,
  actionLabel = "Retry",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {Icon && (
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center rounded-2xl mb-6"
          style={{
            width: "72px",
            height: "72px",
            background: "var(--accent-glow)",
            color: "var(--accent-cyan)",
          }}
        >
          <Icon size={32} />
        </motion.div>
      )}

      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>

      <p
        className="text-sm max-w-md"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action}
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer border-none outline-none"
          style={{
            background: "var(--accent-gradient)",
            color: "#fff",
            boxShadow: "0 0 20px var(--accent-glow)",
          }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
