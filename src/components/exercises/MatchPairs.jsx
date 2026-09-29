import { useState, useMemo, useEffect } from "react";
import { renderRich } from "../../utils/richText";
import styles from "./MatchPairs.module.css";

/**
 * MatchPairs — dwie kolumny (ES / PL), klik po jednym z każdej = para.
 *
 * Tryby sprawdzania (block.checkMode):
 *   "immediate" (domyślny) — po każdym połączeniu od razu wiadomo dobrze/źle,
 *                            błędne odbijają. (dobre do szybkiej gry)
 *   "onSubmit"             — uczeń łączy wszystko, dopiero klik "Sprawdź"
 *                            pokazuje które pary są dobre/złe. (bez prób i błędów)
 *
 * Data shape:
 * {
 *   type: "match-pairs",
 *   instruction: "Relaciona español y polaco.",
 *   checkMode: "onSubmit",
 *   pairs: [ { es: "Hola", pl: "Cześć" }, ... ],
 * }
 */
export default function MatchPairs({ block, onComplete }) {
  const pairs = block.pairs;
  const onSubmit = block.checkMode === "onSubmit";

  const esItems = useMemo(
    () => shuffle(pairs.map((p, i) => ({ id: i, text: p.es }))),
    [pairs]
  );
  const plItems = useMemo(
    () => shuffle(pairs.map((p, i) => ({ id: i, text: p.pl }))),
    [pairs]
  );

  if (onSubmit) {
    return (
      <OnSubmitMatch
        block={block}
        esItems={esItems}
        plItems={plItems}
        onComplete={onComplete}
      />
    );
  }
  return (
    <ImmediateMatch
      block={block}
      esItems={esItems}
      plItems={plItems}
      onComplete={onComplete}
    />
  );
}

/* ── Tryb 1: natychmiastowy feedback (oryginalne zachowanie) ───────────── */
function ImmediateMatch({ block, esItems, plItems, onComplete }) {
  const pairs = block.pairs;
  const [matched, setMatched] = useState(new Set());
  const [wrong, setWrong] = useState(new Set());
  const [selEs, setSelEs] = useState(null);
  const [selPl, setSelPl] = useState(null);

  const done = matched.size === pairs.length;
  useEffect(() => {
    if (done) onComplete?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function selectEs(id) {
    if (matched.has(id) || wrong.has(id)) return;
    const next = selEs === id ? null : id;
    setSelEs(next);
    if (next !== null && selPl !== null) resolve(next, selPl);
  }
  function selectPl(id) {
    if (matched.has(id) || wrong.has(id)) return;
    const next = selPl === id ? null : id;
    setSelPl(next);
    if (selEs !== null && next !== null) resolve(selEs, next);
  }
  function resolve(esId, plId) {
    if (esId === plId) {
      setMatched((m) => new Set([...m, esId]));
      setSelEs(null);
      setSelPl(null);
    } else {
      setWrong(new Set([esId, plId]));
      setTimeout(() => {
        setWrong(new Set());
        setSelEs(null);
        setSelPl(null);
      }, 700);
    }
  }
  function reset() {
    setMatched(new Set());
    setWrong(new Set());
    setSelEs(null);
    setSelPl(null);
  }

  const stateOf = (id, sel) =>
    matched.has(id) ? "matched" : wrong.has(id) ? "wrong" : sel === id ? "selected" : "idle";

  return (
    <div className={styles.wrapper}>
      <Instruction block={block} />
      {done ? (
        <DoneMsg onReset={reset} />
      ) : (
        <Grid
          esItems={esItems}
          plItems={plItems}
          esState={(id) => stateOf(id, selEs)}
          plState={(id) => stateOf(id, selPl)}
          onEs={selectEs}
          onPl={selectPl}
        />
      )}
      {!done && (
        <p className={styles.progress}>
          {matched.size} / {pairs.length} dopasowanych
        </p>
      )}
    </div>
  );
}

/* ── Tryb 2: sprawdzenie na koniec ─────────────────────────────────────── */
function OnSubmitMatch({ block, esItems, plItems, onComplete }) {
  const pairs = block.pairs;
  // links: esId -> { plId, num }. num to STABILNY numer połączenia (nie zmienia
  // się przy dodawaniu/usuwaniu innych par), przydzielany z licznika nextNum.
  const [links, setLinks] = useState({});
  const [nextNum, setNextNum] = useState(1);
  const [selEs, setSelEs] = useState(null);
  const [selPl, setSelPl] = useState(null);
  const [checked, setChecked] = useState(false);

  const linkedEs = new Set(Object.keys(links).map(Number));
  const linkedPl = new Set(Object.values(links).map((v) => v.plId));
  const linkCount = Object.keys(links).length;
  const allLinked = linkCount === pairs.length;

  function selectEs(id) {
    if (checked) return;
    if (linkedEs.has(id)) {
      // klik w już połączony ES = rozłącz
      setLinks((l) => {
        const n = { ...l };
        delete n[id];
        return n;
      });
      setSelEs(null);
      return;
    }
    const next = selEs === id ? null : id;
    setSelEs(next);
    if (next !== null && selPl !== null) link(next, selPl);
  }
  function selectPl(id) {
    if (checked) return;
    if (linkedPl.has(id)) {
      // rozłącz parę wskazującą na ten PL
      setLinks((l) =>
        Object.fromEntries(Object.entries(l).filter(([, v]) => v.plId !== id))
      );
      setSelPl(null);
      return;
    }
    const next = selPl === id ? null : id;
    setSelPl(next);
    if (selEs !== null && next !== null) link(selEs, next);
  }
  function link(esId, plId) {
    setLinks((l) => ({ ...l, [esId]: { plId, num: nextNum } }));
    setNextNum((n) => n + 1);
    setSelEs(null);
    setSelPl(null);
  }
  function check() {
    setChecked(true);
    const allCorrect = pairs.every((_, i) => links[i]?.plId === i);
    if (allCorrect) onComplete?.();
  }
  function reset() {
    setLinks({});
    setNextNum(1);
    setSelEs(null);
    setSelPl(null);
    setChecked(false);
  }

  // odwzorowanie plId -> { esId, num } (do stanu i badge po stronie PL)
  const plToLink = {};
  Object.entries(links).forEach(([esId, v]) => {
    plToLink[v.plId] = { esId: Number(esId), num: v.num };
  });

  const esState = (id) => {
    if (checked) return links[id]?.plId === id ? "matched" : linkedEs.has(id) ? "wrong" : "idle";
    return selEs === id ? "selected" : linkedEs.has(id) ? "linked" : "idle";
  };
  const plState = (id) => {
    if (checked) {
      const lk = plToLink[id];
      return lk && lk.esId === id ? "matched" : linkedPl.has(id) ? "wrong" : "idle";
    }
    return selPl === id ? "selected" : linkedPl.has(id) ? "linked" : "idle";
  };

  const correctCount = pairs.filter((_, i) => links[i]?.plId === i).length;

  return (
    <div className={styles.wrapper}>
      <Instruction block={block} />
      <Grid
        esItems={esItems}
        plItems={plItems}
        esState={esState}
        plState={plState}
        esBadge={(id) => (!checked && links[id] ? links[id].num : null)}
        plBadge={(id) => (!checked && plToLink[id] ? plToLink[id].num : null)}
        onEs={selectEs}
        onPl={selectPl}
      />

      <div className={styles.submitRow}>
        {!checked ? (
          <button
            className={styles.checkBtn}
            onClick={check}
            disabled={!allLinked}
          >
            Sprawdź
          </button>
        ) : (
          <>
            <span className={styles.scoreMsg}>
              {correctCount} / {pairs.length} poprawnych
            </span>
            <button className={styles.resetBtn} onClick={reset}>
              Spróbuj ponownie
            </button>
          </>
        )}
        {!checked && (
          <span className={styles.progress}>
            {linkCount} / {pairs.length} połączonych
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Wspólne kawałki UI ────────────────────────────────────────────────── */
function Instruction({ block }) {
  return (
    <p className={styles.instruction}>
      <span className={styles.badge}>{block.badge ?? "Ćwiczenie"}</span>
      {renderRich(block.instruction ?? "Połącz słówka z tłumaczeniami:")}
    </p>
  );
}

function DoneMsg({ onReset }) {
  return (
    <div className={styles.doneMsg}>
      <span className={styles.doneEmoji}>🎉</span>
      <span>Wszystkie pary dopasowane!</span>
      <button className={styles.resetBtn} onClick={onReset}>
        Zagraj jeszcze raz
      </button>
    </div>
  );
}

function Grid({ esItems, plItems, esState, plState, onEs, onPl, esBadge, plBadge }) {
  return (
    <div className={styles.grid}>
      <div className={styles.col}>
        <span className={styles.colLabel}>🇪🇸 Español</span>
        {esItems.map((item) => (
          <PairCard
            key={item.id}
            text={item.text}
            state={esState(item.id)}
            badge={esBadge?.(item.id)}
            onClick={() => onEs(item.id)}
          />
        ))}
      </div>
      <div className={styles.col}>
        <span className={styles.colLabel}>🇵🇱 Polski</span>
        {plItems.map((item) => (
          <PairCard
            key={item.id}
            text={item.text}
            state={plState(item.id)}
            badge={plBadge?.(item.id)}
            onClick={() => onPl(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PairCard({ text, state, onClick, badge }) {
  return (
    <button
      className={`${styles.card} ${styles[state]}`}
      onClick={state !== "matched" ? onClick : undefined}
      disabled={state === "matched"}
      aria-pressed={state === "selected"}
    >
      {badge != null && <span className={styles.linkBadge}>{badge}</span>}
      {renderRich(text)}
    </button>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
