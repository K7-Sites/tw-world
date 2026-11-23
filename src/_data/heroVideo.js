import { existsSync } from "node:fs";

const filenames = ["conheca-a-tw-desktop.mp4", "conheca-a-tw-mobile.mp4"];
const ready = filenames.every((name) =>
  existsSync(new URL("../../public/videos/" + name, import.meta.url)),
);

// Keep the existing school anchor until both web editions are available.
export default ready
  ? {
      desktop: "/assets/videos/" + filenames[0],
      mobile: "/assets/videos/" + filenames[1],
      poster: "/assets/images/hero/conheca-a-tw-desktop.webp",
      mobilePoster: "/assets/images/hero/conheca-a-tw-mobile.webp",
    }
  : null;
