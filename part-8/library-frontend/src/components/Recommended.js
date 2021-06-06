import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { USER, ALL_BOOKS } from '../configurations/queries';

const Recommended = ({ show }) => {
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const userResult = useQuery(USER);

  const [getBooks, result] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (userResult.data && userResult.data.me) {
      setFavoriteGenre(userResult.data.me.favoriteGenre);
      getBooks({ variables: { genre: 'patterns' } });
    }
  }, [userResult.data, getBooks]);

  useEffect(() => {
    if (result.data) {
      setFilteredBooks(result.data.allBooks);
    }
  }, [result]);

  if (!show) {
    return null;
  }

  if (userResult.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Recommendations</h1>
      <p>
        Books in your favorite genre: <strong>{favoriteGenre}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
