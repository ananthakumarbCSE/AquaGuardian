import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  padding = "p-6",
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={
        hover
          ? {
              y: -2,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`glass-effect glass-hover rounded-2xl ${padding} ${className}`}
      style={{
        transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
