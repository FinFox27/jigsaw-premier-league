# The JIGSAW Premier League Prediction Challenge

A free, mobile-friendly website for the 2026/27 prediction competition.

## What is included

- Four locked prediction sets taken from the supplied Excel workbook: Gary, Jimmy, Willie and Steve.
- Live/provisional scoring using the current Premier League position.
- Premier League table.
- Individual prediction breakdown.
- Automatic table-update workflow for GitHub Actions.
- Designed for free GitHub Pages hosting.

## Scoring rule

For each club:

`points = ABS(actual_position - predicted_position)`

A player's score is the sum across all 20 clubs.

Lower score is better.

## Current starting point

The Premier League officially reset the 2026/27 table before the season. With no fixtures played, the table is alphabetical and all clubs have 0 points. The supplied Excel workbook uses this same starting order.

## Setup

See `SETUP-GUIDE.md`.

## Data

`data/predictions.json` contains the locked predictions.

`data/standings.json` contains the current actual table used by the website.

Once the GitHub Action is configured, `data/standings.json` is refreshed automatically from football-data.org.

## Important

Do not put your football-data.org API token into `script.js` or any public file. It belongs in GitHub repository Secrets as `FOOTBALL_DATA_TOKEN`.
