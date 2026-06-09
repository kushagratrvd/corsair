import { authCallbackHandler } from './routes/auth';
import { connectHandler } from './routes/connect';
import express from 'express';
import cookieParser from 'cookie-parser';
import { listMails } from './routes/mail';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cookieParser());

app.get('/api/connect', connectHandler);
app.get('/api/auth', authCallbackHandler);
app.get('/api/mails', listMails);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
})
