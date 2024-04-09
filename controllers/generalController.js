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
const bcryptjs = require("bcryptjs");
const mealkitModel = require("../models/mealkitModel");

router.use((req, res, next) => {
    res.locals.role = req.session.role;
    next();
});

// Home Page route
router.get("/", (req, res) => {
    mealkitModel.find()
        .then(data => {
            let mealkits = data.map(value => value.toObject());
            res.render("general/home", {
                title: "Home Page",
                allMeals: mealkitUtil.getFeaturedMealKits(mealkits),
            });
        })
        .catch((err) => {
            res.send("Couldn't get list of mealkits" + err);
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
            values: req.body});
    }
    else{
        userModel.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                validationMessage.email = "This email is already registered. Try a different one, or try logging in.";
                res.render("general/sign-up", {
                    title: "Sign up",
                    validationMessage,
                    values: req.body,
                });
            } else {
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
                            values: req.body});
                    })
                })
                .catch(err => {
                    console.log(`Error adding user to the database .. ${err}`)
                    validationMessage.password = "Something went wrong...please try again."
                    res.render("general/sign-up", {
                        title: "Sign up",
                        validationMessage,
                        values: req.body});
                });
            }
        });
    }
});

// Login Page route
router.get("/log-in", (req, res) => {
    res.render("general/log-in", {
        title: "Login",
        validationMessage: {},
        values: {
            role: "clerk",
            email: ""
        }});
});

router.post("/log-in", (req, res) => {
    const { role, email, password } = req.body;
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
            values: req.body});
    }
    else{
        userModel.findOne({ email })
        .then(user => {
            if(user) {
                bcryptjs.compare(password, user.password)
                .then(matched => {
                    if(matched) {
                        req.session.user = user;
                        req.session.role = role;
                        console.log("User signed in");

                        if(role === "clerk"){
                            res.redirect('/mealkits/list');
                        } else if (role === 'customer') {
                            res.redirect('/cart');
                        }
                    }
                    else{
                        validationMessage.password = "Incorrect password."
                        res.render("general/log-in", {
                            title: "Login",
                            validationMessage,
                            values: req.body});
                    }
                })
            }
            else{
                validationMessage.email = "Invalid email address."
                        res.render("general/log-in", {
                            title: "Login",
                            validationMessage,
                            values: req.body});
            }
        })
        .catch(err => {
            console.log("Unable to query the database: " + err);
        })

        
    }
});

// Welcome Page route
router.get("/welcome", (req, res) => {
    res.render("general/welcome", {
        title: "Welcome",
        values: {
            firstName: "",
            lastName: "",
        }});
});


// Customer route
router.get("/cart", (req, res) => {
    if (req.session.user && req.session.role === "customer") {
        res.render("general/cart", {
            user: req.session.user,
            layout: "layouts/main"
        });
    } else {
        res.status(401).render("general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
});

router.get("/error", (req, res) => {
    res.render('general/error');
});

// LogOut route
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;