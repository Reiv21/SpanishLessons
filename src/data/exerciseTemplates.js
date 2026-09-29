// Katalog typów zadań dostępnych w zakładce "Zadania testowe".
// Każdy wpis: metadane do galerii + domyślny blok danych (taki sam kształt
// jak w lessons.js), który playground renderuje i pozwala edytować na żywo.

export const TEMPLATES = [
  {
    type: "sentence-builder",
    slug: "uporzadkuj",
    name: "Uporządkuj",
    desc: "Przeciągnij i ułóż słowa, aby powstało poprawne zdanie.",
    icon: "🔤",
    defaultBlock: {
      type: "sentence-builder",
      instruction: "Ułóż zdanie po hiszpańsku:",
      words: ["¿Dónde", "está", "mi", "maleta?"],
      translation: "Gdzie jest moja walizka?",
    },
  },
  {
    type: "match-pairs",
    slug: "polacz-w-pary",
    name: "Połącz w pary",
    desc: "Połącz słówko hiszpańskie z jego tłumaczeniem.",
    icon: "🔗",
    defaultBlock: {
      type: "match-pairs",
      instruction: "Połącz słówka z tłumaczeniami:",
      pairs: [
        { es: "Hola", pl: "Cześć" },
        { es: "Gracias", pl: "Dziękuję" },
        { es: "Por favor", pl: "Proszę" },
        { es: "Adiós", pl: "Do widzenia" },
      ],
    },
  },
  {
    type: "multi-choice",
    slug: "test",
    name: "Test",
    desc: "Pytanie wielokrotnego wyboru. Zaznacz poprawną odpowiedź.",
    icon: "✅",
    defaultBlock: {
      type: "multi-choice",
      instruction: "Co znaczy „Buenos días”?",
      multiple: false,
      options: [
        { text: "Dzień dobry", correct: true },
        { text: "Dobranoc", correct: false },
        { text: "Do zobaczenia", correct: false },
        { text: "Dziękuję", correct: false },
      ],
      feedbackCorrect: "Dokładnie tak!",
      feedbackWrong: "Nie tym razem, spróbuj jeszcze raz.",
    },
  },
  {
    type: "fill-blank",
    slug: "uzupelnij-zdanie",
    name: "Uzupełnij zdanie",
    desc: "Wpisz brakujące słowo we właściwym miejscu w zdaniu.",
    icon: "✏️",
    defaultBlock: {
      type: "fill-blank",
      instruction: "Uzupełnij zdanie:",
      questionPl: "Gdzie jest moja walizka?",
      before: "¿Dónde",
      after: "mi maleta?",
      answer: "está",
      hint: "Forma czasownika 'estar', używana dla miejsca.",
      translation: "¿Dónde está mi maleta?",
    },
  },
  {
    type: "true-false",
    slug: "prawda-falsz",
    name: "Prawda czy fałsz",
    desc: "Oceń stwierdzenia jako prawdziwe lub fałszywe, opcjonalnie na czas.",
    icon: "⚖️",
    defaultBlock: {
      type: "true-false",
      instruction: "Prawda czy fałsz?",
      timeLimit: 30,
      statements: [
        { text: "„Hola” znaczy cześć.", answer: true },
        { text: "„Gracias” znaczy proszę.", answer: false },
        { text: "„Adiós” znaczy do widzenia.", answer: true },
        { text: "„Gato” znaczy pies.", answer: false },
      ],
    },
  },
  {
    type: "anagram",
    slug: "anagram",
    name: "Anagram",
    desc: "Ułóż rozsypane litery w poprawne słowo. Dobre do pisowni.",
    icon: "🔡",
    defaultBlock: {
      type: "anagram",
      instruction: "Ułóż słowo z liter:",
      word: "gracias",
      hint: "Dziękuję",
    },
  },
  {
    type: "sort-items",
    slug: "posortuj",
    name: "Posortuj",
    desc: "Przypisz każdy element do właściwej kategorii.",
    icon: "🗂️",
    defaultBlock: {
      type: "sort-items",
      instruction: "Posortuj słowa według rodzajnika:",
      categories: ["el", "la"],
      items: [
        { text: "libro", category: "el" },
        { text: "casa", category: "la" },
        { text: "coche", category: "el" },
        { text: "mesa", category: "la" },
        { text: "perro", category: "el" },
        { text: "silla", category: "la" },
      ],
    },
  },
  {
    type: "picture-choice",
    slug: "opisz-zdjecie",
    name: "Opisz zdjęcie",
    desc: "Zdjęcie i kilka zdań. Zaznacz te, które poprawnie je opisują.",
    icon: "🖼️",
    defaultBlock: {
      type: "picture-choice",
      instruction: "Które zdania opisują zdjęcie?",
      image: "/family.jpeg",
      imageAlt: "Rodzina w kuchni",
      multiple: true,
      options: [
        { text: "La familia cocina en la cocina.", correct: true },
        { text: "Están preparando comida juntos.", correct: true },
        { text: "El hombre conduce un coche.", correct: false },
        { text: "Los niños duermen en la cama.", correct: false },
      ],
    },
  },
  {
    type: "picture-choice",
    slug: "opisz-pokoj-noc",
    name: "Opisz pokój (noc)",
    desc: "Wieczorna sypialnia: mężczyzna pracuje przy biurku. Zaznacz poprawne opisy.",
    icon: "🌙",
    defaultBlock: {
      type: "picture-choice",
      instruction: "Które zdania opisują to zdjęcie?",
      image: "/obraz1.png",
      imageAlt: "Mężczyzna pracuje wieczorem przy biurku w sypialni",
      multiple: true,
      options: [
        { text: "Es de noche.", correct: true },
        { text: "El hombre trabaja con el ordenador portátil.", correct: true },
        { text: "Hay una cama en la habitación.", correct: true },
        { text: "Sobre la mesa hay una taza.", correct: true },
        { text: "El hombre está durmiendo en la cama.", correct: false },
        { text: "Hace sol y el cielo está azul.", correct: false },
        { text: "La habitación está vacía.", correct: false },
      ],
    },
  },
  {
    type: "picture-choice",
    slug: "opisz-salon-dzien",
    name: "Opisz salon (dzień)",
    desc: "Słoneczny salon: mężczyzna czyta książkę na kanapie. Zaznacz poprawne opisy.",
    icon: "☀️",
    defaultBlock: {
      type: "picture-choice",
      instruction: "Które zdania opisują to zdjęcie?",
      image: "/obraz2.png",
      imageAlt: "Mężczyzna czyta książkę na kanapie w słonecznym salonie",
      multiple: true,
      options: [
        { text: "El hombre lee un libro.", correct: true },
        { text: "Está sentado en el sofá.", correct: true },
        { text: "Hay plantas en el salón.", correct: true },
        { text: "Es de día y entra el sol.", correct: true },
        { text: "El hombre está comiendo en la cocina.", correct: false },
        { text: "Hay un perro debajo de la mesa.", correct: false },
        { text: "Está lloviendo fuera.", correct: false },
      ],
    },
  },
  {
    type: "crossword",
    slug: "krzyzowka",
    name: "Krzyżówka",
    desc: "Krzyżówka wprowadzana ręcznie (bez auto-generowania siatki).",
    icon: "🧩",
    defaultBlock: {
      type: "crossword",
      instruction: "Rozwiąż krzyżówkę:",
      entries: [
        { row: 0, col: 0, dir: "across", answer: "HOLA", clue: "Cześć" },
        { row: 0, col: 0, dir: "down", answer: "HOY", clue: "Dziś" },
        { row: 2, col: 0, dir: "across", answer: "YO", clue: "Ja" },
      ],
    },
  },
];

export function getTemplate(slug) {
  return TEMPLATES.find((t) => t.slug === slug) ?? null;
}

// Głęboka kopia domyślnego bloku (żeby edycja w playground nie mutowała stałej).
export function cloneDefaultBlock(template) {
  return JSON.parse(JSON.stringify(template.defaultBlock));
}
