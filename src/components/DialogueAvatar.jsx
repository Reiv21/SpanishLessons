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

const MAREK_EXPRESSIONS = {
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

export default function DialogueAvatar({ avatar, size = 44 }) {
  if (!avatar) {
    return <div className={styles.empty} style={{ width: size, height: size }} />;
  }

  if (avatar.type === "marek") {
    const { col, row } = MAREK_EXPRESSIONS[avatar.expression ?? "neutral"];
    // background-size: 300% 300% makes each cell fill the container at 100%.
    // background-position percentage selects which cell shows:
    //   3 columns → 0%, 50%, 100% for col 0, 1, 2
    //   3 rows    → 0%, 50%, 100% for row 0, 1, 2
    const xPct = (col / 2) * 100;
    const yPct = (row / 2) * 100;

    return (
      <div
        className={styles.avatar}
        style={{
          width: size,
          height: size,
          backgroundImage: "url('/marek.png')",
          backgroundSize: "300% 300%",
          backgroundPosition: `${xPct}% ${yPct}%`,
          flexShrink: 0,
        }}
        role="img"
        aria-label={`Marek — ${avatar.expression ?? "neutral"}`}
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
        <img src={avatar.src} alt={avatar.alt ?? ""} className={styles.singleImg} />
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
