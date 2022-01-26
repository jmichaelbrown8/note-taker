const express = require('express');
const path = require('path');
const { readAndAppend, readFromFile, writeToFile } = require('./helpers/fileHelpers');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));  
});

app.get('/api/notes', (req, res) => {
  // this is needed to immediately read from file
  readFromFile('./db/db.json')
    .then(
      (data) => res.json(JSON.parse(data))
    );
});

app.post('/api/notes', (req, res) => {
  const note = { 
    id: uuid(),
    ...req.body 
  };
  readAndAppend( './db/db.json', note );
  res.json( note );
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  readFromFile('./db/db.json')
    .then( data => JSON.parse(data) )
    .then( notesArray => notesArray.filter( note => note.id !== id ) )
    .then( async newNotesArray => {
      await writeToFile('./db/db.json', newNotesArray);
      res.json( newNotesArray );
    } )
    ;
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')) 
});

app.listen(PORT, () => {
    console.log(`note-taker app listening on PORT: ${PORT}`);
});