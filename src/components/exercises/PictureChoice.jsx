import { useState } from "react";
import { asset } from "../../utils/asset";
import { renderRich } from "../../utils/richText";
import styles from "./PictureChoice.module.css";

/**
 * PictureChoice — zdjęcie + kilka zdań; uczeń zaznacza poprawny(e) opis(y).
 *
 * Data shape:
 * {
 *   type: "picture-choice",
 *   instruction: "Które zdania opisują zdjęcie?",
 *   image: "/family.jpeg",     // ścieżka w /public LUB data: URL (upload)
 *   imageAlt: "Rodzina w kuchni",
 *   multiple: true,            // czy może być wiele poprawnych
 *   options: [
 *     { text: "La familia cocina.", correct: true },
 *     { text: "El perro duerme.",   correct: false },
 *   ],
 * }
 */
export default function PictureChoice({ block, onComplete }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const isMultiple = block.multiple ?? false;
  const options = block.options ?? [];

  // data: URL (upload) renderujemy wprost; ścieżkę z /public przez asset()
  const imgSrc = block.image
    ? block.image.startsWith("data:")
      ? block.image
      : asset(block.image)
    : null;

  function toggle(i) {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (isMultiple) {
        next.has(i) ? next.delete(i) : next.add(i);
      } else {
        next.clear();
        next.add(i);
      }
      return next;
    });
  }

  function submit() {
    setSubmitted(true);
    const allCorrect = options.every((o, i) => o.correct === selected.has(i));
    if (allCorrect) onComplete?.();
  }

  function reset() {
    setSelected(new Set());
    setSubmitted(false);
  }

  const hasSelection = selected.size > 0;

  return (
    <div className={`${styles.wrapper} ${submitted ? styles.done : ""}`}>
      <p className={styles.instruction}>
        <span className={styles.badge}>{block.badge ?? "Opisz zdjęcie"}</span>
        {renderRich(block.instruction ?? "Które zdania opisują zdjęcie?")}
      </p>

      {imgSrc ? (
        <img
          className={styles.image}
          src={imgSrc}
          alt={block.imageAlt ?? "Zdjęcie do opisu"}
        />
      ) : (
        <div className={styles.imagePlaceholder}>Brak zdjęcia</div>
      )}

      <ul className={styles.options}>
        {options.map((o, i) => {
          const isSel = selected.has(i);
          const showRight = submitted && o.correct;
          const showWrong = submitted && isSel && !o.correct;
          return (
            <li key={i}>
              <button
                type="button"
                className={`${styles.option} ${isSel ? styles.selected : ""} ${
                  showRight ? styles.right : ""
                } ${showWrong ? styles.wrong : ""}`}
                onClick={() => toggle(i)}
                disabled={submitted}
              >
                <span className={styles.marker}>
                  {submitted
                    ? o.correct
                      ? "✓"
                      : isSel
                      ? "✕"
                      : ""
                    : isSel
                    ? "●"
                    : ""}
                </span>
                <span>{renderRich(o.text)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.actions}>
        {!submitted ? (
          <button
            type="button"
            className={styles.checkBtn}
            onClick={submit}
            disabled={!hasSelection}
          >
            Sprawdź
          </button>
        ) : (
          <button type="button" className={styles.resetBtn} onClick={reset}>
            Spróbuj ponownie
          </button>
        )}
      </div>
    </div>
  );
}
