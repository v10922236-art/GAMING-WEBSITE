const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const mk=(t,c,p)=>{const e=document.createElement(t);if(c)e.className=c;if(p)p.append(e);return e};
const swipe=(el,fn)=>{let t0;el.addEventListener('touchstart',e=>t0=e.touches[0],{passive:true});el.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-t0.clientX,dy=t.clientY-t0.clientY;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;fn(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))})};
const GAMES={
snake(stage){
 const c=mk('canvas','snake',stage);c.width=c.height=400;const x=c.getContext('2d'),N=20,S=20;
 let sn=[{x:10,y:10},{x:9,y:10}],dir={x:1,y:0},nd=dir,food,score=0,timer;
 const place=()=>{do food={x:Math.random()*N|0,y:Math.random()*N|0};while(sn.some(s=>s.x===food.x&&s.y===food.y))};
 function tick(){dir=nd;const h={x:(sn[0].x+dir.x+N)%N,y:(sn[0].y+dir.y+N)%N};
  if(sn.some(s=>s.x===h.x&&s.y===h.y)){clearInterval(timer);finish('snake',score,'Game over',['Final length: '+sn.length]);return}
  sn.unshift(h);if(h.x===food.x&&h.y===food.y){score++;setScore(score);place()}else sn.pop();draw()}
 function draw(){x.fillStyle=css('--bg');x.fillRect(0,0,400,400);x.shadowBlur=14;x.shadowColor=x.fillStyle=css('--b');x.fillRect(food.x*S+3,food.y*S+3,S-6,S-6);
  x.shadowColor=x.fillStyle=css('--a');sn.forEach((s,i)=>{x.globalAlpha=Math.max(.3,1-i/(sn.length+8));x.fillRect(s.x*S+1,s.y*S+1,S-2,S-2)});x.globalAlpha=1;x.shadowBlur=0}
 const turn=(a,b)=>{if(a!==-dir.x&&b!==-dir.y)nd={x:a,y:b}};
 const M={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
 const key=e=>{const m=M[e.key];if(m){e.preventDefault();turn(...m)}};
 swipe(c,d=>turn(...{L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]}[d]));
 addEventListener('keydown',key);place();draw();timer=setInterval(tick,110);
 return()=>{clearInterval(timer);removeEventListener('keydown',key)}
},
memory(stage){
 const ic=[...'🚀👾🎮🧩🔥⚡🎯🏆'],deck=[...ic,...ic].sort(()=>Math.random()-.5);
 const g=mk('div','mem',stage);let first=null,lock=false,moves=0,pairs=0,t0=0;const pts=()=>Math.max(0,1000-moves*40);
 deck.forEach(v=>{const b=mk('button','',g);b.setAttribute('aria-label','Card');b.onclick=()=>{
  if(lock||b===first||b.classList.contains('done'))return;if(!t0)t0=Date.now();b.textContent=v;b.classList.add('up');
  if(!first){first=b;return}moves++;
  if(first.textContent===v){first.className=b.className='done';first=null;pairs++;setScore(pts());
   if(pairs===8)setTimeout(()=>finish('memory',pts(),'All pairs found!',['Moves: '+moves,'Time: '+Math.round((Date.now()-t0)/1000)+' s']),500)}
  else{lock=true;const f=first;first=null;setScore(pts());setTimeout(()=>{f.className=b.className='';f.textContent=b.textContent='';lock=false},700)}}});
},
reaction(stage){
 const info=mk('p','info',stage),b=mk('button','react',stage);let st,t,state='idle',times=[];stage.style.alignContent='center';
 const msg=m=>{state='idle';b.className='react';b.textContent=m;info.textContent=`Round ${times.length+1} of 5`+(times.length?` · last: ${times[times.length-1]} ms`:'')};msg('Click to start');
 b.onclick=()=>{if(state==='idle'){state='wait';b.className='react wait';b.textContent='Wait for green…';t=setTimeout(()=>{state='go';b.className='react go';b.textContent='CLICK!';st=performance.now()},1000+Math.random()*2500)}
  else if(state==='wait'){clearTimeout(t);msg('Too soon! Click to retry this round')}
  else{times.push(Math.round(performance.now()-st));if(times.length===5){const avg=Math.round(times.reduce((a,b)=>a+b)/5);setScore(avg+' ms');finish('reaction',avg,'Average reaction',['Rounds: '+times.join(', ')+' ms','Fastest: '+Math.min(...times)+' ms'])}else msg('Click for next round')}};
 return()=>clearTimeout(t);
},
ttt(stage){
 const info=mk('p','info',stage),g=mk('div','mem ttt',stage);let bd,pts=0,rnd=0,over=false,tm;
 const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 const win=b=>{for(const[l,m,n]of L)if(b[l]&&b[l]===b[m]&&b[l]===b[n])return b[l];return b.includes('')?null:'D'};
 const mm=(b,p)=>{const w=win(b);if(w)return w==='O'?1:w==='X'?-1:0;let best=p==='O'?-2:2;b.forEach((v,i)=>{if(!v){b[i]=p;const s=mm(b,p==='O'?'X':'O');b[i]='';best=p==='O'?Math.max(best,s):Math.min(best,s)}});return best};
 const ai=()=>{const e=bd.map((v,i)=>v?-1:i).filter(i=>i>=0);if(Math.random()<.25)return e[Math.random()*e.length|0];let bi=e[0],bs=-2;for(const i of e){bd[i]='O';const s=mm(bd,'X');bd[i]='';if(s>bs){bs=s;bi=i}}return bi};
 const cells=[...Array(9)].map((_,i)=>{const b=mk('button','',g);b.setAttribute('aria-label','Cell '+(i+1));b.onclick=()=>{if(over||bd[i])return;bd[i]='X';after()};return b});
 function show(){cells.forEach((b,i)=>b.textContent=bd[i])}
 function after(){show();let w=win(bd);if(!w){bd[ai()]='O';show();w=win(bd)}
  if(w){over=true;const r=w==='X'?['You win this round! +3',3]:w==='O'?['Computer wins this round. +0',0]:['Draw. +1',1];pts+=r[1];setScore(pts);
   if(rnd===5)tm=setTimeout(()=>finish('ttt',pts,'Series complete',['Points from 5 rounds, max 15']),900);else{info.textContent=r[0];tm=setTimeout(start,1200)}}}
 function start(){bd=Array(9).fill('');over=false;rnd++;info.textContent=`Round ${rnd} of 5 · you are X`;show()}
 start();return()=>clearTimeout(tm);
},
g2048(stage){
 const g=mk('div','g2048',stage);let b=Array(16).fill(0),score=0,done=false;
 const add=()=>{const e=b.map((v,i)=>v?-1:i).filter(i=>i>=0);b[e[Math.random()*e.length|0]]=Math.random()<.9?2:4};
 const slide=r=>{const a=r.filter(v=>v);let s=0;for(let i=0;i<a.length-1;i++)if(a[i]===a[i+1]){a[i]*=2;s+=a[i];a.splice(i+1,1)}while(a.length<4)a.push(0);return[a,s]};
 const tiles=[...Array(16)].map(()=>mk('div','tile',g));
 function render(){tiles.forEach((t,i)=>{const v=b[i];t.textContent=v||'';t.style.background=v?`hsl(${(Math.log2(v)*38+170)%360} 80% ${Math.max(45,80-Math.log2(v)*4)}%)`:'';t.style.fontSize=v>=1024?'1.1rem':v>=128?'1.3rem':''});setScore(score)}
 function can(){return b.includes(0)||b.some((v,i)=>(i%4<3&&v===b[i+1])||(i<12&&v===b[i+4]))}
 function move(d){if(done)return;let moved=false;
  for(let i=0;i<4;i++){let l=[0,1,2,3].map(j=>d==='L'||d==='R'?b[i*4+j]:b[j*4+i]);if(d==='R'||d==='D')l.reverse();let[n,s]=slide(l);score+=s;if(d==='R'||d==='D')n.reverse();
   n.forEach((v,j)=>{const k=d==='L'||d==='R'?i*4+j:j*4+i;if(b[k]!==v){moved=true;b[k]=v}})}
  if(!moved)return;add();render();const top=Math.max(...b);
  if(top>=2048||!can()){done=true;setTimeout(()=>finish('g2048',score,top>=2048?'You reached 2048!':'No moves left',['Highest tile: '+top]),400)}}
 const K={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D',a:'L',d:'R',w:'U',s:'D'};
 const key=e=>{if(K[e.key]){e.preventDefault();move(K[e.key])}};
 addEventListener('keydown',key);swipe(g,move);add();add();render();return()=>removeEventListener('keydown',key);
},
flappy(stage){
 const c=mk('canvas','fl',stage);c.width=320;c.height=480;const x=c.getContext('2d');
 let y=240,vy=0,pipes=[],f=0,score=0,started=false,dead=false,raf;const GAP=135,BX=80;
 function flap(e){if(e&&e.preventDefault)e.preventDefault();if(dead)return;started=true;vy=-6.6}
 const key=e=>{if(e.code==='Space'||e.key==='ArrowUp')flap(e)};addEventListener('keydown',key);c.addEventListener('pointerdown',flap);
 function step(){if(started){vy+=.4;y+=vy;f++;if(f%95===1)pipes.push({x:320,top:60+Math.random()*250,pass:false});
  pipes.forEach(p=>p.x-=2.3);pipes=pipes.filter(p=>p.x>-60);
  for(const p of pipes){if(!p.pass&&p.x+50<BX){p.pass=true;score++;setScore(score)}
   if(BX+12>p.x&&BX-12<p.x+50&&(y-12<p.top||y+12>p.top+GAP))die()}
  if(y>468||y<12)die()}}
 function die(){if(dead)return;dead=true;setTimeout(()=>finish('flappy',score,'Crashed!',['Pipes passed: '+score]),350)}
 function draw(){x.fillStyle=css('--bg');x.fillRect(0,0,320,480);x.fillStyle=css('--b');pipes.forEach(p=>{x.fillRect(p.x,0,50,p.top);x.fillRect(p.x,p.top+GAP,50,480-p.top-GAP)});
  x.shadowBlur=16;x.shadowColor=x.fillStyle=css('--a');x.beginPath();x.arc(BX,y,12,0,7);x.fill();x.shadowBlur=0;
  if(!started){x.fillStyle=css('--text');x.font='700 20px sans-serif';x.textAlign='center';x.fillText('Tap or press Space to start',160,300)}}
 (function loop(){step();draw();if(!dead||pipes.length||1)raf=requestAnimationFrame(loop)})();
 return()=>{cancelAnimationFrame(raf);removeEventListener('keydown',key)};
},
mole(stage){
 const info=mk('p','info',stage),g=mk('div','mem moles',stage);let hits=0,miss=0,left=30,cur=-1,mt,ct,ended=false;
 const cells=[...Array(9)].map((_,i)=>{const b=mk('button','',g);b.setAttribute('aria-label','Hole '+(i+1));b.onclick=()=>{if(ended)return;if(i===cur){hits++;cells[i].classList.remove('up');cells[i].textContent='';cur=-1}else miss++;upd()};return b});
 const upd=()=>{setScore(hits);info.textContent=`Time left: ${left}s · Misses: ${miss}`};
 function pop(){if(ended)return;if(cur>=0){cells[cur].classList.remove('up');cells[cur].textContent=''}let n;do n=Math.random()*9|0;while(n===cur);cur=n;cells[n].classList.add('up');cells[n].textContent='🐹';mt=setTimeout(pop,Math.max(450,850-hits*12))}
 ct=setInterval(()=>{left--;upd();if(left<=0){ended=true;clearInterval(ct);clearTimeout(mt);const tot=hits+miss;finish('mole',hits,"Time's up!",['Hits: '+hits+' · Misses: '+miss,'Accuracy: '+(tot?Math.round(hits/tot*100):0)+'%'])}},1000);
 upd();pop();return()=>{ended=true;clearInterval(ct);clearTimeout(mt)};
}};
