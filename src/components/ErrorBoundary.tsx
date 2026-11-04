import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"

// Catches a render crash in its children so the rest of the page keeps
// working. `fallback` replaces the crashed part (null hides it).
export default class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; resetKey?: string },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Recovered from a crash:", error, info.componentStack)
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    // Navigating to another page clears a page-level crash.
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false })
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
