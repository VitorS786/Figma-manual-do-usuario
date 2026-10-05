interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
  dark?: boolean
}

export default function Logo({ size = 'md', variant = 'full', dark = false }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const textSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }
  const s = sizes[size]
  const textColor = dark ? '#FFFFFF' : '#3D3830'
  const mutedColor = dark ? 'rgba(255,255,255,0.6)' : '#9C9490'

  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Plate */}
        <circle cx="24" cy="26" r="16" fill="#8B7FC7" opacity="0.15" />
        <circle cx="24" cy="26" r="12" fill="#8B7FC7" opacity="0.25" />
        {/* Fork */}
        <path d="M16 10 L16 20 Q16 22 18 22 L18 38" stroke="#8B7FC7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 10 L16 15" stroke="#8B7FC7" strokeWidth="2" strokeLinecap="round" />
        <path d="M18.5 10 L18.5 15" stroke="#8B7FC7" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 10 L21 15" stroke="#8B7FC7" strokeWidth="2" strokeLinecap="round" />
        {/* Knife */}
        <path d="M30 10 Q34 14 32 20 L32 38" stroke="#7E9478" strokeWidth="2.5" strokeLinecap="round" />
        {/* Tablet hint */}
        <rect x="19" y="22" width="10" height="8" rx="1.5" fill="#8B7FC7" opacity="0.5" />
      </svg>

      {variant === 'full' && (
        <div className="leading-none">
          <span className={`${textSizes[size]} font-800 tracking-tight`} style={{ color: textColor }}>
            Tab<span style={{ color: '#8B7FC7' }}>Mesa</span>
          </span>
          {size === 'lg' && (
            <p className="text-xs font-500 mt-0.5" style={{ color: mutedColor }}>
              Sistema de Restaurante
            </p>
          )}
        </div>
      )}
    </div>
  )
}
