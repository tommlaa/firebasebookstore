import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBookstore from './AddBookstore';
import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    { field: 'author', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    { field: 'title', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchBooks();
  }, [])

  const fetchBooks = () => {
    fetch('https://bookstore-d9534-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
    .then(response => response.json())
    .then(data => setBooks(Object.values(data)))
    .catch(err => console.error(err))
  }

  // Add keys to the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((book, index) => 
    Object.defineProperty(book, 'id', {value: keys[index]}));
    setBooks(valueKeys);
  }

  const addBookstore = (newBook) => {
    fetch('https://bookstore-d9534-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-d9534-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err))
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBookstore addBookstore={addBookstore} />
      <div className="ag-theme-material" style={{ height: 400, width: 1100 }}>
        <AgGridReact 
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;