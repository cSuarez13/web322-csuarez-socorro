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
module.exports.prepareView = function (req, res, message) {
    let viewModel = {
        message,
        hasItems: false,
        cartTotal: 0,
        mealkits: []
    };

    if (req.session && req.session.user && req.session.role === "customer") {
        let cart = req.session.cart || [];

        viewModel.hasItems = cart.length > 0;

        let cartTotal = 0;

        cart.forEach(cartMealkit => {
            cartTotal += cartMealkit.mealkit.price * cartMealkit.qty;
        });

        viewModel.cartTotal = cartTotal;
        viewModel.mealkits = cart;
    }

    res.render("general/cart", {
        user: req.session.user,
        layout: "layouts/main",
        viewModel
    });
};