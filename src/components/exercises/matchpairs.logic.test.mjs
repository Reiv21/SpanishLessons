// Self-check logiki łączenia par w trybie "onSubmit".
// Odtwarza operacje na stanie links (bez Reacta) i sprawdza:
//  - numer połączenia jest STABILNY (nie zmienia się przy dodaniu/usunięciu innych),
//  - poprawność wykrywana gdy esId === plId,
//  - numery po obu stronach pary są takie same.
// Uruchom: node src/components/exercises/matchpairs.logic.test.mjs

function makeState() {
  return { links: {}, nextNum: 1 };
}
function link(s, esId, plId) {
  s.links[esId] = { plId, num: s.nextNum };
  s.nextNum += 1;
}
function unlinkEs(s, esId) {
  delete s.links[esId];
}
function plToLink(s) {
  const m = {};
  for (const [esId, v] of Object.entries(s.links)) {
    m[v.plId] = { esId: Number(esId), num: v.num };
  }
  return m;
}
function assert(c, m) { if (!c) { console.error("FAIL:", m); process.exit(1); } }

// Scenariusz z obrazka: 4 pary, id 0..3. Prawidłowo esId===plId.
const s = makeState();
link(s, 0, 3); // Hola -> zła (powinno 0)
link(s, 1, 1); // Gracias -> dobra
link(s, 2, 0); // Por favor -> zła
link(s, 3, 2); // Adiós -> zła

// numery przydzielone w kolejności tworzenia: 1,2,3,4
assert(s.links[0].num === 1, "num Hola = 1");
assert(s.links[1].num === 2, "num Gracias = 2");
assert(s.links[3].num === 4, "num Adiós = 4");

// badge tej samej pary po stronie PL == po stronie ES
const pl = plToLink(s);
assert(pl[3].num === s.links[0].num, "ES Hola i jego PL maja ten sam numer");
assert(pl[1].num === s.links[1].num, "ES Gracias i jego PL maja ten sam numer");

// STABILNOŚĆ: usuń pierwszą parę, numery pozostałych się NIE zmieniają
const numGraciasBefore = s.links[1].num;
unlinkEs(s, 0);
assert(s.links[1].num === numGraciasBefore, "numer Gracias stabilny po usunieciu innej pary");
assert(s.links[0] === undefined, "Hola rozlaczona");

// poprawnosc: tylko Gracias (1->1) jest dobra
const correct = [0, 1, 2, 3].filter((i) => s.links[i]?.plId === i);
assert(correct.length === 1 && correct[0] === 1, "tylko para 1 poprawna");

console.log("matchpairs: wszystkie testy OK");
