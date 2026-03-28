const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);
const CONFIG_PATH = path.join(__dirname, 'config', 'pages.json');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadPages() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('config/pages.json должен быть объектом.');
  }
  return parsed;
}

function renderPageList(pageKeys) {
  const links = pageKeys
    .map((key) => `<li><a href="/page/${encodeURIComponent(key)}">${escapeHtml(key)}</a></li>`)
    .join('');

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Список страниц</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f6f8; margin:0; }
    .container { max-width: 760px; margin: 40px auto; background:#fff; padding: 24px; border-radius: 12px; }
    a { color:#0a66c2; text-decoration:none; }
    a:hover { text-decoration:underline; }
    ul { line-height: 1.8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Доступные страницы</h1>
    <p>Открой нужную страницу с кнопками:</p>
    <ul>${links}</ul>
    <p>Пример: <code>/page/home</code></p>
  </div>
</body>
</html>`;
}

function renderButtonsPage(pageName, pageConfig) {
  const buttons = Array.isArray(pageConfig.buttons) ? pageConfig.buttons : [];

  const buttonsHtml = buttons.length
    ? buttons
        .map((button) => {
          const label = escapeHtml(button.label || 'Перейти');
          const url = escapeHtml(button.url || '#');
          return `<a class="btn" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        })
        .join('')
    : '<p>На этой странице пока нет кнопок.</p>';

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageConfig.title || pageName)}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f4f6f8; margin:0; }
    .container { max-width: 760px; margin: 40px auto; background:#fff; padding: 24px; border-radius: 12px; }
    .btn-wrap { display:flex; flex-wrap:wrap; gap:12px; margin-top:20px; }
    .btn {
      display:inline-block;
      padding:12px 18px;
      border-radius:10px;
      background:#0a66c2;
      color:#fff;
      text-decoration:none;
      font-weight:600;
    }
    .btn:hover { background:#004182; }
    .back { display:inline-block; margin-top:20px; color:#0a66c2; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(pageConfig.title || pageName)}</h1>
    <p>${escapeHtml(pageConfig.description || '')}</p>
    <div class="btn-wrap">${buttonsHtml}</div>
    <a class="back" href="/">← Назад к списку страниц</a>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const pages = loadPages();

    if (pathname === '/') {
      const html = renderPageList(Object.keys(pages));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (pathname.startsWith('/page/')) {
      const pageName = decodeURIComponent(pathname.slice('/page/'.length));
      const pageConfig = pages[pageName];

      if (!pageConfig) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Страница не найдена.');
        return;
      }

      const html = renderButtonsPage(pageName, pageConfig);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Маршрут не найден.');
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Ошибка сервера: ${error.message}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
