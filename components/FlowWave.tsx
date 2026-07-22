export default function FlowWave({ tone = "light" }: { tone?: "light" | "dark" | "brand" }) {
  return (
    <div className={`flow-wave flow-wave--${tone}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </div>
  );
}
