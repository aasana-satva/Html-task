--1.Create a Store-Procedure insert operation for all tables (Customer, Product,  Order, Payment) 

--insert Procedure for customer (Paramterized sp)
create procedure sp_insertcustomer
@FirstName varchar(50),
@LastName varchar(50),
@Email varchar(50),
@Phone varchar(10)
as 
begin
insert into Customer(FirstName, LastName ,Email, Phone)
values(@FirstName,@LastName, @Email,@Phone)
end

EXEC sp_insertcustomer 'John','Doe','john.doe@gmail.com','9876543210';
EXEC sp_insertcustomer 'Aisha','Khan','aisha.khan@gmail.com','9123456780';
EXEC sp_insertcustomer 'Rahul','Sharma','rahul.sharma@gmail.com','9988776655';
EXEC sp_insertcustomer 'Neha','Patel','neha.patel@gmail.com','9012345678';
EXEC sp_insertcustomer 'David','Smith','david.smith@gmail.com','8899776655';

select * from Customer

--insert Procedure for Product
create procedure sp_insertproduct
@Name  varchar(50),
@Price varchar(50),
@Description  varchar(200)
as 
begin
insert into Product(Name, Price, Description)
values(@Name,@Price,@Description)
end

EXEC sp_insertproduct 'Laptop',65000,'Gaming Laptop';
EXEC sp_insertproduct 'Mobile',25000,'Android Phone';
EXEC sp_insertproduct 'Headphones',1500,'Wireless';
EXEC sp_insertproduct 'Keyboard',800,'Mechanical';
EXEC sp_insertproduct 'Mouse',500,'Optical';

select * from Product

--insert procedure for Orders
create procedure sp_insertorder
@CustmerID int,
@ProductID int,
@OrderDate datetime,
@Qty int,
@Rate Decimal(10,2)
as 
begin
declare @Total decimal(10,2)
set @Total= @Qty * @Rate

insert into Orders(CustomerID,ProductID,OrderDate,Qty, Rate,TotalAmount)
values(@CustmerID,@ProductID,@OrderDate,@Qty,@Rate,@Total)
end

EXEC sp_insertorder 1, 1, '2026-02-01 10:00:00', 2, 65000.00;
EXEC sp_insertorder 2, 3, '2026-02-02 12:30:00', 1, 1500.00;
EXEC sp_insertorder 3, 2, '2026-02-03 15:45:00', 3, 25000.00;
EXEC sp_insertorder 4, 5, '2026-02-04 09:20:00', 4, 500.00;
EXEC sp_insertorder 5, 4, '2026-02-05 18:10:00', 1, 800.00;
EXEC sp_insertorder 6, 5, '2026-03-05 18:10:00', 3, 8000.00;
EXEC sp_insertorder 2, 1, '2025-12-01 10:00:00', 1, 65000.00;
EXEC sp_insertorder 3, 2, '2025-11-15 12:00:00', 2, 25000.00;

select * from Orders;

--insert procedure for Payment
create Procedure sp_insertpayment
@OrderID int,
@Amount Decimal(10,2)
as 
begin
insert into Payment(OrderID,Amount,PaymentDate)
values(@OrderID,@Amount,GETDATE())
end

EXEC sp_insertpayment 1, 130000.00;
EXEC sp_insertpayment 2, 1500.00;
EXEC sp_insertpayment 3, 75000.00;
EXEC sp_insertpayment 4, 2000.00;
EXEC sp_insertpayment 5, 800.00;

select * from Payment

--2.Create a Store-Procedure Update operation for all tables (Customer, Product,  Order, Payment)

--update customer
create procedure sp_updatecustomer
@CustomerID INT,@FirstName VARCHAR(50),@LastName VARCHAR(50),
@Email VARCHAR(100),@Phone VARCHAR(20)
as
update Customer set
 FirstName=@FirstName,LastName=@LastName,
 Email=@Email,Phone=@Phone
 where CustomerID=@CustomerID

 select * from customer
  BEGIN TRANSACTION;
 EXEC sp_updatecustomer 1, 'neha', 'Shah', 'riya.new@gmail.com', '9998887776';
 -- If wrong
    --ROLLBACK;
 -- If correct
    --COMMIT;
 select * from customer

 --update Product
create procedure sp_updateproduct
@ProductID INT,@Name VARCHAR(100),@Price DECIMAL(10,2),@Description TEXT
as
update Product set Name=@Name,Price=@Price,Description=@Description
where ProductID=@ProductID

--update order
create procedure sp_updateorder
 @OrderID INT,@Qty INT,@Rate DECIMAL(10,2)
as
update Orders
set  Qty=@Qty,Rate=@Rate,TotalAmount=@Qty*@Rate
where OrderID=@OrderID

--update Payement
create procedure sp_updatepayment
@PaymentID INT,@Amount DECIMAL(10,2)
as 
update Payment set Amount=@Amount 
where  PaymentID=@PaymentID

--3.Create a Store-Procedure Get operation for all tables (Customer, Product, Order,  Payment) 

create procedure sp_getcustomer as select *  from Customer
EXEC sp_getcustomer

create procedure sp_getproduct as select * from Product
exec sp_getproduct

create procedure sp_getorder as select * from Orders
exec sp_getorder

create procedure sp_getpeyment as select * from Payment
exec sp_getpeyment

--4. Create a Store-Procedure Delete operation by table Primary key for all tables (Customer, Product, Order, Payment) 

create procedure sp_deletecustomer @CustomerID INT
AS DELETE FROM Customer WHERE CustomerID=@CustomerID

--exec sp_deletecustomer 1;

create procedure sp_deleteproduct  @ProductID INT
AS DELETE FROM Product WHERE ProductID=@ProductID

--exec sp_deleteproduct 2;

create procedure sp_deleteorder @OrderID INT
AS DELETE FROM Orders WHERE OrderID=@OrderID

--exec sp_deleteorder 5;

create procedure sp_deletepayment @PaymentID INT
AS DELETE FROM Payment WHERE PaymentID=@PaymentID

--exec sp_deletepayment 3;

--5. Create a stored procedure that updates the price of a product given its  ProductID. 
create procedure sp_updateproductprice 
@ProductID INT,@NewPrice DECIMAL(10,2)
AS
UPDATE Product SET Price=@NewPrice WHERE ProductID=@ProductID

exec sp_updateproductprice  
        @ProductID = 1,
        @NewPrice  = 7000;

select * from Product where ProductID=1;

--6.. Write a stored procedure that takes parameters for CustomerID, OrderDate,  ProductID, Qty, and Rate,
--and inserts a new order into the Order table,  calculating the TotalAmount based on the Qty and Rate.
create procedure sp_createOrder
 @CustomerID INT,@OrderDate DATETIME,
 @ProductID INT,@Qty INT,@Rate DECIMAL(10,2)
AS
INSERT INTO Orders(CustomerID,ProductID,OrderDate,Qty,Rate,TotalAmount)
VALUES(@CustomerID,@ProductID,@OrderDate,@Qty,@Rate,@Qty*@Rate)

EXEC sp_createOrder 
    @CustomerID = 1,
    @OrderDate = '2026-02-05',
    @ProductID = 101,
    @Qty = 2,
    @Rate = 500.00;

--7.Design a stored procedure that records a payment for an order by taking OrderID
--and Amount as parameters and inserting a new record into the Payment table  with the provided information. 

create procedure sp_recordpayment
@OrderID INT,@Amount DECIMAL(10,2)
AS
INSERT INTO Payment(OrderID,Amount,PaymentDate)
VALUES(@OrderID,@Amount,GETDATE())

EXEC sp_recordpayment 
    @OrderID = 1,
    @Amount = 500.00;

--8. Create a stored procedure that retrieves the total payments made by each  
--customer by joining the Customer and Payment tables and aggregating the  amounts for each customer. 
create procedure sp_totalpaymentbycustomer
as
begin
SELECT c.CustomerID,c.FirstName,SUM(p.Amount) TotalPaid
FROM Customer c
JOIN Orders o ON c.CustomerID=o.CustomerID
JOIN Payment p ON o.OrderID=p.OrderID
GROUP BY c.CustomerID,c.FirstName
end

EXEC sp_totalpaymentbycustomer;

--9.  Write a stored procedure that identifies customers who have not made any 
--payments by comparing the Customer table with the Payment table and returning  the relevant records. 
create procedure sp_CustomersNoPayments
AS
SELECT * FROM Customer c
WHERE NOT EXISTS (
 SELECT 1 FROM Orders o
 JOIN Payment p ON o.OrderID=p.OrderID
 WHERE o.CustomerID=c.CustomerID)

 exec sp_CustomersNoPayments;
 

--10.Develop a stored procedure that calculates the total revenue for a given period 
--by summing up the TotalAmount from theOrder table for orders placed within  that period. 
create procedure sp_RevenuePeriod
 @Start DATETIME,@End DATETIME
AS
begin
SELECT SUM(TotalAmount) Revenue
FROM Orders
WHERE OrderDate BETWEEN @Start AND @End
end

EXEC sp_RevenuePeriod 
    @Start = '2026-02-01',
    @End   = '2026-02-26';

--11.Design a stored procedure that retrieves all orders along with customer and 
--product details by joining the Order, Customer, and Product tables.
CREATE PROCEDURE sp_OrderDetails
AS
SELECT o.OrderID,c.FirstName,p.Name,o.TotalAmount
FROM Orders o
JOIN Customer c ON o.CustomerID=c.CustomerID
JOIN Product p ON o.ProductID=p.ProductID

exec sp_OrderDetails 

--12.Retrieve the top N customers with the highest total payments.
CREATE PROCEDURE sp_TopCustomers @N INT
AS
SELECT TOP(@N) c.CustomerID,SUM(p.Amount) TotalPaid
FROM Customer c
JOIN Orders o ON c.CustomerID=o.CustomerID
JOIN Payment p ON o.OrderID=p.OrderID
GROUP BY c.CustomerID
ORDER BY TotalPaid DESC

exec sp_TopCustomers 3;

--13.Retrieve all orders made by customers who have made payments within the last  N months. 
CREATE PROCEDURE sp_RecentOrders @Months INT
AS
SELECT * FROM Orders
WHERE CustomerID IN (
 SELECT DISTINCT o.CustomerID
 FROM Orders o
 JOIN Payment p ON o.OrderID=p.OrderID
 WHERE p.PaymentDate >= DATEADD(MONTH,-@Months,GETDATE()))

 exec sp_RecentOrders 3;

 --14.Calculate the total revenue for each product category.
 CREATE PROCEDURE sp_RevenuePerProduct
AS
SELECT p.Name,SUM(o.TotalAmount) Revenue
FROM Product p
JOIN Orders o ON p.ProductID=o.ProductID
GROUP BY p.Name

exec sp_RevenuePerProduct

--15.Retrieve the most profitable product (highest total revenue). 
CREATE PROCEDURE sp_MostProfitableProduct
AS
SELECT TOP 1 p.Name,SUM(o.TotalAmount) Revenue
FROM Product p
JOIN Orders o ON p.ProductID=o.ProductID
GROUP BY p.Name
ORDER BY Revenue DESC

exec sp_MostProfitableProduct 

--16.Retrieve customers who have made purchases of a specific product within a  given date range. 
CREATE PROCEDURE sp_CustomersByProduct
 @ProductID INT,@Start DATETIME,@End DATETIME
AS
SELECT DISTINCT c.*
FROM Customer c
JOIN Orders o ON c.CustomerID=o.CustomerID
WHERE o.ProductID=@ProductID
AND o.OrderDate BETWEEN @Start AND @End

exec sp_CustomersByProduct 
     @ProductID = 4,
    @Start = '2026-02-01',
    @End   = '2026-02-28';

--17.Calculate the average order value for each customer. 
CREATE PROCEDURE sp_AvgOrderValue
AS
SELECT CustomerID,AVG(TotalAmount) AvgValue
FROM Orders GROUP BY CustomerID

exec sp_AvgOrderValue

--18.Retrieve orders with the highest total amounts for each customer. 

CREATE PROCEDURE sp_HighestOrderPerCustomer1
AS
BEGIN
    SELECT o.*
    FROM Orders o
    WHERE o.TotalAmount = (
        SELECT MAX(o2.TotalAmount)
        FROM Orders o2
        WHERE o2.CustomerID = o.CustomerID
    );
END

exec sp_HighestOrderPerCustomer1

--19.Calculate the total number of orders and the total revenue
--generated by each  customer for a specific year. 
CREATE PROCEDURE sp_YearlyStats @Year INT
AS
SELECT CustomerID,
 COUNT(*) TotalOrders,
 SUM(TotalAmount) Revenue
FROM Orders
WHERE YEAR(OrderDate)=@Year
GROUP BY CustomerID

exec sp_YearlyStats 2026;

--20.Retrieve orders that have not been paid within a certain period. 
CREATE PROCEDURE sp_UnpaidOrders @Days INT
AS
SELECT * FROM Orders o
WHERE NOT EXISTS (
 SELECT 1 FROM Payment p WHERE p.OrderID=o.OrderID)
AND o.OrderDate <= DATEADD(DAY,-@Days,GETDATE())

exec sp_UnpaidOrders 30;

--21.Identify customers who have made consecutive purchases within a given  timeframe. 
CREATE PROCEDURE sp_ConsecutivePurchases @Days INT
AS
SELECT DISTINCT o1.CustomerID
FROM Orders o1
JOIN Orders o2
ON o1.CustomerID=o2.CustomerID
AND DATEDIFF(DAY,o1.OrderDate,o2.OrderDate)<=@Days
AND o1.OrderID<>o2.OrderID          --Ensures we are not comparing the same order row.

exec sp_ConsecutivePurchases 4;

--22.Calculate the total revenue for each customer in the last N months. 
CREATE PROCEDURE sp_RevenueLastMonths @Months INT
AS
SELECT CustomerID,SUM(TotalAmount) Revenue
FROM Orders
WHERE OrderDate>=DATEADD(MONTH,-@Months,GETDATE())
GROUP BY CustomerID

exec sp_RevenueLastMonths 3;

--23.Retrieve orders where the product price is higher than 
--the average price of all  products 
CREATE PROCEDURE sp_OrdersAboveAvgPrice
AS
SELECT * FROM Orders
WHERE Rate > (SELECT AVG(Price) FROM Product)

exec sp_OrdersAboveAvgPrice

--24.Calculate the average time between consecutive orders for each customer. 
CREATE PROCEDURE sp_AvgOrderGap
AS
BEGIN
    SELECT 
        o1.CustomerID,
        AVG(DATEDIFF(DAY, o2.OrderDate, o1.OrderDate)) AS AvgDays
    FROM Orders o1
    JOIN Orders o2
        ON o1.CustomerID = o2.CustomerID
        AND o2.OrderDate = (
            SELECT MAX(OrderDate)
            FROM Orders o3
            WHERE o3.CustomerID = o1.CustomerID
              AND o3.OrderDate < o1.OrderDate
        )
    GROUP BY 
        o1.CustomerID;
END

exec sp_AvgOrderGap;

--25.Create a store procedure create with pagination, sorting and searching with order  table.

CREATE PROCEDURE sp_OrderPagination
 @Page INT,@Size INT,@Search VARCHAR(50)=''
AS
SELECT *
FROM Orders
WHERE CAST(OrderID AS VARCHAR) LIKE '%'+@Search+'%'
ORDER BY OrderDate
OFFSET (@Page-1)*@Size ROWS         --skips rows 
FETCH NEXT @Size ROWS ONLY          --takes only required rows

EXEC sp_OrderPagination 1, 5, ''; --default empty show all