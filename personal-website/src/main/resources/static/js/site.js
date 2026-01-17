(() => {
  // year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  const links = Array.from(document.querySelectorAll(".nav a[data-section]"));
  const byId = new Map(links.map(a => [a.dataset.section, a]));

  const setActive = (id) => {
    links.forEach(a => a.classList.toggle("active", a.dataset.section === id));
  };

  // initial: from hash or default first
  const hash = (location.hash || "").replace("#", "");
  if (hash && byId.has(hash)) setActive(hash);
  else if (links[0]) setActive(links[0].dataset.section);

  // update active on click (instant feedback)
  links.forEach(a => {
    a.addEventListener("click", () => setActive(a.dataset.section));
  });

  // update on scroll (IntersectionObserver)
  const sections = links
    .map(a => document.getElementById(a.dataset.section))
    .filter(Boolean);

  if (!sections.length) return;

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, {
    rootMargin: "-20% 0px -70% 0px",
    threshold: [0.05, 0.2, 0.4, 0.6]
  });

  sections.forEach(s => io.observe(s));
})();
