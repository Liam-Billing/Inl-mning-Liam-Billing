export default function PokemonCard({ pokemon }) {
  const name = pokemon?.name ?? 'okänd'
  const artwork =
    pokemon?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon?.sprites?.front_default || ''
  const types = pokemon?.types?.map((t) => t.type.name) ?? []
  const stats = pokemon?.stats ?? []
  const statMax = 150
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')

  return (
    <article className="card" aria-label={`Kort för ${name}`}>
      <div className="media">
        {artwork ? (
          <img src={artwork} alt={`Bild på ${name}`} loading="lazy" />
        ) : (
          <div className="media-placeholder" aria-hidden="true" />
        )}
      </div>

      <div>
        <h2 className="title">
          <span className="gradient-text">{cap(name)}</span>
          <span className="dex">#{pokemon?.id ?? '—'}</span>
        </h2>

        <div className="badges" aria-label="Typer">
          {types.map((t) => (
            <span key={t} className={`badge type-${t}`}>{t}</span>
          ))}
        </div>

        <div className="stats">
          {stats.slice(0, 4).map((s) => {
            const pct = Math.min(100, Math.round((s.base_stat / statMax) * 100))
            return (
              <div key={s.stat.name} className="stat">
                <div className="stat-row">
                  <span className="stat-name">{s.stat.name}</span>
                  <span className="stat-value" aria-label={`värde ${s.base_stat}`}>{s.base_stat}</span>
                </div>
                <div className="stat-bar" role="progressbar" aria-valuenow={s.base_stat} aria-valuemin={0} aria-valuemax={statMax}>
                  <div className="stat-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </article>
  )
}
