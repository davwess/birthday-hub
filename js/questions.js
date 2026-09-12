// ============================================================
// TESTDATEN – Bingo-Aufgabenpool
// ============================================================
// Diese Datei wird VOR der Party komplett durch die finalen
// Aufgaben aus dem gemeinsamen Google Sheet ersetzt (Phase 5/6).
// Die Website braucht am Party-Abend keine Internetverbindung
// zum Sheet – die Aufgaben stehen fest in dieser Datei.
//
// Struktur: 6 Kategorien x 3 Aufgaben = 18 Aufgaben insgesamt.
//
// Jede Aufgabe hat zwei Texte:
// - shortLabel: kurzes Stichwort, erscheint auf der Karte selbst.
// - text: die volle Aufgabe, erscheint erst beim Antippen.
//
// Wichtig für später:
// - CATEGORY_ORDER legt die Reihenfolge der Kategorien auf der Seite fest.
// - CATEGORY_QUOTAS legt fest, wie viele Aufgaben pro Kategorie auf die
//   Karte kommen (aktuell 3 - also alle vorhandenen Aufgaben je Kategorie).
//   Wird der Pool je Kategorie später größer als die Quote, bekommen
//   unterschiedliche Gäste automatisch unterschiedlich zusammengestellte
//   Aufgaben innerhalb der Kategorie.
// ============================================================

const CATEGORY_ORDER = [
  "Bennet",
  "David",
  "Bennet & David",
  "Freunde & Vergangenheit",
  "Reisen & Erlebnisse",
  "Random / Party",
];

const QUESTION_POOL = [
  // ---- Bennet ----
  { id: "b1", category: "Bennet", shortLabel: "Kennt Bennets Lieblingsgetränk", text: "Finde jemanden, der/die Bennets Lieblingsgetränk kennt" },
  { id: "b2", category: "Bennet", shortLabel: "Reiste mit Bennet", text: "Finde jemanden, der/die schon mal mit Bennet gereist ist" },
  { id: "b3", category: "Bennet", shortLabel: "Kennt Bennet von der Arbeit", text: "Finde jemanden, der/die Bennet von der Arbeit kennt" },

  // ---- David ----
  { id: "d1", category: "David", shortLabel: "Kennt Davids Lieblingsserie", text: "Finde jemanden, der/die Davids Lieblingsserie kennt" },
  { id: "d2", category: "David", shortLabel: "Übernachtete bei David", text: "Finde jemanden, der/die schon mal bei David übernachtet hat" },
  { id: "d3", category: "David", shortLabel: "Kennt David vom Studium", text: "Finde jemanden, der/die David vom Studium kennt" },

  // ---- Bennet & David ----
  { id: "bd1", category: "Bennet & David", shortLabel: "Weiß, wie sie sich kennenlernten", text: "Finde jemanden, der/die weiß, wie sich Bennet und David kennengelernt haben" },
  { id: "bd2", category: "Bennet & David", shortLabel: "War mit beiden im Urlaub", text: "Finde jemanden, der/die schon mal mit beiden im Urlaub war" },
  { id: "bd3", category: "Bennet & David", shortLabel: "Hat gemeinsames Foto (5 Jahre)", text: "Finde jemanden, der/die ein gemeinsames Foto von beiden aus den letzten 5 Jahren hat" },

  // ---- Freunde & Vergangenheit ----
  { id: "fv1", category: "Freunde & Vergangenheit", shortLabel: "Kennt uns seit 10+ Jahren", text: "Finde jemanden, der/die Bennet oder David schon länger als 10 Jahre kennt" },
  { id: "fv2", category: "Freunde & Vergangenheit", shortLabel: "Ging mit uns zur Schule", text: "Finde jemanden, der/die mit einem von beiden zur Schule gegangen ist" },
  { id: "fv3", category: "Freunde & Vergangenheit", shortLabel: "Zum 1. Mal dabei", text: "Finde jemanden, der/die heute zum ersten Mal dabei ist" },

  // ---- Reisen & Erlebnisse ----
  { id: "re1", category: "Reisen & Erlebnisse", shortLabel: "10+ Länder bereist", text: "Finde jemanden, der/die schon in mehr als 10 Ländern war" },
  { id: "re2", category: "Reisen & Erlebnisse", shortLabel: "Flug verpasst", text: "Finde jemanden, der/die schon mal einen Flug verpasst hat" },
  { id: "re3", category: "Reisen & Erlebnisse", shortLabel: "Urlaub diesen Sommer", text: "Finde jemanden, der/die diesen Sommer im Urlaub war" },

  // ---- Random / Party ----
  { id: "rp1", category: "Random / Party", shortLabel: "Bis Sonnenaufgang gefeiert", text: "Finde jemanden, der/die schon mal bis Sonnenaufgang gefeiert hat" },
  { id: "rp2", category: "Random / Party", shortLabel: "Spielt ein Instrument", text: "Finde jemanden, der/die ein Instrument spielt" },
  { id: "rp3", category: "Random / Party", shortLabel: "Kann Zunge rollen", text: "Finde jemanden, der/die die Zunge rollen kann" },
];

// Wie viele Aufgaben jede Kategorie auf einer Karte beisteuert.
const CATEGORY_QUOTAS = {
  "Bennet": 3,
  "David": 3,
  "Bennet & David": 3,
  "Freunde & Vergangenheit": 3,
  "Reisen & Erlebnisse": 3,
  "Random / Party": 3,
};
