/*************************************************************************************
* WEB322 - 2241 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Claudia Suarez
* Student ID    : 139457220
* Course/Section: WEB322/NEE
*
**************************************************************************************/
const express = require("express");
const router = express.Router();
const mealkitUtil = require("../modules/mealkit-util");

router.get("/", (req, res) => {
    res.render("on-the-menu", {
        title: "Menu",
        mealsByCat: mealkitUtil.getMealKitsByCategory(),
        includeMainCSS: true
    });
});

module.exports = router;