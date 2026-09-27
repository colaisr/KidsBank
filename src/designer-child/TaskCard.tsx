import { useSmoothCorners } from "./useSmoothCorners";
import { useEffect, useRef } from "react";
import {
  Clock,
} from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import { useTapFeedback } from "./Feedback";
import { useDemo } from "./DemoState";
import type { Task } from "./data";
import {brandPalette} from "./leoConfig";
import { useDesignerChildT } from "./useDesignerChildT";

export default function TaskCard({ task }: { task: Task }) {
  const { t } = useDesignerChildT();
  const smoothRef = useSmoothCorners<HTMLLabelElement>();
  const { toggleTask } = useDemo();
  const checked = task.status === "waitingParent";
  const canvas = useRef<HTMLCanvasElement>(null);
  const burst = useRef<ReturnType<typeof confetti.create> | null>(null);
  const tap = useTapFeedback();
  useEffect(() => {
    if (!canvas.current) return;
    const instance = confetti.create(canvas.current, {
      resize: true,
      useWorker: false,
      disableForReducedMotion: true,
    });
    burst.current = instance;
    return () => {
      instance.reset();
      burst.current = null;
    };
  }, []);
  function complete() {
    const next = !checked;
    toggleTask(task.id, next);
    tap();
    if (!next) {
      burst.current?.reset();
      return;
    }
    void burst.current?.({
      particleCount: 16,
      spread: 360,
      startVelocity: 6,
      decay: 0.89,
      gravity: 0.12,
      ticks: 30,
      scalar: 0.65,
      flat: true,
      shapes: ["circle", "star"],
      colors: [brandPalette.base, brandPalette.light, brandPalette.soft, "#efc56f"],
      origin: { x: 0.5, y: 0.5 },
      disableForReducedMotion: true,
    });
  }
  return (
    <label ref={smoothRef} className={`task-card task-actionable ${checked ? "waiting" : ""}`}>
      <span className="task-icon task-reward-art">
        {[10,15,25].includes(task.reward) ? <img src={`/assets/reward-${task.reward}.png`} width="54" height="54" alt={t('common.rewardStars', { count: task.reward })} /> : <span className="task-reward-custom" role="img" aria-label={t('common.rewardStars', { count: task.reward })}><img src="/assets/star.png" width="54" height="54" alt=""/><b aria-hidden="true">{task.reward}</b></span>}
      </span>
      <span className="task-copy">
        <span className="task-status" aria-live="polite">
          <Clock size={14} aria-hidden="true" />
          {checked ? t('taskCard.waitingParent') : t('taskCard.dueBy', { time: task.deadline })}
        </span>
        <span className="task-title">{task.title}</span>
      </span>
      <span className="task-end">
        <span className="task-checkbox-wrap">
          <input
            type="checkbox"
            checked={checked}
            onChange={complete}
            aria-label={t('common.taskDone', { title: task.title })}
          />
          <span className="task-checkbox" aria-hidden="true">
            <img className="marker-check" src="/assets/marker-check.png" width="30" height="30" alt="" />
          </span>
          <canvas className="task-confetti" ref={canvas} aria-hidden="true" />
        </span>
      </span>
    </label>
  );
}
