const express = require("express");
const path = require("path");
    
// Skapa en instans av express
const app = express();
    
// Skapa statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));
    
// Port för anslutning
const port = process.env.PORT || 3000;
    
// Starta servern
app.listen(port, () => {
    console.log("Server running on port " + port);
});