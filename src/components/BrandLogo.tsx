const SIZES = {
  sm: { gap: "gap-2.5", crest: "h-8", word: "h-5" },
  lg: { gap: "gap-5", crest: "h-16 sm:h-20", word: "h-10 sm:h-12" },
}

export default function BrandLogo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const s = SIZES[size]
  return (
    <div className={`inline-flex items-center ${s.gap}`}>
      <img src="/images/ahs-crest.png" alt="Alpharetta High School" className={`${s.crest} w-auto`} />
      <img src="/images/yefa-wordmark.png" alt="YEFA" className={`${s.word} w-auto`} />
      <span className="text-sm font-semibold text-yefa-ink" aria-label="and">X</span>
      <img src="/images/partner-yei.png" alt="Youth Economics Initiative" className={`${s.crest} w-auto`} />
    </div>
  )
}
