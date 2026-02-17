# Lagedra

Vite + React app configured for:
- Local development with Docker (no local Node.js required)
- GitHub Pages deployment through GitHub Actions

## Local run with Docker

1. Optional: create `.env` and set your key:
   `GEMINI_API_KEY=your_key_here`
2. Start dev server:
   `docker compose up app`
3. Open:
   `http://localhost:3000`

## Local production preview with Docker

1. Build and preview:
   `docker compose up preview`
2. Open:
   `http://localhost:4173`

## GitHub Pages deployment

1. Push to the `main` branch.
2. In GitHub repository settings:
   - Go to `Settings -> Pages`
   - Set `Build and deployment -> Source` to `GitHub Actions`
3. Workflow file:
   `.github/workflows/deploy-pages.yml`

The Vite `base` path is auto-detected in GitHub Actions using your repository name, so assets resolve correctly on GitHub Pages.
