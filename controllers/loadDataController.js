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
const mealKitsUtils = require("../modules/mealkit-util");
const mealKitsModel = require("../models/mealkitModel");

const toAdd = mealKitsUtils.mealkits;

router.get("/mealkits", (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
        mealKitsModel.countDocuments()
        .then(count => {
            if (count === 0) {
                mealKitsModel.insertMany(toAdd)
                    .then(() => {
                        res.render("load-data/mealkits", {
                            success: "true",
                            layout: "layouts/main"
                        });
                    })
                    .catch(err => {
                        res.render("load-data/mealkits", {
                            success: "error",
                            error: err,
                            layout: "layouts/main"
                        });
                    });
            }
            else {
                res.render("load-data/mealkits", {
                    success: "already loaded",
                    layout: "layouts/main"
                });
            }
        });
    }
    else{
        res.status(403).render("../views/general/error", {
            message: "You are not authorized to add meal kits.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
})

module.exports = router;