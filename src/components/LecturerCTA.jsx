import styles from "./LecturerCTA.module.css";

/**
 * LecturerCTA — etap 10: opcjonalny kontakt z lektorem po zakończeniu jednostki.
 *
 * Data shape (block):
 * {
 *   type: "lecturer-cta",
 *   title: "Chcesz poćwiczyć na żywo?",
 *   body:  "Zarezerwuj krótką konsultację...",
 *   ctaLabel: "Zarezerwuj spotkanie",
 *   ctaHref:  "https://...",           // link do systemu rezerwacji
 * }
 */
export default function LecturerCTA({ block }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconRow}>
        <span className={styles.icon}>👩‍🏫</span>
        <span className={styles.tag}>Opcjonalnie</span>
      </div>
      <h3 className={styles.title}>{block.title ?? "Chcesz poćwiczyć materiał na żywo?"}</h3>
      <p className={styles.body}>
        {block.body ?? `Zarezerwuj krótką konsultację z lektorem i wykorzystaj właśnie poznany materiał w prawdziwej rozmowie. Bez presji, wystarczy 15-20 minut.`}
      </p>
      {block.ctaHref ? (
        <a
          href={block.ctaHref}
          className={styles.ctaBtn}
          target="_blank"
          rel="noopener noreferrer"
        >
          {block.ctaLabel ?? "Zarezerwuj spotkanie"}
        </a>
      ) : (
        <p className={styles.comingSoon}>
          🔗 Link do rezerwacji pojawi się wkrótce.
        </p>
      )}
    </div>
  );
}
