# The JIGSAW Premier League Prediction Challenge

A free, mobile-friendly website for the 2026/27 competition.

## Scoring

For each of the 20 clubs:

`penalty points = absolute(actual position - predicted position)`

A player's total is the sum of all 20 club penalties. Lower is better.

## Data integrity

- The four prediction sets are imported from the supplied Excel workbook.
- Predictions are locked in the website data.
- The 2026/27 pre-season table uses the official Premier League alphabetical reset order.
- Once clubs have played competitive matches, the automatic updater uses football-data.org's current standings.
- The updater validates that exactly 20 expected clubs are returned before replacing the table.
- If the table has not changed, no unnecessary history snapshot is created.
- Up to 120 distinct table snapshots are retained.

## GitHub Pages

Publish the repository from the `main` branch and root (`/(root)`).

## Secret

Create a repository Actions secret named:

`FOOTBALL_DATA_TOKEN`

Never place the token in public files.

## Automatic updater

The workflow runs every three hours and can also be run manually from GitHub Actions.

## Files

- `index.html` — site structure
- `style.css` — design
- `script.js` — scoring and display logic
- `data/predictions.json` — locked predictions
- `data/standings.json` — current table
- `data/history.json` — previous distinct table states
- `data/config.json` — season and canonical club order
- `.github/workflows/update-table.yml` — automatic updater
