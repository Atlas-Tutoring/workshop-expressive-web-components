const markdownIt = require('markdown-it');

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

module.exports = function (eleventyConfig) {
  const markdown = markdownIt({html: true});
  markdown.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const language = token.info.trim().split(/\s+/)[0] || 'text';

    return `<ws-code-block language="${escapeAttribute(
      language
    )}" copy code="${escapeAttribute(token.content)}"></ws-code-block>\n`;
  };

  eleventyConfig.setLibrary('md', markdown);
  eleventyConfig.addPassthroughCopy('docs-src/docs.css');
  eleventyConfig.addPassthroughCopy('docs-src/palette.css');
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
