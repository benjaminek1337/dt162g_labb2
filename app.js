const express = require("express");
const path = require("path");
const apiRouter = require("./routes/api.js");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

// Anslut till Mongo från yttre rymden (Atlas)
mongoose.connect("mongodb+srv://kelsos_admin:qweasd@dt162g.2njbq.mongodb.net/my-courses?retryWrites=true&w=majority", { 
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
