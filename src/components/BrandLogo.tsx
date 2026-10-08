const SIZES = {
  sm: { pad: "px-2.5 py-1.5", gap: "gap-2.5", crest: "h-7", divider: "h-6", word: "h-5" },
  lg: { pad: "px-7 py-5", gap: "gap-5", crest: "h-16 sm:h-20", divider: "h-14 sm:h-16", word: "h-10 sm:h-12" },
}

export default function BrandLogo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = SIZES[size]
  return (
    <div className={`inline-flex items-center rounded-2xl bg-white ${s.pad} ${s.gap} shadow-sm ring-1 ring-slate-200/70`}>
      <img src="/images/ahs-crest.png" alt="Alpharetta High School" className={`${s.crest} w-auto`} />
      <span className={`${s.divider} w-px bg-slate-200`} />
      <img src="/images/yefa-wordmark.png" alt="YEFA" className={`${s.word} w-auto`} />
    </div>
  )
}
