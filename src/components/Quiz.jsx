import { useState } from "react";
import { HERO_NAME } from "../config";
import styles from "./Quiz.module.css";

/**
 * Quiz component.
 * Props:
 *   questions: [{ question, options: [{ text, correct }] }]
 *   onComplete: (score, total) => void
 */
export default function Quiz({ questions, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // true/false per question
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const score = answers.filter(Boolean).length;

  function handleSelect(optionIndex) {
    if (selected !== null) return; // already answered
    const correct = q.options[optionIndex].correct;
    setSelected(optionIndex);
    setAnswers((a) => [...a, correct]);
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
      onComplete(score + (q.options[selected]?.correct ? 1 : 0), questions.length);
    }
  }

  if (finished) {
    const finalScore = answers.filter(Boolean).length;
    const total = questions.length;
    const pct = Math.round((finalScore / total) * 100);
    return <Results score={finalScore} total={total} pct={pct} />;
  }

  return (
    <div className={styles.quiz}>
      <div className={styles.progress}>
        <span>Pytanie {current + 1} / {questions.length}</span>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${((current) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className={styles.question}>{q.question}</h3>

      <ul className={styles.options}>
        {q.options.map((opt, i) => {
          let state = "";
          if (selected !== null) {
            if (opt.correct) state = styles.correct;
            else if (i === selected) state = styles.wrong;
          }
          return (
            <li key={i}>
              <button
                className={`${styles.option} ${state}`}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt.text}
              </button>
            </li>
          );
        })}
      </ul>

      {selected !== null && (
        <div className={styles.feedback}>
          {q.options[selected].correct ? (
            <span className={styles.feedbackCorrect}>✓ Dobrze!</span>
          ) : (
            <span className={styles.feedbackWrong}>
              ✗ Poprawna odpowiedź:{" "}
              <strong>{q.options.find((o) => o.correct)?.text}</strong>
            </span>
          )}
          <button className={styles.nextBtn} onClick={handleNext}>
            {current + 1 < questions.length ? "Następne pytanie →" : "Zakończ quiz →"}
          </button>
        </div>
      )}
    </div>
  );
}

function Results({ score, total, pct }) {
  const passed = pct >= 60;
  return (
    <div className={styles.results}>
      <div className={styles.resultsEmoji} role="img" aria-label="wynik">
        {pct === 100 ? "🏆" : pct >= 60 ? "🎉" : "📚"}
      </div>
      <h3 className={styles.resultsTitle}>
        {pct === 100
          ? "Idealnie!"
          : pct >= 80
          ? "Świetnie!"
          : pct >= 60
          ? "Nieźle!"
          : `${HERO_NAME} by się popłakał, ale nie poddawaj się!`}
      </h3>
      <p className={styles.resultsScore}>
        {score} / {total} poprawnych odpowiedzi ({pct}%)
      </p>
      {!passed && (
        <p className={styles.resultsHint}>
          Wróć do słówek i spróbuj jeszcze raz — reload strony resetuje quiz.
        </p>
      )}
    </div>
  );
}
