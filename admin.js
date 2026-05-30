// admin.js
import { firebaseConfig } from "./firebase-config.js";
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const logsContainer = document.getElementById("logsContainer");

// Fonction pour afficher un log
function renderLog(docSnap) {
  const data = docSnap.data();

  const div = document.createElement("div");
  div.style.padding = "6px 0";
  div.style.borderBottom = "1px solid rgba(148,163,184,0.3)";

  const ts = data.ts?.toDate ? data.ts.toDate() : null;
  const dateStr = ts ? ts.toLocaleString("fr-FR") : "Date inconnue";

  div.innerHTML = `
    <div style="font-size:0.95rem;">
      <strong>${data.reader || "Inconnu"}</strong>
      a lu
      <span>Semaine ${data.week} — ${data.dayISO}</span>
      ${data.isAdmin ? "<span style='color:#22c55e;'>(admin)</span>" : ""}
    </div>
    <div style="font-size:0.8rem;color:#9ca3af;">${dateStr}</div>
  `;

  return div;
}

// Abonnement temps réel aux logs
function subscribeLogs() {
  const q = query(
    collection(db, "logs"),
    orderBy("ts", "desc"),
    limit(100)
  );

  onSnapshot(q, (snapshot) => {
    logsContainer.innerHTML = "";
    snapshot.forEach(docSnap => {
      logsContainer.appendChild(renderLog(docSnap));
    });
  });
}

// Lancement
window.addEventListener("load", () => {
  subscribeLogs();
});
