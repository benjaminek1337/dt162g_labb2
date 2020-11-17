const express = require("express");
const router = express.Router();
const fs = require("fs");
const courses = require("../courses.json");
const myCourses = require("../my-courses.json");
const subjects = require("../subjects.json");

function getSubjectBySubjectCode(code){
    return subjects.subjects.find(s => s.subjectCode == code);
}

function getCourseByCourseCode(code){
    return courses.courses.find(c => c.courseCode == code);
}

function getMyCourseByCourseCode(code){
    return myCourses.myCourses.find(c => c.courseCode == code);
}

router.get("/files/courses", (req, res) => {
    res.send(courses);
});

router.get("/files/my-courses", (req, res) => {
    res.send(myCourses);
});

router.get("/files/subjects", (req, res) => {
    res.send(subjects);
});

router.get("/courses", (req, res) => {
    let output = courses.courses;

    for (let i = 0; i < output.length; i++) {
        const course = output[i];
        let sub = getSubjectBySubjectCode(course.subjectCode);
        if(sub != undefined)
            course.subject = sub.subject;
    }
    res.send(output);
});

router.get("/courses/:id", (req, res) => {
    const name = req.params.id;
    const course = getCourseByCourseCode(name.toLocaleUpperCase());
    if(course != undefined){
        let sub = getSubjectBySubjectCode(course.subjectCode).subject;
        if (sub != undefined)
            course.subject = sub;
        res.send(course);
    } else {
        res.sendStatus(404);
    }
});

router.get("/my/courses", (req, res) => {
    let output = [];
    for (let i = 0; i < myCourses.myCourses.length; i++) {
        const mc = myCourses.myCourses[i];
        let course = getCourseByCourseCode(mc.courseCode);
        let subject = getSubjectBySubjectCode(course.subjectCode);
        course.completed = mc.completed;
        if(subject != undefined)
            course.subject = subject.subject;
        output.push(course);
    }
    res.send(output);
});

router.get("/my/courses/:id", (req, res) => {
    const name = req.params.id;
    
    let course = getCourseByCourseCode(name.toLocaleUpperCase());
    let sub = getSubjectBySubjectCode(course.subjectCode);
    let myCourse = getMyCourseByCourseCode(course.courseCode);
    try{
        if(sub != undefined)
            course.subject = sub.subject;
        course.completed = myCourse.completed;
        res.send(course);
    }
    catch(error){
        res.sendStatus(404)
    }
});

router.get("/subjects", (req, res) => {
    res.send(subjects.subjects);
});

router.get("/subjects/:id", (req, res) => {
    const name = req.params.id;
    res.send(getSubjectBySubjectCode(name.toLocaleUpperCase()));
});

router.post("/my/courses/add/", (req, res) => {
    const filePath = "./my-courses.json";
    let courseCodeFromBody
    if(req.body.courseCode != undefined)
        courseCodeFromBody = req.body.courseCode.toLocaleUpperCase();
    if(getCourseByCourseCode(courseCodeFromBody) != undefined
    && getMyCourseByCourseCode(courseCodeFromBody) == undefined){
        let newCourse = {
            courseCode: courseCodeFromBody,
            completed: req.body.done
        }
        myCourses.myCourses.push(newCourse);
        fs.writeFile(filePath, JSON.stringify(myCourses, null, 2), (error) => {
            if (error) 
                return console.log(error);
            console.log("Writing to " + filePath);
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(403);
    }
});

router.put("/my/courses/:id", (req, res) => {
    const filePath = "./my-courses.json";
    const name = req.params.id;
    const myCourse = getMyCourseByCourseCode(name.toLocaleUpperCase());
    if(myCourse != undefined){
        myCourse.completed = req.body.done;
        fs.writeFile(filePath, JSON.stringify(myCourses, null, 2), (error) => {
            if (error) 
                return console.log(error);
            console.log("Updating on " + filePath);
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(404);
    }
});

router.delete("/my/courses/:id", (req, res) => {
    const filePath = "./my-courses.json";
    const name = req.params.id;
    const myCourse = getMyCourseByCourseCode(name.toLocaleUpperCase());
    if(myCourse != undefined){
        const index = myCourses.myCourses.indexOf(myCourse)
        myCourses.myCourses.splice(index, 1);
        fs.writeFile(filePath, JSON.stringify(myCourses, null, 2), (error) => {
            if (error) 
                return console.log(error);
            console.log("Deleting from " + filePath);
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;