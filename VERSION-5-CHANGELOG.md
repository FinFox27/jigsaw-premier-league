# JIGSAW Version 5

## Prediction result colours
- Gold + bold = actual position exactly matches the prediction.
- Green + bold = actual position is higher than predicted (fewer penalty points than predicted).
- Red + bold = actual position is lower than predicted (more penalty points than predicted).

## Updater fix
The pre-season order is now explicitly stored in `data/config.json` and the workflow is made defensive against a missing `preSeasonOrder` key.  This fixes the reported KeyError.

## Future seasons
When the next season starts, update the `season` and `preSeasonOrder` in `data/config.json` for the new 20-club line-up.  The scoring and website remain season-aware.
