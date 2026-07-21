export default function NavLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <span>
      {label.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            color: active ? "var(--color-shelf-accent)" : undefined,
            transition: "color 0.35s ease",
            transitionDelay: `${i * 25}ms`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
