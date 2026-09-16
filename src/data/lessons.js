import { HERO_NAME } from "../config";

// ─── Shared avatar definitions ────────────────────────────────────────────────
// Reused across lessons so changes in one place propagate everywhere.
const AVATAR_MAREK = (expression) => ({ type: "marek", expression });
const AVATAR_AIRPORT_WORKER = {
  type: "image",
  src: "/fluatendant.png",
  alt: "Pracownica lotniska",
};
const AVATAR_TAXI = {
  type: "image",
  src: "/taxi.png",
  alt: "Kierowca taksówki",
};

// ─── Lesson content ───────────────────────────────────────────────────────────
// Block types available in content[]:
//   { type: "text", text }
//   { type: "tip", text }
//   { type: "grammar", title, body, examples: [{es, pl}] }
//   { type: "dialogue", lines: [{speaker, speakerLabel, avatar, es, pl}] }
//   { type: "sentence-builder", instruction, words:[], translation, audioSrc? }
//   { type: "fill-blank", instruction, questionPl, before, after, answer, hint?, translation, audioSrc? }
//   { type: "match-pairs", instruction, pairs: [{es, pl}] }

const lessons = [
  {
    id: 1,
    title: "Lekcja 1",
    subtitle: "Lotnisko El Prat",
    description: `${HERO_NAME} właśnie wylądował w Barcelonie. Tylko gdzie jego walizka?`,
    locked: false,
    cutscene: {
      src: null,   // zastąp: "/assets/video/lesson1_cutscene.mp4"
      poster: null,
    },

    // ── Słownictwo ────────────────────────────────────────────────────────
    vocabulary: [
      { es: "¡Hola!",         pl: "Cześć!",                    pronunciation: "o-la" },
      { es: "Por favor",      pl: "Proszę",                    pronunciation: "por fa-bor" },
      { es: "Gracias",        pl: "Dziękuję",                  pronunciation: "gra-sjas" },
      { es: "De nada",        pl: "Nie ma za co",              pronunciation: "de na-da" },
      { es: "Perdona",        pl: "Przepraszam",               pronunciation: "per-do-na" },
      { es: "¿Dónde está…?",  pl: "Gdzie jest…?",             pronunciation: "don-de es-ta" },
      { es: "Mi maleta",      pl: "Moja walizka",              pronunciation: "mi ma-le-ta" },
      { es: "El aeropuerto",  pl: "Lotnisko",                  pronunciation: "el a-e-ro-pwer-to" },
      { es: "La salida",      pl: "Wyjście",                   pronunciation: "la sa-li-da" },
      { es: "El equipaje",    pl: "Bagaż",                     pronunciation: "el e-ki-pa-che" },
      { es: "No entiendo",    pl: "Nie rozumiem",              pronunciation: "no en-tjen-do" },
      { es: "¿Habla inglés?", pl: "Czy mówi po angielsku?",   pronunciation: "a-bla in-gles" },
      { es: "Ayuda",          pl: "Pomoc",                     pronunciation: "a-ju-da" },
      { es: "Sí / No",        pl: "Tak / Nie",                 pronunciation: "si / no" },
    ],

    // ── Treść lekcji ──────────────────────────────────────────────────────
    content: [
      // — Wstęp —
      {
        type: "text",
        text: `${HERO_NAME} wylądował na lotnisku El Prat o 14:30. W plecaku: laptop, słuchawki i nadzieja. W luku bagażowym: podobno jego walizka. Podobno — bo taśma bagażowa kręci się już dwadzieścia minut, a walizki nie ma.`,
      },
      {
        type: "text",
        text: `Obok stoi pani w uniformie. ${HERO_NAME} bierze głęboki oddech i podchodzi. Wie trzy słowa po hiszpańsku. Musi jakoś to rozegrać.`,
      },

      // — Dialog 1: lotnisko —
      {
        type: "dialogue",
        lines: [
          {
            speaker: "marek",
            speakerLabel: HERO_NAME,
            avatar: AVATAR_MAREK("sad"),
            es: "Perdona… ¿dónde está mi maleta?",
            pl: "Przepraszam… gdzie jest moja walizka?",
            audioSrc: "/assets/audio/d1_marek_01.mp3",
          },
          {
            speaker: "other",
            speakerLabel: "Pracownica",
            avatar: AVATAR_AIRPORT_WORKER,
            es: "¿Su número de vuelo, por favor?",
            pl: "Numer lotu, proszę?",
            audioSrc: "/assets/audio/d1_pracownica_01.mp3",
          },
          {
            speaker: "marek",
            speakerLabel: HERO_NAME,
            avatar: AVATAR_MAREK("surprised"),
            es: "No entiendo… ¿habla inglés?",
            pl: "Nie rozumiem… czy mówi pani po angielsku?",
            audioSrc: "/assets/audio/d1_marek_02.mp3",
          },
          {
            speaker: "other",
            speakerLabel: "Pracownica",
            avatar: AVATAR_AIRPORT_WORKER,
            es: "Sí, un poco. Your bag number?",
            pl: "Tak, trochę. Numer bagażu?",
            audioSrc: "/assets/audio/d1_pracownica_02.mp3",
          },
          {
            speaker: "marek",
            speakerLabel: HERO_NAME,
            avatar: AVATAR_MAREK("happy"),
            es: "¡Gracias!",
            pl: "Dziękuję!",
            audioSrc: "/assets/audio/d1_marek_03.mp3",
          },
        ],
      },
      {
        type: "tip",
        text: `"Perdona" to miękkie przepraszam — do zaczepiania obcych. "Lo siento" to przepraszam gdy coś zepsułeś. ${HERO_NAME} użył dobrego.`,
      },

      // — Ćwiczenie 1: dopasuj pary —
      {
        type: "match-pairs",
        instruction: "Zanim idziemy dalej — połącz słówka z tłumaczeniami:",
        pairs: [
          { es: "Perdona",      pl: "Przepraszam" },
          { es: "Gracias",      pl: "Dziękuję" },
          { es: "No entiendo",  pl: "Nie rozumiem" },
          { es: "Por favor",    pl: "Proszę" },
          { es: "Sí",           pl: "Tak" },
          { es: "Ayuda",        pl: "Pomoc" },
        ],
      },

      // — Gramatyka 1 —
      {
        type: "grammar",
        title: "¿Dónde está…? — Gdzie jest…?",
        body: `To twoje pierwsze gotowe pytanie. "¿Dónde?" znaczy "gdzie?", "está" to forma czasownika "być" (dla jednej rzeczy lub osoby). Wstaw po "está" co chcesz znaleźć — i pytanie gotowe. Prosto jak budowa cepa.`,
        examples: [
          { es: "¿Dónde está mi maleta?",    pl: "Gdzie jest moja walizka?" },
          { es: "¿Dónde está la salida?",    pl: "Gdzie jest wyjście?" },
          { es: "¿Dónde está el aeropuerto?",pl: "Gdzie jest lotnisko?" },
          { es: "¿Dónde está el baño?",      pl: "Gdzie jest toaleta?" },
        ],
      },

      // — Ćwiczenie 2: uzupełnij lukę —
      {
        type: "fill-blank",
        instruction: "Uzupełnij pytanie Marka:",
        questionPl: "Gdzie jest moja walizka?",
        before: "¿Dónde",
        after: "mi maleta?",
        answer: "está",
        hint: "Forma czasownika 'estar' dla trzeciej osoby liczby pojedynczej.",
        translation: "¿Dónde está mi maleta?",
      },

      // — Dalej w historii —
      {
        type: "text",
        text: `Pracownica znalazła walizkę. Była na taśmie numer 4 zamiast 7. ${HERO_NAME} dziękuje, bierze walizkę i rusza do wyjścia. Teraz trzeba znaleźć taksówkę.`,
      },
      {
        type: "text",
        text: `Przy wyjściu stoi kierowca z kartką "MAREK". ${HERO_NAME} macha ręką. Kierowca kiwa głową, bierze walizkę i mówi coś po hiszpańsku. ${HERO_NAME} nie rozumie połowy, ale rozumie że chodzi o Barcelona centre.`,
      },

      // — Dialog 2: taksówka —
      {
        type: "dialogue",
        lines: [
          {
            speaker: "other",
            speakerLabel: "Kierowca",
            avatar: AVATAR_TAXI,
            es: "¡Hola! ¿Todo bien?",
            pl: "Hej! Wszystko dobrze?",
            audioSrc: "/assets/audio/d2_kierowca_01.mp3",
          },
          {
            speaker: "marek",
            speakerLabel: HERO_NAME,
            avatar: AVATAR_MAREK("smirk"),
            es: "Sí, gracias. ¿Vamos al centro?",
            pl: "Tak, dziękuję. Jedziemy do centrum?",
            audioSrc: "/assets/audio/d2_marek_01.mp3",
          },
          {
            speaker: "other",
            speakerLabel: "Kierowca",
            avatar: AVATAR_TAXI,
            es: "¡Claro! Barcelona centre, perfecto.",
            pl: "Oczywiście! Barcelona centrum, perfecto.",
            audioSrc: "/assets/audio/d2_kierowca_02.mp3",
          },
          {
            speaker: "marek",
            speakerLabel: HERO_NAME,
            avatar: AVATAR_MAREK("laughing"),
            es: "Muchas gracias.",
            pl: "Bardzo dziękuję.",
            audioSrc: "/assets/audio/d2_marek_02.mp3",
          },
        ],
      },
      {
        type: "tip",
        text: `"Muchas gracias" to wzmocnione dziękuję — dosłownie "wiele dziękuję". Używasz gdy chcesz podkreślić wdzięczność. "Gracias" wystarczy w 90% sytuacji.`,
      },

      // — Gramatyka 2 —
      {
        type: "grammar",
        title: "Mi, tu, su — mój, twój, jego/jej",
        body: `W hiszpańskim zaimki dzierżawcze stoją przed rzeczownikiem i są proste — nie odmieniają się przez rodzaj rzeczownika (w przeciwieństwie do polskiego).`,
        examples: [
          { es: "Mi maleta",  pl: "Moja walizka" },
          { es: "Tu maleta",  pl: "Twoja walizka" },
          { es: "Su maleta",  pl: "Jego/jej walizka" },
          { es: "Mi nombre",  pl: "Moje imię" },
        ],
      },

      // — Ćwiczenie 3: ułóż zdanie —
      {
        type: "sentence-builder",
        instruction: "Ułóż zdanie po hiszpańsku:",
        words: ["¿Dónde", "está", "la", "salida?"],
        translation: "Gdzie jest wyjście?",
      },

      // — Ćwiczenie 4: ułóż zdanie —
      {
        type: "sentence-builder",
        instruction: "Teraz to zdanie:",
        words: ["Muchas", "gracias,", "por", "favor."],
        translation: "Bardzo dziękuję, proszę.",
      },

      // — Ćwiczenie 5: uzupełnij lukę —
      {
        type: "fill-blank",
        instruction: "Marek chce podziękować z emfazą. Uzupełnij:",
        questionPl: "Bardzo dziękuję.",
        before: "Muchas",
        after: ".",
        answer: "gracias",
        hint: "Wzmocniona forma dziękuję — dosłownie 'wiele dziękuję'.",
        translation: "Muchas gracias.",
      },

      // — Podsumowanie —
      {
        type: "text",
        text: `To był intensywny dzień. ${HERO_NAME} zgubił i odnalazł walizkę, dogadał się z pracownicą i kierowcą — wyłącznie po hiszpańsku. Nie wszystko rozumiał, ale kluczowe słowa zadziałały.`,
      },
      {
        type: "tip",
        text: `Zapamiętaj te trzy ratunkowe zwroty na każdą sytuację: "No entiendo" (nie rozumiem), "Por favor" (proszę), "¿Habla inglés?" (czy mówi po angielsku?). Z nimi przeżyjesz pierwsze tygodnie.`,
      },

      // — Ćwiczenie 6: finalne utrwalenie —
      {
        type: "match-pairs",
        instruction: "Finalne utrwalenie — połącz wszystkie pary:",
        pairs: [
          { es: "¿Dónde está…?",  pl: "Gdzie jest…?" },
          { es: "Mi maleta",       pl: "Moja walizka" },
          { es: "El equipaje",     pl: "Bagaż" },
          { es: "La salida",       pl: "Wyjście" },
          { es: "Muchas gracias",  pl: "Bardzo dziękuję" },
          { es: "De nada",         pl: "Nie ma za co" },
          { es: "¿Habla inglés?",  pl: "Czy mówi po angielsku?" },
          { es: "El aeropuerto",   pl: "Lotnisko" },
        ],
      },
    ],

    // ── Hipek ─────────────────────────────────────────────────────────────
    hipekCues: [
      {
        label: "Wymowa 'gracias'",
        audioSrc: "/assets/audio/hipek_01.mp3",
        triggerAfterVocabIndex: 2,
      },
      {
        label: "Skąd '¿' na początku?",
        audioSrc: "/assets/audio/hipek_02.mp3",
        triggerAfterVocabIndex: 5,
      },
      {
        label: "'Estar' vs 'ser' — dwa 'być'",
        audioSrc: "/assets/audio/hipek_03.mp3",
        triggerAfterVocabIndex: 8,
      },
      {
        label: "Jak przeżyć gdy nic nie rozumiesz",
        audioSrc: "/assets/audio/hipek_04.mp3",
        triggerAfterVocabIndex: 10,
      },
    ],

    // ── Quiz końcowy ──────────────────────────────────────────────────────
    quiz: [
      {
        question: "Jak po hiszpańsku powiedzieć 'Przepraszam' (zaczepiając obcego)?",
        options: [
          { text: "Lo siento", correct: false },
          { text: "Perdona",   correct: true },
          { text: "Ayuda",     correct: false },
          { text: "De nada",   correct: false },
        ],
      },
      {
        question: "Co znaczy '¿Dónde está la salida?'",
        options: [
          { text: "Gdzie jest moja walizka?",    correct: false },
          { text: "Czy jest wyjście awaryjne?",  correct: false },
          { text: "Gdzie jest wyjście?",         correct: true },
          { text: "Gdzie jest lotnisko?",        correct: false },
        ],
      },
      {
        question: "Jak powiedzieć 'moja walizka' po hiszpańsku?",
        options: [
          { text: "Tu maleta", correct: false },
          { text: "Su maleta", correct: false },
          { text: "Mi maleta", correct: true },
          { text: "La maleta", correct: false },
        ],
      },
      {
        question: "Którego zwrotu użyjesz gdy czegoś nie rozumiesz?",
        options: [
          { text: "Muchas gracias", correct: false },
          { text: "Por favor",      correct: false },
          { text: "No entiendo",    correct: true },
          { text: "De nada",        correct: false },
        ],
      },
      {
        question: "Co znaczy 'Muchas gracias'?",
        options: [
          { text: "Dziękuję bardzo",    correct: true },
          { text: "Proszę bardzo",      correct: false },
          { text: "Nie ma za co",       correct: false },
          { text: "Przepraszam bardzo", correct: false },
        ],
      },
      {
        question: "Jak zapytać 'Czy mówi pan/pani po angielsku?'",
        options: [
          { text: "¿Habla español?",      correct: false },
          { text: "¿Habla inglés?",       correct: true },
          { text: "¿Dónde está inglés?",  correct: false },
          { text: "¿No entiendo inglés?", correct: false },
        ],
      },
      {
        question: "Co to jest 'el equipaje'?",
        options: [
          { text: "Wyjście",  correct: false },
          { text: "Lotnisko", correct: false },
          { text: "Bagaż",    correct: true },
          { text: "Walizka",  correct: false },
        ],
      },
    ],
  },

  // ── Lekcja 2 ─────────────────────────────────────────────────────────────
  {
    id: 2,
    title: "Lekcja 2",
    subtitle: "Taksówka do centrum",
    description: `${HERO_NAME} jest w taksówce. Kierowca nie mówi po angielsku. Klasyka.`,
    locked: true,
    cutscene: { src: null, poster: null },
    vocabulary: [],
    content: [],
    hipekCues: [],
    quiz: [],
  },

  // ── Lekcja 3 ─────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Lekcja 3",
    subtitle: "Pierwsze zakupy",
    description: `Lodówka pusta. ${HERO_NAME} idzie do sklepu. Co może pójść nie tak?`,
    locked: true,
    cutscene: { src: null, poster: null },
    vocabulary: [],
    content: [],
    hipekCues: [],
    quiz: [],
  },
];

export default lessons;
