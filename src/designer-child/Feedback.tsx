import { useSmoothCorners } from "./useSmoothCorners";
import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useWebHaptics } from "web-haptics/react";

const FeedbackContext = createContext<() => void>(() => {});
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const { trigger } = useWebHaptics({ debug: false, showSwitch: true });
  const tap = useCallback(() => {
    void trigger("medium")?.catch(() => {});
    // The native switch stays rendered for Safari, outside keyboard/AT navigation.
    document.querySelectorAll('label[for^="web-haptics-"]').forEach((label) => {
      label.setAttribute("aria-hidden", "true");
      label.querySelector("input")?.setAttribute("tabindex", "-1");
    });
  }, [trigger]);
  return (
    <FeedbackContext.Provider value={tap}>{children}</FeedbackContext.Provider>
  );
}
export function useTapFeedback() {
  return useContext(FeedbackContext);
}
export function Pressable({
  children,
  className,
  label,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  onClick?: () => void;
}) {
  const tap = useTapFeedback();
  const smoothRef = useSmoothCorners<HTMLButtonElement>(className === "quick-action");
  // Preview feedback only. No financial action, navigation, or state mutation.
  return (
    <button
      ref={smoothRef}
      type="button"
      className={`pressable ${className ?? ""}`}
      aria-label={label}
      onClick={() => { tap(); onClick?.(); }}
    >
      {children}
    </button>
  );
}
