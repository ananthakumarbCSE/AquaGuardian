export default function LoadingSkeleton({ variant = "card", count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const baseStyle = {
    background: "var(--bg-surface)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    position: "relative",
  };

  const shimmerOverlay = (
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.05), transparent)",
        animation: "shimmer 2s infinite",
      }}
    />
  );

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skeletons.map((i) => (
          <div key={i} style={{ ...baseStyle, height: "100px", padding: "20px" }}>
            <div
              className="rounded"
              style={{
                width: "60%",
                height: "12px",
                background: "var(--border-primary)",
                marginBottom: "12px",
              }}
            />
            <div
              className="rounded"
              style={{
                width: "40%",
                height: "24px",
                background: "var(--border-primary)",
              }}
            />
            {shimmerOverlay}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "gauge") {
    return (
      <div
        className="flex items-center justify-center"
        style={{ ...baseStyle, height: "320px", padding: "24px" }}
      >
        <div
          className="rounded-full"
          style={{
            width: "180px",
            height: "180px",
            border: "8px solid var(--border-primary)",
          }}
        />
        {shimmerOverlay}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div style={{ ...baseStyle, height: "380px", padding: "24px" }}>
        <div
          className="rounded"
          style={{
            width: "30%",
            height: "16px",
            background: "var(--border-primary)",
            marginBottom: "24px",
          }}
        />
        <div className="flex items-end gap-2" style={{ height: "280px" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${30 + Math.random() * 60}%`,
                background: "var(--border-primary)",
              }}
            />
          ))}
        </div>
        {shimmerOverlay}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className="space-y-3">
        {skeletons.map((i) => (
          <div
            key={i}
            className="rounded"
            style={{
              height: "14px",
              width: `${60 + Math.random() * 30}%`,
              background: "var(--border-primary)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {shimmerOverlay}
          </div>
        ))}
      </div>
    );
  }

  // Default: generic block
  return (
    <div style={{ ...baseStyle, height: "200px" }}>
      {shimmerOverlay}
    </div>
  );
}
