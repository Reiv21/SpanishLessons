import { useNavigate } from "react-router-dom";
import { PLATFORM_NAME, HERO_NAME, TAGLINE } from "../config";
import lessons from "../data/lessons";
import { getProgress } from "../utils/progress";
import { asset } from "../utils/asset";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const progress = getProgress();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>{PLATFORM_NAME}</h1>
        <p className={styles.tagline}>{TAGLINE}</p>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.heroAvatar}>
            <img
              src={asset("/assets/characters/marek_neutral.png")}
              alt={HERO_NAME}
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className={styles.heroAvatarPlaceholder}>{HERO_NAME[0]}</div>
          </div>
          <div className={styles.heroText}>
            <h2>Poznaj {HERO_NAME}a</h2>
            <p>
              Polak, 30 lat, właśnie wylądował w Barcelonie z jedną walizką
              i zerową znajomością hiszpańskiego. Towarzysz mu w tej przygodzie
              i przy okazji naucz się języka.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.lessonsSection}>
        <h2 className={styles.sectionTitle}>Lekcje</h2>
        <div className={styles.lessonList}>
          {lessons.map((lesson) => {
            const done = progress.completedLessons.includes(lesson.id);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                done={done}
                onClick={() => !lesson.locked && navigate(`/lesson/${lesson.id}`)}
              />
            );
          })}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>
          {PLATFORM_NAME} · prototyp pitchowy ·{" "}
          <span role="img" aria-label="Spain flag">🇪🇸</span>
        </p>
      </footer>
    </div>
  );
}

function LessonCard({ lesson, done, onClick }) {
  const locked = lesson.locked;
  return (
    <button
      className={`${styles.lessonCard} ${locked ? styles.locked : ""} ${done ? styles.done : ""}`}
      onClick={onClick}
      disabled={locked}
      aria-label={`${lesson.title}: ${lesson.subtitle}${locked ? ", zablokowana" : ""}`}
    >
      <div className={styles.lessonNumber}>
        {done ? "✓" : locked ? "🔒" : lesson.id}
      </div>
      <div className={styles.lessonInfo}>
        <span className={styles.lessonTitle}>{lesson.title}</span>
        <span className={styles.lessonSubtitle}>{lesson.subtitle}</span>
        <span className={styles.lessonDesc}>{lesson.description}</span>
      </div>
      {!locked && !done && (
        <div className={styles.lessonArrow}>→</div>
      )}
    </button>
  );
}
