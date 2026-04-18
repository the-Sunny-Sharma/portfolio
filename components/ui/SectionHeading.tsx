type Props = {
  index: string
  title: string
  subtitle?: string
  inView?: boolean
}

export default function SectionHeading({ index, title, subtitle, inView = true }: Props) {
  return (
    <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="flex items-center gap-4 mb-2">
        <span className="font-mono text-xs text-cyan/60 tracking-widest">{index} ——</span>
        <h2 className="font-mono text-2xl sm:text-3xl font-bold text-text-primary">{title}</h2>
      </div>
      {subtitle && (
        <p className="font-body text-text-muted text-sm sm:text-base ml-12">{subtitle}</p>
      )}
      <div className="mt-4 ml-12 h-px w-16 bg-gradient-to-r from-cyan to-transparent" />
    </div>
  )
}
