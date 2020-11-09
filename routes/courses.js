const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


router.get("/courses", (req, res) => {
    let rawCourses = fs.readFileSync(path.resolve(__dirname + "/../courses.json"));
    let courses = JSON.parse(rawCourses);
    res.send(courses);
});

module.exports = router;