const express = require("express");
const router = express.Router();

// Index route
router.get("/", (req, res) => {
    res.send("Get for Users");
});

// Show route
router.get("/:id", (req, res) => {
    res.send("Get for Users id");
});

// Create user
router.post("/", (req, res) => {
    res.send("Post for Users");
});

// Delete route
router.delete("/:id", (req, res) => {
    res.send("Delete for Users id");
});

module.exports = router;
