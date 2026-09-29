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
    const start = el?.selectionStart ?? v.length;
    const end = el?.selectionEnd ?? v.length;
    const selected = v.slice(start, end) || fallback;
    const next = v.slice(0, start) + before + selected + after + v.slice(end);
    onChange(next);
    // przywróć zaznaczenie na owiniętym tekście
    const selStart = start + before.length;
    const selEnd = selStart + selected.length;
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
