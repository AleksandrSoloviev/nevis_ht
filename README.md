# Clients dashboard

## Technologies

- Node.js 22+, npm workspaces
- `web/`: Vite 7, React 19, TypeScript 5.9, Recharts, CSS Modules, Vitest, Testing Library
- `api/`: Express 4, TypeScript via `tsx`

## Architecture

Two packages. `api` serves `GET /api/company` from `api/src/data/company.json` on `127.0.0.1:3001`. `web` is one React screen. Vite proxies `/api` to that server. On load the page fetches the company tree. Domain code builds the four chart series and the visible table rows. The chart always shows the company. The table expands and collapses the same tree.

## Run

```bash
npm install
npm run dev
```

- UI: http://127.0.0.1:5173
- API: http://127.0.0.1:3001/api/company

## Test

```bash
npm test
npm run lint
```
