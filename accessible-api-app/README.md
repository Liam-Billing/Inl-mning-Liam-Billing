# Accessible API App

**Namn:** Liam Billing  
**Kurs:** Avancerad frontendutveckling  
**Datum:** 05/09/2025

En liten, responsiv och tillgänglig webbapp som hämtar data från ett externt API (PokéAPI). Appen låter användaren söka efter en Pokémon, visar resultatet i ett enkelt mörkt tema och innehåller tips-knappar och sökhistorik.

## Innehåll
- [Mål och krav](#mål-och-krav)
- [Teknikval](#teknikval)
- [Kom igång](#kom-igång)
- [Struktur](#struktur)
- [Funktioner](#funktioner)
- [Tillgänglighet](#tillgänglighet)
- [Säkerhet](#säkerhet)
- [Responsiv design](#responsiv-design)
- [Testning](#testning)
- [Kända begränsningar](#kända-begränsningar)
- [Reflektion över tekniska val och resultat](#reflektion-över-tekniska-val-och-resultat)
- [Vad jag hade gjort med mer tid](#vad-jag-hade-gjort-med-mer-tid)
- [Bedömningspunkter → check](#bedömningspunkter--check)
- [Exempel på git-commits](#exempel-på-git-commits)

---

## Mål och krav
- Hämta data från **externt API** och visa tydligt.
- **Responsiv** och **tillgänglig** för både desktop och mobil.
- **Grundläggande säkerhet**, t.ex. inputvalidering.
- **Minst ett testfall** för central funktionalitet.
- Lägga in en **reflektion** över tekniska val och resultat.

## Teknikval
- **React + Vite** – snabbt devflöde och enkel struktur.
- **Ren CSS** – mörkt tema, hög kontrast, inga UI-ramverk för att hålla det simpelt.
- **Vitest + Testing Library** – för komponenttester i JSDOM.
- **PokéAPI** – öppet API utan nyckel, enkelt att komma igång med.

## Kom igång
```bash
# installera
npm install

# kör lokalt
npm run dev

# kör tester
npm test


Struktur
accessible-api-app/
├─ index.html
├─ package.json
├─ src/
│  ├─ App.jsx
│  ├─ styles.css
│  ├─ components/
│  │  └─ PokemonCard.jsx
│  ├─ utils/
│  │  └─ validate.js
│  └─ __tests__/
│     └─ app.test.jsx


Reflektion över tekniska val och resultat
Varför React + Vite?
Jag valde React för att hantera UI-state (sökfält, laddning, fel, resultat) och Vite för snabb utveckling. Det gav kort startsträcka och en enkel build utan onödig komplexitet.

Varför ren CSS och mörkt tema?
Målet var en ren, läsbar app utan extra beroenden. Ett mörkt tema med hög kontrast och en enda accentfärg gör att fokus hamnar på innehållet. Mindre styling = enklare underhåll.

Inputvalidering & säkerhet
Jag validerar innan nätverksanrop, så onödig trafik undviks och fel syns snabbt. encodeURIComponent gör att användarens input inte kan förstöra URL:en. Ingen innerHTML används, vilket minskar XSS-risk.

Tillgänglighet
Jag använder tydlig label, aria-live för status/alert, och semantiska regioner. Tanken var att det ska gå att använda med tangentbord och skärmläsare utan speciallösningar. Kontrasten i mörkt läge är medvetet stark.

Felhantering
Appen särskiljer 404 från andra fel och visar tydliga meddelanden. Det förbättrar upplevelsen jämfört med generiska “något gick fel”.

Testning
Jag skrev tre tester som speglar verklig användning: validering, lyckad hämtning och rensa-flödet. Det ger trygghet i kärnfunktionerna och är lätt att köra med npm test.

Resultat
Appen uppfyller kurskraven: externt API, responsiv och tillgänglig design, grundläggande säkerhet, testfall och dokumentation. Jag är nöjd med att lösningen är liten men komplett och fokuserar på det viktiga.


Vad jag hade gjort med mer tid
A11y-verktyg (axe) och tangentbordstestning automatiskt.

Debounce + abort för sökningar och bättre last-hantering.

Error Boundaries och tydligare fel-UI.

TypeScript för säkrare datahantering.

E2E-test med Playwright för hela flödet.

Cache (t.ex. sessionStorage) för nyligen sökta namn.