(function(){
  'use strict';
  var header=document.getElementById('siteHeader');
  var progress=document.getElementById('progressBar');
  var back=document.getElementById('backToTop');
  var toggle=document.getElementById('navToggle');
  var nav=document.getElementById('primaryNav');
  var resumeBtn=document.getElementById('resumeBtn');
  var resumeNote=document.getElementById('resumeNote');
  var year=document.getElementById('footerYear');

  if(year) year.textContent=new Date().getFullYear();

  function onScroll(){
    var y=window.scrollY || window.pageYOffset;
    if(header) header.classList.toggle('scrolled',y>30);
    if(progress){
      var max=document.documentElement.scrollHeight-window.innerHeight;
      progress.style.width=(max>0?Math.min(100,(y/max)*100):0)+'%';
    }
    if(back) back.classList.toggle('visible',y>650);
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  onScroll();

  function closeNav(){
    if(!nav||!toggle) return;
    nav.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded','false');
  }
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      toggle.classList.toggle('active',open);
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeNav);});
    document.addEventListener('click',function(e){
      if(!nav.classList.contains('open')) return;
      if(nav.contains(e.target)||toggle.contains(e.target)) return;
      closeNav();
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape') closeNav();});
  }
  if(back) back.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

  if(resumeBtn&&resumeNote) resumeBtn.addEventListener('click',function(){resumeNote.classList.toggle('visible');});

  var reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var revealObserver=new IntersectionObserver(function(entries,obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('in-view');obs.unobserve(entry.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -50px 0px'});
    reveals.forEach(function(el){
      if(!el.classList.contains('is-visible')) revealObserver.observe(el);
    });
  }else reveals.forEach(function(el){el.classList.add('in-view');});

  var sections=document.querySelectorAll('main section[id]');
  var links=document.querySelectorAll('.nav-link');
  if('IntersectionObserver' in window){
    var activeObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return;
        var id=entry.target.id;
        links.forEach(function(link){link.classList.toggle('active',link.getAttribute('href')==='#'+id);});
      });
    },{rootMargin:'-42% 0px -52% 0px',threshold:0});
    sections.forEach(function(section){activeObserver.observe(section);});
  }
})();
