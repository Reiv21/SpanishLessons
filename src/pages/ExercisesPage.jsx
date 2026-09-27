import { useNavigate } from "react-router-dom";
import { TEMPLATES } from "../data/exerciseTemplates";
import styles from "./ExercisesPage.module.css";

export default function ExercisesPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Strona główna
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.kicker}>Piaskownica</span>
          <span className={styles.title}>Zadania testowe</span>
        </div>
      </header>

      <section className={styles.intro}>
        <p>
          Wybierz typ zadania, żeby zobaczyć działający przykład. Możesz też
          od razu podmienić treść i sprawdzić, jak wyglądałaby Twoja wersja.
        </p>
      </section>

      <section className={styles.grid}>
        {TEMPLATES.map((t) => (
          <button
            key={t.slug}
            className={styles.card}
            onClick={() => navigate(`/zadania/${t.slug}`)}
            aria-label={`Otwórz zadanie: ${t.name}`}
          >
            <span className={styles.cardIcon} aria-hidden="true">
              {t.icon}
            </span>
            <span className={styles.cardBody}>
              <span className={styles.cardName}>{t.name}</span>
              <span className={styles.cardDesc}>{t.desc}</span>
            </span>
            <span className={styles.cardArrow}>→</span>
          </button>
        ))}
      </section>
    </div>
  );
}
