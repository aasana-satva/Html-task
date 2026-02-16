CREATE DATABASE ProjectDB

USE ProjectDB

CREATE TABLE Departments
(
    DepartmentID INT PRIMARY KEY,
    DepartmentName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Employees
(
    EmployeeID INT PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50),
    Email NVARCHAR(100) UNIQUE,
    DepartmentID INT,
    CONSTRAINT FK_Department
        FOREIGN KEY (DepartmentID)
        REFERENCES Departments(DepartmentID)
);

CREATE TABLE Projects
(
    ProjectID INT PRIMARY KEY,
    ProjectName NVARCHAR(100) NOT NULL,
    EmployeeID INT,
    CONSTRAINT FK_ProjectEmployee
        FOREIGN KEY (EmployeeID)
        REFERENCES Employees(EmployeeID)
);

CREATE TABLE Salaries(
    SalaryID INT PRIMARY KEY,
    EmployeeID INT UNIQUE,
    BasicPay DECIMAL(10,2) CHECK (BasicPay > 0),
    Bonus DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT FK_SalaryEmployeee
        FOREIGN KEY (EmployeeID)
        REFERENCES Employees(EmployeeID)

);

INSERT INTO Departments VALUES
(1,'IT'),(2,'HR'),(3,'Finance');

INSERT INTO Employees VALUES
(101,'Aasana','Lalani','aasana@gmail.com',1),
(102,'Riya','Shah','riya@gmail.com',2),
(103,'Amit','Patel','amit@gmail.com',1);

insert into Employees values (105,'Afmit','Patel','amit2@gmail.com',1),
(106,'ahns','Patel','amit1@gmail.com',1),
(107,'Amigfdt','Patel','ami3t@gmail.com',1);

INSERT INTO Projects VALUES
(1,'Website',101),
(2,'Recruitment',102),
(3,'App Dev',103);

INSERT INTO Salaries VALUES
(1,101,40000,5000),
(2,102,35000,3000),
(3,103,45000,7000);

SELECT * FROM Departments;
SELECT * FROM Employees;
SELECT * FROM Projects;
SELECT * FROM Salaries;

--scalar Functions

SELECT UPPER(FirstName) AS NameUpper
FROM Employees;

SELECT BasicPay, ROUND(BasicPay, -2) AS RoundedSalary
FROM Salaries;

SELECT GETDATE() AS CurrentDate;

SELECT EmployeeID, AVG(BasicPay) AS AvgDeptSalary
FROM Salaries
GROUP BY EmployeeID;



CREATE FUNCTION fn_getfulname
(
@EmpID INT
)
RETURNS VARCHAR(110)
AS 
BEGIN
DECLARE @Name VARCHAR(110);

SELECT @Name= FirstName +' '+ LastName
FROM Employees
WHERE EmployeeID= @EmpID;

RETURN @Name;

END;

SELECT dbo.fn_getfulname(101) AS Fullname;


--total salary
CREATE FUNCTION fn_getfulsalary(
@EmpID INT )

RETURNS DECIMAL(10,2)
AS
BEGIN
DECLARE @Salary DECIMAL(10,2);

SELECT @Salary = BasicPay + Bonus
FROM Salaries
WHERE EmployeeID=@EmpID;

RETURN @Salary;

END;
SELECT  dbo.fn_getfulsalary(101) as Salary;

--inline table function - returns table

CREATE FUNCTION fn_empbydept(
@DepID INT)
RETURNS TABLE
AS 
RETURN
(
SELECT EmployeeID, FirstName, LastName
FROM Employees
WHERE DepartmentID = @DepID
);

SELECT * FROM fn_empbydept(1);


CREATE FUNCTION fn_getemail(
@EmpID INT)
RETURNS VARCHAR(100)
AS 
BEGIN
DECLARE @Empemail VARCHAR(100);

SELECT  @Empemail = Email
FROM Employees
WHERE EmployeeID = @EmpID

RETURN @Empemail;
END

SELECT dbo.fn_getemail(103);

CREATE FUNCTION fn_getdeptbyemp(
@EmpID INT)
RETURNS VARCHAR(50)
AS
BEGIN
DECLARE @Depname VARCHAR(50);

SELECT @Depname =D.DepartmentName
FROM Employees E 
INNER JOIN Departments D 
ON E.DepartmentID = D.DepartmentID 
WHERE E.EmployeeID = @EmpID;

RETURN @Depname;
end;
 
select dbo.fn_getdeptbyemp(102) as departmnet_name;

CREATE FUNCTION fn_addno(
@num1 INT, @num2 INT )
RETURNS INT 
AS 
BEGIN
return (@num1 + @num2);
End;

SELECT dbo.fn_addno(5,4) as SUM;


CREATE FUNCTION fn_getyearsalary(
@EmpID int)
returns decimal(10,2)
as
begin
declare @salary decimal(10,2)
 select @salary= (BasicPay + Bonus) * 12
 from Salaries
 WHERE EmployeeID = @EmpID;

 return @Salary

 end;
  
 Select dbo.fn_getyearsalary(101) as year_salary;

 create function fn_empdetails(
@EmpID INT )
 returns table 
 as 
return(
SELECT
        E.EmployeeID,
        E.FirstName + ' ' + E.LastName AS EmployeeName,
        D.DepartmentName,
        (S.BasicPay + S.Bonus) AS TotalSalary
    FROM Employees E
    INNER JOIN Departments D
        ON E.DepartmentID = D.DepartmentID
    INNER JOIN Salaries S
        ON E.EmployeeID = S.EmployeeID
    WHERE E.EmployeeID = @EmpID );

    SELECT * FROM fn_empdetails(102);


create function fn_empexist(
@empid int)
returns bit
as 
begin
declare @result bit;
if exists (select 1 from Employees where EmployeeID= 
@empid )set @result=1;
else
set @result=0;

return @result;

end;

select dbo.fn_empexist(109);

--multi statement table value function
create function fn_multivalue( @depid int)
returns @result1 table
(
  EmployeeID INT,
    FullName NVARCHAR(120),
    BasicPay DECIMAL(10,2),
    Bonus DECIMAL(10,2),
    TotalSalary DECIMAL(10,2)
)
as 
begin
insert into @result1
select       e.EmployeeID,
        e.FirstName + ' ' + ISNULL(e.LastName,'') AS FullName,
        s.BasicPay,
        s.Bonus,
        s.BasicPay + s.Bonus AS TotalSalary
    FROM Employees e
    INNER JOIN Salaries s
        ON e.EmployeeID = s.EmployeeID;

    RETURN;
    end;

    select * from dbo.fn_multivalue(2);

--while statements

DECLARE @id int = 101;
WHILE @id<=103
begin

begin transaction;
update Salaries
set Bonus = Bonus + 2000

where EmployeeID =@id ;
print 'bonus added' ;

Commit;
set @id=  @id +1;
end;

select * from Salaries;

--while with break
DECLARE @Num INT = 1;

WHILE @Num <= 10
BEGIN
    IF @Num = 5
        BREAK;

    PRINT @Num;
    SET @Num += 1;
END;

--while with continue
DECLARE @Num1 INT = 1;

WHILE @Num1 <= 5
BEGIN
    SET @Num1 += 1;

    IF @Num1 = 3
        CONTINUE;

    PRINT @Num1;
END;


--cursor in sql

declare @Empid int;

declare emp_cursor cursor for 
select EmployeeID FROM Employees;

Open emp_cursor;

fetch next from emp_cursor into @Empid;

while @@FETCH_STATUS =0
BEGIN 
Update Salaries
set Bonus = Bonus+100
where EmployeeID =@Empid;

fetch next from emp_cursor into @Empid;

end;

close emp_cursor;
deallocate emp_cursor;

--triggers in sql 
create table employeelog(   
    LogID INT IDENTITY,
    EmployeeID INT,
    ActionType NVARCHAR(20),
    ActionDate DATETIME);

--creating a trigger after insert 
create trigger trg_afteremployeeinsert
on Employees 
after insert
as 
begin
insert into employeelog( EmployeeID,ActionType,ActionDate)
select EmployeeID ,'insert' , GETDATE()
from inserted;
end;

insert into Employees values (104,'Anuj','Patel','anuj@gmail.com',3);
select * from employeelog;

--trigger after update
create trigger trg_checksalary
on Salaries
after update
as
begin
if exists (
select 1 from inserted where BasicPay<0)
begin 
print 'salary can not be negative';
rollback;
end
end;

insert into salaries values (7,104,95000,8000);

select * from Salaries;


--instead of trigger 
CREATE TRIGGER trg_PreventDelete
ON Employees
INSTEAD OF DELETE
AS
BEGIN
    PRINT 'Deletion is not allowed!';
END;

--sql indexes
--non clustered
--create nonclustered index idx_email
--on Employees(Email);

SELECT * 
FROM Employees
WHERE Email = 'riya@gmail.com';

--clustered 
CREATE NONCLUSTERED INDEX idx_id
ON Employees(EmployeeID);

SELECT * FROM Employees;
create nonclustered index dept_id on Employees(DepartmentID);

select * from Employees where DepartmentID=2;

SELECT * 
FROM Employees
WHERE EmployeeID = 101;

EXEC sp_helpindex Employees;

drop index PK__Employee__7AD04FF1EF876C93 on Employees;