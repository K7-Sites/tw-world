export default {
  eleventyExcludeFromCollections: true,
  seoIndex: false,
  eleventyComputed: {
    permalink: ({ eleventy }) =>
      eleventy.env.runMode === "serve" ? "/styleguide/index.html" : false,
  },
};
