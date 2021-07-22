import {
  NewPatient,
  Gender,
  PatientObjectFields,
  EntryWithoutId,
  EntryType,
  Diagnosis,
  healthCheckRating,
  noIdBaseEntry,
  Discharge,
  SickLeave,
} from '../types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
}: PatientObjectFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseStringContent(name),
    ssn: parseSSN(ssn),
    occupation: parseOccupation(occupation),
    dateOfBirth: parseDate(dateOfBirth),
    gender: parseGender(gender),
    entries: [],
  };
  return newPatient;
};

const parseStringContent = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name ' + name);
  }
  return name;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }

  return date;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseSSN = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing SSN: ' + ssn);
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }

  return occupation;
};

const parseArray = (diagnosisCodes: unknown): Array<Diagnosis['code']> => {
  if (!diagnosisCodes || !Array.isArray(diagnosisCodes)) {
    throw new Error(
      'DiagnosisCode is not an array or is missing: ' + diagnosisCodes,
    );
  }

  if (
    diagnosisCodes.some((diagnosisCodes) => typeof diagnosisCodes !== 'string')
  ) {
    throw new Error('DiagnosisCode is not strings: ' + diagnosisCodes);
  }

  return diagnosisCodes as Array<Diagnosis['code']>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is healthCheckRating => {
  return Object.values(healthCheckRating).includes(param);
};

const parseHealthCheck = (healthCheckRating: unknown): healthCheckRating => {
  if (!healthCheckRating || !isHealthCheckRating(healthCheckRating)) {
    throw new Error(
      'HealthCheckRating is invalid or missing ' + healthCheckRating,
    );
  }
  return healthCheckRating;
};

const toNewDischarge = ({ date, criteria }: Discharge): Discharge => {
  if (!date || !criteria) {
    throw new Error('Discharge is invalid or missing ' + date + ' ' + criteria);
  }

  return {
    date: parseDate(date),
    criteria: parseStringContent(criteria),
  };
};

const toNewSickLeave = ({ startDate, endDate }: SickLeave): SickLeave => {
  if (!startDate || !endDate) {
    throw new Error(
      'SickLeave is invalid or missing ' + startDate + ' ' + endDate,
    );
  }

  return {
    startDate: parseDate(startDate),
    endDate: parseDate(endDate),
  };
};
const toNewEntry = (entry: EntryWithoutId): EntryWithoutId => {
  const baseEntry: noIdBaseEntry = {
    description: parseStringContent(entry.description),
    date: parseDate(entry.date),
    specialist: parseStringContent(entry.specialist),
  };

  if (entry.diagnosisCodes) {
    baseEntry.diagnosisCodes = parseArray(entry.diagnosisCodes);
  }

  switch (entry.type) {
    case EntryType.HealthCheck:
      const newHealthCheckEntryEntry: EntryWithoutId = {
        type: entry.type,
        ...baseEntry,
        healthCheckRating: parseHealthCheck(entry.healthCheckRating),
      };

      return newHealthCheckEntryEntry;

    case EntryType.Hospital:
      const newHospitalEntry = {
        type: entry.type,
        ...baseEntry,
        discharge: toNewDischarge(entry.discharge),
      };

      return newHospitalEntry;

    case EntryType.OccupationalHealthcare:
      const newOccupationalEntry: EntryWithoutId = {
        type: entry.type,
        ...baseEntry,
        employerName: parseStringContent(entry.employerName),
      };

      if (entry.sickLeave) {
        newOccupationalEntry.sickLeave = toNewSickLeave(entry.sickLeave);
      }

      return newOccupationalEntry;

    default:
      return assertNever(entry);
  }
};

export { toNewPatient, toNewEntry };
