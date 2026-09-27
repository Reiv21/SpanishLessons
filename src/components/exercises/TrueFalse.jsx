import { useState, useEffect, useRef } from "react";
import styles from "./TrueFalse.module.css";

/**
 * TrueFalse — seria stwierdzeń, uczeń ocenia każde jako Prawda/Fałsz.
 * Opcjonalny licznik czasu na całość.
 *
 * Data shape:
 * {
 *   type: "true-false",
 *   instruction: "Prawda czy fałsz?",
 *   timeLimit: 30,                 // sekundy na całość (0/brak = bez limitu)
 *   statements: [
 *     { text: "„Hola” znaczy cześć.", answer: true },
 *     { text: "„Gracias” znaczy proszę.", answer: false },
 *   ],
 * }
 */
export default function TrueFalse({ block, onComplete }) {
  const statements = block.statements ?? [];
  const timeLimit = block.timeLimit ?? 0;

  const [answers, setAnswers] = useState({}); // index -> bool
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef(null);

  // Licznik czasu (jeśli ustawiony)
  useEffect(() => {
    if (!timeLimit || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLimit, submitted]);

  function pick(i, val) {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [i]: val }));
  }

  function submit() {
    clearInterval(timerRef.current);
    setSubmitted(true);
    const allCorrect = statements.every((s, i) => answers[i] === s.answer);
    if (allCorrect) onComplete?.();
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setTimeLeft(timeLimit);
  }

  const allAnswered = statements.every((_, i) => answers[i] !== undefined);
  const score = statements.filter((s, i) => answers[i] === s.answer).length;

  return (
    <div className={`${styles.wrapper} ${submitted ? styles.done : ""}`}>
      <div className={styles.header}>
        <p className={styles.instruction}>
          <span className={styles.badge}>Prawda / Fałsz</span>
          {block.instruction ?? "Oceń stwierdzenia:"}
        </p>
        {timeLimit > 0 && !submitted && (
          <span className={`${styles.timer} ${timeLeft <= 5 ? styles.timerLow : ""}`}>
            ⏱ {timeLeft}s
          </span>
        )}
      </div>

      <ul className={styles.list}>
        {statements.map((s, i) => {
          const picked = answers[i];
          const isRight = submitted && picked === s.answer;
          const isWrong = submitted && picked !== undefined && picked !== s.answer;
          return (
            <li
              key={i}
              className={`${styles.item} ${isRight ? styles.itemRight : ""} ${
                isWrong ? styles.itemWrong : ""
              }`}
            >
              <span className={styles.statement}>{s.text}</span>
              <div className={styles.choices}>
                <button
                  type="button"
                  className={`${styles.choiceBtn} ${
                    picked === true ? styles.choiceActive : ""
                  }`}
                  onClick={() => pick(i, true)}
                  disabled={submitted}
                >
                  Prawda
                </button>
                <button
                  type="button"
                  className={`${styles.choiceBtn} ${
                    picked === false ? styles.choiceActive : ""
                  }`}
                  onClick={() => pick(i, false)}
                  disabled={submitted}
                >
                  Fałsz
                </button>
              </div>
              {submitted && isWrong && (
                <span className={styles.correction}>
                  Poprawnie: {s.answer ? "Prawda" : "Fałsz"}
                </span>
              )}
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
            disabled={!allAnswered}
          >
            Sprawdź
          </button>
        ) : (
          <>
            <span className={styles.scoreMsg}>
              {score} / {statements.length} poprawnych
            </span>
            <button type="button" className={styles.resetBtn} onClick={reset}>
              Spróbuj ponownie
            </button>
          </>
        )}
      </div>
    </div>
  );
}
