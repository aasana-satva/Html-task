create database OnlineApp

use OnlineApp

--create table customer
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    Phone VARCHAR(20)
);

--create table Product
CREATE TABLE Product (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100),
    Price DECIMAL(10,2),
    Description TEXT
);

--create table Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    ProductID INT,
    OrderDate DATETIME,
    Qty INT,
    Rate DECIMAL(10,2),
    TotalAmount DECIMAL(10,2),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

--create table Payment
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    Amount DECIMAL(10,2),
    PaymentDate DATETIME,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);

select * from Customer
select * from Product
select * from Orders
select * from Payment