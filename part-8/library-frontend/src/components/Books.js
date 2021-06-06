import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../configurations/queries';

const Books = ({ show }) => {
  const [genreList, setGenreList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(null);

  const booksResult = useQuery(ALL_BOOKS);

  const [getFilteredBooks, result] = useLazyQuery(ALL_BOOKS);

  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const filterBooks = (filter) => {
    if (filter === 'all genres') {
      setCurrentFilter(null);
      getFilteredBooks();
    } else {
      setCurrentFilter(filter);
      getFilteredBooks({ variables: { genre: filter } });
    }
  };

  useEffect(() => {
    if (result.data) {
      setFilteredBooks(result.data.allBooks);
    }
  }, [setFilteredBooks, result]);

  useEffect(() => {
    const genres = bookList.reduce((bookList, book) => {
      return bookList.concat(book.genres);
    }, []);

    const fullGenreList = genres.concat('all genres');
    const uniqueGenres = fullGenreList.filter(onlyUnique);
    setGenreList(uniqueGenres);
  }, [bookList]);

  useEffect(() => {
    if (booksResult.data) {
      const allBooks = booksResult.data.allBooks;
      setBookList(allBooks);
      setFilteredBooks(allBooks);
    }
  }, [booksResult]);

  if (!show) {
    return null;
  }

  if (genreList.loading && booksResult.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Books</h2>
      {!currentFilter && <p>The books is not currently filtered</p>}
      {currentFilter && (
        <p>
          The current filter is: <strong>{currentFilter}</strong>
        </p>
      )}

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
      {genreList.map((genre) => (
        <button key={genre} onClick={() => filterBooks(genre)}>
          {genre}
        </button>
      ))}
    </div>
  );
};

export default Books;
