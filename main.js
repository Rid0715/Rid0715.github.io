(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  document.getElementById("year").textContent = new Date().getFullYear();

  if (reduced || !hasGsap) {
    document.documentElement.classList.add("reduced");
    setupNav();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links scroll smoothly through Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  setupNav();

  /* ---------- Hero ---------- */
  const heroItems = gsap.utils.toArray("[data-hero]");
  gsap.set(heroItems, { opacity: 0, y: 40 });
  gsap.to(heroItems, {
    opacity: 1, y: 0, duration: 1.4, ease: "power3.out", stagger: 0.11, delay: 0.15,
    onComplete: () => gsap.set(heroItems, { clearProps: "transform" }),
  });
  gsap.fromTo(".hero-bg img", { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" });

  gsap.to(".hero-bg", {
    yPercent: 28, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-content", {
    yPercent: 18, opacity: 0, scale: 0.96, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "75% top", scrub: true },
  });

  /* ---------- Generic reveals ---------- */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onComplete: () => gsap.set(el, { clearProps: "transform" }),
    });
  });

  /* ---------- Counters ---------- */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: end, duration: 1.8, ease: "power3.out",
          onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
        }),
    });
  });

  /* ---------- Statement: word-by-word reveal ---------- */
  const st = document.querySelector("[data-words]");
  if (st) {
    const words = st.textContent.trim().split(/\s+/);
    st.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    gsap.to(st.querySelectorAll(".w"), {
      opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: st, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
    });
  }

  /* ---------- Project image parallax ---------- */
  gsap.utils.toArray("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4, ease: "none",
      scrollTrigger: { trigger: img.closest(".project"), start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  /* ---------- Timeline line ---------- */
  const tl = document.querySelector(".timeline-line i");
  if (tl) {
    gsap.to(tl, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 70%", scrub: 0.4 },
    });
  }

  /* ---------- Subtle tilt on pointer (desktop only) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      let raf = null;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          gsap.to(card, { rotateY: (px - 0.5) * 5, rotateX: (0.5 - py) * 5, transformPerspective: 900, duration: 0.6, ease: "power2.out" });
        });
      });
      card.addEventListener("pointerleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "power3.out" });
      });
    });
  }

  /* ---------- Recalculate after images/fonts load ---------- */
  window.addEventListener("load", () => ScrollTrigger.refresh());

  /* ---------- Nav ---------- */
  function setupNav() {
    const nav = document.getElementById("nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
