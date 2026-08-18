# JIGSAW Version 11 — fixes

- Pre-season position 1 for every club is retained as a valid zero-points starting state. Once matches are played, the live API positions are used.
- Spurs/Tottenham/Tottenham Hotspur and Brighton/Brighton & Hove Albion/Brighton and Hove Albion are now canonicalised consistently, fixing missing actual positions in Predictions and Club Analysis.
- GitHub Actions upgraded from checkout v4 to v6 and upload-artifact v4 to v5 to remove the Node.js 20 deprecation warning.
