import './Skeleton.css'

export function SkeletonCard({ height = 320 }) {
  return (
    <div className="sk-card" style={{ height }}>
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line sk-w80" />
        <div className="sk-line sk-w60" />
        <div className="sk-line sk-w40" />
        <div className="sk-btn" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6, height = 320 }) {
  return (
    <div className="sk-grid">
      {Array(count).fill(0).map((_, i) => (
        <SkeletonCard key={i} height={height} />
      ))}
    </div>
  )
}

export function SkeletonPlanCard() {
  return (
    <div className="sk-plan">
      <div className="sk-line sk-w40 sk-center" />
      <div className="sk-price" />
      <div className="sk-line sk-w80" />
      <div className="sk-line sk-w60" />
      <div className="sk-line sk-w70" />
      <div className="sk-line sk-w50" />
      <div className="sk-btn" />
    </div>
  )
}
