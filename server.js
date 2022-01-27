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

app.get( '/api/notes', async ( req, res ) => {
  try {
    // this is needed to immediately read from file
    const data = await readFromFile( './db/db.json' );
    res.json( JSON.parse( data ) );

  } catch ( error ) {
    console.error( error );
    res.status( 500 );
    res.json( { message: "Error retrieving notes", error: error.stack } );
  }

});

app.post( '/api/notes', ( req, res ) => {
  const note = { 
    id: uuid(),
    ...req.body 
  };
  readAndAppend( './db/db.json', note );
  res.json( note );
});

app.delete('/api/notes/:id', async (req, res) => {
  const id = req.params.id;
  const fileData = await readFromFile( './db/db.json' );
  const fileObj = JSON.parse( fileData );
  const notesArray = fileObj.filter( note => note.id !== id );
  const err = writeToFile('./db/db.json', notesArray);

  err ? console.error(err) : console.log(`Deleted id: ${id} from ./db/db.json`);

  res.json( notesArray );

})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')) 
});

app.listen(PORT, () => {
    console.log(`note-taker app listening on PORT: ${PORT}`);
});