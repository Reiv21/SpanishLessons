import { useState } from "react";
import { renderRich } from "../utils/richText";
import styles from "./ExerciseEditor.module.css";

/**
 * ExerciseEditor — formularz dopasowany do typu zadania.
 * Edytuje `block` przez onChange (kontrolowany), a onApply wypycha zmiany
 * do podglądu (przemontowanie ćwiczenia).
 */
export default function ExerciseEditor({ type, block, onChange, onApply }) {
  // pomocnik do aktualizacji pojedynczego pola
  const set = (patch) => onChange({ ...block, ...patch });
  // tryb zaawansowanego formatowania — pokazuje ściągawkę składni
  const [showFormatting, setShowFormatting] = useState(false);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      {/* Wspólne: nazwa (plakietka) + polecenie */}
      <Field
        label="Nazwa / plakietka"
        hint='Krótka etykieta nad ćwiczeniem, np. „Escena 1” albo „Verdadero o falso”.'
      >
        <input
          className={styles.input}
          value={block.badge ?? ""}
          onChange={(e) => set({ badge: e.target.value })}
          placeholder="np. Escena 1. El problema de Przemek"
        />
      </Field>
      <Field label="Polecenie">
        <input
          className={styles.input}
          value={block.instruction ?? ""}
          onChange={(e) => set({ instruction: e.target.value })}
          placeholder="np. Relaciona español y polaco."
        />
      </Field>

      {/* Tryb zaawansowanego formatowania tekstu */}
      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={showFormatting}
          onChange={(e) => setShowFormatting(e.target.checked)}
        />
        <span>Zaawansowane formatowanie tekstu</span>
      </label>
      {showFormatting && <FormattingHelp />}

      {type === "sentence-builder" && (
        <SentenceBuilderFields block={block} set={set} />
      )}
      {type === "fill-blank" && <FillBlankFields block={block} set={set} />}
      {type === "match-pairs" && <MatchPairsFields block={block} set={set} />}
      {type === "multi-choice" && <MultiChoiceFields block={block} set={set} />}
      {type === "true-false" && <TrueFalseFields block={block} set={set} />}
      {type === "anagram" && <AnagramFields block={block} set={set} />}
      {type === "sort-items" && <SortItemsFields block={block} set={set} />}
      {type === "crossword" && <CrosswordFields block={block} set={set} />}
      {type === "picture-choice" && (
        <PictureChoiceFields block={block} set={set} />
      )}

      <button type="submit" className={styles.applyBtn}>
        Zastosuj i podejrzyj →
      </button>
    </form>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </label>
  );
}

// Ściągawka składni formatowania — działa w polu Polecenie oraz w treści zadań.
const FORMAT_ROWS = [
  { syntax: "**tekst**", desc: "pogrubienie", demo: "**hola**" },
  { syntax: "*tekst*", desc: "kursywa", demo: "*hola*" },
  { syntax: "==tekst==", desc: "podświetlenie", demo: "==hola==" },
  { syntax: "{red:tekst}", desc: "kolor (nazwa CSS)", demo: "{red:hola}" },
  { syntax: "{#e74c3c:tekst}", desc: "kolor (hex)", demo: "{#e74c3c:hola}" },
];

function FormattingHelp() {
  return (
    <div className={styles.formatHelp}>
      <p className={styles.formatHelpTitle}>
        Wpisz te znaczniki wprost w tekst polecenia lub odpowiedzi:
      </p>
      <table className={styles.formatTable}>
        <thead>
          <tr>
            <th>Wpisujesz</th>
            <th>Efekt</th>
            <th>Podgląd</th>
          </tr>
        </thead>
        <tbody>
          {FORMAT_ROWS.map((r) => (
            <tr key={r.syntax}>
              <td><code>{r.syntax}</code></td>
              <td>{r.desc}</td>
              <td>{renderRich(r.demo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.formatHelpNote}>
        Można łączyć, np. <code>Uwaga na {"{red:**está**}"}</code>. Kolory
        przyjmują nazwy CSS (red, blue, green…) albo hex (#e74c3c).
      </p>
    </div>
  );
}

/* ── Sentence builder ──────────────────────────────────────────────────── */
function SentenceBuilderFields({ block, set }) {
  return (
    <>
      <Field
        label="Słowa (poprawna kolejność)"
        hint="Oddziel słowa spacją. Uczeń zobaczy je wymieszane."
      >
        <input
          className={styles.input}
          value={block.words.join(" ")}
          onChange={(e) =>
            set({ words: e.target.value.split(/\s+/).filter(Boolean) })
          }
          placeholder="¿Dónde está mi maleta?"
        />
      </Field>
      <Field label="Tłumaczenie (PL)">
        <input
          className={styles.input}
          value={block.translation ?? ""}
          onChange={(e) => set({ translation: e.target.value })}
        />
      </Field>
    </>
  );
}

/* ── Fill blank ────────────────────────────────────────────────────────── */
function FillBlankFields({ block, set }) {
  return (
    <>
      <Field label="Pytanie po polsku (nad zdaniem)">
        <input
          className={styles.input}
          value={block.questionPl ?? ""}
          onChange={(e) => set({ questionPl: e.target.value })}
        />
      </Field>
      <div className={styles.row}>
        <Field label="Przed luką">
          <input
            className={styles.input}
            value={block.before ?? ""}
            onChange={(e) => set({ before: e.target.value })}
            placeholder="¿Dónde"
          />
        </Field>
        <Field label="Poprawna odpowiedź">
          <input
            className={styles.input}
            value={block.answer ?? ""}
            onChange={(e) => set({ answer: e.target.value })}
            placeholder="está"
          />
        </Field>
        <Field label="Po luce">
          <input
            className={styles.input}
            value={block.after ?? ""}
            onChange={(e) => set({ after: e.target.value })}
            placeholder="mi maleta?"
          />
        </Field>
      </div>
      <Field label="Podpowiedź (opcjonalnie)">
        <input
          className={styles.input}
          value={block.hint ?? ""}
          onChange={(e) => set({ hint: e.target.value })}
        />
      </Field>
      <Field label="Pełne zdanie po sprawdzeniu">
        <input
          className={styles.input}
          value={block.translation ?? ""}
          onChange={(e) => set({ translation: e.target.value })}
        />
      </Field>
    </>
  );
}

/* ── Match pairs ───────────────────────────────────────────────────────── */
function MatchPairsFields({ block, set }) {
  const pairs = block.pairs;
  const update = (i, key, val) => {
    const next = pairs.map((p, idx) => (idx === i ? { ...p, [key]: val } : p));
    set({ pairs: next });
  };
  const add = () => set({ pairs: [...pairs, { es: "", pl: "" }] });
  const remove = (i) => set({ pairs: pairs.filter((_, idx) => idx !== i) });

  return (
    <>
      <Field
        label="Kiedy pokazać wynik"
        hint="„Na końcu” = uczeń łączy wszystko i dopiero klika Sprawdź (bez prób i błędów)."
      >
        <select
          className={styles.input}
          value={block.checkMode ?? "immediate"}
          onChange={(e) => set({ checkMode: e.target.value })}
        >
          <option value="immediate">Od razu (po każdym połączeniu)</option>
          <option value="onSubmit">Na końcu (po kliknięciu „Sprawdź”)</option>
        </select>
      </Field>
    <Field label="Pary (hiszpański ↔ polski)">
      <div className={styles.list}>
        {pairs.map((p, i) => (
          <div key={i} className={styles.pairRow}>
            <input
              className={styles.input}
              value={p.es}
              onChange={(e) => update(i, "es", e.target.value)}
              placeholder="ES"
            />
            <span className={styles.pairSep}>↔</span>
            <input
              className={styles.input}
              value={p.pl}
              onChange={(e) => update(i, "pl", e.target.value)}
              placeholder="PL"
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => remove(i)}
              disabled={pairs.length <= 2}
              aria-label="Usuń parę"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={add}>
        + Dodaj parę
      </button>
    </Field>
    </>
  );
}

/* ── Multi choice ──────────────────────────────────────────────────────── */
function MultiChoiceFields({ block, set }) {
  const options = block.options;
  const update = (i, key, val) => {
    const next = options.map((o, idx) =>
      idx === i ? { ...o, [key]: val } : o
    );
    set({ options: next });
  };
  const setCorrect = (i) => {
    // pojedynczy wybór: tylko jedna poprawna; wielokrotny: przełącz
    const next = options.map((o, idx) => {
      if (block.multiple) return idx === i ? { ...o, correct: !o.correct } : o;
      return { ...o, correct: idx === i };
    });
    set({ options: next });
  };
  const add = () =>
    set({ options: [...options, { text: "", correct: false }] });
  const remove = (i) =>
    set({ options: options.filter((_, idx) => idx !== i) });

  return (
    <>
      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={!!block.multiple}
          onChange={(e) => set({ multiple: e.target.checked })}
        />
        <span>Wiele poprawnych odpowiedzi</span>
      </label>

      <Field
        label="Odpowiedzi"
        hint={
          block.multiple
            ? "Zaznacz wszystkie poprawne."
            : "Zaznacz jedną poprawną."
        }
      >
        <div className={styles.list}>
          {options.map((o, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                type={block.multiple ? "checkbox" : "radio"}
                name="mc-correct"
                checked={!!o.correct}
                onChange={() => setCorrect(i)}
                aria-label="Poprawna odpowiedź"
              />
              <input
                className={styles.input}
                value={o.text}
                onChange={(e) => update(i, "text", e.target.value)}
                placeholder="Treść odpowiedzi"
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(i)}
                disabled={options.length <= 2}
                aria-label="Usuń odpowiedź"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addBtn} onClick={add}>
          + Dodaj odpowiedź
        </button>
      </Field>

      <Field label="Komunikat przy poprawnej (opcjonalnie)">
        <input
          className={styles.input}
          value={block.feedbackCorrect ?? ""}
          onChange={(e) => set({ feedbackCorrect: e.target.value })}
        />
      </Field>
      <Field label="Komunikat przy błędnej (opcjonalnie)">
        <input
          className={styles.input}
          value={block.feedbackWrong ?? ""}
          onChange={(e) => set({ feedbackWrong: e.target.value })}
        />
      </Field>
    </>
  );
}

/* ── True / False ──────────────────────────────────────────────────────── */
function TrueFalseFields({ block, set }) {
  const stmts = block.statements ?? [];
  const update = (i, key, val) =>
    set({ statements: stmts.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)) });
  const add = () => set({ statements: [...stmts, { text: "", answer: true }] });
  const remove = (i) =>
    set({ statements: stmts.filter((_, idx) => idx !== i) });

  return (
    <>
      <Field label="Limit czasu (sekundy, 0 = bez limitu)">
        <input
          className={styles.input}
          type="number"
          min="0"
          value={block.timeLimit ?? 0}
          onChange={(e) => set({ timeLimit: Number(e.target.value) || 0 })}
        />
      </Field>
      <div className={styles.row}>
        <Field label="Domyślny lewy przycisk" hint="np. Verdadero, Sí, Bueno">
          <input
            className={styles.input}
            value={block.trueLabel ?? ""}
            onChange={(e) => set({ trueLabel: e.target.value })}
            placeholder="Prawda"
          />
        </Field>
        <Field label="Domyślny prawy przycisk" hint="np. Falso, No, Malo">
          <input
            className={styles.input}
            value={block.falseLabel ?? ""}
            onChange={(e) => set({ falseLabel: e.target.value })}
            placeholder="Fałsz"
          />
        </Field>
      </div>

      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={!!block.perRowLabels}
          onChange={(e) => set({ perRowLabels: e.target.checked })}
        />
        <span>Osobne etykiety przycisków dla każdego wiersza</span>
      </label>

      <Field label="Stwierdzenia">
        <div className={styles.list}>
          {stmts.map((s, i) => {
            const tl = s.trueLabel ?? block.trueLabel ?? "Prawda";
            const fl = s.falseLabel ?? block.falseLabel ?? "Fałsz";
            return (
              <div key={i} className={styles.crosswordRow}>
                <div className={styles.optionRow}>
                  <input
                    className={styles.input}
                    value={s.text}
                    onChange={(e) => update(i, "text", e.target.value)}
                    placeholder="Treść stwierdzenia"
                  />
                  <select
                    className={styles.input}
                    style={{ flex: "0 0 130px" }}
                    value={s.answer ? "true" : "false"}
                    onChange={(e) => update(i, "answer", e.target.value === "true")}
                  >
                    <option value="true">Poprawne: {tl}</option>
                    <option value="false">Poprawne: {fl}</option>
                  </select>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => remove(i)}
                    disabled={stmts.length <= 1}
                    aria-label="Usuń stwierdzenie"
                  >
                    ✕
                  </button>
                </div>
                {block.perRowLabels && (
                  <div className={styles.optionRow}>
                    <input
                      className={styles.input}
                      value={s.trueLabel ?? ""}
                      onChange={(e) => update(i, "trueLabel", e.target.value)}
                      placeholder={`lewy przycisk (domyślnie: ${block.trueLabel ?? "Prawda"})`}
                    />
                    <input
                      className={styles.input}
                      value={s.falseLabel ?? ""}
                      onChange={(e) => update(i, "falseLabel", e.target.value)}
                      placeholder={`prawy przycisk (domyślnie: ${block.falseLabel ?? "Fałsz"})`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button type="button" className={styles.addBtn} onClick={add}>
          + Dodaj stwierdzenie
        </button>
      </Field>
    </>
  );
}

/* ── Anagram ───────────────────────────────────────────────────────────── */
function AnagramFields({ block, set }) {
  return (
    <>
      <Field label="Słowo (poprawne)">
        <input
          className={styles.input}
          value={block.word ?? ""}
          onChange={(e) => set({ word: e.target.value })}
          placeholder="gracias"
        />
      </Field>
      <Field label="Podpowiedź (np. tłumaczenie)">
        <input
          className={styles.input}
          value={block.hint ?? ""}
          onChange={(e) => set({ hint: e.target.value })}
          placeholder="Dziękuję"
        />
      </Field>
    </>
  );
}

/* ── Sort items ────────────────────────────────────────────────────────── */
function SortItemsFields({ block, set }) {
  const cats = block.categories ?? [];
  const items = block.items ?? [];

  const setCats = (str) =>
    set({ categories: str.split(",").map((c) => c.trim()).filter(Boolean) });
  const updateItem = (i, key, val) =>
    set({ items: items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)) });
  const addItem = () =>
    set({ items: [...items, { text: "", category: cats[0] ?? "" }] });
  const removeItem = (i) =>
    set({ items: items.filter((_, idx) => idx !== i) });

  return (
    <>
      <Field label="Kategorie" hint="Oddziel przecinkiem, np: el, la">
        <input
          className={styles.input}
          value={cats.join(", ")}
          onChange={(e) => setCats(e.target.value)}
        />
      </Field>
      <Field label="Elementy i ich kategoria">
        <div className={styles.list}>
          {items.map((it, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                className={styles.input}
                value={it.text}
                onChange={(e) => updateItem(i, "text", e.target.value)}
                placeholder="Element"
              />
              <select
                className={styles.input}
                style={{ flex: "0 0 110px" }}
                value={it.category}
                onChange={(e) => updateItem(i, "category", e.target.value)}
              >
                {cats.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeItem(i)}
                disabled={items.length <= 2}
                aria-label="Usuń element"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addBtn} onClick={addItem}>
          + Dodaj element
        </button>
      </Field>
    </>
  );
}

/* ── Picture choice (opis zdjęcia + upload) ────────────────────────────── */
function PictureChoiceFields({ block, set }) {
  const options = block.options ?? [];
  const update = (i, key, val) =>
    set({ options: options.map((o, idx) => (idx === i ? { ...o, [key]: val } : o)) });
  const setCorrect = (i) => {
    const next = options.map((o, idx) => {
      if (block.multiple) return idx === i ? { ...o, correct: !o.correct } : o;
      return { ...o, correct: idx === i };
    });
    set({ options: next });
  };
  const add = () => set({ options: [...options, { text: "", correct: false }] });
  const remove = (i) => set({ options: options.filter((_, idx) => idx !== i) });

  function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => set({ image: reader.result, imageAlt: file.name });
    reader.readAsDataURL(file); // data: URL, działa w podglądzie bez uploadu na serwer
  }

  return (
    <>
      <Field
        label="Zdjęcie"
        hint="Wgraj własne zdjęcie (zostaje w przeglądarce) lub podaj ścieżkę z folderu public, np. /family.jpeg."
      >
        <input
          className={styles.input}
          type="file"
          accept="image/*"
          onChange={onUpload}
        />
        <input
          className={styles.input}
          style={{ marginTop: 6 }}
          value={block.image?.startsWith("data:") ? "" : block.image ?? ""}
          onChange={(e) => set({ image: e.target.value })}
          placeholder="/family.jpeg"
        />
        {block.image?.startsWith("data:") && (
          <span className={styles.fieldHint}>Wgrano własne zdjęcie ✓</span>
        )}
      </Field>

      <Field label="Opis alternatywny (dla dostępności)">
        <input
          className={styles.input}
          value={block.imageAlt ?? ""}
          onChange={(e) => set({ imageAlt: e.target.value })}
          placeholder="Co widać na zdjęciu"
        />
      </Field>

      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={!!block.multiple}
          onChange={(e) => set({ multiple: e.target.checked })}
        />
        <span>Wiele poprawnych zdań</span>
      </label>

      <Field
        label="Zdania"
        hint={block.multiple ? "Zaznacz wszystkie poprawne." : "Zaznacz jedno poprawne."}
      >
        <div className={styles.list}>
          {options.map((o, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                type={block.multiple ? "checkbox" : "radio"}
                name="pc-correct"
                checked={!!o.correct}
                onChange={() => setCorrect(i)}
                aria-label="Poprawne zdanie"
              />
              <input
                className={styles.input}
                value={o.text}
                onChange={(e) => update(i, "text", e.target.value)}
                placeholder="Zdanie po hiszpańsku"
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(i)}
                disabled={options.length <= 2}
                aria-label="Usuń zdanie"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={styles.addBtn} onClick={add}>
          + Dodaj zdanie
        </button>
      </Field>
    </>
  );
}

/* ── Crossword (ręczne wprowadzanie) ───────────────────────────────────── */
function CrosswordFields({ block, set }) {
  const entries = block.entries ?? [];
  const update = (i, key, val) =>
    set({ entries: entries.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)) });
  const add = () =>
    set({
      entries: [...entries, { row: 0, col: 0, dir: "across", answer: "", clue: "" }],
    });
  const remove = (i) => set({ entries: entries.filter((_, idx) => idx !== i) });

  return (
    <Field
      label="Hasła (wprowadzane ręcznie)"
      hint="Siatka nie jest generowana automatycznie. Podaj pozycję (wiersz/kolumna od 0), kierunek, hasło i wskazówkę. Hasła muszą się przecinać na wspólnych literach."
    >
      <div className={styles.list}>
        {entries.map((e, i) => (
          <div key={i} className={styles.crosswordRow}>
            <div className={styles.crosswordTop}>
              <input
                className={styles.input}
                type="number"
                min="0"
                value={e.row}
                onChange={(ev) => update(i, "row", Number(ev.target.value) || 0)}
                placeholder="wiersz"
                aria-label="wiersz"
                style={{ flex: "0 0 68px" }}
              />
              <input
                className={styles.input}
                type="number"
                min="0"
                value={e.col}
                onChange={(ev) => update(i, "col", Number(ev.target.value) || 0)}
                placeholder="kol."
                aria-label="kolumna"
                style={{ flex: "0 0 68px" }}
              />
              <select
                className={styles.input}
                value={e.dir}
                onChange={(ev) => update(i, "dir", ev.target.value)}
                style={{ flex: "0 0 110px" }}
              >
                <option value="across">poziomo</option>
                <option value="down">pionowo</option>
              </select>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(i)}
                disabled={entries.length <= 1}
                aria-label="Usuń hasło"
              >
                ✕
              </button>
            </div>
            <input
              className={styles.input}
              value={e.answer}
              onChange={(ev) => update(i, "answer", ev.target.value)}
              placeholder="HASŁO"
            />
            <input
              className={styles.input}
              value={e.clue}
              onChange={(ev) => update(i, "clue", ev.target.value)}
              placeholder="Wskazówka"
            />
          </div>
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={add}>
        + Dodaj hasło
      </button>
    </Field>
  );
}
