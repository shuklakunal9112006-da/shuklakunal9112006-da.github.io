const nav=document.querySelector(".nav"),menu=document.querySelector(".menu"),header=document.querySelector(".header");

menu?.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add("show");
      revealObserver.unobserve(e.target);
    }
  });
},{threshold:.12});

document.querySelectorAll(".reveal").forEach((el,i)=>{
  el.style.transitionDelay=`${Math.min(i*70,280)}ms`;
  revealObserver.observe(el);
});

const sections=[...document.querySelectorAll("main section[id]")];
const navItems=[...document.querySelectorAll(".nav-links a")];

function updateNav(){
  const y=window.scrollY+160;
  let current=sections[0]?.id;
  sections.forEach(s=>{if(y>=s.offsetTop)current=s.id});
  navItems.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+current));
  header?.classList.toggle("scrolled",window.scrollY>25);
}
window.addEventListener("scroll",updateNav,{passive:true});
updateNav();
