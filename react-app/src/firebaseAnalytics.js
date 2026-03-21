import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const hasConfig = Object.values(firebaseConfig).every(Boolean)
let analyticsInstance = null
const pendingEvents = []

export const initializeFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null
  if (!hasConfig) {
    if (import.meta.env.DEV) {
      // Helps debug local setup without exposing config values.
      // eslint-disable-next-line no-console
      console.warn('Firebase Analytics not initialized: missing VITE_FIREBASE_* values.')
    }
    return null
  }

  const supported = await isSupported()
  if (!supported) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Firebase Analytics is not supported in this browser context.')
    }
    return null
  }

  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  analyticsInstance = analytics

  // Emit one explicit page_view so verification is easier in DebugView/Realtime.
  logEvent(analytics, 'page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  })

  while (pendingEvents.length > 0) {
    const next = pendingEvents.shift()
    try {
      logEvent(analytics, next.eventName, next.params)
    } catch (_) {
      // Ignore individual event failures.
    }
  }

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('Firebase Analytics initialized.')
  }

  return analytics
}

export const trackAnalyticsEvent = (eventName, params = {}) => {
  if (!analyticsInstance) {
    pendingEvents.push({ eventName, params })
    return
  }
  try {
    logEvent(analyticsInstance, eventName, params)
  } catch (_) {
    // Keep UI resilient if analytics fails.
  }
}
