const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener('load', () => {
  setTimeout(() => $('.loader')?.classList.add('hide'), 650);
  $('#year').textContent = new Date().getFullYear();
});

const menu = $('.menu'), mobile = $('.mobile-nav');
menu?.addEventListener('click', () => {
  mobile.classList.toggle('open');
  menu.setAttribute('aria-expanded', mobile.classList.contains('open'));
});
$$('.mobile-nav a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

const progress = $('.progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${h ? (scrollY / h) * 100 : 0}%`;
}, {passive:true});

if (matchMedia('(pointer:fine)').matches) {
  const dot = $('.cursor'), ring = $('.cursor-ring'), spot = $('.spotlight');
  dot.style.display = ring.style.display = 'block';
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; spot.style.transform=`translate(${mx}px,${my}px)`; });
  const follow=()=>{ rx+=(mx-rx)*.18; ry+=(my-ry)*.18; dot.style.transform=`translate(${mx-4}px,${my-4}px)`; ring.style.transform=`translate(${rx-17}px,${ry-17}px)`; requestAnimationFrame(follow); };
  follow();
  $$('a,button,.project-card,.stack-card').forEach(el => {
    el.addEventListener('mouseenter',()=>ring.style.transform += ' scale(1.35)');
    el.addEventListener('mouseleave',()=>ring.style.transform = ring.style.transform.replace(' scale(1.35)',''));
  });
  $$('.tilt').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1100px) rotateX(${y*-2.2}deg) rotateY(${x*2.2}deg)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

const counter = $('[data-count]');
if(counter){
  const countObs = new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting) return;
    let n=0, target=+counter.dataset.count;
    const step=()=>{n=Math.min(target,n+2); counter.textContent=n; if(n<target) requestAnimationFrame(step);};
    step(); countObs.disconnect();
  },{threshold:.6});
  countObs.observe(counter);
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') mobile?.classList.remove('open');
});
