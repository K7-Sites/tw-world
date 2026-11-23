import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as wait } from "node:timers/promises";
import Eleventy from "@11ty/eleventy";
import { openTestBrowser } from "./browser-helper.js";

const media = { desktop: "/fixture/desktop.mp4", mobile: "/fixture/mobile.mp4" };
async function renderHero(video) {
  const generator = new Eleventy(undefined, undefined, {
    config(config) {
      config.addPreprocessor("hero-video-fixture", "njk", (data) => {
        data.heroVideo = video;
      });
    },
  });
  const pages = await generator.toJSON();
  return pages
    .find((p) => p.url === "/")
    .content.match(/<section class="hero section"[\s\S]*?<\/section>/)[0];
}

test("Hero keeps a working static destination with or without the institutional videos", async () => {
  const hero = await renderHero(media);
  assert.match(hero, /href="#jornadas">ENCONTRE SEU CURSO</);
  assert.match(
    hero,
    /href="\/fixture\/desktop.mp4" data-hero-video data-mobile="\/fixture\/mobile.mp4"><svg aria-hidden="true"/,
  );
  assert.match(hero, /<\/svg>CONHEÇA A TW<\/a>/);
  assert.match(hero, /<video controls playsinline preload="none"[^>]*><\/video>/);
  assert.doesNotMatch(hero, /<source\b|autoplay|<video[^>]+src=/);
  assert.match(hero, /turma-feliz-com-a-teacher.jpg/);
  const pending = await renderHero(null);
  assert.match(pending, /href="#a-tw">CONHEÇA A TW</);
  assert.doesNotMatch(pending, /data-hero-video|<dialog/);
});

test(
  "Hero dialog selects a single source, cleans up and restores focus",
  {
    skip: !(process.env.TW_REVIEW_URL && process.env.TW_CHROME),
  },
  async (t) => {
    const { page, evaluate } = await openTestBrowser(t);
    await page("Page.navigate", { url: process.env.TW_REVIEW_URL });
    for (let i = 0; i < 100 && !(await evaluate('!!document.querySelector(".hero")')); i++)
      await wait(50);
    const hero = await renderHero(media);
    await evaluate(`document.querySelector(".hero").outerHTML = ${JSON.stringify(hero)};
    window.trig = document.querySelector("[data-hero-video]");
    window.dlg = document.querySelector("#hero-video-dialog");
    window.player = dlg.querySelector("video");
    window.starts=0; window.stops=0; window.requests=0;
    player.play = async () => {starts++};
    player.pause = () => {stops++};
    Object.defineProperty(document,"fullscreenEnabled",{value:true});
    player.requestFullscreen = async () => {requests++; throw Error("denied")};
    import("/assets/js/hero-video.js").then(m=>m.initHeroVideo());`);
    assert.equal(
      await evaluate(
        'player.currentSrc === "" && !player.hasAttribute("src") && starts===0 && !performance.getEntriesByType("resource").some(e=>e.name.includes("/fixture/"))',
      ),
      true,
    );
    await page("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    for (const [width, height] of [
      [320, 640],
      [375, 812],
      [390, 844],
      [768, 1024],
      [812, 375],
      [1024, 470],
      [1440, 900],
    ]) {
      await page("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await evaluate("trig.click()");
      const mobile = width <= 832;
      assert.deepEqual(
        await evaluate(`[dlg.open, new URL(player.src).pathname, document.activeElement === dlg.querySelector("button"),getComputedStyle(player).objectFit,
      dlg.offsetHeight <= innerHeight, document.documentElement.scrollWidth <= innerWidth, requests]`),
        [true, mobile ? media.mobile : media.desktop, true, "contain", true, true, mobile ? 1 : 0],
      );
      if (mobile) await evaluate('dlg.querySelector("button").click()');
      else {
        await page("Input.dispatchKeyEvent", {
          type: "keyDown",
          key: "Escape",
          windowsVirtualKeyCode: 27,
        });
        await page("Input.dispatchKeyEvent", {
          type: "keyUp",
          key: "Escape",
          windowsVirtualKeyCode: 27,
        });
      }
      assert.deepEqual(
        await evaluate(
          '[dlg.open,player.hasAttribute("src"),document.activeElement===trig,starts===stops]',
        ),
        [false, false, true, true],
      );
      await evaluate("requests=0");
    }
  },
);

test(
  "Published web editions play after a real click in desktop and mobile viewports",
  {
    skip: !(process.env.TW_REVIEW_URL && process.env.TW_CHROME),
  },
  async (t) => {
    const { page, evaluate } = await openTestBrowser(t);
    for (const [width, height, edition] of [
      [1440, 900, "desktop"],
      [390, 844, "mobile"],
    ]) {
      await page("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await page("Page.navigate", { url: process.env.TW_REVIEW_URL });
      for (
        let i = 0;
        i < 100 &&
        !(await evaluate(
          'document.querySelector("[data-hero-video]")?.hasAttribute("aria-haspopup")',
        ));
        i++
      )
        await wait(50);
      assert.equal(
        await evaluate('document.querySelector("#hero-video-dialog video").currentSrc'),
        "",
      );
      assert.equal(
        await evaluate(
          'performance.getEntriesByType("resource").some(r=>r.name.includes("/assets/videos/"))',
        ),
        false,
      );
      const point = await evaluate(`(() => {
      const link = document.querySelector("[data-hero-video]");
      link.scrollIntoView({behavior:"instant",block:"center"});
      const r=link.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};
    })()`);
      await page("Input.dispatchMouseEvent", {
        type: "mousePressed",
        button: "left",
        clickCount: 1,
        ...point,
      });
      await page("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        button: "left",
        clickCount: 1,
        ...point,
      });
      const player = 'document.querySelector("#hero-video-dialog video")';
      for (let i = 0; i < 120 && !(await evaluate(player + ".currentTime > 0.1")); i++)
        await wait(50);
      assert.deepEqual(
        await evaluate(
          `(v=>[v.paused,v.currentTime>0.1,v.videoWidth,v.videoHeight,Math.round(v.duration),new URL(v.currentSrc).pathname])(${player})`,
        ),
        [
          false,
          true,
          edition === "desktop" ? 1600 : 720,
          edition === "desktop" ? 900 : 1280,
          40,
          "/assets/videos/conheca-a-tw-" + edition + ".mp4",
        ],
      );
      if (edition === "mobile") {
        assert.equal(await evaluate("document.fullscreenElement === " + player), true);
        await evaluate("document.exitFullscreen()");
      } else {
        await evaluate('document.querySelector("#hero-video-dialog button").click()');
      }
      for (
        let i = 0;
        i < 50 && (await evaluate('document.querySelector("#hero-video-dialog").open'));
        i++
      )
        await wait(50);
      assert.deepEqual(
        await evaluate(
          `(v=>[v.paused,v.hasAttribute("src"),document.querySelector("#hero-video-dialog").open,document.activeElement.hasAttribute("data-hero-video")])(${player})`,
        ),
        [true, false, false, true],
      );
    }
  },
);
