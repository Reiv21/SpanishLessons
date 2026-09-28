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

// Standardowy układ 3×3 (marek.png i wygenerowane *_faces.png).
const GRID_3x3 = {
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

// Lektor (p2.png) — siatka 4×3, 12 mimik z podpisami hiszpańskimi.
// Aliasy PL/EN mapowane na te same komórki, żeby dało się używać
// wspólnych nazw wyrazów (happy/neutral itd.) tak jak dla innych postaci.
const GRID_LECTOR = {
  neutro:        { col: 0, row: 0 },
  neutral:       { col: 0, row: 0 },
  sonrisa:       { col: 1, row: 0 },
  smirk:         { col: 1, row: 0 },
  risa:          { col: 2, row: 0 },
  laughing:      { col: 2, row: 0 },
  happy:         { col: 2, row: 0 },
  sorpresa:      { col: 3, row: 0 },
  surprised:     { col: 3, row: 0 },
  duda:          { col: 0, row: 1 },
  concentracion: { col: 1, row: 1 },
  interes:       { col: 2, row: 1 },
  escepticismo:  { col: 3, row: 1 },
  cansancio:     { col: 0, row: 2 },
  sad:           { col: 0, row: 2 },
  satisfaccion:  { col: 1, row: 2 },
  preocupacion:  { col: 2, row: 2 },
  idea:          { col: 3, row: 2 },
  glasses:       { col: 0, row: 0 },
};

// Arkusze twarzy per postać: ścieżka + wymiary siatki + mapa wyrazów.
const SHEETS = {
  marek:  { src: "/marek.png",                         cols: 3, rows: 3, map: GRID_3x3 },
  rosa:   { src: "/assets/characters/rosa_faces.png",  cols: 3, rows: 3, map: GRID_3x3 },
  carlos: { src: "/assets/characters/carlos_faces.png",cols: 3, rows: 3, map: GRID_3x3 },
  omar:   { src: "/assets/characters/omar_faces.png",  cols: 3, rows: 3, map: GRID_3x3 },
  lector: { src: "/assets/characters/lector_faces.png",cols: 4, rows: 3, map: GRID_LECTOR },
};

export default function DialogueAvatar({ avatar, size = 44 }) {
  if (!avatar) {
    return <div className={styles.empty} style={{ width: size, height: size }} />;
  }

  // Sprite postaci: type == nazwa arkusza (marek/rosa/carlos/omar/lector)
  const sheet = SHEETS[avatar.type];
  if (sheet) {
    const cell = sheet.map[avatar.expression] ?? sheet.map.neutral ?? { col: 0, row: 0 };
    // background-size: (cols*100)% (rows*100)% => każda komórka wypełnia kontener.
    // background-position %: col/(cols-1)*100, row/(rows-1)*100.
    const xPct = sheet.cols > 1 ? (cell.col / (sheet.cols - 1)) * 100 : 0;
    const yPct = sheet.rows > 1 ? (cell.row / (sheet.rows - 1)) * 100 : 0;

    return (
      <div
        className={styles.avatar}
        style={{
          width: size,
          height: size,
          backgroundImage: `url('${asset(sheet.src)}')`,
          backgroundSize: `${sheet.cols * 100}% ${sheet.rows * 100}%`,
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
