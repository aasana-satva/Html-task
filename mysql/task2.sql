--create database
create database CollegeDB;

--use database
use CollegeDB;

--create table department
CREATE TABLE Department (
    DepartmentID INT IDENTITY(1,1) PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL,
    Building VARCHAR(50),
    HOD_ID INT NULL
);

--create table Instructor
CREATE TABLE Instructor (
    InstructorID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    HireDate DATE,
    DepartmentID INT,
    CONSTRAINT FK_Instructor_Department
        FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

--create table student
CREATE TABLE Student (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    DepartmentID INT,
    JoinDate DATE,
    CONSTRAINT FK_Student_Department
        FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

--create table course
CREATE TABLE Course (
    CourseID INT IDENTITY(1,1) PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Credits INT CHECK (Credits > 0),
    DepartmentID INT,
    CONSTRAINT FK_Course_Department
        FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

--create table class
CREATE TABLE Class (
    ClassID INT IDENTITY(1,1) PRIMARY KEY,
    CourseID INT,
    InstructorID INT,
    Semester VARCHAR(20),
    Year INT,
    RoomID INT,
    CONSTRAINT FK_Class_Course
        FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
    CONSTRAINT FK_Class_Instructor
        FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID)
);


--create table enrollment
CREATE TABLE Enrollment (
    EnrollmentID INT IDENTITY(1,1) PRIMARY KEY,
    StudentID INT,
    ClassID INT,
    Grade CHAR(2),
    Attendance INT CHECK (Attendance BETWEEN 0 AND 100),
    CONSTRAINT FK_Enrollment_Student
        FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    CONSTRAINT FK_Enrollment_Class
        FOREIGN KEY (ClassID) REFERENCES Class(ClassID)
);

--CRUD OPERATIONS

--insert data 

INSERT INTO Department (DeptName, Building, HOD_ID)
VALUES
('Computer Science', 'Block A', NULL),
('Mechanical', 'Block B', NULL),
('Electronics', 'Block C', NULL),
('Civil', 'Block D', NULL),
('Business Admin', 'Block E', NULL);

INSERT INTO Instructor (Name, HireDate, DepartmentID)
VALUES
('Dr. Mehta', '2020-06-01', 1),
('Prof. Sharma', '2019-03-15', 2),
('Dr. Iyer', '2021-07-10', 3),
('Prof. Khan', '2018-01-20', 4),
('Dr. Patel', '2022-09-05', 5);

INSERT INTO Student (FirstName, LastName, Email, DepartmentID, JoinDate)
VALUES
('Aasana', 'Lalani', 'aasana@mail.com', 1, '2024-07-01'),
('Rahul', 'Shah', 'rahul@mail.com', 2, '2023-06-15'),
('Priya', 'Verma', 'priya@mail.com', 3, '2024-08-10'),
('Arjun', 'Reddy', 'arjun@mail.com', 1, '2022-07-20'),
('Neha', 'Patel', 'neha@mail.com', 5, '2023-09-01');

INSERT INTO Course (Title, Credits, DepartmentID)
VALUES
('Database Systems', 4, 1),
('Thermodynamics', 3, 2),
('Digital Electronics', 4, 3),
('Structural Design', 3, 4),
('Marketing Basics', 2, 5);

INSERT INTO Class (CourseID, InstructorID, Semester, Year, RoomID)
VALUES
(1, 1, 'Fall', 2025, 101),
(2, 2, 'Spring', 2025, 102),
(3, 3, 'Fall', 2025, 103),
(4, 4, 'Winter', 2025, 104),
(5, 5, 'Summer', 2025, 105);


INSERT INTO Enrollment (StudentID, ClassID, Grade, Attendance)
VALUES
(1, 1, 'A', 95),
(2, 2, 'B', 88),
(3, 3, 'A', 92),
(4, 1, 'C', 75),
(5, 5, 'B', 85);

--read data
select 2 from Department;
select * from Instructor;
select * from Student;
select * from Course;
select * from class;
select * from Enrollment;

--read specific
select DeptName, Building from Department;

--distinct 
select distinct Grade from Enrollment;

--aggregate with alias
select count(distinct Grade) as D_Grade from Enrollment;

--where clause
select * from Enrollment where Attendance>=80;

--OR operator
select * from  Class where Semester= 'Fall' OR Year=2025;

--AND operator
select * from  Class where Semester= 'Fall' AND Year=2025;

--BETWEEN
select * from Enrollment where Attendance between 75 and 92;

--LIKE
select FirstName from student where FirstName LIKE 'A%';

select FirstName from student where FirstName LIKE '%iy%';

select FirstName from student where FirstName LIKE '%A';

--IN
SELECT * FROM Student
WHERE DepartmentID IN (1, 2, 3);

SELECT * FROM Department
WHERE DeptName IN ('Computer Science', 'Mechanical');

--NOT IN
SELECT * FROM Student
WHERE DepartmentID NOT IN (1, 2);

--order by 
select * from Enrollment order by Attendance;

select * from Enrollment order by Attendance DESC;

--NULL VALUES   
select * from Department where HOD_ID is NULL;

select * from Department where HOD_ID is NOT NULL;

--update 
update Enrollment set Grade='A' WHERE Attendance=88;

UPDATE Department set HOD_ID=3 where Building='Block C';

--alter
ALTER TABLE Student
ADD Phone VARCHAR(10)


--DELETE 
delete from  Class where Semester='Winter';

--multiple
SELECT DepartmentID, COUNT(*) AS TotalStudents
FROM Student
GROUP BY DepartmentID;

--having
SELECT DepartmentID, COUNT(*) AS TotalStudents
FROM Student
GROUP BY DepartmentID
HAVING COUNT(*) > 1;

--top
SELECT TOP 3 * FROM Student;

--case
SELECT StudentID,
CASE 
   WHEN Attendance >= 90 THEN 'Excellent'
   WHEN Attendance >= 75 THEN 'Good'
   ELSE 'Average'
END AS AttendanceStatus
FROM Enrollment;

--aggregate
SELECT 
   MIN(Attendance) AS Min_Att,
   MAX(Attendance) AS Max_Att,
   AVG(Attendance) AS Avg_Att,
   SUM(Attendance) as Sum_att
FROM Enrollment;