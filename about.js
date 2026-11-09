/* =========================================================
   Tahani Beji portfolio — about.js (animations for aboutme.html)
   ========================================================= */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scroll progress bar + nav background */
  var bar = document.getElementById("progress");
  var nav = document.getElementById("nav");
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* scroll reveal with stagger */
  var targets = document.querySelectorAll(".about-figure, .sec-head, .about-role, .about-quote, .about-text, .about-actions, .tile");
  targets.forEach(function (el) { if (!el.classList.contains("tile")) el.classList.add("reveal"); });
  document.querySelectorAll(".bento").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, n) { c.style.setProperty("--d", (n * 90) + "ms"); });
  });
  var copyItems = document.querySelectorAll(".about-copy .reveal");
  copyItems.forEach(function (el, n) { el.style.setProperty("--d", (n * 110) + "ms"); });

  function countUp(el) {
    var to = +el.getAttribute("data-count"), t0 = null;
    if (reduce) { el.textContent = to; return; }
    (function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / 1600, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function show(el) {
    el.classList.add("in");
    var n = el.querySelector("[data-count]");
    if (n) setTimeout(function () { countUp(n); }, 300);
  }
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
    setTimeout(function () { // safety net for anything already on screen
      targets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) show(el);
      });
    }, 400);
  } else {
    targets.forEach(show);
  }

  /* photo parallax that follows the pointer */
  var fig = document.getElementById("aboutFigure");
  if (fig && !reduce) {
    var cut = fig.querySelector(".cutout");
    var rings = fig.querySelectorAll(".ring");
    var badges = fig.querySelectorAll(".badge");
    var fx = 0, fy = 0, cx = 0, cy = 0;
    fig.addEventListener("pointermove", function (e) {
      var r = fig.getBoundingClientRect();
      fx = (e.clientX - r.left) / r.width - 0.5;
      fy = (e.clientY - r.top) / r.height - 0.5;
    });
    fig.addEventListener("pointerleave", function () { fx = 0; fy = 0; });
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

  /* magnetic buttons + card tilt (mouse devices only) */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    document.querySelectorAll(".tile").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty("--mx", (px + 0.5) * 100 + "%"); c.style.setProperty("--my", (py + 0.5) * 100 + "%");
        c.style.transform = "perspective(800px) rotateX(" + (-py * 5).toFixed(2) + "deg) rotateY(" + (px * 6).toFixed(2) + "deg) translateY(-3px)";
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }

  /* birthday countdown */
  var left = document.getElementById("bdayLeft");
  if (left) {
    var now = new Date(), y = now.getFullYear();
    var next = new Date(y, 0, 26);
    if (next < new Date(y, now.getMonth(), now.getDate())) next = new Date(y + 1, 0, 26);
    var days = Math.round((next - new Date(y, now.getMonth(), now.getDate())) / 86400000);
    left.textContent = days === 0 ? "It's today! 🎉" : "Next birthday in " + days + " day" + (days === 1 ? "" : "s");
  }

  /* copy-to-clipboard buttons */
  document.querySelectorAll(".copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      function ok() {
        b.classList.add("done"); b.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(function () { b.classList.remove("done"); b.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, ok);
      else {
        var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t);
        t.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(t); ok();
      }
    });
  });
})();