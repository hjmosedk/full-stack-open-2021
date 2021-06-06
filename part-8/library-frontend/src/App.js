import React, { useState } from 'react';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';

import { ALL_AUTHORS, BOOK_ADDED, ALL_BOOKS } from './configurations/queries';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Recommended from './components/Recommended';

const App = () => {
  const [page, setPage] = useState('authors');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const client = useApolloClient();

  const authorsResult = useQuery(ALL_AUTHORS);

  const errorMessage = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 10000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage('authors');
  };

  const updateCacheWith = (addedBook) => {
    const isIncluded = (set, object) => {
      set.map((b) => b.id).includes(object.id);
    };

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    if (!isIncluded(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookAdded = subscriptionData.data.bookAdded;
      errorMessage(`Book added to library ${bookAdded.title}`);
      updateCacheWith(bookAdded);
    },
  });

  if (authorsResult.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        {!token && <button onClick={() => setPage('login')}>Login</button>}
        {token && <button onClick={() => setPage('add')}>Add Book</button>}
        {token && (
          <button onClick={() => setPage('recommended')}>Recommend</button>
        )}
        {token && <button onClick={logout}>Logout</button>}
      </div>
      <Notification error={error} />
      <Authors
        show={page === 'authors'}
        authors={authorsResult.data.allAuthors}
        setError={errorMessage}
      />

      <Books show={page === 'books'} />
      {token && (
        <Recommended show={page === 'recommended'} setError={errorMessage} />
      )}
      {!token && (
        <LoginForm
          show={page === 'login'}
          setError={errorMessage}
          setToken={setToken}
          setPage={setPage}
        />
      )}
      <NewBook
        show={page === 'add'}
        setError={errorMessage}
        updateCacheWith={updateCacheWith}
      />
    </div>
  );
};

export default App;
