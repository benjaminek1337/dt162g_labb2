const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coursesSchema = new Schema({
    courseCode: String,
    subjectCode: String,
    level: String,
    name: String,
    points: Number,
    institutionCode: String
});

module.exports = mongoose.model("Courses", coursesSchema);