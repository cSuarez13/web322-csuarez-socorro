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
const cartUtils = require("../modules/cart-util")
const mealkitModel = require("../models/mealkitModel");

// Customer route
router.get("/cart", (req, res) => {
    if (req.session.user && req.session.role === "customer") {
        cartUtils.prepareView(req,res);
    } else {
        res.status(401).render("../views/general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
});

router.get('/add-item/:id', (req, res) => {
    if (req.session.user && req.session.role === "customer") {
        const ID = req.params.id;
        
        mealkitModel.findById(ID)
        .then(data => {
            let mealkit = data.toObject();
            let message;
            let cart = req.session.cart = req.session.cart || [];

            if(mealkit){
                let found = false;

                cart.forEach(cartMealkit => {
                    if (cartMealkit.id == mealkit._id) {
                        found = true;
                        cartMealkit.qty++;
                    }
                });

                if (found) {
                    message = `The meal kit "${mealkit.title}" was already in the cart, added one to quantity.`;
                }
                else {
                    cart.push({
                        id: mealkit._id,
                        qty: 1,
                        mealkit
                    });

                    cart.sort((a, b) => a.mealkit.title.localeCompare(b.mealkit.title));

                    message = `The meal kit "${mealkit.title}" was added to the cart.`;
                }
            }

            cartUtils.prepareView(req, res, message);
        }) 
        .catch((err) => {
            console.log("Couldn't find mealkit" + err);
            res.redirect("/");
        });

    } else {
        res.status(401).render("../views/general/error", {
            message: "You are not authorized to view this page.",
            user: req.session.user,
            role: req.session.role,
            layout: "layouts/main"
        });
    }
})

router.post('/update-qty/:id', (req, res) => {
    const mealId = req.params.id;
    const newQty = parseInt(req.body.qty);

    if (req.session.cart && req.session.cart.length > 0) {
        const mealIndex = req.session.cart.findIndex(item => item.id === mealId);

        if (mealIndex !== -1) {
            req.session.cart[mealIndex].qty = newQty;
            cartUtils.prepareView(req, res, 'Quantity updated successfully');
        } else {
            cartUtils.prepareView(req, res, 'Meal not found in cart');
        }
    } 
});

router.post('/place-order', (req, res) => {
    cart = req.session.cart;
    user = req.session.user;

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    let cartDetails = '';
    let cartSubtotal = 0;
    cart.forEach(item => {
        cartDetails += `
            <p>Meal Kit: ${item.mealkit.title}</p>
            <p>Includes: ${item.mealkit.includes}</p>
            <p>Price: ${item.mealkit.price}</p>
            <p>Quantity: ${item.qty}</p>
            <p>Total: ${item.mealkit.price * item.qty}</p>
            <hr>
        `;
        cartSubtotal += item.mealkit.price * item.qty;
    });
    cartSubtotal = parseFloat(cartSubtotal.toFixed(2)); 
        let taxes = parseFloat((cartSubtotal * 0.10).toFixed(2)); 
        let total = parseFloat((cartSubtotal + taxes).toFixed(2));
    const msg = {
        to: user.email,
        from: "clausuarez99@gmail.com",
        subject: "Your Order Confirmation",
        html: `
        <p>Customer: ${user.firstName} ${user.lastName}</p>
        <p>Order Details:</p>
        <hr>
        ${cartDetails}
        <p>Subtotal: ${cartSubtotal}</p>
        <p>Taxes: ${taxes}</p>
        <p>Total: ${total}</p>
        <hr>
        <p>Thank you for your order!</p>
        `
    };

    sgMail.send(msg)
        .then(() => {
            console.log("Email send.")
            req.session.cart = [];
            cartUtils.prepareView(req,res, "Order placed successfully");
        })
        .catch(err => {
            console.log(err);
            res.render("../views/general/error", {
                message: "An error occurred while processing your order.",
                user: req.session.user,
                role: req.session.role,
                layout: "layouts/main"
            });
        })
})

router.get('/remove/:id', (req, res) => {
    const mealId = req.params.id;

    if (req.session.cart && req.session.cart.length > 0) {
        const mealIndex = req.session.cart.findIndex(item => item.id === mealId);
        let cart = req.session.cart || [];
        if (mealIndex !== -1) {
            let message = `Removed "${cart[mealIndex].mealkit.title}" from the cart.`
            cart.splice(mealIndex, 1);
            cartUtils.prepareView(req, res, message);
        } else {
            cartUtils.prepareView(req, res, 'Meal not found in cart');
        }
    } 
});

module.exports = router;