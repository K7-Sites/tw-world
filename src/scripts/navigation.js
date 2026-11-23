export function initNavigation() {
  const header = document.querySelector("[data-header]");
  const trigger = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-mobile-menu]");
  if (!header || !trigger || !nav) return;
  const courses = nav.querySelector(".nav-courses");

  header.classList.add("is-enhanced");

  const topbar = header.querySelector(".header-topbar");
  if (topbar) {
    const updateTopbarHeight = () => {
      header.style.setProperty("--header-topbar-height", `${topbar.scrollHeight}px`);
    };

    let isTopbarHidden = window.scrollY > 1;
    let scrollUpdatePending = false;
    const updateHeaderOnScroll = () => {
      if (!isTopbarHidden && window.scrollY > 16) isTopbarHidden = true;
      if (isTopbarHidden && window.scrollY <= 1) isTopbarHidden = false;
      header.classList.toggle("is-scrolled", isTopbarHidden);
      scrollUpdatePending = false;
    };

    updateTopbarHeight();
    updateHeaderOnScroll();
    window.addEventListener("resize", updateTopbarHeight);
    window.addEventListener(
      "scroll",
      () => {
        if (scrollUpdatePending) return;
        scrollUpdatePending = true;
        window.requestAnimationFrame(updateHeaderOnScroll);
      },
      { passive: true },
    );
  }

  const close = (restoreFocus = false) => {
    if (courses) courses.open = false;
    trigger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    if (restoreFocus) trigger.focus();
  };
  trigger.addEventListener("click", () => {
    if (trigger.getAttribute("aria-expanded") === "true") return close(true);
    trigger.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    nav.querySelector("a")?.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (courses?.open) {
      courses.open = false;
      courses.querySelector("summary").focus();
    } else if (trigger.getAttribute("aria-expanded") === "true") close(true);
  });
  courses?.addEventListener("focusout", (event) => {
    if (!courses.contains(event.relatedTarget)) courses.open = false;
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => close()));
  document.addEventListener("click", (event) => {
    if (courses?.open && !courses.contains(event.target)) courses.open = false;
    if (!nav.contains(event.target) && !trigger.contains(event.target)) close();
  });
  window.matchMedia("(max-width: 84rem)").addEventListener("change", () => close());
}
