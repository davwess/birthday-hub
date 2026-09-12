# Bennet & David – 30. Geburtstag – Party Hub

Kleine mobile Website für die Geburtstagsparty am 19.09.2026, Deja Vú Bar, Hamburg.

## Struktur

```
birthday-hub/
├── index.html        # Startseite mit 3 Kacheln
├── bingo.html         # Bingo-Karte (Phase 4 ✅, Regeln folgen in Phase 5)
├── fotos.html         # Platzhalter (Phase 8: externer Foto-Link)
├── song.html          # Platzhalter (Phase 6: Songwunsch-Formular)
├── css/style.css      # Styles (inkl. Bingo-Kategorien, Task-Cards & Overlays)
├── js/app.js          # Logik Startseite
├── js/questions.js    # Bingo-Aufgabenpool + Kategorien + Quoten (TESTDATEN)
├── js/bingo.js         # Bingo-Logik (Karten, Speicherung, Regeln)
└── assets/             # Bilder etc.
```

## Stand

- Phase 1: Grundgerüst ✅
- Phase 2: Startseite mit 3 Kacheln + Platzhalter-Unterseiten ✅
- Phase 3: GitHub + GitHub Pages Hosting ✅
- Phase 4: Bingo-Grundfunktion ✅
- Phase 5+: Bingo-Regeln verfeinern, Songwunsch-Formular, Google Sheet Anbindung, Fotos-Link – offen

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
  die Aufgaben nach Kategorie gruppiert als große, gut lesbare Karten angezeigt –
  auf dem Handy untereinander, ab Tablet-/Desktop-Breite als Grid nebeneinander.
- Antippen einer Aufgabe öffnet „Wen hast du gefunden?“. Ist die Aufgabe schon
  erledigt, bleibt der kurze Aufgabentext weiterhin sichtbar (klein, unter dem
  Haken), zusätzlich zum eingetragenen Namen – nicht nur ein Häkchen.
- Eine gefundene Person kann nicht zweimal auf derselben Karte verwendet werden –
  kategorieübergreifend, nicht nur innerhalb einer Kategorie.
- Alles wird in `localStorage` gespeichert – ein Neuladen oder Schließen der Seite
  löscht den Fortschritt nicht.
- **Gewinnregel** (`ACTIVE_WIN_RULE` in `js/bingo.js`): „Bingo“, sobald **jede**
  der 6 Kategorien mindestens `CATEGORY_WIN_THRESHOLD` Treffer hat (Standard: 2
  von 3). Danach kann ganz normal weitergespielt werden, bis alle 18 Aufgaben
  erledigt sind – es gibt keine Sperre nach dem ersten „Bingo“. Zum Ändern der
  Schwelle einfach die Zahl in `js/bingo.js` anpassen; eine alternative Regel
  „wirklich alle 18 Aufgaben“ (`WIN_RULES.complete`) ist ebenfalls vorhanden.
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
