import React from 'react';

const Total = ({ total }: { total: number }) => {
  return (
    <div>
      <p>Number of exercises: {total}</p>
    </div>
  );
};

export default Total;
