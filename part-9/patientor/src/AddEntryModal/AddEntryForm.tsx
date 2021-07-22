//* External modules need for functionally
import React from 'react';
import { Field, Formik, Form } from 'formik';
//* State handling have been divided out in the ../state
import { useStateValue } from '../state';

//* Components to hydrate the form
import {
  TextField,
  DiagnosisSelection,
  EntryFields,
  EntryTypeSelection,
} from './FormField';

//! TypeScript types + typeChecking utilities!
import { addEntryFormField, EntryType, healthCheckRating } from '../types';
import { validateDate } from '../utils';

//* External module for styling
import { Grid, Button } from 'semantic-ui-react';

//* Props to ensure consistent casting of types in the form
interface Props {
  onSubmit: (values: addEntryFormField) => void;
  onCancel: () => void;
}

//* Formic form component
export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnosis }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: EntryType.HealthCheck,
        description: '',
        date: '',
        specialist: '',
        diagnosisCodes: [],
        healthCheckRating: healthCheckRating.Healthy,
        dischargeDate: '',
        dischargeCriteria: '',
        employerName: '',
        sickLeaveStartDate: '',
        sickLeaveEndDate: '',
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const invalidError = 'Data in field is invalid';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!validateDate(values.date)) {
          errors.date = invalidError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (
          values.type === EntryType.HealthCheck &&
          !values.healthCheckRating
        ) {
          errors.healthCheckRating = requiredError;
        }

        if (values.type === EntryType.Hospital) {
          if (!values.dischargeDate) {
            errors.dischargeDate = requiredError;
          }
          if (!validateDate(values.dischargeDate)) {
            errors.dischargeDate = invalidError;
          }

          if (!values.dischargeCriteria) {
            errors.dischargeCriteria = requiredError;
          }
        }

        if (values.type === EntryType.OccupationalHealthcare) {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (!values.sickLeaveStartDate) {
            errors.sickLeaveStartDate = requiredError;
          }
          if (validateDate(values.sickLeaveStartDate)) {
            errors.sickLeaveStartDate = invalidError;
          }
          if (!values.sickLeaveEndDate) {
            errors.sickLeaveEndDate = requiredError;
          }
          if (validateDate(values.sickLeaveEndDate)) {
            errors.sickLeaveEndDate = invalidError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className='form ui'>
            <EntryTypeSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              entryTypes={Object.values(EntryType)}
            />
            <Field
              label='Description'
              placeholder='Description'
              name='description'
              component={TextField}
            />
            <Field
              label='Specialist'
              placeholder='Specialist'
              name='specialist'
              component={TextField}
            />
            <Field
              label='Date'
              placeholder='YYYY-MM-DD'
              name='date'
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnosis)}
            />
            <EntryFields type={values.type} />
            <Grid>
              <Grid.Column floated='left' width={5}>
                <Button type='button' onClick={onCancel} color='red'>
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <Button
                  type='submit'
                  floated='right'
                  color='green'
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
