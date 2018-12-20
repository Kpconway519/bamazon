const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql');

var productToAdd = 0;
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
    managerInit();
});


function managerInit() {
    inquirer
        .prompt({
            name: "managerscreen",
            type: "rawlist",
            message: "Welcome Bamazon manager, what would you like to do?",
            choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
        }).then(function (answer) {
            console.log(answer.managerscreen)
            switch (answer.managerscreen) {
                case "VIEW PRODUCTS FOR SALE":
                    viewProducts()
                    break
                case "VIEW LOW INVENTORY":
                    viewLowInv()
                    break
                case "ADD TO INVENTORY":
                    addInv()
                    break
                case "ADD NEW PRODUCT":
                    newProd()
                    break
            }
        })
}



function viewProducts() {
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
                message: `\n Welcome Bamazon manager! We are the worldwide juggernaut of online retail! Here is what we have in stock currently \n ${storefrontArr}`
            })
            .then(function (answer) {
                managerInit()
            })
    })
};


function viewLowInv() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        console.log("\n Here is the list of items that are low: \n")
        for (i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_id} || Name: ${res[i].product_name} || Quantity Remaining: ${res[i].stock_quantity}`)
            console.log("\n")
        }
        managerInit()
    })
};


function addInv() {

    /////////////////////////
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
                name: "addInv",
                type: "input",
                message: `\n Welcome Bamazon manager! We are the worldwide juggernaut of online retail! Here is what we have in stock currently \n ${storefrontArr} \n Please enter the ID number for the product you would like to add`
            })
            .then(function (answer) {
                 productToAdd = answer.addInv
            })
    })
};


function newProd() {

};

