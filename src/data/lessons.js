import { HERO_NAME } from "../config";

// ─── Shared avatar definitions ────────────────────────────────────────────────
const AVATAR_JAN = (expression) => ({ type: "marek", expression }); // sprite sheet still named marek.png
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

// ─── Block type reference ─────────────────────────────────────────────────────
// { type: "text", text }
// { type: "tip", text }
// { type: "grammar", title, body, examples: [{es, pl}] }
// { type: "cultural", title, body, fact? }
// { type: "dialogue", lines: [{speaker, speakerLabel, avatar, es, pl, audioSrc?}] }
// { type: "sentence-builder", instruction, words[], translation, audioSrc?, gate? }
// { type: "fill-blank", instruction, questionPl, before, after, answer, hint?, translation, audioSrc?, gate? }
// { type: "match-pairs", instruction, pairs: [{es, pl}], gate? }
//
// gate: true → completing this exercise unlocks the next section of content

const lessons = [
  {
    id: 1,
    title: "Lekcja 1",
    subtitle: "Lotnisko El Prat",
    description: `${HERO_NAME} właśnie wylądował w Barcelonie. Tylko gdzie jego walizka?`,
    locked: false,
    cutscene: {
      src: null,    // podmień na: "/assets/video/lesson1_cutscene.mp4"
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
    // Schemat: historia → gate (ćwiczenie) → kolejny fragment → gate → ...
    content: [

      // ═══ CZĘŚĆ 1: Pierwsze kroki ══════════════════════════════════════
      {
        type: "text",
        text: `${HERO_NAME} Kowalski wylądował na lotnisku El Prat o 14:30. W plecaku: laptop, słuchawki i nadzieja na nowe życie w Barcelonie. Na taśmie bagażowej kręcą się walizki innych pasażerów — ale nie jego.`,
      },
      {
        type: "text",
        text: `Obok stoi pani w uniformie linii lotniczej. ${HERO_NAME} bierze głęboki oddech i podchodzi. Zna trzy słowa po hiszpańsku. Musi jakoś to rozegrać.`,
      },

      // Dialog 1 — lotnisko
      {
        type: "dialogue",
        lines: [
          {
            speaker: "marek",
            speakerLabel: HERO_NAME,
            avatar: AVATAR_JAN("sad"),
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
            avatar: AVATAR_JAN("surprised"),
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
            avatar: AVATAR_JAN("happy"),
            es: "¡Gracias!",
            pl: "Dziękuję!",
            audioSrc: "/assets/audio/d1_marek_03.mp3",
          },
        ],
      },
      {
        type: "tip",
        text: `"Perdona" to miękkie przepraszam — używasz żeby zagadać obcą osobę. "Lo siento" zostawiasz na sytuacje gdy coś zepsułeś lub kogoś uraziłeś.`,
      },

      // ── GATE 1: dopasuj słówka z dialogu ── (odblokowuje notę kulturową + gramatykę)
      {
        type: "match-pairs",
        gate: true,
        instruction: "Połącz słówka z rozmowy z ich tłumaczeniami:",
        pairs: [
          { es: "Perdona",     pl: "Przepraszam" },
          { es: "Gracias",     pl: "Dziękuję" },
          { es: "No entiendo", pl: "Nie rozumiem" },
          { es: "Por favor",   pl: "Proszę" },
          { es: "Sí",          pl: "Tak" },
        ],
      },

      // ═══ CZĘŚĆ 2: Kultura + gramatyka (odblokowane po gate 1) ══════════
      {
        type: "cultural",
        title: "Jak mówi się po katalońsku?",
        body: `Barcelona leży w Katalonii — regionie z własnym językiem. Na ulicach usłyszysz zarówno hiszpański (castellano), jak i kataloński (català). Pracownicy lotniska mówią po hiszpańsku, ale szyldy często są dwujęzyczne.`,
        fact: `"Gràcies" (gra-si-es) to dziękuję po katalońsku. Bardzo podobne do hiszpańskiego "gracias" — nie pomylisz się.`,
      },
      {
        type: "grammar",
        title: "¿Dónde está…? — Gdzie jest…?",
        body: `"¿Dónde?" znaczy "gdzie?", a "está" to forma czasownika "być" opisująca miejsce lub stan tymczasowy. Wystarczy wstawić po "está" nazwę rzeczy, której szukasz.`,
        examples: [
          { es: "¿Dónde está mi maleta?",     pl: "Gdzie jest moja walizka?" },
          { es: "¿Dónde está la salida?",     pl: "Gdzie jest wyjście?" },
          { es: "¿Dónde está el baño?",       pl: "Gdzie jest toaleta?" },
          { es: "¿Dónde está el aeropuerto?", pl: "Gdzie jest lotnisko?" },
        ],
      },

      // ── GATE 2: fill-blank z gramatyki ── (odblokowuje część 2 historii)
      {
        type: "fill-blank",
        gate: true,
        instruction: "Uzupełnij pytanie Jana:",
        questionPl: "Gdzie jest moja walizka?",
        before: "¿Dónde",
        after: "mi maleta?",
        answer: "está",
        hint: "Forma czasownika 'estar' — używamy dla miejsca.",
        translation: "¿Dónde está mi maleta?",
      },

      // ═══ CZĘŚĆ 3: Historia ciągnie się dalej (odblokowane po gate 2) ══
      {
        type: "text",
        text: `Pracownica znalazła walizkę — była na taśmie nr 4 zamiast 7. ${HERO_NAME} dziękuje, bierze torbę i rusza do wyjścia. Na zewnątrz czeka taksówka z kartką "JAN KOWALSKI".`,
      },
      {
        type: "text",
        text: `Kierowca jest rozmowny. Kiwa głową, bierze walizkę i zaczyna mówić szybko po hiszpańsku. ${HERO_NAME} rozumie połowę — ale tej ważniejszej połowy.`,
      },

      // Dialog 2 — taksówka
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
            avatar: AVATAR_JAN("smirk"),
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
            avatar: AVATAR_JAN("laughing"),
            es: "Muchas gracias.",
            pl: "Bardzo dziękuję.",
            audioSrc: "/assets/audio/d2_marek_02.mp3",
          },
        ],
      },
      {
        type: "tip",
        text: `"¿Todo bien?" to popularne powitanie — dosłownie "wszystko dobrze?". Odpowiadasz "Sí, bien" albo po prostu "Bien, gracias". Nie musisz rozwijać tematu.`,
      },

      // ── GATE 3: ułóż zdanie z dialogu 2 ── (odblokowuje gramatykę 2 + kulturę 2)
      {
        type: "sentence-builder",
        gate: true,
        instruction: "Ułóż zdanie, które powiedział Jan do kierowcy:",
        words: ["Sí,", "gracias.", "¿Vamos", "al", "centro?"],
        translation: "Tak, dziękuję. Jedziemy do centrum?",
        audioSrc: "/assets/audio/d2_marek_01.mp3",
      },

      // ═══ CZĘŚĆ 4: Gramatyka 2 + kultura 2 (odblokowane po gate 3) ══════
      {
        type: "grammar",
        title: "Mi, tu, su — mój, twój, jego/jej",
        body: `Zaimki dzierżawcze w hiszpańskim stoją przed rzeczownikiem i nie odmieniają się przez rodzaj — w przeciwieństwie do polskiego. "Mi" zawsze znaczy "mój/moja/moje".`,
        examples: [
          { es: "Mi maleta",  pl: "Moja walizka" },
          { es: "Tu maleta",  pl: "Twoja walizka" },
          { es: "Su maleta",  pl: "Jego/jej walizka" },
          { es: "Mi nombre es Jan", pl: "Mam na imię Jan" },
        ],
      },
      {
        type: "cultural",
        title: "Barcelońskie taksówki",
        body: `Taksówki w Barcelonie są żółto-czarne i mają wyraźne taryfy na szybach. Kierowcy zazwyczaj mówią po katalońsku i hiszpańsku, rzadziej po angielsku. "Al centre" albo podanie adresu wystarczą, żeby dotrzeć na miejsce.`,
        fact: `Barcelona ma też rozbudowaną sieć metra — Metro de Barcelona. Linia L1 (czerwona) i L3 (zielona) pokrywają większość centrum. Bilet jednorazowy kosztuje ok. 2,40 EUR.`,
      },

      // ── GATE 4: finalne utrwalenie ── (odblokowuje zakończenie)
      {
        type: "match-pairs",
        gate: true,
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

      // ═══ ZAKOŃCZENIE (odblokowane po gate 4) ════════════════════════════
      {
        type: "text",
        text: `Taksówka wjeżdża w Barcelonę od strony autostrady. ${HERO_NAME} patrzy przez okno na miasto — budynki z terakoty, palmy na pasie zieleni, kawiarnie z krzesłami wystawionymi na chodnik. Pierwsze zdanie po hiszpańsku już za nim.`,
      },
      {
        type: "tip",
        text: `Trzy zwroty ratujące życie: "No entiendo" (nie rozumiem), "Por favor" (proszę), "¿Habla inglés?" (czy mówi po angielsku?). Z tym zestawem przeżyjesz pierwsze dni w każdym hiszpańskojęzycznym kraju.`,
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
        question: "Jak po hiszpańsku powiedzieć 'Przepraszam' zaczepiając obcą osobę?",
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
          { text: "Gdzie jest moja walizka?",  correct: false },
          { text: "Czy jest wyjście awaryjne?", correct: false },
          { text: "Gdzie jest wyjście?",        correct: true },
          { text: "Gdzie jest lotnisko?",       correct: false },
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
        question: "W jakim języku napisane są szyldy na barcelońskim lotnisku?",
        options: [
          { text: "Tylko po angielsku",                correct: false },
          { text: "Tylko po hiszpańsku",               correct: false },
          { text: "Po hiszpańsku i katalońsku",        correct: true },
          { text: "Po katalońsku, angielsku i francusku", correct: false },
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
    subtitle: "Pierwsze mieszkanie",
    description: `${HERO_NAME} poznaje współlokatorów. Jak się przedstawić po hiszpańsku?`,
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
