const express = require('express');
const notes = express.Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fileHelpers');
const { v4: uuid } = require('uuid');

notes.get('/', async (req, res) => {
    try {
        // this is needed to immediately read from file
        const data = await readFromFile('./db/db.json');
        res.json(JSON.parse(data));

    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({
            message: "Error retrieving notes",
            error: error.stack
        });
    }

});

notes.post('/', (req, res) => {
    const note = {
        id: uuid(),
        ...req.body
    };
    readAndAppend('./db/db.json', note);
    res.json(note);
});

notes.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const fileData = await readFromFile('./db/db.json');
    const fileObj = JSON.parse(fileData);
    const notesArray = fileObj.filter(note => note.id !== id);
    const err = writeToFile('./db/db.json', notesArray);

    err ? console.error(err) : console.log(`Deleted id: ${id} from ./db/db.json`);

    res.json(notesArray);

});

module.exports = notes;