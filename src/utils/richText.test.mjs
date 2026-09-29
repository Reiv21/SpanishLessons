// Self-check parsera renderRich (logika bez Reacta).
// Odtwarza firstToken + parse i sprawdza tokenizację oraz zagnieżdżanie.
// Uruchom: node src/utils/richText.test.mjs

function firstToken(text) {
  let best = null;
  const add = (mm, type) => {
    if (mm && (best === null || mm.index < best.index)) best = { index: mm.index, match: mm, type };
  };
  add(/\{([a-zA-Z]+|#[0-9a-fA-F]{3,8}):([^{}]+)\}/.exec(text), "color");
  add(/==([^=]+)==/.exec(text), "mark");
  add(/\*\*([^*]+)\*\*/.exec(text), "bold");
  add(/\*([^*]+)\*/.exec(text), "italic");
  if (!best) return null;
  const mm = best.match;
  return {
    start: best.index,
    end: best.index + mm[0].length,
    type: best.type,
    inner: best.type === "color" ? mm[2] : mm[1],
    color: best.type === "color" ? mm[1] : null,
  };
}

// Uproszczone parse -> zwraca zagnieżdżoną strukturę do testów.
function parse(text) {
  const out = [];
  let rest = text;
  while (rest.length > 0) {
    const tok = firstToken(rest);
    if (!tok) { out.push({ t: "text", v: rest }); break; }
    if (tok.start > 0) out.push({ t: "text", v: rest.slice(0, tok.start) });
    out.push({ t: tok.type, color: tok.color, children: parse(tok.inner) });
    rest = rest.slice(tok.end);
  }
  return out;
}

function assert(c, m) { if (!c) { console.error("FAIL:", m); process.exit(1); } }

// bold
let r = parse("ala **ma** kota");
assert(r.length === 3 && r[1].t === "bold" && r[1].children[0].v === "ma", "bold");

// zagniezdzenie: kolor zawierajacy bold
r = parse("{#2980b9:o **falso**?}");
assert(r.length === 1 && r[0].t === "color" && r[0].color === "#2980b9", "color wrap");
const inner = r[0].children;
assert(inner.some((n) => n.t === "bold" && n.children[0].v === "falso"), "bold zagniezdzony w kolorze");

// highlight
r = parse("uwaga ==tu==");
assert(r[1].t === "mark", "highlight");

// kolor nazwany
r = parse("{red:rojo}");
assert(r[0].t === "color" && r[0].color === "red", "named color");

// puste ** nie tworzy tokenu (brak zawartosci) -> zostaje tekstem
r = parse("****");
assert(r.length === 1 && r[0].t === "text", "puste bold jako tekst, nie crash");

// zwykly tekst
r = parse("bez znacznikow");
assert(r.length === 1 && r[0].t === "text", "plain");

console.log("richText: wszystkie testy OK");
