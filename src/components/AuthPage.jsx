import { useState } from 'react'
import { ArrowRight, BookOpenCheck, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'

function AuthPage({ mode, onModeChange, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const isRegister = mode === 'register'

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    if (isRegister && !name.trim()) {
      setError('Enter your name to create your demo profile.')
      return
    }
    if (isRegister && password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }

    const result = onSubmit({ name: name.trim(), email: email.trim() })
    if (result?.error) setError(result.error)
  }

  const switchMode = () => {
    setError('')
    onModeChange(isRegister ? 'login' : 'register')
  }

  return (
    <main className="auth-page">
      <section className="auth-promo" aria-label="PrepTrack introduction">
        <a className="brand auth-brand" href="#home">
          <span className="brand-mark"><BookOpenCheck size={19} strokeWidth={2.2} /></span>
          <span>Prep<span className="brand-accent">Track</span></span>
        </a>
        <div className="auth-promo-content">
          <span className="auth-kicker"><span /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Show up ready<br />for your next<br /><span>big opportunity.</span></h1>
          <p>A calmer, clearer way to keep your interview preparation moving forward.</p>
          <div className="auth-proof">
            <span className="auth-proof-icon"><Check size={15} /></span>
            Track practice across every topic
          </div>
          <div className="auth-proof">
            <span className="auth-proof-icon"><Check size={15} /></span>
            See your progress as it happens
          </div>
        </div>
        <div className="auth-promo-footer">A little progress each day adds up.</div>
        <div className="auth-shape auth-shape-one" aria-hidden="true" />
        <div className="auth-shape auth-shape-two" aria-hidden="true" />
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <div className="auth-card-icon"><BookOpenCheck size={21} /></div>
          <span className="card-kicker">{isRegister ? 'START YOUR PRACTICE' : 'WELCOME BACK'}</span>
          <h2>{isRegister ? 'Create your account' : 'Sign in to PrepTrack'}</h2>
          <p className="auth-subtitle">
            {isRegister ? 'Set up a profile to preview your personal tracker.' : 'Pick up where you left off and keep building momentum.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                <span>Your name</span>
                <span className="auth-input-wrap">
                  <UserRound size={16} aria-hidden="true" />
                  <input autoComplete="name" maxLength={80} onChange={(event) => setName(event.target.value)} placeholder="Aastha" required value={name} />
                </span>
              </label>
            )}
            <label className="auth-field">
              <span>Email address</span>
              <span className="auth-input-wrap">
                <Mail size={16} aria-hidden="true" />
                <input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="aastha@example.com" required type="email" value={email} />
              </span>
            </label>
            <label className="auth-field">
              <span>Password</span>
              <span className="auth-input-wrap">
                <LockKeyhole size={16} aria-hidden="true" />
                <input
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  minLength={isRegister ? 8 : undefined}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isRegister ? 'At least 8 characters' : 'Enter any password'}
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" type="submit">
              {isRegister ? 'Create demo profile' : 'Sign in'}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? 'Already have a profile?' : 'New to PrepTrack?'}
            <button onClick={switchMode} type="button">{isRegister ? 'Sign in' : 'Create an account'}</button>
          </p>
          <div className="auth-demo-note">
            <strong>Demo mode — no backend connected.</strong>
            <span>Use any email and password to preview the app. Passwords are not saved or verified; this is not secure authentication.</span>
          </div>
        </div>
        <p className="auth-footer">Your questions stay in this browser on this device.</p>
      </section>
    </main>
  )
}

export default AuthPage
