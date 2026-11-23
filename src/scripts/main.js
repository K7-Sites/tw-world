import { initCarousels } from "./carousel.js";
import { initContact } from "./contact.js";
import { initHeroVideo } from "./hero-video.js";
import { initHeroParallax, initMotion } from "./motion.js";
import { initNavigation } from "./navigation.js";

initNavigation();
initCarousels();
initHeroVideo();
initMotion();
initHeroParallax();
initContact();

const mobileSource = document.querySelector(".invite-player source[media][data-poster]");
if (mobileSource) {
  const video = mobileSource.parentElement;
  const desktopPoster = video.poster;
  const viewport = window.matchMedia(mobileSource.media);
  const updatePoster = () => {
    video.poster = viewport.matches ? mobileSource.dataset.poster : desktopPoster;
  };
  updatePoster();
  viewport.addEventListener("change", updatePoster);
}
