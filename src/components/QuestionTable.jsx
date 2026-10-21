import { Check, ChevronDown, Pencil, Trash2 } from 'lucide-react'

function QuestionTable({ questions, onEdit, onDelete, onStatusChange, compact = false }) {
  if (!questions.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Check size={22} /></div>
        <h3>{compact ? 'Your practice starts here' : 'No questions found'}</h3>
        <p>{compact ? 'Add your first question to start building momentum.' : 'Try a different search or adjust your filters.'}</p>
      </div>
    )
  }

  return (
    <>
      <div className={`question-table-wrap ${compact ? 'question-table-compact' : ''}`}>
        <table className="question-table">
          <thead>
            <tr>
              <th scope="col">QUESTION</th>
              <th scope="col">CATEGORY</th>
              <th scope="col">DIFFICULTY</th>
              <th scope="col">STATUS</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id}>
                <td>
                  <div className="question-title-cell">
                    <span className={`question-marker marker-${question.status.toLowerCase().replace(' ', '-')}`} aria-hidden="true">
                      {question.status === 'Completed' ? <Check size={12} strokeWidth={2.6} /> : null}
                    </span>
                    <div>
                      <strong>{question.title}</strong>
                      {question.notes && <span className="question-notes">{question.notes}</span>}
                    </div>
                  </div>
                </td>
                <td><span className={`category-pill category-${question.category.toLowerCase().replace(' ', '-')}`}>{question.category}</span></td>
                <td><span className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}><span />{question.difficulty}</span></td>
                <td>
                  <label className={`status-select status-${question.status.toLowerCase().replace(' ', '-')}`}>
                    <span className="sr-only">Status for {question.title}</span>
                    <select onChange={(event) => onStatusChange(question, event.target.value)} value={question.status}>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                    <ChevronDown size={12} aria-hidden="true" />
                  </label>
                </td>
                <td>
                  <div className="row-actions">
                    <button aria-label={`Edit ${question.title}`} className="icon-button" onClick={() => onEdit(question)} type="button"><Pencil size={15} /></button>
                    <button aria-label={`Delete ${question.title}`} className="icon-button delete-button" onClick={() => onDelete(question)} type="button"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="question-cards">
        {questions.map((question) => (
          <article className="question-mobile-card" key={question.id}>
            <div className="mobile-card-top">
              <span className={`category-pill category-${question.category.toLowerCase().replace(' ', '-')}`}>{question.category}</span>
              <div className="row-actions">
                <button aria-label={`Edit ${question.title}`} className="icon-button" onClick={() => onEdit(question)} type="button"><Pencil size={15} /></button>
                <button aria-label={`Delete ${question.title}`} className="icon-button delete-button" onClick={() => onDelete(question)} type="button"><Trash2 size={15} /></button>
              </div>
            </div>
            <h3>{question.title}</h3>
            {question.notes && <p>{question.notes}</p>}
            <div className="mobile-card-bottom">
              <span className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}><span />{question.difficulty}</span>
              <label className={`status-select status-${question.status.toLowerCase().replace(' ', '-')}`}>
                <span className="sr-only">Status for {question.title}</span>
                <select onChange={(event) => onStatusChange(question, event.target.value)} value={question.status}>
                  <option>Pending</option><option>In Progress</option><option>Completed</option>
                </select>
                <ChevronDown size={12} aria-hidden="true" />
              </label>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default QuestionTable
