const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectsSchema = new Schema({
    subjectCode: String,
    subject: String,
    preamble: String,
    bodyText: String,
    language: String
});

module.exports = mongoose.model("Subjects", subjectsSchema);