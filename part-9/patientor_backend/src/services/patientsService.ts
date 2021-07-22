import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';

import { PublicPatient, NewPatient, Patient, EntryWithoutId } from '../types';

const doNotGetSSN = (): PublicPatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patientToAdd: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patientToAdd,
  };
  patientsData.push(newPatient);
  return newPatient;
};

const getOnePatient = (id: string): PublicPatient | undefined => {
  const patient = patientsData.find((patient) => patient.id === id);

  return patient;
};

const addEntry = (
  entry: EntryWithoutId,
  patientID: string,
): Patient | undefined => {
  const updatedPatient = patientsData.find(
    (patient) => patient.id === patientID,
  );

  const newEntry = {
    id: uuid(),
    ...entry,
  };

  if (!updatedPatient) {
    throw new Error('Patient must be created first');
  }

  updatedPatient.entries.push(newEntry);

  return updatedPatient;
};

export default {
  doNotGetSSN,
  addPatient,
  getOnePatient,
  addEntry,
};
