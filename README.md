# platopod.com

Static website for **Plato Pod** — an augmented-reality tactical simulation
platform where physical robots and virtual force share one arena.

This repository is the **website only**. The platform itself is a separate,
private repository; nothing here contains server source, firmware or
operational detail.

## Files

| Path | Purpose |
|---|---|
| `index.html` | The whole site. CSS and JS are inline by design. |
| `404.html` | Not-found page, served by GitHub Pages. |
| `CNAME` | Custom domain for GitHub Pages. |
| `img/` | Photographs and preview images. The one exception to single-file. |

## Working on it

No build step, no dependencies, no server. Open `index.html`, or:

    python3 -m http.server 8000

Then <http://localhost:8000>.

Every claim on the page traces to a content notes file kept with the
platform's source, not in this public repository. Check it before changing
copy.

## Deployment

GitHub Pages from `main`, root. The custom domain is set by `CNAME`.
