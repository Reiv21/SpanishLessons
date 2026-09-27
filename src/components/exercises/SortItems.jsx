import { useState, useMemo } from "react";
import styles from "./SortItems.module.css";

/**
 * SortItems — przypisz każdy element do właściwej kategorii.
 * Klik w element, potem klik w kategorię (mobilnie i klawiaturowo wygodne).
 *
 * Data shape:
 * {
 *   type: "sort-items",
 *   instruction: "Posortuj słowa wg rodzajnika:",
 *   categories: ["el", "la"],
 *   items: [
 *     { text: "libro", category: "el" },
 *     { text: "casa",  category: "la" },
 *   ],
 * }
 */
export default function SortItems({ block, onComplete }) {
  const categories = block.categories ?? [];
  const items = block.items ?? [];

  const pool = useMemo(
    () => shuffle(items.map((it, i) => ({ ...it, id: i }))),
    [items]
  );

  const [bank, setBank] = useState(pool);
  // placed: category -> [item]
  const [placed, setPlaced] = useState(() =>
    Object.fromEntries(categories.map((c) => [c, []]))
  );
  const [selected, setSelected] = useState(null); // item id z banku
  const [status, setStatus] = useState("idle"); // idle | checked

  function place(cat) {
    if (status !== "idle" || selected === null) return;
    const item = bank.find((b) => b.id === selected);
    if (!item) return;
    setBank((b) => b.filter((x) => x.id !== selected));
    setPlaced((p) => ({ ...p, [cat]: [...p[cat], item] }));
    setSelected(null);
  }

  function takeBack(cat, id) {
    if (status !== "idle") return;
    setPlaced((p) => {
      const item = p[cat].find((x) => x.id === id);
      if (item) setBank((b) => [...b, item]);
      return { ...p, [cat]: p[cat].filter((x) => x.id !== id) };
    });
  }

  function check() {
    setStatus("checked");
    const allCorrect =
      bank.length === 0 &&
      categories.every((c) => placed[c].every((it) => it.category === c));
    if (allCorrect) onComplete?.();
  }

  function reset() {
    setBank(shuffle(items.map((it, i) => ({ ...it, id: i }))));
    setPlaced(Object.fromEntries(categories.map((c) => [c, []])));
    setSelected(null);
    setStatus("idle");
  }

  const correctCount = categories.reduce(
    (n, c) => n + placed[c].filter((it) => it.category === c).length,
    0
  );

  return (
    <div className={`${styles.wrapper} ${status === "checked" ? styles.done : ""}`}>
      <p className={styles.instruction}>
        <span className={styles.badge}>Posortuj</span>
        {block.instruction ?? "Przypisz elementy do kategorii:"}
      </p>

      {/* Bank elementów do rozłożenia */}
      <div className={styles.bank}>
        {bank.length === 0 && status === "idle" && (
          <span className={styles.bankEmpty}>Wszystko rozłożone, sprawdź wynik.</span>
        )}
        {bank.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.chip} ${selected === item.id ? styles.chipSel : ""}`}
            onClick={() => setSelected(selected === item.id ? null : item.id)}
          >
            {item.text}
          </button>
        ))}
      </div>

      {/* Kategorie */}
      <div className={styles.cols}>
        {categories.map((cat) => (
          <div key={cat} className={styles.col}>
            <button
              type="button"
              className={styles.colHead}
              onClick={() => place(cat)}
              disabled={selected === null || status !== "idle"}
            >
              {cat}
            </button>
            <div className={styles.colBody}>
              {placed[cat].map((item) => {
                const ok = status === "checked" && item.category === cat;
                const bad = status === "checked" && item.category !== cat;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.placedChip} ${ok ? styles.chipOk : ""} ${
                      bad ? styles.chipBad : ""
                    }`}
                    onClick={() => takeBack(cat, item.id)}
                    disabled={status !== "idle"}
                    title={status === "idle" ? "Kliknij, aby cofnąć" : undefined}
                  >
                    {item.text}
                    {bad && <span className={styles.badMark}> → {item.category}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {status === "idle" ? (
          <button
            type="button"
            className={styles.checkBtn}
            onClick={check}
            disabled={bank.length !== 0}
          >
            Sprawdź
          </button>
        ) : (
          <>
            <span className={styles.scoreMsg}>
              {correctCount} / {items.length} poprawnie
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
