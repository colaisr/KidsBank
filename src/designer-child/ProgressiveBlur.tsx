import "./progressive-blur.css";
export default function ProgressiveBlur({ edge = "bottom" }: { edge?: "top" | "bottom" }) { return <div className={`progressive-blur ${edge}-blur`} aria-hidden="true">{Array.from({length:8}, (_, i) => <div key={i} className={`layer blur-${i+1}`} />)}</div>; }
