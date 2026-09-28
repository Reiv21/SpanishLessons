import { useNavigate } from "react-router-dom";
import DialogueAvatar from "../components/DialogueAvatar";

// Strona testowa mimik lektora (p2.png -> lector_faces.png).
// Pokazuje wszystkie 12 wyrazów, żeby sprawdzić czy sprite dobrze się kadruje.
// Docelowo do usunięcia albo zastąpienia realnym użyciem w dialogach.
const EXPRESSIONS = [
  ["neutro", "Neutralny"],
  ["sonrisa", "Uśmiech"],
  ["risa", "Śmiech"],
  ["sorpresa", "Zdziwienie"],
  ["duda", "Wątpliwość"],
  ["concentracion", "Skupienie"],
  ["interes", "Zainteresowanie"],
  ["escepticismo", "Sceptycyzm"],
  ["cansancio", "Zmęczenie"],
  ["satisfaccion", "Zadowolenie"],
  ["preocupacion", "Zmartwienie"],
  ["idea", "Pomysł"],
];

export default function FaceTest() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#fdf6ec", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ padding: "14px 24px", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "#e74c3c", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
        >
          ← Strona główna
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 6px" }}>
          Test mimik lektora
        </h1>
        <p style={{ color: "#6a6055", margin: "0 0 24px" }}>
          Podgląd wszystkich 12 wyrazów z arkusza p2 (lector_faces.png).
          Jeśli twarze są dobrze wykadrowane, można podłączyć lektora do dialogów.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 18,
          }}
        >
          {EXPRESSIONS.map(([expr, label]) => (
            <div key={expr} style={{ textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <DialogueAvatar avatar={{ type: "lector", expression: expr }} size={96} />
              </div>
              <div style={{ marginTop: 8, fontSize: "0.85rem", fontWeight: 600, color: "#5a5044" }}>
                {label}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#a89a86" }}>{expr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
