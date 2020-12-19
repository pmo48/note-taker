const util = require("util");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
var path = require("path");


const readNotesSync = util.promisify(fs.readFile);
const writeNotesSync = util.promisify(fs.writeFile);

const readNotes = () => {
  return readNotesSync(path.join("./db/db.json"), "utf8").then((notes) => {
    return JSON.parse(notes);
  });
};

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

const destroyNote = (id) => {
  return readNotes().then((oldNotes) => {
    const newNotes = oldNotes.filter((note) => note.id !== id);
    writeNotesSync(path.join("./db/db.json"), JSON.stringify(newNotes));
    return id;
  })
}


module.exports = function(app) {


  app.get("/api/notes", function(req, res) {
    readNotes().then((notes) => {
      res.json(notes);
    });
  });

  app.post("/api/notes", function(req, res) {
     addNote(req.body).then((note) => {
       res.json(note);
     });
  });


  app.delete("/api/notes/:id", function(req, res) {
    destroyNote(req.params.id).then((id) => {
      res.json({
        success: true,
        message: `note ${id} has been destroyed`
      })
    })
  });
};

