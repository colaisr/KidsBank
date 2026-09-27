import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";

export default function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 100);
    return () => window.clearTimeout(timer);
  }, []);
  const format = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
  return <span className="animated-number" aria-hidden="true">
    <span className="number-measure">{new Intl.NumberFormat("ru-RU", format).format(value)}</span>
    <NumberFlow value={entered || reduce ? value : 0} locales="ru-RU" format={format} animated={!reduce} transformTiming={{ duration: 650, easing: "ease-out" }} spinTiming={{ duration: 650, easing: "ease-out" }} />
  </span>;
}
