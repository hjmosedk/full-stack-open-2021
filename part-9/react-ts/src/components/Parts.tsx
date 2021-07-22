import React from 'react';
import { assertNever } from '../utils/utilsFunctions';
import { CoursePart } from '../types';

const Parts: React.FC<{ parts: CoursePart }> = ({ parts }) => {
  switch (parts.type) {
    case 'normal':
      return (
        <div>
          <p>
            <strong>
              {parts.name}: {parts.exerciseCount}
            </strong>
          </p>
          <p>
            <em>{parts.description}</em>
          </p>
        </div>
      );
    case 'groupProject':
      return (
        <div>
          <p>
            <strong>
              {parts.name}: {parts.exerciseCount}
            </strong>
          </p>
          <p>
            <em>Project exercise: {parts.groupProjectCount}</em>
          </p>
        </div>
      );
    case 'submission':
      return (
        <div>
          <p>
            <strong>
              {parts.name}: {parts.exerciseCount}
            </strong>
          </p>
          <p>
            <em>{parts.description}</em>
          </p>
          <p>
            Submit to:{' '}
            <a href={parts.exerciseSubmissionLink}>
              {parts.exerciseSubmissionLink}
            </a>
          </p>
        </div>
      );
    case 'special':
      return (
        <div>
          <p>
            <strong>
              {parts.name}: {parts.exerciseCount}
            </strong>
          </p>
          <p>
            <em>{parts.description}</em>
          </p>
          <p>Required Skills: {parts.requirements.join(', ')}</p>
        </div>
      );
    default:
      return assertNever(parts);
  }
};

export default Parts;
