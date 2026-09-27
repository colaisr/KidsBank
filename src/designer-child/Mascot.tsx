import type {LionEmotion} from './lionEmotions';
import { useEffect, useRef, useState } from "react";
import { useTapFeedback } from "./Feedback";
import { leoConfig } from './leoConfig';

type LionElement = HTMLElement & {
  ready: Promise<void>;
  video: HTMLVideoElement;
  pause(): void;
  play(): Promise<void>;
  loadEmotion(): Promise<void>;
};
let runtime: Promise<void> | undefined;
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error(`Could not load ${src}`));
    };
    document.head.append(script);
  });
}
function loadRuntime() {
  return (runtime ??= (async () => {
    await loadScript("/assets/lion-assets.js");
    if (!customElements.get("lion-mascot"))
      await loadScript("/assets/lion-mascot.js");
  })().catch((error) => {
    runtime = undefined;
    throw error;
  }));
}
export default function Mascot({active=true,emotion,reaction=0,onInteract}:{active?:boolean;emotion?:LionEmotion;reaction?:number;onInteract?:()=>void}={}) {
  const tap = useTapFeedback();
  const host = useRef<HTMLSpanElement>(null);
  const lion = useRef<LionElement | null>(null);
  const autoplayBlocked = useRef(false);
  const pendingEmotions = useRef<LionEmotion[]>([]);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPaused(preference.matches);
    preference.addEventListener("change", update);
  return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let cancelled = false;
    let element: LionElement | undefined;
    void loadRuntime()
      .then(() => {
        if (cancelled || !host.current) return;
        element = document.createElement("lion-mascot") as LionElement;
        element.setAttribute("color", leoConfig.maneColor);
        element.setAttribute("emotion", "wink");
        element.video.loop = false;
        element.addEventListener("cycleend", () => {
          if (cancelled || !element || element.hasAttribute("paused")) return;
          const next = pendingEmotions.current.shift() ?? "wink";
          // Finish the current performance before starting the next request.
          if (element.getAttribute("emotion") !== next) element.setAttribute("emotion", next);
          else element.video.currentTime = 0;
          void element.play();
        });
        element.setAttribute("size", "100");
        element.setAttribute("aria-hidden", "true");
        element.setAttribute("paused", "");
        element.addEventListener("renderready", () => {
          if (!cancelled) setReady(true);
        });
        element.addEventListener("rendererror", () => {
          if (!cancelled) setReady(false);
        });
        element.addEventListener("mediaerror", () => {
          // The rendered poster stays available; a later action can retry media.
          pendingEmotions.current = [];
        });
        element.addEventListener("playblocked", () => {
          if (!cancelled) { autoplayBlocked.current = true; setPaused(true); }
        });
        host.current.append(element);
        lion.current = element;
      })
      .catch(() => {
        /* The exported purple poster remains visible. */
      });
  return () => {
      cancelled = true;
      element?.remove();
      lion.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready || !lion.current) return;
    if (paused || !active) { pendingEmotions.current = []; lion.current.setAttribute("paused", ""); }
    else lion.current.removeAttribute("paused");
  }, [active, paused, ready]);
  useEffect(() => {
    const retry = (event: Event) => {
      if (!active || !autoplayBlocked.current || !lion.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (event.target instanceof Element && event.target.closest(".mascot")) return;
      autoplayBlocked.current = false;
      lion.current.removeAttribute("paused");
      void lion.current.play();
      setPaused(false);
    };
    document.addEventListener("pointerup", retry);
    document.addEventListener("keydown", retry);
  return () => {
      document.removeEventListener("pointerup", retry);
      document.removeEventListener("keydown", retry);
    };
  }, [active]);
  useEffect(() => {
    const element = lion.current;
    if (!active || !ready || !emotion || !element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && !element.hasAttribute("paused") && !element.video.ended && !element.video.error) {
      // Repeated taps do not rewind a clip; retain distinct requested reactions.
      if ((pendingEmotions.current.at(-1) ?? element.getAttribute("emotion")) !== emotion) pendingEmotions.current.push(emotion);
      return;
    }
    pendingEmotions.current = [];
    if (element.getAttribute("emotion") !== emotion) element.setAttribute("emotion", emotion);
    else if (element.video.error) void element.loadEmotion();
    else if (element.video.ended) element.video.currentTime = 0;
    if (!reduced) {
      autoplayBlocked.current = false;
      element.removeAttribute("paused");
      setPaused(false);
      void element.play();
    }
  }, [active, emotion, reaction, ready]);
  return (
    <button
      type="button"
      className="mascot pressable"
      data-ready={ready}
      aria-label={
        onInteract ? "Лео" : paused ? "Включить анимацию львёнка" : "Приостановить анимацию львёнка"
      }
      title={onInteract?undefined:paused ? "Включить анимацию" : "Приостановить анимацию"}
      onClick={() => {
        tap();
        if(onInteract){
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
            autoplayBlocked.current = false;
            lion.current?.removeAttribute("paused");
            void lion.current?.play();
            setPaused(false);
          }
          onInteract();return;
        }
        autoplayBlocked.current = false;
        if (paused) {
          lion.current?.removeAttribute("paused");
          void lion.current?.play();
        } else lion.current?.setAttribute("paused", "");
        setPaused(!paused);
      }}
    >
      <img
        className="mascot-poster"
        src={leoConfig.poster}
        alt=""
        width="100"
        height="100"
      />
      <span className="mascot-host" ref={host} />
    </button>
  );
}
