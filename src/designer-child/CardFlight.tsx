import { useEffect, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";
import { Check } from "@phosphor-icons/react";
import CardVisual, { type CardDesign } from "./CardVisual";
export type CardBox = { x: number; y: number; width: number; height: number };
export type CardFlightState = { id: number; design: CardDesign; checked: boolean; from: CardBox; to?: CardBox; destination: "home" | "editor" };
export function measureCard(shell: HTMLElement | null, selector: string, atRest = false): CardBox | undefined {
  const element = shell?.querySelector<HTMLElement>(selector);
  if (!shell || !element) return;
  const bounds = shell.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const ratio = shell.offsetWidth / bounds.width;
  const scroller = element.closest(".design-scroll");
  const translateY = atRest && scroller ? new DOMMatrixReadOnly(getComputedStyle(scroller).transform).m42 : 0;
  return { x: (rect.left - bounds.left) * ratio, y: (rect.top - bounds.top - translateY) * ratio, width: rect.width * ratio, height: rect.height * ratio };
}
export default function CardFlight({ flight, onComplete }: { flight: CardFlightState; onComplete(): void }) {
  const transform = (box: CardBox) => ({ x: box.x, y: box.y, scaleX: box.width / 171, scaleY: box.height / (171 * 100 / 159) });
  const controls = useAnimationControls();
  const finish = useRef(onComplete);
  finish.current = onComplete;
  useEffect(() => {
    if (!flight.to) return;
    let cancelled = false;
    void controls.start({ ...transform(flight.to), transition: {
      type: "spring", stiffness: 260, damping: 24, restDelta: 0.1, restSpeed: 0.3,
    } }).then(() => { if (!cancelled) finish.current(); });
    return () => { cancelled = true; controls.stop(); };
  }, [controls, flight.to]);
  return <motion.div className="card-flight" aria-hidden="true"
    initial={transform(flight.from)} animate={controls}>
    <CardVisual design={flight.design} />
    {(flight.destination === "editor" || flight.checked) && <motion.span className="card-flight-check"
      initial={{ opacity: flight.destination === "editor" ? 0 : 1, scale: flight.destination === "editor" ? .85 : 1 }}
      animate={{ opacity: flight.destination === "editor" ? 1 : 0, scale: flight.destination === "editor" ? 1 : .85 }}
      transition={{ duration: .12, delay: flight.destination === "editor" ? .22 : 0 }}>
      <Check size={16} weight="bold" />
    </motion.span>}
  </motion.div>;
}
