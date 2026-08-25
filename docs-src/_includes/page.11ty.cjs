const footer = require('./footer.11ty.cjs');
const nav = require('./nav.11ty.cjs');
const breadcrumbs = require('./breadcrumbs.11ty.cjs');
const relative = require('./relative-path.cjs');

module.exports = function (data) {
  const {title, page, content} = data;
  const html = `
<!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="icon" href="${relative(
      page.url,
      '/favicon.svg'
    )}" type="image/svg+xml">
    <script>
      // Applied before first paint so a remembered theme or accent does not
      // flash the defaults while the component bundle loads.
      (() => {
        try {
          const storedTheme = localStorage.getItem('ws-docs-theme');
          if (storedTheme === 'light' || storedTheme === 'dark') {
            document.documentElement.dataset.wsTheme = storedTheme;
          }

          const storedAccent = localStorage.getItem('ws-docs-accent');
          if (storedAccent && /^#[0-9a-f]{6}$/i.test(storedAccent)) {
            const root = document.documentElement.style;
            root.setProperty('--ws-accent', storedAccent);

            // Mirrors accentForeground() from the color-picker component so
            // the accent's foreground is right on the very first paint too.
            const channel = (offset) => {
              const value =
                parseInt(storedAccent.substr(offset, 2), 16) / 255;
              return value <= 0.04045
                ? value / 12.92
                : Math.pow((value + 0.055) / 1.055, 2.4);
            };
            const luminance =
              0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
            const lightContrast = 1.001 / (luminance + 0.05);
            root.setProperty(
              '--ws-accent-on',
              lightContrast >= 3 ? '#f7f7fa' : '#17171c'
            );
          }
        } catch {
          // Storage is unavailable; the defaults apply.
        }
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Google+Sans+Code:ital,wght,MONO@0,300..800,1;1,300..800,1&display=swap"
    >
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/fonts/remixicon.css">
    <link rel="stylesheet" href="${relative(page.url, '/docs.css')}">
    <link rel="stylesheet" href="${relative(page.url, '/component-docs.css')}">
    <script type="module" src="${relative(
      page.url,
      '/ws-button.bundled.js'
    )}"></script>
  </head>
  <body class="ws-theme">
    <ws-docs-shell>
      <div slot="nav">
        ${nav(data)}
      </div>
      <ws-page>
        <div class="docs-content">
          ${data.hideBreadcrumbs ? '' : breadcrumbs(data)}
          ${content}
        </div>
      </ws-page>
      <div slot="footer">
        ${footer(data)}
      </div>
    </ws-docs-shell>
    <script>
      (() => {
        const toggle = document.querySelector('[data-theme-toggle]');
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        const preferredTheme = () =>
          document.documentElement.dataset.wsTheme || (media.matches ? 'dark' : 'light');

        const syncToggle = () => {
          const theme = preferredTheme();
          toggle?.toggleAttribute('checked', theme === 'dark');
          toggle?.setAttribute(
            'aria-label',
            theme === 'dark' ? 'Use light theme' : 'Use dark theme'
          );
        };

        toggle?.addEventListener('change', () => {
          const next = toggle.checked ? 'dark' : 'light';
          document.documentElement.dataset.wsTheme = next;
          localStorage.setItem('ws-docs-theme', next);
          syncToggle();
        });

        media.addEventListener?.('change', () => {
          if (!localStorage.getItem('ws-docs-theme')) {
            delete document.documentElement.dataset.wsTheme;
            syncToggle();
          }
        });

        syncToggle();
      })();
    </script>
  </body>
</html>`;

  return html.replace(/[ \t]+$/gm, '');
};
