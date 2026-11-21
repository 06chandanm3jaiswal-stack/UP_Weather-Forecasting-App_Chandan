# UP Weather — Uttar Pradesh Weather Forecast App

A responsive Next.js application for checking current conditions, the next 24 hours and a 7-day forecast for cities in Uttar Pradesh, India.

## Features

- Search for cities and towns using the Open-Meteo geocoding service.
- Search results are filtered to India and the Uttar Pradesh administrative region.
- Current temperature, feels-like temperature, humidity, wind speed and precipitation.
- 24-hour forecast and 7-day daily forecast.
- Daily sunrise and sunset times.
- Celsius/Fahrenheit toggle.
- Quick selection of popular Uttar Pradesh cities.
- Responsive desktop and mobile layout.
- No API key or environment variables required for the included Open-Meteo endpoints.

## Tech stack

- Next.js 15 / React 19 / TypeScript
- Tailwind CSS 4
- Open-Meteo Forecast API: https://open-meteo.com/
- Open-Meteo Geocoding API: https://open-meteo.com/en/docs/geocoding-api

## Run locally

Requirements: Node.js 20.9 or newer and npm.

1. Extract the ZIP file.
2. Open the extracted `up-weather-forecast` folder in VS Code or a terminal.
3. Install packages:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

To check the production build locally:

```bash
npm run build
npm run start
```

## Publish to GitHub

### Option A — GitHub website (easiest)

1. Sign in to https://github.com/.
2. Click the **+** icon (top-right) → **New repository**.
3. Enter a repository name, for example `up-weather-forecast`.
4. Choose **Public** or **Private**.
5. Click **Create repository**.
6. Extract the downloaded ZIP on your computer.
7. Open the new repository on GitHub and choose **Add file → Upload files**.
8. Upload the *contents* of the extracted `up-weather-forecast` folder (the `app` folder, `package.json`, `README.md`, config files, etc.). Do not upload the ZIP as a single file and do not create an extra nested folder.
9. Enter a commit message such as `Initial UP Weather app`.
10. Click **Commit changes**.

### Option B — Git command line

Extract the ZIP, open a terminal inside the extracted folder, then run:

```bash
git init
git add .
git commit -m "Initial UP Weather app"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/up-weather-forecast.git
git push -u origin main
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username. If GitHub asks you to authenticate, complete its browser sign-in flow or use a personal access token as instructed by GitHub.

## Deploy on Vercel

1. Go to https://vercel.com/ and sign in (you can use your GitHub account).
2. If prompted, authorize Vercel to access the GitHub repository.
3. From the Vercel dashboard, click **Add New… → Project**.
4. Find `up-weather-forecast` in the list of GitHub repositories and click **Import**.
5. Check the project settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build` (normally detected automatically)
   - Output Directory: leave the default
   - Install Command: `npm install` (normally detected automatically)
6. No environment variables are needed for this version.
7. Click **Deploy**.
8. Wait for the build to finish. Vercel will provide a live URL similar to `https://up-weather-forecast-yourname.vercel.app`.
9. Open the URL and test a few cities.

## Updating the app later

1. Make changes to the code locally, or edit files through GitHub.
2. Commit and push the changes to the connected GitHub repository.
3. Vercel automatically starts a new deployment when changes reach the connected production branch (usually `main`).
4. Once deployment completes, refresh your Vercel URL to see the update.

## Notes and limitations

- The app retrieves live forecast data when a city is selected or the refresh button is pressed. It does not yet send push notifications or scheduled weather alerts.
- The search is restricted to geocoding results identified as India and whose administrative region is labelled Uttar Pradesh. Some small localities may not be listed or may be labelled differently by the upstream geocoding dataset.
- Weather forecasts are model-based estimates, not guarantees. For official warnings and severe-weather decisions, also consult the India Meteorological Department: https://mausam.imd.gov.in/.
- Open-Meteo API availability and usage terms apply: https://open-meteo.com/en/terms.
- This starter app uses browser-side API calls and does not store user searches or personal data.

## Troubleshooting

- **No city suggestions:** Try the official spelling or a nearby larger city. The geocoding provider may not list every village/locality.
- **Weather does not load:** Check your internet connection and retry. The forecast service may be temporarily unavailable.
- **Vercel build fails:** Confirm the repository root contains `package.json` and the `app` directory. Review the build log in Vercel for the first reported error.
- **Local Node version error:** Use Node.js 20.9 or newer.
