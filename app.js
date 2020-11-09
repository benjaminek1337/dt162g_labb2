const express = require("express");
const path = require("path");
const coursesRouter = require("./routes/courses")
const fs = require("fs");
    
// Skapa en instans av express
const app = express();
    
// Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

app.use("/courses", coursesRouter);
    
// Port för anslutning
const port = process.env.PORT || 3000;

app.get("/api/test", (req, res) => {
    let rawCourses = fs.readFileSync("./my-courses.json");
    let courses = JSON.parse(rawCourses);
    res.send(courses);
});
    
// Starta servern
app.listen(port, () => {
    console.log("Server running on port " + port);
});