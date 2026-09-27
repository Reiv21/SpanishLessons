import { useState, useMemo } from "react";
import styles from "./Anagram.module.css";

/**
 * Anagram — rozsypane litery słowa, uczeń układa je w poprawnej kolejności.
 * Dobre do pisowni hiszpańskiej (ñ, akcenty).
 *
 * Data shape:
 * {
 *   type: "anagram",
 *   instruction: "Ułóż słowo:",
 *   word: "gracias",           // poprawne słowo
 *   hint: "Dziękuję",          // podpowiedź (np. tłumaczenie), opcjonalna
 * }
 */
export default function Anagram({ block, onComplete }) {
  const word = block.word ?? "";
  const letters = useMemo(() => [...word], [word]);
  const scrambled = useMemo(() => scramble(letters), [letters]);

  // bank: {char, id} żeby powtarzające się litery miały unikalny klucz
  const [bank, setBank] = useState(() =>
    scrambled.map((ch, i) => ({ ch, id: i }))
  );
  const [built, setBuilt] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | correct | wrong

  function pick(item, fromIndex) {
    if (status !== "idle") return;
    setBank((b) => b.filter((_, i) => i !== fromIndex));
    setBuilt((b) => [...b, item]);
  }

  function returnLetter(fromIndex) {
    if (status !== "idle") return;
    setBuilt((b) => {
      const item = b[fromIndex];
      setBank((bk) => [...bk, item]);
      return b.filter((_, i) => i !== fromIndex);
    });
  }

  function check() {
    const attempt = built.map((x) => x.ch).join("");
    const correct = attempt.toLowerCase() === word.toLowerCase();
    setStatus(correct ? "correct" : "wrong");
    if (correct) onComplete?.();
  }

  function reset() {
    setBank(scramble(letters).map((ch, i) => ({ ch, id: i })));
    setBuilt([]);
    setStatus("idle");
  }

  const canCheck = built.length === letters.length;

  return (
    <div className={`${styles.wrapper} ${status !== "idle" ? styles[status] : ""}`}>
      <p className={styles.instruction}>
        <span className={styles.badge}>Anagram</span>
        {block.instruction ?? "Ułóż słowo z liter:"}
      </p>

      {block.hint && (
        <p className={styles.hint}>🇵🇱 <em>{block.hint}</em></p>
      )}

      {/* Zbudowane słowo */}
      <div className={styles.slots}>
        {built.length === 0 && (
          <span className={styles.placeholder}>Klikaj litery poniżej…</span>
        )}
        {built.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={styles.slot}
            onClick={() => returnLetter(i)}
            disabled={status !== "idle"}
            aria-label={`Usuń literę ${item.ch}`}
          >
            {item.ch}
          </button>
        ))}
      </div>

      {/* Bank liter */}
      <div className={styles.bank}>
        {bank.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={styles.tile}
            onClick={() => pick(item, i)}
            disabled={status !== "idle"}
          >
            {item.ch}
          </button>
        ))}
      </div>

      {status === "wrong" && (
        <p className={styles.wrongNote}>
          Ułożyłeś: <s>{built.map((x) => x.ch).join("")}</s> → poprawnie:{" "}
          <strong>{word}</strong>
        </p>
      )}
      {status === "correct" && (
        <p className={styles.correctNote}>✅ {word}</p>
      )}

      <div className={styles.actions}>
        {status === "idle" ? (
          <button
            type="button"
            className={styles.checkBtn}
            onClick={check}
            disabled={!canCheck}
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

function scramble(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // ponytail: jeśli losowo wyszło to samo słowo, zamień dwie pierwsze litery
  if (a.length > 1 && a.join("") === arr.join("")) {
    [a[0], a[1]] = [a[1], a[0]];
  }
  return a;
}
