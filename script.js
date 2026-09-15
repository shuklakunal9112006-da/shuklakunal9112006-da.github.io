document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu');
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const revealEls = document.querySelectorAll('.reveal');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
    });
  });

  const setActive = () => {
    const y = window.scrollY + 130;
    let current = sections[0]?.id;
    sections.forEach(section => {
      if (section.offsetTop <= y) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', setActive, {passive:true});
  setActive();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }
});
