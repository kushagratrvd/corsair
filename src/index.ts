import { authCallbackHandler } from './routes/auth';
import { connectHandler } from './routes/connect';
import express from 'express';
import cookieParser from 'cookie-parser';
import { listMails } from './routes/mail';
import { auth } from './auth';
import { toNodeHandler } from 'better-auth/node';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static('public'));
app.use(cookieParser());

app.get('/api/connect', connectHandler);
app.get('/api/auth', authCallbackHandler);
app.get('/api/mails', listMails);

app.use((req, res, next) => {
  if (req.url.startsWith('/api/auth')) {
    return toNodeHandler(auth)(req, res);
  }
  next();
});
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
})
