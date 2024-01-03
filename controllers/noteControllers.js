const asyncHalder = require("express-async-handler");
const Note = require("../models/noteModel");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const getAllNotes = asyncHalder(async(req, res) => {
    const {_id} = req.user;
    if(!_id) {
        res.status(500)
        throw new Error("Internal Server Error: couldn't decode the user details.")
    }
    const notes = await Note.find({ owner: _id });
    res.status(200).json({ notes });
})

const getNoteById = asyncHalder(async(req, res) => {
    const noteId = req.params.id;
    const userId = req.user._id;

    if(!userId) {
        res.status(500)
        throw new Error("Internal Server Error: couldn't decode the user details.")
    }

    const note = await Note.findOne({ _id: noteId, owner: userId });

    if (!note) {
        res.status(404).json({ message: "Note not found for the authenticated user" });
        return;
    }

    res.status(200).json({ note });
})

const createNote = asyncHalder(async(req, res) => {
    const userId = req.user._id;
    const {title, content} = req.body;

    if(!userId) {
        res.status(500)
        throw new Error("Internal Server Error: couldn't decode the user details.")
    }

    if(!title || !content) {
        res.status(400)
        throw new Error("All fields are mendatory: Title, Content")
    }

    const newNote = new Note({
        title: title,
        content: content,
        owner: userId
    })

    const result = await newNote.save();
    if(result) {
        res.status(200).json({_id: newNote.id, title: newNote.title, content: newNote.content});
    } else {
        res.status(400);
        throw new Error("User data not saved")
    }
})

const updateNoteById = asyncHalder(async(req, res) => {
    const noteId = req.params.id;
    const userId = req.user._id;
    const {title, content} = req.body;

    if(!userId) {
        res.status(500)
        throw new Error("Internal Server Error: couldn't decode the user details.")
    }

    // Find the note by ID and owner (user ID)
    const note = await Note.findOne({
        $and: [
            { _id: noteId },
            { owner: userId }
        ]
    });

    if (!note) {
        res.status(404).json({ message: "Note not found for the authenticated user" });
        return;
    }

    // Update the note with the provided title and/or content
    if (title) {
        note.title = title;
    }
    if (content) {
        note.content = content;
    }

    // Save the updated note
    const result = await note.save();

    if(result) {
        res.status(200).json({ note });
    } else {
        res.status(400);
        throw new Error("Note didn't update.")
    }
})

const deleteNoteById = asyncHalder(async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user._id;

    if(!userId) {
        res.status(500)
        throw new Error("Internal Server Error: couldn't decode the user details.")
    }

    // Find the note by ID and owner (user ID)
    const note = await Note.findOneAndDelete({
        $and: [
            { _id: noteId },
            { owner: userId }
        ]
    });

    if (!note) {
        res.status(404).json({ message: "Note not found for the authenticated user" });
        return;
    }

    res.status(200).json({ message: "Note deleted successfully" });
});

module.exports = {getAllNotes, getNoteById, createNote, updateNoteById, deleteNoteById};