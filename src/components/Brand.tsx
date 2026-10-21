import wordmark from './wordmark.json'

/** The proposed concept wordmark, outlined from Fraunces and Manrope (scripts/make-brand.py). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg className={`wordmark ${className ?? ''}`} viewBox={wordmark.viewBox} aria-hidden="true" focusable="false">
      <g transform="translate(0 1)">
        <path className="wordmark__plate" fillRule="evenodd" d={wordmark.plate} />
        <path className="wordmark__leaf" d={wordmark.leaf} />
        <path className="wordmark__vein" d={wordmark.vein} />
      </g>
      <path className="wordmark__name" d={wordmark.name} />
      <path className="wordmark__sub" d={wordmark.sub} />
    </svg>
  )
}
