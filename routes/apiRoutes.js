// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================
// const util = require("util");
const fs = require("fs");
// const uuidv1 = require("uuidv4");
const { v4: uuidv4 } = require('uuid');
var noteData = require("../db/db");



// const readNotesSync = util.promisify(fs.readFile);
// const writeNotesSync = util.promisify(fs.writeFile);

// const readNotes = () => {
//   return readNotesSync("../db/db.json", "utf8").then((allNotes) => {
//     return allNotes
//   // });
// };

//console.log(noteData);

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  app.get("/api/notes", function(req, res) {
    //get the data
    res.json(noteData);
    //brian's code
    // readNotes.then((data) => {
    //   //send the data
    //   res.json(data);
    // });
  });

  app.post("/api/notes", function(req, res) {
      let noteID = uuidv4();
      let newNote = {
        id: noteID,
        title: req.body.title,
        text: req.body.text
      }
      noteData.push(newNote);
      res.json(noteData);
  });

  app.delete("/api/notes/:id", function(req, res) {
    let deleteId = req.params.id;
    
    const newNotes = noteData.filter(note => note.id !== deleteId);
    
    console.log(newNotes);

    fs.writeFile('db/db.json', JSON.stringify(newNotes, null, 2), err => {
      if (err) throw err;
      res.json(newNotes);
    })
  });
};