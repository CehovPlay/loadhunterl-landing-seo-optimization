/**
 * Star rating: gray five-star track with a violet fill clipped to the score
 * (the desktop hero trick), shared by the desktop and mobile trust blocks.
 */
export function Stars({ score, className = "" }: { score: number; className?: string }) {
  return (
    <span
      className={`relative inline-flex leading-none tracking-[2px] ${className}`}
      role="img"
      aria-label={`Rated ${score} out of 5`}
    >
      <span className="text-[#c9c9c9]">★★★★★</span>
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden whitespace-nowrap text-[#6f5197]"
        style={{ width: `${(score / 5) * 100}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}
