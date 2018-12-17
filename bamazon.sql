DROP DATABASE IF EXISTS bamazon_db;


CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INTEGER(30) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100) NULL,
department_name VARCHAR(50) NULL,
price DECIMAL(10, 2) NULL,
stock_quantity INTEGER(10) NULL,
PRIMARY KEY(item_id)
);


INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Skateboard', 'sports', 50.00, 10),
('Volleyball', 'sports', 10.00, 40),
('Bike_Helmet', 'sports', 15.00, 8),
('Tent', 'sports', 100.00, 5),

('Crock_Pot', 'housewares', 40.00, 10),
('Wine_Glasses', 'housewares', 10.00, 20),
('Knife', 'housewares', 9.99, 15),
('Towel', 'housewares', 7.99, 50),

('Fight_Club', 'books', 9.99, 500),
('NIV_Bible', 'books', 19.99, 500),
('Slaughterhouse_Five', 'books', 14.99, 200),
('A_Confederacy_Of_Dunces', 'books', 18.99, 100),

('White_T-shirt', 'clothes', 4.99, 100),
('Yellow_Dress', 'clothes', 24.99, 100),
('Brown_Loafers', 'clothes', 79.99, 10),
('Diamond_Earrings', 'clothes', 249.99, 5);


SELECT * FROM bamazon_db.products
