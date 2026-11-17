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

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Add json helper
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  res.json = function (obj) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
  };

  req.query = parsedUrl.query;

  // Check if API endpoint
  if (apiRoutes[pathname]) {
    // Collect body for POST/PUT
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

  // Friendly Route Aliases (similar to vercel.json rewrites)
  if (pathname === '/' || pathname === '/index') pathname = '/index.html';
  else if (pathname === '/login' || pathname === '/login.php') pathname = '/login.html';
  else if (pathname === '/register' || pathname === '/register.php') pathname = '/register.html';
  else if (pathname === '/game' || pathname === '/game.php') pathname = '/game.html';
  else if (pathname === '/logout.php') {
    return apiRoutes['/api/logout'](req, res);
  }

  // Static file serving
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  // If path is directory, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>404 Not Found</h1><p>The requested file does not exist on The Detective Desk.</p>');
  }
});

server.listen(PORT, () => {
  console.log(`\n🕵️ The Detective's Desk is running at http://localhost:${PORT}`);
  console.log(`📡 Ready for local testing and Vercel serverless deployment.\n`);
});

