import './config'; // Load environment variables
import 'express-async-errors'; // Enable default error handling for async errors
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn } from './controllers/UserController';
import {
  shortenUrl,
  getOriginalUrl,
  getLinkForProAdmin,
  deleteLink,
} from './controllers/LinkController';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;
const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'session.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.post('/api/users', registerUser); // Create an account
app.post('/api/login', logIn); // Log in to an account
app.post('/api/shortlink', shortenUrl); // Create a shortened link
app.get('/api/:targetLinkId', getOriginalUrl);
app.post('/api/users/:userId/links', getLinkForProAdmin);
app.delete('/api/users/:userId/links/:linkId', deleteLink);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
