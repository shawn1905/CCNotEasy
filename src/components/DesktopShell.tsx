import type { ReactNode } from 'react'

type Props = {
  title?: string
  subtitle?: string
  trailing?: ReactNode
  children: ReactNode
  /** tighter padding for title screen */
  compact?: boolean
}

/** Omarchy-like: wallpaper desktop + frosted terminal/window console */
export function DesktopShell({
  title = 'ccnoteasy',
  subtitle,
  trailing,
  children,
  compact,
}: Props) {
  return (
    <div className="desktop-root" data-theme="tokyo-night">
      <div className="desktop-wallpaper" aria-hidden="true">
        <div className="desktop-wallpaper__dusk" />
        <div className="desktop-wallpaper__grid" />
        <div className="desktop-wallpaper__scan" />
        <div className="desktop-wallpaper__vignette" />
      </div>

      <div className={`desktop-stage ${compact ? 'desktop-stage--compact' : ''}`}>
        <div className="console-window">
          <div className="console-titlebar">
            <div className="console-traffic" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="console-title">
              <span className="font-mono-ui">{title}</span>
              {subtitle ? (
                <span className="console-title__sub font-mono-ui">{subtitle}</span>
              ) : null}
            </div>
            <div className="console-trailing">{trailing}</div>
          </div>
          <div className="console-body">{children}</div>
        </div>
      </div>
    </div>
  )
}
