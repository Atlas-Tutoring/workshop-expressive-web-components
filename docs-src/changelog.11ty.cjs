const fs = require('node:fs');
const path = require('node:path');

const page = require('./_includes/page.11ty.cjs');
const {markdown} = require('./_includes/markdown.cjs');

const repoUrl =
  'https://github.com/MihaiCristianCondrea/workshop-expressive-web-components';
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-|-$/g, '') || 'release';

/**
 * Renders the repo-root CHANGELOG.md.
 *
 * The root file stays the single source of truth -- this page reads it at
 * build time rather than keeping a second copy in the docs that could drift.
 */
module.exports = class Changelog {
  data() {
    return {
      permalink: '/changelog/index.html',
      title: 'WorkShop Expressive Web Components ⌲ Changelog',
      hideBreadcrumbs: true,
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const source = fs.readFileSync(changelogPath, 'utf8');

    // Drop the file's own H1 and intro line; the page supplies its own header.
    const body = source
      .replace(/^#\s+Changelog\s*\n/, '')
      .replace(/^All notable changes[^\n]*\n/m, '')
      .trim();

    const releases = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) =>
      match[1].trim()
    );

    const html = markdown
      .render(body)
      .replace(
        /<h2>([\s\S]*?)<\/h2>/g,
        (_match, heading) =>
          `<h2 id="${escapeHtml(slugify(heading))}">${heading}</h2>`
      );

    return page({
      ...data,
      content: renderPage(html, releases),
    });
  }
};

const renderReleaseNav = (releases) => {
  if (!releases.length) return '';

  return `
    <aside class="release-nav" aria-label="Releases">
      <strong>Releases</strong>
      <ul>
        ${releases
          .map(
            (release) => `
              <li><a href="#${escapeHtml(slugify(release))}">${escapeHtml(
              release
            )}</a></li>`
          )
          .join('')}
      </ul>
    </aside>
  `;
};

const renderPage = (html, releases) => `
  <section class="changelog">
    ${renderReleaseNav(releases)}
    <div class="changelog-content">
      <h1>Changelog</h1>
      <p class="changelog-intro">
        Every notable change to
        <code>@mihaicristiancondrea/workshop-expressive-web-components</code>.
        Entries land under <strong>Unreleased</strong> as they are merged, and
        are grouped into a version when it ships.
        <a href="${repoUrl}/releases">Browse the GitHub releases</a>.
      </p>
      ${html}
    </div>
  </section>
`;
