import { Router } from 'express';
import diagnosisService from '../services/diagnosisService';

const router = Router();

router.get('/', (_request, response) => {
  response.send(diagnosisService.getAllDiagnosis());
});

export default router;
