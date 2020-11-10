const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const rawCourses = fs.readFileSync(path.resolve(__dirname + "/../courses.json"));
let courses = Array.from(JSON.parse(rawCourses).courses);
const rawSubjects = fs.readFileSync(path.resolve(__dirname + "/../subjects.json"));
let subjects = Array.from(JSON.parse(rawSubjects).subjects);
const rawMyCourses = fs.readFileSync(path.resolve(__dirname + "/../my-courses.json"));
let myCourses = Array.from(JSON.parse(rawMyCourses).myCourses);

function getSubject(name){
    return subjects.find(s => s.subjectCode == name)
}

router.get("/courses", (req, res) => {
    let output = courses;

    for (let i = 0; i < output.length; i++) {
        const course = output[i];
        let sub = getSubject(course.subjectCode);
        if(sub != undefined)
            course.subject = sub.subject;
    }
    res.send(output);
});

router.get("/courses/:id", (req, res) => {
    const name = req.params.id;
    course = courses.find(c => c.courseCode == name.toLocaleUpperCase());
    course.subject = getSubject(course.subjectCode).subject;
    res.send(course);
});

router.get("/my/courses", (req, res) => {
    let output = [];
    for (let i = 0; i < myCourses.length; i++) {
        const mc = myCourses[i];
        let filteredcourses = courses.find(co => co.courseCode == mc.courseCode);
        let sub = getSubject(filteredcourses.subjectCode);
        filteredcourses.completed = mc.completed;
        if(sub != undefined)
            filteredcourses.subject = sub.subject;
        output.push(filteredcourses);
    }
    res.send(output);
});

router.get("/my/courses/:id", (req, res) => {
    const name = req.params.id;
    
    let course = courses.find(c => c.courseCode == name.toLocaleUpperCase());
    let sub = getSubject(course.subjectCode);
    let myCourse = myCourses.find(c => c.courseCode == course.courseCode);
    try{
        if(sub != undefined)
            course.subject = sub.subject;
        course.completed = myCourse.completed;
        res.send(course);
    }
    catch(error){
        res.send(error)
    }
});

router.get("/subjects", (req, res) => {
    res.send(subjects);
});

router.get("/subjects/:id", (req, res) => {
    const name = req.params.id;
    res.send(subjects.find(s => s.subjectCode == name.toLocaleUpperCase()));
});

router.post("/my/courses/add/", (req, res) => {
    // if(myCourses.filter(c => c.courseCode == name.toLocaleUpperCase()).length == 0){
    //     console.log("yeah");
    // }
    res.send({"yea":"jjas"});
});

module.exports = router;