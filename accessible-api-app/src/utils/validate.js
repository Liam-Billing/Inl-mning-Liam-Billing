export function validatePokemonQuery(value) {
const trimmed = value.trim().toLowerCase()
if (!trimmed) return { valid: false, message: 'Fältet får inte vara tomt.' }
if (trimmed.length > 20) return { valid: false, message: 'Max 20 tecken.' }
if (!/^[a-z0-9-]+$/.test(trimmed)) {
return { valid: false, message: 'Endast a–z, 0–9 och - tillåts.' }
}
return { valid: true, message: null }
}