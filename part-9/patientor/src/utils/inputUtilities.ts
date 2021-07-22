/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  addEntryFormField,
  BaseEntryNoId,
  EntryType,
  EntryWithoutId,
} from '../types';

import { assertNever } from './index';

export const convertInputToEntry = (
  entryFormValues: addEntryFormField,
  //@ts-ignore
): EntryWithoutId => {
  const { type, description, date, specialist, diagnosisCodes } =
    entryFormValues;

  const newEntryNoType: BaseEntryNoId = {
    description,
    date,
    specialist,
    diagnosisCodes,
  };

  switch (type) {
    case EntryType.HealthCheck:
      return {
        ...newEntryNoType,
        type,
        healthCheckRating: entryFormValues.healthCheckRating,
      };
    case EntryType.Hospital:
      return {
        ...newEntryNoType,
        type,
        discharge: {
          date: entryFormValues.dischargeDate,
          criteria: entryFormValues.dischargeCriteria,
        },
      };
    case EntryType.OccupationalHealthcare:
      return {
        ...newEntryNoType,
        type,
        employerName: entryFormValues.employerName,
        sickLeave: {
          startDate: entryFormValues.sickLeaveStartDate,
          endDate: entryFormValues.sickLeaveEndDate,
        },
      };
    default:
      assertNever(type);
  }
};
