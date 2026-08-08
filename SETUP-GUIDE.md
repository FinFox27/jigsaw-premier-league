# JIGSAW setup guide

This guide is deliberately written for someone who does not need to know how to code.

## Part 1 — Create a GitHub account

1. Go to GitHub and create a free account if you do not already have one.
2. Verify your email address.
3. Sign in.

## Part 2 — Create the website repository

1. On GitHub, choose **New repository**.
2. Repository name: `jigsaw-premier-league`
3. Set it to **Public**.
4. Create the repository.

## Part 3 — Upload this project

Upload the contents of this project into the new repository, preserving the folder structure.

You should see:

- `index.html`
- `style.css`
- `script.js`
- `README.md`
- `SETUP-GUIDE.md`
- `data/predictions.json`
- `data/standings.json`
- `.github/workflows/update-table.yml`

## Part 4 — Turn on GitHub Pages

1. Open the repository.
2. Go to **Settings**.
3. Choose **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`.
6. Save.

GitHub will give you a public website address. It will normally look similar to:

`https://YOUR-GITHUB-USERNAME.github.io/jigsaw-premier-league/`

## Part 5 — Get the free football-data.org API token

1. Create a free account at football-data.org.
2. Obtain your API token.
3. Do NOT put the token in the website files.

## Part 6 — Add the token as a GitHub Secret

1. Open your GitHub repository.
2. Go to **Settings → Secrets and variables → Actions**.
3. Choose **New repository secret**.
4. Name it exactly:

`FOOTBALL_DATA_TOKEN`

5. Paste the API token into the secret value.
6. Save it.

## Part 7 — Test the automatic updater

1. Go to the repository's **Actions** tab.
2. Choose **Update Premier League table**.
3. Choose **Run workflow**.
4. Wait for it to finish.
5. The workflow should update `data/standings.json`.
6. GitHub Pages should then redeploy the site.

The workflow is scheduled to run every three hours. This is deliberately conservative because the free football-data.org plan is rate limited.

## Part 8 — Share the site

Once the Pages deployment is complete, send the GitHub Pages address to the four players.

They do not need GitHub, Excel, Microsoft 365 or an account.

## Important note about the current pre-season table

The official Premier League has reset the 2026/27 table alphabetically with every club on zero points. The supplied Excel workbook matches that starting order.

Once competitive matches begin, the football-data.org workflow will replace the starting table with the actual live standings.

## Future changes

If you want to change a prediction before the competition is locked, edit `data/predictions.json`.

If you want to change the website wording/design, edit `index.html` and `style.css`.

I recommend keeping the predictions locked once the season starts.
