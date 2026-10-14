# platopod.com

Static website for **Plato Pod**: small real robots and virtual units sharing
one desk-sized arena, for teaching and for tabletop wargaming.

This repository is the **website only**. The platform itself is a separate,
private repository; nothing here contains server source, firmware or
operational detail.

## Files

| Path | Purpose |
|---|---|
| `index.html`, `teaching.html`, `military.html`, `technical.html`, `about.html`, `history.html` | The pages. Header and footer are copied into each by hand. |
| `404.html` | Not-found page, served by GitHub Pages. |
| `assets/site.css`, `assets/site.js` | The one stylesheet and the one script, shared by every page. |
| `img/` | Photographs, renders and video. |
| `CNAME` | Custom domain for GitHub Pages. |

## Working on it

No build step and no dependencies beyond the Google Fonts link. To preview:

    python3 -m http.server 8000

Then <http://localhost:8000>.

Every claim on the site traces to a content notes file kept with the
platform's source, not in this public repository. Check it before changing
copy.

## Deployment

GitHub Pages from `master`, root. The custom domain is set by `CNAME`.
