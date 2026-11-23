const REVEAL_SELECTOR = "[data-reveal]";
const GROUP_SELECTOR = "[data-reveal-group]";
const CENTER_SELECTOR = '[data-reveal-anchor="top-center"]';
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const groupItems = (group) =>
  [...group.querySelectorAll(REVEAL_SELECTOR)].filter(
    (item) => item.closest(GROUP_SELECTOR) === group,
  );

const setStaggerDelays = (root) => {
  root.querySelectorAll(GROUP_SELECTOR).forEach((group) => {
    groupItems(group).forEach((item, index) => {
      item.style.setProperty(
        "--motion-delay",
        `calc(var(--motion-stagger) * ${Math.min(index, 3)})`,
      );
    });
  });
};

function observeCenterReveals() {
  const pending = new Map();
  document.querySelectorAll(CENTER_SELECTOR).forEach((anchor) => {
    const items = anchor.matches(GROUP_SELECTOR) ? groupItems(anchor) : [anchor];
    if (items[0]) pending.set(items[0], items);
  });
  if (pending.size === 0) return;

  let observer;
  let previousInset;
  function observe() {
    const inset = Math.round(window.innerHeight / 2);
    if (inset === previousInset) return;
    previousInset = inset;
    observer?.disconnect();

    // O recuo em pixels usa a altura da área visível, inclusive em modo paisagem.
    observer = new window.IntersectionObserver(
      (entries, activeObserver) => {
        if (activeObserver !== observer) return;
        entries.forEach(({ target, isIntersecting, boundingClientRect, rootBounds }) => {
          const passedCenter = rootBounds && boundingClientRect.top <= rootBounds.bottom;
          if (!isIntersecting && !passedCenter) return;
          pending.get(target)?.forEach((item) => item.classList.add("is-revealed"));
          pending.delete(target);
          activeObserver.unobserve(target);
        });
        if (pending.size === 0) window.removeEventListener("resize", observe);
      },
      { rootMargin: `0px 0px -${inset}px`, threshold: 0 },
    );
    pending.forEach((_, target) => observer.observe(target));
  }

  window.addEventListener("resize", observe, { passive: true });
  observe();
}

export const initMotion = () => {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches || !("IntersectionObserver" in window)) {
    return;
  }

  document.querySelectorAll("main .heading-accent").forEach((accent) => {
    const heading = accent.closest("h2:not([data-reveal])");
    if (heading && !heading.closest("dialog")) heading.dataset.reveal = "heading";
  });

  const revealItems = [...document.querySelectorAll(REVEAL_SELECTOR)];
  if (revealItems.length === 0) return;

  setStaggerDelays(document);

  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 24px", threshold: 0 },
  );

  revealItems
    .filter((item) => item.dataset.reveal !== "load" && !item.closest(CENTER_SELECTOR))
    .forEach((item) => observer.observe(item));

  document.body.classList.add("motion-ready");
  observeCenterReveals();

  window.requestAnimationFrame(() => {
    revealItems
      .filter((item) => item.dataset.reveal === "load")
      .forEach((item) => item.classList.add("is-revealed"));
  });
};

export function initHeroParallax() {
  const shapes = document.querySelector("[data-hero-parallax]");
  if (!shapes) return;

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let frame;
  let offset = 0;

  function update() {
    frame = undefined;
    const nextOffset = Math.round(Math.min(Math.max(window.scrollY, 0) * 0.08, 24));
    if (nextOffset === offset) return;
    offset = nextOffset;
    shapes.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  function schedule() {
    frame ??= window.requestAnimationFrame(update);
  }

  function syncPreference() {
    if (reducedMotion.matches) {
      window.removeEventListener("scroll", schedule);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      frame = undefined;
      offset = 0;
      shapes.style.removeProperty("transform");
      return;
    }
    window.addEventListener("scroll", schedule, { passive: true });
    schedule();
  }

  reducedMotion.addEventListener("change", syncPreference);
  syncPreference();
}
