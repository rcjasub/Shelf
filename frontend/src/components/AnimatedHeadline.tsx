export default function AnimatedHeadline({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span className="animate-word-up" style={{ animationDelay: `${i * 70}ms` }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </span>
  );
}
