import express, { json } from 'express';

import getBMI from './bmiCalculator';
import exerciseCalculator from './exerciseCalculator';

const app = express();
app.use(json());

app.get('/hello', (_request, response) => {
  response.send('Hello Full Stack!');
});

app.get('/bmi', (request, response) => {
  return response.json(getBMI(request.query));
});

app.post('/exercises', (request, response) => {
  return response.json(exerciseCalculator(request.body));
});

const PORT = 3004;

app.listen(PORT, () => {
  console.log(`App is active on ${PORT}`);
});
