import React from 'react';

const Notification = ({ error }) => {
  const style = {
    backgroundColor: 'red',
    color: 'blue',
    fontWeight: 'bold',
  };

  if (!error) {
    return null;
  }
  return <div style={style}>{error}</div>;
};

export default Notification;
