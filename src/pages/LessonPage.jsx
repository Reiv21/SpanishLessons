import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lessons from "../data/lessons";
import { HERO_NAME } from "../config";
import { markLessonComplete } from "../utils/progress";
import Hipek from "../components/Hipek";
import Quiz from "../components/Quiz";
import SentenceBuilder from "../components/exercises/SentenceBuilder";
import FillBlank from "../components/exercises/FillBlank";
import MatchPairs from "../components/exercises/MatchPairs";
import MultiChoice from "../components/exercises/MultiChoice";
import DialogueBlock from "../components/DialogueBlock";
import LecturerCTA from "../components/LecturerCTA";
import { asset } from "../utils/asset";
import styles from "./LessonPage.module.css";

const PHASE = { CUTSCENE: "cutscene", LEARN: "learn", QUIZ: "quiz" };

// Exercise block types that can act as gates
const EXERCISE_TYPES = new Set(["sentence-builder", "fill-blank", "match-pairs", "multi-choice"]);

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

  // Step-by-step unlocking: index of last visible block (-1 = none yet, then grows)
  // Blocks without gate:true are always shown up to the first locked gate.
  // unlockedUpTo === content.length means everything is visible.
  const [unlockedUpTo, setUnlockedUpTo] = useState(() => {
    if (!lesson) return 0;
    // Auto-unlock everything up to (but not including) the first gate
    const firstGate = lesson.content.findIndex((b) => b.gate);
    return firstGate === -1 ? lesson.content.length : firstGate;
  });

  // "Narrative reward" flash shown briefly after completing a gate exercise
  const [showReward, setShowReward] = useState(false);
  const rewardTimerRef = useRef(null);

  // Scroll to newly unlocked block
  const newBlockRef = useRef(null);
  useEffect(() => {
    if (newBlockRef.current) {
      newBlockRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [unlockedUpTo]);

  const videoRef = useRef(null);

  if (!lesson) {
    return (
      <div className={styles.notFound}>
        <p>Nie znaleziono lekcji.</p>
        <button onClick={() => navigate("/")}>← Powrót</button>
      </div>
    );
  }

  // Called when a gated exercise is completed successfully
  function handleGateComplete(blockIndex) {
    // Find next unlock boundary: everything up to next gate (exclusive)
    const nextGate = lesson.content.findIndex(
      (b, i) => i > blockIndex && b.gate
    );
    const nextUnlock = nextGate === -1 ? lesson.content.length : nextGate;

    // Brief reward flash before revealing next content
    setShowReward(true);
    clearTimeout(rewardTimerRef.current);
    rewardTimerRef.current = setTimeout(() => {
      setShowReward(false);
      setUnlockedUpTo(nextUnlock);
    }, 1400);
  }

  function handleVocabClick(wordIndex) {
    const cue = lesson.hipekCues.find((c) => c.triggerAfterVocabIndex === wordIndex);
    if (cue) setHipekCueIndex(lesson.hipekCues.indexOf(cue));
  }

  function handleQuizComplete(score, total) {
    setQuizScore({ score, total });
    setQuizDone(true);
    markLessonComplete(lesson.id);
  }

  const totalSteps = lesson.content.filter((b) => b.gate).length + 1; // +1 for quiz
  const completedGates = lesson.content
    .slice(0, unlockedUpTo)
    .filter((b) => b.gate).length;
  const progressPct = Math.round(
    ((completedGates + (phase === PHASE.QUIZ ? 0.5 : 0)) / totalSteps) * 100
  );

  const allContentUnlocked = unlockedUpTo >= lesson.content.length;

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
        {phase === PHASE.LEARN && (
          <PhaseIndicator pct={progressPct} gates={completedGates} total={totalSteps - 1} />
        )}
        {phase === PHASE.QUIZ && (
          <span className={styles.quizLabel}>Quiz</span>
        )}
      </div>

      {/* ── Cutscene ─────────────────────────────────────────────────────── */}
      {phase === PHASE.CUTSCENE && (
        <div className={styles.cutsceneWrapper}>
          <div className={styles.cutsceneContainer}>
            {lesson.cutscene.src ? (
              <video
                ref={videoRef}
                className={styles.video}
                src={asset(lesson.cutscene.src)}
                poster={asset(lesson.cutscene.poster)}
                controls
                onEnded={() => setPhase(PHASE.LEARN)}
              />
            ) : (
              <CutscenePlaceholder lesson={lesson} />
            )}
          </div>
          <button className={styles.skipBtn} onClick={() => setPhase(PHASE.LEARN)}>
            Pomiń scenę i zacznij lekcję →
          </button>
        </div>
      )}

      {/* ── Learn ────────────────────────────────────────────────────────── */}
      {phase === PHASE.LEARN && (
        <div className={styles.learnWrapper}>
          <div className={styles.learnContent}>
            <section className={styles.storySection}>
              {lesson.content.map((block, i) => {
                if (i > unlockedUpTo) return null; // still locked
                const isNewlyUnlocked = i === unlockedUpTo && i > 0;
                return (
                  <div
                    key={i}
                    ref={isNewlyUnlocked ? newBlockRef : null}
                    className={isNewlyUnlocked ? styles.blockFadeIn : undefined}
                  >
                    <ContentBlock
                      block={block}
                      isGate={!!block.gate}
                      locked={i === unlockedUpTo && EXERCISE_TYPES.has(block.type) && false}
                      onGateComplete={() => handleGateComplete(i)}
                    />
                  </div>
                );
              })}

              {/* Narrative reward flash */}
              {showReward && (
                <div className={styles.rewardBanner} role="status">
                  <span>🎉</span>
                  <span>Świetnie! Historia toczy się dalej…</span>
                </div>
              )}
            </section>

            {/* Vocabulary — shown only after all content unlocked */}
            {allContentUnlocked && lesson.vocabulary.length > 0 && (
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

            {/* Go to quiz — only when all content unlocked */}
            {allContentUnlocked && (
              <div className={styles.learnFooter}>
                <button className={styles.quizBtn} onClick={() => setPhase(PHASE.QUIZ)}>
                  Sprawdź wiedzę →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Quiz ─────────────────────────────────────────────────────────── */}
      {phase === PHASE.QUIZ && (
        <div className={styles.quizWrapper}>
          <div className={styles.quizContent}>
            <h2 className={styles.sectionTitle}>Sprawdzenie</h2>
            {!quizDone ? (
              <Quiz questions={lesson.quiz} onComplete={handleQuizComplete} />
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

      {phase !== PHASE.CUTSCENE && (
        <Hipek cues={lesson.hipekCues} activeCueIndex={hipekCueIndex} />
      )}
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function PhaseIndicator({ pct, gates, total }) {
  return (
    <div className={styles.phaseIndicator}>
      <span className={styles.phaseLabel}>{gates}/{total} zadań</span>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.phasePct}>{pct}%</span>
    </div>
  );
}

function CutscenePlaceholder({ lesson }) {
  return (
    <div className={styles.cutscenePlaceholder}>
      <div className={styles.placeholderScene}>
        <img
          src={asset("/assets/backgrounds/airport.jpg")}
          alt="Lotnisko"
          className={styles.placeholderBg}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className={styles.placeholderOverlay}>
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

/**
 * ContentBlock wraps each block and passes onComplete to exercises that are gates.
 * Non-gate exercises still work normally — completing them just doesn't unlock anything.
 */
function ContentBlock({ block, isGate, onGateComplete }) {
  const [gateCompleted, setGateCompleted] = useState(false);

  function handleExerciseComplete() {
    if (isGate && !gateCompleted) {
      setGateCompleted(true);
      onGateComplete();
    }
  }

  const exerciseProps = isGate
    ? { onComplete: handleExerciseComplete, completed: gateCompleted }
    : {};

  const EXERCISE_BLOCKS = {
    "sentence-builder": SentenceBuilder,
    "fill-blank": FillBlank,
    "match-pairs": MatchPairs,
    "multi-choice": MultiChoice,
  };
  const ExerciseCmp = EXERCISE_BLOCKS[block.type];
  if (ExerciseCmp) {
    return (
      <div className={styles.exerciseWrap}>
        <ExerciseCmp block={block} {...exerciseProps} />
        {/* Skip: tylko dla gate'ów które jeszcze nie odblokowały dalszej treści */}
        {isGate && !gateCompleted && (
          <button
            className={styles.skipExerciseBtn}
            onClick={handleExerciseComplete}
            aria-label="Pomiń to ćwiczenie i odblokuj dalszą część"
            title="Pomiń ćwiczenie"
          >
            Pomiń ćwiczenie →
          </button>
        )}
      </div>
    );
  }

  if (block.type === "lecturer-cta") {
    return <LecturerCTA block={block} />;
  }

  if (block.type === "tip") {
    return (
      <div className={styles.tipBlock}>
        <span className={styles.tipIcon}>💡</span>
        <p>{block.text}</p>
      </div>
    );
  }

  if (block.type === "cultural") {
    return (
      <div className={styles.culturalBlock}>
        <div className={styles.culturalHeader}>
          <span className={styles.culturalIcon}>🌍</span>
          <span className={styles.culturalTitle}>{block.title}</span>
        </div>
        <p className={styles.culturalBody}>{block.body}</p>
        {block.fact && (
          <div className={styles.culturalFact}>
            <span>💬</span>
            <span>{block.fact}</span>
          </div>
        )}
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
                <span> &middot; {ex.pl}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // text — supports **bold**
  const parts = block.text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className={styles.textBlock}>
      {parts.map((part, i) =>
        part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
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
          {pct === 100 ? "Idealnie!"
            : pct >= 80 ? "Świetnie!"
            : pct >= 60 ? "Nieźle!"
            : `${HERO_NAME} by się popłakał, ale nie poddawaj się!`}
        </h3>
        <p className={styles.resultsScore}>
          {score} / {total} poprawnych ({pct}%)
        </p>
      </div>
      <div className={styles.quizNav}>
        <button className={styles.reviewBtn} onClick={onReview}>← Wróć do lekcji</button>
        <button className={styles.homeBtn} onClick={onHome}>Strona główna</button>
      </div>
    </div>
  );
}

function VocabCard({ word, index, onClick, hasHipekCue }) {
  return (
    <button
      className={`${styles.vocabCard} ${hasHipekCue ? styles.vocabHasCue : ""}`}
      onClick={() => onClick(index)}
      aria-label={`${word.es}: ${word.pl}`}
    >
      {hasHipekCue && <span className={styles.cueIndicator} title="Hipek ma wskazówkę!">H</span>}
      <span className={styles.vocabEs}>{word.es}</span>
      <span className={styles.vocabPronunciation}>[{word.pronunciation}]</span>
      <span className={styles.vocabPl}>{word.pl}</span>
    </button>
  );
}
