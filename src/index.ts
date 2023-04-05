import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors

import express, { Express } from 'express';

import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn } from './controllers/UserController';
import { shortenUrl, visitLink, getLinks, removeLink } from './controllers/LinkController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(express.static('public', { extensions: ['html'] }));

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/users', registerUser); // Create an account
app.post('/login', logIn); // Log in to an account

app.post('/links', shortenUrl);
app.get('/:targetLinkId', visitLink);
app.get('/users/:targetUserId/links', getLinks);
app.delete('/users/:targetUserId/links/:targetLinkId', removeLink);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
