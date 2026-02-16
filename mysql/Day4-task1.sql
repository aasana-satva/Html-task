create database SalesDB

use salesDB

--create Customers
CREATE TABLE Customers
(
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE,
    City VARCHAR(100) NOT NULL,
    Address VARCHAR(200)
);

--create Products
CREATE TABLE Products
(
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(150) NOT NULL,
    Price DECIMAL(10,2) CHECK (Price >= 0),
    Stock INT DEFAULT 0
);

--create Order
CREATE TABLE Orders
(
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT CHECK (Quantity > 0),
    TotalAmount DECIMAL(10,2),
    OrderDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Order_Customer
    FOREIGN KEY(CustomerID) REFERENCES Customers(CustomerID)
    ON DELETE CASCADE,

    CONSTRAINT FK_Order_Product
    FOREIGN KEY(ProductID) REFERENCES Products(ProductID)
);


--create Payments
CREATE TABLE Payments
(
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    PaidAmount DECIMAL(10,2) CHECK (PaidAmount > 0),
    PaymentDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Payment_Order
    FOREIGN KEY(OrderID) REFERENCES Orders(OrderID)
    ON DELETE CASCADE
);

--insert Customer
INSERT INTO Customers(Name,Email,City,Address) VALUES
('Jeshal','jeshal@mail.com','Amreli','Street 1'),
('Jigna','jigna@mail.com','Ahmedabad','Street 2'),
('Rajesh','rajesh@mail.com','Baroda','Street 3');

--insert Products
INSERT INTO Products(ProductName,Price,Stock) VALUES
('Nokia',10000,50),
('Iphone',80000,20),
('Samsung',30000,40);

--insert Orders
INSERT INTO Orders(CustomerID,ProductID,Quantity,TotalAmount)
VALUES
(1,1,1,10000),
(2,2,1,80000),
(3,1,2,20000);

INSERT INTO Orders(CustomerID,ProductID,Quantity,TotalAmount)
VALUES (1,3,1,30000);  -- Jeshal buys Samsung

--insert Payments
INSERT INTO Payments(OrderID,PaidAmount)
VALUES
(1,10000),
(2,40000), 
(2,40000),
(3,20000);

select * from Customers;
select * from Products;
select * from Orders;
select * from Payments;