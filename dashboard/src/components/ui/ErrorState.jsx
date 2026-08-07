import { motion } from "framer-motion";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -5, 5, -5, 0] }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center rounded-2xl mb-6"
        style={{
          width: "72px",
          height: "72px",
          background: "rgba(239, 68, 68, 0.1)",
          color: "var(--color-danger)",
        }}
      >
        <FiAlertCircle size={32} />
      </motion.div>

      <h3
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Error Loading Data
      </h3>

      <p
        className="text-sm max-w-md mb-6"
        style={{ color: "var(--text-muted)" }}
      >
        {message}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, rotate: 180 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer border-none outline-none"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <FiRefreshCw size={14} />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}
