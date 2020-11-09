const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


router.get("/", (req, res) => {
    let rawCourses = fs.readFileSync(path.resolve(__dirname + "/../my-courses.json"));
    let courses = JSON.parse(rawCourses);
    res.send(courses);
});

module.exports = router;