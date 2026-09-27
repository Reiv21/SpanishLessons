import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTemplate, cloneDefaultBlock } from "../data/exerciseTemplates";
import SentenceBuilder from "../components/exercises/SentenceBuilder";
import MatchPairs from "../components/exercises/MatchPairs";
import MultiChoice from "../components/exercises/MultiChoice";
import FillBlank from "../components/exercises/FillBlank";
import TrueFalse from "../components/exercises/TrueFalse";
import Anagram from "../components/exercises/Anagram";
import SortItems from "../components/exercises/SortItems";
import Crossword from "../components/exercises/Crossword";
import PictureChoice from "../components/exercises/PictureChoice";
import ExerciseEditor from "../components/ExerciseEditor";
import styles from "./ExercisePlayground.module.css";

const COMPONENTS = {
  "sentence-builder": SentenceBuilder,
  "match-pairs": MatchPairs,
  "multi-choice": MultiChoice,
  "fill-blank": FillBlank,
  "true-false": TrueFalse,
  "anagram": Anagram,
  "sort-items": SortItems,
  "crossword": Crossword,
  "picture-choice": PictureChoice,
};

export default function ExercisePlayground() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const template = getTemplate(slug);

  // Blok edytowalny — startuje od domyślnego przykładu.
  const [block, setBlock] = useState(() =>
    template ? cloneDefaultBlock(template) : null
  );
  // Wersja podbijana przy "Zastosuj" / "Reset", żeby przemontować ćwiczenie
  // (komponenty seedują stan wewnętrzny z propsa block przy montowaniu).
  const [version, setVersion] = useState(0);

  const Cmp = template ? COMPONENTS[template.type] : null;

  // Snapshot bloku dla podglądu — zmienia się dopiero po "Zastosuj".
  const [appliedBlock, setAppliedBlock] = useState(() =>
    template ? cloneDefaultBlock(template) : null
  );

  const previewKey = useMemo(() => `${slug}-${version}`, [slug, version]);

  if (!template) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <p>Nie znaleziono takiego zadania.</p>
          <button onClick={() => navigate("/zadania")}>← Wróć do listy</button>
        </div>
      </div>
    );
  }

  function apply(nextBlock) {
    setAppliedBlock(JSON.parse(JSON.stringify(nextBlock)));
    setVersion((v) => v + 1);
  }

  function resetToDefault() {
    const fresh = cloneDefaultBlock(template);
    setBlock(fresh);
    setAppliedBlock(fresh);
    setVersion((v) => v + 1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/zadania")}>
          ← Wszystkie zadania
        </button>
        <div className={styles.topBarTitle}>
          <span className={styles.kicker}>{template.icon} Podgląd zadania</span>
          <span className={styles.title}>{template.name}</span>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Edytor */}
        <section className={styles.editorPane} aria-label="Edytor treści">
          <div className={styles.paneHeader}>
            <h2>Edytuj treść</h2>
            <button className={styles.resetBtn} onClick={resetToDefault}>
              Przywróć przykład
            </button>
          </div>
          <ExerciseEditor
            type={template.type}
            block={block}
            onChange={setBlock}
            onApply={() => apply(block)}
          />
        </section>

        {/* Podgląd */}
        <section className={styles.previewPane} aria-label="Podgląd zadania">
          <div className={styles.paneHeader}>
            <h2>Podgląd na żywo</h2>
            <span className={styles.previewHint}>tak zobaczy to uczeń</span>
          </div>
          <div className={styles.previewStage}>
            {Cmp && <Cmp key={previewKey} block={appliedBlock} />}
          </div>
        </section>
      </div>
    </div>
  );
}
