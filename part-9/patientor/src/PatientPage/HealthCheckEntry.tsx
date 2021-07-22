import React from 'react';
import { HealthCheckEntry as HealthCheck } from '../types';
import { Card, Icon } from 'semantic-ui-react';
import HealthRatingBar from '../components/HealthRatingBar';

const HealthCheckEntry: React.FC<{ entry: HealthCheck }> = ({ entry }) => {
  return (
    <Card.Group>
      <Card fluid color='red' raised>
        <Card.Content>
          <Card.Header>
            {entry.date} <Icon name='doctor' size='large' color='red' />
          </Card.Header>
          <Card.Meta>Prescribed by: {entry.specialist}</Card.Meta>
          <Card.Description>{entry.description}</Card.Description>
          <Card.Content extra>
            <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
          </Card.Content>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default HealthCheckEntry;
