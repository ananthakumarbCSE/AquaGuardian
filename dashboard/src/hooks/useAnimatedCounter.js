import { useState, useEffect, useRef } from "react";

export default function useAnimatedCounter(target, duration = 1200, enabled = true) {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    if (!enabled || target === null || target === undefined) return;

    const startValue = prevTarget.current;
    const endValue = typeof target === "number" ? target : parseFloat(target) || 0;
    prevTarget.current = endValue;

    if (startValue === endValue) {
      setCount(endValue);
      return;
    }

    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * eased;

      setCount(Math.round(currentValue * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    }

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return count;
}
