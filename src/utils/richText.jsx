import styles from "./richText.module.css";

/**
 * Prosty inline-markup do instrukcji i tekstów ćwiczeń. Zagnieżdżanie działa
 * (np. {red:**mocno**}), a niedomknięte/puste znaczniki renderują się jako
 * zwykły tekst zamiast psuć całość.
 *   **pogrubienie**
 *   *kursywa*
 *   ==podświetlenie==
 *   {kolor:tekst}     kolor = nazwa CSS lub #hex
 */

// Znajduje pierwszy poprawny znacznik i zwraca {start, end, type, inner, color}.
// Zwraca null jeśli nie ma żadnego.
function firstToken(text) {
  let best = null;

  // {kolor:...} — dopasuj zbalansowany do najbliższego '}'
  const color = /\{([a-zA-Z]+|#[0-9a-fA-F]{3,8}):([^{}]+)\}/.exec(text);
  consider(color, "color");

  // ==...==  (niepuste, bez '=' w środku)
  const mark = /==([^=]+)==/.exec(text);
  consider(mark, "mark");

  // **...**  (niepuste, bez '*' w środku)
  const bold = /\*\*([^*]+)\*\*/.exec(text);
  consider(bold, "bold");

  // *...*  (niepuste, bez '*' w środku) — pojedyncza gwiazdka
  const ital = /\*([^*]+)\*/.exec(text);
  consider(ital, "italic");

  function consider(mm, type) {
    if (!mm) return;
    if (best === null || mm.index < best.index) {
      best = { index: mm.index, match: mm, type };
    }
  }

  if (!best) return null;
  const mm = best.match;
  return {
    start: best.index,
    end: best.index + mm[0].length,
    type: best.type,
    inner: best.type === "color" ? mm[2] : mm[1],
    color: best.type === "color" ? mm[1] : null,
  };
}

export function renderRich(text) {
  if (text == null) return null;
  if (typeof text !== "string") return text;
  return parse(text, "r");
}

function parse(text, keyPrefix) {
  const out = [];
  let rest = text;
  let i = 0;

  while (rest.length > 0) {
    const tok = firstToken(rest);
    if (!tok) {
      out.push(rest);
      break;
    }
    // tekst przed znacznikiem
    if (tok.start > 0) out.push(rest.slice(0, tok.start));

    const key = `${keyPrefix}${i++}`;
    const children = parse(tok.inner, key + "-"); // rekurencja = zagnieżdżanie

    if (tok.type === "color") {
      out.push(<span key={key} style={{ color: tok.color }}>{children}</span>);
    } else if (tok.type === "mark") {
      out.push(<mark key={key} className={styles.highlight}>{children}</mark>);
    } else if (tok.type === "bold") {
      out.push(<strong key={key}>{children}</strong>);
    } else if (tok.type === "italic") {
      out.push(<em key={key}>{children}</em>);
    }
    rest = rest.slice(tok.end);
  }
  return out;
}
