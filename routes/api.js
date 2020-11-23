const express = require("express");
const router = express.Router();

const Courses = require("../models/courses.js");
const MyCourses = require("../models/my-courses.js");
const Subjects = require("../models/subjects.js");

router.get("/files/courses", (req, res) => {
    Courses.find((err, Courses) => {
        if(err){
            return res.send("Error: " + err);
        }
        res.json(Courses);
    } )
});

router.get("/files/my-courses", (req, res) => {
    MyCourses.find((err, MyCourses) => {
        if(err){
            return res.send("Error: " + err);
        }
        res.json(MyCourses);
    });
});

router.get("/courses", (req, res) => {
    try{
        Courses.aggregate([
            {
                "$lookup": {
                    "from": "subjects",
                    "localField": "subjectCode",
                    "foreignField": "subjectCode",
                    "as": "subjects"
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).send("Error: " + err)
            } else if (data.length == 0) {
                return res.status(404).send("Not found: " + name)
            }
            res.json(data);
        });
    } catch(error) {
        res.status(500).send(error);
    }
});

router.get("/courses/:id", (req, res) => {
    const name = req.params.id.toLocaleUpperCase();
    try{
        Courses.aggregate([
            {$match: {courseCode : name}},
            {
                "$lookup": {
                    "from": "subjects",
                    "localField": "subjectCode",
                    "foreignField": "subjectCode",
                    "as": "subjects"
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).send("Error: " + err)
            } else if (data.length == 0) {
                return res.status(404).send("Not found: " + name)
            }
            res.json(data);
        });
    } catch(error) {
        res.status(500).send(error);
    }
});

router.get("/my/courses", (req, res) => {
    try{
        MyCourses.aggregate([
            {
                "$lookup": {
                    "from": "courses",
                    "localField": "courseCode",
                    "foreignField": "courseCode",
                    "as": "courses"
                }
            },
            { "$unwind": "$courses" },
            {
                "$lookup": {
                    "from": "subjects",
                    "localField": "courses.subjectCode",
                    "foreignField": "subjectCode",
                    "as": "subject"
                }
            }
        ]).exec((err, data)=>{
            if (err) {
                return res.status(400).send("Error: " + err)
            }
            res.json(data);
      });
    } catch(error){
        res.status(500).send(error);
    }

});

router.get("/my/courses/:id", (req, res) => {
    const name = req.params.id.toLocaleUpperCase();
    
    try{
        MyCourses.aggregate([
            { $match: {courseCode:name}},
            {
                "$lookup": {
                    "from": "courses",
                    "localField": "courseCode",
                    "foreignField": "courseCode",
                    "as": "courses"
                }
            },
            { "$unwind": "$courses" },
            {
                "$lookup": {
                    "from": "subjects",
                    "localField": "courses.subjectCode",
                    "foreignField": "subjectCode",
                    "as": "subject"
                }
            }
        ]).exec((err, data)=>{
            if (err) {
                return res.status(400).send("Error: " + err)
            } else if (data.length == 0) {
                return res.status(404).send("Not found: " + name)
            }
            res.json(data);
      });

    }
    catch(error){
        res.status(500).send(error);
    }
});

router.get("/subjects", (req, res) => {
    Subjects.find((err, Subjects) => {
        if(err){
            return res.send("Error: " + err);
        }
        res.json(Subjects);
    });
});

router.get("/subjects/:id", (req, res) => {
    const name = req.params.id.toLocaleUpperCase();
    try {
        Subjects.findOne({ subjectCode: name }, (err, subject) => {
            if(err){
                return res.send("Error: " + err);
            } else if(!subject){
                return res.status(404).send("Error, subject not found")
            }
            res.send(subject);
        })
    } catch (error) {
        res.status(500).send("Error: " + error);
    }

});

router.post("/my/courses/add/", (req, res) => {
    const myCourse = new MyCourses();
    try{
        const courseCodeFromBody = req.body.courseCode.toLocaleUpperCase();
        MyCourses.find({courseCode: courseCodeFromBody}, (err, data) => {
            if(err){
                return res.status(500).send("Error: " + err);
            } else if(data.length != 0){
                return res.status(403).send("Error: " + err);
            }
            Courses.find({courseCode: courseCodeFromBody}, (err, data) => {
                if(err){
                    return res.status(500).send("Error: " + err);
                } else if (data.length == 0){
                    return res.status(404).send("Error" + err);
                } else {
                    myCourse.courseCode = courseCodeFromBody;
                    myCourse.completed = req.body.done;
                    myCourse.save((err => {
                        return res.send("Some database error, response: " + err);
                    }));
                    console.log("Adding course: " + courseCodeFromBody);
                }
            });
        
            //res.sendStatus(200);
        });        
    } catch(error){
        res.status(500).send(error);
    }
});

router.put("/my/courses/:id", (req, res) => {
    try{
        const name = req.params.id.toLocaleUpperCase();
        MyCourses.findOneAndUpdate({ courseCode: name }, 
            {$set:{completed: req.body.done}},
            {new: true}, (err, data) => {
            if(err){
                return res.status(500).send("Error: " + err);
            }
            console.log("Updated: " + name);
            res.status(200).send("Updated");
        })

    } catch(error) {
        res.status(500).send(error);
    }
});

router.delete("/my/courses/:id", (req, res) => {
    const id = req.params.id;
    try{
        MyCourses.deleteOne({
            courseCode: id
        }, (err, MyCourses) => {
            if(err){
                return res.status(400).send("Error: " + err);
            }
            res.status(200).send("Raderat kurs: " + id);
            console.log("Removing course: " + id);
        });
    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;