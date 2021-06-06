import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../configurations/queries';

const LoginForm = ({ setError, setToken, show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user', token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  const loginSubmit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setPage('authors');
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={loginSubmit}>
        <div>
          Username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
