import {Component,Suspense,lazy,useEffect,useState,type ReactNode} from "react";
import type { Bank } from "../context/preferences";
import { designerBrandPalette } from "./designerBrand";

const MeshGradient = lazy(() =>
  import("@paper-design/shaders-react").then((module) => ({
    default: module.MeshGradient,
  })),
);
class BackgroundBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function AmbientBackground({
  active,
  paused = false,
  bank = 'evoca',
}: {
  active: boolean;
  paused?: boolean;
  bank?: Bank;
}) {
  const palette = designerBrandPalette(bank);
  const ambientColors = [palette.dark, palette.base, palette.light, palette.soft];
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!active) {
      setEnabled(false);
      return;
    }
    // Keep the current canvas when a sheet covers the page.
    if (paused) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(active && !preference.matches && !document.hidden);
    // Keep WebGL compilation out of the initial entrance animation.
    const start = window.setTimeout(update, 900);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(start);
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [active, paused]);
  return (
    <div className="ambient" aria-hidden="true">
      {enabled && (
        <BackgroundBoundary>
          <Suspense fallback={null}>
            <MeshGradient
              className="ambient-mesh"
              colors={ambientColors}
              speed={paused ? 0 : 0.48}
              distortion={0.45}
              swirl={0.22}
              grainMixer={0}
              grainOverlay={0}
              maxPixelCount={180000}
            />
          </Suspense>
        </BackgroundBoundary>
      )}
      <div className="ambient-wash" />
    </div>
  );
}
