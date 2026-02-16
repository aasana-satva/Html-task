-- given Unstructured data
--Student ID ,Name ,Age ,Gender, Address ,Email ,Phone Number,Course ID ,Course Name, Instructor ,Credit Hours ,Grade

--1ST NORMAL FORM
--IF 1 stuent have multiple course 
--1NF Table Example (StudentID	Name	CourseID	CourseName	Grade)
--Unique row with atmoic values no repeating groups 

--2ND NORMAL FORM
--in combined table have partial dependency for courseid and coursename
--grades depends on course id 
--splititng tables ( Student Course  Enrollment)

--3RD NORMAL FORM
--Insatructor depends upon the course not student 
--separate instructor table 

--FINAL NF
--Tables 
--STUDENT 
--COURSE
--INSTRUCTOR
--RESULT(course +grade)

--fields per tables 
--STUDENT (StudentID  Name Age Gender Address Email PhoneNumber )
--COURSE(CourseID CourseName CreditHours)
--INSTRUCTOR(InstructorID InstructorName)
--EMROLLMENT( StudentID CourseID Grade)

/*
Assumption made:
One course has one instructor.
A student can take many courses.
Instructor ID is introduced (not present originally).
Grade belongs to Enrollment, not Student or Course.
*/


CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Age INT CHECK (Age > 0),
    Gender CHAR(1) CHECK (Gender IN ('M','F','O')),
    Address NVARCHAR(200) NULL,
    Email NVARCHAR(100) UNIQUE,
    PhoneNumber NVARCHAR(20) UNIQUE
);

CREATE TABLE Instructors (
    InstructorID INT PRIMARY KEY IDENTITY(1,1),
    InstructorName NVARCHAR(100) NOT NULL
);

CREATE TABLE Courses (
    CourseID INT PRIMARY KEY IDENTITY(1,1),
    CourseName NVARCHAR(100) NOT NULL,
    CreditHours INT CHECK (CreditHours > 0),
    InstructorID INT,
    CONSTRAINT FK_Courses_Instructor
        FOREIGN KEY (InstructorID)
        REFERENCES Instructors(InstructorID)
);

CREATE TABLE Enrollments (
    EnrollmentID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    CourseID INT NOT NULL,
    Grade CHAR(2) CHECK (Grade IN ('A','B','C','D','F')),

    CONSTRAINT FK_Enrollments_Student
        FOREIGN KEY (StudentID)
        REFERENCES Students(StudentID),

    CONSTRAINT FK_Enrollments_Course
        FOREIGN KEY (CourseID)
        REFERENCES Courses(CourseID),

    CONSTRAINT UQ_Student_Course
        UNIQUE (StudentID, CourseID)
);

