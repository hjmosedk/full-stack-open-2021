import { Router } from 'express';
import { toNewEntry, toNewPatient } from '../utils/patientTypeGuards';

import patientsService from '../services/patientsService';

const router = Router();

router.get('/', (_request, response) => {
  response.send(patientsService.doNotGetSSN());
});

router.get('/:id', (request, response) => {
  const singlePatient = patientsService.getOnePatient(request.params.id);

  if (singlePatient) {
    response.send(singlePatient);
  } else {
    response.sendStatus(404);
  }
});

router.post('/', (request, response) => {
  try {
    const newPatient = toNewPatient(request.body);
    const addedPatient = patientsService.addPatient(newPatient);
    response.json(addedPatient);
  } catch (error) {
    response.status(400).send((error as Error).message);
  }
});

router.post('/:id/entries', (request, response) => {
  try {
    const newEntry = toNewEntry(request.body);
    const updatedPatient = patientsService.addEntry(
      newEntry,
      request.params.id,
    );
    response.json(updatedPatient);
  } catch (error) {
    response.status(400).send((error as Error).message);
  }
});

export default router;
