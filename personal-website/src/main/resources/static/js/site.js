(() => {
  // ===== footer year =====
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ===== top nav active =====
  const links = Array.from(document.querySelectorAll(".nav a[data-section]"));
  const byId = new Map(links.map(a => [a.dataset.section, a]));

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("active", a.dataset.section === id));
  };

  const hash = (location.hash || "").replace("#", "");
  if (hash && byId.has(hash)) setActive(hash);
  else if (links[0]) setActive(links[0].dataset.section);

  links.forEach(a => a.addEventListener("click", () => setActive(a.dataset.section)));

  const sections = links.map(a => document.getElementById(a.dataset.section)).filter(Boolean);
  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -70% 0px", threshold: [0.05, 0.2, 0.4, 0.6] });

    sections.forEach(s => io.observe(s));
  }

  // ===== NEW: per-tile hover flip =====
  const wrap = document.querySelector(".js-portrait-reveal");
  const tilesHost = document.querySelector(".js-portrait-tiles");
  const portraitImg = document.querySelector(".js-portrait-img");
  if (!wrap || !tilesHost || !portraitImg) return;

  const ROWS = 5;
  const COLS = 4;

  wrap.style.setProperty("--tile-rows", String(ROWS));
  wrap.style.setProperty("--tile-cols", String(COLS));

  const timers = new WeakMap();   // tile -> timeoutId
  const hovering = new WeakMap(); // tile -> boolean

  const openTile = (tile) => {
    hovering.set(tile, true);

    const t = timers.get(tile);
    if (t) {
      clearTimeout(t);
      timers.delete(tile);
    }

    tile.classList.add("is-open");
  };

  const closeTileWithDelay = (tile) => {
    hovering.set(tile, false);

    const existing = timers.get(tile);
    if (existing) clearTimeout(existing);

    const id = window.setTimeout(() => {
      if (!hovering.get(tile)) tile.classList.remove("is-open");
      timers.delete(tile);
    }, 300);

    timers.set(tile, id);
  };

  const initTiles = () => {
    const src = portraitImg.currentSrc || portraitImg.src;
    if (!src) return;

    wrap.style.setProperty("--portrait-url", `url("${src}")`);

    tilesHost.innerHTML = "";

    const total = ROWS * COLS;
    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / COLS);
      const c = i % COLS;

      const tile = document.createElement("div");
      tile.className = "tile";

      // Slice positioning (responsive)
      const x = (COLS === 1) ? 0 : (c / (COLS - 1)) * 100;
      const y = (ROWS === 1) ? 0 : (r / (ROWS - 1)) * 100;
      tile.style.setProperty("--tile-bg-x", `${x}%`);
      tile.style.setProperty("--tile-bg-y", `${y}%`);

      // Faces
      const front = document.createElement("div");
      front.className = "tile-face tile-front";
      const back = document.createElement("div");
      back.className = "tile-face tile-back";

      tile.appendChild(front);
      tile.appendChild(back);

      // Per-tile hover handling
      tile.addEventListener("mouseenter", () => openTile(tile));
      tile.addEventListener("mouseleave", () => closeTileWithDelay(tile));

      tilesHost.appendChild(tile);
    }
  };

  if (portraitImg.complete) initTiles();
  else portraitImg.addEventListener("load", initTiles, { once: true });
})();
