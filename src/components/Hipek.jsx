import { useState, useRef, useEffect } from "react";
import { MASCOT_NAME } from "../config";
import { asset } from "../utils/asset";
import styles from "./Hipek.module.css";

/**
 * Hipek — floating mascot button.
 * Props:
 *   cues: [{ label, audioSrc }]  — list of available voice cues
 *   activeCueIndex: number|null  — if set, auto-plays that cue and shows bubble
 */
export default function Hipek({ cues = [], activeCueIndex = null }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentCue, setCurrentCue] = useState(null);
  const audioRef = useRef(null);

  // Auto-trigger when parent advances activeCueIndex
  useEffect(() => {
    if (activeCueIndex !== null && cues[activeCueIndex]) {
      setCurrentCue(activeCueIndex);
      setOpen(true);
      playCue(cues[activeCueIndex].audioSrc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCueIndex]);

  function playCue(src) {
    if (!src) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = asset(src);
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  function handleCueClick(index) {
    setCurrentCue(index);
    playCue(cues[index].audioSrc);
  }

  function handleAudioEnd() {
    setPlaying(false);
  }

  const activeCue = currentCue !== null ? cues[currentCue] : null;

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label={`${MASCOT_NAME}: wskazówki`}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>{MASCOT_NAME} mówi</span>
            <button
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Zamknij panel Hipka"
            >
              ×
            </button>
          </div>

          {activeCue && (
            <div className={styles.activeCue}>
              <span className={playing ? styles.speakingDot : styles.idleDot} />
              <span>{activeCue.label}</span>
            </div>
          )}

          <ul className={styles.cueList}>
            {cues.map((cue, i) => (
              <li key={i}>
                <button
                  className={`${styles.cueBtn} ${currentCue === i && playing ? styles.active : ""}`}
                  onClick={() => handleCueClick(i)}
                >
                  <span className={styles.playIcon}>▶</span>
                  {cue.label}
                </button>
              </li>
            ))}
          </ul>

          {cues.length === 0 && (
            <p className={styles.empty}>Brak wskazówek w tej sekcji.</p>
          )}
        </div>
      )}

      <button
        className={`${styles.bubble} ${playing ? styles.talking : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={`Otwórz ${MASCOT_NAME}`}
        title={MASCOT_NAME}
      >
        <img
          src={asset("/assets/characters/hipek_idle.png")}
          alt={MASCOT_NAME}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <span className={styles.bubbleFallback}>H</span>
        {playing && <span className={styles.speakingRing} />}
      </button>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnd} />
    </div>
  );
}
