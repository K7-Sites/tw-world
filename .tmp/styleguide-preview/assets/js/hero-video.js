export function initHeroVideo() {
  const trigger = document.querySelector("[data-hero-video]");
  const dialog = document.querySelector("#hero-video-dialog");
  if (!trigger || !dialog?.showModal) return;

  const video = dialog.querySelector("video");
  const closeButton = dialog.querySelector("button");
  const fallback = dialog.querySelector("[data-video-fallback]");
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", dialog.id);

  function close() {
    if (!dialog.open) return;
    video.pause();
    dialog.close();
    video.removeAttribute("src");
    video.load();
    trigger.focus({ preventScroll: true });
  }

  function nativeFullscreen() {
    if (dialog.open && video.webkitEnterFullscreen) {
      try {
        video.webkitEnterFullscreen();
      } catch {
        // The open dialog retains native video controls when iOS denies fullscreen.
      }
    }
  }

  trigger.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    dialog.showModal();
    event.preventDefault();
    closeButton.focus();
    const mobile = window.matchMedia("(max-width: 52rem)").matches;
    video.src = mobile ? trigger.dataset.mobile : trigger.href;
    fallback.hidden = true;
    fallback.querySelector("a").href = video.src;
    video.play().catch(() => {
      // Playback can be started with the native controls if the browser requires it.
    });
    if (mobile) {
      if (video.requestFullscreen && document.fullscreenEnabled) {
        video.requestFullscreen().catch(nativeFullscreen);
      } else {
        nativeFullscreen();
      }
    }
  });
  video.addEventListener("error", () => {
    if (dialog.open && video.hasAttribute("src")) fallback.hidden = false;
  });
  closeButton.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      close();
  });
  let fullscreen = false;
  document.addEventListener("fullscreenchange", () => {
    const active = dialog.contains(document.fullscreenElement);
    if (fullscreen && !active) close();
    fullscreen = active;
  });
  video.addEventListener("webkitendfullscreen", close);
  window.addEventListener("pagehide", close);
}
