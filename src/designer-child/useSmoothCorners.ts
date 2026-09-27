import { useLayoutEffect, useRef } from "react";
import { getSvgPath } from "figma-squircle";

/** Only measures on resize; never during press transforms or animation frames. */
export function smoothCorners(element: HTMLElement, outlined = false) {
  if (element.dataset.smoothCorners) return;
  const radius = parseFloat(getComputedStyle(element).borderTopLeftRadius);
  if (!radius) return;
  element.dataset.smoothCorners = 'true';
  if (outlined) element.dataset.smoothOutline = 'true';
  const update = () => {
    const style = getComputedStyle(element);
    const width = parseFloat(style.width), height = parseFloat(style.height);
    if (!width || !height) return;
    const path = getSvgPath({ width, height, cornerRadius: radius, cornerSmoothing: 1, preserveSmoothing: true });
    if (outlined) {
      // Clip the painted surface, not the button, so its soft shadow can extend.
      element.style.setProperty('--smooth-fill-path', `path('${path}')`);
      element.style.borderRadius = `${radius}px`;
    } else {
      element.style.clipPath = `path('${path}')`;
      element.style.borderRadius = '0';
    }
    if (outlined) {
      const stroke = 1.5;
      // Native border widths may snap to whole device pixels. Match the actual
      // padding-box inset while keeping the SVG stroke at exactly 1.5 CSS px.
      element.style.setProperty('--smooth-border-inset', `${-parseFloat(style.borderTopWidth)}px`);
      const insetPath = getSvgPath({ width: width - stroke, height: height - stroke, cornerRadius: Math.max(0, radius - stroke / 2), cornerSmoothing: 1, preserveSmoothing: true });
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><path d="${insetPath}" transform="translate(${stroke / 2} ${stroke / 2})" fill="none" stroke="black" stroke-width="${stroke}"/></svg>`;
      element.style.setProperty('--smooth-border-mask', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    }
  };
  update();
  const observer = new ResizeObserver(update);
  observer.observe(element);
  return () => {
    observer.disconnect();
    delete element.dataset.smoothCorners;
    delete element.dataset.smoothOutline;
    element.style.removeProperty('--smooth-border-mask');
    element.style.removeProperty('--smooth-border-inset');
    element.style.removeProperty('--smooth-fill-path');
    element.style.removeProperty('clip-path');
    element.style.removeProperty('border-radius');
  };
}

export function useSmoothCorners<T extends HTMLElement>(enabled = true, outlined = false) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    if (enabled && ref.current) return smoothCorners(ref.current, outlined);
  }, [enabled, outlined]);
  return ref;
}
