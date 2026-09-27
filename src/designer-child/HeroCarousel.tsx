import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "motion/react";
import BalanceAmount from "./BalanceAmount";
import CardVisual, { type CardDesign } from "./CardVisual";
import { useTapFeedback } from "./Feedback";
import { useDemo } from "./DemoState";
import { money } from "./data";
import { useDesignerChildT } from "./useDesignerChildT";

export default function HeroCarousel({ design, editing, slide, onSlide, onEdit, onSavings }: {
  design: CardDesign; editing: boolean; slide: number;
  onSlide(index: number): void; onEdit(): void; onSavings(): void;
}) {
  const { state } = useDemo();
  const { t } = useDesignerChildT();
  const viewport = useRef<HTMLDivElement>(null);
  const accountLabels = [t('hero.childCard'), t('hero.piggy')];
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  const tap = useTapFeedback();
  const dragged = useRef(false);
  const startX = useRef(0);
  const [dragging, setDragging] = useState(false);
  function settle(info: PanInfo) {
    if (!dragged.current) return;
    setDragging(false);
    const next = Math.abs(info.offset.x) > width * 0.16 || Math.abs(info.velocity.x) > 280
      ? (info.offset.x < 0 ? 1 : 0) : slide;
    if (next === slide) {
      animate(x, -next * width, reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 });
    } else {
      select(next);
    }
  }
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    setWidth(element.clientWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const animation = animate(x, -slide * width, reduce
      ? { duration: 0 }
      : { type: "spring", stiffness: 320, damping: 34 });
    return () => animation.stop();
  }, [slide, width, reduce, x]);
  function select(index: number) {
    if (index !== slide) tap();
    onSlide(index);
  }
  return <section className="hero hero-carousel" aria-label={t('hero.accounts')} aria-roledescription={t('hero.carousel')}
    onKeyDown={e => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const next = e.key === "ArrowRight" ? 1 : 0;
        select(next);
        (e.currentTarget.querySelectorAll<HTMLButtonElement>(".dot-link")[next])?.focus();
      }
    }}>
    <motion.div className={`hero-viewport ${dragging ? "is-dragging" : ""}`} ref={viewport}
      onPointerDownCapture={() => { dragged.current = false; startX.current = x.get(); x.stop(); }}
      onPan={(_, info) => {
        if (editing) return;
        if (!dragged.current) {
          if (Math.abs(info.offset.x) < 8 || Math.abs(info.offset.y) > Math.abs(info.offset.x)) return;
          dragged.current = true; setDragging(true);
        }
        const raw = startX.current + info.offset.x;
        x.set(raw > 0 ? raw * .12 : raw < -width ? -width + (raw + width) * .12 : raw);
      }}
      onPanEnd={(_, info) => settle(info)}
      onPointerUp={() => {
        if (!dragged.current) animate(x, -slide * width, reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 });
      }}
      onPointerCancel={() => {
        setDragging(false);
        animate(x, -slide * width, reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 });
      }}>
      <motion.div className="hero-track" style={{ x }}>
        <div className="hero-slide" aria-label={t('hero.slideCard')} aria-hidden={slide !== 0} inert={slide !== 0}>
          <div className="hero-art">
            <button className="card-trigger" type="button" aria-label={t('hero.editCardDesign')}
              onClick={() => { if (!dragged.current) { tap(); onEdit(); } }}>
              <CardVisual design={design} />
            </button>
          </div>

        </div>
        <div className="hero-slide" aria-label={t('hero.slidePiggy')} aria-hidden={slide !== 1} inert={slide !== 1}>
          <div className="hero-art"><button type="button" className="savings-trigger" aria-label={t('hero.openPiggy')} onClick={()=>{if(!dragged.current){tap();onSavings()}}}><img className="savings-art" src="/assets/savings-piggy.png" width="168" height="168" alt={t('hero.piggyAlt')} draggable="false" /></button></div>

        </div>
      </motion.div>
    </motion.div>
    <div className="account-summary">
    <h1 className="balance" aria-label={`${money.format(slide === 0 ? state.balance : state.savings)} AMD`}><BalanceAmount value={slide === 0 ? state.balance : state.savings}/></h1>
    <p className="account-label" aria-live="polite">{accountLabels[slide]}</p>
    {slide===1&&<button className="savings-summary-trigger" type="button" aria-label={t('hero.openPiggyAccount')} onClick={()=>{tap();onSavings()}}/>}</div>
    <div className="pagination" aria-label={t('hero.pickAccount')}>
      {accountLabels.map((name, i) => <button key={name} type="button" className="dot-link" aria-label={name} aria-current={slide === i ? "true" : undefined} onClick={() => select(i)}><span className={`dot ${slide === i ? "selected" : ""}`} /></button>)}
    </div>
  </section>;
}
