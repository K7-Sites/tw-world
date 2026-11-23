export default {
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: ({ eleventy }) =>
      eleventy.env.runMode === "serve" ? "/styleguide/index.html" : false,
  },
};
