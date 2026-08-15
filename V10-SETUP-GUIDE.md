# JIGSAW Version 10 — Setup & Season Lifecycle

## What V10 adds

- Enhanced leaderboard/dashboard.
- Club-by-club analysis.
- Permanent completed-season history.
- Ultimate all-time aggregate table.
- Season finale once every club has played 38 games.
- Automatic seasonal rollover around 1 August.
- Club crests.
- JIGSAW Intel / banter.
- Existing prediction scoring remains one penalty point per place difference.
- Lowest score wins.

## Season finale

When the live table reaches 38 games played for every club, the dashboard changes to the Season Finale state and locks the current competition visually as complete.  The updater also archives the four players' final scores into `data/season-archive.json`.

## 1 August rollover

The updater checks the calendar.  From 1 August onward it expects the new Premier League season.  When football-data.org begins serving that new season, JIGSAW starts a clean season and resets the live/history presentation to 0 games played.  The previous completed season remains permanently in `season-archive.json`.

## Future season predictions

Before each new season, replace `data/predictions.json` with the new locked predictions and set its `season` field to the new season.  The website and updater will then use that season.  Do not delete `season-archive.json`.

## Ultimate Table

The Ultimate Table sums the final penalty score for every archived season.  Lower aggregate score is better.  Each new completed season is added automatically.

## Important

Keep the API token in GitHub Secrets.  Do not put the token into JavaScript, JSON or any public repository file.
