import React from 'react';
import { OccupationalHealthcareEntry as OccupationalCheck } from '../types';
import { Card, Icon } from 'semantic-ui-react';

const OccupationalEntry: React.FC<{ entry: OccupationalCheck }> = ({
  entry,
}) => {
  return (
    <Card.Group>
      <Card fluid color='blue' raised>
        <Card.Content>
          <Card.Header>
            {entry.date} <Icon name='stethoscope' size='large' color='blue' />
          </Card.Header>
          <Card.Meta>Prescribed by: {entry.specialist}</Card.Meta>
          <Card.Description>{entry.description}</Card.Description>
          <Card.Content extra>
            Employer: {entry.employerName} <br />
            {entry.sickLeave && (
              <p>
                <strong>Sick leave</strong> from {entry.sickLeave.startDate} to{' '}
                {entry.sickLeave.endDate}
              </p>
            )}
            {!entry.sickLeave && (
              <p>Sick Leave is not relevant for this patient</p>
            )}
          </Card.Content>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default OccupationalEntry;
