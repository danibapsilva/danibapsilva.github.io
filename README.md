# danibapsilva.github.io

Daniel Silva's personal site: who I am, selected work as short case studies, and experience.
Next.js (App Router) exported as static HTML, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Work on it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ to check the export
```

Everything the site says lives in `lib/content.ts` (case studies, experience, skills). Pages are in `app/`, and the two architecture diagrams are inline SVG in `components/`.

## Publish

1. On GitHub, create a public repo named exactly `danibapsilva.github.io`.
2. `git remote add origin git@github.com:danibapsilva/danibapsilva.github.io.git && git push -u origin main`
3. In the repo: Settings, Pages, Source: **GitHub Actions**. The workflow deploys on the next push (or run it from the Actions tab).

## TODO

- Add `public/resume.pdf`. It isn't committed because the resume PDF has a phone number: make a copy without it (or remove the number) before adding it, since this repo and site are public.
- When the escrow testnet demo is live, replace the "Live demo coming soon" note in `lib/content.ts` with its link.
