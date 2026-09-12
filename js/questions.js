// ============================================================
// TESTDATEN – Bingo-Fragenpool
// ============================================================
// Diese Datei wird VOR der Party komplett durch die finalen
// Fragen aus dem gemeinsamen Google Sheet ersetzt (Phase 5).
// Die Website braucht am Party-Abend keine Internetverbindung
// zum Sheet – die Fragen stehen fest in dieser Datei.
//
// Jede Frage hat zwei Texte:
// - shortLabel: kurzes Stichwort (2-4 Wörter), erscheint auf der
//   Karte selbst – muss auf einem kleinen Handy-Feld lesbar sein.
// - text: die volle Frage, erscheint erst, wenn ein Feld angetippt
//   wird.
//
// Wichtig für später:
// - Jede Kategorie sollte MEHR Fragen enthalten als ihre Quote
//   in CATEGORY_QUOTAS, sonst bekommen alle Gäste dieselbe Karte.
// - Die Summe aller Quoten in CATEGORY_QUOTAS muss 25 ergeben
//   (5 x 5 Karte).
// - Beim finalen Fragenpool aus dem Google Sheet bitte für jede
//   Frage auch ein kurzes shortLabel mitliefern.
// ============================================================

const QUESTION_POOL = [
  // ---- Reisen ----
  { id: "r1", category: "Reisen", shortLabel: "10+ Länder bereist", text: "Finde jemanden, der/die schon in mehr als 10 Ländern war" },
  { id: "r2", category: "Reisen", shortLabel: "Nie außerhalb Europas", text: "Finde jemanden, der/die noch nie außerhalb Europas war" },
  { id: "r3", category: "Reisen", shortLabel: "Urlaub diesen Sommer", text: "Finde jemanden, der/die diesen Sommer im Urlaub war" },
  { id: "r4", category: "Reisen", shortLabel: "Flug verpasst", text: "Finde jemanden, der/die schon mal einen Flug verpasst hat" },
  { id: "r5", category: "Reisen", shortLabel: "Per Anhalter gefahren", text: "Finde jemanden, der/die schon mal per Anhalter gefahren ist" },
  { id: "r6", category: "Reisen", shortLabel: "Roadtrip gemacht", text: "Finde jemanden, der/die einen Roadtrip gemacht hat" },
  { id: "r7", category: "Reisen", shortLabel: "Schon ausgewandert", text: "Finde jemanden, der/die schon mal ausgewandert ist (auch kurzzeitig)" },
  { id: "r8", category: "Reisen", shortLabel: "Noch nie campen war", text: "Finde jemanden, der/die noch nie campen war" },

  // ---- Job & Karriere ----
  { id: "j1", category: "Job & Karriere", shortLabel: "Blind gekündigt", text: "Finde jemanden, der/die schon mal gekündigt hat, ohne einen neuen Job zu haben" },
  { id: "j2", category: "Job & Karriere", shortLabel: "Job seit 10+ Jahren", text: "Finde jemanden, der/die im selben Job wie vor 10 Jahren arbeitet" },
  { id: "j3", category: "Job & Karriere", shortLabel: "Arbeitet im Homeoffice", text: "Finde jemanden, der/die aktuell im Homeoffice arbeitet" },
  { id: "j4", category: "Job & Karriere", shortLabel: "Ist selbstständig", text: "Finde jemanden, der/die selbstständig ist" },
  { id: "j5", category: "Job & Karriere", shortLabel: "Nie Gehalt verhandelt", text: "Finde jemanden, der/die noch nie eine Gehaltserhöhung verhandelt hat" },
  { id: "j6", category: "Job & Karriere", shortLabel: "Überstunden diese Woche", text: "Finde jemanden, der/die diese Woche schon Überstunden gemacht hat" },
  { id: "j7", category: "Job & Karriere", shortLabel: "Wollte Job hinschmeißen", text: "Finde jemanden, der/die den Job schon mal am liebsten hingeschmissen hätte" },
  { id: "j8", category: "Job & Karriere", shortLabel: "Branche gewechselt", text: "Finde jemanden, der/die in einer ganz anderen Branche als geplant gelandet ist" },

  // ---- Fun Facts ----
  { id: "f1", category: "Fun Facts", shortLabel: "Spricht 2. Sprache fließend", text: "Finde jemanden, der/die eine Fremdsprache fließend spricht" },
  { id: "f2", category: "Fun Facts", shortLabel: "Kein Tattoo", text: "Finde jemanden, der/die noch nie ein Tattoo hatte" },
  { id: "f3", category: "Fun Facts", shortLabel: "War auf der Bühne", text: "Finde jemanden, der/die schon mal auf einer Bühne stand" },
  { id: "f4", category: "Fun Facts", shortLabel: "Spielt ein Instrument", text: "Finde jemanden, der/die ein Instrument spielt" },
  { id: "f5", category: "Fun Facts", shortLabel: "Hat Höhenangst", text: "Finde jemanden, der/die Höhenangst hat" },
  { id: "f6", category: "Fun Facts", shortLabel: "War im Fernsehen", text: "Finde jemanden, der/die im Fernsehen zu sehen war" },
  { id: "f7", category: "Fun Facts", shortLabel: "Wettkampfsportler(in)", text: "Finde jemanden, der/die eine Sportart auf Wettkampfniveau macht/gemacht hat" },
  { id: "f8", category: "Fun Facts", shortLabel: "Kann Zunge rollen", text: "Finde jemanden, der/die die Zunge rollen kann" },

  // ---- Beziehung & Familie ----
  { id: "b1", category: "Beziehung & Familie", shortLabel: "Kennt uns seit 10+ Jahren", text: "Finde jemanden, der/die Bennet oder David schon länger als 10 Jahre kennt" },
  { id: "b2", category: "Beziehung & Familie", shortLabel: "Hat Geschwister", text: "Finde jemanden, der/die Geschwister hat" },
  { id: "b3", category: "Beziehung & Familie", shortLabel: "Ist verheiratet", text: "Finde jemanden, der/die verheiratet ist" },
  { id: "b4", category: "Beziehung & Familie", shortLabel: "War Trauzeuge/-in", text: "Finde jemanden, der/die schon mal Trauzeuge/-in war" },
  { id: "b5", category: "Beziehung & Familie", shortLabel: "Hat ein Haustier", text: "Finde jemanden, der/die ein Haustier hat" },
  { id: "b6", category: "Beziehung & Familie", shortLabel: "Angereist von außerhalb", text: "Finde jemanden, der/die aus einer anderen Stadt als Hamburg angereist ist" },
  { id: "b7", category: "Beziehung & Familie", shortLabel: "Kennt uns seit der Schule", text: "Finde jemanden, der/die Bennet und David beide schon vor dem Studium kannte" },
  { id: "b8", category: "Beziehung & Familie", shortLabel: "Zum 1. Mal hier", text: "Finde jemanden, der/die heute zum ersten Mal hier ist" },

  // ---- Party & Nightlife ----
  { id: "p1", category: "Party & Nightlife", shortLabel: "Bis Sonnenaufgang gefeiert", text: "Finde jemanden, der/die schon mal bis Sonnenaufgang gefeiert hat" },
  { id: "p2", category: "Party & Nightlife", shortLabel: "Hat Lieblingscocktail", text: "Finde jemanden, der/die einen Lieblingscocktail hat" },
  { id: "p3", category: "Party & Nightlife", shortLabel: "Auf Tisch getanzt", text: "Finde jemanden, der/die schon mal auf einem Tisch getanzt hat" },
  { id: "p4", category: "Party & Nightlife", shortLabel: "Tanzt trotzdem", text: "Finde jemanden, der/die heute Abend tanzt, auch wenn er/sie \"nicht tanzen kann\"" },
  { id: "p5", category: "Party & Nightlife", shortLabel: "Karaoke gesungen", text: "Finde jemanden, der/die schon mal Karaoke gesungen hat" },
  { id: "p6", category: "Party & Nightlife", shortLabel: "Kennt diese Bar", text: "Finde jemanden, der/die diese Bar schon kennt" },
  { id: "p7", category: "Party & Nightlife", shortLabel: "Bleibt nach Mitternacht", text: "Finde jemanden, der/die länger als bis Mitternacht bleiben wird" },
  { id: "p8", category: "Party & Nightlife", shortLabel: "Bereute mal Kater", text: "Finde jemanden, der/die schon mal einen Kater am nächsten Morgen bereut hat" },
];

// Wie viele Fragen jede Kategorie auf einer Karte beisteuert.
// Summe muss 25 ergeben (5 x 5 Karte).
const CATEGORY_QUOTAS = {
  "Reisen": 5,
  "Job & Karriere": 5,
  "Fun Facts": 5,
  "Beziehung & Familie": 5,
  "Party & Nightlife": 5,
};
