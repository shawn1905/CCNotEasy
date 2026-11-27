import type { ReactNode } from 'react'
import type { ChapterTheme, Mood } from '../core/schema.ts'

interface ThemeShellProps {
  theme: ChapterTheme
  mood: Mood
  children: ReactNode
}

export function ThemeShell({ theme, mood, children }: ThemeShellProps) {
  const bgUrl = `./themes/${theme.themeDir}/${theme.bgFile}`

  return (
    <div className="cc-viewport">
      <main className="cc-shell" data-theme={theme.preset} data-mood={mood}>
        <div
          className="cc-bg-art"
          aria-hidden="true"
          style={{
            backgroundImage: `url("${bgUrl}")`,
            opacity: mood === 'fire' ? Math.min(0.62, (theme.bgOpacity ?? 0.44) + 0.12) : (theme.bgOpacity ?? 0.44),
          }}
        />
        <div className="cc-atmosphere" aria-hidden="true" />
        <div className="cc-layer">{children}</div>
      </main>
    </div>
  )
}
