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
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Create a Schema 
const userSchema = new mongoose.Schema({
    "firstName": {
        type: String,
        require: true
    },
    "lastName": {
        type: String,
        require: true
    },
    "email": {
        type: String,
        require: true,
        unique: true},
    "password": {
        type: String,
        require: true
    },
});

userSchema.pre("save", function (next ) {
    let user = this;

    // Generate a unique SALT.
    bcryptjs.genSalt()
        .then(salt => {
            bcryptjs.hash(user.password, salt)
                .then(hashedPwd => {
                    user.password = hashedPwd;
                    next();
                })
                .catch(err => {
                    console.log(`Error occurred when hashing ... ${err}`);
                });
        })
        .catch(err => {
            console.log(`Error occurred when salting ... ${err}`);
        });
});

// Create a model
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
