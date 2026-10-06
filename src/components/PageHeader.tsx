export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-yefa-navy px-5 py-16 text-white">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yefa-blue/25 blur-[90px]" />
      <div className="pointer-events-none absolute -left-16 bottom-[-4rem] h-56 w-56 rounded-full bg-yefa-orange/15 blur-[90px]" />
      <div className="relative mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-slate-300">{subtitle}</p>}
      </div>
    </div>
  )
}
