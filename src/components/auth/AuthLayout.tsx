import { lazy, Suspense } from "react"
import type { ReactNode } from "react"
import ErrorBoundary from "../ErrorBoundary"

const AuthVisual = lazy(() => import("./AuthVisual"))

// Sign-in pages: the 3D orbit on a deep navy stage beside (or, on phones,
// above) the form. The form never waits for the 3D to load.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-[calc(100svh-3.6rem)] lg:grid-cols-[1.08fr_1fr]">
      <div className="bg-[#070d22]">
        <div
          className="relative isolate h-60 overflow-hidden sm:h-80 lg:sticky lg:top-[3.6rem] lg:h-[calc(100svh-3.6rem)]"
          style={{
            background:
              "radial-gradient(60% 50% at 78% 88%, rgba(226,134,28,0.22), transparent 70%), radial-gradient(120% 90% at 28% 18%, #1c3486 0%, #0f1b3d 46%, #070d22 100%)",
          }}
        >
          <ErrorBoundary>
            <Suspense fallback={null}>
              <AuthVisual />
            </Suspense>
          </ErrorBoundary>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070d22] via-[#070d22]/60 to-transparent px-6 pb-6 pt-24 sm:px-10 sm:pb-10 lg:px-14 lg:pb-14">
            <p className="display-wide text-2xl text-white sm:text-4xl lg:text-5xl">AHS YEFA X YEI</p>
            <p className="mt-2 hidden max-w-sm text-base leading-relaxed text-slate-300 sm:block lg:mt-4 lg:text-lg">
              Economics, finance and investing at Alpharetta High School.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:py-16">
        <div className="auth-rise w-full max-w-[30rem]">{children}</div>
      </div>
    </div>
  )
}
