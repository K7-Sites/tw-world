const REVIEW_DELAY = 6000;

function reviewWindow(carousel, track, slides, motion, updatePosition) {
  let animation;
  let visible;

  function sync() {
    [...track.children].forEach((card, index) => {
      card.inert = index >= visible;
    });
    updatePosition(slides.indexOf(track.firstElementChild));
  }

  function resize() {
    animation?.finish();
    visible = Math.min(
      slides.length,
      Number(window.getComputedStyle(carousel).getPropertyValue("--review-columns")) || 1,
    );
    // Keep a focused link on screen when a narrower viewport removes a column.
    const focused = document.activeElement?.closest("[data-carousel-slide]");
    if (focused && track.contains(focused)) {
      while ([...track.children].indexOf(focused) >= visible) track.append(track.firstElementChild);
    }
    sync();
  }

  function move(step) {
    if (animation) return;
    const forward = step > 0;
    const outgoing = forward ? track.firstElementChild : track.children[visible - 1];
    if (outgoing.contains(document.activeElement)) return;
    const width = track.children[1].offsetLeft - track.children[0].offsetLeft;
    if (!forward) track.prepend(track.lastElementChild);

    function finish() {
      // Tab may reach the departing card while a transition is in flight.
      if (outgoing.contains(document.activeElement)) {
        if (!forward) track.append(track.firstElementChild);
      } else if (forward) track.append(track.firstElementChild);
      animation = undefined;
      sync();
    }

    if (motion.matches || !track.animate) {
      finish();
      return;
    }
    const from = forward ? 0 : -width;
    const to = forward ? -width : 0;
    animation = track.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: 350, easing: "ease-out" },
    );
    animation.onfinish = finish;
  }

  resize();
  new window.ResizeObserver(resize).observe(carousel);
  return move;
}

function bindManualControls(carousel, previous, next, move) {
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  carousel.addEventListener("keydown", (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !["ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  });
}

function initCarousel(carousel) {
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const previous = carousel.querySelector("[data-carousel-previous]");
  const next = carousel.querySelector("[data-carousel-next]");
  const toggle = carousel.querySelector("[data-carousel-toggle]");
  const status = carousel.querySelector("[data-carousel-status]");
  if (!track || slides.length < 2 || !previous || !next) return;

  const reviews = carousel.dataset.carousel === "reviews";
  if (reviews && (!toggle || !("ResizeObserver" in window))) return;
  const updatePosition = (position) => {
    if (status) status.textContent = `${position + 1} / ${slides.length}`;
  };
  carousel.classList.add("is-enhanced");
  if (!reviews) {
    let index = 0;
    const movePhoto = (step) => {
      index = (index + step + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== index)));
      updatePosition(index);
    };
    movePhoto(0);
    bindManualControls(carousel, previous, next, movePhoto);
    return;
  }

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let paused = motion.matches;
  let hovered = carousel.matches(":hover");
  let visible = !("IntersectionObserver" in window);
  let timer;
  const move = reviewWindow(carousel, track, slides, motion, updatePosition);

  function schedule() {
    window.clearTimeout(timer);
    if (
      paused ||
      motion.matches ||
      hovered ||
      carousel.contains(document.activeElement) ||
      !visible ||
      document.hidden
    )
      return;
    timer = window.setTimeout(() => {
      move(1);
      schedule();
    }, REVIEW_DELAY);
  }

  function setPaused(value) {
    paused = value;
    toggle.disabled = motion.matches;
    toggle.setAttribute("aria-label", `${paused ? "Retomar" : "Pausar"} rotação das avaliações`);
    toggle.classList.toggle("is-paused", paused);
    schedule();
  }

  function manualMove(step) {
    setPaused(true);
    move(step);
  }

  bindManualControls(carousel, previous, next, manualMove);
  toggle.addEventListener("click", () => setPaused(!paused));
  carousel.addEventListener("mouseenter", () => {
    hovered = true;
    schedule();
  });
  carousel.addEventListener("mouseleave", () => {
    hovered = false;
    schedule();
  });
  carousel.addEventListener("focusin", schedule);
  carousel.addEventListener("focusout", () => window.queueMicrotask(schedule));
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", () => setPaused(true));

  carousel.setAttribute("aria-roledescription", "carrossel");
  carousel.querySelector(".review-controls").hidden = false;
  let start;
  track.addEventListener(
    "touchstart",
    (event) => {
      start = event.touches.length === 1 ? event.touches[0] : null;
      setPaused(true);
    },
    { passive: true },
  );
  track.addEventListener("touchcancel", () => {
    start = null;
  });
  track.addEventListener(
    "touchend",
    (event) => {
      if (!start) return;
      const dx = event.changedTouches[0].clientX - start.clientX;
      const dy = event.changedTouches[0].clientY - start.clientY;
      start = null;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) manualMove(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );
  if ("IntersectionObserver" in window) {
    new window.IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    }).observe(carousel);
  }
  setPaused(paused);
}

export function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
}
