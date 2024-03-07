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

const path = require("path");
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mealkitUtil = require("./modules/mealkit-util");
const validationUtil = require("./modules/validation-util");

//Set up dotev
const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" });

// Set up express
const app = express();

app.use(express.static(path.join(__dirname, "/assets")));

// Set up EJS
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Set up body-parser
app.use(express.urlencoded({ extended: false }));

// Add your routes here
// e.g. app.get() { ... }
app.get("/", (req, res) => {
    res.render("home", {
        title: "Home Page",
        allMeals: mealkitUtil.getAllMealKits(),
        includeMainCSS: false
    });
});

app.get("/on-the-menu", (req, res) => {
    res.render("on-the-menu", {
        title: "Menu",
        mealsByCat: mealkitUtil.getMealKitsByCategory(),
        includeMainCSS: true
    });
});

app.get("/sign-up", (req, res) => {
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

app.get("/log-in", (req, res) => {
    res.render("log-in", {
        title: "Login",
        validationMessage: {},
        values: {
            email: ""
        },
        includeMainCSS: true});
});

app.get("/welcome", (req, res) => {
    res.render("welcome", {
        title: "Welcome",
        values: {
            firstName: "",
            lastName: "",
        },
        includeMainCSS: true});
});

app.post("/log-in", (req, res) => {
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
        res.render("log-in", {
            title: "Login",
            validationMessage,
            values: req.body,
            includeMainCSS: true});
    }
    else{
        res.render("welcome", {
            title: "Welcome",
            values: {
                firstName: "",
                lastName: "",
            },
            includeMainCSS: true});
    }
});

app.post("/sign-up", (req, res) => {
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
        res.render("sign-up", {
            title: "Sign up",
            validationMessage,
            values: req.body,
            includeMainCSS: true});
    }
    else{
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
                res.render("welcome", {
                    title: "WELCOME",
                    values: req.body,
                    includeMainCSS: true});
            })
            .catch(err => {
                console.log(err);
                res.render("sign-up", {
                    title: "Sign Up",
                    validationMessage,
                    values: req.body,
                    includeMainCSS: true});
            })

    }
});
// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});


// *** DO NOT MODIFY THE LINES BELOW ***

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);