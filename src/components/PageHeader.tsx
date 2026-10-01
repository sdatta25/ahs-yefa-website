export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-gradient-to-br from-yefa-blue-dark via-yefa-blue to-yefa-blue-light px-5 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-blue-100">{subtitle}</p>}
      </div>
    </div>
  )
}
