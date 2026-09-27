import HeaderBlur from "./HeaderBlur";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useIsPresent } from "motion/react";
import { CaretLeft, Check } from "@phosphor-icons/react";
import CardVisual, { cardDesigns, type CardDesign } from "./CardVisual";
import { useTapFeedback } from "./Feedback";

export default function CardDesignScreen({ selected, busy, onClose }: {
  selected: CardDesign; busy: boolean; onClose(design?: CardDesign): void;
}) {
  const [draft, setDraft] = useState(selected);
  const heading = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const tap = useTapFeedback();
  const present = useIsPresent();
  const contentMotion = {
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : 10 },
    transition: { duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] as const },
  };
  useEffect(() => { if (!busy) heading.current?.focus({ preventScroll: true }); }, [busy]);
  return <motion.section className="design-screen" role="dialog" aria-modal="true" aria-labelledby="design-heading" layoutRoot
    inert={busy}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
    onKeyDown={e => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Tab") {
        const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('button:not([tabindex="-1"])')];
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }}>
    <div className="design-backdrop" />
    <motion.header className="design-header" {...contentMotion}><HeaderBlur/>
      <button type="button" className="design-back pressable" aria-label="Назад без сохранения" onClick={() => { tap(); onClose(); }}><CaretLeft size={21} weight="bold" /></button>
      <h1 id="design-heading" tabIndex={-1} ref={heading}>Дизайн карты</h1>
      <p>Выбери, как будет выглядеть<br />твоя карта</p>
    </motion.header>
    <motion.div className="design-scroll" layoutScroll {...contentMotion}>
      <div className="design-grid" role="radiogroup" aria-label="Дизайн карты">
        {cardDesigns.map((design, i) => <button key={design.id} data-design={design.id} type="button" className={`design-option ${draft === design.id ? "is-selected" : ""}`} role="radio" aria-checked={draft === design.id} aria-label={design.name} tabIndex={draft === design.id ? 0 : -1}
          onClick={() => { tap(); setDraft(design.id); }}
          onKeyDown={e => {
            if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
            e.preventDefault();
            const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? 2 : -2;
            const next = e.key === "Home" ? 0 : e.key === "End" ? 3 : (i + step + 4) % 4;
            setDraft(cardDesigns[next].id); tap();
            (e.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
          }}>
          <div className="design-card-wrap">
            <CardVisual design={design.id} />
            <motion.span initial={false} className="design-check" animate={{ opacity: present && draft === design.id ? 1 : 0, scale: present && draft === design.id ? 1 : 0.85 }} transition={{ duration: reduce ? 0 : 0.16 }}><Check size={16} weight="bold" /></motion.span>
          </div>
          <span className="design-name">{design.name}</span>
        </button>)}
      </div>
    </motion.div>
    <motion.footer className="design-footer" {...contentMotion}>
      <button type="button" className="design-done pressable" onClick={() => { tap(); onClose(draft); }}>Готово</button>
    </motion.footer>
  </motion.section>;
}
