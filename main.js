const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const THEMES=['neon','arcade','forest','ice'];
function setTheme(t){document.documentElement.dataset.theme=t;store.set('theme',t);if($('#sTheme'))$('#sTheme').textContent=t;$$('.themes button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));initParticles()}
$$('.themes button').forEach(b=>b.onclick=e=>{e.stopPropagation();setTheme(b.dataset.t)});
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='t'&&$('#modal').hidden){setTheme(THEMES[(THEMES.indexOf(document.documentElement.dataset.theme)+1)%4])}});
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
const LABEL={snake:'Snake',memory:'Memory Match',reaction:'Reaction Test (avg)',ttt:'Tic-Tac-Toe',g2048:'2048',flappy:'Sky Hop',mole:'Whack-a-Mole'};
function finish(g,score,title,lines=[]){const all=store.get('scores',{}),prev=all[g],u=g==='reaction'?' ms':'';
 const isBest=prev==null||(g==='reaction'?score<prev:score>prev);saveScore(g,score);
 const st=store.get('plays',{});st[g]=(st[g]||0)+1;store.set('plays',st);renderScores();
 const d=document.createElement('div');d.className='result';
 d.innerHTML=`<h3>${title}</h3><div class="big">${score}${u}</div><p class="${isBest?'nb':''}">${isBest?'New personal best!':'Your best: '+prev+u}</p>${lines.map(l=>`<p>${l}</p>`).join('')}<div class="acts"><button class="btn sm" id="again">Play again</button><button class="btn sm" id="quit">Back to games</button></div>`;
 $('#stage').append(d);$('#again').onclick=()=>{closeGame();openGame(g)};$('#quit').onclick=closeGame;$('#again').focus()}
function saveScore(g,s){const all=store.get('scores',{});const best=all[g];const better=g==='reaction'?(best==null||s<best):(best==null||s>best);if(better){all[g]=s;store.set('scores',all);toast('New best: '+s+(g==='reaction'?' ms':''));renderScores()}}
function renderScores(){const all=store.get('scores',{});const pl=store.get('plays',{});$('#sPlays').textContent=Object.values(pl).reduce((a,b)=>a+b,0);$('#sBest').textContent=Object.keys(all).length+' / 7';$('#sTheme').textContent=document.documentElement.dataset.theme;
 $$('.best').forEach(el=>{const v=all[el.dataset.best];el.textContent=v==null?'No score yet':'Best: '+v+(el.dataset.best==='reaction'?' ms':'')});
 const rows=Object.keys(LABEL).filter(g=>all[g]!=null).map(g=>`<div class="row"><span>${LABEL[g]}</span><b>${all[g]}${g==='reaction'?' ms':''}</b></div>`);
 $('#board').innerHTML=rows.join('')||'<p class="empty">Play a game to post your first score.</p>'}
const cv=$('#bg'),cx=cv.getContext('2d');let P=[],mouse={x:-999,y:-999},raf;
function initParticles(){cancelAnimationFrame(raf);cv.width=innerWidth;cv.height=innerHeight;
 const col=getComputedStyle(document.documentElement).getPropertyValue('--a').trim();
 P=Array.from({length:Math.min(90,innerWidth/14|0)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2+1}));
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 (function loop(){cx.clearRect(0,0,cv.width,cv.height);cx.fillStyle=cx.strokeStyle=col;
  for(const p of P){const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d<120&&d>0){p.x+=dx/d*2;p.y+=dy/d*2}
   p.x=(p.x+p.vx+cv.width)%cv.width;p.y=(p.y+p.vy+cv.height)%cv.height;cx.globalAlpha=.7;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<110){cx.globalAlpha=(1-d/110)*.3;cx.beginPath();cx.moveTo(P[i].x,P[i].y);cx.lineTo(P[j].x,P[j].y);cx.stroke()}}
  raf=requestAnimationFrame(loop)})()}
addEventListener('resize',initParticles);
addEventListener('mousemove',e=>{mouse={x:e.clientX,y:e.clientY};const g=$('#glow');g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
$$('.tilt').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateY(-4px)`});c.addEventListener('mouseleave',()=>c.style.transform='')});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.15});
$$('section:not(.hero) h2,.card,.board,.narrow').forEach(el=>{el.classList.add('reveal');io.observe(el)});
let stopGame=()=>{};
function openGame(g){$('#mTitle').textContent=LABEL[g];setScore(0);$('#modal').hidden=false;$('#stage').innerHTML='';stopGame=GAMES[g]($('#stage'))||(()=>{})}
function closeGame(){stopGame();stopGame=()=>{};$('#modal').hidden=true}
function setScore(s){$('#mScore').textContent='Score: '+s}
$$('.card').forEach(c=>c.onclick=()=>openGame(c.dataset.game));
$('#mClose').onclick=closeGame;addEventListener('keydown',e=>{if(e.key==='Escape')closeGame()});
setTheme(store.get('theme','neon'));renderScores();
