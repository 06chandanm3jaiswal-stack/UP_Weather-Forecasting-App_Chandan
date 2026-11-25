# UP Weather Forecast V2
Next.js app covering all 75 Uttar Pradesh districts: current weather, five-day forecast, indicative air quality, app-generated weather indicators and AI chatbot.

**Data notes:** Open-Meteo weather and air-quality services. AQI is US AQI (not CPCB/India National AQI). District selection geocodes a representative location, so local weather may vary. App alerts are not official IMD warnings. Chat requires your own OpenAI API key; weather dashboard works without it.

## Run locally
Install Node.js 20+, extract ZIP, open terminal in `up-weather-v2`, run `npm install`, copy `.env.example` to `.env.local`, add `OPENAI_API_KEY=your_key`, then `npm run dev` and visit http://localhost:3000.

## GitHub
Open your existing repo and target branch (e.g. main). Back up V1 branch if desired. Extract ZIP; select all contents **inside** `up-weather-v2` (app, components, lib, package/config files), not the outer folder. GitHub → Add file → Upload files; drag folders/files and commit. If folder upload fails, use GitHub Desktop. Review any overwritten files.

Git alternative:
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
# Copy extracted project contents into this repository root
git add .
git commit -m "Upgrade UP Weather to Version 2"
git push origin main
```

## Vercel
Import/open the same GitHub project. Set production branch to your updated branch, framework Next.js, root directory `./` if package.json is at root. Project Settings → Environment Variables: add `OPENAI_API_KEY` (secret) and optionally `OPENAI_MODEL` (default gpt-4o-mini). Save and redeploy, or push a commit. Test district selector, forecast, AQI and chatbot.

Troubleshooting: missing chat key → set env var and redeploy; API data error → retry later; old app → check production branch/latest deployment; build error → ensure app/, components/, lib/ and package.json are at repo root.
