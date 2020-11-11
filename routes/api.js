const express = require("express");
const router = express.Router();
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
    course = getCourseByCourseCode(name.toLocaleUpperCase());
    if(course != undefined){
        course.subject = getSubjectBySubjectCode(course.subjectCode).subject;
        res.send(course);
    } else {
        res.sendStatus(404);
    }
});

router.get("/my/courses", (req, res) => {
    let output = [];
    for (let i = 0; i < myCourses.myCourses.length; i++) {
        const mc = myCourses.myCourses[i];
        console.log(mc);
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
    
    let newCourse = {
        courseCode: req.body.courseCode,
        completed: req.body.done
    }
    myCourses.myCourses.push(newCourse);
    res.send(newCourse);
});

router.put("/my/courses/:id", (req, res) => {
    const name = req.params.id;
    const mc = getMyCourseByCourseCode(name.toLocaleUpperCase());
    if(mc != undefined){
        mc.completed = req.body.done;
        res.send(mc);
    } else {
        res.sendStatus(404);
    }
});

router.delete("/my/courses/:id", (req, res) => {
    const name = req.params.id;
    const mc = getMyCourseByCourseCode(name.toLocaleUpperCase());
    if(mc != undefined){
        let index = myCourses.myCourses.indexOf(mc)
        delete mc;
        myCourses.myCourses.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;