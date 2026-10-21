import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownUp,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Code2,
  Flame,
  Plus,
  Search,
  Target,
  TrendingUp,
} from 'lucide-react'
import './App.css'
import AuthPage from './components/AuthPage'
import MobileNavigation from './components/MobileNavigation'
import ProgressCard from './components/ProgressCard'
import QuestionForm from './components/QuestionForm'
import QuestionTable from './components/QuestionTable'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import {
  CATEGORIES,
  DIFFICULTIES,
  STATUSES,
  createQuestionId,
  getInitialQuestions,
  getProgress,
  getQuestionStats,
  saveQuestions,
} from './utils/questions'
import { clearDemoSession, getDemoSession, saveDemoSession } from './utils/demoSession'

const emptyFilters = { search: '', category: 'All categories', status: 'All statuses', difficulty: 'All difficulties', sort: 'newest' }

function App() {
  const [questions, setQuestions] = useState(getInitialQuestions)
  const [user, setUser] = useState(getDemoSession)
  const [authMode, setAuthMode] = useState('login')
  const [activeSection, setActiveSection] = useState('Dashboard')
  const [filters, setFilters] = useState(emptyFilters)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notice, setNotice] = useState(null)
  const [storageError, setStorageError] = useState(false)
  const [todayLabel] = useState(() => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase())

  const commitQuestions = (nextQuestions) => {
    setQuestions(nextQuestions)
    try {
      saveQuestions(nextQuestions)
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const stats = useMemo(() => getQuestionStats(questions), [questions])
  const progress = useMemo(() => getProgress(questions), [questions])
  const filteredQuestions = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()
    const matches = questions.filter((question) => {
      const matchesSearch = !searchTerm || [question.title, question.category, question.notes]
        .some((value) => value.toLowerCase().includes(searchTerm))
      return matchesSearch
        && (filters.category === 'All categories' || question.category === filters.category)
        && (filters.status === 'All statuses' || question.status === filters.status)
        && (filters.difficulty === 'All difficulties' || question.difficulty === filters.difficulty)
    })

    return matches.sort((first, second) => {
      if (filters.sort === 'title') return first.title.localeCompare(second.title)
      if (filters.sort === 'difficulty') return DIFFICULTIES.indexOf(first.difficulty) - DIFFICULTIES.indexOf(second.difficulty)
      return new Date(second.updatedAt || second.createdAt) - new Date(first.updatedAt || first.createdAt)
    })
  }, [filters, questions])

  const openCreateForm = () => {
    setEditingQuestion(null)
    setIsFormOpen(true)
  }

  const openEditForm = (question) => {
    setEditingQuestion(question)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingQuestion(null)
  }

  const handleSaveQuestion = (values) => {
    const normalizedTitle = values.title.trim().toLowerCase()
    const duplicate = questions.some((question) => (
      question.id !== editingQuestion?.id
      && question.title.trim().toLowerCase() === normalizedTitle
    ))

    if (duplicate) {
      return { error: 'A question with this title already exists.' }
    }

    const now = new Date().toISOString()
    if (editingQuestion) {
      commitQuestions(questions.map((question) => (
        question.id === editingQuestion.id
          ? { ...question, ...values, title: values.title.trim(), updatedAt: now }
          : question
      )))
      setNotice({ type: 'success', message: 'Question updated successfully.' })
    } else {
      commitQuestions([
        { ...values, title: values.title.trim(), id: createQuestionId(), createdAt: now, updatedAt: now },
        ...questions,
      ])
      setNotice({ type: 'success', message: 'Question added to your tracker.' })
    }
    closeForm()
    return { error: null }
  }

  const handleDeleteQuestion = (question) => {
    if (!window.confirm(`Delete "${question.title}"? This action cannot be undone.`)) return
    commitQuestions(questions.filter((item) => item.id !== question.id))
    setNotice({ type: 'success', message: 'Question deleted.' })
  }

  const handleStatusChange = (question, status) => {
    commitQuestions(questions.map((item) => (
      item.id === question.id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    )))
  }

  const handleAuthSubmit = (profile) => {
    const nextUser = {
      name: profile.name || profile.email.split('@')[0],
      email: profile.email,
    }
    try {
      saveDemoSession(nextUser)
      setUser(nextUser)
      setActiveSection('Dashboard')
      setFilters({ ...emptyFilters })
      return { error: null }
    } catch {
      return { error: 'Your browser could not save this demo session. Check session storage and try again.' }
    }
  }

  const handleLogout = () => {
    try {
      clearDemoSession()
      setUser(null)
      setAuthMode('login')
    } catch {
      setNotice({ type: 'error', message: 'Could not end the demo session. Please try again.' })
    }
  }

  const handleNavigate = (section) => {
    setActiveSection(section)
    if (section === 'Question Tracker') {
      window.setTimeout(() => document.getElementById('question-tracker')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    }
  }

  if (!user) {
    return <AuthPage mode={authMode} onModeChange={setAuthMode} onSubmit={handleAuthSubmit} />
  }

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} onLogout={handleLogout} user={user} />
      <div className="main-column">
        <MobileNavigation activeSection={activeSection} onNavigate={handleNavigate} onLogout={handleLogout} />
        <main className="main-content">
          <header className="page-heading">
            <div>
              <div className="eyebrow">{todayLabel}</div>
              <h1>{activeSection === 'Dashboard' ? `Good morning, ${user.name.split(' ')[0]}` : activeSection}</h1>
              <p>{activeSection === 'Dashboard' ? 'A little progress each day adds up to big results.' : sectionSubtitle(activeSection)}</p>
            </div>
            <button aria-label="Add question" className="button button-primary header-add-button" onClick={openCreateForm} type="button">
              <Plus size={17} strokeWidth={2.4} />
              <span>Add question</span>
            </button>
          </header>

          {storageError && (
            <div className="storage-warning" role="alert">
              Your browser could not save changes. Check that LocalStorage is available and try again.
            </div>
          )}

          {activeSection === 'Dashboard' && (
            <>
              <section className="stats-grid" aria-label="Question statistics">
                <StatCard label="Questions tracked" value={stats.total} detail="Across all categories" icon={ClipboardList} iconClass="icon-indigo" />
                <StatCard label="DSA completed" value={stats.completedDsa} detail="Keep sharpening your skills" icon={Code2} iconClass="icon-blue" />
                <StatCard label="Interview answers" value={stats.completedInterview} detail="Behavioral & technical" icon={BookOpenCheck} iconClass="icon-violet" />
                <StatCard label="Machine coding" value={`${stats.completedMachineCoding}/${stats.totalMachineCoding}`} detail="Tasks completed" icon={Target} iconClass="icon-amber" />
              </section>

              <section className="dashboard-main-grid">
                <ProgressCard progress={progress} onNavigate={() => handleNavigate('Progress')} />
                <div className="focus-card">
                  <div className="focus-icon"><Flame size={19} /></div>
                  <span className="card-kicker">YOUR DAILY FOCUS</span>
                  <h2>Build your interview momentum</h2>
                  <p>Small, consistent practice beats last-minute cramming. Pick one question and make today count.</p>
                  <button className="text-link" onClick={() => handleNavigate('Question Tracker')} type="button">
                    Pick a question <ArrowRight size={15} />
                  </button>
                  <div className="focus-decoration" aria-hidden="true"><TrendingUp size={73} /></div>
                </div>
              </section>

              <section className="panel recent-panel" aria-labelledby="recent-title">
                <div className="panel-heading">
                  <div>
                    <span className="card-kicker">YOUR PRACTICE</span>
                    <h2 id="recent-title">Recent questions</h2>
                  </div>
                  <button className="text-link" onClick={() => handleNavigate('Question Tracker')} type="button">
                    View all <ArrowRight size={15} />
                  </button>
                </div>
                <QuestionTable
                  questions={questions.slice(0, 4)}
                  onEdit={openEditForm}
                  onDelete={handleDeleteQuestion}
                  onStatusChange={handleStatusChange}
                  compact
                />
              </section>
            </>
          )}

          {activeSection === 'Question Tracker' && (
            <section className="panel tracker-panel" id="question-tracker" aria-labelledby="tracker-title">
              <div className="panel-heading tracker-heading">
                <div>
                  <span className="card-kicker">STAY ORGANIZED</span>
                  <h2 id="tracker-title">Your question library</h2>
                  <p className="panel-description">Search, filter, and keep your practice moving forward.</p>
                </div>
                <span className="result-count">{filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}</span>
              </div>
              <div className="filter-toolbar">
                <label className="search-field">
                  <Search size={17} aria-hidden="true" />
                  <span className="sr-only">Search title, category, or notes</span>
                  <input
                    onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                    placeholder="Search questions..."
                    value={filters.search}
                  />
                </label>
                <label className="filter-select">
                  <span className="sr-only">Filter by category</span>
                  <select onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))} value={filters.category}>
                    <option>All categories</option>
                    {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label className="filter-select">
                  <span className="sr-only">Filter by status</span>
                  <select onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} value={filters.status}>
                    <option>All statuses</option>
                    {STATUSES.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <label className="filter-select">
                  <span className="sr-only">Filter by difficulty</span>
                  <select onChange={(event) => setFilters((current) => ({ ...current, difficulty: event.target.value }))} value={filters.difficulty}>
                    <option>All difficulties</option>
                    {DIFFICULTIES.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
                  </select>
                </label>
                <label className="filter-select sort-select">
                  <ArrowDownUp size={15} aria-hidden="true" />
                  <span className="sr-only">Sort questions</span>
                  <select onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} value={filters.sort}>
                    <option value="newest">Newest first</option>
                    <option value="title">Title A–Z</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </label>
                <button aria-label="Reset all search and filters" className="button button-quiet reset-button" onClick={() => setFilters({ ...emptyFilters })} type="button">
                  Reset filters
                </button>
              </div>
              <QuestionTable
                questions={filteredQuestions}
                onEdit={openEditForm}
                onDelete={handleDeleteQuestion}
                onStatusChange={handleStatusChange}
              />
            </section>
          )}

          {activeSection === 'Progress' && (
            <section className="progress-page">
              <ProgressCard progress={progress} expanded />
              <div className="panel category-panel">
                <div className="panel-heading">
                  <div>
                    <span className="card-kicker">BY CATEGORY</span>
                    <h2>Practice breakdown</h2>
                  </div>
                </div>
                <div className="category-progress-list">
                  {CATEGORIES.map((category) => {
                    const categoryQuestions = questions.filter((question) => question.category === category)
                    const completed = categoryQuestions.filter((question) => question.status === 'Completed').length
                    const percent = categoryQuestions.length ? Math.round((completed / categoryQuestions.length) * 100) : 0
                    return (
                      <div className="category-progress" key={category}>
                        <div className="category-progress-heading">
                          <span>{category}</span>
                          <span>{completed} / {categoryQuestions.length}</span>
                        </div>
                        <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="progress-tip"><CheckCircle2 size={19} /><span><strong>Keep going.</strong> Every completed question brings you one step closer to interview-ready.</span></div>
            </section>
          )}

          <footer className="page-footer">
            <span>Made for your next big opportunity.</span>
            <span><CircleHelp size={14} /> Your data is saved in this browser only.</span>
          </footer>
        </main>
      </div>

      {isFormOpen && (
        <QuestionForm
          initialQuestion={editingQuestion}
          onClose={closeForm}
          onSubmit={handleSaveQuestion}
        />
      )}
      {notice && <div className={`toast toast-${notice.type}`} role="status"><Check size={16} />{notice.message}</div>}
    </div>
  )
}

function sectionSubtitle(section) {
  if (section === 'Question Tracker') return 'Your personal space to track every step of interview prep.'
  return 'See how far you have come and what to practice next.'
}

export default App
