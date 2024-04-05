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

// Create a Schema 
const mealKitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    includes: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No description available.",
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    cookingTime: {
        type: Number,
        default: 30,
    },
    servings: {
        type: Number,
        default: 1,
    },
    imageUrl: {
        type: String,
        required: true
    },
    featuredMealKit: {
        type: Boolean,
        default: false
    }
});

const mealKitModel = mongoose.model('MealKits', mealKitSchema);

module.exports = mealKitModel;