import React from 'react';
import { ErrorMessage, Field, FieldProps, FormikProps } from 'formik';
import { Dropdown, DropdownProps, Form } from 'semantic-ui-react';
import { Diagnosis, EntryType } from '../types';
import { assertNever } from '../utils';

// structure of a single option

export type EntryOption = {
  value: EntryType;
  label: string;
};

// props for select field component
type SelectFieldProps = {
  name: string;
  label: string;
  options: EntryOption[];
};

export const SelectField = ({ name, label, options }: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as='select' name={name} className='ui dropdown'>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

interface TextProps extends FieldProps {
  label: string;
  placeholder: string;
}

export const TextField = ({ field, label, placeholder }: TextProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field placeholder={placeholder} {...field} />
    <div style={{ color: 'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

/*
  for exercises 9.24.-
*/
interface NumberProps extends FieldProps {
  label: string;
  errorMessage?: string;
  min: number;
  max: number;
}

export const NumberField = ({ field, label, min, max }: NumberProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field {...field} type='number' min={min} max={max} />

    <div style={{ color: 'red' }}>
      <ErrorMessage name={field.name} />
    </div>
  </Form.Field>
);

export const DiagnosisSelection = ({
  diagnoses,
  setFieldValue,
  setFieldTouched,
}: {
  diagnoses: Diagnosis[];
  setFieldValue: FormikProps<{ diagnosisCodes: string[] }>['setFieldValue'];
  setFieldTouched: FormikProps<{ diagnosisCodes: string[] }>['setFieldTouched'];
}) => {
  const field = 'diagnosisCodes';
  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => {
    setFieldTouched(field, true);
    setFieldValue(field, data.value);
  };

  const stateOptions = diagnoses.map((diagnosis) => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code,
  }));

  return (
    <Form.Field>
      <label>Diagnoses</label>
      <Dropdown
        fluid
        multiple
        search
        selection
        options={stateOptions}
        onChange={onChange}
      />
      <ErrorMessage name={field} />
    </Form.Field>
  );
};

export const EntryTypeSelection = ({
  entryTypes,
  setFieldValue,
  setFieldTouched,
}: {
  entryTypes: EntryType[];
  setFieldValue: FormikProps<{ type: EntryType }>['setFieldValue'];
  setFieldTouched: FormikProps<{ type: EntryType }>['setFieldTouched'];
}) => {
  const field = 'type';
  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => {
    setFieldTouched(field, true);
    setFieldValue(field, data.value);
  };

  const stateOptions = entryTypes.map((entryType) => ({
    key: entryType,
    text:
      entryType === EntryType.HealthCheck
        ? 'Health Check'
        : entryType === EntryType.OccupationalHealthcare
        ? 'Occupational Healthcare'
        : 'Hospital',
    value: entryType,
  }));

  return (
    <Form.Field>
      <label>Entry Type</label>
      <Dropdown
        fluid
        selection
        options={stateOptions}
        onChange={onChange}
        defaultValue={EntryType.HealthCheck}
      />
      <ErrorMessage name={field} />
    </Form.Field>
  );
};

export const EntryFields: React.FC<{ type: EntryType }> = ({ type }) => {
  switch (type) {
    case EntryType.HealthCheck:
      return (
        <Field
          label='Health Check Rating'
          name='healthCheckRating'
          component={NumberField}
          min={-1}
          max={3}
        />
      );

    case EntryType.Hospital:
      return (
        <>
          <Field
            label='Discharge Date'
            placeholder='YYYY-MM-DD'
            name='dischargeDate'
            component={TextField}
          />
          <Field
            label='Discharge Criteria'
            placeholder='Why did you discharge the patient?'
            name='dischargeCriteria'
            component={TextField}
          />
        </>
      );

    case EntryType.OccupationalHealthcare:
      return (
        <>
          <Field
            label='Employer name'
            placeholder="Employer's name"
            name='employerName'
            component={TextField}
          />
          <Field
            label='Sick Leave Start Date'
            placeholder='YYYY-MM-DD'
            name='sickLeaveStartDate'
            component={TextField}
          />
          <Field
            label='Sick Leave End Date'
            placeholder='YYYY-MM-DD'
            name='sickLeaveEndDate'
            component={TextField}
          />
        </>
      );

    default:
      return assertNever(type);
  }
};
