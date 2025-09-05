import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import App from '../App.jsx'

describe('App – centrala funktioner', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stoppar ogiltig input och visar felmeddelande', async () => {
    render(<App />)

    await user.type(screen.getByPlaceholderText(/sök pokémon/i), '???')
    await user.click(screen.getByRole('button', { name: /sök/i }))

    // Var specifik: hämta felrutan via ARIA-roll (alert)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/Endast a–z, 0–9 och - tillåts/i)
  })

  it('hämtar och visar Pokémon vid giltig sökning', async () => {
    const fake = {
      id: 25,
      name: 'pikachu',
      sprites: { other: { 'official-artwork': { front_default: '' } } },
      types: [{ type: { name: 'electric' } }],
      stats: [{ base_stat: 35, stat: { name: 'hp' } }],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => fake,
    })

    render(<App />)

    await user.clear(screen.getByPlaceholderText(/sök pokémon/i))
    await user.type(screen.getByPlaceholderText(/sök pokémon/i), 'pikachu')
    await user.click(screen.getByRole('button', { name: /sök/i }))

    expect(
      await screen.findByRole('heading', { name: /pikachu/i })
    ).toBeInTheDocument()
  })

  it('Rensa nollställer och visar tips igen', async () => {
    const fake = {
      id: 25,
      name: 'pikachu',
      sprites: { other: { 'official-artwork': { front_default: '' } } },
      types: [],
      stats: [],
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => fake,
    })

    render(<App />)

    // Tips syns initialt
    expect(screen.getByRole('button', { name: /^pikachu$/i })).toBeInTheDocument()

    // Sök -> visar resultat
    await user.type(screen.getByPlaceholderText(/sök pokémon/i), 'pikachu')
    await user.click(screen.getByRole('button', { name: /sök/i }))
    expect(await screen.findByRole('heading', { name: /pikachu/i })).toBeInTheDocument()

    // Klicka just knappen "Rensa" (inte "Rensa historik")
    await user.click(screen.getByRole('button', { name: /^rensa$/i }))

    // Nu ska tipsen synas igen: kolla specifikt i Tips-rutan (inte i Historik)
    const tipsRegion = await screen.findByLabelText(/Tips på Pokémon/i)
    expect(
      within(tipsRegion).getByRole('button', { name: /^pikachu$/i })
    ).toBeInTheDocument()
  })
})
