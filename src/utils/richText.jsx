import styles from "./richText.module.css";

/**
 * Prosty inline-markup do instrukcji i tekstów ćwiczeń.
 * Składnia (można zagnieżdżać płytko, po kolei):
 *   **pogrubienie**
 *   *kursywa*
 *   ==podświetlenie==            (żółte tło, do zwracania uwagi na słowo)
 *   {kolor:słowo}                (kolorowe słowo, kolor = nazwa CSS lub #hex)
 *
 * Zwraca tablicę węzłów React do wstawienia w JSX.
 * Użycie: <p>{renderRich(block.instruction)}</p>
 */
export function renderRich(text) {
  if (text == null) return null;
  if (typeof text !== "string") return text;

  // Kolejność: najpierw {kolor:...}, potem ==...==, **...**, *...*
  // Tokenizujemy jednym regexem z grupami.
  const re = /(\{[a-zA-Z#0-9]+:[^}]+\})|(==[^=]+==)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  const out = [];
  let last = 0;
  let m;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];

    if (tok.startsWith("{")) {
      const sep = tok.indexOf(":");
      const color = tok.slice(1, sep);
      const inner = tok.slice(sep + 1, -1);
      out.push(
        <span key={key++} style={{ color }}>
          {inner}
        </span>
      );
    } else if (tok.startsWith("==")) {
      out.push(
        <mark key={key++} className={styles.highlight}>
          {tok.slice(2, -2)}
        </mark>
      );
    } else if (tok.startsWith("**")) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
