import { useLayoutEffect, useRef } from "react";
import { usePreferences } from "../context/PreferencesContext";
import { readDesignerCardDesign } from './designerCardSkin';
import { leoConfigForBank } from './leoConfig';
import { useDesignerChildT } from "./useDesignerChildT";

export const cardDesigns = [
  { id: "ocean" },
  { id: "space" },
  { id: "leo" },
  { id: "jungle" },
] as const;
export type CardDesign = typeof cardDesigns[number]["id"];

export function designerCardSkinLabelKey(
  bank: "amio" | "evoca",
  designId: CardDesign,
): string {
  return `cardDesign.skins.${bank}.${designId}`;
}
export function readCardDesign(): CardDesign {
  return readDesignerCardDesign();
}
export default function CardVisual({ design }: { design: CardDesign }) {
  const { bank } = usePreferences();
  const { t } = useDesignerChildT();
  const card = useRef<HTMLDivElement>(null);
  const brandLabel = t(`cardDesign.productLabel.${bank}`);
  const leo = leoConfigForBank(bank);
  const shadowTint = bank === "amio" ? "#086f8344" : "#44265e44";
  useLayoutEffect(() => {
    const element = card.current;
    if (!element) return;
    // Scale the same shadow with the card in every scene. The flight scales
    // its entire 171px surface, so both endpoints match at the handoff.
    const update = () => {
      const unit = element.offsetWidth / 171;
      element.style.boxShadow = `0 ${8 * unit}px ${18 * unit}px ${-7 * unit}px ${shadowTint}`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [shadowTint]);
  return <div ref={card}
    className={`bank-card card-design-${design}`}
    style={{ borderRadius: 13 }}
  >
    <span className="card-decoration" aria-hidden="true">
      {design === "leo" && <img className="brand-raster-art" src={leo.poster} alt="" />}
      {design === "jungle" && <><i /><i /><i /></>}
    </span>
    <span className="card-brand">{brandLabel}</span>
    <span className="card-number">•• 1112</span>
    <span className="card-chip"><img src="/assets/card-chip.png" alt="" /></span>
    <img className="card-network" src="/assets/mastercard.svg" alt="Mastercard" />
  </div>;
}
