(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let lenis = null;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ============ Data ============ */
  const SKILLS = {
    languages: { title: "Languages", sub: "Typed where it matters, fast where it counts.", items: [
      ["TypeScript", "typescript"], ["JavaScript", "javascript"], ["Java", "openjdk"], ["C++", "cplusplus"], ["C#", null], ["Go", "go"], ["Python", "python"], ["SQL", "postgresql"], ["HTML5", "html5"], ["CSS", "css"]]},
    backend: { title: "Backend & frameworks", sub: "APIs, realtime and services that stay consistent under load.", items: [
      ["Node.js", "nodedotjs"], ["Express", "express"], ["NestJS", "nestjs"], ["Spring Boot", "springboot"], ["Spring", "spring"], ["Hibernate / JPA", "hibernate"], ["ASP.NET Core", "dotnet"], ["Entity Framework", null], ["Maven", "apachemaven"], ["Gradle", "gradle"], ["Django", "django"], ["Socket.IO", "socketdotio"], ["REST APIs", null], ["GraphQL", "graphql"]]},
    frontend: { title: "Frontend", sub: "Micro-frontends, desktop shells and polished UI.", items: [
      ["React", "react"], ["Angular 15+", "angular"], ["Next.js", "nextdotjs"], ["Electron", "electron"], ["Tailwind CSS", "tailwindcss"], ["Vite", "vite"]]},
    data: { title: "Data & messaging", sub: "Modelling, query optimisation and message-driven IPC.", items: [
      ["PostgreSQL", "postgresql"], ["MongoDB", "mongodb"], ["MySQL", "mysql"], ["Redis", "redis"], ["Apache Solr", "apachesolr"], ["Kafka", "apachekafka"], ["RabbitMQ", "rabbitmq"], ["Vector DBs", null]]},
    cloud: { title: "Cloud & DevOps", sub: "Ship containers through pipelines, then watch them like a hawk.", items: [
      ["AWS", null], ["Google Cloud", "googlecloud"], ["Docker", "docker"], ["Kubernetes", "kubernetes"], ["Jenkins", "jenkins"], ["Terraform", "terraform"], ["Prometheus", "prometheus"], ["Grafana", "grafana"], ["Firebase", "firebase"]]},
    ai: { title: "AI engineering", sub: "Production LLM features with grounding, routing and approval gates.", items: [
      ["Claude", "claude"], ["OpenAI", null], ["Gemini", "googlegemini"], ["Sarvam AI", null], ["LangChain", "langchain"], ["RAG", null], ["Inngest", null], ["Claude Code", "anthropic"]]},
    practices: { title: "Practices", sub: "How the work actually gets done.", items: [
      ["System design", null], ["Jest", "jest"], ["Supertest", null], ["Git", "git"], ["Jira", "jira"], ["Agile / Scrum", null], ["Code review", null], ["Security", null]]},
    learning: { title: "Currently deepening", sub: "Adding depth on the data and testing side.", items: [
      ["Snowflake", "snowflake"], ["Playwright", null], ["Kubernetes operators", "kubernetes"]]},
  };

  const BURST_LABELS = [
    "Engineer", "<b>Distributed</b> systems", "<b>Scalable</b> architecture", "RAG &amp; <b>agentic AI</b>",
    "Cloud &amp; <b>reliability</b>", "Full-stack", "System <b>ownership</b>", "<b>Gen AI</b> products",
  ];

  /* ============ Always-on features ============ */
  setupTheme();
  setupNav();
  setupSkills();
  setupQuotes();

  if (reduced || !hasGsap) {
    document.documentElement.classList.add("reduced");
    setupBurst(false);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.5 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Scroll progress ---------- */
  gsap.to(".progress i", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });

  /* ---------- Cursor ---------- */
  if (finePointer) {
    const cursor = document.querySelector(".cursor");
    const dot = cursor.querySelector(".cursor-dot");
    const ring = cursor.querySelector(".cursor-ring");
    document.body.classList.add("has-cursor");
    const setDot = { x: gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" }), y: gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" }) };
    const setRing = { x: gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" }), y: gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" }) };
    window.addEventListener("pointermove", (e) => { setDot.x(e.clientX); setDot.y(e.clientY); setRing.x(e.clientX); setRing.y(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", (e) => { if (e.target.closest("a, button, [data-tilt], .logo-tile, .quote-dots button")) cursor.classList.add("is-hover"); });
    document.addEventListener("pointerout", (e) => { if (e.target.closest("a, button, [data-tilt], .logo-tile, .quote-dots button")) cursor.classList.remove("is-hover"); });
    document.addEventListener("pointerdown", () => cursor.classList.add("is-press"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-press"));
    document.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
    document.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, duration: 0.3 }));
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * 0.22); yTo(dy * 0.22);
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Hero ---------- */
  const heroItems = gsap.utils.toArray("[data-hero]");
  gsap.set(heroItems, { opacity: 0, y: 40 });
  gsap.to(heroItems, {
    opacity: 1, y: 0, duration: 1.4, ease: "power3.out", stagger: 0.11, delay: 0.15,
    onComplete: () => gsap.set(heroItems, { clearProps: "transform" }),
  });
  gsap.fromTo(".hero-bg img", { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" });
  gsap.to(".hero-bg", { yPercent: 28, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-content", { yPercent: 18, opacity: 0, scale: 0.96, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "75% top", scrub: true } });

  /* ---------- Split-line heading reveals ---------- */
  document.querySelectorAll("[data-split]").forEach((h) => {
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map((w) => `<span class="line"><span>${w}</span></span>`).join(" ");
    h.querySelectorAll(".line").forEach((l) => (l.style.display = "inline-block"));
    gsap.to(h.querySelectorAll(".line > span"), {
      y: 0, duration: 1.1, ease: "power4.out", stagger: 0.07,
      scrollTrigger: { trigger: h, start: "top 88%", once: true },
    });
  });

  /* ---------- Generic reveals ---------- */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onComplete: () => gsap.set(el, { clearProps: "transform" }),
    });
  });

  /* ---------- Clip-path media reveal ---------- */
  gsap.utils.toArray("[data-clip]").forEach((el) => {
    gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 18px)", duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  /* ---------- Statement: word-by-word reveal ---------- */
  const st = document.querySelector("[data-words]");
  if (st) {
    const words = st.textContent.trim().split(/\s+/);
    st.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
    gsap.to(st.querySelectorAll(".w"), { opacity: 1, stagger: 0.06, ease: "none", scrollTrigger: { trigger: st, start: "top 78%", end: "bottom 45%", scrub: 0.6 } });
  }

  /* ---------- Project image parallax ---------- */
  gsap.utils.toArray("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: img.closest(".project"), start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---------- Timeline line ---------- */
  const tl = document.querySelector(".timeline-line i");
  if (tl) gsap.to(tl, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 70%", scrub: 0.4 } });

  /* ---------- Marquee reacts to scroll velocity ---------- */
  const track = document.querySelector(".marquee-track");
  if (track) {
    let ts = 1;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 600, 4);
        ts = 1 + v;
        track.style.animationDuration = `${60 / ts}s`;
      },
    });
    gsap.ticker.add(() => { if (ts > 1) { ts = Math.max(1, ts * 0.96); track.style.animationDuration = `${60 / ts}s`; } });
  }

  /* ---------- Active nav + hide on scroll down ---------- */
  const navEl = document.getElementById("nav");
  const links = [...document.querySelectorAll("[data-nav]")];
  ["what", "work", "experience", "skills", "contact"].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: "top 45%", end: "bottom 45%",
      onToggle: (self) => links.forEach((l) => l.classList.toggle("is-active", self.isActive && l.dataset.nav === id)),
    });
  });
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const down = self.direction === 1 && self.scroll() > 400;
      navEl.classList.toggle("hidden", down);
    },
  });

  setupBurst(true);
  setupRipples();
  window.addEventListener("load", () => ScrollTrigger.refresh());

  /* ============ Feature setups ============ */

  /* ---------- Theme (dark default, light on demand) ---------- */
  function setupTheme() {
    const btn = document.getElementById("themeToggle");
    const meta = document.getElementById("themeColor");
    if (!btn) return;
    const root = document.documentElement;
    const apply = (theme) => {
      if (theme === "light") root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
      if (meta) meta.setAttribute("content", theme === "light" ? "#fbfbfd" : "#000000");
      btn.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
      try { localStorage.setItem("theme", theme); } catch (e) {}
    };
    btn.setAttribute("aria-label", root.getAttribute("data-theme") === "light" ? "Switch to dark mode" : "Switch to light mode");
    btn.addEventListener("click", (e) => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      if (!document.startViewTransition || reduced) {
        root.classList.add("theming"); apply(next); setTimeout(() => root.classList.remove("theming"), 600);
        return;
      }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      let vt = null;
      try { vt = document.startViewTransition(() => apply(next)); }
      catch (err) { apply(next); return; }
      vt.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(() => {});
      vt.updateCallbackDone.catch(() => apply(next));
      vt.finished.catch(() => { if (root.getAttribute("data-theme") !== (next === "light" ? "light" : null)) apply(next); });
    });
  }

  /* ---------- Water: a simulated surface (wave equation on a height field) ---------- */
  function setupRipples() {
    const canvas = document.getElementById("ripples");
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const CELL = 6;            // simulation cell size in CSS px
    const DAMP = 0.986;        // energy loss per step (water viscosity)
    const SHADE = 4.2;         // slope -> light intensity
    const WORD_G = 46;         // slope -> word displacement (px)
    const WORD_L = 7;          // height -> word lift (px)
    let W = 0, H = 0, cols = 0, rows = 0, cur, prev, off, octx, img, running = false, quiet = 0, tick = 0;
    let lastScroll = window.scrollY, scrollAcc = 0, pointer = null, lastMove = null;
    let light = [255, 255, 255], dark = [0, 0, 0], gain = 1;

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      const parse = (v, d) => { const m = (cs.getPropertyValue(v) || "").split(",").map((n) => parseFloat(n)); return m.length === 3 && !m.some(isNaN) ? m : d; };
      light = parse("--water-light", [255, 255, 255]);
      dark = parse("--water-dark", [0, 0, 0]);
      gain = parseFloat(cs.getPropertyValue("--water-gain")) || 1;
    }
    readColors();
    new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      cols = Math.ceil(W / CELL) + 2; rows = Math.ceil(H / CELL) + 2;
      cur = new Float32Array(cols * rows); prev = new Float32Array(cols * rows);
      off = document.createElement("canvas"); off.width = cols; off.height = rows;
      octx = off.getContext("2d"); img = octx.createImageData(cols, rows);
      canvas.width = W; canvas.height = H;
      cacheDirty = true;
    }

    /* ----- floaters: words on the background that ride the surface ----- */
    const FLOAT_SPLIT = [
      ".section-head .sub", ".section-head .kicker", ".lede",
      ".job-head h3", ".job-date", ".job-role", ".job-points li",
      ".quote p", ".quote cite", ".contact .sub", ".contact .kicker", ".skills .sub",
    ];
    function splitWords(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const nodes = [];
      while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
      nodes.forEach((node) => {
        const frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const sp = document.createElement("span"); sp.className = "fl"; sp.textContent = part; frag.appendChild(sp);
        });
        node.parentNode.replaceChild(frag, node);
      });
    }
    document.querySelectorAll(FLOAT_SPLIT.join(",")).forEach(splitWords);
    document.querySelectorAll(".section-head .line, .statement-text .w, .eyebrow .eb").forEach((el) => el.classList.add("fl"));

    let floaters = [], cacheDirty = true, lastCache = 0;
    function cacheFloaters() {
      const sy = window.scrollY, sx = window.scrollX;
      floaters = [...document.querySelectorAll(".fl")].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy, moved: false };
      });
      cacheDirty = false; lastCache = performance.now();
    }
    function settleFloaters() { floaters.forEach((f) => { if (f.moved) { f.el.style.transform = ""; f.moved = false; } }); }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("load", () => { cacheDirty = true; });
    document.addEventListener("click", () => { cacheDirty = true; }, true);
    resize();

    /* ----- disturbing the surface ----- */
    function press(x, y, amp, radius) {
      // push the surface down with a smooth bump; the wave equation does the rest
      const cx = x / CELL + 1, cy = y / CELL + 1;
      const r = Math.max(1.2, radius), r2 = r * r;
      const x0 = Math.max(1, Math.floor(cx - r)), x1 = Math.min(cols - 2, Math.ceil(cx + r));
      const y0 = Math.max(1, Math.floor(cy - r)), y1 = Math.min(rows - 2, Math.ceil(cy + r));
      for (let yy = y0; yy <= y1; yy++) {
        for (let xx = x0; xx <= x1; xx++) {
          const dx = xx - cx, dy = yy - cy, d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          cur[yy * cols + xx] -= amp * Math.exp(-3 * d2 / r2);
        }
      }
      if (!running) { running = true; quiet = 0; requestAnimationFrame(frame); }
    }
    const drop = (x, y, strength) => press(x, y, 0.55 + 0.75 * strength, 1.6 + 2.6 * strength);

    /* ----- physics step: next = average of neighbours * 2 - previous, damped ----- */
    function step() {
      const c = cur, pr = prev, n = cols;
      for (let y = 1; y < rows - 1; y++) {
        let i = y * n + 1;
        for (let x = 1; x < n - 1; x++, i++) {
          const v = ((c[i - 1] + c[i + 1] + c[i - n] + c[i + n]) * 0.5 - pr[i]) * DAMP;
          pr[i] = v;
        }
      }
      // edges absorb a little so waves do not ring forever
      for (let x = 0; x < n; x++) { pr[x] = pr[n + x] * 0.5; pr[(rows - 1) * n + x] = pr[(rows - 2) * n + x] * 0.5; }
      for (let y = 0; y < rows; y++) { pr[y * n] = pr[y * n + 1] * 0.5; pr[y * n + n - 1] = pr[y * n + n - 2] * 0.5; }
      const t = cur; cur = prev; prev = t;
    }

    /* ----- the page scrolls: the water moves with it (and the cursor drags through it) ----- */
    function applyScroll() {
      const sy = window.scrollY, dy = sy - lastScroll; lastScroll = sy;
      if (!dy) return;
      scrollAcc += dy;
      const shift = Math.trunc(scrollAcc / CELL);
      if (shift) {
        scrollAcc -= shift * CELL;
        const n = Math.min(Math.abs(shift), rows - 2) * cols;
        if (shift > 0) { cur.copyWithin(0, n); prev.copyWithin(0, n); cur.fill(0, cur.length - n); prev.fill(0, prev.length - n); }
        else { cur.copyWithin(n, 0, cur.length - n); prev.copyWithin(n, 0, prev.length - n); cur.fill(0, 0, n); prev.fill(0, 0, n); }
      }
      if (pointer && finePointer) {
        const v = Math.min(Math.abs(dy) / 60, 1);
        press(pointer.x, pointer.y, 0.05 + 0.2 * v, 1.8 + v);
      }
    }

    /* ----- render: slope lighting, like light refracting through the surface ----- */
    function render() {
      const d = img.data, c = cur, n = cols;
      const lr = light[0], lg = light[1], lb = light[2], dr = dark[0], dg = dark[1], db = dark[2];
      const k = SHADE * gain;
      let maxAbs = 0;
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < n - 1; x++) {
          const i = y * n + x;
          const h = c[i];
          if (h > maxAbs) maxAbs = h; else if (-h > maxAbs) maxAbs = -h;
          const sl = (c[i + 1] - c[i - 1] + c[i + n] - c[i - n]) * k;
          const o = i * 4;
          if (sl > 0.004) { d[o] = lr; d[o + 1] = lg; d[o + 2] = lb; d[o + 3] = Math.min(255, sl * 255) | 0; }
          else if (sl < -0.004) { d[o] = dr; d[o + 1] = dg; d[o + 2] = db; d[o + 3] = Math.min(255, -sl * 255) | 0; }
          else d[o + 3] = 0;
        }
      }
      octx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, cols, rows, -CELL, -CELL, cols * CELL, rows * CELL);
      return maxAbs;
    }

    /* ----- words: displaced by local slope, lifted by local height ----- */
    function moveFloaters() {
      const sy = window.scrollY, sx = window.scrollX, n = cols;
      const top = sy - 40, bottom = sy + H + 40;
      for (let i = 0; i < floaters.length; i++) {
        const f = floaters[i];
        if (f.y < top || f.y > bottom) { if (f.moved) { f.el.style.transform = ""; f.moved = false; } continue; }
        const gx = Math.min(n - 2, Math.max(1, Math.round((f.x - sx) / CELL + 1)));
        const gy = Math.min(rows - 2, Math.max(1, Math.round((f.y - sy) / CELL + 1)));
        const idx = gy * n + gx;
        const h = cur[idx];
        const slx = cur[idx + 1] - cur[idx - 1], sly = cur[idx + n] - cur[idx - n];
        let dx = slx * WORD_G, dy = sly * WORD_G - h * WORD_L;
        if (dx > 9) dx = 9; else if (dx < -9) dx = -9;
        if (dy > 9) dy = 9; else if (dy < -9) dy = -9;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) { f.el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`; f.moved = true; }
        else if (f.moved) { f.el.style.transform = ""; f.moved = false; }
      }
    }

    function frame(now) {
      if (cacheDirty || now - lastCache > 1500) cacheFloaters();
      applyScroll();
      step();
      const maxAbs = render();
      moveFloaters();
      tick++;
      if (maxAbs < 0.004) quiet++; else quiet = 0;
      if (quiet > 40) {
        running = false; cur.fill(0); prev.fill(0); ctx.clearRect(0, 0, W, H); settleFloaters();
        return;
      }
      requestAnimationFrame(frame);
    }

    /* ----- input ----- */
    // A drop wherever you click or tap
    document.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      drop(e.clientX, e.clientY, 1);
    }, { passive: true });

    // Moving the cursor (or a finger) drags through the water: a wake that follows the path
    document.addEventListener("pointermove", (e) => {
      const now = performance.now();
      const x = e.clientX, y = e.clientY;
      if (lastMove) {
        const dt = Math.max(8, now - lastMove.t);
        const dist = Math.hypot(x - lastMove.x, y - lastMove.y);
        const speed = dist / dt; // px per ms
        if (dist > 2) {
          const inCard = !!(e.target && e.target.closest && e.target.closest(".card"));
          const base = inCard ? 0.09 : 0.05;
          const amp = base + Math.min(speed, 2.5) * (inCard ? 0.09 : 0.06);
          const steps = Math.min(6, Math.max(1, Math.round(dist / 9)));
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            press(lastMove.x + (x - lastMove.x) * t, lastMove.y + (y - lastMove.y) * t, amp, 1.7 + Math.min(speed, 2) * 0.5);
          }
        }
      }
      lastMove = { x, y, t: now };
      pointer = { x, y };
    }, { passive: true });
    document.addEventListener("pointerleave", () => { pointer = null; lastMove = null; });
    document.addEventListener("pointerup", () => { lastMove = null; });

    // Ambient rain: a faint drop somewhere every few seconds
    let ambient = null;
    const schedule = () => {
      clearTimeout(ambient);
      ambient = setTimeout(() => {
        if (!document.hidden) drop(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.8), 0.25 + Math.random() * 0.3);
        schedule();
      }, 5000 + Math.random() * 5000);
    };
    schedule();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });
    // keep the water moving with the page even while idle
    window.addEventListener("scroll", () => { if (!running) lastScroll = window.scrollY; }, { passive: true });
  }

  function setupNav() {
    const nav = document.getElementById("nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Identity burst ---------- */
  function setupBurst(animated) {
    const btn = document.getElementById("avatarBtn");
    const burst = document.getElementById("burst");
    const svg = document.getElementById("burstLines");
    const labelsWrap = document.getElementById("burstLabels");
    const closeBtn = document.getElementById("burstClose");
    const photo = document.getElementById("burstPhoto");
    if (!btn || !burst) return;
    let open = false;

    function layout() {
      const W = window.innerWidth, H = window.innerHeight;
      const cx = W / 2, cy = H / 2 - 30;
      const small = W < 640;
      const photoR = (small ? 200 : 300) / 2;
      const rx = Math.min(W * 0.42, small ? 175 : 430);
      const ry = Math.min(H * 0.38, small ? 250 : 300);
      const labels = small ? BURST_LABELS.slice(0, 6) : BURST_LABELS;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.innerHTML = `<defs><linearGradient id="burstGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H}"><stop offset="0" stop-color="#ffb86b"/><stop offset="0.5" stop-color="#ff7ac6"/><stop offset="1" stop-color="#7cd8ff"/></linearGradient></defs>`;
      labelsWrap.innerHTML = "";
      const n = labels.length;
      labels.forEach((text, i) => {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (small ? Math.PI / n : 0);
        const lx = cx + Math.cos(a) * rx, ly = cy + Math.sin(a) * ry;
        const sx = cx + Math.cos(a) * (photoR + 26), sy = cy + Math.sin(a) * (photoR + 26);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sx); line.setAttribute("y1", sy); line.setAttribute("x2", lx); line.setAttribute("y2", ly);
        const len = Math.hypot(lx - sx, ly - sy);
        line.style.strokeDasharray = len; line.style.strokeDashoffset = animated ? len : 0;
        svg.appendChild(line);
        const dotEl = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dotEl.setAttribute("cx", sx); dotEl.setAttribute("cy", sy); dotEl.setAttribute("r", 2.5);
        svg.appendChild(dotEl);
        const label = document.createElement("div");
        label.className = "burst-label"; label.innerHTML = text;
        labelsWrap.appendChild(label);
        const half = label.offsetWidth / 2 + 12;
        const clx = Math.min(Math.max(lx, half), W - half);
        label.style.left = `${clx}px`; label.style.top = `${ly}px`;
        line.setAttribute("x2", clx);
        const len2 = Math.hypot(clx - sx, ly - sy);
        line.style.strokeDasharray = len2; line.style.strokeDashoffset = animated ? len2 : 0;
      });
      burst.style.setProperty("--cy", `${cy}px`);
      burst.querySelector(".burst-center").style.transform = `translateY(${cy - H / 2 + 20}px)`;
    }

    function show() {
      if (open) return;
      open = true;
      burst.classList.add("is-open");
      burst.setAttribute("aria-hidden", "false");
      layout();
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
      if (!animated) return;
      const from = btn.getBoundingClientRect();
      const to = photo.getBoundingClientRect();
      gsap.set(burst.querySelector(".burst-bg"), { opacity: 0 });
      gsap.to(burst.querySelector(".burst-bg"), { opacity: 1, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(photo,
        { x: from.left + from.width / 2 - (to.left + to.width / 2), y: from.top + from.height / 2 - (to.top + to.height / 2), scale: from.width / to.width },
        { x: 0, y: 0, scale: 1, duration: 1.1, ease: "expo.out" });
      gsap.fromTo(".burst-ring", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "expo.out", delay: 0.25, stagger: 0.1 });
      gsap.fromTo(".burst-name, .burst-role", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5, stagger: 0.08 });
      gsap.to(svg.querySelectorAll("line"), { strokeDashoffset: 0, duration: 1, ease: "power3.inOut", delay: 0.45, stagger: 0.06 });
      gsap.fromTo(svg.querySelectorAll("circle"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.4, delay: 0.5, stagger: 0.06 });
      gsap.fromTo(".burst-label", { opacity: 0, scale: 0.8, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.6)", delay: 1.0, stagger: 0.07 });
      gsap.fromTo(closeBtn, { opacity: 0, rotate: -90 }, { opacity: 1, rotate: 0, duration: 0.6, delay: 0.6 });
    }

    function hide() {
      if (!open) return;
      const done = () => {
        open = false;
        burst.classList.remove("is-open");
        burst.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      };
      if (!animated) return done();
      gsap.to(".burst-label, .burst-name, .burst-role, .burst-ring, .burst-close", { opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(svg.querySelectorAll("line"), { strokeDashoffset: (i, el) => el.style.strokeDasharray, duration: 0.4, ease: "power2.in" });
      const to = btn.getBoundingClientRect();
      const from = photo.getBoundingClientRect();
      gsap.to(photo, { x: to.left + to.width / 2 - (from.left + from.width / 2), y: to.top + to.height / 2 - (from.top + from.height / 2), scale: to.width / from.width, duration: 0.6, ease: "expo.inOut" });
      gsap.to(burst.querySelector(".burst-bg"), { opacity: 0, duration: 0.5, delay: 0.15, onComplete: done });
    }

    btn.addEventListener("click", show);
    closeBtn.addEventListener("click", hide);
    burst.querySelector(".burst-bg").addEventListener("click", hide);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    window.addEventListener("resize", () => { if (open) layout(); });
  }

  /* ---------- Quotes carousel ---------- */
  function setupQuotes() {
    const quotes = [...document.querySelectorAll(".quote")];
    const dots = document.getElementById("quoteDots");
    if (!quotes.length || !dots) return;
    let idx = 0, timer = null;
    const DUR = 6000;
    quotes.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", `Quote ${i + 1}`);
      b.innerHTML = "<i></i>";
      b.addEventListener("click", () => go(i, true));
      dots.appendChild(b);
    });
    const bars = [...dots.querySelectorAll("i")];
    function go(i, manual) {
      const prev = quotes[idx];
      idx = (i + quotes.length) % quotes.length;
      const next = quotes[idx];
      if (hasGsap && !reduced) {
        gsap.to(prev, { opacity: 0, y: -14, duration: 0.45, ease: "power2.in", onComplete: () => { prev.classList.remove("is-active"); gsap.set(prev, { clearProps: "all" }); } });
        next.classList.add("is-active");
        gsap.fromTo(next, { opacity: 0, y: 18, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out", delay: 0.3 });
      } else {
        prev.classList.remove("is-active"); next.classList.add("is-active");
      }
      bars.forEach((bar, j) => { bar.style.transition = "none"; bar.style.transform = j < idx ? "scaleX(1)" : "scaleX(0)"; });
      requestAnimationFrame(() => { bars[idx].style.transition = `transform ${DUR}ms linear`; bars[idx].style.transform = "scaleX(1)"; });
      clearTimeout(timer);
      timer = setTimeout(() => go(idx + 1), DUR);
    }
    bars[0].style.transition = `transform ${DUR}ms linear`;
    requestAnimationFrame(() => (bars[0].style.transform = "scaleX(1)"));
    timer = setTimeout(() => go(1), DUR);
    document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else { clearTimeout(timer); timer = setTimeout(() => go(idx + 1), DUR); } });
  }

  /* ---------- Skills explorer ---------- */
  function setupSkills() {
    const grid = document.getElementById("skillGrid");
    const panel = document.getElementById("skillPanel");
    const logoGrid = document.getElementById("logoGrid");
    const title = document.getElementById("skillPanelTitle");
    const sub = document.getElementById("skillPanelSub");
    if (!grid || !panel) return;
    const tabs = [...grid.querySelectorAll(".skill")];
    let current = null;

    function tile([name, slug]) {
      const initials = name.length <= 4 ? name.toUpperCase() : name.split(/[\s./]+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const media = slug
        ? `<img class="mono" src="https://cdn.simpleicons.org/${slug}/f5f5f7" alt="" loading="lazy" onerror="this.parentNode.innerHTML='<div class=&quot;mono-fallback&quot;>${initials}</div>'"><img class="color" src="https://cdn.simpleicons.org/${slug}" alt="" loading="lazy" onerror="this.remove()">`
        : `<div class="mono-fallback">${initials}</div>`;
      return `<div class="logo-tile"><div class="lg">${media}</div><span>${name}</span></div>`;
    }

    function render(cat, animate) {
      const data = SKILLS[cat];
      if (!data) return;
      title.textContent = data.title;
      sub.textContent = data.sub;
      logoGrid.innerHTML = data.items.map(tile).join("");
      tabs.forEach((t) => { const on = t.dataset.cat === cat; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
      const tiles = logoGrid.querySelectorAll(".logo-tile");
      if (hasGsap && !reduced && animate) {
        const inner = panel.querySelector(".skill-panel-inner");
        const h = inner.offsetHeight + 18;
        gsap.to(panel, { height: h, duration: 0.7, ease: "power3.inOut", onComplete: () => { panel.style.height = "auto"; if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(); } });
        gsap.fromTo(tiles, { opacity: 0, y: 18, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.035, delay: 0.15 });
      } else {
        panel.style.height = "auto";
        tiles.forEach((t) => (t.style.opacity = 1));
      }
      current = cat;
    }

    tabs.forEach((t) => t.addEventListener("click", () => {
      const cat = t.dataset.cat;
      if (cat === current) {
        if (hasGsap && !reduced) {
          gsap.to(panel, { height: 0, duration: 0.5, ease: "power3.inOut" });
        } else panel.style.height = "0px";
        t.classList.remove("is-active"); t.setAttribute("aria-selected", "false");
        current = null;
        return;
      }
      if (hasGsap && !reduced && current) {
        gsap.to(logoGrid.querySelectorAll(".logo-tile"), { opacity: 0, y: -10, duration: 0.25, stagger: 0.015, onComplete: () => { panel.style.height = `${panel.offsetHeight}px`; render(cat, true); } });
      } else {
        render(cat, true);
      }
    }));

    // Open the first category by default
    render("languages", false);
    requestAnimationFrame(() => { panel.style.height = "auto"; logoGrid.querySelectorAll(".logo-tile").forEach((t) => (t.style.opacity = 1)); });
  }

})();
