// ============================================================
// Gemeinsamer Gast-Name
// ============================================================
// Wird von index.html, bingo.js und song.js gemeinsam genutzt, damit ein
// Gast seinen Namen nur einmal eintippen muss. Reine Bequemlichkeit - jede
// Seite funktioniert auch weiterhin, falls noch kein Name gespeichert ist.
// ============================================================

const GUEST_NAME_KEY = "birthdayHubGuestName";
const GUEST_NAME_PROMPT_DISMISSED_KEY = "birthdayHubGuestNamePromptDismissed";

function getGuestName() {
  try {
    return localStorage.getItem(GUEST_NAME_KEY) || "";
  } catch (e) {
    return "";
  }
}

function setGuestName(name) {
  const trimmed = (name || "").trim();
  if (!trimmed) return;
  try {
    localStorage.setItem(GUEST_NAME_KEY, trimmed);
  } catch (e) {
    // localStorage evtl. nicht verfügbar - Name gilt dann nur für diese Seite
  }
}

function isGuestNamePromptDismissed() {
  try {
    return localStorage.getItem(GUEST_NAME_PROMPT_DISMISSED_KEY) === "true";
  } catch (e) {
    return false;
  }
}

function dismissGuestNamePrompt() {
  try {
    localStorage.setItem(GUEST_NAME_PROMPT_DISMISSED_KEY, "true");
  } catch (e) {
    // ignore
  }
}

// ============================================================
// Gemeinsame Sheet-Anbindung (Songwunsch + Bingo-Log)
// ============================================================
// Eine einzige Apps-Script-URL für beides (siehe
// ../google-apps-script/Code.gs). Ein "type"-Feld im gesendeten Objekt
// entscheidet dort, in welche Tabelle geschrieben wird: ohne "type" (oder
// "type":"song") -> "Songwünsche", mit "type":"bingo" -> "Bingo".

const SHEET_ENDPOINT_URL =
  "https://script.google.com/macros/s/AKfycbzD5PvFIM03gTXpLKSLCtSkD3tc_u1EE0kEnZoICtm__g8MNpF9Nc3Ur6Xv72CCDW5f/exec";

// Schickt Daten ans Google Sheet, fire-and-forget: ein Netzwerkfehler oder
// eine fehlende Internetverbindung darf die Nutzung der Seite nie
// blockieren.
function sendToSheet(payload) {
  if (!SHEET_ENDPOINT_URL) return;

  fetch(SHEET_ENDPOINT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((e) => {
    console.warn("Daten konnten nicht ans Sheet gesendet werden (läuft trotzdem lokal weiter):", e);
  });
}
