import express, { json } from 'express';
import diagnosisRouter from './router/diagnoseRouter';
import patientsRouter from './router/patientsRouter';

import cors from 'cors';

const app = express();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

app.use(json());

app.get('/api/ping', (_request, response) => {
  response.json({ message: 'Hello World' });
});

app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/patients', patientsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
