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
    res.render("home", {
        title: "Home Page",
        allMeals: mealkitUtil.getAllMealKits(),
        includeMainCSS: false
    });
});

router.get("/sign-up", (req, res) => {
    res.render("sign-up", {
        title: "Sign Up",
        validationMessage: {},
        values: {
            firstName: "",
            lastName: "",
            email: ""
        },
        includeMainCSS: true
    });
});

router.get("/log-in", (req, res) => {
    res.render("log-in", {
        title: "Login",
        validationMessage: {},
        values: {
            email: ""
        },
        includeMainCSS: true});
});

router.get("/welcome", (req, res) => {
    res.render("welcome", {
        title: "Welcome",
        values: {
            firstName: "",
            lastName: "",
        },
        includeMainCSS: true});
});

module.exports = router;