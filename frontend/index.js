// 2025 Arian Bhuiyan. All rights reserved. Do not copy or reuse.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function navbarScroll(){
  const navbar=document.getElementById('navbar');
  const heroSection=document.getElementById('hero');
  function onScroll(){
    if(!heroSection) return;
    const heroHeight=heroSection.offsetHeight;
    if(window.scrollY>heroHeight-100) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();
})();

(function smoothNav(){
  const links=document.querySelectorAll('.navbarText a[href^="#"]');
  links.forEach(link=>{
    link.addEventListener('click',e=>{
      const targetId=link.getAttribute('href').replace('#','');
      const target=document.getElementById(targetId);
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior: prefersReducedMotion ? 'auto':'smooth',block:'start'});
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    });
  });
})();

(function observers(){
  function makeObserver(selector,onEnter,options={}){
    const els=document.querySelectorAll(selector);
    if(!els.length) return null;
    if(prefersReducedMotion){els.forEach(el=>onEnter(el)); return null;}
    const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting) onEnter(entry.target,entry);});},options);
    els.forEach(el=>observer.observe(el));
    return observer;
  }

  makeObserver('#Projects',el=>{
    const h2=el.querySelector('h2');
    if(h2) h2.classList.add('visible');
  },{threshold:.35});

  makeObserver('.fade-up',el=>{el.classList.add('visible');},{threshold:.18});

  const skillHandler=aboutEl=>{
    const skillLevels=aboutEl.querySelectorAll('.skill-level');
    if(!skillLevels.length) return;
    skillLevels.forEach(level=>{
      const inlineWidth=level.getAttribute('data-target')||level.style.width||level.dataset.width;
      let parsed=(''+inlineWidth).trim();
      let target=parsed;
      if(!parsed.endsWith('%')&& !isNaN(Number(parsed))) target=parsed+'%';
      if(prefersReducedMotion){ if(target) level.style.width=target; return; }
      level.style.width='0%';
      setTimeout(()=>{level.style.transition='width 1200ms cubic-bezier(.2,.9,.2,1)'; if(target) level.style.width=target;},50);
    });
  };

  makeObserver('#AboutMe',el=>{skillHandler(el);},{threshold:.25});

  makeObserver('#ContactMe',el=>{
    el.classList.add('visible-rings');
    const rings=el.querySelectorAll('.ring');
    rings.forEach(r=>{ r.style.animationPlayState='running'; });
  },{threshold:.2});
})();

(function initStates(){
  if(!prefersReducedMotion){
    document.querySelectorAll('.skill-level').forEach(el=>{
      const declared=el.style.width||el.getAttribute('data-target')||el.dataset.width||'';
      if(declared) el.setAttribute('data-target',declared);
      el.style.width='0%';
      el.style.transition='none';
    });
  } else {
    document.querySelectorAll('.skill-level').forEach(el=>{
      const declared=el.style.width||el.getAttribute('data-target')||el.dataset.width||'';
      if(declared) el.style.width=declared;
    });
  }

  document.querySelectorAll('#ContactMe .ring').forEach(r=>{ r.style.animationPlayState='paused'; });
})();

(function watchReducedMotionChange(){
  const q=window.matchMedia('(prefers-reduced-motion: reduce)');
  q.addEventListener?.('change',()=>{ window.location.reload(); });
})();

(function uiExtras(){
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const back = document.createElement('button');
  back.id = 'backToTop';
  back.setAttribute('aria-label','Back to top');
  back.title = 'Back to top';
  back.textContent = '▲';
  document.body.appendChild(back);

  function toggleBack(){ if(window.scrollY>window.innerHeight*0.6) back.classList.add('visible'); else back.classList.remove('visible'); }
  window.addEventListener('scroll',toggleBack,{passive:true});
  toggleBack();
  back.addEventListener('click',e=>{ e.preventDefault(); if(prefersReducedMotion) window.scrollTo({top:0}); else window.scrollTo({top:0,behavior:'smooth'}); });

  const navLinks=Array.from(document.querySelectorAll('.navbarText a[href^="#"]'));
  const sections=navLinks.map(l=>document.getElementById(l.getAttribute('href').replace('#',''))).filter(Boolean);
  if(sections.length && navLinks.length){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.target.id) return;
        const link=document.querySelector(`.navbarText a[href="#${entry.target.id}"]`);
        if(!link) return;
        if(entry.isIntersecting){ navLinks.forEach(n=>n.classList.remove('active')); link.classList.add('active'); }
      });
    },{threshold:.45});
    sections.forEach(s=>obs.observe(s));
  }

  function addRippleListeners(selectorList){
    selectorList.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        el.classList.add('ripple');
        el.addEventListener('click',ev=>{
          const target=ev.currentTarget;
          target.classList.remove('ripple-animate');
          void target.offsetWidth;
          target.classList.add('ripple-animate');
          setTimeout(()=>target.classList.remove('ripple-animate'),700);
        },{passive:true});
      });
    });
  }
  addRippleListeners(['.navbarText a','.social-link','#hero button']);

  (function keyboardFocusToggle(){
    let usingKeyboard=false;
    window.addEventListener('keydown',e=>{ if(e.key==='Tab'){ usingKeyboard=true; document.documentElement.classList.add('using-keyboard'); }});
    window.addEventListener('mousedown',()=>{ if(usingKeyboard){ usingKeyboard=false; document.documentElement.classList.remove('using-keyboard'); }});
  })();

  if(prefersReducedMotion) document.querySelectorAll('#decor-particles .p').forEach(p=>p?.style && (p.style.display='none'));
})();
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.style.display = 'flex';
  } else {
    backToTopBtn.style.display = 'none';
  }
});
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
(function smoothNav(){
  const links=document.querySelectorAll('.navbarText a[href^="#"], .logo a[data-target]');
  links.forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const targetId = link.getAttribute('data-target') || link.getAttribute('href').replace('#','');
      const target = document.getElementById(targetId);
      if(!target) return;
      target.scrollIntoView({behavior: prefersReducedMotion ? 'auto':'smooth', block:'start'});
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    });
  });
})();
