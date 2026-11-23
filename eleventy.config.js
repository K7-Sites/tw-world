import { cpSync } from "node:fs";
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ public: "assets" });
  eleventyConfig.addPassthroughCopy({ "src/scripts": "assets/js" });
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addCollection("articles", (c) =>
    c.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date),
  );
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
