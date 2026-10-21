export const CATEGORIES = ['DSA', 'Git', 'Technical', 'Interview', 'Machine Coding']
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
export const STATUSES = ['Pending', 'In Progress', 'Completed']
export const STORAGE_KEY = 'preptrack.questions.v1'

const sampleQuestions = [
  { id: 'sample-1', title: 'Two Sum', category: 'DSA', difficulty: 'Easy', status: 'Completed', notes: 'Practice the hash map approach.', createdAt: '2026-10-18T10:00:00.000Z' },
  { id: 'sample-2', title: 'Reverse a Linked List', category: 'DSA', difficulty: 'Medium', status: 'In Progress', notes: 'Review iterative and recursive solutions.', createdAt: '2026-10-17T10:00:00.000Z' },
  { id: 'sample-3', title: 'Explain the JavaScript event loop', category: 'Technical', difficulty: 'Medium', status: 'Pending', notes: 'Include microtasks and macrotasks.', createdAt: '2026-10-16T10:00:00.000Z' },
  { id: 'sample-4', title: 'Tell me about a challenging project', category: 'Interview', difficulty: 'Medium', status: 'Completed', notes: 'Use the STAR method.', createdAt: '2026-10-15T10:00:00.000Z' },
  { id: 'sample-5', title: 'Build a searchable dropdown', category: 'Machine Coding', difficulty: 'Hard', status: 'Pending', notes: 'Consider keyboard navigation and accessibility.', createdAt: '2026-10-14T10:00:00.000Z' },
  { id: 'sample-6', title: 'Git rebase vs. merge', category: 'Git', difficulty: 'Easy', status: 'In Progress', notes: '', createdAt: '2026-10-13T10:00:00.000Z' },
]

function isQuestion(value) {
  return value
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && CATEGORIES.includes(value.category)
    && DIFFICULTIES.includes(value.difficulty)
    && STATUSES.includes(value.status)
    && (value.notes === undefined || typeof value.notes === 'string')
}

export function getInitialQuestions() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleQuestions))
      return sampleQuestions
    }
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed)
      ? parsed.filter(isQuestion).map((question) => ({ ...question, notes: question.notes || '' }))
      : []
  } catch (error) {
    console.warn('PrepTrack could not read saved questions.', error)
    return []
  }
}

export function saveQuestions(questions) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
}

export function createQuestionId() {
  return globalThis.crypto?.randomUUID?.() || `question-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getQuestionStats(questions) {
  const completed = questions.filter((question) => question.status === 'Completed')
  const machineCoding = questions.filter((question) => question.category === 'Machine Coding')
  return {
    total: questions.length,
    completedDsa: completed.filter((question) => question.category === 'DSA').length,
    completedInterview: completed.filter((question) => question.category === 'Interview').length,
    completedMachineCoding: machineCoding.filter((question) => question.status === 'Completed').length,
    totalMachineCoding: machineCoding.length,
  }
}

export function getProgress(questions) {
  const completed = questions.filter((question) => question.status === 'Completed').length
  const total = questions.length
  return {
    completed,
    total,
    remaining: total - completed,
    percentage: total ? Math.round((completed / total) * 100) : 0,
  }
}
