CREATE DATABASE ConsumersDB;

USE ConsumersDB;

--Section 1 : Create tables
CREATE TABLE Customers
(
    CustomerID INT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) UNIQUE NOT NULL,
    Address NVARCHAR(200)
);

CREATE TABLE Products
(
    ProductID INT PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) CHECK (Price > 0),
    StockQuantity INT CHECK (StockQuantity >= 0)
);

CREATE TABLE Orders
(
    OrderID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10,2) CHECK (TotalAmount >= 0),

    CONSTRAINT FK_Orders_Customers
        FOREIGN KEY (CustomerID)
        REFERENCES Customers(CustomerID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
 
CREATE TABLE Cart
(
    CartID INT PRIMARY KEY,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT CHECK (Quantity > 0),
    AddedDate DATE NOT NULL,

    CONSTRAINT FK_Cart_Customers
        FOREIGN KEY (CustomerID)
        REFERENCES Customers(CustomerID),

    CONSTRAINT FK_Cart_Products
        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID)
);

--insert data
INSERT INTO Customers (CustomerID, Name, Email, Address)
VALUES
(1, 'John Doe', 'john@example.com', '123 Elm St'),
(2, 'Jane Smith', 'jane@example.com', '456 Oak St'),
(3, 'Alice Brown', 'alice@example.com', '789 Pine St');

INSERT INTO Products (ProductID, ProductName, Price, StockQuantity)
VALUES
(101, 'Laptop', 800, 50),
(102, 'Smartphone', 500, 30),
(103, 'Headphones', 150, 100);

INSERT INTO Orders (OrderID, CustomerID, OrderDate, TotalAmount)
VALUES
(201, 1, '2024-08-01', 1200),
(202, 2, '2024-08-03', 500),
(203, 1, '2024-08-05', 800);

INSERT INTO Cart (CartID, CustomerID, ProductID, Quantity, AddedDate)
VALUES
(301, 1, 101, 2, '2024-07-28'),
(302, 2, 102, 1, '2024-07-29'),
(303, 3, 103, 3, '2024-07-30');

SELECT * FROM Customers;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM Cart ;

--Section 2 Order Grouping Record and Report 
--2. Write an SQL query to group orders by customer and report the total amount spent by each customer.
SELECT
c.CustomerID, c.Name ,SUM(TotalAmount) AS TotalSpent 
FROM Customers c JOIN Orders O 
ON c.CustomerID = o.CustomerID 
GROUP BY c.CustomerID, c.Name ;

--3. Write a query to list the top 5 products based on the highest number of orders.
CREATE TABLE OrderDetails
(
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10,2) NOT NULL CHECK (UnitPrice > 0),

    CONSTRAINT FK_OrderDetails_Orders
        FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID)
        ON DELETE CASCADE,

    CONSTRAINT FK_OrderDetails_Products
        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID)
);

INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
VALUES
-- Order 201
(201, 101, 1, 800),   -- Laptop
(201, 103, 2, 150),   -- Headphones

-- Order 202
(202, 102, 1, 500),   -- Smartphone

-- Order 203
(203, 101, 1, 800),   -- Laptop again
(203, 103, 1, 150);   -- Headphones again

select * from OrderDetails;

SELECT TOP 5 
p.ProductID,
p.ProductName,
COUNT(DISTINCT od.OrderID ) AS OrderCount
FROM OrderDetails od 
JOIN Products p
ON od.ProductID = p.ProductID
GROUP BY
p.ProductID, p.ProductName
ORDER BY 
OrderCount desc;

-- Section 3: Stored Procedure for Insert and Update 
--4.Create a stored procedure to insert a new product or update the
--existing product's details (name, price, stock quantity) if the ProductID already exists.
CREATE OR ALTER PROCEDURE sp_insertorupdateproduct
@ProductID INT,
@ProductName NVARCHAR(100),
@Price DECIMAL (10,2),
@StockQuantity INT
AS
BEGIN
SET NOCOUNT ON;

IF EXISTS (SELECT 1 FROM Products WHERE ProductID = @ProductID)
BEGIN

UPDATE Products
SET
ProductName =@ProductName,
Price=@Price,
StockQuantity=@StockQuantity 
WHERE 
ProductID=@ProductID;

END
ELSE
BEGIN
INSERT INTO Products (ProductID, ProductName, Price, StockQuantity)
        VALUES (@ProductID, @ProductName, @Price, @StockQuantity);
        END
    END;

EXEC sp_insertorupdateproduct 104,'Watch' ,3000,40;

select * from Products;

--5. Write a stored procedure to insert a new order and update the product stock quantity accordingly
/*Gets the product price
Calculates TotalAmount = Price × Quantity
Inserts the row into Orders
Updates Products.StockQuantity
Returns the inserted order as output */

CREATE OR ALTER PROCEDURE sp_createorder
@OrderID INT,
@CustomerID INT,
@OrderDate DATE,
@ProductID INT,
@Quantity INT
AS 
BEGIN
SET NOCOUNT ON;
BEGIN TRANSACTION;

DECLARE @Price DECIMAL(10,2);
DECLARE @TotalAmount DECIMAL(10,2);

--get product price from product table
SELECT @Price= Price
From Products
where
ProductID = @ProductID;

--calculate total 
SET @TotalAmount =@Price * @Quantity;

--insert into order 
INSERT INTO Orders(OrderID, CustomerID, OrderDate, TotalAmount)
VALUES (@OrderID, @CustomerID, @OrderDate, @TotalAmount);

--update stock
UPDATE Products
SET StockQuantity= StockQuantity - @Quantity
where
ProductID =@ProductID;

COMMIT TRANSACTION;

END;

EXEC sp_createorder 204, 1, '2024-08-15', 101, 2;
EXEC sp_createorder 205, 1, '2024-09-15', 104, 3;
EXEC sp_createorder 206, 2, '2024-09-12', 104, 3;
EXEC sp_createorder 207, 3, '2025-09-25', 104, 1;
--EXEC sp_createorder 208, 2, '2025-09-25', 101, 50;


Select * from Orders;

--verify inserted order
SELECT OrderID, CustomerID, OrderDate, TotalAmount
    FROM Orders
    WHERE OrderID = 207; 

SELECT 
      ProductID,
      ProductName,
      StockQuantity
    FROM Products
    WHERE ProductID = 104; -- to see the stock decrease 

select * from Products;

-- Section 4: Stored Procedure with Functions
/* 6. Create a function to calculate the discount based on the order total amount: 
If amount is greater than or equal to 1000 then give 20% discount
If amount is greater than or equal to 500 then give 10% discount
In all other cases give 0% discount */

CREATE FUNCTION fn_CalculateDiscount
( 
@Totalamount DECIMAL(10,2)
)
RETURNS DECIMAL(5,2)
AS 
BEGIN
DECLARE @Discount DECIMAL(5,2);
IF(@TotalAmount >=1000)
set @Discount =0.20;
else if(@Totalamount>=500) 
set @Discount=0.10;
else
set @Discount= 0.00;

return @Discount;

end;

--with order table

select  OrderID,TotalAmount,  dbo.fn_CalculateDiscount(TotalAmount) as discountpercent
from Orders;

--7.Write a stored procedure that uses this function to apply the discount and return the final payable amount for a given OrderID.
CREATE OR ALTER PROCEDURE sp_getfinalamount
@OrderID INT 
AS 
BEGIN
 SET NOCOUNT ON;

 DECLARE @Originalamount DECIMAL(10,2);
 DECLARE @Discountpercent DECIMAL(10,2);
 DECLARE @Discountamount DECIMAL(10,2);
 DECLARE @Finalamount DECIMAL(10,2);

 --Total amount from order
 SELECT @Originalamount = TotalAmount
 FROM Orders
 WHERE 
 OrderID = @OrderID;

 --get discount from function 
 SET @Discountpercent = dbo.fn_CalculateDiscount(@Originalamount);

-- CALCULATE discount
SET @Discountamount =  @Originalamount * @Discountpercent;

--Final payable amount 
SET @Finalamount= @Originalamount - @Discountamount;

Select 
@OrderID as OrderID,
@Originalamount as OriginalAmount ,
CONCAT (@DiscountAmount ,' (' , @Discountpercent *100, '%)') as DiscountApplied,
@Finalamount as FinalAmount;
End;

Exec sp_getfinalamount 205;

-- Section 5: Stored Procedure with Split Column Value and Join Another Table
--8. Create a stored procedure that accepts a comma-separated list of ProductIDs, splits the values, and joins with the Products table to display the product details (name, price, stock quantity).

CREATE OR ALTER PROCEDURE sp_getproductbyids
@ProductIDS NVARCHAR(MAX)
AS
BEGIN
SET NOCOUNT ON;

SELECT 
P.ProductID,
P.ProductName,
P.Price,
P.StockQuantity 
FROM Products P
join string_split(@ProductIDS ,',') S        --built in table-valued function 
on P.ProductID = CAST(S.value as INT);
END;

EXEC sp_getproductbyids '103,102,104,101';

-- Section 6: Stored Procedure with Math Logic 
--9. Write a stored procedure to calculate the following statistics for each product: 
CREATE OR ALTER PROCEDURE sp_productstatistics
as
begin
 set nocount on;
  select 
  p.Productid,
  p.ProductName,
  ISNULL(SUM(od.Quantity),0) as TotalSold,
  ISNULL(SUM(od.Quantity * od.UnitPrice),0) as TotalRevenue,
  CAST(ISNULL(AVG(CAST(od.Quantity AS DECIMAL(10,2))), 0) AS DECIMAL(10,2)) AS AvgOrderQty,
  ISNULL(STDEV(CAST(od.Quantity AS decimal(10,2))),0) as stdevorderqty
 FROM Products p 
 LEFT JOIN OrderDetails od 
 on p.ProductID = od.ProductID
 group by 
 p.ProductID, P.ProductName
 order by
 p.ProductID;

 end;
 
 exec sp_productstatistics;

 --10. Write a stored procedure to find customers who have not placed any orders in the last 6 months.
 CREATE OR ALTER PROCEDURE sp_norecentreoders
 as 
 begin
 SET NOCOUNT ON;

 SELECT 
 C.CustomerID,
 C.Name as CustomerName,
 MAX(O.OrderDate) As LastOrderDate
 From Customers C 
 LEFT JOIN Orders O 
 on C.CustomerID= O.CustomerID
 group by C.CustomerID,
 C.Name
 Having 
 max(O.OrderDate) Is null 
 Or
 max(O.OrderDate) < DATEADD(MONTH ,-6, GETDATE());
 END;

 EXEC sp_norecentreoders;

 /* 11. Write a store procedure Implement a CASE statement within a query to categorize customers based on their total purchase amount into 'Gold', 'Silver', or 'Bronze' tiers
Customers who have placed 3 or more orders and have a total purchase amount greater than 1000 should be categorized as 'Gold'.
Customers who have placed 2 orders and have a total purchase amount greater than 500 should be categorized as 'Silver'.
All other customers should be categorized as 'Bronze'.
 */


CREATE OR ALTER PROCEDURE sp_cutomertier
as 
begin
 set nocount on;
 select 
 C.CustomerID,
 C.Name as CustomerName, 
 ISNULL(COUNT(O.OrderID), 0) as NumberofOrders,
 ISNULL(SUM(O.TotalAmount),0) as Order_Amount,

 CASE
 WHEN COUNT (O.OrderID)>= 3
 and SUM (O.TotalAmount)> 1000 THEN 'GOLD'

 WHEN COUNT(O.OrderID)= 2
 AND SUM(O.TotalAmount)>500 THEN 'SILVER'

 Else 'BRONZE'
 END AS Category

 FROM Customers C
 LEFT JOIN Orders O 
 on C.CustomerID= O.CustomerID
 group by
 C.CustomerID ,
 C.Name
 order by 
 C.CustomerID;

 end;

 EXEC sp_cutomertier;