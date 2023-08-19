const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Rout 1 using express router to get all notes of user on url "localhost:3000/api/notes/fetchallnotes" and login require
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    // finding notes for the user id from request user
    const notes = await Notes.find({ user: req.user.id });
    // if no notes found
    if (!notes) {
      return res.status(400).send("Unable to find");
    }
    res.json(notes);
  } catch (error) {
    res.status(401).send({ error: "Something  went wrong" });
  }
});

// Rout 2 using express router to create notes for user on url "localhost:3000/api/notes/addnote" and login require
router.post(
  "/addnote",
  fetchuser,
  // appliyng validation
  [
    body("title", "title can not be blank").notEmpty(),
    body("description", "description can not be blank").notEmpty(),
    body("tag", "tag can not be blank").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //condition that checks if there are any error. which return the error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      // Cretaing new notes with referance with notes modal and schema
      const notes = new Notes({
        user: req.user.id,
        title,
        description,
        tag,
      });
      // creting a note from the note that is saved into DataBase
      const savedNote = await notes.save();
      res.send(savedNote);
    } catch (error) {
      res.status(401).send({ error: "Something  went wrong" });
    }
  }
);

// Rout 3 using express router to Upadate note for user with id of note on url "localhost:3000/api/notes/updatenote" and login require
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Creating Updated Notes
    const updatedNote = {};
    // Change only the object that is present in request body
    if (title) {
      updatedNote.title = title;
    }
    if (description) {
      updatedNote.description = description;
    }
    if (tag) {
      updatedNote.tag = tag;
    }
    // getting the note to be updated from id in URL
    let note = await Notes.findById(req.params.id);
    //  if ther is no note for the id
    if (!note) {
      res.status(404).send("Note Not Found");
    }
    // when we get the note now we authenticate the user by matching the userid from note and from request user id from middleware
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    // Updating the note in Database
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      updatedNote,
      { $set: updatedNote },
      { new: true }
    );
    res.send(note);
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Something  went wrong" });
  }
});

// Rout 4 using express router to delete note for user with id of note on url "localhost:3000/api/notes/deletenote/:id" and login require
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    //  if ther is no note for the id
    if (!note) {
      return res.status(404).send("Note Not Found");
    }
    // when we get the note now we authenticate the user by matching the userid from note and from request user id from middleware
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    // deleting the note in Database
    note = await Notes.findByIdAndDelete(req.params.id);
    res.send({note, Sucess: "this note has been deleted"});
  } catch (error) {
    console.error(error);
    res.status(401).send({ error: "Something  went wrong" });
  }
});

module.exports = router;
