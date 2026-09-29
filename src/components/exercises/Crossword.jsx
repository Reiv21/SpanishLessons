import { useState, useMemo } from "react";
import { renderRich } from "../../utils/richText";
import styles from "./Crossword.module.css";

/**
 * Crossword — krzyżówka wprowadzana RĘCZNIE (bez auto-generowania siatki,
 * bo generator jest kosztowny i zawodny). Definiujesz wpisy: pozycja,
 * kierunek, odpowiedź i wskazówka. Siatka liczona jest z wpisów.
 *
 * Data shape:
 * {
 *   type: "crossword",
 *   instruction: "Rozwiąż krzyżówkę:",
 *   entries: [
 *     { row: 0, col: 0, dir: "across", answer: "HOLA",   clue: "Cześć" },
 *     { row: 0, col: 0, dir: "down",   answer: "HOY",    clue: "Dziś" },
 *   ],
 * }
 * row/col liczone od 0. dir: "across" (w poziomie) | "down" (w pionie).
 */
export default function Crossword({ block, onComplete }) {
  const entries = block.entries ?? [];

  // Zbuduj mapę komórek: "r,c" -> { solution, numbers:[] }
  const { cells, rows, cols, numbering } = useMemo(
    () => buildGrid(entries),
    [entries]
  );

  const [values, setValues] = useState({}); // "r,c" -> litera
  const [status, setStatus] = useState("idle"); // idle | checked

  function setCell(key, ch) {
    if (status !== "idle") return;
    setValues((v) => ({ ...v, [key]: ch.slice(-1).toUpperCase() }));
  }

  function check() {
    setStatus("checked");
    const allCorrect = Object.entries(cells).every(
      ([key, cell]) => (values[key] ?? "") === cell.solution
    );
    if (allCorrect) onComplete?.();
  }

  function reset() {
    setValues({});
    setStatus("idle");
  }

  if (entries.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.instruction}>
          <span className={styles.badge}>{block.badge ?? "Krzyżówka"}</span>
          {renderRich(block.instruction ?? "Krzyżówka")}
        </p>
        <p className={styles.emptyNote}>
          Ta krzyżówka nie ma jeszcze wpisów. Krzyżówki wprowadza się ręcznie
          (pozycja, kierunek, hasło i wskazówka), bo automatyczne generowanie
          siatki jest kosztowne i zawodne. Dodaj wpisy w edytorze.
        </p>
      </div>
    );
  }

  const across = entries
    .map((e, i) => ({ ...e, num: numbering[`${e.row},${e.col}`] }))
    .filter((e) => e.dir === "across")
    .sort((a, b) => a.num - b.num);
  const down = entries
    .map((e, i) => ({ ...e, num: numbering[`${e.row},${e.col}`] }))
    .filter((e) => e.dir === "down")
    .sort((a, b) => a.num - b.num);

  return (
    <div className={`${styles.wrapper} ${status === "checked" ? styles.done : ""}`}>
      <p className={styles.instruction}>
        <span className={styles.badge}>{block.badge ?? "Krzyżówka"}</span>
        {renderRich(block.instruction ?? "Rozwiąż krzyżówkę:")}
      </p>

      <div className={styles.layout}>
        {/* Siatka */}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${cols}, 34px)` }}
        >
          {Array.from({ length: rows * cols }).map((_, idx) => {
            const r = Math.floor(idx / cols);
            const c = idx % cols;
            const key = `${r},${c}`;
            const cell = cells[key];
            if (!cell) return <div key={key} className={styles.blank} />;
            const num = numbering[key];
            const val = values[key] ?? "";
            const wrong = status === "checked" && val !== cell.solution;
            return (
              <div key={key} className={styles.cell}>
                {num && <span className={styles.cellNum}>{num}</span>}
                <input
                  className={`${styles.cellInput} ${wrong ? styles.cellWrong : ""}`}
                  value={val}
                  onChange={(e) => setCell(key, e.target.value)}
                  maxLength={1}
                  disabled={status !== "idle"}
                  aria-label={`Komórka ${r + 1},${c + 1}`}
                />
              </div>
            );
          })}
        </div>

        {/* Wskazówki */}
        <div className={styles.clues}>
          {across.length > 0 && (
            <div>
              <h4 className={styles.cluesTitle}>Poziomo</h4>
              <ol className={styles.clueList}>
                {across.map((e) => (
                  <li key={`a${e.num}`}>
                    <strong>{e.num}.</strong> {e.clue}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {down.length > 0 && (
            <div>
              <h4 className={styles.cluesTitle}>Pionowo</h4>
              <ol className={styles.clueList}>
                {down.map((e) => (
                  <li key={`d${e.num}`}>
                    <strong>{e.num}.</strong> {e.clue}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {status === "idle" ? (
          <button type="button" className={styles.checkBtn} onClick={check}>
            Sprawdź
          </button>
        ) : (
          <button type="button" className={styles.resetBtn} onClick={reset}>
            Wyczyść
          </button>
        )}
      </div>
    </div>
  );
}

// Buduje siatkę z wpisów: komórki z rozwiązaniem + numeracja startów.
function buildGrid(entries) {
  const cells = {};
  let maxR = 0;
  let maxC = 0;

  for (const e of entries) {
    const chars = [...(e.answer ?? "").toUpperCase()];
    chars.forEach((ch, i) => {
      const r = e.dir === "down" ? e.row + i : e.row;
      const c = e.dir === "across" ? e.col + i : e.col;
      cells[`${r},${c}`] = { solution: ch };
      maxR = Math.max(maxR, r);
      maxC = Math.max(maxC, c);
    });
  }

  // Numeracja: unikalne pozycje startowe wpisów, po kolei wg (row, col)
  const starts = [...new Set(entries.map((e) => `${e.row},${e.col}`))].sort(
    (a, b) => {
      const [ar, ac] = a.split(",").map(Number);
      const [br, bc] = b.split(",").map(Number);
      return ar - br || ac - bc;
    }
  );
  const numbering = {};
  starts.forEach((key, i) => {
    numbering[key] = i + 1;
  });

  return { cells, rows: maxR + 1, cols: maxC + 1, numbering };
}
