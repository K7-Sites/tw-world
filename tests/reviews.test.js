import assert from "node:assert/strict";
import test from "node:test";
import Eleventy from "@11ty/eleventy";
import testimonials from "../src/_data/testimonials.js";

test("Home renders the seven approved Google reviews and accessible links without JavaScript", async () => {
  const entries = [
    ["Danillo Henrique", "TLfIOoT2qG6fj3RZx"],
    ["Alba Batista", "3rWKFiDfUTSZ7zaba"],
    ["Maria luísa", "77L30KjNYjljkXrSq"],
    ["Otaviano Júnior", "ic1jF0c82ZZhFaeEr"],
    ["fabio feliciano", "4o2NwkEMnpWIEDKwo"],
    ["Isabella Vasco", "362JwdkQVl8wLJjlw"],
    ["Sofia Porto", "wtUrlvgX2wNFpMpoq"],
  ];
  const pages = await new Eleventy().toJSON();
  const home = pages.find((page) => page.url === "/").content;
  const section = home.match(/<section[^>]*aria-labelledby="prova-title"[\s\S]*?<\/section>/)[0];
  const cards = [...section.matchAll(/<article class="review-card"[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, entries.length);
  assert.equal(testimonials.length, entries.length);
  entries.forEach(([author, id], index) => {
    const review = testimonials[index];
    const card = cards[index][1];
    assert.deepEqual(
      [review.author, review.url, review.rating, review.source, review.order, review.approved],
      [author, "https://share.google/" + id, 5, "Google", index + 1, true],
    );
    const quote = card.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)[1];
    if (review.quote.length > 155) {
      assert.ok(quote.endsWith("…") && review.quote.startsWith(quote.slice(0, -1)));
      assert.ok(quote.length > 90 && quote.length <= 156);
    } else assert.equal(quote, review.quote);
    assert.ok(card.includes(`<h3>${author}</h3>`));
    assert.equal(card.match(/<use href="#review-star"/g)?.length, 5);
    assert.match(card, /class="review-stars" aria-hidden="true"/);
    assert.ok(
      card.includes(`class="review-initial" aria-hidden="true">${author[0].toUpperCase()}</span>`),
    );
    assert.doesNotMatch(card, /<img\b/);
    assert.match(card, /class="sr-only">5 de 5 estrelas</);
    assert.match(card, /Avaliação no Google/);
    assert.ok(
      card.includes(
        `href="${review.url}" target="_blank" rel="noopener noreferrer">${review.quote.length > 155 ? "Leia mais" : "Ver no Google"}`,
      ),
    );
  });
  assert.match(section, /class="review-controls"[^>]* hidden/);
  assert.match(section, /id="prova-title">EXCELENTE</);
  assert.equal(section.match(/<img\b/g)?.length, 1);
  assert.match(section, /google-maps-attribution.svg"[^>]*alt="Google Maps"/);
  assert.equal(
    section.match(/aria-hidden="true" focusable="false"><use href="#review-star"/g)?.length,
    40,
  );
  assert.equal(
    section.match(/data-carousel-(?:previous|next) aria-label="[^"]+"><svg/g)?.length,
    2,
  );
  assert.doesNotMatch(section, /data-carousel-status/);
  assert.doesNotMatch(
    section,
    /<article[^>]*(?:inert|hidden)|PENDENTE|meses atrás|semanas atrás|74 avaliações/i,
  );
  assert.doesNotMatch(home, /AggregateRating|"@type"\s*:\s*"Review"/i);
  assert.match(section, /href="\/contato\/">Conheça nossos canais/);
});
