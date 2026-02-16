--all database
SELECT *  
FROM sys.databases;

--create database
create database CompanyDB;

--use database
use companyDB;

--create table company
create table Company( companyID int identity(1,1) primary key,
CompanyName varchar(100) not null unique,
Location varchar(100),
createdAt datetime default getdate());

--create user table
create table Users(
UserID int identity (1,1) primary key,
CompanyID int not null,
FirstName varchar(50) not null,
LastName varchar (50) not null,
Email varchar(100) not null unique,
Phone varchar(10) not null,
createdAt datetime default getdate(),
CONSTRAINT CHK_User_Phone CHECK (LEN(Phone) = 10 AND Phone NOT LIKE '%[^0-9]%'),
CONSTRAINT FK_User_Company FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID) ON DELETE CASCADE
);

--create table personal
create table Personal(
PeronalID int identity(1,1) primary key,
UserID int not null,
Address varchar(200),
City varchar(50),
DOB date,
Gender varchar(10) check  (Gender IN ('Male','Female','Other')),
CONSTRAINT FK_Personal_User FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

--create table marketing
create table marketing(
MarketingID int identity(1,1) primary key,
UserID int not null,
CampaignName varchar(100) not null,
Budget decimal(10,2) check (Budget >= 0),
StartDate DATE,
EndDate DATE,
CONSTRAINT FK_Marketing_User FOREIGN KEY (UserID) REFERENCES Users(UserID) 
ON DELETE CASCADE
);


--create table device
create table Device(
DeviceID int identity(1,1) primary key,
CompanyID int not null,
DeviceName varchar(100) not null,
DeviceType varchar(100) not null,
SerialNumber varchar(100) unique,
PurchaseDate DATE,
CONSTRAINT FK_Device_Company
FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
ON DELETE CASCADE
);

--create application table
CREATE TABLE Applications (
AppID INT IDENTITY(1,1) PRIMARY KEY,
CompanyID INT NOT NULL,
AppName VARCHAR(100) NOT NULL,
Version VARCHAR(20),
LicenseKey VARCHAR(100) UNIQUE,
InstallDate DATE,
CONSTRAINT FK_App_Company
FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
ON DELETE CASCADE
);


--insert data company 
INSERT INTO Company (CompanyName, Location)
VALUES
('TechSoft', 'Bangalore'),
('Innova Solutions', 'Mumbai'),
('NextGen Pvt Ltd', 'Delhi'),
('Skyline Corp', 'Hyderabad'),
('BrightFuture Ltd', 'Chennai');

--insert data users
INSERT INTO Users (CompanyID, FirstName, LastName, Email, Phone)
VALUES
(1, 'Aasana', 'Lalani', 'aasana@techsoft.com', '9876543210'),
(2, 'Rahul', 'Sharma', 'rahul@innova.com', '9123456780'),
(3, 'Priya', 'Verma', 'priya@nextgen.com', '9988776655'),
(4, 'Arjun', 'Reddy', 'arjun@skyline.com', '9090909090'),
(5, 'Neha', 'Patel', 'neha@brightfuture.com', '9812345678');


--insert data personal
INSERT INTO Personal (UserID, Address, City, DOB, Gender)
VALUES
(1, 'MG Road 12', 'Bangalore', '1998-05-10', 'Female'),
(2, 'Andheri East', 'Mumbai', '1995-08-22', 'Male'),
(3, 'Karol Bagh', 'Delhi', '1997-12-01', 'Female'),
(4, 'Banjara Hills', 'Hyderabad', '1994-03-18', 'Male'),
(5, 'T Nagar', 'Chennai', '1999-07-30', 'Other');

INSERT INTO Personal 


--insert data marketing
INSERT INTO Marketing (UserID, CampaignName, Budget, StartDate, EndDate)
VALUES
(1, 'Social Media Blast', 50000.00, '2026-01-01', '2026-01-31'),
(2, 'Email Outreach', 20000.00, '2026-02-01', '2026-02-20'),
(3, 'SEO Campaign', 30000.00, '2026-03-01', '2026-03-30'),
(4, 'Product Launch Ads', 75000.00, '2026-04-01', '2026-04-25'),
(5, 'Referral Program', 15000.00, '2026-05-01', '2026-05-31');

--insert data device
INSERT INTO Device (CompanyID, DeviceName, DeviceType, SerialNumber, PurchaseDate)
VALUES
(1, 'Dell XPS 15', 'Laptop', 'DXPS12345', '2025-06-10'),
(2, 'iPhone 14', 'Mobile', 'IPH98765', '2025-09-15'),
(3, 'HP LaserJet Pro', 'Printer', 'HPLJ45678', '2024-11-20'),
(4, 'Lenovo ThinkPad', 'Laptop', 'LTP11223', '2025-01-05'),
(5, 'Samsung Galaxy Tab', 'Tablet', 'SGT33445', '2025-03-12');


--insert data applications
INSERT INTO Applications (CompanyID, AppName, Version, LicenseKey, InstallDate)
VALUES
(1, 'Microsoft Office', '365', 'MSOFF-1111', '2025-02-01'),
(2, 'Adobe Photoshop', '2024', 'ADPS-2222', '2024-12-10'),
(3, 'Visual Studio', '2022', 'VS-3333', '2023-08-05'),
(4, 'Slack', '5.0', 'SLK-4444', '2025-04-18'),
(5, 'Zoom', '6.1', 'ZM-5555', '2025-06-25');



--show table
select * from Company;
--show table users
select * from Users;
--show table personal
select * from Personal; 
--show marketing
select * from marketing;
--show device table
select * from Device;
--show Application table
select * from Applications;