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
const mealkitModel = require("../models/mealkitModel");
const path = require("path");
const fs = require("fs");

// On The Menu Page route
router.get("/on-the-menu", (req, res) => {
    mealkitModel.find()
        .then(data => {
            let mealkits = data.map(value => value.toObject());
            res.render("mealkits/on-the-menu", {
                title: "Menu",
                mealsByCat: mealkitUtil.getMealKitsByCategory(mealkits),
            });
        })
        .catch((err) => {
            console.log("Couldn't get list of mealkits" + err);
            res.redirect("/");
        });
});

router.get("/list", (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
        mealkitModel.find()
        .then(data => {
            let mealkits = data.map(value => value.toObject());

            const sortedMeals = mealkits.sort((a, b) => {
                return a.title.localeCompare(b.title);
              });

            res.render("mealkits/list", {
                user: req.session.user,
                meals: sortedMeals,
                layout: "layouts/main"
            });
        })
        .catch((err) => {
            console.log("Couldn't get list of mealkits" + err);
            res.redirect("/");
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

router.get('/remove/:id', (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
    const mealKitId = req.params.id;
    mealkitModel.findById(mealKitId)
    .then(data => {
        let mealkit = data.toObject();

        res.render("../views/mealkits/confirmation", {
            user: req.session.user,
            ID: mealKitId,
            title: mealkit.title,
            layout: "layouts/main"
        });
    })
    .catch((err) => {
        console.log("Couldn't find mealkit" + err);
        res.redirect("/");
    });
    } else{
        res.status(401).render("../views/general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
});

router.post('/remove/:id', async (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
    const mealKitId = req.params.id;
    try {
        // Fetch the document from the database to get the imageUrl
        const mealKit = await mealkitModel.findById(mealKitId);
        if (!mealKit) {
            return res.status(404).send("Meal kit not found");
        }

        await mealkitModel.deleteOne({ _id: mealKitId });

        // Delete the associated image file
        const imagePath = `assets/${mealKit.imageUrl}`; 
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("Deleted image file for meal kit: " + mealKitId);
        } else {
            console.log("Image file not found for meal kit: " + mealKitId);
        }

        console.log("Deleted the document for: " + mealKitId);
        res.redirect("/mealkits/list");
    } catch (err) {
        console.log("Couldn't delete the document for: " + mealKitId + "\n" + err);
        res.redirect("/");
    }
    }else{
        res.status(401).render("../views/general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
  });
  
  router.get('/edit/:id', (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
    const mealKitId = req.params.id;
    mealkitModel.findById(mealKitId)
    .then(data => {
        let mealkit = data.toObject();;

        res.render("mealkits/inputData", {
            user: req.session.user,
            ID: mealKitId,
            values: {
                title: mealkit.title,
                includes: mealkit.includes,
                description: mealkit.description,
                category: mealkit.category,
                price: mealkit.price,
                time: mealkit.cookingTime,
                servings: mealkit.servings,
                imageUrl: mealkit.imageUrl,
                feature: mealkit.featuredMealKit,
                button: "Update",
            },
        });
    })
    .catch((err) => {
        console.log("Couldn't find mealkit" + err);
        res.redirect("/");
    });
    }else{
        res.status(401).render("../views/general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
});

router.post('/edit/:id', (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
    const mealKitId = req.params.id;
    values = req.body;
    let { title, includes, description, category, price, time, servings, feature } = req.body;
    let imageURL;
    const picFile = (req.files) ? req.files.image : null;

    if (picFile) {
        const uniqueName = `im-${title}${path.parse(picFile.name).ext}`;
        picFile.mv(`assets/images/${uniqueName}`)
            .then(() => {
                imageURL = `/images/${uniqueName}`
                const updatedMeal = {
                    title, includes, description, category, price, time, servings, imageUrl: imageURL, feature
                };
    
                mealkitModel.findOneAndUpdate({ _id: mealKitId }, updatedMeal)
                    .then(() => {
                        console.log("Updated meal document for: " + title);
                        res.redirect("/mealkits/list");
                    })
                    .catch(err => {
                        console.log("Couldn't update meal document for: " + title + "\n" + err);
                        res.redirect("/");
                    });
            })
            .catch (err => {
                console.log("Couldn't move image for " + title + "\n" + err);
                res.redirect("/")
            });
    }
    else {
        imageURL = values.imageUrl;
        const updatedMeal = {
            title, includes, description, category, price, time, servings, imageUrl: imageURL, feature
        };

        mealkitModel.findOneAndUpdate({ _id: mealKitId }, updatedMeal)
            .then(() => {
                console.log("Updated meal document for: " + title);
                res.redirect("/mealkits/list");
            })
            .catch(err => {
                console.log("Couldn't update meal document for: " + title + "\n" + err);
                res.redirect("/");
            });
    }
}else{
    res.status(401).render("../views/general/error", {
        message: "You are not authorized to view this page.",
        user: req.session.user,
        role: req.session.role,
        layout: "layouts/main"
    });
}
  });

  router.get('/add', (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
    res.render("mealkits/inputData", {
        user: req.session.user,
        values: {
            title: "",
            includes: "",
            description: "",
            category: "",
            price: "",
            time: "",
            servings: "",
            imagesUrl: "",
            feature: false,
            button: "Add",
        },
    });
}else{
    res.status(401).render("../views/general/error", {
        message: "You are not authorized to view this page.",
        user: req.session.user,
        role: req.session.role,
        layout: "layouts/main"
    });
}
  });
  
  router.post('/add', (req, res) => {
    if(req.session.user && req.session.role === "clerk"){
    let values = req.body;
    let { title, includes, description, category, price, time, servings, feature } = req.body;

    const picFile = req.files.image;
    const uniqueName = `im-${title}${path.parse(picFile.name).ext}`;
    picFile.mv(`assets/images/${uniqueName}`)
            .then(() => {
                const imageURL = `/images/${uniqueName}`

                const newMeal = new mealkitModel ({ title, includes, description, category, price, time, servings, imageUrl: imageURL, feature });

                newMeal.save()
                    .then(() => {
                        console.log("Created a meal document for: " + title);
                        res.redirect("/mealkits/list");
                    })
                    .catch(err => {
                        console.log("Couldn't create a meal document for: " + title + "\n" + err);
                        res.redirect("/");
                    });
                })
            .catch (err => {
                console.log("Couldn't move image for " + title + "\n" + err);
                res.render("mealkits/inputData", {
                    user: req.session.user,
                    validationMessage: {},
                    values: values,
                    includeMainCSS: true
                });
            });
        }else{
            res.status(401).render("../views/general/error", {
                message: "You are not authorized to view this page.",
                user: req.session.user,
                role: req.session.role,
                layout: "layouts/main"
            });
        }
    });

module.exports = router;