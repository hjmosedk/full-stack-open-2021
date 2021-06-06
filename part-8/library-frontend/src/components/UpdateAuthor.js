import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Select from 'react-select';
import { EDIT_AUTHOR_BIRTH, ALL_AUTHORS } from '../configurations/queries';

const UpdateAuthor = ({ authors, setError }) => {
  const [name, setName] = useState('');
  const [bornYear, setBornYear] = useState('');

  const [updateBirthday] = useMutation(EDIT_AUTHOR_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  const submit = async (even) => {
    even.preventDefault();
    await updateBirthday({
      variables: { name, setBornTo: parseInt(bornYear) },
    });
    setBornYear('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          Name:
          <Select
            onChange={(option) => {
              setName(option.value);
            }}
            options={authors.map((a) => {
              return {
                value: a.name,
                label: a.name,
              };
            })}
          />
        </div>
        <div>
          Born{' '}
          <input
            value={bornYear}
            onChange={({ target }) => setBornYear(parseInt(target.value))}
          />{' '}
        </div>
        <button type='submit'>Update Author</button>
      </form>
    </div>
  );
};

export default UpdateAuthor;
