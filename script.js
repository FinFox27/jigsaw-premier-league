const APP = {players:{},standings:[],history:[],season:"2026/27",preSeason:false,updated:null,matchday:0};

const CLUBS = {
  "Arsenal":"Arsenal","Aston Villa":"Aston Villa","Bournemouth":"Bournemouth","Brentford":"Brentford",
  "Brighton":"Brighton","Chelsea":"Chelsea","Coventry":"Coventry City","Crystal Palace":"Crystal Palace",
  "Everton":"Everton","Fulham":"Fulham","Hull":"Hull City","Ipswich":"Ipswich Town","Leeds":"Leeds United",
  "Liverpool":"Liverpool","Man City":"Manchester City","Man Utd":"Manchester United","Newcastle":"Newcastle United",
  "Nott'm Forest":"Nottingham Forest","Sunderland":"Sunderland","Spurs":"Tottenham Hotspur"
};
const ALIASES = {
  "arsenal fc":"Arsenal","arsenal":"Arsenal","aston villa fc":"Aston Villa","aston villa":"Aston Villa",
  "afc bournemouth":"Bournemouth","bournemouth":"Bournemouth","bournemouth fc":"Bournemouth",
  "brentford fc":"Brentford","brentford":"Brentford","brighton & hove albion":"Brighton","brighton and hove albion":"Brighton",
  "brighton":"Brighton","brighton & hove albion fc":"Brighton","chelsea fc":"Chelsea","chelsea":"Chelsea",
  "coventry city fc":"Coventry","coventry city":"Coventry","coventry":"Coventry",
  "crystal palace fc":"Crystal Palace","crystal palace":"Crystal Palace","everton fc":"Everton","everton":"Everton",
  "fulham fc":"Fulham","fulham":"Fulham","hull city afc":"Hull","hull city":"Hull","hull":"Hull",
  "ipswich town fc":"Ipswich","ipswich town":"Ipswich","ipswich":"Ipswich","leeds united fc":"Leeds","leeds united":"Leeds","leeds":"Leeds",
  "liverpool fc":"Liverpool","liverpool":"Liverpool","manchester city fc":"Man City","manchester city":"Man City","man city":"Man City",
  "manchester united fc":"Man Utd","manchester united":"Man Utd","man utd":"Man Utd",
  "newcastle united fc":"Newcastle","newcastle united":"Newcastle","newcastle":"Newcastle",
  "nottingham forest fc":"Nott'm Forest","nottingham forest":"Nott'm Forest","nott'm forest":"Nott'm Forest",
  "sunderland afc":"Sunderland","sunderland":"Sunderland","tottenham hotspur fc":"Spurs","tottenham hotspur":"Spurs","tottenham":"Spurs","spurs":"Spurs"
};

function norm(name){
  let s=String(name).toLowerCase().replace(/\s+/g," ").trim();
  return ALIASES[s] || s;
}
function clubName(name){ return CLUBS[norm(name)] || CLUBS[name] || name; }
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function badge(name){
  const words=clubName(name).replace(/[^A-Za-z ]/g,"").split(" ").filter(Boolean);
  return (words.length===1?words[0].slice(0,3):words.map(w=>w[0]).join("")).slice(0,3).toUpperCase();
}
function scoresFor(standings){
  const actual=new Map(standings.map(s=>[norm(s.team),Number(s.position)]));
  return Object.entries(APP.players).map(([name,preds])=>{
    const rows=preds.map(p=>({team:p.team,predicted:Number(p.position),actual:actual.get(norm(p.team)) ?? null,difference:actual.has(norm(p.team))?Math.abs(Number(p.position)-actual.get(norm(p.team))):null}));
    return {name,rows,score:rows.reduce((a,r)=>a+(r.difference??0),0)};
  }).sort((a,b)=>a.score-b.score||a.name.localeCompare(b.name));
}
function rankList(scores){
  let lastScore=null,lastRank=0;
  return scores.map((p,i)=>{if(p.score!==lastScore){lastRank=i+1;lastScore=p.score}return {...p,rank:lastRank};});
}
function fingerprint(rows){return rows.map(s=>`${s.position}:${norm(s.team)}:${s.points}:${s.goalDifference}:${s.played}`).join("|");}
function previousScores(){
  if(!APP.history.length) return null;
  const prior=APP.history[APP.history.length-1];
  return scoresFor(prior.standings);
}
function movement(name,current,prior){
  if(!prior) return null;
  const a=rankList(current).find(x=>x.name===name)?.rank;
  const b=rankList(prior).find(x=>x.name===name)?.rank;
  return a==null||b==null?null:b-a;
}
function medal(rank){return rank===1?"🥇":rank===2?"🥈":rank===3?"🥉":"";}

function renderLeaderboard(){
  const current=rankList(scoresFor(APP.standings));
  const prior=previousScores();
  const cards=current.map(p=>{
    const m=movement(p.name,current,prior);
    let move=m===null?`No previous update`:(m>0?`↑ ${m} place${m===1?"":"s"}`:m<0?`↓ ${Math.abs(m)} place${Math.abs(m)===1?"":"s"}`:"— No movement");
    const cls=m===null?"flat":m>0?"up":m<0?"down":"flat";
    return `<div class="card player-card">
      <div class="rankline"><span>${medal(p.rank)} ${p.rank}${p.rank===1?"st":p.rank===2?"nd":p.rank===3?"rd":"th"}</span><span>${p.score} pts</span></div>
      <div class="player-name">${esc(p.name)}</div>
      <div class="score">${p.score}</div><div class="score-label">current penalty points</div>
      <div class="movement ${cls}">${move}</div>
    </div>`;
  }).join("");
  const best=current[0], worst=current[current.length-1];
  document.querySelector("#leaderboard").innerHTML=`
    <div class="section-head"><div><h2>Live leaderboard</h2><p>Lower score is better. Every place you miss costs one point.</p></div><span class="lock">🔒 Predictions locked</span></div>
    <div class="grid">${cards}</div>
    <div class="hero-stat">
      <div class="card stat-card"><div class="stat-value">${esc(best.name)}</div><div class="stat-label">Current leader · ${best.score} points</div></div>
      <div class="card stat-card"><div class="stat-value">${esc(worst.name)}</div><div class="stat-label">Current fourth · ${worst.score} points</div></div>
    </div>
    <div class="callout"><strong>How JIGSAW works</strong><p>For every club, the score is the absolute difference between the predicted finishing position and the current actual position. The 20 club differences are added together.</p></div>`;
}

function tableHtml(rows){
  return `<div class="table-wrap"><table><thead><tr><th>Pos</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>
  ${rows.map(s=>`<tr><td class="pos">${s.position}</td><td class="club"><span class="club-mark">${esc(badge(s.team))}</span>${esc(clubName(s.team))}</td><td>${s.played??0}</td><td>${s.won??0}</td><td>${s.drawn??0}</td><td>${s.lost??0}</td><td>${(s.goalDifference??0)>0?"+":""}${s.goalDifference??0}</td><td class="points">${s.points??0}</td></tr>`).join("")}
  </tbody></table></div>`;
}
function renderTable(){
  document.querySelector("#table").innerHTML=`
    <div class="section-head"><div><h2>Premier League table</h2><p>2026/27 · Matchday ${APP.matchday||0}</p></div></div>
    ${APP.preSeason?`<div class="notice">The season has not started. JIGSAW is using the official Premier League alphabetical reset order for 2026/27 rather than relying on a third-party provider's pre-season ordering.</div>`:""}
    ${tableHtml(APP.standings)}`;
}

function renderPredictions(){
  const list=rankList(scoresFor(APP.standings));
  document.querySelector("#predictions").innerHTML=`
    <div class="section-head"><div><h2>Predictions</h2><p>See exactly where each prediction is currently winning or losing points.</p></div>
    <select class="player-select" id="playerSelect">${list.map(p=>`<option value="${esc(p.name)}">${esc(p.name)}</option>`).join("")}</select></div>
    <div id="playerDetail"></div>`;
  document.querySelector("#playerSelect").addEventListener("change",renderPlayerDetail);
  renderPlayerDetail();
}
function renderPlayerDetail(){
  const name=document.querySelector("#playerSelect").value;
  const p=rankList(scoresFor(APP.standings)).find(x=>x.name===name);
  document.querySelector("#playerDetail").innerHTML=`
    <div class="card detail-card"><div><div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:.1em">Current score</div><div class="detail-score">${p.score}</div><div class="detail-meta">penalty points · ${p.rank}${p.rank===1?"st":p.rank===2?"nd":p.rank===3?"rd":"th"} place</div></div><span class="lock">🔒 Prediction locked</span></div>
    <div class="table-wrap"><table><thead><tr><th>Club</th><th>Prediction</th><th>Actual</th><th>Difference</th></tr></thead><tbody>
    ${p.rows.map(r=>{const cls=r.difference===0?"good":r.difference>=5?"bad":"zero";return `<tr><td class="club">${esc(clubName(r.team))}</td><td>${r.predicted}</td><td>${r.actual??"—"}</td><td class="${cls}">${r.difference??"—"}</td></tr>`}).join("")}
    </tbody></table></div>`;
}

async function load(){
  const [pred,stand,history]=await Promise.all([
    fetch("data/predictions.json",{cache:"no-store"}).then(r=>r.json()),
    fetch("data/standings.json",{cache:"no-store"}).then(r=>r.json()),
    fetch("data/history.json",{cache:"no-store"}).then(r=>r.json())
  ]);
  APP.players=pred.players; APP.season=pred.season; APP.standings=stand.standings; APP.history=history.snapshots||[];
  APP.updated=stand.lastUpdated; APP.matchday=stand.currentMatchday||0; APP.preSeason=!!stand.preSeason;
  document.querySelector("#updatedText").textContent=APP.updated?`Updated ${new Date(APP.updated).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"})}`:"Waiting for update";
  document.querySelector("#statusText").textContent=APP.preSeason?"Pre-season table":"Live league table";
  renderLeaderboard();renderTable();renderPredictions();
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  btn.classList.add("active");document.querySelector("#"+btn.dataset.view).classList.add("active");
}));
load().catch(err=>{console.error(err);document.querySelector("#leaderboard").innerHTML=`<div class="notice">The site could not load its data files. Please check the repository structure.</div>`});
