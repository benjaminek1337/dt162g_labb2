const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const myCoursesSchema = new Schema({
    courseCode: String,
    completed: Boolean
});

module.exports = mongoose.model("My-Courses", myCoursesSchema);