import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lessons from "../data/lessons";
import { HERO_NAME } from "../config";
import { markLessonComplete } from "../utils/progress";
import Hipek from "../components/Hipek";
import Quiz from "../components/Quiz";
import SentenceBuilder from "../components/exercises/SentenceBuilder";
import FillBlank from "../components/exercises/FillBlank";
import MatchPairs from "../components/exercises/MatchPairs";
import DialogueBlock from "../components/DialogueBlock";
import styles from "./LessonPage.module.css";

// Lesson has three phases: cutscene → learn → quiz
const PHASE = { CUTSCENE: "cutscene", LEARN: "learn", QUIZ: "quiz" };

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = lessons.find((l) => l.id === Number(id));

  const [phase, setPhase] = useState(
    lesson?.cutscene?.src ? PHASE.CUTSCENE : PHASE.LEARN
  );
  const [hipekCueIndex, setHipekCueIndex] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const videoRef = useRef(null);

  if (!lesson) {
    return (
      <div className={styles.notFound}>
        <p>Nie znaleziono lekcji.</p>
        <button onClick={() => navigate("/")}>← Powrót</button>
      </div>
    );
  }

  // Track which vocab word was last clicked to trigger Hipek cues
  function handleVocabClick(wordIndex) {
    const cue = lesson.hipekCues.find(
      (c) => c.triggerAfterVocabIndex === wordIndex
    );
    if (cue) {
      const cueIndex = lesson.hipekCues.indexOf(cue);
      setHipekCueIndex(cueIndex);
    }
  }

  function handleQuizComplete(score, total) {
    setQuizScore({ score, total });
    setQuizDone(true);
    markLessonComplete(lesson.id);
  }

  return (
    <div className={styles.page}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Powrót
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.lessonLabel}>{lesson.title}</span>
          <span className={styles.lessonSub}>{lesson.subtitle}</span>
        </div>
        <PhaseIndicator phase={phase} />
      </div>

      {/* ── Cutscene phase ───────────────────────────────────────────────── */}
      {phase === PHASE.CUTSCENE && (
        <div className={styles.cutsceneWrapper}>
          <div className={styles.cutsceneContainer}>
            {lesson.cutscene.src ? (
              <video
                ref={videoRef}
                className={styles.video}
                src={lesson.cutscene.src}
                poster={lesson.cutscene.poster}
                controls
                onEnded={() => setPhase(PHASE.LEARN)}
              />
            ) : (
              <CutscenePlaceholder lesson={lesson} />
            )}
          </div>
          <button
            className={styles.skipBtn}
            onClick={() => setPhase(PHASE.LEARN)}
          >
            Pomiń scenę i zacznij lekcję →
          </button>
        </div>
      )}

      {/* ── Learn phase ──────────────────────────────────────────────────── */}
      {phase === PHASE.LEARN && (
        <div className={styles.learnWrapper}>
          <div className={styles.learnContent}>
            {/* Story content blocks */}
            <section className={styles.storySection}>
              <h2 className={styles.sectionTitle}>Historia</h2>
              {lesson.content.map((block, i) => (
                <ContentBlock key={i} block={block} />
              ))}
            </section>

            {/* Vocabulary */}
            {lesson.vocabulary.length > 0 && (
              <section className={styles.vocabSection}>
                <h2 className={styles.sectionTitle}>Słówka z tej lekcji</h2>
                <p className={styles.vocabHint}>
                  Kliknij słówko, żeby posłuchać wskazówki od Hipka.
                </p>
                <div className={styles.vocabGrid}>
                  {lesson.vocabulary.map((word, i) => (
                    <VocabCard
                      key={i}
                      word={word}
                      index={i}
                      onClick={handleVocabClick}
                      hasHipekCue={lesson.hipekCues.some(
                        (c) => c.triggerAfterVocabIndex === i
                      )}
                    />
                  ))}
                </div>
              </section>
            )}

            <div className={styles.learnFooter}>
              <button
                className={styles.quizBtn}
                onClick={() => setPhase(PHASE.QUIZ)}
              >
                Sprawdź wiedzę →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quiz phase ───────────────────────────────────────────────────── */}
      {phase === PHASE.QUIZ && (
        <div className={styles.quizWrapper}>
          <div className={styles.quizContent}>
            <h2 className={styles.sectionTitle}>Sprawdzenie</h2>
            {!quizDone ? (
              <Quiz
                questions={lesson.quiz}
                onComplete={handleQuizComplete}
              />
            ) : (
              <QuizResults
                score={quizScore.score}
                total={quizScore.total}
                onReview={() => setPhase(PHASE.LEARN)}
                onHome={() => navigate("/")}
                styles={styles}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Hipek (floating, always visible during learn/quiz) ───────────── */}
      {phase !== PHASE.CUTSCENE && (
        <Hipek cues={lesson.hipekCues} activeCueIndex={hipekCueIndex} />
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function PhaseIndicator({ phase }) {
  const steps = [
    { key: PHASE.CUTSCENE, label: "Scenka" },
    { key: PHASE.LEARN, label: "Lekcja" },
    { key: PHASE.QUIZ, label: "Quiz" },
  ];
  return (
    <div className={styles.phaseIndicator}>
      {steps.map((s, i) => (
        <span
          key={s.key}
          className={`${styles.phaseStep} ${phase === s.key ? styles.phaseActive : ""}`}
        >
          {i > 0 && <span className={styles.phaseDivider}>›</span>}
          {s.label}
        </span>
      ))}
    </div>
  );
}

function CutscenePlaceholder({ lesson }) {
  return (
    <div className={styles.cutscenePlaceholder}>
      <div className={styles.placeholderScene}>
        <img
          src="/assets/backgrounds/airport.jpg"
          alt="Lotnisko"
          className={styles.placeholderBg}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className={styles.placeholderOverlay}>
          <img
            src="/assets/characters/marek_confused.png"
            alt={HERO_NAME}
            className={styles.placeholderChar}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className={styles.speechBubble}>
            <p>„¿Dónde está mi maleta?!"</p>
            <span className={styles.speechSub}>Gdzie jest moja walizka?!</span>
          </div>
        </div>
      </div>
      <p className={styles.placeholderNote}>
        📽 Tu będzie animowana cutscenka. Na razie mamy podgląd sceny.
      </p>
    </div>
  );
}

function ContentBlock({ block }) {
  if (block.type === "sentence-builder") return <SentenceBuilder block={block} />;
  if (block.type === "fill-blank")       return <FillBlank block={block} />;
  if (block.type === "match-pairs")      return <MatchPairs block={block} />;

  if (block.type === "tip") {
    return (
      <div className={styles.tipBlock}>
        <span className={styles.tipIcon}>💡</span>
        <p>{block.text}</p>
      </div>
    );
  }

  if (block.type === "dialogue") {
    return <DialogueBlock block={block} />;
  }

  if (block.type === "grammar") {
    return (
      <div className={styles.grammarBlock}>
        <div className={styles.grammarHeader}>
          <span className={styles.grammarIcon}>📐</span>
          <span className={styles.grammarTitle}>{block.title}</span>
        </div>
        <p className={styles.grammarBody}>{block.body}</p>
        {block.examples && (
          <ul className={styles.grammarExamples}>
            {block.examples.map((ex, i) => (
              <li key={i}>
                <strong>{ex.es}</strong>
                <span> — {ex.pl}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // default: type === "text" — support **bold**
  const parts = block.text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={styles.textBlock}>
      {parts.map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </p>
  );
}

function QuizResults({ score, total, onReview, onHome, styles }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className={styles.quizDone}>
      <div className={styles.resultsCard}>
        <div className={styles.resultsEmoji} role="img" aria-label="wynik">
          {pct === 100 ? "🏆" : pct >= 60 ? "🎉" : "📚"}
        </div>
        <h3 className={styles.resultsTitle}>
          {pct === 100
            ? "Idealnie!"
            : pct >= 80
            ? "Świetnie!"
            : pct >= 60
            ? "Nieźle!"
            : `${HERO_NAME} by się popłakał, ale nie poddawaj się!`}
        </h3>
        <p className={styles.resultsScore}>
          {score} / {total} poprawnych ({pct}%)
        </p>
      </div>
      <div className={styles.quizNav}>
        <button className={styles.reviewBtn} onClick={onReview}>
          ← Wróć do lekcji
        </button>
        <button className={styles.homeBtn} onClick={onHome}>
          Strona główna
        </button>
      </div>
    </div>
  );
}

function VocabCard({ word, index, onClick, hasHipekCue }) {
  return (
    <button
      className={`${styles.vocabCard} ${hasHipekCue ? styles.vocabHasCue : ""}`}
      onClick={() => onClick(index)}
      aria-label={`${word.es} — ${word.pl}`}
    >
      {hasHipekCue && <span className={styles.cueIndicator} title="Hipek ma wskazówkę!">H</span>}
      <span className={styles.vocabEs}>{word.es}</span>
      <span className={styles.vocabPronunciation}>[{word.pronunciation}]</span>
      <span className={styles.vocabPl}>{word.pl}</span>
    </button>
  );
}
