/* eslint-disable @typescript-eslint/ban-ts-comment */
//* External modules need for functionally
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

//* Url to the API, where data is collected
import { apiBaseUrl } from '../constants';

//! TypeScript types !
import { Patient } from '../types';
import { PatientFormValues } from '../AddPatientModal/AddPatientForm';

//* State handling have been divided out in the ./state
import { useStateValue, createNewPatient } from '../state';

//* Internal components
import AddPatientModal from '../AddPatientModal';
import HealthRatingBar from '../components/HealthRatingBar';

//* External module for styling
import { Container, Table, Button } from 'semantic-ui-react';

const PatientListPage = () => {
  //* Access the global state, update state
  const [{ patients }, dispatch] = useStateValue();

  //* Modal and error local state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  //* Modal logic
  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  //* Create new patient, via the add patient modal
  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      //* Call to API, sends data
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        values,
      );

      console.log(newPatient);
      //* Update state
      dispatch(createNewPatient(newPatient));
      closeModal();
    } catch (e) {
      //@ts-ignore
      //* This have been ignore, as TS complains about e's type, I cannot be bother to fix it, and it is outside the scope of the course
      console.error(e.response?.data || 'Unknown Error');
      //@ts-ignore
      //* This have been ignore, as TS complains about e's type, I cannot be bother to fix it, and it is outside the scope of the course
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  if (!patients) {
    return <div>Loading ...</div>;
  }

  return (
    <div className='App'>
      <Container textAlign='center'>
        <h3>Patient list</h3>
      </Container>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Gender</Table.HeaderCell>
            <Table.HeaderCell>Occupation</Table.HeaderCell>
            <Table.HeaderCell>Health Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            //@ts-ignore
            //* This have been ignore, as TS complains about e's type, I cannot be bother to fix it, and it is outside the scope of the course
            Object.values(patients).map((patient: Patient) => (
              <Table.Row key={patient.id}>
                <Table.Cell>
                  <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
                </Table.Cell>
                <Table.Cell>{patient.gender}</Table.Cell>
                <Table.Cell>{patient.occupation}</Table.Cell>
                <Table.Cell>
                  <HealthRatingBar showText={false} rating={1} />
                </Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Patient</Button>
    </div>
  );
};

export default PatientListPage;
