const {markdown} = require('./docs-src/_includes/markdown.cjs');

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary('md', markdown);

  // The changelog is generated from the repo-root CHANGELOG.md, so rebuild the
  // docs when it changes during `docs:gen:watch`.
  eleventyConfig.addWatchTarget('./CHANGELOG.md');
  eleventyConfig.addPassthroughCopy('docs-src/docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/component-docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/favicon.svg');
  eleventyConfig.addPassthroughCopy('docs-src/.nojekyll');
  eleventyConfig.addCollection('example', (collectionApi) =>
    collectionApi
      .getFilteredByTag('example')
      .sort(
        (a, b) =>
          (a.data.order ?? 999) - (b.data.order ?? 999) ||
          String(a.data.name).localeCompare(String(b.data.name))
      )
  );
  return {
    dir: {
      input: 'docs-src',
      output: 'docs',
    },
    templateExtensionAliases: {
      '11ty.cjs': '11ty.js',
      '11tydata.cjs': '11tydata.js',
    },
  };
};
