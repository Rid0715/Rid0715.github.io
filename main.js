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

  /* ---------- Water: ripples in the background, text floats on the surface ---------- */
  function setupRipples() {
    const canvas = document.getElementById("ripples");
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    const drops = [];
    let W = 0, H = 0, dpr = 1, raf = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cacheDirty = true;
    }

    function color() {
      const cs = getComputedStyle(document.documentElement);
      return { rgb: (cs.getPropertyValue("--ripple") || "255,255,255").trim(), a: parseFloat(cs.getPropertyValue("--ripple-alpha")) || 0.2 };
    }

    /* ----- floaters: words on the background that ride the waves ----- */
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
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("load", () => { cacheDirty = true; });
    resize();

    /* ----- drops (stored in page coordinates so scrolling keeps everything aligned) ----- */
    function drop(cx, cy, strength) {
      drops.push({ x: cx + window.scrollX, y: cy + window.scrollY, t0: performance.now(), s: strength, c: color() });
      if (drops.length > 40) drops.shift();
      if (!raf) raf = requestAnimationFrame(frame);
    }

    // ring phases: first crest strongest, then lighter, then faint
    const PHASES = [1, 0.55, 0.3];
    function frame(now) {
      if (cacheDirty || now - lastCache > 1500) cacheFloaters();
      const sy = window.scrollY, sx = window.scrollX;
      ctx.clearRect(0, 0, W, H);

      const live = [];
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        const life = 2000 * (0.7 + d.s * 0.5);
        const p = (now - d.t0) / life;
        if (p >= 1) { drops.splice(i, 1); continue; }
        const ease = 1 - Math.pow(1 - p, 2.4);
        const maxR = 130 + 260 * d.s;
        const fade = Math.pow(1 - p, 1.5);
        const spacing = 18 + 12 * d.s;
        const rings = [];
        const vx = d.x - sx, vy = d.y - sy;
        for (let k = 0; k < 3; k++) {
          const r = ease * maxR - k * spacing;
          if (r <= 1) continue;
          rings.push({ r, amp: PHASES[k] });
          if (vx < -maxR || vx > W + maxR || vy < -maxR || vy > H + maxR) continue;
          ctx.beginPath();
          ctx.arc(vx, vy, r, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(0.5, (1.9 - k * 0.5) * (1 - p * 0.6));
          ctx.strokeStyle = `rgba(${d.c.rgb}, ${(d.c.a * fade * PHASES[k]).toFixed(3)})`;
          ctx.stroke();
        }
        if (p < 0.35 && vx > -80 && vx < W + 80 && vy > -80 && vy < H + 80) {
          const gr = 26 + 40 * d.s;
          const g = ctx.createRadialGradient(vx, vy, 0, vx, vy, gr);
          const ga = d.c.a * 0.9 * (1 - p / 0.35);
          g.addColorStop(0, `rgba(${d.c.rgb}, ${ga.toFixed(3)})`);
          g.addColorStop(1, `rgba(${d.c.rgb}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(vx, vy, gr, 0, Math.PI * 2); ctx.fill();
        }
        live.push({ x: d.x, y: d.y, rings, amp: 7 * d.s * fade, reach: maxR + 60 });
      }

      /* words near a passing crest get lifted outward, then settle back */
      const top = sy - 300, bottom = sy + H + 300;
      for (let i = 0; i < floaters.length; i++) {
        const f = floaters[i];
        if (f.y < top || f.y > bottom) { if (f.moved) { f.el.style.transform = ""; f.moved = false; } continue; }
        let dx = 0, dy = 0;
        for (let j = 0; j < live.length; j++) {
          const L = live[j];
          const ox = f.x - L.x, oy = f.y - L.y;
          const dist = Math.hypot(ox, oy);
          if (dist > L.reach || dist < 1) continue;
          let h = 0;
          for (let k = 0; k < L.rings.length; k++) {
            const g = (dist - L.rings[k].r) / 30;
            h += L.rings[k].amp * Math.exp(-g * g);
          }
          if (h < 0.01) continue;
          const push = h * L.amp;
          dx += (ox / dist) * push;
          dy += (oy / dist) * push - push * 0.45;
        }
        if (dx || dy) { f.el.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`; f.moved = true; }
        else if (f.moved) { f.el.style.transform = ""; f.moved = false; }
      }

      raf = drops.length ? requestAnimationFrame(frame) : null;
      if (!raf) floaters.forEach((f) => { if (f.moved) { f.el.style.transform = ""; f.moved = false; } });
    }

    // A drop wherever you click or tap
    document.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      drop(e.clientX, e.clientY, 1);
    }, { passive: true });

    // Drops keep falling while the cursor moves inside a card
    if (finePointer) {
      document.querySelectorAll(".card").forEach((card) => {
        let lx = 0, ly = 0, lt = 0;
        card.addEventListener("pointerenter", (e) => { lx = e.clientX; ly = e.clientY; lt = performance.now(); drop(e.clientX, e.clientY, 0.6); });
        card.addEventListener("pointermove", (e) => {
          const now = performance.now();
          const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
          if (dist < 30 || now - lt < 100) return;
          lx = e.clientX; ly = e.clientY; lt = now;
          drop(e.clientX, e.clientY, 0.3 + Math.min(dist, 120) / 350);
        }, { passive: true });
      });
    }

    // Ambient rain: a faint drop somewhere every few seconds
    let ambient = null;
    const schedule = () => {
      clearTimeout(ambient);
      ambient = setTimeout(() => {
        if (!document.hidden) drop(W * (0.1 + Math.random() * 0.8), H * (0.1 + Math.random() * 0.8), 0.35 + Math.random() * 0.25);
        schedule();
      }, 4500 + Math.random() * 4500);
    };
    schedule();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });
    document.addEventListener("click", () => { cacheDirty = true; }, true);
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
