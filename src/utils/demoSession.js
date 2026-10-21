const SESSION_KEY = 'preptrack.demo-session.v1'

export function getDemoSession() {
  try {
    const saved = window.sessionStorage.getItem(SESSION_KEY)
    if (!saved) return null
    const session = JSON.parse(saved)
    return typeof session?.email === 'string' && typeof session?.name === 'string'
      ? session
      : null
  } catch (error) {
    console.warn('PrepTrack could not read the demo session.', error)
    return null
  }
}

export function saveDemoSession(session) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearDemoSession() {
  window.sessionStorage.removeItem(SESSION_KEY)
}
