import { useState } from "react";
import { asset } from "../../utils/asset";
import styles from "./MultiChoice.module.css";

/**
 * MultiChoice — single-select or multi-select question with optional images.
 * Used for "pierwsze hipotezy" — activate prior knowledge before the story.
 *
 * Data shape:
 * {
 *   type: "multi-choice",
 *   gate: true,                        // optional — gates next content
 *   instruction: "Kto mieszka w tym mieszkaniu?",
 *   multiple: false,                   // false = single correct answer
 *   options: [
 *     { text: "Student z Hiszpanii", correct: true,  imgSrc?: "/..." },
 *     { text: "Turystka z Francji",  correct: false, imgSrc?: "/..." },
 *   ],
 *   feedbackCorrect: "Dokładnie!",     // optional custom feedback
 *   feedbackWrong:   "Nie tym razem.", // optional custom feedback
 * }
 */
export default function MultiChoice({ block, onComplete }) {
  const [selected, setSelected] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);

  const isMultiple = block.multiple ?? false;

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
    if (selected.size === 0) return;
    setSubmitted(true);

    const allCorrectSelected = block.options
      .every((o, i) => o.correct === selected.has(i));

    if (allCorrectSelected) onComplete?.();
  }

  function retry() {
    setSelected(new Set());
    setSubmitted(false);
  }

  // For single-choice: correct if the one selected option is correct
  const isCorrect = submitted && block.options
    .every((o, i) => o.correct === selected.has(i));

  return (
    <div className={`${styles.wrapper} ${submitted ? (isCorrect ? styles.correct : styles.wrong) : ""}`}>
      <p className={styles.instruction}>
        <span className={styles.badge}>Jak myślisz?</span>
        {block.instruction}
      </p>

      <div className={styles.options}>
        {block.options.map((opt, i) => {
          const isSelected = selected.has(i);
          let state = "";
          if (submitted) {
            if (opt.correct) state = styles.optCorrect;
            else if (isSelected) state = styles.optWrong;
          } else if (isSelected) {
            state = styles.optSelected;
          }

          return (
            <button
              key={i}
              className={`${styles.option} ${state}`}
              onClick={() => toggle(i)}
              disabled={submitted}
              aria-pressed={isSelected}
            >
              {opt.imgSrc && (
                <img
                  src={asset(opt.imgSrc)}
                  alt={opt.text}
                  className={styles.optImg}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <span className={styles.optText}>{opt.text}</span>
              {submitted && opt.correct && <span className={styles.optCheck}>✓</span>}
            </button>
          );
        })}
      </div>

      {submitted && (
        <p className={`${styles.feedback} ${isCorrect ? styles.feedbackOk : styles.feedbackNo}`}>
          {isCorrect
            ? (block.feedbackCorrect ?? "Dobrze! Historia potwierdzi Twoją odpowiedź.")
            : (block.feedbackWrong  ?? "Nie do końca, ale zaraz się przekonasz jak jest naprawdę!")}
        </p>
      )}

      <div className={styles.actions}>
        {!submitted ? (
          <button
            className={styles.submitBtn}
            onClick={submit}
            disabled={selected.size === 0}
            type="button"
          >
            Sprawdź
          </button>
        ) : (
          !isCorrect && (
            <button className={styles.retryBtn} onClick={retry} type="button">
              Spróbuj ponownie
            </button>
          )
        )}
      </div>
    </div>
  );
}
