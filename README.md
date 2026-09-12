# Bennet & David – 30. Geburtstag – Party Hub

Kleine mobile Website für die Geburtstagsparty am 19.09.2026, Deja Vú Bar, Hamburg.

## Struktur

```
birthday-hub/
├── index.html        # Startseite mit 3 Kacheln
├── bingo.html         # Bingo-Karte (Phase 4 ✅, Regeln folgen in Phase 5)
├── fotos.html         # Platzhalter (Phase 8: externer Foto-Link)
├── song.html          # Platzhalter (Phase 6: Songwunsch-Formular)
├── css/style.css      # Styles (inkl. Bingo-Grid & Overlays)
├── js/app.js          # Logik Startseite
├── js/questions.js    # Bingo-Fragenpool + Kategorie-Quoten (TESTDATEN)
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

- Beim ersten Öffnen von `bingo.html` wird nach dem Namen gefragt, danach wird eine
  zufällige 5×5-Karte aus `js/questions.js` gezogen (pro Kategorie eine feste Anzahl,
  siehe `CATEGORY_QUOTAS`). Unterschiedliche Gäste bekommen unterschiedliche Karten.
- Antippen eines Feldes öffnet „Wen hast du gefunden?“. Dieselbe Person kann nicht
  zweimal auf derselben Karte verwendet werden.
- Alles wird in `localStorage` gespeichert – ein Neuladen oder Schließen der Seite
  löscht den Fortschritt nicht.
- Die Gewinnregel ist bewusst austauschbar: in `js/bingo.js` steht `ACTIVE_WIN_RULE`
  (aktuell „eine Reihe reicht“). Für „zwei Reihen“ oder „Full House“ genügt es, dort
  eine andere Regel aus `WIN_RULES` zuzuweisen.
- **Vor der Party:** `js/questions.js` mit den finalen Fragen aus dem gemeinsamen
  Google Sheet ersetzen (Phase 5/6). Die Website braucht danach keine Internet-
  verbindung zum Sheet mehr.
- Jede Frage hat ein `shortLabel` (kurzes Stichwort, auf der Karte sichtbar) und
  einen `text` (volle Frage, erscheint erst beim Antippen). Der finale Fragenpool
  aus dem Sheet sollte beides enthalten.

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
