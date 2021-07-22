//* External modules need for functionally
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

//* Url to the API, where data is collected
import { apiBaseUrl } from '../constants';

//* State handling have been divided out in the ../state
import { useStateValue, getPatient } from '../state';

//! TypeScript types + typeChecking utilities!
import {
  Patient,
  Entry,
  EntryType,
  addEntryFormField,
  EntryWithoutId,
} from '../types';
import { assertNever, convertInputToEntry } from '../utils';

//* Custom pages, based on React
import HealthCheckEntry from './HealthCheckEntry';
import HospitalEntry from './HospitalEntry';
import OccupationalEntry from './OccupationalEntry';
import AddEntryModal from '../AddEntryModal';

//* External module for styling
import { Container, Header, Icon, Divider, Button } from 'semantic-ui-react';

//! Deep type checking react component - It could arguable be made its own component, but it does not have a lot of logic, so it makes sense to keep it on the main page
const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case EntryType.HealthCheck:
      return <HealthCheckEntry entry={entry} />;
    case EntryType.Hospital:
      return <HospitalEntry entry={entry} />;
    case EntryType.OccupationalHealthcare:
      return <OccupationalEntry entry={entry} />;
    default:
      return assertNever(entry);
  }
};

//* Single Patient Page Component
const PatientPage = () => {
  //* Access the global state, update state
  const [{ patient }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  //* Get id from URL
  const { id } = useParams<{ id: string }>();

  const onSubmit = async (value: addEntryFormField) => {
    const newEntry: EntryWithoutId = convertInputToEntry(value);

    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        newEntry,
      );

      dispatch(getPatient(updatedPatient));
    } catch (error) {
      console.error(error.response?.data || 'Unknown Error');
      setError(error.response?.data?.error || 'Unknown error');
    }

    closeModal();
  };

  useEffect(() => {
    //* Get patient from API - Only when ID is changed.
    const GetOnePatient = async (patientID: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${patientID}`,
        );
        dispatch(getPatient(patient));
      } catch (error) {
        console.error(error);
      }
    };

    //* Works as a cached for the single patient - If the patient in the state is the same as the ID in the URL, the state is used.
    if (!patient || patient.id !== id) {
      void GetOnePatient(id);
    }
  }, [id]);

  if (!patient) {
    return <div>Something went wrong, please try again. </div>;
  }

  return (
    <div>
      <Container>
        <Header as='h2'>
          {patient.name}
          {patient.gender === 'male' && (
            <Icon name='mars' size='small' color='green' />
          )}
          {patient.gender === 'female' && (
            <Icon name='venus' size='small' color='red' />
          )}
          {patient.gender === 'other' && (
            <Icon name='genderless' size='small' color='blue' />
          )}
        </Header>
        <p>
          <strong>SSN:</strong> {patient.ssn}
        </p>
        <p>
          <strong>Occupation:</strong> {patient.occupation}
        </p>
        <Header as='h3'>Entries</Header>
        {patient.entries &&
          patient.entries.map((entry) => (
            <>
              <EntryDetails entry={entry} key={entry.id} />
              <Divider hidden />
            </>
          ))}
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={onSubmit}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>
      </Container>
    </div>
  );
};

export default PatientPage;
