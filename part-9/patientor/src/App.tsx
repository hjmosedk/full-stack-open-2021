//* External modules need for functionally
import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

//* Url to the API, where data is collected
import { apiBaseUrl } from './constants';

//* State handling have been divided out in the ./state
import { useStateValue, setPatientList, getDiagnosis } from './state';

//! TypeScript types !
import { Diagnosis, Patient } from './types';

//* Custom pages, based on React
import PatientListPage from './PatientListPage';
import PatientPage from './PatientPage';

//* External module for styling
import { Button, Divider, Header, Container } from 'semantic-ui-react';

const App = () => {
  //* State function to get update state
  const [, dispatch] = useStateValue();

  //* UseEffect is run once, then when actions is dispatched
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);
    //* Get list of patients from API
    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`,
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    //* Get all diagnosis from API
    const fetchAllDiagnosis = async () => {
      try {
        const { data: ListOfDiagnosisFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnosis`,
        );
        dispatch(getDiagnosis(ListOfDiagnosisFromApi));
      } catch (error) {
        console.error(error);
      }
    };
    void fetchPatientList();
    void fetchAllDiagnosis();
  }, [dispatch]);

  return (
    <div className='App'>
      <Router>
        <Container>
          <Header as='h1'>Patientor</Header>
          <Button as={Link} to='/' primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path='/patients/:id' component={PatientPage} />
            <Route path='/' component={PatientListPage} />
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
