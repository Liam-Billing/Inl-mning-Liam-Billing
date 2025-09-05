import { useEffect, useState } from 'react'
import PokemonCard from './components/PokemonCard.jsx'
import { validatePokemonQuery } from './utils/validate.js'

const SUGGESTIONS = ['pikachu','bulbasaur','charmander','squirtle','eevee','snorlax','gengar','mew','mewtwo','ditto']

export default function App() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('poke_history') || '[]')
      if (Array.isArray(saved)) setHistory(saved)
    } catch {}
  }, [])

  async function fetchPokemon(name) {
    const { valid, message } = validatePokemonQuery(name)
    if (!valid) {
      setError(message)
      setStatus('error')
      return
    }
    setError('')
    setStatus('loading')
    setPokemon(null)

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        if (res.status === 404) throw new Error('Hittade ingen Pokémon med det namnet.')
        throw new Error('Ett oväntat fel uppstod när jag hämtade data.')
      }
      const data = await res.json()
      setPokemon(data)
      setStatus('success')

      setHistory(prev => {
        const next = [name, ...prev.filter(n => n !== name)].slice(0, 8)
        localStorage.setItem('poke_history', JSON.stringify(next))
        return next
      })
    } catch (err) {
      setError(err?.message || 'Något gick fel.')
      setStatus('error')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = q.trim().toLowerCase()
    fetchPokemon(name)
  }

  function pickSuggestion(name) {
    setQ(name)
    fetchPokemon(name)
  }

  // Rensa-knapp: återställ allt så tipsen syns igen
  function clearSearch() {
    setQ('')
    setPokemon(null)
    setError('')
    setStatus('idle')
  }

  // Rensa historik separat (valfritt)
  function clearHistory() {
    setHistory([])
    localStorage.removeItem('poke_history')
  }

  return (
    <div className="container">
      <header className="header" role="banner">
        <div>
          <div className="brand"><span className="gradient-text">Min Pokémon-sök</span></div>
          <div className="tagline">Välj en i tipslistan om du inte kommer på någon</div>
        </div>
        <nav aria-label="Länk">
          <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer">PokéAPI</a>
        </nav>
      </header>

      <main id="main">
        <form className="form" onSubmit={handleSubmit} noValidate>
          <input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sök Pokémon, t.ex. pikachu"
            aria-invalid={!!error}
            aria-describedby="q-help q-error"
            inputMode="search"
            autoCorrect="off"
            autoCapitalize="none"
          />
          <button type="submit" className="btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'Söker…' : 'Sök'}
          </button>
          <button type="button" className="btn secondary" onClick={clearSearch}>
            Rensa
          </button>
          <div id="q-help" className="helper" style={{ gridColumn: '1 / -1' }}>
            Tillåtna tecken: a–z, 0–9, - (max 20).
          </div>
          <div id="q-error" className="error" role="alert" aria-live="assertive" style={{ gridColumn: '1 / -1' }}>
            {error}
          </div>
        </form>

        {q.trim() === '' && (
          <div className="tips" aria-label="Tips på Pokémon">
            <span className="tips-label">Tips:</span>
            {SUGGESTIONS.map((name) => (
              <button key={name} type="button" className="pill" onClick={() => pickSuggestion(name)}>
                {name}
              </button>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="history" aria-label="Senaste sökningar">
            <span className="history-label">Senaste:</span>
            {history.map((name) => (
              <button key={name} type="button" className="pill" onClick={() => pickSuggestion(name)}>
                {name}
              </button>
            ))}
            <button type="button" className="pill" onClick={clearHistory} title="Rensa historik">
              Rensa historik
            </button>
          </div>
        )}

        <div className="status" role="status" aria-live="polite">
          {status === 'idle' && 'Skriv ett namn eller välj ett tips.'}
          {status === 'loading' && 'Hämtar data…'}
          {status === 'error' && error}
          {status === 'success' && pokemon && `Hittade ${pokemon.name}.`}
        </div>

        {pokemon && <PokemonCard pokemon={pokemon} />}
      </main>

      <footer style={{ marginTop: 28, fontSize: '.9rem', color: '#cbd5e1' }}>
        Data från PokéAPI.
      </footer>
    </div>
  )
}
