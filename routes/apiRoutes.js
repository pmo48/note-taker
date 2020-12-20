//node modules required for api routes
const util = require("util");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
var path = require("path");

//wraps the fs read/write file into a promisfy to assist with async
const readNotesSync = util.promisify(fs.readFile);
const writeNotesSync = util.promisify(fs.writeFile);

//function to read existing notes from db file
const readNotes = () => {
  return readNotesSync(path.join("./db/db.json"), "utf8").then((notes) => {
    return JSON.parse(notes);
  });
};

//function to add notes once saved, give it an ID, push to array, write to the db file and returning new note for logic/html handling
const addNote = (note) => {
  const newNote = note;
  newNote.id = uuidv4();

  return readNotes().then((notes) => {
    const oldNotes = notes;
    oldNotes.push(newNote)
    writeNotesSync(path.join("./db/db.json"), JSON.stringify(oldNotes));
    return newNote;
  });
};

//function read nows, delete note based on ID, push to array, write to the db file and return ID for logic/html handling
const destroyNote = (id) => {
  return readNotes().then((oldNotes) => {
    const newNotes = oldNotes.filter((note) => note.id !== id);
    writeNotesSync(path.join("./db/db.json"), JSON.stringify(newNotes));
    return id;
  })
};

module.exports = function(app) {

  //calls function above to get data, then passes to JSON reponse to display in api/notes to display notes
  app.get("/api/notes", function(req, res) {
    readNotes().then((notes) => {
      res.json(notes);
    });
  });

  //calls function above to post data from body, then passes to JSON reponse to display in api/notes to add a new note
  app.post("/api/notes", function(req, res) {
     addNote(req.body).then((note) => {
       res.json(note);
     });
  });

  //calls function above to get note id, then passes to JSON reponse to display in api/notes to delete notes
  app.delete("/api/notes/:id", function(req, res) {
    destroyNote(req.params.id).then((id) => {
      res.json({ success: true });
    });
  });
};

