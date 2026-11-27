import type { ChapterBundle, SaveState } from '../core/schema.ts'

interface DualHudProps {
  bundle: ChapterBundle
  save: SaveState
  audioOn: boolean
  onToggleAudio: () => void
  onReset: () => void
  onInspectResource: (resId: string) => void
  onOpenArchive: () => void
}

export function DualHud({
  bundle,
  save,
  audioOn,
  onToggleAudio,
  onReset,
  onInspectResource,
  onOpenArchive,
}: DualHudProps) {
  return (
    <header className="cc-hud">
      <div className="cc-hud-row1">
        <div className="cc-res-grid">
          {bundle.resources.map((spec) => {
            const val = save.resources[spec.id] ?? 0
            const isCrit = val <= spec.collapseAt
            const isWarn = !isCrit && val <= spec.warnAt
            const showFake = spec.id === 'troops' && save.fakeBadge.show

            return (
              <button
                key={spec.id}
                type="button"
                className={`cc-res-box${isCrit ? ' is-crit' : isWarn ? ' is-warn' : ''}`}
                onClick={() => onInspectResource(spec.id)}
              >
                {showFake && <span className="cc-fake-badge">{save.fakeBadge.label}</span>}
                <div className="cc-res-top">
                  <span className="cc-res-name">
                    {spec.label}
                    {isCrit ? (
                      <span className="cc-res-tag">红线</span>
                    ) : isWarn ? (
                      <span className="cc-res-tag">告急</span>
                    ) : null}
                  </span>
                  <span className="cc-res-val">{val}</span>
                </div>
                <div className="cc-res-bars" aria-hidden="true">
                  {Array.from({ length: spec.max }).map((_, idx) => (
                    <span key={idx} className={`cc-res-seg${idx < val ? ' on' : ''}`} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          className={`cc-hud-btn${audioOn ? ' is-on' : ''}`}
          onClick={onToggleAudio}
          aria-label={audioOn ? '关闭声音' : '开启声音'}
          title={bundle.theme.bgmLabel}
        >
          {audioOn ? '音' : '静'}
        </button>
        <button
          type="button"
          className="cc-hud-btn"
          onClick={onOpenArchive}
          aria-label="打开案牍与词典"
          title="案牍与词典"
        >
          卷
        </button>
        <button
          type="button"
          className="cc-hud-btn"
          onClick={onReset}
          aria-label="重开本局"
          title="重开"
        >
          重
        </button>
      </div>

      {bundle.deadlines.map((dl) => {
        const val = save.deadlines[dl.id] ?? 0
        const urgent = val >= dl.warnAt
        return (
          <div key={dl.id} className={`cc-dl-row${urgent ? ' is-urgent' : ''}`}>
            <span className="cc-dl-label">
              死线 · <strong>{dl.label}</strong>
            </span>
            <div className="cc-dl-track" aria-hidden="true">
              {Array.from({ length: dl.max }).map((_, i) => (
                <span
                  key={i}
                  className={`cc-dl-pip${i < val ? (urgent ? ' danger' : ' filled') : ''}`}
                />
              ))}
            </div>
            <span className="cc-dl-num">
              {val}/{dl.max}
            </span>
          </div>
        )
      })}
    </header>
  )
}
