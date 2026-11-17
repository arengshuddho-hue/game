const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// API routes mapping
const apiRoutes = {
  '/api/login': require('./api/login'),
  '/api/register': require('./api/register'),
  '/api/me': require('./api/me'),
  '/api/logout': require('./api/logout'),
  '/api/demo': require('./api/demo'),
  '/api/score': require('./api/score'),
  '/api/leaderboard': require('./api/leaderboard'),
  '/api/health': require('./api/health'),
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function findFile(relPath) {
  const clean = relPath.replace(/^[/\\]+/, '');
  const candidates = [
    path.join(__dirname, clean),
    path.join(process.cwd(), clean),
    path.join('/var/task', clean)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      if (fs.statSync(c).isDirectory()) {
        const idx = path.join(c, 'index.html');
        if (fs.existsSync(idx)) return idx;
      } else {
        return c;
      }
    }
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Response helpers
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (obj) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
  };

  req.query = parsedUrl.query;

  // API endpoints
  if (apiRoutes[pathname]) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            const params = new URLSearchParams(body);
            req.body = Object.fromEntries(params);
          }
        } else {
          req.body = {};
        }

        await apiRoutes[pathname](req, res);
      } catch (err) {
        console.error('API Error:', err);
        if (!res.writableEnded) {
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }
    });
    return;
  }

  // Friendly Route Aliases
  if (pathname === '/' || pathname === '/index') pathname = '/index.html';
  else if (pathname === '/login' || pathname === '/login.php') pathname = '/login.html';
  else if (pathname === '/register' || pathname === '/register.php') pathname = '/register.html';
  else if (pathname === '/game' || pathname === '/game.php') pathname = '/game.html';
  else if (pathname === '/logout.php') {
    return apiRoutes['/api/logout'](req, res);
  }

  // Serve static file
  const filePath = findFile(decodeURIComponent(pathname));

  if (filePath && fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  } else {
    const fallback = findFile('index.html');
    if (fallback) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      fs.createReadStream(fallback).pipe(res);
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<h1>404 Not Found</h1>');
    }
  }
});

server.listen(PORT, () => {
  console.log(`🕵️ The Detective's Desk running on port ${PORT}`);
});

module.exports = server;
