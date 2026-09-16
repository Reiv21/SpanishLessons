import { useState, useMemo, useEffect } from "react";
import styles from "./MatchPairs.module.css";

/**
 * MatchPairs — two columns (ES / PL), click one from each to match.
 * Matched pairs disappear. Done when all matched.
 *
 * Data shape:
 * {
 *   type: "match-pairs",
 *   instruction: "Połącz słówka z tłumaczeniami:",
 *   pairs: [
 *     { es: "Hola",      pl: "Cześć" },
 *     { es: "Gracias",   pl: "Dziękuję" },
 *     ...
 *   ],
 * }
 */
export default function MatchPairs({ block, onComplete }) {
  const pairs = block.pairs;

  // Each side is an array of { id, text }; id links the two sides.
  const esItems = useMemo(
    () => shuffle(pairs.map((p, i) => ({ id: i, text: p.es }))),
    [pairs]
  );
  const plItems = useMemo(
    () => shuffle(pairs.map((p, i) => ({ id: i, text: p.pl }))),
    [pairs]
  );

  const [matched, setMatched] = useState(new Set());    // set of matched ids
  const [wrong, setWrong]     = useState(new Set());    // ids currently flashing wrong
  const [selEs, setSelEs]     = useState(null);         // selected ES id
  const [selPl, setSelPl]     = useState(null);         // selected PL id

  const done = matched.size === pairs.length;

  useEffect(() => {
    if (done) onComplete?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function selectEs(id) {
    if (matched.has(id) || wrong.has(id)) return;
    const next = selEs === id ? null : id;
    setSelEs(next);
    if (next !== null && selPl !== null) resolve(next, selPl);
  }

  function selectPl(id) {
    if (matched.has(id) || wrong.has(id)) return;
    const next = selPl === id ? null : id;
    setSelPl(next);
    if (selEs !== null && next !== null) resolve(selEs, next);
  }

  function resolve(esId, plId) {
    if (esId === plId) {
      // correct match
      setMatched((m) => new Set([...m, esId]));
      setSelEs(null);
      setSelPl(null);
    } else {
      // wrong — flash red then clear selection
      setWrong(new Set([esId, plId]));
      setTimeout(() => {
        setWrong(new Set());
        setSelEs(null);
        setSelPl(null);
      }, 700);
    }
  }

  function reset() {
    setMatched(new Set());
    setWrong(new Set());
    setSelEs(null);
    setSelPl(null);
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.instruction}>
        <span className={styles.badge}>Ćwiczenie</span>
        {block.instruction ?? "Połącz słówka z tłumaczeniami:"}
      </p>

      {done ? (
        <div className={styles.doneMsg}>
          <span className={styles.doneEmoji}>🎉</span>
          <span>Wszystkie pary dopasowane!</span>
          <button className={styles.resetBtn} onClick={reset}>Zagraj jeszcze raz</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* ES column */}
          <div className={styles.col}>
            <span className={styles.colLabel}>🇪🇸 Hiszpański</span>
            {esItems.map((item) => (
              <PairCard
                key={item.id}
                text={item.text}
                state={
                  matched.has(item.id)
                    ? "matched"
                    : wrong.has(item.id)
                    ? "wrong"
                    : selEs === item.id
                    ? "selected"
                    : "idle"
                }
                onClick={() => selectEs(item.id)}
              />
            ))}
          </div>

          {/* PL column */}
          <div className={styles.col}>
            <span className={styles.colLabel}>🇵🇱 Polski</span>
            {plItems.map((item) => (
              <PairCard
                key={item.id}
                text={item.text}
                state={
                  matched.has(item.id)
                    ? "matched"
                    : wrong.has(item.id)
                    ? "wrong"
                    : selPl === item.id
                    ? "selected"
                    : "idle"
                }
                onClick={() => selectPl(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {!done && (
        <p className={styles.progress}>
          {matched.size} / {pairs.length} dopasowanych
        </p>
      )}
    </div>
  );
}

function PairCard({ text, state, onClick }) {
  return (
    <button
      className={`${styles.card} ${styles[state]}`}
      onClick={state !== "matched" ? onClick : undefined}
      disabled={state === "matched"}
      aria-pressed={state === "selected"}
    >
      {text}
    </button>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
