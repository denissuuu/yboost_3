import { useState } from 'react'

const sizes = { sm: 'text-base gap-0.5', md: 'text-xl gap-1', lg: 'text-3xl gap-1' }

export default function RatingStars({ score, readonly = false, size = 'md', onRate }) {
  const [hover, setHover] = useState(0)
  const display = hover || Math.round(score || 0)

  return (
    <div className={`flex items-center ${sizes[size]}`} aria-label={`Note: ${score ?? 'aucune'}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`transition-colors select-none ${n <= display ? 'text-amber-400' : 'text-zinc-700'} ${!readonly ? 'cursor-pointer hover:scale-110' : ''}`}
          onClick={() => !readonly && onRate?.(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
      {score != null && (
        <span className="text-xs text-zinc-500 ml-1 font-medium">{Number(score).toFixed(1)}</span>
      )}
    </div>
  )
}
