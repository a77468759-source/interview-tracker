import { ArrowRight, CheckCircle2 } from 'lucide-react'

function ProgressCard({ progress, expanded = false, onNavigate }) {
  return (
    <article className={`panel progress-card ${expanded ? 'progress-card-expanded' : ''}`}>
      <div className="panel-heading progress-heading">
        <div>
          <span className="card-kicker">{expanded ? 'YOUR JOURNEY SO FAR' : 'OVERALL PROGRESS'}</span>
          <h2>{expanded ? 'Progress at a glance' : 'Your progress'}</h2>
        </div>
        {expanded && <span className="progress-check"><CheckCircle2 size={18} /></span>}
      </div>
      <div className="progress-summary">
        <strong>{progress.percentage}<span>%</span></strong>
        <span className="progress-caption">completed</span>
      </div>
      <div
        aria-label={`${progress.percentage}% of questions completed`}
        className="progress-track progress-track-large"
        role="progressbar"
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={progress.percentage}
      >
        <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
      </div>
      <div className="progress-meta">
        <span>{progress.completed} of {progress.total} questions completed</span>
        <span>{progress.remaining} to go</span>
      </div>
      {expanded && (
        <div className="progress-insight">
          <div className="insight-icon"><CheckCircle2 size={18} /></div>
          <div><strong>Consistency is your superpower</strong><span>Track a little progress each day to keep your momentum up.</span></div>
        </div>
      )}
      {onNavigate && <button className="text-link progress-link" onClick={onNavigate} type="button">See your progress <ArrowRight size={15} /></button>}
    </article>
  )
}

export default ProgressCard
