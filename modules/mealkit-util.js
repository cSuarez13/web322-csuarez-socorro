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
module.exports.mealkits = [
    {
        title: "Vegetarian Avocado-Lime Tacos",
        includes: "Beans, tomatoes, pepper, onions, avocado, lime.",
        description: "Beans, diced tomatoes, sautéed bell peppers and onions, avocado slices, lime crema.",
        price: 8.99,
        cookingTime: 25,
        servings: 2,
        imageUrl: "/images/vegetarian.jpg",
        category: "Vegetarian",
        featuredMealKit: true
    },
    {
        title: "Spicy Shrimp Tacos",
        includes: "Shrimps, cabbage, avocado, chipotle.",
        description: "Spicy marinated shrimp, flour tortillas, cabbage slaw, chipotle mayo, avocado slices.",
        price: 11.99,
        cookingTime: 30,
        servings: 2,
        imageUrl: "/images/shrimp.jpg",
        category: "Seafood",
        featuredMealKit: true
    },
    {
        title: "Grilled Beef Street Tacos",
        includes: "Beef, onions, cucumbers, lime, cilantro.",
        description: "Grilled beef strips, corn tortillas, chopped onions, diced cucumbers, lime wedges, cilantro.",
        price: 10.99,
        cookingTime: 45,
        servings: 3,
        imageUrl: "/images/beef.jpg",
        category: "Meat",
        featuredMealKit: true
    },
    {
        title: "Chicken Fajita Tacos",
        includes: "Chicken, pepper, onions, sour cream.",
        description: "Grilled chicken strips, bell peppers, onions, flour tortillas, sour cream, salsa.",
        price: 9.99,
        cookingTime: 30,
        servings: 3,
        imageUrl: "/images/chicken.jpg",
        category: "Meat",
        featuredMealKit: true
    },
    {
        title: "Baja Fish Tacos",
        includes: "Fish, cabbage, lime.",
        description: "Breaded fish fillets, cabbage slaw, lime crema, pico de gallo, flour tortillas.",
        price: 12.99,
        cookingTime: 40,
        servings: 2,
        imageUrl: "/images/fish.jpg",
        category: "Seafood",
        featuredMealKit: true
    },
    {
        title: "Spicy Tofu Tacos",
        includes: "Tofu, slaw, avocado, cilantro, lime.",
        description: "Marinated tofu cubes, spicy slaw, avocado slices, corn tortillas, cilantro lime sauce.",
        price: 8.99,
        cookingTime: 25,
        servings: 3,
        imageUrl: "/images/tofu.jpg",
        category: "Vegetarian",
        featuredMealKit: true
    }
];

module.exports.getAllMealKits = function () {
    return this.mealkits;
};

module.exports.getFeaturedMealKits = function (mealkits = this.mealkits) {
    let filtered = [];

    for (let i = 0; i < mealkits.length; i++) {
        if (mealkits[i].featuredMealKit) {
            filtered.push(mealkits[i]);
        }
    }

    return filtered;
};

module.exports.getMealKitsByCategory = function (mealkitsArr = this.mealkits) {
    if (!mealkitsArr || mealkitsArr.length === 0) {
        return [];
    }

    let categories = [...new Set(mealkitsArr.map(meal => meal.category))];

    let ordered = categories.map(category => {
        const categoryMealKits = mealkitsArr.filter(meal => meal.category === category);

        return {
            categoryName: category,
            mealKits: categoryMealKits
        };
    });

    return ordered;
};
