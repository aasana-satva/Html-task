--Taks1 create table student
create table students(
		student_id serial primary key,
		student_name varchar(100) not null,
		marks int check (marks>=0)
);

--insert students
insert into students (student_name, marks) values
('Arun',50),
('Maya',40),
('Riya',70),
('Priya',34),
('Soniya',60);

select * from "students";

--Update marks of one student
update students set marks=50 where student_name='Soniya';

--Delete students with marks < 40
delete from students where marks < 40;

--Fetch all remaining students
select * from "students" ;

--Task2
create table accounts(
		account_id serial primary key,
		account_name varchar(100) not null,
		balance numeric(12,2) check(balance>=0)
);

insert into accounts (account_name,balance) values
('Account A', 5000),
('Account B', 6000);

update accounts set balance= 5000 where account_name='Account A';

select * from accounts;

--You are transferring ₹1000 from Account A to Account B. Ensure the transaction is ACID safe.
do $$
	begin 
		if exists (select 1 from accounts where account_name='Account A' and balance >= 1000) then 
			update accounts set balance=balance-1000 where account_name='Account A'; 
			update accounts set balance=balance+1000 where account_name='Account B';
		commit;
	else 
		rollback;
	end if;
end $$;

select * from accounts;

--Task3 employee table 
create table employees (
		id serial primary key,
		name varchar(100) not null,
		department varchar(100) not null,
		salary numeric(10,2) not null
);

insert into employees (name,department,salary) 
values 
('Alice','HR',50000),
('Bob','IT',70000),
('Charlie','IT',60000),
('Diana','HR',55000),
('Ethan','Sales',45000);

select * from employees;
--employee with salary above average

with avgsalarycte as(
select avg(salary) as avg_salary from employees
)
select * from employees where salary>(select avg_salary from avgsalarycte);

--Task4 Count Employees per Department
select  department , count(id) as employee_count from employees group by department
order by department;

--task5 Rank employees by salary (highest first).
select name , salary , rank() over(order by salary desc) as salary_rank 
from employees;

--without rank
SELECT 
    e1.name,
    e1.salary,
    (
        SELECT COUNT(DISTINCT e2.salary) 
        FROM employees e2 
        WHERE e2.salary >= e1.salary
    ) AS salary_rank
FROM employees e1
ORDER BY salary_rank;