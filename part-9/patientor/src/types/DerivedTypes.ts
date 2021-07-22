import {
  Diagnosis,
  Entry,
  EntryType,
  healthCheckRating,
  BaseEntry,
} from './index';

export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export type BaseEntryNoId = Omit<BaseEntry, 'id'>;

export interface addEntryFormField {
  type: EntryType;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  healthCheckRating: healthCheckRating;
  dischargeDate: string;
  dischargeCriteria: string;
  employerName: string;
  sickLeaveStartDate: string;
  sickLeaveEndDate: string;
}
