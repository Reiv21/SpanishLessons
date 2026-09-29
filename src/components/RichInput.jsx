import { useRef } from "react";
import styles from "./RichInput.module.css";

/**
 * RichInput — pole tekstowe z paskiem formatowania.
 * Zaznaczasz fragment, klikasz przycisk (B / i / podświetlenie / kolor)
 * i zaznaczenie owija się w odpowiedni znacznik składni renderRich:
 *   **bold**  *italic*  ==highlight==  {red:...}
 * Jeśli nic nie zaznaczono, wstawia znacznik z placeholderem w miejscu kursora.
 *
 * Props: value, onChange(nextString), placeholder
 */
export default function RichInput({ value, onChange, placeholder }) {
  const ref = useRef(null);

  function wrap(before, after, fallback = "tekst") {
    const el = ref.current;
    const v = value ?? "";
    let start = el?.selectionStart ?? v.length;
    let end = el?.selectionEnd ?? v.length;

    // Przytnij zaznaczenie do niepustych znaków (nie owijaj spacji na brzegach).
    while (start < end && /\s/.test(v[start])) start++;
    while (end > start && /\s/.test(v[end - 1])) end--;

    const selected = v.slice(start, end);

    // Toggle: jeśli zaznaczenie jest już owinięte w ten sam znacznik, zdejmij go.
    const outerBefore = v.slice(start - before.length, start);
    const outerAfter = v.slice(end, end + after.length);
    if (selected && outerBefore === before && outerAfter === after) {
      const next =
        v.slice(0, start - before.length) + selected + v.slice(end + after.length);
      onChange(next);
      const ns = start - before.length;
      requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(ns, ns + selected.length);
      });
      return;
    }

    // Zwykłe owinięcie. Pusty wybór -> wstaw placeholder.
    const inner = selected || fallback;
    const next = v.slice(0, start) + before + inner + after + v.slice(end);
    onChange(next);
    const selStart = start + before.length;
    const selEnd = selStart + inner.length;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(selStart, selEnd);
    });
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => wrap("**", "**")}
          title="Pogrubienie"
          aria-label="Pogrubienie"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => wrap("*", "*")}
          title="Kursywa"
          aria-label="Kursywa"
        >
          <em>i</em>
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => wrap("==", "==")}
          title="Podświetlenie"
          aria-label="Podświetlenie"
        >
          <span className={styles.hl}>H</span>
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.red}`}
          onClick={() => wrap("{red:", "}")}
          title="Czerwony"
          aria-label="Czerwony"
        >
          A
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.blue}`}
          onClick={() => wrap("{#2980b9:", "}")}
          title="Niebieski"
          aria-label="Niebieski"
        >
          A
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.green}`}
          onClick={() => wrap("{#27ae60:", "}")}
          title="Zielony"
          aria-label="Zielony"
        >
          A
        </button>
      </div>
      <input
        ref={ref}
        className={styles.input}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
