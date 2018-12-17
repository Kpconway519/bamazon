const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql');

let newAmount = 1;
let itemId = 0;
let orderSize = 0;

// database access info
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Iphone7plus",
    database: "bamazon_db"
});

// connect to bamazon server farm
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    bamazonInit();
});

// the home screen for bamazon, the world's greatest online storefront
function bamazonInit() {

    connection.query("SELECT * FROM products", function (err, result) {

        if (err) throw err;
        //this makes the array to display the "storefront" for the client
        var storefrontArr = ["\n"];
        for (i = 0; i < result.length; i++) {
            storefrontArr.push(`ID: ${result[i].item_id} || ${result[i].product_name} || ${result[i].department_name} || $${result[i].price} || In Stock: ${result[i].stock_quantity}`)
            storefrontArr.push("\n")
        }

        inquirer
            .prompt({
                name: "storefront",
                type: "input",
                message: `\n Welcome to Bamazon! The worldwide juggernaut of online retail! What would you like to buy? \n ${storefrontArr}`
            })
            .then(function (answer) {
                //if there is an id, run the itemAmount function, else tell the user there aint none
                //This is a simple way of doing this now. For later, if there is a case where an object gets deleted, I still need to be able to pull the correct id from the list. I can do this by putting all the result.item_id's into an array and then searching through that array for a match, but not right now.
                if (answer.storefront <= result.length) {
                    console.log("that item exists")
                    itemId = answer.storefront;
                    itemAmount()
                }
                else {
                    console.log("THAT PRODUCT DOES NOT EXIST, PLEASE SELECT ANOTHER")
                    bamazonInit();
                }
            });
    }
    )
}

// This function takes in the item Id number from bamazonInit() and asks the user how many they would like
function itemAmount() {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt(
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy? (Please enter a number)"
            }
        )
        .then(function (answer) {
            // Run the number checker function.
            quantityChecker(answer.quantity)
        });
}
// this function checks the database to make sure there is enough stock to cover the order
function quantityChecker(quantity) {
    //query mysql with the item id and check to see if quantity is greater than the amount requested.
    connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: itemId }, function (err, result) {
        if (err) throw err;
        console.log(result[0].stock_quantity)
        if (quantity <= result[0].stock_quantity) {
            newAmount = result[0].stock_quantity - quantity;
            orderSize = quantity
            console.log(newAmount)
            submitOrder(itemId, newAmount);
        } else {
            console.log("We are sorry, there isnt enough inventory to cover an order that size.")
            bamazonInit();
        }
    })
};
//this function submits the order
function submitOrder(id, quantity) {
    console.log("submit order function called successfully")
    //mysql order query
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity
            },
            {
                item_id: id
            }
        ]
        , function (err) { 
            if (err) throw err;
            displayTotal(id)
        })
}

//this function shows the total and completes the order, afterwards, the doOver() is automatically called.
function displayTotal(id) {
    connection.query("SELECT product_name, price, stock_quantity FROM products WHERE ?", 
    {
        item_id: id
    },
    function(err, res) {
        let custTotal = (res[0].price * orderSize);
        console.log(`Your total is $${custTotal} for ${orderSize} ${res[0].product_name}s. \n Your order is on its way! We know where you live already, and another party is paying for you! \n No, this isn't some kind of money laundering scheme, why would you think that???`)
        doOver()
    }
    )
}

function doOver() {
    inquirer
        .prompt({
            name: "doOver",
            type: "rawlist",
            message: "Would you like to log off or continue shopping?",
            choices: ["SHOP", "LOG OFF"]
        })
        .then(function () {
            if (answer.doOver === "SHOP") {
                bamazonInit()
            } else {
                return console.log("Hope you come back soon!")
            }
        })
}
