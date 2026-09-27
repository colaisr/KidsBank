import {useLayoutEffect} from 'react';
import {smoothCorners} from './useSmoothCorners';

// Explicit surface families. Circles, inputs, maps, chat bubbles and sheets keep
// their own silhouettes; already-smoothed home components are left alone.
const surfaces = [
  '.feature-panel', '.activity-list', '.task-stat', '.feature-two>button',
  '.parent-service', '.parent-panel', '.parent-goal-card', '.parent-goal-catalog',
  '.parent-account-summary', '.parent-pending-summary',
  '.amount-panel', '.phone-number', '.transfer-recipients', '.transfer-amount-card',
].join(',');
const outlinedControls = [
  '.feature-secondary:not(.ui-cancel)', '.parent-secondary:not(.ui-cancel)',
  '.task-ideas button', '.goal-icon-options button', '.cash-limit button',
  '.map-zoom button', '.parent-add-recipient', '.scanner-guidance button', '.approve-task',
  '.camera-demo', '.feature-body .history-more',
].join(',');
// Filled actions and segmented choices share the same curve as the tiles.
// Circular navigation controls and capsule chips already have continuous ends.
const filledControls = [
  '.feature-primary', '.parent-primary', '.payment-cta', '.design-done',
  '.parent-account-transfer', '.parent-pending-action',
  '.parent-segmented button', '.leo-actions button', '.feature-pet-actions button',
  '.scanner-sheet-actions button', '.ui-cancel',
].join(',');
const candidatesSelector = `${surfaces},${outlinedControls},${filledControls}`;

export default function SmoothSurfaces() {
  useLayoutEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    const cleanups = new Map<HTMLElement, () => void>();
    const register = (node: Element) => {
      const candidates = [...node.querySelectorAll<HTMLElement>(candidatesSelector)];
      if (node.matches(candidatesSelector)) candidates.push(node as HTMLElement);
      for (const element of candidates) {
        if (cleanups.has(element)) continue;
        const cleanup = smoothCorners(element, element.matches(outlinedControls));
        if (cleanup) cleanups.set(element, cleanup);
      }
    };
    register(root);
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node instanceof Element) register(node);
      }
      for (const [element, cleanup] of cleanups) if (!root.contains(element)) {
        cleanup(); cleanups.delete(element);
      }
    });
    observer.observe(root, {childList:true, subtree:true});
    return () => {observer.disconnect(); cleanups.forEach(cleanup => cleanup());};
  }, []);
  return null;
}
