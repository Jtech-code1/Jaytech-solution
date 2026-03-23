
/* ═══════════════════════════════════════════════════════
   CIRCUIT BOARD BACKGROUND ENGINE
   Animated PCB-style node graph with glowing pulse traces
   ═══════════════════════════════════════════════════════ */
(function(){
  const canvas = document.getElementById('circuitCanvas');
  const ctx    = canvas.getContext('2d');

  const CFG = {
    nodeCount    : 44,
    nodeR        : 3.2,
    nodeGlowR    : 13,
    traceW       : 1.1,
    pulseSpeed   : 0.0017,
    pulseLen     : 0.24,
    spawnMs      : 2000,
    maxPulses    : 16,
    R            : 'rgba(220,38,38,',
    DIM          : 'rgba(160,20,20,',
  };

  let W, H, nodes=[], edges=[], pulses=[], lastSpawn=0, raf;

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    build();
  }

  function build(){
    nodes=[]; edges=[]; pulses=[];
    const cols = Math.ceil(Math.sqrt(CFG.nodeCount*(W/H)));
    const rows = Math.ceil(CFG.nodeCount/cols);
    const cw=W/cols, ch=H/rows;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        if(nodes.length>=CFG.nodeCount) break;
        nodes.push({
          x:cw*c+cw*.18+Math.random()*cw*.64,
          y:ch*r+ch*.18+Math.random()*ch*.64,
          phase:Math.random()*Math.PI*2,
          dim:0.15+Math.random()*.22
        });
      }
    }
    const maxD = Math.max(W,H)*.27;
    for(let i=0;i<nodes.length;i++){
      const sorted = nodes
        .map((n,j)=>({j,d:hyp(nodes[i],n)}))
        .filter(o=>o.j!==i&&o.d>0&&o.d<maxD)
        .sort((a,b)=>a.d-b.d)
        .slice(0, 2+Math.floor(Math.random()*3));
      sorted.forEach(o=>{
        const key=[Math.min(i,o.j),Math.max(i,o.j)].join('-');
        if(!edges.find(e=>e.key===key)){
          edges.push({key,a:i,b:o.j,segs:makeSegs(nodes[i],nodes[o.j])});
        }
      });
    }
  }

  function hyp(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}

  /* Manhattan L-shape with optional diagonal kink for variety */
  function makeSegs(a,b){
    const r=Math.random();
    if(r<0.5){
      /* Horizontal first */
      const m={x:b.x,y:a.y};
      return [{x1:a.x,y1:a.y,x2:m.x,y2:m.y},{x1:m.x,y1:m.y,x2:b.x,y2:b.y}];
    } else if(r<0.75){
      /* Vertical first */
      const m={x:a.x,y:b.y};
      return [{x1:a.x,y1:a.y,x2:m.x,y2:m.y},{x1:m.x,y1:m.y,x2:b.x,y2:b.y}];
    } else {
      /* 3-segment staircase */
      const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
      return [
        {x1:a.x,y1:a.y,x2:mx,y2:a.y},
        {x1:mx,y1:a.y,x2:mx,y2:my},
        {x1:mx,y1:my,x2:b.x,y2:b.y}
      ];
    }
  }

  function edgePt(edge, t){
    const segs=edge.segs;
    const total=segs.reduce((s,sg)=>s+Math.hypot(sg.x2-sg.x1,sg.y2-sg.y1),0);
    let target=t*total;
    for(const sg of segs){
      const l=Math.hypot(sg.x2-sg.x1,sg.y2-sg.y1);
      if(target<=l){
        const f=target/l;
        return {x:sg.x1+(sg.x2-sg.x1)*f, y:sg.y1+(sg.y2-sg.y1)*f};
      }
      target-=l;
    }
    return {x:segs.at(-1).x2,y:segs.at(-1).y2};
  }

  function spawnPulse(now){
    if(pulses.length>=CFG.maxPulses||!edges.length) return;
    const edge=edges[Math.floor(Math.random()*edges.length)];
    pulses.push({
      edge, t:0,
      fwd:Math.random()<0.5,
      spd:CFG.pulseSpeed*(0.55+Math.random()*.9),
      op:0.65+Math.random()*.35,
    });
    lastSpawn=now;
  }

  function draw(now){
    ctx.clearRect(0,0,W,H);

    /* Static dim traces */
    edges.forEach(edge=>{
      edge.segs.forEach(sg=>{
        ctx.beginPath();ctx.moveTo(sg.x1,sg.y1);ctx.lineTo(sg.x2,sg.y2);
        ctx.strokeStyle=CFG.DIM+'0.11)';ctx.lineWidth=CFG.traceW;ctx.stroke();
      });
    });

    /* Nodes — breathing glow */
    nodes.forEach(n=>{
      const ph=(Math.sin(now*.00065+n.phase)*.5+.5);
      const a=n.dim+ph*.2;
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,CFG.nodeGlowR);
      g.addColorStop(0,CFG.R+(a*1.5)+')');
      g.addColorStop(1,CFG.R+'0)');
      ctx.beginPath();ctx.arc(n.x,n.y,CFG.nodeGlowR,0,Math.PI*2);
      ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(n.x,n.y,CFG.nodeR,0,Math.PI*2);
      ctx.fillStyle=CFG.R+(0.22+ph*.32)+')';ctx.fill();
      /* Solder-pad ring */
      ctx.beginPath();ctx.arc(n.x,n.y,CFG.nodeR+2.5,0,Math.PI*2);
      ctx.strokeStyle=CFG.R+(0.1+ph*.1)+')';ctx.lineWidth=1;ctx.stroke();
    });

    /* Pulses */
    pulses=pulses.filter(p=>{
      p.t+=p.spd;
      if(p.t>1) return false;

      const t1=p.fwd?p.t:1-p.t;
      const t0=Math.max(0,t1-CFG.pulseLen);

      /* Glowing trail — 32 steps */
      for(let i=0;i<32;i++){
        const frac=i/31;
        const tt=t0+(t1-t0)*frac;
        if(tt<0||tt>1) continue;
        const pt=edgePt(p.edge,tt);
        const alpha=frac*p.op*.88;
        const r=CFG.traceW*(1+frac*2.5);
        /* Bloom */
        const bg=ctx.createRadialGradient(pt.x,pt.y,0,pt.x,pt.y,r*3.5);
        bg.addColorStop(0,CFG.R+(alpha*.65)+')');
        bg.addColorStop(1,CFG.R+'0)');
        ctx.beginPath();ctx.arc(pt.x,pt.y,r*3.5,0,Math.PI*2);
        ctx.fillStyle=bg;ctx.fill();
        /* Core */
        ctx.beginPath();ctx.arc(pt.x,pt.y,r,0,Math.PI*2);
        ctx.fillStyle=CFG.R+alpha+')';ctx.fill();
      }

      /* Bright hot head */
      const head=edgePt(p.edge,t1);
      const hg=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,11);
      hg.addColorStop(0,'rgba(255,180,180,'+p.op+')');
      hg.addColorStop(0.28,CFG.R+p.op+')');
      hg.addColorStop(1,CFG.R+'0)');
      ctx.beginPath();ctx.arc(head.x,head.y,11,0,Math.PI*2);
      ctx.fillStyle=hg;ctx.fill();

      /* Destination node light-up */
      const dest=p.fwd?nodes[p.edge.b]:nodes[p.edge.a];
      if(p.t>.78){
        const burst=(p.t-.78)/.22*p.op;
        const dg=ctx.createRadialGradient(dest.x,dest.y,0,dest.x,dest.y,24);
        dg.addColorStop(0,CFG.R+burst+')');
        dg.addColorStop(1,CFG.R+'0)');
        ctx.beginPath();ctx.arc(dest.x,dest.y,24,0,Math.PI*2);
        ctx.fillStyle=dg;ctx.fill();
        ctx.beginPath();ctx.arc(dest.x,dest.y,CFG.nodeR+1.5,0,Math.PI*2);
        ctx.fillStyle='rgba(255,210,210,'+burst+')';ctx.fill();
      }
      return true;
    });

    /* Spawn */
    if(now-lastSpawn>CFG.spawnMs+Math.random()*700) spawnPulse(now);
  }

  function loop(now){ draw(now); raf=requestAnimationFrame(loop); }

  window.addEventListener('resize',()=>{
    cancelAnimationFrame(raf); resize(); raf=requestAnimationFrame(loop);
  },{passive:true});

  resize();
  /* Seed burst of initial pulses at staggered times */
  for(let i=0;i<8;i++) setTimeout(()=>spawnPulse(performance.now()),i*300);
  raf=requestAnimationFrame(loop);
})();

/* ═══════════════════════════════════════
   NAV / MENU / FORM / FAQ — ALL ORIGINAL
   ═══════════════════════════════════════ */

const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50),{passive:true});

const mob=document.getElementById('mobNav');
const ham=document.getElementById('ham');
function toggleMob(){const o=mob.classList.toggle('open');ham.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';}
function closeMob(){mob.classList.remove('open');ham.classList.remove('open');document.body.style.overflow='';}
window.addEventListener('resize',()=>{if(window.innerWidth>=768)closeMob();},{passive:true});

const obs=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});
},{threshold:0.06,rootMargin:'0px 0px -24px 0px'});
document.querySelectorAll('.rev,.rev-l').forEach(el=>obs.observe(el));

document.getElementById('fileInput').addEventListener('change',function(){
  const el=document.getElementById('fn2');
  if(this.files[0]){el.textContent='📎 '+this.files[0].name;el.style.display='block';}
});

const fileZone=document.querySelector('.file-z');
fileZone.addEventListener('dragover',e=>{e.preventDefault();fileZone.style.borderColor='rgba(220,38,38,.6)';fileZone.style.background='rgba(220,38,38,.07)';});
fileZone.addEventListener('dragleave',()=>{fileZone.style.borderColor='';fileZone.style.background='';});
fileZone.addEventListener('drop',e=>{
  e.preventDefault();fileZone.style.borderColor='';fileZone.style.background='';
  const f=e.dataTransfer.files[0];
  if(f){
    const el=document.getElementById('fn2');
    el.textContent='📎 '+f.name;el.style.display='block';
    document.getElementById('fileInput').files=e.dataTransfer.files;
  }
});

document.getElementById('cForm').addEventListener('submit',function(e){
  e.preventDefault();
  const btn=document.getElementById('subBtn');
  btn.classList.add('loading');btn.disabled=true;
  setTimeout(()=>{
    btn.classList.remove('loading');btn.disabled=false;
    document.getElementById('sucLay').classList.add('show');
  },2000);
});

function resetForm(){
  document.getElementById('sucLay').classList.remove('show');
  document.getElementById('cForm').reset();
  const el=document.getElementById('fn2');el.textContent='';el.style.display='none';
}

function tFaq(el){
  const item=el.parentElement;
  const was=item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
  if(!was)item.classList.add('open');
}