const APP = {
  players: {},
  standings: [],
  updated: null,
  matchday: 0,
  season: "2026/27"
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

function normalise(name){
  const n = String(name).toLowerCase().replace(/\b(fc|afc)\b/g,"").replace(/\s+/g," ").trim();
  const aliases = {
    "brighton and hove albion":"brighton", "brighton & hove albion":"brighton",
    "coventry city":"coventry", "hull city":"hull", "ipswich town":"ipswich",
    "leeds united":"leeds", "liverpool":"liverpool", "manchester city":"man city",
    "manchester united":"man utd", "newcastle united":"newcastle",
    "nottingham forest":"nott'm forest", "tottenham hotspur":"spurs",
    "west ham united":"west ham", "wolverhampton wanderers":"wolves"
  };
  return aliases[n] || n;
}

function calculate(){
  const actual = new Map(APP.standings.map(s => [normalise(s.team), Number(s.position)]));
  return Object.entries(APP.players).map(([name,preds]) => {
    const rows = preds.map(p => {
      const actualPos = actual.get(normalise(p.team));
      const difference = actualPos == null ? null : Math.abs(Number(p.position) - actualPos);
      return {...p, actual: actualPos ?? "—", difference};
    });
    const score = rows.reduce((sum,r) => sum + (r.difference ?? 0),0);
    return {name, score, rows};
  }).sort((a,b) => a.score-b.score || a.name.localeCompare(b.name));
}

function rankFor(index, list){
  if(index===0) return 1;
  if(list[index].score===list[index-1].score) return rankFor(index-1,list);
  return index+1;
}

function renderOverview(){
  const scores = calculate();
  const cards = scores.map((p,i) => {
    const rank = rankFor(i,scores);
    const medal = rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":"";
    return `<div class="card player-card">
      <div class="rank ${rank<=3?'rank-'+rank:''}">${medal} ${rank}${rank===1?"st":rank===2?"nd":rank===3?"rd":"th"} place</div>
      <div class="player-name">${escapeHtml(p.name)}</div>
      <div class="score">${p.score}</div>
      <div class="score-label">current points</div>
    </div>`;
  }).join("");

  document.querySelector("#overview").innerHTML = `
    <div class="section-head"><div><h2>Live leaderboard</h2><p>Lower is better. Scores use the current Premier League positions.</p></div></div>
    <div class="grid">${cards}</div>
    <div class="top3">
      <div class="section-head"><div><h2>Current Premier League</h2><p>Updated automatically from the league table.</p></div></div>
      ${standingsTable(APP.standings)}
    </div>`;
}

function standingsTable(rows){
  return `<div class="table-wrap"><table>
    <thead><tr><th>Pos</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
    <tbody>${rows.map(s=>`<tr>
      <td class="pos">${s.position}</td><td class="team"><span class="badge">${escapeHtml(shortBadge(s.team))}</span>${escapeHtml(displayTeam(s.team))}</td>
      <td>${s.played ?? 0}</td><td>${s.won ?? 0}</td><td>${s.drawn ?? 0}</td><td>${s.lost ?? 0}</td>
      <td>${s.goalDifference > 0 ? "+" : ""}${s.goalDifference ?? 0}</td><td class="points">${s.points ?? 0}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function renderTable(){
  document.querySelector("#table").innerHTML = `
    <div class="section-head"><div><h2>Premier League table</h2><p>2026/27 · Matchday ${APP.matchday || 0}</p></div></div>
    <div class="notice">The actual table is the source of truth for scoring. Before the first fixture, the Premier League's official reset table is alphabetical with every club on zero points.</div>
    ${standingsTable(APP.standings)}`;
}

function renderPlayers(){
  const scores = calculate();
  const options = scores.map(p=>`<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`).join("");
  document.querySelector("#players").innerHTML = `
    <div class="section-head">
      <div><h2>Predictions</h2><p>See exactly how each prediction is currently scoring.</p></div>
      <select class="player-select" id="playerSelect">${options}</select>
    </div>
    <div id="playerDetail"></div>`;
  document.querySelector("#playerSelect").addEventListener("change", renderPlayerDetail);
  renderPlayerDetail();
}

function renderPlayerDetail(){
  const name = document.querySelector("#playerSelect").value;
  const player = calculate().find(p=>p.name===name);
  document.querySelector("#playerDetail").innerHTML = `
    <div class="card" style="padding:18px;margin-bottom:14px">
      <div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.1em">Current score</div>
      <div style="font-size:42px;font-weight:950;letter-spacing:-.05em">${player.score}</div>
      <div class="muted" style="font-size:12px">points across all 20 clubs</div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Club</th><th>Prediction</th><th>Actual</th><th>Difference</th></tr></thead>
      <tbody>${player.rows.map(r=>{
        const cls = r.difference===0 ? "good" : r.difference>=5 ? "bad" : "";
        return `<tr><td class="team">${escapeHtml(displayTeam(r.team))}</td><td>${r.position}</td><td>${r.actual}</td><td class="${cls}">${r.difference ?? "—"}</td></tr>`;
      }).join("")}</tbody>
    </table></div>`;
}

function displayTeam(name){
  const map = {
    "Arsenal":"Arsenal","Aston Villa":"Aston Villa","Bournemouth":"Bournemouth","Brentford":"Brentford",
    "Brighton":"Brighton","Chelsea":"Chelsea","Coventry":"Coventry City","Crystal Palace":"Crystal Palace",
    "Everton":"Everton","Fulham":"Fulham","Hull":"Hull City","Ipswich":"Ipswich Town","Leeds":"Leeds United",
    "Liverpool":"Liverpool","Man City":"Manchester City","Man Utd":"Manchester United","Newcastle":"Newcastle United",
    "Nott'm Forest":"Nottingham Forest","Sunderland":"Sunderland","Spurs":"Tottenham Hotspur"
  };
  return map[name] || name;
}
function shortBadge(name){
  const n=displayTeam(name).replace(/[^A-Za-z ]/g,"").split(" ").filter(Boolean);
  return n.length===1?n[0].slice(0,3).toUpperCase():n.map(x=>x[0]).join("").slice(0,3).toUpperCase();
}

async function load(){
  const [pred,stand] = await Promise.all([
    fetch("data/predictions.json").then(r=>r.json()),
    fetch("data/standings.json").then(r=>r.json())
  ]);
  APP.players=pred.players; APP.season=pred.season;
  APP.standings=stand.standings; APP.updated=stand.lastUpdated; APP.matchday=stand.currentMatchday || 0;
  document.querySelector("#updatedText").textContent = APP.updated ? `Updated ${new Date(APP.updated).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"})}` : "Waiting for update";
  renderOverview(); renderTable(); renderPlayers();
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  btn.classList.add("active"); document.querySelector("#"+btn.dataset.view).classList.add("active");
}));
load().catch(err=>{
  console.error(err);
  document.querySelector("#overview").innerHTML=`<div class="notice">The site could not load its data files. Please check that the repository contains the complete JIGSAW project.</div>`;
});
