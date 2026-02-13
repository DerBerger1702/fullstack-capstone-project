/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pinoLogger = require('./logger');
const authRoutes = require('./routes/authRoutes');
const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");


const app = express();
app.use("*",cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
})
    .catch((e) => console.error('Failed to connect to DB', e));


app.use(express.json());

// Log every request to the terminal (helps debug blank page)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Serve built React app static files first (so /static/js/* and /static/css/* work)
app.use(express.static(path.join(__dirname, '../giftlink-frontend/build')));
// Then serve public/static for home.html assets (e.g. /static/home.css)
app.use('/static', express.static(path.join(__dirname, '../giftlink-frontend/public/static')));
// Serve public images (e.g. for home page background)
app.use('/images', express.static(path.join(__dirname, '../giftlink-frontend/public/images')));

// Route files
// Gift API Task 1: import the giftRoutes and store in a constant called giftroutes
const giftRoutes = require('./routes/giftRoutes'); //{{insert code here}}

// Search API Task 1: import the searchRoutes and store in a constant called searchRoutes
const searchRoutes = require('./routes/searchRoutes'); //{{insert code here}}

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
// Gift API Task 2: add the giftRoutes to the server by using the app.use() method.
app.use('/gifts', giftRoutes); //{{insert code here}}

// Search API Task 2: add the searchRoutes to the server by using the app.use() method.
app.use('/search', searchRoutes); //{{insert code here}}
app.use('/api/auth', authRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../giftlink-frontend/public/home.html'));
});
app.get("/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, '../giftlink-frontend/public/home.html'));
});

// Serve React app for /app and other React Router routes
// Only serve the built React app; without build, show instructions
const buildDir = path.join(__dirname, '../giftlink-frontend/build');
const buildIndexPath = path.join(buildDir, 'index.html');
const noBuildHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>GiftLink - Setup</title></head>
<body style="font-family:sans-serif;max-width:600px;margin:3rem auto;padding:1rem;">
  <h1>GiftLink app</h1>
  <p>The React app has not been built yet, so this page cannot load.</p>
  <p><strong>To fix:</strong> In a terminal, run:</p>
  <pre style="background:#f5f5f5;padding:1rem;border-radius:6px;">cd giftlink-frontend
npm install
npm run build</pre>
  <p>Then restart the backend server and open <a href="/app">/app</a> again.</p>
  <p>Alternatively, run the frontend separately: <code>cd giftlink-frontend && npm start</code>, then open <a href="http://localhost:3000/app" target="_blank">http://localhost:3000/app</a>.</p>
</body></html>`;

const serveReactApp = (req, res) => {
    if (fs.existsSync(buildIndexPath)) {
        res.sendFile(buildIndexPath);
    } else {
        res.type('html').send(noBuildHtml);
    }
};

app.get("/app", serveReactApp);
// Catch-all handler for React Router (must be after API routes and root route)
app.get('*', (req, res, next) => {
    // Don't serve React app for API routes, root route, or home.html
    if (req.path === '/' || req.path === '/home.html' || req.path.startsWith('/gifts') || req.path.startsWith('/search')) {
        return next();
    }
    // Serve React app for all other routes
    serveReactApp(req, res);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
