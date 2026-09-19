import { useState, useRef, useCallback } from "react";
import DialogueAvatar from "./DialogueAvatar";
import { asset } from "../utils/asset";
import styles from "./DialogueBlock.module.css";

/**
 * DialogueBlock — renders a full dialogue with:
 *   - "Odtwórz całość" button that plays lines sequentially
 *   - Per-line play button
 *   - Active line highlighted while audio plays
 *
 * Expects block.lines[i].audioSrc — if missing, play buttons are hidden
 * but highlighting still works on click.
 */
export default function DialogueBlock({ block }) {
  const [activeLine, setActiveLine] = useState(null); // index | null
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const audioRef = useRef(null);
  const stopRef  = useRef(false); // flag to abort sequential playback

  // ── Play a single line ────────────────────────────────────────────────
  const playLine = useCallback((index) => {
    const line = block.lines[index];
    setActiveLine(index);
    if (!line?.audioSrc || !audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = asset(line.audioSrc);
    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  }, [block.lines]);

  // ── Play all lines sequentially ───────────────────────────────────────
  async function playAll() {
    if (isPlayingAll) {
      // stop
      stopRef.current = true;
      audioRef.current?.pause();
      setIsPlayingAll(false);
      setActiveLine(null);
      return;
    }

    stopRef.current = false;
    setIsPlayingAll(true);

    for (let i = 0; i < block.lines.length; i++) {
      if (stopRef.current) break;

      const line = block.lines[i];
      setActiveLine(i);

      if (line.audioSrc && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = asset(line.audioSrc);
        audioRef.current.load();

        await new Promise((resolve) => {
          if (!audioRef.current) { resolve(); return; }
          audioRef.current.onended = resolve;
          audioRef.current.onerror = resolve; // skip missing files gracefully
          audioRef.current.play().catch(resolve);
        });

        if (stopRef.current) break;

        // short pause between lines
        await new Promise((r) => setTimeout(r, 300));
      } else {
        // no audio — just highlight for 1.5s so user can read
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    if (!stopRef.current) {
      setActiveLine(null);
      setIsPlayingAll(false);
    }
  }

  function handleAudioEnded() {
    // only clear active line when NOT in playAll mode (playAll handles it)
    if (!isPlayingAll) setActiveLine(null);
  }

  const hasAnyAudio = block.lines.some((l) => l.audioSrc);

  return (
    <div className={styles.wrapper}>
      {/* ── Play-all button ─────────────────────────────────────────── */}
      {hasAnyAudio && (
        <div className={styles.toolbar}>
          <button
            className={`${styles.playAllBtn} ${isPlayingAll ? styles.playAllActive : ""}`}
            onClick={playAll}
            aria-label={isPlayingAll ? "Zatrzymaj odtwarzanie" : "Odtwórz całą rozmowę"}
          >
            {isPlayingAll ? (
              <>
                <span className={styles.stopIcon}>■</span> Zatrzymaj
              </>
            ) : (
              <>
                <span className={styles.playIcon}>▶</span> Odtwórz rozmowę
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Lines ───────────────────────────────────────────────────── */}
      <div className={styles.lines}>
        {block.lines.map((line, i) => {
          const isMarek  = line.speaker === "marek";
          const isActive = activeLine === i;

          return (
            <div
              key={i}
              className={`${styles.line} ${isMarek ? styles.lineMarek : styles.lineOther} ${isActive ? styles.lineActive : ""}`}
            >
              {/* Avatar left (other) */}
              {!isMarek && (
                <div className={styles.avatarCol}>
                  <DialogueAvatar avatar={line.avatar} size={44} />
                  <span className={styles.speaker}>{line.speakerLabel}</span>
                </div>
              )}

              {/* Bubble */}
              <div className={styles.bubble}>
                <span className={styles.es}>{line.es}</span>
                {line.pl && <span className={styles.pl}>{line.pl}</span>}

                {/* Per-line play button */}
                {line.audioSrc && (
                  <button
                    className={`${styles.linePlayBtn} ${isActive && !isPlayingAll ? styles.linePlayActive : ""}`}
                    onClick={() => {
                      stopRef.current = true;
                      setIsPlayingAll(false);
                      playLine(i);
                    }}
                    aria-label={`Odtwórz kwestię: ${line.es}`}
                    title="Odtwórz"
                  >
                    {isActive && !isPlayingAll ? "■" : "▶"}
                  </button>
                )}
              </div>

              {/* Avatar right (Marek) */}
              {isMarek && (
                <div className={styles.avatarCol}>
                  <DialogueAvatar avatar={line.avatar} size={44} />
                  <span className={styles.speaker}>{line.speakerLabel}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
}
