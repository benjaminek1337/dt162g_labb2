const express = require("express");
const router = express.Router();

router.get("/courses", (req, res) => {
    res.send({ "message":"gjort"});
});

module.exports = router;