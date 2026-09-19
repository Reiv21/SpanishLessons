// Prefiksuje ścieżki assetów bazowym URL-em Vite (import.meta.env.BASE_URL).
// Na GitHub Pages strona żyje w podkatalogu /SpanishLessons/, więc absolutna
// ścieżka "/assets/x.mp3" musi stać się "/SpanishLessons/assets/x.mp3".
// BASE_URL ma zawsze końcowy ukośnik ("/" lokalnie, "/SpanishLessons/" w prod).
export function asset(path) {
  if (!path) return path;
  // zewnętrzne URL-e i data: zostawiamy bez zmian
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const base = import.meta.env.BASE_URL;
  return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}
