# Skills Gap Assignment Builder

## Local setup

```bash
npm install
npm run dev
```

## Vercel deployment

Set this server-side environment variable in Vercel:

- `OPENAI_API_KEY`

The AI toggle uses `/api/market-update`. When AI is off or unavailable, the app falls back to built-in job market summaries.
