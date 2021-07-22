import React from 'react';
import { HospitalEntry as Hospital } from '../types';
import { Card, Icon } from 'semantic-ui-react';

const HospitalEntry: React.FC<{ entry: Hospital }> = ({ entry }) => {
  return (
    <Card.Group>
      <Card fluid color='green' raised>
        <Card.Content>
          <Card.Header>
            {entry.date} <Icon name='hospital' size='large' color='green' />
          </Card.Header>
          <Card.Meta>Prescribed by: {entry.specialist}</Card.Meta>
          <Card.Description>{entry.description}</Card.Description>
          <Card.Content extra>
            Discharged on: {entry.discharge.date} due to{' '}
            {entry.discharge.criteria}
          </Card.Content>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default HospitalEntry;
