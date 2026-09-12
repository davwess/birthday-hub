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
