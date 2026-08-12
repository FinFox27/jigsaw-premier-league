# JIGSAW — Future Season Guide

Version 7 is season-aware. The site reads the season from `data/predictions.json`, with `data/config.json` as a fallback.

## New season checklist

1. Replace `data/predictions.json` with the new locked predictions and set its `season` field, e.g. `2027/28`.
2. Set `data/config.json` `currentSeason` to the same season.
3. Replace `preSeasonOrder` with the new 20-club Premier League line-up in the order you want JIGSAW to use before the first competitive match.
4. The updater will derive the football-data.org season code from the first year in `currentSeason`.
5. When the season changes, the updater automatically starts a fresh `history.json` for the new competition.
6. Run the updater manually and confirm all 20 clubs are present and the crest images load.
7. Refresh the website. The title, season badge, dashboard, table, race and JIGSAW Intel will use the new season automatically.

The football-data.org token does not need to change merely because the season changes.
