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

// On The Menu Page route
router.get("/on-the-menu", (req, res) => {
    res.render("mealkits/on-the-menu", {
        title: "Menu",
        mealsByCat: mealkitUtil.getMealKitsByCategory(),
        includeMainCSS: true
    });
});

router.get("/list", (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
        res.render("mealkits/list", {
            user: req.session.user,
            layout: "layouts/main"
        });
    }
    else{
        res.status(401).render("../views/general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
});

module.exports = router;