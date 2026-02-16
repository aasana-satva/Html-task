create database Ecommerce;

use Ecommerce;

CREATE TABLE Departments (
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL
);

CREATE TABLE Customers (
    CustomerId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    Phone VARCHAR(10) NOT NULL,
    DepartmentId INT NOT NULL,

    CONSTRAINT FK_Customers_Departments
        FOREIGN KEY (DepartmentId)
        REFERENCES Departments(DepartmentId),

    CONSTRAINT CHK_Customers_Phone
        CHECK (LEN(Phone) = 10 AND Phone NOT LIKE '%[^0-9]%')
);

CREATE TABLE Orders (
    OrderId INT IDENTITY(101,1) PRIMARY KEY,
    CustomerId INT NOT NULL,
    OrderDate DATE NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_Orders_Customers
        FOREIGN KEY (CustomerId)
        REFERENCES Customers(CustomerId),

    CONSTRAINT CHK_Orders_Amount
        CHECK (TotalAmount >= 0)
);


ALTER TABLE Orders
ALTER COLUMN CustomerId INT NULL;

ALTER TABLE Orders
ALTER COLUMN OrderDate DATE NULL;

ALTER TABLE Orders
ALTER COLUMN TotalAmount DECIMAL(10,2) NULL;

INSERT INTO Departments (DepartmentName, Location) VALUES
('Sales', 'Mumbai'),
('Marketing', 'Delhi'),
('HR', 'Bangalore'),
('IT', 'Hyderabad'),
('Finance', 'Chennai'),
('Support', 'Pune'),
('Operations', 'Kolkata'),
('Logistics', 'Ahmedabad'),
('Admin', 'Jaipur'),
('Research', 'Noida');

INSERT INTO Customers (CustomerName, Email, Phone, DepartmentId) VALUES
('John Doe', 'john.doe@mail.com', '9876543210', 1),
('Jane Smith', 'jane.smith@mail.com', '9876543211', 2),
('Michael Johnson', 'michael.j@mail.com', '9876543212', 3),
('Emily Davis', 'emily.d@mail.com', '9876543213', 4),
('Robert Brown', 'robert.b@mail.com', '9876543214', 5),
('Linda Wilson', 'linda.w@mail.com', '9876543215', 6),
('David Miller', 'david.m@mail.com', '9876543216', 7),
('Sarah Taylor', 'sarah.t@mail.com', '9876543217', 8),
('James Anderson', 'james.a@mail.com', '9876543218', 9),
('Patricia Thomas', 'patricia.t@mail.com', '9876543219', 10);

INSERT INTO Customers (CustomerName, Email, Phone, DepartmentId)
VALUES ('Sames Joe', 'sames@mail.com', '9876543222', 1);


INSERT INTO Orders (CustomerId, OrderDate, TotalAmount) VALUES
(1, '2024-02-15', 500.00),
(2, '2024-02-16', 750.00),
(3, '2024-02-17', 620.00),
(4, '2024-02-18', 810.00),
(5, '2024-02-19', 450.00),
(6, '2024-02-20', 900.00),
(7, '2024-02-21', 300.00),
(8, '2024-02-22', 1000.00),
(9, '2024-02-23', 670.00),
(10, '2024-02-24', 540.00);

insert into Orders values(10, '2023-02-24', 540.00);


select * from Customers;
select * from Departments;
select * from Orders;


-- 1. Retrieve a list of orders along with the names of customers who placed those orders.  
--Include only orders placed by existing customers. 
-- inner join
SELECT 
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
INNER JOIN Customers c
    ON o.CustomerId = c.CustomerId;


--2. Retrieve a list of all orders along with the names of customers who placed those orders. 
--Include orders placed by customers who are not registered in the system. 
--left join order->cutomer
SELECT
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
LEFT JOIN Customers c
    ON o.CustomerId = c.CustomerId;

    
--3. Retrieve a list of all customers who placed orders, even those without any orders. 
--Include  the details of orders they placed, if any. 
--left join customer->order 
SELECT
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Customers c
LEFT JOIN Orders o
    ON c.CustomerId = o.CustomerId;

--4 Retrieve a comprehensive list of all orders and customers, 
--including those without any  orders and customers who haven't placed any orders.
--full outer join order and customers
SELECT
    o.OrderId AS [Order ID],
    c.CustomerName AS [Customer Name],
    o.OrderDate AS [Order Date]
FROM Orders o
FULL OUTER JOIN Customers c
    ON o.CustomerId = c.CustomerId
ORDER BY o.OrderId;

--5. Generate a list of all possible combinations of orders and customers.  cross join 
SELECT
    o.OrderId,
    c.CustomerName,
    o.OrderDate
FROM Orders o
CROSS JOIN Customers c;

--6.Retrieve the top 3 customers who have spent the highest total amount. join group by order by sum
SELECT TOP 3
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    COUNT(o.OrderId) AS [Total Orders],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
INNER JOIN Orders o
    ON c.CustomerId = o.CustomerId
GROUP BY
    c.CustomerId,
    c.CustomerName
ORDER BY
    SUM(o.TotalAmount) DESC;

--7. Retrieve the details of customers who have not placed any orders. 
--left join is null
SELECT
    c.CustomerId,
    c.CustomerName,
    c.Email,
    c.Phone
FROM Customers c
LEFT JOIN Orders o
    ON c.CustomerId = o.CustomerId
WHERE o.OrderId IS NULL;

--8.Retrieve the total number of orders and total amount spent by each customer for orders  placed in 2024. 
--left join count total order and sum total amount on each customer 
SELECT
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    COUNT(o.OrderId) AS [Total Orders],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
LEFT JOIN Orders o
    ON c.CustomerId = o.CustomerId
    AND YEAR(o.OrderDate) = 2024
GROUP BY
    c.CustomerId,
    c.CustomerName
ORDER BY
    c.CustomerId;

--9.Retrieve the top 5 departments with the highest average total amount spent by customers in  orders. 
SELECT TOP 5
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    CAST(AVG(o.TotalAmount) AS DECIMAL(10,2)) AS [Average Total Amount Spent]
FROM Departments d
INNER JOIN Customers c
    ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o
    ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY [Average Total Amount Spent] DESC;

--10.  Retrieve the department with the highest total number of orders. 
SELECT TOP 1
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    COUNT(o.OrderId) AS [Total Orders]
FROM Departments d
INNER JOIN Customers c
    ON d.DepartmentId = c.DepartmentId
INNER JOIN Orders o
    ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
ORDER BY COUNT(o.OrderId) DESC;

--11. Retrieve the top 3 customers who have the highest total amount spent on orders in 
SELECT TOP 3
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    YEAR(o.OrderDate) AS [Year],
    SUM(o.TotalAmount) AS [Total Amount Spent]
FROM Customers c
INNER JOIN Orders o
    ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) = 2024
GROUP BY
    c.CustomerId,
    c.CustomerName,
    YEAR(o.OrderDate)
ORDER BY
    SUM(o.TotalAmount) DESC;


--12.  Retrieve the details of departments with at least 2 employees and the total number of orders  placed by those employees. 
SELECT
    d.DepartmentId AS [Department ID],
    d.DepartmentName AS [Department Name],
    COUNT(o.OrderId) AS [Total Orders]
FROM Departments d
INNER JOIN Customers c
    ON d.DepartmentId = c.DepartmentId
LEFT JOIN Orders o
    ON c.CustomerId = o.CustomerId
GROUP BY d.DepartmentId, d.DepartmentName
HAVING COUNT(DISTINCT c.CustomerId) >= 2;

--13. . Retrieve the customers who have placed orders both in 2023 and 2024. 
SELECT
    c.CustomerId AS [Customer ID],
    c.CustomerName AS [Customer Name],
    c.Email,
    c.Phone
FROM Customers c
INNER JOIN Orders o
    ON c.CustomerId = o.CustomerId
WHERE YEAR(o.OrderDate) IN (2023, 2024)
GROUP BY
    c.CustomerId,
    c.CustomerName,
    c.Email,
    c.Phone
HAVING COUNT(DISTINCT YEAR(o.OrderDate)) = 2;