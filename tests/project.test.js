import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
const read = (file) => readFileSync(new URL(file, import.meta.url), "utf8");
test("home preserves official H1 and hero CTAs", () => {
  const html = read("../src/pages/index.njk");
  for (const phrase of [
    "Idiomas para aprender de verdade.",
    "Inglês, francês e espanhol, a partir dos 4 anos.",
    "ENCONTRE SEU CURSO",
    "CONHEÇA A TW",
  ])
    assert.ok(html.replace(/<[^>]+>/g, "").includes(phrase), phrase);
});
test("official colors are centralized", () => {
  const css = read("../src/styles/main.css");
  assert.ok(css.includes("#78ac1c"));
  assert.ok(css.includes("#8717c3"));
});
test("Jost typography is centralized with the approved weight scale", () => {
  const tokens = read("../src/styles/main.css");
  const components = read("../src/styles/components.css");
  assert.ok(tokens.includes('font-family: "Jost"'));
  assert.ok(tokens.includes("font-weight: 400 800"));
  for (const token of [
    "--font-weight-regular: 400",
    "--font-weight-medium: 500",
    "--font-weight-semibold: 600",
    "--font-weight-bold: 700",
    "--font-weight-extrabold: 800",
  ])
    assert.ok(tokens.includes(token), token);
  assert.ok(components.includes("font-family: var(--font-sans)"));
  assert.ok(components.includes("font-weight: var(--font-weight-bold)"));
  assert.ok(!components.includes("font-weight: 650"));
  assert.ok(!components.includes("font-weight: 900"));
});
test("nine page templates exist", () => {
  assert.equal(
    readdirSync(new URL("../src/pages/", import.meta.url)).filter((f) => f.endsWith(".njk")).length,
    9,
  );
});
test("draft blocks must not silently become production content", () => {
  assert.ok(read("../src/_includes/layouts/base.njk").includes("noindex,nofollow"));
});
test("layout uses fluid container and spacing tokens", () => {
  const tokens = read("../src/styles/main.css");
  const components = read("../src/styles/components.css");
  for (const token of [
    "--container-reading",
    "--container-default",
    "--container-wide",
    "--page-gutter",
    "--space-section",
  ])
    assert.ok(tokens.includes(token), token);
  assert.ok(components.includes("width: 100%"));
  assert.ok(components.includes("repeat(auto-fit"));
  assert.ok(components.includes("minmax(min(100%"));
});
test("mobile navigation keeps a non-JavaScript fallback", () => {
  const css = read("../src/styles/components.css");
  const script = read("../src/scripts/navigation.js");
  assert.ok(css.includes(".site-header.is-enhanced .main-navigation"));
  assert.ok(script.includes('header.classList.add("is-enhanced")'));
});
test("header hides only the contact bar after vertical scrolling", () => {
  const css = read("../src/styles/components.css");
  const script = read("../src/scripts/navigation.js");
  assert.ok(css.includes(".site-header.is-scrolled .header-topbar"));
  assert.ok(css.includes("var(--header-topbar-height"));
  assert.ok(script.includes('header.classList.toggle("is-scrolled"'));
  assert.ok(script.includes("window.scrollY > 16"));
  assert.ok(script.includes("window.scrollY <= 1"));
  assert.ok(script.includes("{ passive: true }"));
});
test("school carousel offers manual photo navigation only", () => {
  const home = read("../src/pages/index.njk");
  const carousel = read("../src/scripts/carousel.js");
  const main = read("../src/scripts/main.js");
  for (const control of ["data-carousel-previous", "data-carousel-status", "data-carousel-next"])
    assert.ok(home.includes(control), control);
  assert.doesNotMatch(home, /data-carousel-toggle|Troca automática/);
  assert.ok(carousel.includes("prefers-reduced-motion: reduce"));
  assert.ok(main.includes("initCarousels"));
});
test("motion enhancement is lightweight, progressive, and respects user preferences", () => {
  const motion = read("../src/scripts/motion.js");
  const main = read("../src/scripts/main.js");
  const css = read("../src/styles/components.css");
  const packageFile = read("../package.json");

  assert.ok(motion.includes("IntersectionObserver"));
  assert.ok(motion.includes("prefers-reduced-motion: reduce"));
  assert.ok(motion.includes("observer.unobserve"));
  assert.ok(main.includes("initMotion"));
  assert.ok(css.includes("body.motion-ready [data-reveal]"));
  assert.ok(css.includes("@media (hover: hover) and (pointer: fine)"));
  assert.ok(!packageFile.includes('"aos"'));
  assert.ok(!packageFile.includes('"gsap"'));
  assert.ok(!packageFile.includes('"swiper"'));
});
test("school section includes mission and vision cards with the brand border", () => {
  const home = read("../src/pages/index.njk");
  const css = read("../src/styles/components.css");
  for (const title of [">Missão<", ">Visão<"]) assert.ok(home.includes(title), title);
  assert.ok(home.includes("school-value-card"));
  assert.ok(css.includes("border-top: 3px solid var(--tw-green)"));
});
test("course guide content enriches existing routes without adding pages", () => {
  const guide = read("../src/_data/courseGuide.js");
  const about = read("../src/pages/a-tw.njk");
  const english = read("../src/pages/ingles.njk");
  const experience = read("../src/pages/experiencia-tw.njk");
  for (const phrase of [
    "Little Kids",
    "Magic Kids",
    "Super Teens",
    "Fluency",
    "Mastery",
    "TW Senior",
  ])
    assert.ok(guide.includes(phrase), phrase);
  assert.ok(about.includes("courseGuide.methodology"));
  assert.ok(english.includes("courseGuide.courses"));
  assert.ok(experience.includes("courseGuide.projects"));
  assert.ok(experience.includes("courseGuide.environments"));
  assert.ok(!guide.includes("certificação automática"));
  assert.ok(!guide.includes("CONNECT"));
});
test("header preserves confirmed links and two-band structure", () => {
  const header = read("../src/_includes/components/header.njk");
  const footer = read("../src/_includes/components/footer.njk");
  const site = read("../src/_data/site.js");
  for (const className of ["header-topbar", "header-mainbar", "header-contacts", "header-cta"])
    assert.ok(header.includes(className), className);
  assert.ok(header.includes("site.instagram"));
  assert.ok(header.includes("site.linkedin"));
  assert.ok(header.includes("/#jornadas"));
  assert.ok(site.includes("https://www.linkedin.com/company/transworldidiomas/"));
  assert.ok(site.includes("falecom@transworld.com.br"));
  assert.ok(site.includes("(81) 3302-6120"));
  assert.ok(!header.includes("contact@example.com"));
  assert.ok(!header.includes("+1 (555) 842-9631"));
  const brandLogo = read("../src/_includes/components/brand-logo.njk");
  assert.ok(brandLogo.includes("/assets/images/brand/transworld-idiomas-logo-white.png"));
  assert.ok(header.includes('brandLogo("brand-logo")'));
  assert.ok(footer.includes('brandLogo("footer-brand-logo", true)'));
});
