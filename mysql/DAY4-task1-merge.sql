--1.Create a user-defined type for bulk insert customers and products
--for customer table -Table-Valued Parameter (TVP) Bulk Insert
IF TYPE_ID('CustomerType') IS NOT NULL                      --prevent error like Type already exists
    DROP TYPE CustomerType;

--create type virtual table structure
CREATE TYPE CustomerType AS TABLE
(
    Name NVARCHAR(100),
    Email NVARCHAR(150),
    City NVARCHAR(100),
    Address NVARCHAR(200)
);

--sp for bulk entries
CREATE OR ALTER PROCEDURE sp_InsertCustomers
    @Customers CustomerType READONLY                                    --mandatory for TVPs.cannot UPDATE/DELETE
AS
BEGIN
    -- Insert bulk data into Customers table, identity will auto-generate CustomerID
    INSERT INTO Customers (Name, Email, City, Address)
    SELECT Name, Email, City, Address
    FROM @Customers;
END;

--declare variable for insert data
DECLARE @NewCustomers CustomerType;

INSERT INTO @NewCustomers (Name, Email, City, Address)
VALUES
('Riya Shah', 'riya@example.com', 'Mumbai', 'Street 1'),
('Amit Kumar', 'amit@example.com', 'Delhi', 'Street 2'),
('Sara Patel', 'sara@example.com', 'Bangalore', 'Street 3');

EXEC sp_InsertCustomers @Customers = @NewCustomers;

--verify
SELECT * FROM Customers
ORDER BY CustomerID DESC;

--for product table
IF TYPE_ID('ProductType') IS NOT NULL
    DROP TYPE ProductType;

--create type for product
CREATE TYPE ProductType AS TABLE
(
    ProductName NVARCHAR(150),
    Price DECIMAL(10,2),
    Stock INT
);

--create procedure
CREATE OR ALTER PROCEDURE sp_InsertProducts
    @Products ProductType READONLY
AS
BEGIN
    INSERT INTO Products (ProductName, Price, Stock)
    SELECT ProductName, Price, Stock
    FROM @Products;
END;

DECLARE @NewProducts ProductType;

INSERT INTO @NewProducts (ProductName, Price, Stock)
VALUES
('Laptop', 55000.00, 10),
('Smartphone', 25000.00, 25),
('Keyboard', 1200.00, 50),
('Mouse', 800.00, 60);

-- Execute stored procedure
EXEC sp_InsertProducts @Products = @NewProducts;

SELECT * FROM Products
ORDER BY ProductID DESC;

--2.Write query which give top 10 customers order by city 
--SELECT TOP 10 * FROM Customers ORDER BY City;
--using create view 
CREATE OR ALTER VIEW vw_TopCustomersByCity
AS
SELECT TOP 10 *
FROM Customers
ORDER BY City;

SELECT * FROM vw_TopCustomersByCity;

--3.Write a query which gives the result using the’ Like.’ keyword.
CREATE OR ALTER VIEW vw_CustomersStartinglike
AS
SELECT *
FROM Customers
WHERE Name LIKE '%j%';

SELECT * FROM vw_CustomersStartinglike;

--4.Write a query using ‘In’ Key world on the City column of the Customer table.
CREATE OR ALTER VIEW vw_CustomersIN
AS
SELECT *
FROM Customers
WHERE City IN ('Baroda', 'Ahmedabad');

SELECT * FROM vw_CustomersIN;

--5.Use the MERGE statement to update existing product details or insert new products into the products table based on incoming data.
DECLARE @NewProducts ProductType;

INSERT INTO @NewProducts (ProductName, Price, Stock)
VALUES
('Laptop', 55000.00, 14),
('Smartphone', 25000.00, 30),
('Keyboard', 1200.00, 40),
('Monitor', 15000.00, 15),
('Mouse', 800.00, 60),
('Watch', 1200,50);


MERGE INTO Products AS T
USING @NewProducts AS S
ON T.ProductName = S.ProductName  -- match by product name
WHEN MATCHED THEN
    UPDATE SET T.Price = S.Price, T.Stock = S.Stock
WHEN NOT MATCHED THEN
    INSERT (ProductName, Price, Stock)
    VALUES (S.ProductName, S.Price, S.Stock);

SELECT * FROM Products;

--6. Use the MERGE statement to update existing customer details or insert new customers into the customers table based on incoming data.
-- Declare table variable
DECLARE @NewCustomers CustomerType;

-- Insert some data
INSERT INTO @NewCustomers (Name, Email, City, Address)
VALUES
('Riya Shah', 'riya@example.com', 'Mumbai', 'Street 1'),
('Amit Kumar', 'amit@example.com', 'Delhi', 'Street 2'),
('Sara Patel', 'sara@example.com', 'Ahmedabad', 'Street 3'),
('Amit Sukla', 'amit12@example.com','Banglore', 'Street 4');

-- Merge into Customers
MERGE Customers AS T
USING @NewCustomers AS S
ON T.Email = S.Email
WHEN MATCHED THEN
    UPDATE SET T.City = S.City, T.Address = S.Address
WHEN NOT MATCHED THEN
    INSERT (Name, Email, City, Address)
    VALUES (S.Name, S.Email, S.City, S.Address);

SELECT * FROM Customers;

--7. Procedure to Insert a new order into the Orders table and retrieve the generated OrderID. Update the order, Add or Update Payment table accordingly. Make sure to consider partial payment.
CREATE OR ALTER PROCEDURE sp_InsertOrder
    @CustID INT,
    @ProdID INT,
    @Qty INT,
    @Paid DECIMAL(10,2)
AS
BEGIN
    -- Variables to store calculated values
    DECLARE @OrderID INT,                                           --create varibale in sp
            @Total DECIMAL(10,2);

    --  Calculate total amount for the order
    SELECT @Total = Price * @Qty
    FROM Products
    WHERE ProductID = @ProdID;

    -- Insert new order
    INSERT INTO Orders (CustomerID, ProductID, Quantity, TotalAmount)
    VALUES (@CustID, @ProdID, @Qty, @Total);

    --  Retrieve the generated OrderID
    SET @OrderID = SCOPE_IDENTITY();        --last generated id in current scope

    --  Insert payment
    INSERT INTO Payments (OrderID, PaidAmount)
    VALUES (@OrderID, @Paid);

    --  Return the newly created OrderID
    SELECT 
        o.OrderID,
        o.CustomerID,
        c.Name AS CustomerName,
        o.ProductID,
        p.ProductName,
        o.Quantity,
        o.TotalAmount,
        pay.PaidAmount,
        o.TotalAmount - pay.PaidAmount AS RemainingAmount
    FROM Orders o
    JOIN Customers c ON o.CustomerID = c.CustomerID
    JOIN Products p ON o.ProductID = p.ProductID
    JOIN Payments pay ON o.OrderID = pay.OrderID
    WHERE o.OrderID = @OrderID;
END;

-- Insert an order 
EXEC sp_InsertOrder @CustID = 2, @ProdID = 2, @Qty = 3, @Paid = 1000;

--8.Implement a stored procedure to delete customers from the Customers table, handling cascading deletes for related orders.
CREATE OR ALTER PROCEDURE sp_DeleteCustomer
    @ID INT
AS
BEGIN
    DELETE FROM Customers
    WHERE CustomerID = @ID;
END;

BEGIN TRANSACTION;
exec sp_DeleteCustomer 5;
ROLLBACK;
--COMMIT;

select * from Customers;
select * from orders;

--ADVANCE QUERIS
--1.Calculate Total Sales Revenue per Product Join the Orders, Payment, and Products tables to calculate the total sales revenue for each product.
--Display the product name along with the total revenue.
--view with joins
CREATE OR ALTER VIEW vw_ProductRevenue
AS
SELECT 
    P.ProductName,
    SUM(Pay.PaidAmount) AS Revenue
FROM Products P
JOIN Orders O ON P.ProductID = O.ProductID
JOIN Payments Pay ON O.OrderID = Pay.OrderID
GROUP BY P.ProductName;

SELECT * FROM vw_ProductRevenue
ORDER BY Revenue DESC;

--2.Identify Customers with High Order Frequency Create a query using CTEs to identify customers who have placed orders more than 5 times in the last six months.
--Display customer information such as name and email along with their order frequency.

--using CTE common table expression create temp table for query 

;WITH CTE AS
(
    SELECT CustomerID, COUNT(*) Order_freq
    FROM Orders
    WHERE OrderDate >= DATEADD(MONTH, -6, GETDATE())
    GROUP BY CustomerID
)
SELECT C.Name, C.Email, Order_freq
FROM Customers C 
JOIN CTE X ON C.CustomerID = X.CustomerID
WHERE X.Order_freq > 2;

--3. @temp variable - small dataset
DECLARE @Temp TABLE
(
    CustomerID INT,
    TotalSpent DECIMAL(10,2),
    OrderCount INT
);

INSERT INTO @Temp
SELECT 
    CustomerID,
    SUM(TotalAmount),
    COUNT(OrderID)
FROM Orders
GROUP BY CustomerID;

SELECT 
    C.Name,
CAST(
    SUM(O.TotalAmount) / NULLIF(COUNT(O.OrderID), 0)     --avoid in compare errors
AS DECIMAL(10,2)) AS AvgValue 
FROM Customers C
JOIN Orders O
    ON C.CustomerID = O.CustomerID
GROUP BY C.Name;

--4. using cte - temporary result set which is used to manipulate the complex sub-queries data

;WITH BestSelling AS
(
    SELECT 
        P.ProductID,
        P.ProductName,
        SUM(O.Quantity) AS QtySold
    FROM Products P
    JOIN Orders O 
        ON P.ProductID = O.ProductID
    GROUP BY P.ProductID, P.ProductName
)
SELECT TOP 10 
    ProductName,
    QtySold
FROM BestSelling
ORDER BY QtySold DESC;