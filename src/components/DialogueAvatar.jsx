import { asset } from "../utils/asset";
import styles from "./DialogueAvatar.module.css";

/**
 * DialogueAvatar — circular avatar for dialogue lines.
 *
 * avatar variants:
 *   { type: "marek", expression }     — crops from /marek.png sprite sheet (3×3 grid)
 *   { type: "image", src, alt }       — any single image file
 *   { type: "initials", text, color } — colored circle with a letter
 *
 * Marek sprite layout (marek.png is 744×980, cells are 248×326.67 px):
 *   col:  0          1          2
 *   row 0: glasses   surprised  happy
 *   row 1: laughing  angry      neutral
 *   row 2: scared    sad        smirk
 */

// Układ 3×3 taki sam dla wszystkich arkuszy postaci (marek.png oraz
// wygenerowane *_faces.png). Kolumna/rząd wybiera wyraz twarzy.
const EXPRESSIONS = {
  glasses:   { col: 0, row: 0 },
  surprised: { col: 1, row: 0 },
  happy:     { col: 2, row: 0 },
  laughing:  { col: 0, row: 1 },
  angry:     { col: 1, row: 1 },
  neutral:   { col: 2, row: 1 },
  scared:    { col: 0, row: 2 },
  sad:       { col: 1, row: 2 },
  smirk:     { col: 2, row: 2 },
};

// Arkusze twarzy per postać. "marek" wskazuje na oryginalny sprite w roocie.
const SHEETS = {
  marek:  "/marek.png",
  rosa:   "/assets/characters/rosa_faces.png",
  carlos: "/assets/characters/carlos_faces.png",
  omar:   "/assets/characters/omar_faces.png",
};

export default function DialogueAvatar({ avatar, size = 44 }) {
  if (!avatar) {
    return <div className={styles.empty} style={{ width: size, height: size }} />;
  }

  // Sprite postaci: type == nazwa arkusza (marek/rosa/carlos/omar)
  const sheet = SHEETS[avatar.type];
  if (sheet) {
    const { col, row } = EXPRESSIONS[avatar.expression ?? "neutral"];
    // background-size: 300% 300% => każda komórka wypełnia kontener.
    // background-position %: 0/50/100 dla kolumn i rzędów 0/1/2.
    const xPct = (col / 2) * 100;
    const yPct = (row / 2) * 100;

    return (
      <div
        className={styles.avatar}
        style={{
          width: size,
          height: size,
          backgroundImage: `url('${asset(sheet)}')`,
          backgroundSize: "300% 300%",
          backgroundPosition: `${xPct}% ${yPct}%`,
          flexShrink: 0,
        }}
        role="img"
        aria-label={`${avatar.type}, ${avatar.expression ?? "neutral"}`}
      />
    );
  }

  if (avatar.type === "image") {
    return (
      <div
        className={styles.avatar}
        style={{ width: size, height: size, flexShrink: 0 }}
        role="img"
        aria-label={avatar.alt ?? ""}
      >
        <img src={asset(avatar.src)} alt={avatar.alt ?? ""} className={styles.singleImg} />
      </div>
    );
  }

  // initials
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, flexShrink: 0, background: avatar.color ?? "#888" }}
      role="img"
      aria-label={avatar.text}
    >
      <span className={styles.initials} style={{ fontSize: size * 0.38 }}>
        {avatar.text}
      </span>
    </div>
  );
}
