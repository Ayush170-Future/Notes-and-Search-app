const asyncHalder = require("express-async-handler");
const Note = require("../models/noteModel");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const getMatchingNotes = asyncHalder(async (req, res) => {
    const userId = req.user._id;
    const query = req.query.q;
    if (!userId) {
        res.status(500);
        throw new Error("Internal Server Error: couldn't decode the user details.");
    }

    let matchingNotes;
    if (!query || query.trim() === '') {
        // If the query is empty, return all notes for the user
        matchingNotes = await Note.find({ owner: userId });
    } else {
        // If a query is provided, perform the search based on the query string
        matchingNotes = await Note.find({
            $and: [
                { owner: userId },
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } }, // Case-insensitive match in title
                        { content: { $regex: query, $options: 'i' } }, // Case-insensitive match in content
                    ],
                },
            ],
        });
    }

    res.status(200).json({ matchingNotes });
});


module.exports = {getMatchingNotes};