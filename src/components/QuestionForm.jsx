import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, STATUSES } from '../utils/questions'

const defaults = { title: '', category: 'DSA', difficulty: 'Medium', status: 'Pending', notes: '' }

function QuestionForm({ initialQuestion, onClose, onSubmit }) {
  const [values, setValues] = useState(initialQuestion || defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateField = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.title.trim()) {
      setError('Please enter a question title.')
      return
    }
    const result = onSubmit(values)
    if (result.error) setError(result.error)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section aria-labelledby="question-form-title" aria-modal="true" className="question-modal" role="dialog">
        <div className="modal-heading">
          <div>
            <span className="card-kicker">{initialQuestion ? 'KEEP YOUR LIBRARY CURRENT' : 'GROW YOUR PRACTICE'}</span>
            <h2 id="question-form-title">{initialQuestion ? 'Edit question' : 'Add a question'}</h2>
            <p>{initialQuestion ? 'Update the details of this practice item.' : 'Save a question or task to practice later.'}</p>
          </div>
          <button aria-label="Close form" className="icon-button modal-close" onClick={onClose} type="button"><X size={19} /></button>
        </div>
        <form className="question-form" onSubmit={handleSubmit}>
          <label className="form-field form-field-full">
            <span>Question or task title <span className="required-mark">*</span></span>
            <input autoFocus maxLength={120} name="title" onChange={updateField} placeholder="e.g. Two Sum" value={values.title} />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>Category</span>
              <select name="category" onChange={updateField} value={values.category}>
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="form-field">
              <span>Difficulty</span>
              <select name="difficulty" onChange={updateField} value={values.difficulty}>
                {['Easy', 'Medium', 'Hard'].map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
              </select>
            </label>
          </div>
          <label className="form-field">
            <span>Status</span>
            <select name="status" onChange={updateField} value={values.status}>
              {STATUSES.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Notes <span className="optional-label">Optional</span></span>
            <textarea maxLength={500} name="notes" onChange={updateField} placeholder="Add a reminder, link, or key concept..." rows={3} value={values.notes} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="button button-secondary" onClick={onClose} type="button">Cancel</button>
            <button className="button button-primary" type="submit">{initialQuestion ? 'Save changes' : 'Add question'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default QuestionForm
