import assert from "node:assert/strict";
import { openTestBrowser } from "./browser-helper.js";
import test from "node:test";
import { setTimeout as wait } from "node:timers/promises";

// Point these at a running local build and an installed Chromium browser.
const { TW_REVIEW_URL, TW_CHROME } = process.env;
test(
  "Google review carousel in Chromium",
  { skip: !(TW_REVIEW_URL && TW_CHROME), timeout: 90000 },
  async (t) => {
    const { page, evaluate } = await openTestBrowser(t);
    await page("Page.navigate", { url: TW_REVIEW_URL });
    for (let i = 0; i < 100; i++) {
      if (await evaluate('!!document.querySelector(".review-carousel.is-enhanced")')) break;
      await wait(50);
    }
    await evaluate(`window.root = document.querySelector(".review-carousel");
    window.track = root.querySelector(".review-track");
    window.control = name => root.querySelector("[data-carousel-" + name + "]");
    window.first = () => track.firstElementChild.querySelector("h3").textContent;
    root.scrollIntoView({behavior:"instant", block:"center"})`);
    for (const [width, count] of [
      [320, 1],
      [375, 1],
      [390, 1],
      [640, 1],
      [768, 2],
      [900, 2],
      [1024, 3],
      [1440, 3],
      [390, 1],
    ]) {
      await page("Emulation.setDeviceMetricsOverride", {
        width,
        height: 850,
        deviceScaleFactor: 1,
        mobile: false,
      });
      await wait(120);
      assert.deepEqual(
        await evaluate(`(() => {
      const cards = [...track.children], viewport = track.parentElement.getBoundingClientRect();
      const visible = cards.filter(card => {const r=card.getBoundingClientRect(); return r.left >= viewport.left-1 && r.right <= viewport.right+1;});
      return [visible.length, cards.filter(c=>!c.inert).length, new Set(cards.map(c=>c.offsetHeight)).size,
        document.documentElement.scrollWidth <= document.documentElement.clientWidth];
    })()`),
        [count, count, 1, true],
        "layout at " + width,
      );
    }
    await evaluate('control("next").focus()');
    assert.equal(
      await evaluate('getComputedStyle(root.querySelector(".review-stars")).color'),
      "rgb(251, 188, 4)",
    );
    assert.equal(
      await evaluate(
        `(() => {
          const logo=document.querySelector(".review-intro img");
          const left=control("previous").getBoundingClientRect(), right=control("next").getBoundingClientRect();
          const viewport=track.parentElement.getBoundingClientRect();
          return logo.naturalWidth>0 && Math.abs(logo.getBoundingClientRect().left + logo.width/2 - document.documentElement.clientWidth/2)<2 &&
            left.left < viewport.left && right.right > viewport.right && left.width>=44 && right.width>=44;
        })()`,
      ),
      true,
    );
    await page("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowLeft" });
    await wait(500);
    assert.equal(await evaluate("first()"), "Sofia Porto");
    assert.equal(await evaluate('document.activeElement === control("next")'), true);
    await page("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight" });
    await wait(500);
    assert.equal(await evaluate("first()"), "Danillo Henrique");
    assert.equal(
      await evaluate('control("toggle").getAttribute("aria-label")'),
      "Retomar rotação das avaliações",
    );
    assert.equal(
      await evaluate(
        'new Set([...track.querySelectorAll("a")].map(a=>a.href)).size === track.children.length',
      ),
      true,
    );

    await evaluate(
      'control("next").blur(); root.scrollIntoView({behavior:"instant", block:"center"})',
    );
    await wait(6600);
    assert.equal(await evaluate("first()"), "Danillo Henrique", "manual pause persists");
    await evaluate('control("toggle").click()');
    await wait(6800);
    assert.equal(await evaluate("first()"), "Alba Batista", "autoplay resumes after six seconds");
    await evaluate('track.querySelector("a").focus()');
    await wait(6600);
    assert.equal(await evaluate("first()"), "Alba Batista", "focus pauses rotation");
    await evaluate("document.activeElement.blur()");
    const pointer = await evaluate(`(() => {
      const r = track.firstElementChild.getBoundingClientRect();
      return {x: Math.round(r.left + 35), y: Math.round(r.top + 35)};
    })()`);
    await page("Input.dispatchMouseEvent", { type: "mouseMoved", ...pointer });
    await wait(6600);
    assert.equal(await evaluate("first()"), "Alba Batista", "hover pauses rotation");
    await page("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    await evaluate('control("next").focus(); control("next").click()');
    assert.equal(await evaluate("first()"), "Maria luísa");
    assert.equal(
      await evaluate('control("toggle").disabled && track.getAnimations().length === 0'),
      true,
    );
    await evaluate('control("next").blur()');
    await wait(6600);
    assert.equal(await evaluate("first()"), "Maria luísa", "reduced motion disables autoplay");
    await page("Emulation.setTouchEmulationEnabled", { enabled: true });
    await evaluate('track.scrollIntoView({behavior:"instant",block:"center"})');
    const y = await evaluate("Math.round(track.getBoundingClientRect().top + 60)");
    await page("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 230, y }] });
    await page("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 100, y }] });
    await page("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.equal(await evaluate("first()"), "Otaviano Júnior", "horizontal swipe");
    await page("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 850,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(150);
    await evaluate('for(let i=0;i<3;i++) control("next").click()');
    assert.deepEqual(
      await evaluate(
        '[...track.children].filter(c=>!c.inert).map(c=>c.querySelector("h3").textContent)',
      ),
      ["Sofia Porto", "Danillo Henrique", "Alba Batista"],
    );
  },
);
