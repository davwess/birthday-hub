// ============================================================
// Bingo-Aufgabenpool (finale Fragen aus "Fragenliste BINGO.xlsx")
// ============================================================
// 25 Aufgaben insgesamt. Jede hat ein "tag", das steuert, wie sie bei der
// Kartengenerierung behandelt wird (siehe generateCard() in js/bingo.js):
//
// - tag "P"  (Pflicht):   landet garantiert auf jeder Karte.
// - tag "S"  (Sonstige):  frei/zufällig - füllt die Karte bis 18 Felder auf.
// - alles andere (z. B. "A1", "A2"): Alternativ-Gruppe. Der Buchstabe vor der
//   Zahl ist der Gruppen-Schlüssel (A1/A2 -> Gruppe "A"). Pro Gruppe wird
//   genau eine Aufgabe zufällig gezogen, nie mehrere aus derselben Gruppe.
//
// Aktuell: 11 Pflicht + 4 Alternativ-Gruppen (A/B/C/D) + 5 Sonstige, von
// denen 3 zufällig gezogen werden -> 11 + 4 + 3 = 18 Felder pro Karte.
//
// Jede Aufgabe hat zwei Texte:
// - shortLabel: kurzes Stichwort, erscheint auf der Karte selbst.
// - text: die volle Aufgabe, erscheint erst beim Antippen.
//
// "category" wird für die Fragen-Auswahl NICHT mehr verwendet (nur noch für
// den kleinen farbigen Punkt auf der Kachel, siehe CATEGORY_COLORS in
// js/bingo.js).
//
// Fragen deaktivieren: in der Excel eine Zeile mit "nein" in der
// aktiv-Spalte markieren und diese Zeile hier mit aktiv:false übernehmen -
// sie wird dann bei der Kartengenerierung ignoriert.
// ============================================================

const CATEGORY_ORDER = ["Bennet & David", "Gäste", "Reisen", "Aktivität"];

// "difficulty" (Schwierigkeit: "leicht"/"mittel"/"schwer") wird für die
// Platzierung im Raster genutzt: die mittlere Reihe bekommt bevorzugt keine
// "leicht"-Aufgaben, außer sie gehören zur Kategorie "Aktivität" (siehe
// arrangeCells() in js/bingo.js). So gibt es keinen Weg zum "Bingo", der nur
// aus leichten Aufgaben besteht.
const QUESTION_POOL = [
  { id: 1, category: "Bennet & David", tag: "A1", difficulty: "mittel", aktiv: true, shortLabel: "Mit Bennet / David studiert", text: "Finde jemanden, der/die schon mal mit Bennet oder David studiert hat." },
  { id: 2, category: "Bennet & David", tag: "A2", difficulty: "schwer", aktiv: true, shortLabel: "Mit Bennet / David gearbeiteit", text: "Finde jemanden, der/die schon mal mit Bennet oder David zusammengearbeitet hat." },
  { id: 3, category: "Bennet & David", tag: "P", difficulty: "leicht", aktiv: true, shortLabel: "Mit Bennet / David in Club oder Verein", text: "Finde jemanden, der/die mit Bennet oder David in einem Club oder Verein ist/war." },
  { id: 4, category: "Bennet & David", tag: "P", difficulty: "mittel", aktiv: true, shortLabel: "Mit Bennet / David im Skiurlaub gewesen", text: "Finde jemanden, der/die schon mal mit Bennet oder David im Skiurlaub war." },
  { id: 5, category: "Bennet & David", tag: "P", difficulty: "mittel", aktiv: true, shortLabel: "Hat Bennet / David schon nackt gesehen", text: "Finde jemanden, der/die Bennet oder David schon mal nackt gesehen hat." },
  { id: 6, category: "Bennet & David", tag: "S", difficulty: "leicht", aktiv: true, shortLabel: "Größer als Bennet & David", text: "Finde jemanden, der/die größer ist als Bennet und David." },
  { id: 7, category: "Bennet & David", tag: "B1", difficulty: "leicht", aktiv: true, shortLabel: "Kennt Bennet / David über 15 Jahre", text: "Finde jemanden, der/die Bennet oder David schon länger als 15 Jahre kennt." },
  { id: 8, category: "Bennet & David", tag: "B2", difficulty: "schwer", aktiv: true, shortLabel: "Kennt Bennet / David weniger als 2 Jahre", text: "Finde jemanden, der/die Bennet oder David seit weniger als 2 Jahren kennt." },
  { id: 9, category: "Bennet & David", tag: "S", difficulty: "leicht", aktiv: true, shortLabel: "Mit Bennet / David in Zelt geschlafen", text: "Finde jemanden, der/die schon mal mit Bennet oder David in einem Zelt geschlafen hat." },
  { id: 10, category: "Bennet & David", tag: "P", difficulty: "leicht", aktiv: true, shortLabel: "Mit Bennet / David zwischen 6-9 Uhr getrunken", text: "Finde jemanden, der/die schon mal mit Bennet oder David zwischen 6 und 9 Uhr morgens getrunken hat." },
  { id: 11, category: "Gäste", tag: "S", difficulty: "mittel", aktiv: true, shortLabel: "Wohnt in Berlin", text: "Finde jemanden, der/die in Berlin wohnt." },
  { id: 12, category: "Gäste", tag: "P", difficulty: "schwer", aktiv: true, shortLabel: "Spricht eine weitere Fremdsprache", text: "Finde jemanden, der/die neben Englisch noch eine weitere Fremdsprache spricht." },
  { id: 13, category: "Gäste", tag: "P", difficulty: "leicht", aktiv: true, shortLabel: "Hat oder macht einen Doktor", text: "Finde jemanden, der/die einen Doktortitel hat oder gerade macht." },
  { id: 14, category: "Gäste", tag: "C1", difficulty: "mittel", aktiv: true, shortLabel: "Ist oder war Unternehmensberater", text: "Finde jemanden, der/die Unternehmensberater(in) ist oder war." },
  { id: 15, category: "Gäste", tag: "C2", difficulty: "schwer", aktiv: true, shortLabel: "Ist selbstständig", text: "Finde jemanden, der/die selbstständig ist." },
  { id: 16, category: "Gäste", tag: "C3", difficulty: "mittel", aktiv: true, shortLabel: "Ist oder wird Lehrer", text: "Finde jemanden, der/die Lehrer(in) ist oder wird." },
  { id: 17, category: "Gäste", tag: "P", difficulty: "mittel", aktiv: true, shortLabel: "Habe ich heute kennengelernt", text: "Finde jemanden, den/die du heute zum ersten Mal triffst." },
  { id: 18, category: "Gäste", tag: "P", difficulty: "mittel", aktiv: true, shortLabel: "Hat mehr als 5 Monate im Ausland gelebt", text: "Finde jemanden, der/die schon mal mehr als 5 Monate im Ausland gelebt hat." },
  { id: 19, category: "Gäste", tag: "S", difficulty: "mittel", aktiv: true, shortLabel: "Hat Halbmarathon beendet", text: "Finde jemanden, der/die schon mal erfolgreich einen Halbmarathon beendet hat." },
  { id: 20, category: "Reisen", tag: "D1", difficulty: "schwer", aktiv: true, shortLabel: "War in Südamerika", text: "Finde jemanden, der/die schon mal in Südamerika war." },
  { id: 21, category: "Reisen", tag: "D2", difficulty: "schwer", aktiv: true, shortLabel: "War in mehr als 20 Ländern", text: "Finde jemanden, der/die schon mal in mehr als 20 Ländern war." },
  { id: 22, category: "Reisen", tag: "S", difficulty: "mittel", aktiv: true, shortLabel: "Hat BahnBonus Status Silber oder höher", text: "Finde jemanden, der/die einen BahnBonus-Status von Silber oder höher hat." },
  { id: 23, category: "Reisen", tag: "P", difficulty: "mittel", aktiv: true, shortLabel: "War dieses Jahr außerhalb von Europa", text: "Finde jemanden, der/die dieses Jahr schon außerhalb von Europa war." },
  { id: 24, category: "Aktivität", tag: "P", difficulty: "mittel", aktiv: true, shortLabel: "Hat gerade Drink mit mir geext", text: "Finde jemanden, der/die gerade einen Drink mit dir geext hat." },
  { id: 25, category: "Aktivität", tag: "P", difficulty: "leicht", aktiv: true, shortLabel: "Haben ein Foto in POV gemacht", text: "Finde jemanden, der/die dir gerade ein Foto gemacht und hochgeladen hat." },
];
