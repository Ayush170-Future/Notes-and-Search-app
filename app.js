require("dotenv").config();

const express = require("express");
const errorHandler = require("./middleware/errorHandler.js");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000; // Use the environment variable or default to 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth/", require("./routes/userRoutes"));
app.use("/api/notes/", require("./routes/noteRoutes"));
app.use("/api/search/", require("./routes/searchRoutes"));
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to Mongoose");
}).catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});