# JIGSAW — Future Season Guide

Version 4 is season-aware.  The site reads the season from `data/predictions.json`, with `data/config.json` as a fallback, rather than hard-coding 2026/27 into the interface.

## New season checklist

1. Replace `data/predictions.json` with the new locked predictions and set its `season` field, e.g. `2027/28`.
2. Set `data/config.json` `currentSeason` to the same season.
3. Update the pre-season starting-order list in the GitHub updater for the new 20-club Premier League line-up.
4. Reset `data/history.json` to an empty snapshot list for the new competition.
5. Run the updater manually and confirm all 20 clubs are present.
6. Refresh the website.  The title, season badge, dashboard, table and race page will use the new season automatically.

The football-data.org API key/secret does not need to change just because the season changes.
