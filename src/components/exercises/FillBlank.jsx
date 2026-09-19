import { useState, useRef } from "react";
import { asset } from "../../utils/asset";
import styles from "./FillBlank.module.css";

// Special characters needed for Spanish writing
const SPECIAL_CHARS = ["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"];

/**
 * FillBlank — sentence with a gap, user types (or clicks) the missing word.
 *
 * Data shape:
 * {
 *   type: "fill-blank",
 *   instruction: "Uzupełnij zdanie:",      // shown as exercise label
 *   questionPl: "Gdzie jest moja walizka?", // Polish question always visible above
 *   before: "¿Dónde está",
 *   after:  "maleta?",
 *   answer: "mi",
 *   hint: "zaimek dzierżawczy — 'moja'",
 *   translation: "Gdzie jest moja walizka?", // shown after answering (full sentence)
 *   audioSrc: "/assets/audio/...",
 * }
 */
export default function FillBlank({ block, onComplete }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // idle | correct | wrong
  const [hintVisible, setHintVisible] = useState(false);
  const inputRef = useRef(null);

  function check() {
    const correct =
      value.trim().toLowerCase() === block.answer.trim().toLowerCase();
    setStatus(correct ? "correct" : "wrong");
    if (correct) onComplete?.();
  }

  function reset() {
    setValue("");
    setStatus("idle");
    setHintVisible(false);
    // small delay so React re-renders the enabled input before we focus
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function playAudio() {
    if (!block.audioSrc) return;
    new Audio(asset(block.audioSrc)).play().catch(() => {});
  }

  // Insert char at current cursor position in the input
  function insertChar(ch) {
    if (status !== "idle") return;
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end   = el.selectionEnd   ?? value.length;
    const next  = value.slice(0, start) + ch + value.slice(end);
    setValue(next);
    // restore cursor after the inserted char
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  const answered = status !== "idle";
  const displayValue = answered
    ? (status === "correct" ? value : block.answer)
    : value;

  return (
    <div className={`${styles.wrapper} ${answered ? styles[status] : ""}`}>
      {/* Label */}
      <p className={styles.instruction}>
        <span className={styles.badge}>Ćwiczenie</span>
        {block.instruction ?? "Wpisz brakujące słowo:"}
      </p>

      {/* Polish question — always visible */}
      {block.questionPl && (
        <p className={styles.questionPl}>
          🇵🇱 <em>{block.questionPl}</em>
        </p>
      )}

      {/* Spanish sentence with inline input */}
      <div className={styles.sentence}>
        {block.before && (
          <span className={styles.sentencePart}>{block.before}&nbsp;</span>
        )}
        <input
          ref={inputRef}
          className={`${styles.input} ${answered ? styles[`input_${status}`] : ""}`}
          type="text"
          value={displayValue}
          onChange={(e) => !answered && setValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && !answered && value.trim() && check()
          }
          disabled={answered}
          aria-label="Wpisz brakujące słowo"
          size={Math.max(block.answer.length + 2, 6)}
          autoComplete="off"
          spellCheck={false}
        />
        {block.after && (
          <span className={styles.sentencePart}>&nbsp;{block.after}</span>
        )}
      </div>

      {/* Special character buttons */}
      {!answered && (
        <div className={styles.charButtons} aria-label="Znaki specjalne">
          {SPECIAL_CHARS.map((ch) => (
            <button
              key={ch}
              className={styles.charBtn}
              onClick={() => insertChar(ch)}
              tabIndex={-1}
              aria-label={`Wstaw znak ${ch}`}
              type="button"
            >
              {ch}
            </button>
          ))}
        </div>
      )}

      {/* Post-answer feedback */}
      {answered && (
        <>
          {status === "wrong" && (
            <p className={styles.wrongNote}>
              Wpisałeś: <s>{value.trim()}</s> → poprawnie:{" "}
              <strong>{block.answer}</strong>
            </p>
          )}
          {block.translation && (
            <p className={styles.translation}>
              ✅ {block.translation}
            </p>
          )}
        </>
      )}

      {/* Hint */}
      {block.hint && !answered && (
        <button
          className={styles.hintToggle}
          onClick={() => setHintVisible((v) => !v)}
          type="button"
        >
          {hintVisible ? "Ukryj podpowiedź" : "💡 Podpowiedź"}
        </button>
      )}
      {hintVisible && !answered && (
        <p className={styles.hint}>{block.hint}</p>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {!answered ? (
          <button
            className={styles.checkBtn}
            onClick={check}
            disabled={!value.trim()}
            type="button"
          >
            Sprawdź
          </button>
        ) : (
          <button className={styles.resetBtn} onClick={reset} type="button">
            Spróbuj ponownie
          </button>
        )}
        {block.audioSrc && (
          <button
            className={styles.audioBtn}
            onClick={playAudio}
            aria-label="Odtwórz wymowę"
            type="button"
          >
            🔊 Posłuchaj
          </button>
        )}
      </div>
    </div>
  );
}
