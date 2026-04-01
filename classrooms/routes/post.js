const express = require("express");
const router = express.Router();

//Index- route
router.get("/", (req, res) =>{
    res.send("Get for posts");
});

//show routes
router.get("/:id", (req, res) =>{
    res.send("Get for posts id");
});
//Post users
router.post("/", (req, res) =>{
    res.send("post for posts");
});

//delete routes
router.delete("/:id", (req, res) =>{
    res.send("Delete for posts id");
});
module.exports = router;
