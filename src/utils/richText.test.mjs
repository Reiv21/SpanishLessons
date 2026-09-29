// Minimalny self-check parsera renderRich (bez frameworka).
// Uruchom: node src/utils/richText.test.mjs
// Sprawdzamy tokenizację na czystych stringach (logika bez Reacta).

// Kopia regexa z richText.jsx — jeśli tam się zmieni, tu też trzeba.
const RE = /(\{[a-zA-Z#0-9]+:[^}]+\})|(==[^=]+==)|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;

function tokens(text) {
  const out = [];
  let last = 0, m;
  while ((m = RE.exec(text)) !== null) {
    if (m.index > last) out.push({ t: "text", v: text.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith("{")) out.push({ t: "color", v: tok });
    else if (tok.startsWith("==")) out.push({ t: "mark", v: tok.slice(2, -2) });
    else if (tok.startsWith("**")) out.push({ t: "bold", v: tok.slice(2, -2) });
    else if (tok.startsWith("*")) out.push({ t: "italic", v: tok.slice(1, -1) });
    last = m.index + tok.length;
  }
  if (last < text.length) out.push({ t: "text", v: text.slice(last) });
  return out;
}

function assert(cond, msg) {
  if (!cond) { console.error("FAIL:", msg); process.exit(1); }
}

// bold
let r = tokens("ala **ma** kota");
assert(r.length === 3 && r[1].t === "bold" && r[1].v === "ma", "bold");

// italic
r = tokens("*hola*");
assert(r.length === 1 && r[0].t === "italic" && r[0].v === "hola", "italic");

// highlight
r = tokens("uwaga ==tu==");
assert(r[1].t === "mark" && r[1].v === "tu", "highlight");

// color
r = tokens("{red:rojo} normalnie");
assert(r[0].t === "color" && r[0].v === "{red:rojo}", "color token");

// zwykly tekst bez markup
r = tokens("bez znacznikow");
assert(r.length === 1 && r[0].t === "text", "plain text");

// bold ma pierwszenstwo nad italic (** przed *)
r = tokens("**mocno**");
assert(r.length === 1 && r[0].t === "bold" && r[0].v === "mocno", "bold not split into italics");

console.log("richText: wszystkie testy OK");
