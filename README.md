# Bennet & David – 30. Geburtstag – Party Hub

Kleine mobile Website für die Geburtstagsparty am 19.09.2026, Deja Vú Bar, Hamburg.

## Struktur

```
birthday-hub/
├── index.html        # Startseite mit Foto-Kachel, 3 Kacheln + einmaligem Namens-Prompt
├── bingo.html         # Bingo (Path Bingo + Zeilen-Minimum, fertig)
├── fotos.html         # Foto-Link zu Knipsmig (Phase 8)
├── song.html          # Songwunsch-Formular (Frontend + Sheet-Anbindung fertig)
├── css/style.css      # Styles (Bingo-Grid, Songformular, Overlays)
├── js/app.js          # Logik Startseite (Namens-Prompt)
├── js/guest.js         # Gemeinsamer Gast-Name + Sheet-Anbindung (geteilt: Startseite/Bingo/Songwunsch)
├── js/questions.js    # Bingo-Aufgabenpool (25 finale Fragen aus Fragenliste BINGO.xlsx)
├── js/bingo.js         # Bingo-Logik (Karten, Speicherung, Path-Bingo + Zeilen-Minimum)
├── js/song.js          # Songwunsch-Formular-Logik
└── assets/             # Bilder etc.
```

## Stand

- Phase 1: Grundgerüst ✅
- Phase 2: Startseite mit 3 Kacheln + Platzhalter-Unterseiten ✅
- Phase 3: GitHub + GitHub Pages Hosting ✅
- Phase 4: Bingo-Grundfunktion ✅
- Phase 5: Bingo-Regeln verfeinert (Path Bingo) ✅
- Phase 6a: Songwunsch-Formular (Frontend) ✅
- Phase 6b: Songwunsch → Google Sheet + Host-Dashboard ✅
- Bingo-Fragenpool: finale 25 Fragen aus `Fragenliste BINGO.xlsx` ✅
- Phase 7: Zentrale Bingo-Synchronisierung (Bingo-Log im Google Sheet) ✅
- Phase 8: Fotos-Link (Knipsmig) ✅ – Design-Politur & Gesamttest offen

## Startseiten-Foto

- `assets/hero.jpg` ist ein eigenes Foto von Bennet & David, oben auf der
  Startseite als flache Foto-Kachel (`.hero-photo`, Seitenverhältnis 12:5,
  dezenter Verlauf unten), gefolgt von Titel, Tagline und Datum (`.hero h1`,
  `.tagline`, `.meta`) und den drei Karten.
- "Wir freuen uns auf euch!" (`.footer-note`) ist etwas größer als
  Standard-Fließtext (1rem statt der ursprünglichen 0.78rem).
- Das Originalfoto liegt außerhalb des Repos unter
  `30. Geburtstag/WhatsApp Bild David & Bennet.JPG` und wurde eng auf Gesichter/
  Hände zugeschnitten und auf 1000×417 px verkleinert (~90 KB) nach
  `assets/hero.jpg` exportiert. Soll das Foto mal ausgetauscht werden: neues
  Foto auf ca. 1000 px Breite im Seitenverhältnis 12:5 zuschneiden (Motiv oben,
  unteres Drittel eher ruhig/einfarbig lassen wegen des Textes), als
  `assets/hero.jpg` speichern und die `?v=`-Nummer hochzählen (siehe unten).

## Fotos – wie es funktioniert

- `fotos.html` verlinkt direkt auf unser Event bei **Knipsmig**
  (`https://knipsmig.com/9gn0EQ0L`) – ein Klick auf "Fotos hochladen" öffnet
  die Knipsmig-Foto-Seite in einem neuen Tab, kein App-Download, kein Login
  nötig.
- Der Link ist fest im HTML eingetragen (kein eigenes Backend nötig, anders
  als bei Bingo/Songwunsch). Soll sich der Link mal ändern (z. B. neues
  Event angelegt): in `fotos.html` das `href` beim "Fotos hochladen"-Button
  anpassen und die `?v=`-Nummer hochzählen.
- Bewusst gegen POV entschieden: Knipsmig ist komplett kostenlos und ohne
  Gästelimit/Foto-Obergrenze pro Person, was für eine Bar-Party mit vielen
  Gästen über die ganze Nacht praktischer ist als POVs Preisstaffelung ab
  10 Gästen und festem Foto-Kontingent pro Gast.

## Bingo – wie es funktioniert

- **Fragenquelle:** `js/questions.js` enthält die 25 finalen Fragen aus
  `Fragenliste BINGO.xlsx` (Spalten ID/Kategorie/Frage kurz/Frage lang/
  Schwierigkeit/Auswahltag/aktiv). Jede Frage hat dort ein `tag`-Feld, das
  bestimmt, wie sie in `generateCard()` (`js/bingo.js`) behandelt wird:
  - **`"P"` (Pflicht, 11 Fragen):** landet garantiert auf jeder Karte.
  - **`"S"` (Sonstige, 5 Fragen):** freier Pool, davon werden zufällig so
    viele gezogen, wie noch bis 18 Felder fehlen (aktuell 3 von 5).
  - **Buchstabe+Zahl wie `"A1"`/`"A2"` (Alternativ-Gruppen, aktuell A/B/C/D):**
    Fragen mit demselben Buchstaben sind Alternativen zueinander – pro Gruppe
    wird genau eine zufällig gezogen, nie mehrere aus derselben Gruppe.
  - Rechnung: 11 Pflicht + 4 Alternativ-Gruppen + 3 Sonstige = 18 Felder.
  - Eine Frage per `aktiv: false` in `js/questions.js` ausschließen, ohne sie
    zu löschen (entspricht "nein" in der aktiv-Spalte der Excel).
- **Platzierung im Raster:** Die mittlere Reihe (bei 3×6 aktuell Reihe 3 von
  6) bekommt bevorzugt die beiden "Aktivität"-Fragen; reicht das nicht, füllt
  `arrangeCells()` mit anderen "nicht leicht"-Fragen auf. Eine "leicht"
  eingestufte Frage aus einer anderen Kategorie kommt nie in die mittlere
  Reihe. Da jeder Path-Bingo-Pfad zwingend durch diese Reihe muss, kann es
  nie einen Gewinn-Pfad geben, der nur aus leichten Aufgaben besteht. Alle
  übrigen Felder werden normal gemischt – dadurch sieht jede Karte trotz der
  vielen identischen Pflicht-Fragen anders aus.
- **Kategorien** (Bennet & David, Gäste, Reisen, Aktivität) werden den
  Gästen bewusst nicht angezeigt und fließen nicht mehr in die Auswahl-Logik
  ein – nur der farbige Punkt auf der Kachel (`CATEGORY_COLORS`) und die
  Aktivität-Sonderregel oben nutzen sie noch. Sichtbar ist nur der
  Gesamtfortschritt oben rechts (z. B. „7/18“).
- Beim ersten Öffnen von `bingo.html` wird nach dem Namen gefragt, danach werden
  die 18 Aufgaben als Kachel-Raster mit 3 Spalten × 6 Reihen angezeigt.
- Antippen einer Kachel öffnet „Wen hast du gefunden?“. Ist die Aufgabe schon
  erledigt, bleibt der kurze Aufgabentext weiterhin sichtbar (klein, unter dem
  Haken), zusätzlich zum eingetragenen Namen – nicht nur ein Häkchen.
- Eine gefundene Person kann nicht zweimal auf derselben Karte verwendet werden –
  kategorieübergreifend, nicht nur innerhalb einer Kategorie.
- Alles wird in `localStorage` gespeichert – ein Neuladen oder Schließen der Seite
  löscht den Fortschritt nicht.
- **Gewinnregel: „Path Bingo + Zeilen-Minimum"** (`ACTIVE_WIN_RULE` in
  `js/bingo.js`, aktuell `WIN_RULES.pathBingoRowMin`): „Bingo“, sobald
  **jede** der 6 Reihen mindestens 2 der 3 Felder ausgefüllt hat (mind.
  12 von 18 Feldern insgesamt) **und** es weiterhin einen durchgehend
  verbundenen Pfad aus erledigten Kacheln von der obersten bis zur
  untersten Reihe gibt (`hasVerticalPath`, ein Feld darf sich mit einem
  erledigten Feld direkt darunter oder diagonal links/rechts darunter
  verbinden). Rechnerisch geprüft (alle 4096 möglichen Belegungen mit
  ≥2/3 pro Reihe durchgespielt): bei 3 Spalten erfüllt jede Belegung, die
  das Zeilen-Minimum schafft, automatisch auch die Pfad-Bedingung – die
  Pfadprüfung ist also aktuell redundant, bleibt aber bewusst als
  `&&`-Bedingung im Code, falls sich `BINGO_COLUMNS` mal ändert (dann
  wäre sie wieder eine echte Zusatzbedingung). Es reicht, wenn die
  Bedingung irgendwann erfüllt ist – die Gäste müssen nicht gezielt auf
  einen Pfad hinarbeiten, jede Aufgabe bleibt jederzeit anklickbar in
  beliebiger Reihenfolge. Nach dem ersten „Bingo“ gibt es keine Sperre;
  es kann normal weitergespielt werden bis 18/18.
  Beide Prüfungen (`hasVerticalPath`, `hasMinFilledPerRow`) sind nicht auf
  6 Reihen fest verdrahtet, sondern berechnen die Zeilenzahl aus der
  Aufgabenanzahl und der Spaltenzahl (`BINGO_COLUMNS`, muss zum CSS-Grid
  passen) – funktionieren also automatisch weiter, falls später mehr/
  weniger Reihen dazukommen. Die Mindestanzahl pro Reihe steht in
  `ROW_MIN_FILLED` (aktuell 2). Alternative Regeln (`pathBingo` – nur der
  Pfad, ohne Zeilen-Minimum –, `categoryThreshold`, `complete`) sind
  weiterhin in `WIN_RULES` vorhanden und lassen sich per Zuweisung an
  `ACTIVE_WIN_RULE` jederzeit reaktivieren.
- **Bingo-Feier:** Beim Erreichen erscheint einmalig groß "🎉 BINGO!" in der
  Bildschirmmitte (ca. 2,2 Sek.), danach bleibt dauerhaft ein kleines Badge
  unten sichtbar ("🎉 Bingo erreicht") – auch nach einem Reload, solange
  `state.bingoAt` gesetzt ist. Die große Einblendung erscheint nur einmal.
- Jede Aufgabe hat ein `shortLabel` (kurzes Stichwort, auf der Karte sichtbar) und
  einen `text` (volle Aufgabe, erscheint erst beim Antippen).
- `js/bingo.js` hat oben eine `SCHEMA_VERSION`-Konstante. Falls sich der Aufbau des
  gespeicherten Spielstands mal ändert (neues Feld, andere Aufgabenanzahl o. Ä.),
  diese Zahl um 1 erhöhen – alte, nicht mehr passende Spielstände werden dann
  automatisch verworfen und neu erstellt, statt kaputt anzuzeigen. Nach dem
  Party-Start bitte nicht mehr ändern.

## Gemeinsamer Gast-Name

- `js/guest.js` speichert einen Namen unter dem Schlüssel `birthdayHubGuestName`
  (localStorage), den Startseite, Bingo und Songwunsch gemeinsam nutzen.
- Auf der Startseite erscheint beim ersten Besuch einmalig ein Namens-Prompt
  ("Wie heißt du?"), mit "Überspringen"-Option - wird nicht erneut gezeigt,
  sobald ein Name gespeichert oder übersprungen wurde
  (`birthdayHubGuestNamePromptDismissed`).
- Ist bereits ein Name gespeichert, generiert Bingo direkt eine Karte ohne
  erneut zu fragen; das Songwunsch-Formular füllt das (weiterhin änderbare)
  Namensfeld automatisch vor.
- Wird der Name zuerst bei Bingo oder beim Songwunsch eingegeben (z. B. weil
  der Prompt übersprungen wurde), wird er dort ebenfalls gespeichert und ist
  danach auch auf der jeweils anderen Seite vorhanden.

## Songwunsch – wie es funktioniert

- Formular mit Songname (Pflichtfeld), Interpret und Name (beide optional).
  Zeitpunkt wird automatisch erfasst (`timestamp`, ISO-Format).
- Nach dem Absenden erscheint „Danke! Ist auf unserer Wunschliste 🪩" mit einem
  Button, um direkt einen weiteren Song zu wünschen.
- Jeder Wunsch wird zusätzlich lokal im Browser gesichert (`localStorage`,
  Schlüssel `birthdayHubSongWishes`) als einfaches Backup.
- Sobald `SHEET_ENDPOINT_URL` in `js/guest.js` mit der Apps-Script-URL befüllt
  ist, werden Wünsche zusätzlich zentral ins Google Sheet gesendet
  (fire-and-forget, blockiert die Nutzung nicht bei fehlendem Netz). Gäste
  sehen das Google Sheet nie.

### Google Sheet, Apps Script & Host-Dashboard

Das Backend (Songwünsche + Bingo-Log entgegennehmen) und das Host-Dashboard
(offene Songwünsche ansehen, als gespielt markieren) laufen komplett in
**Google Apps Script** – bewusst NICHT im GitHub-Repo, weil dieses öffentlich
ist und sich darin kein Geheimnis (Zugriffsschlüssel) verstecken lässt.

- Referenzcode liegt zur eigenen Ablage in `../google-apps-script/` (also
  **außerhalb** von `birthday-hub`, nicht Teil des Git-Repos):
  `Code.gs` (Backend + Dashboard-Logik) und `Dashboard.html` (Host-Ansicht).
  Diese Dateien werden 1:1 in den Google Apps Script Editor eingefügt.
- In `Code.gs` ganz oben: `HOST_KEY` durch einen selbst ausgedachten, langen
  Schlüssel ersetzen – der lebt nur in Google, taucht nirgends im
  GitHub-Code auf.
- Das Dashboard ist über `<Apps-Script-URL>?key=<HOST_KEY>` erreichbar (GET).
  Ohne oder mit falschem Schlüssel erscheint nur "Kein Zugriff". Diese URL
  (mit Schlüssel) bitte nur privat teilen (z. B. per WhatsApp an Bennet und
  die DJs) – nie im Repo oder öffentlich posten.
- Dashboard-Funktionen: offene/alle Wünsche, sortiert nach Zeit (älteste
  zuerst), Zähler offener Wünsche, "Als gespielt markieren" (inkl. Rückgängig),
  automatische Aktualisierung alle 20 Sekunden.
- Google Sheet-Spalten (Tabelle "Songwünsche"): Zeit, Song, Interpret, Gast,
  Gespielt. Der Zeitstempel wird beim Empfang serverseitig gesetzt
  (zuverlässiger als die Uhrzeit des Gäste-Handys).
- **Ein `doPost` für beides:** `song.js` und `bingo.js` senden beide an
  dieselbe `SHEET_ENDPOINT_URL` (liegt gemeinsam in `js/guest.js`,
  `sendToSheet()`). Ein `type`-Feld im gesendeten Objekt entscheidet in
  `Code.gs`, welche Tabelle beschrieben wird: ohne `type` (Songwunsch) ->
  "Songwünsche", mit `"type":"bingo"` -> "Bingo".
- **Bingo-Log (Phase 7):** Sobald ein Gast zum ersten Mal "Bingo" erreicht
  (`checkBingo()` in `js/bingo.js`), wird einmalig Name + Fortschritt (z. B.
  "18/18") in die Tabelle "Bingo" geschrieben – kein Live-Leaderboard, nur ein
  einfaches Log für euch als Gastgeber, wer wann Bingo hatte. Die Tabelle wird
  beim ersten Aufruf automatisch angelegt.
- **Nach jeder Änderung an `Code.gs`:** im Apps-Script-Editor über
  **Bereitstellen → Bereitstellungen verwalten → Bearbeiten (Stift-Symbol) →
  Version: Neu → Bereitstellen** eine neue Version veröffentlichen. Nur den
  Code zu speichern reicht nicht – die laufende Web-App nutzt sonst weiter die
  alte Version.

### Ideen für später (noch nicht entschieden)

- **Live-Leaderboard in der App** (z. B. unter dem Bingo-Grid, wer wie weit
  ist): bewusst nicht umgesetzt, weil die Website bisher nur ans Sheet
  schreibt, nie davon liest – dafür bräuchte es einen Cross-Domain-Lesezugriff
  (CORS), was hier extra Komplexität und eine neue Fehlerquelle wäre.
  Einfachster Weg, falls das später doch gewünscht ist: das Google Sheet (oder
  nur die Bingo-Tabelle) über "Datei → Freigeben → Im Web veröffentlichen" als
  öffentlich lesbares CSV/JSON freigeben, das auch Gäste sehen könnten, und
  das per `fetch()` von der Website abrufen. Vorbehalt: das Sheet wäre dann
  für jeden mit Link lesbar (kein Login), ähnlich wie das Party-Foto auf der
  Startseite.

## Live-URL

https://davwess.github.io/birthday-hub/

## Lokal testen

Einfach `index.html` im Browser öffnen (Doppelklick).

## Deployment

Repo: https://github.com/davwess/birthday-hub (öffentlich, nötig für kostenloses GitHub Pages).
Hosting: GitHub Pages, Branch `main`, Ordner `/ (root)`.

**Änderungen veröffentlichen:** In GitHub Desktop erscheinen geänderte Dateien automatisch links.
Unten Commit-Nachricht eintragen → **Commit to main** → oben **Push origin**. Nach ~30–60 Sek.
ist die Änderung live unter der URL oben.

**Seite offline nehmen:** Auf GitHub → Repo → Settings → Pages → Source auf **„None"** stellen
und Save. Wieder online: Source zurück auf **„Deploy from a branch"** → main → Save.

**Browser-Cache bei CSS/JS-Änderungen:** Handys/Browser cachen `style.css` und die
`.js`-Dateien gerne hartnäckig. Deshalb werden sie in den HTML-Dateien mit einer
Versionsnummer eingebunden, z. B. `css/style.css?v=2`. Bei jeder inhaltlichen Änderung
an CSS oder JS die Zahl in **allen** HTML-Dateien um 1 erhöhen (z. B. `?v=3`) – dann lädt
jeder Browser garantiert die neue Version, ohne dass jemand manuell den Cache leeren muss.
