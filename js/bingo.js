// ============================================================
// Bingo-Logik
// Benötigt CATEGORY_ORDER, QUESTION_POOL und CATEGORY_QUOTAS aus
// js/questions.js (in bingo.html VOR dieser Datei eingebunden).
// ============================================================

const STORAGE_KEY = "birthdayHubBingoState";

// Wird erhöht, wenn sich die gespeicherte Datenstruktur ändert (z. B. Anzahl
// oder Zuschnitt der Aufgaben). Alte Spielstände mit anderer SCHEMA_VERSION
// werden dann automatisch verworfen und neu generiert, statt kaputt
// anzuzeigen.
const SCHEMA_VERSION = 3;

// ---------- Speichern / Laden (localStorage) ----------

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.info("Bingo-Spielstand ist veraltet, wird neu erstellt.");
      return null;
    }
    return parsed;
  } catch (e) {
    console.warn("Bingo-Spielstand konnte nicht geladen werden:", e);
    return null;
  }
}

function saveState(currentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch (e) {
    console.warn("Bingo-Spielstand konnte nicht gespeichert werden:", e);
  }
}

function makePlayerId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "p-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------- Kartengenerierung ----------

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Zieht pro Kategorie die passende Anzahl Aufgaben (siehe CATEGORY_QUOTAS)
// zufällig aus dem Pool. Reihenfolge innerhalb einer Kategorie wird gemischt;
// die Kategorien selbst bleiben in CATEGORY_ORDER (fürs Layout).
function generateCard() {
  let picked = [];
  CATEGORY_ORDER.forEach((category) => {
    const quota = CATEGORY_QUOTAS[category] || 0;
    const poolForCategory = QUESTION_POOL.filter((q) => q.category === category);
    picked = picked.concat(shuffle(poolForCategory).slice(0, quota));
  });
  return picked;
}

function createNewState(playerName) {
  const cells = generateCard(); // Aufgaben-Objekte {id, category, shortLabel, text}
  return {
    schemaVersion: SCHEMA_VERSION,
    playerId: makePlayerId(),
    playerName: playerName.trim(),
    createdAt: new Date().toISOString(),
    cells,
    progress: new Array(cells.length).fill(null), // gefundene Namen, parallel zu cells
    bingoAt: null,
  };
}

// ---------- Gewinnregeln ----------
// Bewusst getrennt von der restlichen Logik, damit wir die Gewinnbedingung
// später leicht ändern können.

// Zählt, wie viele Treffer pro Kategorie schon eingetragen sind.
function countPerCategory(progress, cells) {
  const counts = {};
  progress.forEach((entry, index) => {
    if (entry !== null) {
      const category = cells[index].category;
      counts[category] = (counts[category] || 0) + 1;
    }
  });
  return counts;
}

// Mindestanzahl Treffer, die JEDE Kategorie erreichen muss, damit
// categoryThreshold "Bingo" auslöst (aktuell: 2 von 3 pro Kategorie).
const CATEGORY_WIN_THRESHOLD = 2;

// Spaltenanzahl des Kachel-Rasters. MUSS zu grid-template-columns in
// css/style.css (.bingo-grid) passen. Die Zeilenanzahl wird daraus und aus
// der Aufgabenanzahl automatisch berechnet - Path Bingo funktioniert also
// auch, wenn später mehr/weniger Reihen dazukommen.
const BINGO_COLUMNS = 3;

// Prüft, ob es einen durchgehenden Pfad aus erledigten Feldern von der
// obersten bis zur untersten Reihe gibt. Ein Feld in Reihe r darf dabei nur
// an ein erledigtes Feld in Reihe r-1 anschließen, das direkt darüber oder
// diagonal darüber links/rechts liegt (Spalte c-1, c oder c+1).
//
// index -> Zeile/Spalte: Zeile = Math.floor(index / columns), Spalte = index % columns.
// Das entspricht genau der Reihenfolge, in der die Kacheln im CSS-Grid
// gerendert werden (Grid füllt zeilenweise von links nach rechts).
function hasVerticalPath(progress, columns) {
  const totalCells = progress.length;
  const rows = Math.ceil(totalCells / columns);
  let reachableInPreviousRow = null;

  for (let row = 0; row < rows; row++) {
    const reachableInThisRow = [];

    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      const isFilled = index < totalCells && progress[index] !== null;

      if (!isFilled) {
        reachableInThisRow.push(false);
        continue;
      }

      if (row === 0) {
        // Oberste Reihe: jedes erledigte Feld startet einen möglichen Pfad.
        reachableInThisRow.push(true);
      } else {
        const connectsUpward = [col - 1, col, col + 1].some(
          (neighborCol) =>
            neighborCol >= 0 && neighborCol < columns && reachableInPreviousRow[neighborCol]
        );
        reachableInThisRow.push(connectsUpward);
      }
    }

    reachableInPreviousRow = reachableInThisRow;
  }

  // Bingo, sobald mindestens ein Feld in der untersten Reihe über einen
  // durchgehenden Pfad erreichbar ist.
  return reachableInPreviousRow.some(Boolean);
}

const WIN_RULES = {
  // Aktuell aktiv: "Path Bingo" - durchgehender Pfad von oben nach unten.
  pathBingo: (progress) => hasVerticalPath(progress, BINGO_COLUMNS),
  // Alternativen, weiterhin verfügbar (einfach oben zuweisen zum Aktivieren):
  categoryThreshold: (progress, cells) => {
    const counts = countPerCategory(progress, cells);
    return CATEGORY_ORDER.every((category) => (counts[category] || 0) >= CATEGORY_WIN_THRESHOLD);
  },
  complete: (progress) => progress.every((entry) => entry !== null), // wirklich alle Aufgaben erledigt
};

// Zum Ändern der Gewinnregel einfach eine andere Regel aus WIN_RULES
// zuweisen. Nach Erreichen von "Bingo" kann trotzdem weitergespielt werden -
// dafür gibt es hier bewusst keine Sperre.
const ACTIVE_WIN_RULE = WIN_RULES.pathBingo;

// ---------- Kategorie-Farben (nur Optik, keine sichtbaren Kategorie-Namen) ----------

const CATEGORY_COLORS = {
  "Bennet": "#7fb8d6",
  "David": "#c98fd1",
  "Bennet & David": "#e28b9c",
  "Freunde & Vergangenheit": "#9fcf8f",
  "Reisen & Erlebnisse": "#e0a86a",
  "Random / Party": "#6bc8c2",
};

// ---------- Rendering ----------

let state = null;
let activeCellIndex = null;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderTopbar() {
  const found = state.progress.filter((entry) => entry !== null).length;
  document.getElementById("player-name").textContent = state.playerName;
  document.getElementById("progress-count").textContent = `${found}/${state.cells.length}`;
}

// Baut die 18 Aufgaben als flaches 3x6-Kachel-Raster auf, in der Reihenfolge
// von state.cells (nach Kategorie gruppiert generiert, siehe generateCard).
// Die Kategorie-Namen selbst werden dem Gast bewusst NICHT angezeigt - nur
// der farbige Punkt pro Kachel deutet die Gruppierung dezent an (siehe
// README).
function renderGrid() {
  const grid = document.getElementById("bingo-grid");
  grid.innerHTML = "";

  state.cells.forEach((question, index) => {
    const foundName = state.progress[index];
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell" + (foundName ? " cell--filled" : "");
    cell.style.setProperty("--dot-color", CATEGORY_COLORS[question.category] || "#999");
    cell.addEventListener("click", () => openCellOverlay(index));

    const label = escapeHtml(question.shortLabel || question.text);

    cell.innerHTML = foundName
      ? `<span class="cell__check">✓</span>
         <span class="cell__text cell__text--done">${label}</span>
         <span class="cell__found">${escapeHtml(foundName)}</span>`
      : `<span class="cell__dot"></span>
         <span class="cell__text">${label}</span>`;

    grid.appendChild(cell);
  });
}

// ---------- Name-Overlay (erstes Öffnen) ----------

function showNameOverlay() {
  document.getElementById("name-overlay").classList.add("overlay--visible");
}

function hideNameOverlay() {
  document.getElementById("name-overlay").classList.remove("overlay--visible");
}

// ---------- Aufgaben-Overlay ("Wen hast du gefunden?") ----------

function openCellOverlay(index) {
  activeCellIndex = index;
  const question = state.cells[index];
  const existingName = state.progress[index];

  document.getElementById("cell-overlay-question").textContent = question.text;
  document.getElementById("cell-overlay-error").textContent = "";

  const input = document.getElementById("cell-overlay-input");
  input.value = existingName || "";

  document.getElementById("cell-overlay-delete").hidden = !existingName;
  document.getElementById("cell-overlay").classList.add("overlay--visible");
  setTimeout(() => input.focus(), 50);
}

function closeCellOverlay() {
  document.getElementById("cell-overlay").classList.remove("overlay--visible");
  activeCellIndex = null;
}

// Eine gefundene Person darf nur einmal auf der GESAMTEN Karte verwendet
// werden (kategorieübergreifend), nicht nur innerhalb einer Kategorie.
function isNameTakenElsewhere(name, exceptIndex) {
  const normalized = name.trim().toLowerCase();
  return state.progress.some(
    (entry, i) => entry && i !== exceptIndex && entry.trim().toLowerCase() === normalized
  );
}

function handleCellSave() {
  const input = document.getElementById("cell-overlay-input");
  const name = input.value.trim();
  const errorEl = document.getElementById("cell-overlay-error");

  if (!name) {
    errorEl.textContent = "Bitte einen Namen eintragen.";
    return;
  }
  if (isNameTakenElsewhere(name, activeCellIndex)) {
    errorEl.textContent = "Diese Person hast du schon für eine andere Aufgabe eingetragen.";
    return;
  }

  state.progress[activeCellIndex] = name;
  saveState(state);
  renderGrid();
  renderTopbar();
  closeCellOverlay();
  checkBingo();
}

function handleCellDelete() {
  state.progress[activeCellIndex] = null;
  saveState(state);
  renderGrid();
  renderTopbar();
  closeCellOverlay();
}

// ---------- Bingo-Check ----------
// Nach Erreichen von "Bingo" bleibt das Spiel offen - Gäste können weiter
// Aufgaben eintragen, bis maximal alle erledigt sind.

function checkBingo() {
  if (state.bingoAt) return; // "Bingo" schon einmal gefeiert, nicht erneut anzeigen
  if (ACTIVE_WIN_RULE(state.progress, state.cells)) {
    state.bingoAt = new Date().toISOString();
    saveState(state);
    showBingoToast();
  }
}

function showBingoToast() {
  const toast = document.getElementById("bingo-toast");
  toast.classList.add("toast--visible");
  setTimeout(() => toast.classList.remove("toast--visible"), 3500);
}

// ---------- Start ----------

function init() {
  state = loadState();

  if (!state) {
    showNameOverlay();
  } else {
    renderTopbar();
    renderGrid();
  }

  document.getElementById("name-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("name-input");
    const name = nameInput.value.trim();
    if (!name) return;

    state = createNewState(name);
    saveState(state);
    hideNameOverlay();
    renderTopbar();
    renderGrid();
  });

  document.getElementById("cell-overlay-save").addEventListener("click", handleCellSave);
  document.getElementById("cell-overlay-delete").addEventListener("click", handleCellDelete);
  document.getElementById("cell-overlay-cancel").addEventListener("click", closeCellOverlay);
}

document.addEventListener("DOMContentLoaded", init);
