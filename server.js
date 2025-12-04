const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const SIGNUPS_FILE = path.join(DATA_DIR, 'signups.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'please-change-this-secret';

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(SIGNUPS_FILE)) {
  fs.writeFileSync(SIGNUPS_FILE, JSON.stringify([]), 'utf-8');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

function loadSignups() {
  try {
    const raw = fs.readFileSync(SIGNUPS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read signups file:', err);
    return [];
  }
}

function saveSignups(list) {
  fs.writeFileSync(SIGNUPS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

app.post('/api/signup', (req, res) => {
  const name = (req.body.name || req.body.姓名 || '').trim();
  const note = (req.body.note || req.body.備註 || '').trim();

  if (!name) {
    return res.status(400).json({ ok: false, message: 'Name is required' });
  }

  const list = loadSignups();
  const now = new Date().toISOString();

  const record = {
    id: Date.now().toString() + '-' + Math.random().toString(36).slice(2, 8),
    name,
    note,
    createdAt: now
  };

  list.push(record);
  saveSignups(list);

  return res.json({ ok: true });
});

app.post('/api/login', (req, res) => {
  const password = (req.body.password || '').trim();

  if (!password) {
    return res.status(400).json({ ok: false, message: 'Password is required' });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, message: 'Wrong password' });
  }

  req.session.isAdmin = true;
  return res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

function ensureAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ ok: false, message: 'Unauthorized' });
}

app.get('/api/signups', ensureAdmin, (req, res) => {
  const list = loadSignups();

  list.sort((a, b) => {
    if (a.createdAt < b.createdAt) return -1;
    if (a.createdAt > b.createdAt) return 1;
    return 0;
  });

  res.json({ ok: true, data: list });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
