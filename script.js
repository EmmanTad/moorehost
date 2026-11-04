// ---- Tiles / filter
const T=[["Wedding","Reception Hosting","#3a2f14","#14100a",1],["Birthday","Anita’s 70th Birthday","#4a0f12","#140506"],["Debut","Joyce at 18","#3b1a4d","#0f0714"],["Birthday","7th Birthday Party","#4d1a3b","#140710"],["Corporate","Christmas Party","#1a2a4d","#070b14"],["Wedding","Ballroom Wedding","#2d2d1a","#0e0e07"],["Debut","Blue Debut","#14284d","#060a14"],["Corporate","Annual Gala","#4d1a1a","#140707"]];
const PHOTO="images/jamie-moore.jpg";
const tiles=document.getElementById('tiles');
tiles.innerHTML=T.map(t=>`<div class="tile" data-c="${t[0]}" style="--a:${t[2]};--b:${t[3]}${t[4]?`;background:linear-gradient(transparent 40%,#000c),url(${PHOTO}) center/cover`:''}"><div><small>${t[0]}</small>${t[1]}</div></div>`).join('');
document.getElementById('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  document.querySelectorAll('#tabs button').forEach(x=>x.classList.toggle('on',x===b));
  tiles.querySelectorAll('.tile').forEach(t=>t.classList.toggle('h',b.dataset.f!=='all'&&t.dataset.c!==b.dataset.f))});
document.getElementById('form').addEventListener('submit',e=>{e.preventDefault();document.getElementById('thanks').style.display='block'});

// ---- Night valley
const cv=document.getElementById('valley'),cx=cv.getContext('2d');
let W,H,DPR=Math.min(devicePixelRatio||1,2);
const hues=[330,45,280,190,10,310];
const sprites=hues.map(h=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,`hsla(${h},90%,92%,1)`);r.addColorStop(.18,`hsla(${h},90%,70%,.85)`);r.addColorStop(.5,`hsla(${h},85%,50%,.25)`);r.addColorStop(1,`hsla(${h},85%,40%,0)`);
  g.fillStyle=r;g.fillRect(0,0,64,64);return c});
const Z=1400,N=innerWidth<700?900:1700;
const P=Array.from({length:N},()=>{const leaf=Math.random()<.28;return{x:(Math.random()*2-1)*1.9,y:.05+Math.pow(Math.random(),.7)*1.1,z:Math.random()*Z,s:.5+Math.random()*1.2,h:(Math.random()*6)|0,leaf,ph:Math.random()*6.28,dx:Math.random()*2-1,dy:Math.random()*2-1}});
let cam=0,vel=0,idle=.6,mx=-999,my=-999,disp=0,dispT=0,lastS=scrollY,smoothS=0;
function size(){W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',size);size();
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
addEventListener('pointerleave',()=>{mx=my=-999});
addEventListener('scroll',()=>{vel+=(scrollY-lastS)*.25;lastS=scrollY},{passive:true});
const go=document.getElementById('go');
go.addEventListener('pointerenter',()=>dispT=1);go.addEventListener('pointerleave',()=>dispT=0);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let t0=performance.now();
function frame(now){
  const dt=Math.min(.05,(now-t0)/1000);t0=now;
  disp+=(dispT-disp)*.05;
  vel*=.94;cam+=((reduce?0:idle)*(1-disp*.9)+vel*(1-disp))*dt*60;
  cx.globalCompositeOperation='source-over';
  const gr=cx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#05060f');gr.addColorStop(.45,'#0a0a1a');gr.addColorStop(1,'#050308');
  cx.fillStyle=gr;cx.fillRect(0,0,W,H);
  cx.globalCompositeOperation='lighter';
  const f=H*.9,hz=H*.42,sway=(mx>0?(mx/W-.5):0)*40;
  const order=P.map(p=>{let z=((p.z-cam)%Z+Z)%Z;return[p,z]}).sort((a,b)=>b[1]-a[1]);
  for(const[p,z]of order){
    const sc=f/(z+f*.12);
    let x=W/2+p.x*sc*W*.35-sway*sc*.4, y=hz+p.y*sc*H*.55;
    const bloom=Math.min(1,Math.max(.15,1-z/Z*1.1+.2)),near=Math.min(1,z/60);
    let a=Math.min(1,(1-z/Z)*1.6)*near;
    let glow=0;
    if(mx>0){const ddx=x-mx,ddy=y-my,d=Math.hypot(ddx,ddy),R=170;if(d<R&&d>.1){const k=1-d/R;x+=ddx/d*k*k*90;y+=ddy/d*k*k*90;glow=k}}
    if(disp>.01){const tt=now*.0004+p.ph;x+=(p.dx*120+Math.sin(tt*3)*30)*disp*sc*1.5;y+=(p.dy*90-60+Math.cos(tt*2)*30)*disp*sc*1.5}
    let r=p.s*sc*(p.leaf?14:26)*bloom*(1+glow*1.2+disp*.2);
    if(x<-60||x>W+60||y<-60||y>H+60)continue;
    cx.globalAlpha=Math.min(1,a*(p.leaf?.35:.9)+glow*.6);
    if(p.leaf){cx.drawImage(sprites[3],x-r/2,y-r/2,r,r)}
    else{cx.drawImage(sprites[p.h],x-r,y-r,r*2,r*2)}
  }
  cx.globalAlpha=1;requestAnimationFrame(frame)}
requestAnimationFrame(frame);

// ---- Mobile menu
const menu=document.getElementById('menu'),nav=document.getElementById('nav');
function setMenu(o){nav.classList.toggle('open',o);menu.setAttribute('aria-expanded',String(o))}
menu.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
