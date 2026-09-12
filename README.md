# Bennet & David – 30. Geburtstag – Party Hub

Kleine mobile Website für die Geburtstagsparty am 19.09.2026, Deja Vú Bar, Hamburg.

## Struktur

```
birthday-hub/
├── index.html        # Startseite mit Foto-Kachel, 3 Kacheln + einmaligem Namens-Prompt
├── bingo.html         # Bingo (Path Bingo, fertig)
├── fotos.html         # Platzhalter (Phase 8: externer Foto-Link)
├── song.html          # Songwunsch-Formular (Frontend + Sheet-Anbindung fertig)
├── css/style.css      # Styles (Bingo-Grid, Songformular, Overlays)
├── js/app.js          # Logik Startseite (Namens-Prompt)
├── js/guest.js         # Gemeinsamer Gast-Name (geteilt zwischen Startseite/Bingo/Songwunsch)
├── js/questions.js    # Bingo-Aufgabenpool + Kategorien + Quoten (TESTDATEN)
├── js/bingo.js         # Bingo-Logik (Karten, Speicherung, Path-Bingo-Regel)
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
- Phase 6b: Songwunsch → Google Sheet Anbindung – offen
- Phase 7+: Zentrale Bingo-Synchronisierung, Fotos-Link – offen

## Startseiten-Foto

- `assets/hero.jpg` ist ein eigenes Foto von Bennet & David, oben auf der
  Startseite als flache Foto-Kachel (`.hero-photo`, Seitenverhältnis 12:5,
  dezenter Verlauf unten fürs reine Bild-Finish). Titel, Tagline und Datum
  stehen wie ursprünglich als separater, zentrierter Text darunter (`.hero h1`,
  `.tagline`, `.meta`) – nur die Foto-Kachel selbst ist jetzt flacher/kürzer
  als in der allerersten Version.
- Das Originalfoto liegt außerhalb des Repos unter
  `30. Geburtstag/WhatsApp Bild David & Bennet.JPG` und wurde eng auf Gesichter/
  Hände zugeschnitten und auf 1000×417 px verkleinert (~90 KB) nach
  `assets/hero.jpg` exportiert. Soll das Foto mal ausgetauscht werden: neues
  Foto auf ca. 1000 px Breite im Seitenverhältnis 12:5 zuschneiden (Motiv oben,
  unteres Drittel eher ruhig/einfarbig lassen wegen des Textes), als
  `assets/hero.jpg` speichern und die `?v=`-Nummer hochzählen (siehe unten).

## Bingo – wie es funktioniert

- **Struktur:** 6 Kategorien × 3 Aufgaben = 18 Aufgaben insgesamt (`CATEGORY_ORDER`,
  `QUESTION_POOL`, `CATEGORY_QUOTAS` in `js/questions.js`). Aktuelle Platzhalter-
  Kategorien: Bennet, David, Bennet & David, Freunde & Vergangenheit,
  Reisen & Erlebnisse, Random / Party.
- **Kategorien werden den Gästen bewusst nicht angezeigt** (kein Name, kein
  Fortschritt pro Kategorie) – sie dienen nur intern der Gruppierung, den
  farbigen Punkten auf den Karten und der Gewinnlogik. Sichtbar ist nur der
  Gesamtfortschritt oben rechts (z. B. „7/18“).
- Beim ersten Öffnen von `bingo.html` wird nach dem Namen gefragt, danach werden
  die 18 Aufgaben als Kachel-Raster mit 3 Spalten × 6 Reihen angezeigt (statt der
  früheren 5×5-Kacheln) – dadurch sind die einzelnen Kacheln größer und besser
  lesbar. Die Reihenfolge der Kacheln folgt intern der Kategorie-Gruppierung,
  sichtbar ist das aber nicht.
- Antippen einer Kachel öffnet „Wen hast du gefunden?“. Ist die Aufgabe schon
  erledigt, bleibt der kurze Aufgabentext weiterhin sichtbar (klein, unter dem
  Haken), zusätzlich zum eingetragenen Namen – nicht nur ein Häkchen.
- Eine gefundene Person kann nicht zweimal auf derselben Karte verwendet werden –
  kategorieübergreifend, nicht nur innerhalb einer Kategorie.
- Alles wird in `localStorage` gespeichert – ein Neuladen oder Schließen der Seite
  löscht den Fortschritt nicht.
- **Gewinnregel: „Path Bingo"** (`ACTIVE_WIN_RULE` in `js/bingo.js`, aktuell
  `WIN_RULES.pathBingo`): „Bingo“, sobald es einen durchgehend verbundenen Pfad
  aus erledigten Kacheln von der obersten bis zur untersten Reihe gibt. Ein
  erledigtes Feld darf sich dabei mit einem erledigten Feld in der Reihe
  darunter verbinden, das direkt darunter, diagonal links darunter oder
  diagonal rechts darunter liegt (nicht mit einem, das zwei Spalten
  daneben liegt). Es reicht, wenn irgendein gültiger Pfad existiert – der
  Gast muss dafür nicht gezielt an einem laufenden Pfad weiterarbeiten,
  jede Aufgabe bleibt jederzeit anklickbar. Nach dem ersten „Bingo“ gibt es
  keine Sperre; es kann normal weitergespielt werden bis 18/18.
  Die Pfadprüfung (`hasVerticalPath`) ist nicht auf 6 Reihen fest verdrahtet,
  sondern berechnet die Zeilenzahl aus der Aufgabenanzahl und der
  Spaltenzahl (`BINGO_COLUMNS`, muss zum CSS-Grid passen) – funktioniert
  also automatisch weiter, falls später mehr/weniger Reihen dazukommen.
  Alternative Regeln (`categoryThreshold`, `complete`) sind weiterhin in
  `WIN_RULES` vorhanden und lassen sich per Zuweisung an `ACTIVE_WIN_RULE`
  jederzeit reaktivieren.
- **Bingo-Feier:** Beim Erreichen erscheint einmalig groß "🎉 BINGO!" in der
  Bildschirmmitte (ca. 2,2 Sek.), danach bleibt dauerhaft ein kleines Badge
  unten sichtbar ("🎉 Bingo erreicht") – auch nach einem Reload, solange
  `state.bingoAt` gesetzt ist. Die große Einblendung erscheint nur einmal.
- **Vor der Party:** `js/questions.js` mit den finalen Aufgaben aus dem gemeinsamen
  Google Sheet ersetzen (Phase 5/6). Die Website braucht danach keine Internet-
  verbindung zum Sheet mehr.
- Jede Aufgabe hat ein `shortLabel` (kurzes Stichwort, auf der Karte sichtbar) und
  einen `text` (volle Aufgabe, erscheint erst beim Antippen). Der finale
  Aufgabenpool aus dem Sheet sollte beides enthalten.
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
- Sobald `SHEET_ENDPOINT_URL` in `js/song.js` mit der Apps-Script-URL befüllt
  ist, werden Wünsche zusätzlich zentral ins Google Sheet gesendet
  (fire-and-forget, blockiert die Nutzung nicht bei fehlendem Netz). Gäste
  sehen das Google Sheet nie.

### Google Sheet, Apps Script & Host-Dashboard

Das Backend (Songwünsche entgegennehmen) und das Host-Dashboard (offene
Wünsche ansehen, als gespielt markieren) laufen komplett in **Google Apps
Script** – bewusst NICHT im GitHub-Repo, weil dieses öffentlich ist und sich
darin kein Geheimnis (Zugriffsschlüssel) verstecken lässt.

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
- Google Sheet-Spalten: Zeit, Song, Interpret, Gast, Gespielt. Der Zeitstempel
  wird beim Empfang serverseitig gesetzt (zuverlässiger als die Uhrzeit des
  Gäste-Handys).

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
