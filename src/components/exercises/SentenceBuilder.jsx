import { useState, useMemo } from "react";
import styles from "./SentenceBuilder.module.css";

/**
 * SentenceBuilder — scrambled words, click to arrange into correct sentence.
 *
 * Data shape (block in lessons.js):
 * {
 *   type: "sentence-builder",
 *   instruction: "Ułóż zdanie po hiszpańsku:",
 *   words: ["¿Dónde", "está", "mi", "maleta?"],   // correct order
 *   translation: "Gdzie jest moja walizka?",
 *   audioSrc: "/assets/audio/sentence_01.mp3",     // optional
 * }
 */
export default function SentenceBuilder({ block }) {
  const shuffled = useMemo(() => shuffle([...block.words]), [block.words]);

  const [bank, setBank] = useState(shuffled);   // words not yet placed
  const [built, setBuilt] = useState([]);        // words placed by user
  const [status, setStatus] = useState("idle");  // idle | correct | wrong
  const [showTranslation, setShowTranslation] = useState(false);

  function pickWord(word, fromIndex) {
    if (status !== "idle") return;
    setBank((b) => b.filter((_, i) => i !== fromIndex));
    setBuilt((b) => [...b, word]);
  }

  function returnWord(word, fromIndex) {
    if (status !== "idle") return;
    setBuilt((b) => b.filter((_, i) => i !== fromIndex));
    setBank((b) => [...b, word]);
  }

  function check() {
    const correct = built.join(" ") === block.words.join(" ");
    setStatus(correct ? "correct" : "wrong");
    setShowTranslation(true);
  }

  function reset() {
    setBank(shuffle([...block.words]));
    setBuilt([]);
    setStatus("idle");
    setShowTranslation(false);
  }

  function playAudio() {
    if (!block.audioSrc) return;
    new Audio(block.audioSrc).play().catch(() => {});
  }

  const canCheck = built.length === block.words.length;

  return (
    <div className={`${styles.wrapper} ${status !== "idle" ? styles[status] : ""}`}>
      <p className={styles.instruction}>
        <span className={styles.badge}>Ćwiczenie</span>
        {block.instruction ?? "Ułóż poprawne zdanie:"}
      </p>

      {/* Sentence slot */}
      <div className={styles.slot} aria-label="Ułożone zdanie">
        {built.length === 0 && (
          <span className={styles.slotPlaceholder}>Kliknij słowa poniżej…</span>
        )}
        {built.map((w, i) => (
          <button
            key={i}
            className={styles.wordChip}
            onClick={() => returnWord(w, i)}
            disabled={status !== "idle"}
            aria-label={`Usuń słowo ${w}`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className={styles.bank} aria-label="Dostępne słowa">
        {bank.map((w, i) => (
          <button
            key={i}
            className={styles.bankChip}
            onClick={() => pickWord(w, i)}
            disabled={status !== "idle"}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {status !== "idle" && (
        <div className={styles.feedback}>
          {status === "correct" ? (
            <span className={styles.feedbackCorrect}>✓ Dobrze! Zdanie jest poprawne.</span>
          ) : (
            <span className={styles.feedbackWrong}>
              ✗ Nie tym razem. Poprawnie:{" "}
              <strong>{block.words.join(" ")}</strong>
            </span>
          )}
          {showTranslation && (
            <span className={styles.translation}>🇵🇱 {block.translation}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {status === "idle" ? (
          <button
            className={styles.checkBtn}
            onClick={check}
            disabled={!canCheck}
          >
            Sprawdź
          </button>
        ) : (
          <button className={styles.resetBtn} onClick={reset}>
            Spróbuj ponownie
          </button>
        )}
        {block.audioSrc && (
          <button className={styles.audioBtn} onClick={playAudio} aria-label="Odtwórz wymowę">
            🔊 Posłuchaj
          </button>
        )}
      </div>
    </div>
  );
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // ponytail: if shuffle returns same order, swap first two — avoids trivial case
  if (arr.length > 1 && arr.join("") === [...arr].sort().join("")) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}
