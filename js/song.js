// ============================================================
// Songwunsch-Formular
// ============================================================
// Phase 6a (aktuell): Formular + Erfolgsmeldung, lokale Sicherungskopie.
// Phase 6b (später): SHEET_ENDPOINT_URL mit der echten Google Apps Script
// Web-App-URL befüllen, sobald das Sheet eingerichtet ist - siehe README.
// Bis dahin werden Wünsche nur lokal im Browser gesichert, das Formular
// funktioniert aber schon vollständig (inkl. Erfolgsmeldung).
// ============================================================

// Leer lassen, bis die Google-Sheet-Anbindung eingerichtet ist (Phase 6b).
const SHEET_ENDPOINT_URL = "";

const LOCAL_BACKUP_KEY = "birthdayHubSongWishes";

function saveWishLocally(wish) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_BACKUP_KEY) || "[]");
    existing.push(wish);
    localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn("Songwunsch konnte nicht lokal gesichert werden:", e);
  }
}

// Schickt den Wunsch ans Google Sheet, sobald SHEET_ENDPOINT_URL gesetzt ist.
// Läuft bewusst "fire and forget": ein Netzwerkfehler oder eine fehlende
// Internetverbindung darf die Nutzung nicht blockieren - die Erfolgsmeldung
// erscheint in jedem Fall, die lokale Sicherungskopie bleibt zusätzlich
// erhalten.
function sendWishToSheet(wish) {
  if (!SHEET_ENDPOINT_URL) return;

  fetch(SHEET_ENDPOINT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wish),
  }).catch((e) => {
    console.warn("Songwunsch konnte nicht ans Sheet gesendet werden (läuft trotzdem lokal weiter):", e);
  });
}

function showSuccess() {
  document.getElementById("song-page").hidden = true;
  document.getElementById("song-success").hidden = false;
}

function showForm() {
  document.getElementById("song-page").hidden = false;
  document.getElementById("song-success").hidden = true;
}

function init() {
  const form = document.getElementById("song-form");
  const errorEl = document.getElementById("song-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const songTitle = document.getElementById("song-title").value.trim();
    const artist = document.getElementById("song-artist").value.trim();
    const guestName = document.getElementById("song-guest").value.trim();

    if (!songTitle) {
      errorEl.textContent = "Bitte mindestens einen Songnamen eintragen.";
      return;
    }
    errorEl.textContent = "";

    const wish = {
      songTitle,
      artist,
      guestName,
      timestamp: new Date().toISOString(),
    };

    saveWishLocally(wish);
    sendWishToSheet(wish);

    form.reset();
    showSuccess();
  });

  document.getElementById("song-again-button").addEventListener("click", showForm);
}

document.addEventListener("DOMContentLoaded", init);
