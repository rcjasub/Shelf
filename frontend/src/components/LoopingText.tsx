export default function LoopingText({ text, className = "" }: { text: string; className?: string }) {
  const chars = text.split("");

  return (
    <span className={className}>
      {chars.map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span className="animate-char-loop" style={{ animationDelay: `${i * 15}ms` }}>
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
