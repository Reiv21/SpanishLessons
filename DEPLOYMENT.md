# Wdrożenie na GitHub Pages

Strona jest publikowana automatycznie na **https://reiv21.github.io/SpanishLessons/**
po każdym pushu do gałęzi `main`. Nie trzeba SSH, Raspberry Pi ani serwera.

## Jak to działa

Twoja główna strona `reiv21.github.io` to tzw. *user site* — może być tylko jedna.
Ale każde repo może mieć własną *project site* pod adresem `reiv21.github.io/<nazwa-repo>/`,
więc SpanishLessons nie koliduje z Twoją stroną.

Po pushu GitHub Actions:
1. buduje apkę (`npm ci && npm run build`)
2. wrzuca zawartość `dist/` na GitHub Pages

## Jednorazowa konfiguracja (robisz raz)

1. Wypushuj kod z tym workflow na `main`.
2. Wejdź w repo → **Settings → Pages**.
3. W sekcji **Build and deployment → Source** wybierz **GitHub Actions**.
4. Gotowe. Kolejne pushe deployują się same.

Pierwszy deploy zobaczysz w zakładce **Actions**. Po ~1 minucie strona żyje pod
`https://reiv21.github.io/SpanishLessons/`.

## Co jest już skonfigurowane w kodzie

- `vite.config.js` → `base: '/SpanishLessons/'` — bo strona działa w podkatalogu.
- `src/App.jsx` → `basename={import.meta.env.BASE_URL}` — żeby React Router znał podkatalog.
- `public/404.html` + skrypt w `index.html` — SPA fallback, żeby odświeżenie strony
  na trasie typu `/lesson/1` nie dawało błędu 404 (GitHub Pages nie umie tego sam).

> Jeśli kiedyś zmienisz nazwę repo, zmień `base` w `vite.config.js` na `/nowa-nazwa/`.

## Test lokalny buildu produkcyjnego

```bash
npm run build
npm run preview
```

`preview` serwuje build tak jak w produkcji (z podkatalogiem), więc od razu wyłapiesz
błędy ze ścieżkami zanim wypushujesz.
