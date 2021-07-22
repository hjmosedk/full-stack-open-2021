import React from 'react';
import Parts from './Parts';

import { CoursePart } from '../types';

interface Props {
  courseContent: CoursePart[];
}

const Content = ({ courseContent }: Props) => {
  return (
    <div>
      {courseContent.map((course) => (
        <Parts key={course.name} parts={course} />
      ))}
    </div>
  );
};

export default Content;
