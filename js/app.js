// ============================================================
// Startseiten-Logik
// ============================================================
// Fragt einmalig den Namen des Gastes ab (siehe js/guest.js) und
// speichert ihn, damit Bingo & Songwunsch ihn nicht erneut abfragen.
// Wird der Prompt übersprungen oder ist localStorage nicht verfügbar,
// funktionieren beide Seiten trotzdem - sie fragen dann selbst nach.
// ============================================================

function init() {
  const nameOverlay = document.getElementById("name-overlay");

  if (!getGuestName() && !isGuestNamePromptDismissed()) {
    nameOverlay.classList.add("overlay--visible");
  }

  document.getElementById("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("name-input");
    const name = input.value.trim();
    if (name) {
      setGuestName(name);
    }
    nameOverlay.classList.remove("overlay--visible");
  });

  document.getElementById("name-skip-button").addEventListener("click", () => {
    dismissGuestNamePrompt();
    nameOverlay.classList.remove("overlay--visible");
  });
}

document.addEventListener("DOMContentLoaded", init);
