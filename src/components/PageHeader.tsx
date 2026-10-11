export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div
      className="relative overflow-hidden border-b border-white/10 bg-yefa-navy px-5 py-16 text-white"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,rgba(54,87,201,0.3),transparent)]" />
      <div className="relative mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-slate-300">{subtitle}</p>}
      </div>
    </div>
  )
}
