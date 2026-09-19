import { useNavigate } from "react-router-dom";
import { PLATFORM_NAME, HERO_NAME, TAGLINE } from "../config";
import lessons from "../data/lessons";
import { getProgress } from "../utils/progress";
import DialogueAvatar from "../components/DialogueAvatar";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const progress = getProgress();

  const doneCount = lessons.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const totalUnlocked = lessons.filter((l) => !l.locked).length;

  // pierwsza nieukończona odblokowana lekcja = "kontynuuj"
  const nextLesson =
    lessons.find(
      (l) => !l.locked && !progress.completedLessons.includes(l.id)
    ) ?? null;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Nauka hiszpańskiego przez historię</span>
            <h1 className={styles.title}>{PLATFORM_NAME}</h1>
            <p className={styles.tagline}>{TAGLINE}</p>

            {nextLesson && (
              <button
                className={styles.ctaBtn}
                onClick={() => navigate(`/lesson/${nextLesson.id}`)}
              >
                {doneCount > 0 ? "Kontynuuj naukę" : "Zacznij od lekcji 1"}
                <span className={styles.ctaArrow}>→</span>
              </button>
            )}

            {totalUnlocked > 0 && (
              <div className={styles.progressRow}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(doneCount / totalUnlocked) * 100}%` }}
                  />
                </div>
                <span className={styles.progressText}>
                  {doneCount} z {totalUnlocked} ukończonych
                </span>
              </div>
            )}
          </div>

          <div className={styles.heroCast}>
            <CastFace type="marek" name={HERO_NAME} expression="happy" primary />
            <CastFace type="rosa" name="Rosa" expression="happy" />
            <CastFace type="carlos" name="Carlos" expression="smirk" />
            <CastFace type="omar" name="Omar" expression="neutral" />
          </div>
        </div>
      </header>

      <section className={styles.journey}>
        <h2 className={styles.sectionTitle}>Twoja podróż</h2>
        <ol className={styles.path}>
          {lessons.map((lesson, i) => {
            const done = progress.completedLessons.includes(lesson.id);
            const isNext = nextLesson?.id === lesson.id;
            return (
              <LessonStop
                key={lesson.id}
                lesson={lesson}
                done={done}
                isNext={isNext}
                last={i === lessons.length - 1}
                onClick={() =>
                  !lesson.locked && navigate(`/lesson/${lesson.id}`)
                }
              />
            );
          })}
        </ol>
      </section>

      <footer className={styles.footer}>
        <p>
          {PLATFORM_NAME} · ucz się w rytmie historii ·{" "}
          <span role="img" aria-label="Hiszpania">🇪🇸</span>
        </p>
      </footer>
    </div>
  );
}

function CastFace({ type, name, expression, primary }) {
  return (
    <figure className={`${styles.castItem} ${primary ? styles.castPrimary : ""}`}>
      <DialogueAvatar avatar={{ type, expression }} size={primary ? 96 : 64} />
      <figcaption>{name}</figcaption>
    </figure>
  );
}

function LessonStop({ lesson, done, isNext, last, onClick }) {
  const locked = lesson.locked;
  return (
    <li className={styles.stop}>
      <div className={styles.stopMarkerCol}>
        <div
          className={`${styles.stopMarker} ${done ? styles.stopDone : ""} ${
            locked ? styles.stopLocked : ""
          } ${isNext ? styles.stopNext : ""}`}
        >
          {done ? "✓" : locked ? "🔒" : lesson.id}
        </div>
        {!last && <span className={styles.stopLine} />}
      </div>

      <button
        className={`${styles.stopCard} ${locked ? styles.cardLocked : ""} ${
          done ? styles.cardDone : ""
        }`}
        onClick={onClick}
        disabled={locked}
        aria-label={`${lesson.title}: ${lesson.subtitle}${
          locked ? ", zablokowana" : done ? ", ukończona" : ""
        }`}
      >
        <div className={styles.stopHead}>
          <span className={styles.stopLabel}>{lesson.title}</span>
          {isNext && <span className={styles.nextBadge}>teraz</span>}
          {done && <span className={styles.doneBadge}>ukończona</span>}
        </div>
        <span className={styles.stopTitle}>{lesson.subtitle}</span>
        <span className={styles.stopDesc}>{lesson.description}</span>
      </button>
    </li>
  );
}
