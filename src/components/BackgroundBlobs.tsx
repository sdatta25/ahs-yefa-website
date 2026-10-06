export default function BackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-yefa-blue/15 blur-[90px]" />
      <div className="absolute -right-16 top-20 h-72 w-72 rounded-full bg-yefa-orange/15 blur-[90px]" />
      <div className="absolute left-1/3 bottom-[-6rem] h-64 w-64 rounded-full bg-yefa-blue-light/20 blur-[100px]" />
    </div>
  )
}
