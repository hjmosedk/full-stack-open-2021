import React from 'react';
import { Container, Table } from 'react-bootstrap';

import UpdateAuthor from './UpdateAuthor';

const Authors = ({ authors, show, setError }) => {
  if (!show) {
    return null;
  }

  return (
    <Container>
      <h2>Authors</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <h3>Update the birth year of an author</h3>
      <div>
        <UpdateAuthor authors={authors} setError={setError} />
      </div>
    </Container>
  );
};

export default Authors;
