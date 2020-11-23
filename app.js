const express = require("express");
const path = require("path");
const apiRouter = require("./routes/api.js");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

// Anslut till lokal mongo
mongoose.connect("mongodb://localhost:27017/my-courses", { 
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true 
});
    
// Skapa en instans av express
const app = express();

// Anpassa CORS
app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
    next();
});

// Använd bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
    
// Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

// Använd router
app.use("/api", apiRouter);
    
// Port för anslutning
const port = process.env.PORT || 3000;
    
// Starta servern
app.listen(port, () => {
    console.log("Server running on port " + port);
});
