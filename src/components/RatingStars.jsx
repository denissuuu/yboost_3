import { useState } from 'react'

export default function RatingStars({ score, readonly = false, size = 'md', onRate }) {
  const [hover, setHover] = useState(0)
  const display = hover || Math.round(score || 0)

  return (
    <div className={`stars stars-${size}`} aria-label={`Note: ${score ?? 'aucune'}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star ${n <= display ? 'filled' : ''}`}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
          onClick={() => !readonly && onRate?.(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
      {score != null && <span className="stars-label">{Number(score).toFixed(1)}</span>}
    </div>
  )
}
