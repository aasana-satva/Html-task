use SalesDB

CREATE TABLE Customers1
(
    CustomerId INT PRIMARY KEY,
    Name NVARCHAR(100),
    Address NVARCHAR(150)
);

CREATE TABLE CustomerProducts
(
    ProductId INT PRIMARY KEY,
    ProductName NVARCHAR(100),
    CustomerIDs NVARCHAR(100)   -- stores 1,2,3
);

INSERT INTO Customers1 VALUES
(1,'Jeshal','Amreli'),
(2,'Jigna','Ahmedabad'),
(3,'Rajesh','Baroda');

INSERT INTO CustomerProducts VALUES
(1,'Nokia','1,2,3'),
(2,'Iphone','2,3'),
(3,'Samsung','1');

select * from Customers1;
select * from CustomerProducts;

SELECT 
    C.CustomerId,
    C.Name AS CustomerName,
    C.Address,
    STRING_AGG(X.ProductName, ',') AS Products      --nokia,samsung
FROM Customers1 C  
JOIN
(
    SELECT DISTINCT 
        CAST(S.value AS INT) AS CustomerId,
        P.ProductName
    FROM CustomerProducts P
    CROSS APPLY STRING_SPLIT(P.CustomerIDs, ',') S --converts it into rows
) X
ON C.CustomerId = X.CustomerId
GROUP BY C.CustomerId, C.Name , C.Address
ORDER BY C.CustomerId;


SELECT DISTINCT
    P.ProductId,
    P.ProductName
FROM CustomerProducts P
CROSS APPLY STRING_SPLIT(P.CustomerIDs, ',') S
WHERE CAST(S.value AS INT) = 3;

