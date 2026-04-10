// ── CURSEUR
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let cx=0,cy=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;cur.style.left=cx+'px';cur.style.top=cy+'px';});
(function loop(){rx+=(cx-rx)*.1;ry+=(cy-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();

// Délégation sur document — couvre aussi les éléments ajoutés après chargement (bandeau cookies)
document.addEventListener('mouseover',e=>{
  if(e.target.closest('a,button')){
    ring.style.width='50px';ring.style.height='50px';ring.style.opacity='.55';cur.style.opacity='0';
  }
});
document.addEventListener('mouseout',e=>{
  if(e.target.closest('a,button')){
    ring.style.width='32px';ring.style.height='32px';ring.style.opacity='.3';cur.style.opacity='1';
  }
});

// ── SCROLL BAR
const sbar=document.getElementById('sbar');
const navEl=document.getElementById('nav');
function positionSbar(){sbar.style.top=navEl.offsetHeight+'px';}
positionSbar();
window.addEventListener('resize',positionSbar,{passive:true});
window.addEventListener('scroll',()=>{
  sbar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%';
},{passive:true});

// ── NAV SHADOW
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{nav.style.boxShadow=window.scrollY>20?'0 1px 20px rgba(0,0,0,0.06)':'none';},{passive:true});

// ── PARALLAXE HERO
const heroImg=document.getElementById('hero-img');
window.addEventListener('scroll',()=>{if(heroImg)heroImg.style.transform=`translateY(${window.scrollY*.18}px)`;},{passive:true});

// ── REVEAL
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');obs.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-l').forEach(el=>obs.observe(el));



let carPos = 0;
function moveCarousel(dir) {
  const track = document.getElementById('carouselTrack');
  const cards = track.querySelectorAll('.avis-card');
  const perView = window.innerWidth > 900 ? 3 : 1;
  const max = cards.length - perView;
  carPos = Math.max(0, Math.min(carPos + dir, max));
  const cardW = cards[0].offsetWidth + 24; // gap 1.5rem = 24px
  track.style.transform = `translateX(-${carPos * cardW}px)`;
}
window.addEventListener('resize', () => moveCarousel(0));

const cobs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target,target=parseInt(el.dataset.target),suffix=el.dataset.suffix||'',neg=target<0,abs=Math.abs(target);
    const dur=1300,t0=performance.now();
    (function tick(now){
      const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,3);
      el.textContent=(neg?'−':'')+Math.round(ease*abs)+suffix;
      if(p<1)requestAnimationFrame(tick);
    })(t0);
    cobs.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>cobs.observe(el));
