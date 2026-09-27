import { useLayoutEffect, useRef } from "react";
import { leoConfig } from './leoConfig';

export const cardDesigns = [
  { id: "ocean", name: "Океан" },
  { id: "space", name: "Космос" },
  { id: "leo", name: "Лео" },
  { id: "jungle", name: "Джунгли" },
] as const;
export type CardDesign = typeof cardDesigns[number]["id"];
export function readCardDesign(): CardDesign {
  try {
    const saved = localStorage.getItem("evoca-card-design");
    if (cardDesigns.some(d => d.id === saved)) return saved as CardDesign;
  } catch { /* Storage can be unavailable in private previews. */ }
  return "space";
}
export default function CardVisual({ design }: { design: CardDesign }) {
  const card = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = card.current;
    if (!element) return;
    // Scale the same shadow with the card in every scene. The flight scales
    // its entire 171px surface, so both endpoints match at the handoff.
    const update = () => {
      const unit = element.offsetWidth / 171;
      element.style.boxShadow = `0 ${8 * unit}px ${18 * unit}px ${-7 * unit}px #44265e44`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={card}
    className={`bank-card card-design-${design}`}
    style={{ borderRadius: 13 }}
  >
    <span className="card-decoration" aria-hidden="true">
      {design === "leo" && <img src={leoConfig.poster} alt="" />}
      {design === "jungle" && <><i /><i /><i /></>}
    </span>
    <span className="card-brand">Evoca TEENZ</span>
    <span className="card-number">•• 1112</span>
    <span className="card-chip"><img src="/assets/card-chip.png" alt="" /></span>
    <img className="card-network" src="/assets/mastercard.svg" alt="Mastercard" />
  </div>;
}
