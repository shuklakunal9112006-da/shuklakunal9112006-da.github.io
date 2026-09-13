/* ==========================================================================
   enhance.js — bold/motion-heavy layer for shuklakunal9112006-da.github.io
   Drop this file in your project root and add before </body>, AFTER your
   existing scripts (if any):
   <script src="enhance.js" defer></script>

   This file is written to progressively enhance your existing markup.
   Most effects work automatically. A few (marked OPTIONAL) light up further
   if you add a class/attribute to specific elements — instructions are in
   the chat response, not required for this to run.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return; // ship a calm, static site for folks who asked for it

  ready(function () {
    initScrollProgress();
    initCursorGlow();
    initSectionReveal();
    initHeroEntrance();
    initMagnetic();
    initTilt();
    initCounters();
    initSmoothNav();
    initActiveNav();
  });

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---- 1. Scroll progress bar ---- */
  function initScrollProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
        bar.style.width = scrolled + "%";
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---- 2. Cursor glow (desktop only) ---- */
  function initCursorGlow() {
    if (matchMedia("(hover: none), (pointer: coarse)").matches) return;
    var glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    var x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      x = e.clientX;
      y = e.clientY;
    });
    (function loop() {
      cx += (x - cx) * 0.15;
      cy += (y - cy) * 0.15;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---- 3. Section reveal on scroll ----
     Auto-tags direct children of each <section> as .reveal with a stagger,
     unless an element (or ancestor) opts out with data-no-reveal. */
  function initSectionReveal() {
    var sections = document.querySelectorAll("section");
    var targets = [];
    sections.forEach(function (section) {
      var children = Array.prototype.slice.call(section.children);
      children.forEach(function (child, i) {
        if (child.hasAttribute("data-no-reveal")) return;
        if (child.tagName === "SCRIPT" || child.tagName === "STYLE") return;
        child.classList.add("reveal");
        child.style.setProperty("--reveal-delay", Math.min(i * 0.08, 0.4) + "s");
        targets.push(child);
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---- 4. Hero entrance: split heading into words + parallax float ---- */
  function initHeroEntrance() {
    var hero = document.querySelector("#home") || document.querySelector("section");
    if (!hero) return;

    var heading = hero.querySelector("h1");
    if (heading && !heading.dataset.split) {
      heading.dataset.split = "true";
      var words = heading.textContent.trim().split(/\s+/);
      heading.innerHTML = words
        .map(function (w, i) {
          return '<span class="hero-word" style="animation-delay:' + (i * 0.08) + 's">' + w + "</span>";
        })
        .join(" ");
      heading.classList.remove("reveal"); // already animates itself
    }

    // Subtle parallax float on mousemove for hero art / floating cards.
    // Works automatically on common candidates; add data-depth="0.2" etc.
    // to any element yourself for finer control.
    var floaters = hero.querySelectorAll("[data-depth]");
    if (floaters.length === 0) {
      var guess = hero.querySelectorAll("img, svg, .card, .float");
      floaters = Array.prototype.slice.call(guess).slice(0, 6);
    }
    if (floaters.length) {
      floaters.forEach(function (el) { el.classList.add("hero-float"); });
      hero.addEventListener("mousemove", function (e) {
        var rect = hero.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        floaters.forEach(function (el, i) {
          var depth = parseFloat(el.dataset.depth) || (0.15 + (i % 3) * 0.1);
          el.style.transform =
            "translate(" + (px * depth * 40) + "px," + (py * depth * 40) + "px)";
        });
      });
      hero.addEventListener("mouseleave", function () {
        floaters.forEach(function (el) { el.style.transform = "translate(0,0)"; });
      });
    }
  }

  /* ---- 5. Magnetic buttons ----
     OPTIONAL: add class="magnetic" to any CTA/button/nav link for the effect.
     Falls back to auto-applying it to common CTA selectors. */
  function initMagnetic() {
    var els = document.querySelectorAll(".magnetic");
    if (els.length === 0) {
      els = document.querySelectorAll('a[href^="#projects"], a[href^="mailto:"], .btn, .button');
    }
    els.forEach(function (el) {
      el.classList.add("magnetic");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + mx * 0.25 + "px," + my * 0.25 + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---- 6. Tilt on project cards ----
     OPTIONAL: add class="tilt" to your project cards for best results.
     Falls back to auto-detecting links pointing to GitHub project repos. */
  function initTilt() {
    var cards = document.querySelectorAll(".tilt");
    if (cards.length === 0) {
      cards = document.querySelectorAll('a[href*="github.com/"]');
    }
    cards.forEach(function (card) {
      card.classList.add("tilt");
      if (getComputedStyle(card).position === "static") {
        card.style.position = "relative";
      }
      var shine = document.createElement("div");
      shine.className = "tilt-shine";
      card.appendChild(shine);

      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 10;
        var ry = (px - 0.5) * 10;
        card.style.transform =
          "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateZ(4px)";
        shine.style.setProperty("--mx", px * 100 + "%");
        shine.style.setProperty("--my", py * 100 + "%");
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateZ(0)";
      });
    });
  }

  /* ---- 7. Animated number counters ----
     OPTIONAL for precision: wrap a stat number like this for exact control:
       <span class="counter" data-target="12">12</span>
     Falls back to auto-detecting short standalone numbers (e.g. "12", "2", "1")
     inside elements with class/id containing "stat". */
  function initCounters() {
    var els = document.querySelectorAll(".counter[data-target]");
    if (els.length === 0) {
      var candidates = document.querySelectorAll('[class*="stat"] *, [id*="stat"] *');
      candidates.forEach(function (el) {
        var text = el.textContent.trim();
        if (/^\d{1,4}$/.test(text) && el.children.length === 0) {
          el.classList.add("counter");
          el.dataset.target = text;
        }
      });
      els = document.querySelectorAll(".counter[data-target]");
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animateCount(entry.target);
      });
    }, { threshold: 0.6 });

    els.forEach(function (el) { io.observe(el); });

    function animateCount(el) {
      var target = parseInt(el.dataset.target, 10);
      var duration = 1100;
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

  /* ---- 8. Smooth-scrolling nav links ---- */
  function initSmoothNav() {
    document.querySelectorAll('nav a[href^="#"], a[href^="#"][class*="nav"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---- 9. Highlight active nav link on scroll ---- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
    if (!links.length) return;
    var sections = links
      .map(function (l) { return document.querySelector(l.getAttribute("href")); })
      .filter(Boolean);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = "#" + entry.target.id;
        var link = links.find(function (l) { return l.getAttribute("href") === id; });
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px" });

    sections.forEach(function (s) { io.observe(s); });
  }
})();
