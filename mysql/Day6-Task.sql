CREATE DATABASE EmployeeDB

USE EmployeeDB

--CREATE TABLES 
-- CUSTOMERS
CREATE TABLE Customers (
    Customer_id INT IDENTITY PRIMARY KEY,
    First_name NVARCHAR(50),
    Last_name NVARCHAR(50),
    Email NVARCHAR(100) UNIQUE,
    Phone NVARCHAR(20),
    Address NVARCHAR(200),
    City NVARCHAR(50),
    State_province NVARCHAR(50),
    Country NVARCHAR(50),
    Postal_code NVARCHAR(15),
    Date_of_birth DATE,
    Gender CHAR(1)
);

-- DEPARTMENTS
CREATE TABLE Departments (
    Department_id INT IDENTITY PRIMARY KEY,
    Department_name NVARCHAR(100)
);

-- EMPLOYEES
CREATE TABLE Employees (
    Employee_id INT IDENTITY PRIMARY KEY,
    First_name NVARCHAR(50),
    Last_name NVARCHAR(50),
    Department_id INT FOREIGN KEY REFERENCES Departments(Department_id),
    Salary DECIMAL(10,2)
);

-- PRODUCTS
CREATE TABLE Products (
    Product_id INT IDENTITY PRIMARY KEY,
    Product_name NVARCHAR(100),
    Category_name NVARCHAR(100),
    Unit_price DECIMAL(10,2),
    Featured BIT DEFAULT 0
);

-- PROMOTIONS
CREATE TABLE Promotions (
    Promotion_id INT IDENTITY PRIMARY KEY,
    Product_id INT FOREIGN KEY REFERENCES Products(Product_id),
    Promotion_name NVARCHAR(100),
    Start_date DATE,
    End_date DATE,
    DiscountAmount DECIMAL(5,2),
    Active BIT
);

-- ORDERS
CREATE TABLE Orders (
    Order_id INT IDENTITY PRIMARY KEY,
    Promotion_id INT NULL FOREIGN KEY REFERENCES Promotions(Promotion_id),
    Product_id INT FOREIGN KEY REFERENCES Products(Product_id),
    Quantity INT,
    Customer_id INT FOREIGN KEY REFERENCES Customers(Customer_id),
    Order_date DATE,
    Price DECIMAL(10,2)
);

-- CATEGORY SUMMARY
CREATE TABLE Category_Summary (
    Category_summary_id INT IDENTITY PRIMARY KEY,
    Category_name NVARCHAR(100),
    Revenue DECIMAL(12,2)
);

--INSERTING THE SAMPLE DATA
INSERT INTO Departments (Department_name) VALUES
('IT'),
('HR'),
('Sales');

INSERT INTO Employees (First_name, Last_name, Department_id, Salary) VALUES
('Asha','Patel',1,50000),
('Ravi','Shah',1,65000),
('Meena','Joshi',1,45000),

('Karan','Singh',2,40000),
('Neha','Mehta',2,55000),

('Vikas','Gupta',3,70000),
('Rohit','Kumar',3,62000);

INSERT INTO Employees Values('Rahul','Kumar',3,62000);

INSERT INTO Customers
(First_name,Last_name,Email,Phone,Address,City,State_province,Country,Postal_code,Date_of_birth,Gender)
VALUES
('Riya','Shah','riya@gmail.com','90001','Addr1','Mumbai','MH','India','400001','1998-01-01','F'),
('Aman','Verma','aman@gmail.com','90002','Addr2','Delhi','DL','India','110001','1996-03-03','M'),
('Pooja','Kapoor','pooja@gmail.com','90003','Addr3','Pune','MH','India','411001','1997-05-05','F'),
('Raj','Malhotra','raj@gmail.com','90004','Addr4','Delhi','DL','India','110002','1995-02-02','M');

INSERT INTO Products (Product_name, Category_name, Unit_price, Featured) VALUES
('Laptop','Electronics',50000,0),
('Mobile','Electronics',30000,0),
('Headphones','Electronics',2000,0),
('Shoes','Fashion',2500,0),
('Watch','Fashion',4500,0),
('Backpack','Fashion',1500,0),
('Chair','Furniture',3500,0);

INSERT INTO Promotions
(Product_id, Promotion_name, Start_date, End_date, DiscountAmount, Active)
VALUES
(1,'Diwali Sale','2023-01-01','2023-02-01',15,0),  -- old (will delete)
(2,'New Year Sale','2023-02-01','2023-03-01',10,0), -- old
(3,'Summer Sale',GETDATE(),DATEADD(DAY,30,GETDATE()),5,1),
(4,'Festive Offer',GETDATE(),DATEADD(DAY,40,GETDATE()),12,1),
(5,'Mega Offer',GETDATE(),DATEADD(DAY,20,GETDATE()),8,1);

INSERT INTO Orders
(Product_id, Quantity, Customer_id, Promotion_id, Order_date, Price)
VALUES
-- Customer 1 (4 orders → top customer)
(1,1,1,3,GETDATE(),50000),
(1,1,1,3,GETDATE(),50000),
(2,2,1,4,GETDATE(),60000),
(3,3,1,NULL,GETDATE(),6000),

-- Customer 2 (3 orders)
(1,1,2,3,GETDATE(),50000),
(2,1,2,NULL,GETDATE(),30000),
(4,2,2,4,GETDATE(),5000),

-- Customer 3 (2 orders)
(1,1,3,NULL,GETDATE(),50000),
(5,1,3,5,GETDATE(),4500),

-- Customer 4 (1 order)
(6,2,4,NULL,GETDATE(),3000);

SELECT * FROM Customers;
SELECT * FROM Departments;
SELECT * FROM Employees;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM Promotions;
SELECT * FROM Category_Summary;