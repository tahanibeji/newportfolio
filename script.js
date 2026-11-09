/* =========================================================
   Tahani Beji portfolio — script.js
   (needs jQuery + Owl Carousel loaded first)
   ========================================================= */

$(".projects-slider").owlCarousel({
    loop: true, margin: 16, items: 3, dots: true, nav: false,
    autoplay: true, autoplayTimeout: 4000, autoplayHoverPause: true, smartSpeed: 1200,
    responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
  });

  // (animations live in the second script below)
  // highlight the active nav pill while scrolling
  (function () {
    var pills = document.querySelectorAll(".nav-pill[data-spy]");
    var map = {};
    pills.forEach(function (p) { map[p.dataset.spy] = p; });
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        var key = (id === "about") ? "top" : (id === "experience") ? "education" : (id === "languages") ? "skills" : (id === "contact" || id === "message") ? "projects" : id;
        if (!map[key]) return;
        pills.forEach(function (p) { p.classList.remove("active"); });
        map[key].classList.add("active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]").forEach(function (s) { io.observe(s); });
  })();

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".hero");

  /* 1. Split headline into words for the staggered entrance */
  var idx = 0;
  document.querySelectorAll("#headline .split").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) {
      return '<span class="w"><span style="--i:' + (idx++) + '">' + w + '</span></span>';
    }).join(" ");
  });
  var roleWrap = document.querySelector(".role-line");
  roleWrap.style.setProperty("--i", idx);

  /* 2. Hero intro */
  function intro() { hero.classList.add("ready"); }
  if (reduce) intro(); else window.addEventListener("load", function () { setTimeout(intro, 120); });
  setTimeout(intro, 1500); // safety net if load is slow

  /* 3. Typewriter that cycles through roles */
  var roles = ["Web Developer.", "Front-end Builder.", "Problem Solver.", "Lifelong Learner."];
  var roleEl = document.getElementById("role");
  function typeLoop() {
    var r = 0, i = roles[0].length, deleting = true;
    function tick() {
      var word = roles[r];
      if (deleting) {
        i--;
        roleEl.textContent = word.slice(0, i);
        if (i <= 0) { deleting = false; r = (r + 1) % roles.length; }
        return setTimeout(tick, 38);
      }
      i++;
      roleEl.textContent = roles[r].slice(0, i);
      if (i >= roles[r].length) { deleting = true; return setTimeout(tick, 2000); }
      setTimeout(tick, 85);
    }
    setTimeout(tick, 2600);
  }
  if (!reduce) typeLoop();

  /* 4. Scroll reveal with stagger */
  var targets = document.querySelectorAll(".sec-head, .about-text, .about-actions, .socials, .card, .map-wrap, .about-figure, .lang-grid");
  targets.forEach(function (el) { el.classList.add("reveal"); });
  document.querySelectorAll(".grid-2, .stats, .contact-grid").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, n) { c.style.setProperty("--d", (n * 90) + "ms"); });
  });
  if ("IntersectionObserver" in window && !reduce) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { rio.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add("in"); });
  }

  /* 5. Hero photo parallax (mouse on desktop, scroll everywhere) */
  var photo = document.getElementById("heroPhoto");
  var mx = 0, my = 0, tx = 0, ty = 0, sy = 0;
  if (!reduce) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener("pointerleave", function () { mx = 0; my = 0; });
    window.addEventListener("scroll", function () { sy = Math.min(window.scrollY, 800); }, { passive: true });
    (function loop() {
      tx += (mx * 22 - tx) * 0.07;
      ty += (my * 14 - ty) * 0.07;
      photo.style.transform =
        "translate3d(" + tx.toFixed(2) + "px," + (ty + sy * 0.12).toFixed(2) + "px,0) scale(1.03)";
      requestAnimationFrame(loop);
    })();
  }

  /* 6. Scroll progress bar + nav shadow */
  var bar = document.getElementById("progress");
  var nav = document.querySelector(".nav");
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 7. Magnetic buttons */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.32;
        b.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* 7b. About cutout: floating parallax that follows the pointer */
  var fig = document.getElementById("aboutFigure");
  if (fig && !reduce) {
    var cut = fig.querySelector(".cutout");
    var rings = fig.querySelectorAll(".ring");
    var badges = fig.querySelectorAll(".badge");
    var fx = 0, fy = 0, cx = 0, cy = 0, over = false;
    fig.addEventListener("pointermove", function (e) {
      var r = fig.getBoundingClientRect();
      fx = (e.clientX - r.left) / r.width - 0.5;
      fy = (e.clientY - r.top) / r.height - 0.5;
      over = true;
    });
    fig.addEventListener("pointerleave", function () { fx = 0; fy = 0; over = false; });
    (function loop() {
      cx += (fx - cx) * 0.08; cy += (fy - cy) * 0.08;
      cut.style.setProperty("--px", (cx * 16).toFixed(2) + "px");
      cut.style.setProperty("--py", (cy * 10).toFixed(2) + "px");
      rings.forEach(function (rg, i) {
        var k = i ? -26 : 20;
        rg.style.setProperty("--px", (cx * k).toFixed(2) + "px");
        rg.style.setProperty("--py", (cy * k * 0.7).toFixed(2) + "px");
      });
      badges.forEach(function (b, i) {
        var k = i ? -34 : 30;
        b.style.setProperty("--px", (cx * k).toFixed(2) + "px");
        b.style.setProperty("--py", (cy * k * 0.6).toFixed(2) + "px");
      });
      requestAnimationFrame(loop);
    })();
  }

  /* 8. Card tilt on hover */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".stat").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = "perspective(700px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 9).toFixed(2) + "deg) translateY(-4px)";
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }
})();


/* ---------- Message form: validate, then open the visitor's mail app ---------- */
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;
  var TO = "tahani.beji@example.com";   // <-- put your real email here
  var status = document.getElementById("formStatus");

  function check(field) {
    var input = field.querySelector("input, textarea");
    var ok = input.checkValidity() && input.value.trim() !== "";
    field.classList.toggle("invalid", !ok);
    return ok;
  }
  form.querySelectorAll(".field").forEach(function (f) {
    var input = f.querySelector("input, textarea");
    input.addEventListener("input", function () { if (f.classList.contains("invalid")) check(f); });
    input.addEventListener("blur", function () { if (input.required) check(f); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll(".field").forEach(function (f) {
      var input = f.querySelector("input, textarea");
      if (input.required && !check(f)) valid = false;
    });
    if (!valid) {
      status.className = "form-status";
      status.textContent = "Please fill in the highlighted fields.";
      return;
    }
    var d = new FormData(form);
    var subject = (d.get("subject") || "").trim() || "Message from your portfolio";
    var body = "Name: " + d.get("name") + "\nEmail: " + d.get("email") + "\n\n" + d.get("message");
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.className = "form-status ok";
    status.textContent = "Thank you! Your mail app is opening with your message.";
    form.reset();
  });
})();


/* ---------- Projects: spotlight glow follows the cursor (works on carousel clones too) ---------- */
(function () {
  var slider = document.querySelector(".projects-slider");
  if (!slider) return;
  slider.addEventListener("pointermove", function (e) {
    var card = e.target.closest ? e.target.closest(".card") : null;
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
})();

/* ---------- Page background fades to dark while you are on My Projects ---------- */
(function () {
  var sec = document.getElementById("projects");
  if (!sec) return;
  var layer = document.createElement("div");
  layer.className = "bg-shift";
  layer.setAttribute("aria-hidden", "true");
  document.body.insertBefore(layer, document.body.firstChild);

  var ticking = false;
  function update() {
    ticking = false;
    var r = sec.getBoundingClientRect(), vh = window.innerHeight;
    var overlap = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    var cover = overlap / vh;                       // 0..1 = how much of the screen the section fills
    var o = Math.max(0, Math.min(1, (cover - 0.2) / 0.45));
    layer.style.opacity = o.toFixed(3);
    document.body.classList.toggle("proj-dark", o > 0.5);
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  update();
})();