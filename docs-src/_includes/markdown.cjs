const markdownIt = require('markdown-it');

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * The shared markdown renderer.
 *
 * Fenced code is emitted as <ws-code-block> so the docs dogfood the component
 * instead of shipping a second highlighter. Both the Eleventy markdown library
 * and the changelog template render through this, so they cannot drift.
 */
const markdown = markdownIt({html: true});

markdown.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx];
  const language = token.info.trim().split(/\s+/)[0] || 'text';

  return `<ws-code-block language="${escapeAttribute(
    language
  )}" copy code="${escapeAttribute(token.content)}"></ws-code-block>\n`;
};

module.exports = {markdown, escapeAttribute};
