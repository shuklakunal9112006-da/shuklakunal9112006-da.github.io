/* ==========================================================================
   Kunal Shukla — Portfolio
   script.js
   ========================================================================== */
(function () {
  "use strict";
 
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initScrollProgress();
    initBackToTop();
    if (!reduceMotion) {
      initReveal();
      initHeroSplit();
      initParallax();
      initTilt();
      initCounters();
    } else {
      // Show everything immediately, skip motion-heavy extras
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
      document.querySelectorAll(".counter").forEach(function (el) { el.textContent = el.dataset.target; });
    }
  });
 
  /* ---- Nav: scrolled shadow, mobile toggle, active link ---- */
  function initNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
 
    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    }, { passive: true });
 
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
    });
 
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
      });
    });
 
    var navLinks = Array.prototype.slice.call(links.querySelectorAll("a"));
    var sections = navLinks
      .map(function (l) { return document.querySelector(l.getAttribute("href")); })
      .filter(Boolean);
 
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = "#" + entry.target.id;
        var match = navLinks.find(function (l) { return l.getAttribute("href") === id; });
        if (!match) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          match.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
 
    sections.forEach(function (s) { io.observe(s); });
  }
 
  /* ---- Scroll progress bar ---- */
  function initScrollProgress() {
    var bar = document.getElementById("scrollProgress");
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
        bar.style.width = pct + "%";
        ticking = false;
      });
    }, { passive: true });
  }
 
  /* ---- Back to top button ---- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }
 
  /* ---- Scroll reveal with gentle stagger ---- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    var counters = {};
    els.forEach(function (el) {
      var parent = el.parentElement;
      var key = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
      var i = counters[el.parentElement] !== undefined ? counters[el.parentElement] : (counters[el.parentElement] = 0);
      el.style.setProperty("--d", Math.min((counters[el.parentElement]++) * 0.08, 0.32) + "s");
    });
 
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
 
    els.forEach(function (el) { io.observe(el); });
  }
 
  /* ---- Split hero heading into animated words ---- */
  function initHeroSplit() {
    var heading = document.getElementById("heroHeading");
    if (!heading) return;
    var words = heading.textContent.trim().split(/\s+/);
    heading.innerHTML = words
      .map(function (w, i) { return '<span class="hero-word" style="animation-delay:' + (i * 0.1) + 's">' + w + "</span>"; })
      .join(" ");
  }
 
  /* ---- Parallax on hero elements via mouse move ---- */
  function initParallax() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var els = hero.querySelectorAll("[data-depth]");
    if (!els.length) return;
 
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      els.forEach(function (el) {
        var depth = parseFloat(el.dataset.depth) || 0.1;
        el.style.transform = "translate(" + (px * depth * 60) + "px," + (py * depth * 60) + "px)";
      });
    });
    hero.addEventListener("mouseleave", function () {
      els.forEach(function (el) { el.style.transform = "translate(0,0)"; });
    });
 
    // Also drift the background blobs gently on scroll
    var blobs = document.querySelectorAll(".bg-blob");
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      blobs.forEach(function (b, i) {
        b.style.transform = "translateY(" + (y * (0.04 + i * 0.02)) + "px)";
      });
    }, { passive: true });
  }
 
  /* ---- Tilt effect on the dashboard card ---- */
  function initTilt() {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 12;
        var ry = (px - 0.5) * 12;
        card.style.transform = "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(700px) rotateX(0) rotateY(0)";
      });
    });
  }
 
  /* ---- Animated stat counters ---- */
  function initCounters() {
    var els = document.querySelectorAll(".counter[data-target]");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
 
    function animate(el) {
      var target = parseInt(el.dataset.target, 10);
      var duration = 1000;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
  }
})();
 
