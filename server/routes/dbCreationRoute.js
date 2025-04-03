const express = require("express");
const router = express.Router();
const createTables = require("../db/createTables");

// for a programmatic db creation
router.get("/create-tables", createTables);

module.exports = router;
