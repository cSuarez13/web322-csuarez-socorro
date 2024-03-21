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
const validationUtil = require("../modules/validation-util");
const userModel = require("../models/userModel");

// Home Page route
router.get("/", (req, res) => {
    res.render("general/home", {
        title: "Home Page",
        allMeals: mealkitUtil.getAllMealKits(),
        includeMainCSS: false
    });
});

// Register Page route
router.get("/sign-up", (req, res) => {
    res.render("general/sign-up", {
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

router.post("/sign-up", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    let validationMessage = {};
    let passedValidation = true;

    if(!validationUtil.notEmpty(firstName)){
        validationMessage.firstName = "Please enter your first name.";
        passedValidation = false;
    }
    if(!validationUtil.notEmpty(lastName)){
        validationMessage.lastName = "Please enter your last name.";
        passedValidation = false;
    }
    if(!validationUtil.notEmpty(email)){
        validationMessage.email = "The email address is required.";
        passedValidation = false;
    }
    else if(!validationUtil.validEmail(email)){
        validationMessage.email = "Please enter a valid email address."
        passedValidation = false;
    }
    if(!validationUtil.notEmpty(password)) {
        validationMessage.password = "Please fill out the password field.";
        passedValidation = false;
    }
    else if(!validationUtil.validPassword(password)) {
        validationMessage.password = "Password must be 8-12 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.";
        passedValidation = false;
    }
    if(!passedValidation) {
        res.render("general/sign-up", {
            title: "Sign up",
            validationMessage,
            values: req.body,
            includeMainCSS: true});
    }
    else{
        const existingUser = userModel.findOne({ email });

        if (existingUser) {
            validationMessage.email = "This email is already registered. Try a different one, or try logging in."
            res.render("general/sign-up", {
                title: "Sign up",
                validationMessage,
                values: req.body,
                includeMainCSS: true});
        }
        else{
            const newUser = new userModel({ firstName, lastName, email, password });

            newUser.save()
            .then(userSaved => {
                console.log(`User ${userSaved.firstName} has been added to the database.`);

            const sgMail = require("@sendgrid/mail");
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

            const msg = {
                to: email,
                from: "clausuarez99@gmail.com",
                subject: "Welcome to Taco 'bout it!!!",
                html: `
                <p>Hello ${firstName} ${lastName},</p>
                <p>I am glad to welcome you to our website TACO 'BOUT IT!!</p>
                <p>Have a great day,</p>
                <p>Claudia Suarez.</p>
                `
            };

            sgMail.send(msg)
                .then(() => {
                    res.render("general/welcome", {
                        title: "WELCOME",
                        values: req.body,
                        includeMainCSS: true});
                })
                .catch(err => {
                    console.log(err);
                    res.render("general/sign-up", {
                        title: "Sign Up",
                        validationMessage,
                        values: req.body,
                        includeMainCSS: true});
                })
            })
            .catch(err => {
                console.log(`Error adding user to the database .. ${err}`)
                validationMessage.password = "Something went wrong...please try again."
                res.render("general/sign-up", {
                    title: "Sign up",
                    validationMessage,
                    values: req.body,
                    includeMainCSS: true});
            })
        }
    }
});

// Login Page route
router.get("/log-in", (req, res) => {
    res.render("general/log-in", {
        title: "Login",
        validationMessage: {},
        values: {
            email: ""
        },
        includeMainCSS: true});
});

router.post("/log-in", (req, res) => {
    const { email, password } = req.body;
    let validationMessage = {};
    let passedValidation = true;

    if(!validationUtil.notEmpty(email)){
        validationMessage.email = "The email address is required.";
        passedValidation = false;
    }
    if(!validationUtil.notEmpty(password)) {
        validationMessage.password = "Please fill out the password field.";
        passedValidation = false;
    }
    if(!passedValidation) {
        res.render("general/log-in", {
            title: "Login",
            validationMessage,
            values: req.body,
            includeMainCSS: true});
    }
    else{
        res.render("general/welcome", {
            title: "Welcome",
            values: {
                firstName: "",
                lastName: "",
            },
            includeMainCSS: true});
    }
});

// Welcome Page route
router.get("/welcome", (req, res) => {
    res.render("general/welcome", {
        title: "Welcome",
        values: {
            firstName: "",
            lastName: "",
        },
        includeMainCSS: true});
});

module.exports = router;