// ============================================================
// Bingo-Logik
// Benötigt QUESTION_POOL und CATEGORY_QUOTAS aus js/questions.js
// (in bingo.html VOR dieser Datei eingebunden).
// ============================================================

const STORAGE_KEY = "birthdayHubBingoState";

// Wird erhöht, wenn sich die gespeicherte Datenstruktur ändert (z. B. ein
// neues Feld pro Frage). Alte Spielstände mit anderer SCHEMA_VERSION werden
// dann automatisch verworfen und neu generiert, statt kaputt anzuzeigen.
const SCHEMA_VERSION = 2;

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

// Zieht pro Kategorie die passende Anzahl Fragen (siehe CATEGORY_QUOTAS)
// zufällig aus dem Pool und mischt die 25 Fragen anschließend auf dem Grid.
function generateCard() {
  let picked = [];
  Object.entries(CATEGORY_QUOTAS).forEach(([category, quota]) => {
    const poolForCategory = QUESTION_POOL.filter((q) => q.category === category);
    picked = picked.concat(shuffle(poolForCategory).slice(0, quota));
  });
  return shuffle(picked);
}

function createNewState(playerName) {
  return {
    schemaVersion: SCHEMA_VERSION,
    playerId: makePlayerId(),
    playerName: playerName.trim(),
    createdAt: new Date().toISOString(),
    cells: generateCard(), // 25 Fragen-Objekte {id, category, shortLabel, text}
    progress: new Array(25).fill(null), // gefundene Namen, parallel zu cells
    bingoAt: null,
  };
}

// ---------- Bingo-Regeln ----------
// Bewusst getrennt von der restlichen Logik, damit wir die Gewinn-
// bedingung später leicht ändern können (z. B. zwei Reihen, Full House).

function buildLines() {
  const lines = [];
  for (let row = 0; row < 5; row++) {
    lines.push([0, 1, 2, 3, 4].map((col) => row * 5 + col));
  }
  for (let col = 0; col < 5; col++) {
    lines.push([0, 1, 2, 3, 4].map((row) => row * 5 + col));
  }
  lines.push([0, 6, 12, 18, 24]); // Diagonale \
  lines.push([4, 8, 12, 16, 20]); // Diagonale /
  return lines;
}
const LINES = buildLines();

function countCompletedLines(progress) {
  const filled = progress.map((entry) => entry !== null);
  return LINES.filter((line) => line.every((index) => filled[index])).length;
}

const WIN_RULES = {
  oneLine: (progress) => countCompletedLines(progress) >= 1,
  twoLines: (progress) => countCompletedLines(progress) >= 2,
  fullHouse: (progress) => progress.every((entry) => entry !== null),
};

// Aktive Regel für Phase 4: eine volle Reihe/Spalte/Diagonale reicht.
// Zum Ändern einfach eine andere Regel aus WIN_RULES zuweisen.
const ACTIVE_WIN_RULE = WIN_RULES.oneLine;

// ---------- Kategorie-Farben (nur Optik) ----------

const CATEGORY_COLORS = {
  "Reisen": "#7fb8d6",
  "Job & Karriere": "#c98fd1",
  "Fun Facts": "#e0a86a",
  "Beziehung & Familie": "#e28b9c",
  "Party & Nightlife": "#9fcf8f",
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
  document.getElementById("progress-count").textContent = `${found}/25`;
}

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

    cell.innerHTML = foundName
      ? `<span class="cell__check">✓</span><span class="cell__found">${escapeHtml(foundName)}</span>`
      : `<span class="cell__dot"></span><span class="cell__text">${escapeHtml(question.shortLabel || question.text)}</span>`;

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

// ---------- Feld-Overlay ("Wen hast du gefunden?") ----------

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
    errorEl.textContent = "Diese Person hast du schon für ein anderes Feld eingetragen.";
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

function checkBingo() {
  if (state.bingoAt) return; // schon erreicht, nicht erneut feiern
  if (ACTIVE_WIN_RULE(state.progress)) {
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
