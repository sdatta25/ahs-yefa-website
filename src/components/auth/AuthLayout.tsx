import type { ReactNode } from "react"

// Sign-in pages: a navy stage with a quiet orbit animation beside (or, on
// phones, above) the form.
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
          {/* Two thin orbits turning slowly around a soft glow. */}
          <svg
            viewBox="0 0 600 600"
            aria-hidden="true"
            className="absolute left-1/2 top-[42%] h-[130%] max-h-[44rem] -translate-x-1/2 -translate-y-1/2"
          >
            <circle cx="300" cy="300" r="70" fill="#2b4fc2" opacity="0.55" className="auth-glow" />
            <g className="auth-orbit">
              <ellipse
                cx="300"
                cy="300"
                rx="230"
                ry="92"
                fill="none"
                stroke="#f0a64d"
                strokeWidth="1.5"
                opacity="0.8"
              />
              <circle cx="530" cy="300" r="7" fill="#f0a64d" />
            </g>
            <g className="auth-orbit auth-orbit-slow">
              <ellipse
                cx="300"
                cy="300"
                rx="170"
                ry="250"
                fill="none"
                stroke="#9db2ff"
                strokeWidth="1.2"
                opacity="0.5"
              />
              <circle cx="300" cy="50" r="5" fill="#9db2ff" />
            </g>
          </svg>
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
