CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE company(
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(100) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE department(
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
company_id UUID REFERENCES company(id) ON DELETE CASCADE,
name VARCHAR(100) NOT NULL,
budget NUMERIC(12,2) NOT NULL
);

CREATE TABLE employee(
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
company_id UUID REFERENCES company(id) ON DELETE CASCADE,
department_id UUID REFERENCES department(id) ON DELETE SET NULL,
first_name VARCHAR(50),
last_name VARCHAR(50),
salary NUMERIC(10,2),
joining_date DATE,
is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO company(name) VALUES 
('TechCorp'),
('BizGroup'),
('Innova Ltd'),
('Alpha Systems'),
('NextGen Solutions');

INSERT INTO department (company_id, name, budget) VALUES
((SELECT id FROM company WHERE name='TechCorp'),'IT' , 800000),
((SELECT id FROM company WHERE name='TechCorp'),'HR' , 400000),
((SELECT id FROM company WHERE name='BizGroup'),'Finance' , 600000),
((SELECT id FROM company WHERE name='Innova Ltd'),'Marketing' , 500000),
((SELECT id FROM company WHERE name='Alpha Systems'),'Operations' , 700000);

INSERT INTO empLoyee(company_id, department_id, first_name, last_name, salary, joining_date, is_active) VALUES
(
 (SELECT id FROM company WHERE name='TechCorp'),
 (SELECT id FROM department WHERE name='IT'),
 'Asha','Patel',60000,'2023-01-10',TRUE
),
(
 (SELECT id FROM company WHERE name='TechCorp'),
 (SELECT id FROM department WHERE name='HR'),
 'Rahul','Shah',55000,'2022-03-15',TRUE
),
(
 (SELECT id FROM company WHERE name='BizGroup'),
 (SELECT id FROM department WHERE name='Finance'),
 'Neha','Mehta',70000,'2021-06-01',FALSE
),
(
 (SELECT id FROM company WHERE name='Innova Ltd'),
 (SELECT id FROM department WHERE name='Marketing'),
 'Karan','Verma',50000,'2023-07-20',TRUE
),
(
 (SELECT id FROM company WHERE name='Alpha Systems'),
 (SELECT id FROM department WHERE name='Operations'),
 'Priya','Singh',65000,'2022-11-05',TRUE
);

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date, is_active)
VALUES (
 (SELECT id FROM company WHERE name = 'TechCorp'),
 (SELECT id FROM department WHERE name = 'IT'),
 'Riya','Paramr',80000,'2023-01-10',TRUE
);

INSERT INTO employee (company_id, department_id, first_name, last_name, salary, joining_date, is_active)
VALUES (
 (SELECT id FROM company WHERE name = 'TechCorp'),
 (SELECT id FROM department WHERE name = 'IT'),
 'ABC','EF',80000,'2023-01-10',FALSE
);
SELECT * FROM company;
SELECT * FROM department;
SELECT * FROM employee;

--Task 1: Department Salary Summary Function 

CREATE OR REPLACE FUNCTION fn_salarysummary(p_department_id UUID)
RETURNS TABLE(
total_employees INT,
total_salary NUMERIC,
avg_salary NUMERIC
)

LANGUAGE plpgsql
AS $$
BEGIN
RETURN QUERY
SELECT 
COUNT(*)::INT,
COALESCE(SUM(salary),0),
CAST(COALESCE(AVG(salary),0) AS NUMERIC(10,2))

FROM employee
WHERE department_id=p_department_id
AND is_active= TRUE;
END;
$$;

SELECT * FROM fn_salarysummary('1a2850b1-d83e-4025-bfe8-a2c9741ec2eb'); 

SELECT * FROM fn_salarysummary('1a2850b1-d83e-4025-bfe9-a2c9741ec2eb'); 

--Task 2: Employee Transfer Procedure 

CREATE OR REPLACE PROCEDURE sp_employeetrasfer
(p_employee_id UUID, p_new_department_id UUID)

LANGUAGE plpgsql
AS $$
DECLARE 
v_emp_company UUID;
v_dept_company UUID;
BEGIN

--CHECK EMPLOYEE EXISTS 
SELECT company_id INTO v_emp_company
FROM employee 
WHERE id = p_employee_id;

IF v_emp_company IS NULL THEN
RAISE EXCEPTION 'Employee does not exist';
END IF;

--CHECK DEPARMENT EXISTS 
SELECT company_id INTO v_dept_company
FROM department 
WHERE id= p_new_department_id;

IF v_dept_company IS NULL THEN 
RAISE EXCEPTION 'department does not exist';
END IF;

--CHECK SAME COMPANY
IF v_emp_company<>v_dept_company THEN
RAISE EXCEPTION 'Employee and department belongs different companies';
END IF;

--Transfer company
UPDATE employee
SET department_id =p_new_department_id
WHERE id=p_employee_id;
END;
$$;

SELECT id  AS employee_id FROM employee ;
SELECT * FROM employee;

CALL sp_employeetrasfer(
 '5c0784fd-055d-4a30-885d-98e66db5624e',
 '1a2850b1-d83e-4025-bfe8-a2c9741ec2eb'
);

CALL sp_employeetrasfer(
 '5c0784fd-075d-4a30-885d-98e66db5624e',
 '1a2850b1-d83e-4025-bfe8-a2c9741ec2eb'
);

CALL sp_employeetrasfer(
 '5c0784fd-055d-4a30-885d-98e66db5624e',
 '1a2850b1-d83e-4075-bfe8-a2c9741ec2eb'
);

--Task 3: Increase Salary by Employee Function 

CREATE OR REPLACE FUNCTION fn_updatesalary 
(p_employee_id UUID,p_percent NUMERIC)

RETURNS TABLE(
updated_salary NUMERIC(10,2),
v_original_salary NUMERIC(10,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
v_original_salary NUMERIC(10,2);
v_new_salary NUMERIC(10,2);
v_active BOOLEAN;
BEGIN
IF p_percent <=0 THEN
RAISE EXCEPTION 'Percentage must be greater than 0';
END IF;

SELECT salary, is_active
INTO  v_original_salary,v_active
FROM employee
WHERE id= p_employee_id;

IF NOT FOUND THEN
RAISE EXCEPTION 'Employee does not exist';
END IF;

IF v_active = FALSE THEN
RAISE EXCEPTION 'Employee is inactive';
END IF;

v_new_salary := v_original_salary +(v_original_salary * p_percent /100);

UPDATE employee
SET salary=v_new_salary
WHERE id=p_employee_id;

RETURN QUERY
    SELECT v_new_salary, v_original_salary;
END;
$$;

--employee inactive
SELECT fn_updatesalary(
 'c3501497-4212-44cb-b7ea-b39a73fc119b',
 5
);

--employee does not exist
SELECT fn_updatesalary(
 'a1d54e6e-32b6-4fb9-a882-9e1e0038fa03',
 5
);

--employee salary increase 
SELECT fn_updatesalary (
 '4f116e3c-c9aa-405c-945b-6e26a257fabf',
 -8
) as Updated_Salary;

SELECT *
FROM fn_updatesalary(
 '4f116e3c-c9aa-405c-945b-6e26a257fabf',
 5
);











--CREATE A FUNCTION THAT TAKES THE COMPONY ID AND GIVES THE TOTAL SALARY OF THE EMPLOYEE
CREATE OR REPLACE FUNCTION fn_salarybycompany(p_company_id UUID)
RETURNS TABLE(
v_company_name VARCHAR,
v_salary NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN

RETURN QUERY
SELECT c.name , sum(e.salary)  from company c JOIN employee e 
ON c.id=e.company_id WHERE c.id=e.company_id GROUP BY c.name
LIMIT 1;

END;
$$;

select * from fn_salarybycompany('e41c9fb4-eb2d-4e11-8a50-f0f88bae60ea');

select * from company;

--CREATE A FUNCTION THAT TAKES THE COMPANY ID AND RETURNS THE MAX SALARY AND NAME OF THE EMPLOYEE IN THAT COMPANY
CREATE OR REPLACE FUNCTION fn_maxsalarybycompany(p_company_id UUID)
RETURNS TABLE(
    v_employee_name VARCHAR,
    v_salary NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT e.first_name, e.salary
    FROM employee e
    WHERE e.company_id = p_company_id
      AND e.salary = (
          SELECT MAX(salary)
          FROM employee
          WHERE company_id = p_company_id
      );
END;
$$;

SELECT * FROM fn_maxsalarybycompany('28a143e0-3c36-45df-9071-c976b9cac727');

--EMPLOYEE SEARCH BY NAME
CREATE OR REPLACE FUNCTION fn_search_employee(p_text TEXT)
RETURNS TABLE(id UUID, name TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT e.id, e.first_name || ' ' || e.last_name
    FROM employee e
    WHERE e.first_name ILIKE '%' || p_text || '%'
       OR e.last_name ILIKE '%' || p_text || '%';
END;
$$;

SELECT * 
FROM fn_search_employee('riy');

CREATE OR REPLACE FUNCTION fn_max_salary_by_dept(p_company_id UUID)
RETURNS TABLE(
    department_name VARCHAR,
    max_salary NUMERIC(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT d.name AS department_name,
           COALESCE(MAX(e.salary),0) AS max_salary
    FROM department d
    LEFT JOIN employee e
        ON e.department_id = d.id
        AND e.company_id = p_company_id
    WHERE d.company_id = p_company_id
    GROUP BY d.name
    ORDER BY max_salary DESC;
END;
$$;

select * from fn_max_salary_by_dept('28a143e0-3c36-45df-9071-c976b9cac727');

/* Department Budget Enforcement Function
Requirements:
Create a function that:
- Accepts department_id and new_salary.
- Calculates the total salary of active employees in that department.
- Ensures that increasing an employee’s salary does NOT exceed department budget.
- If budget would be exceeded → raise exception.
- If valid → return remaining budget after change. */

CREATE OR REPLACE FUNCTION fn_departmentbudget( p_department_id UUID, p_new_salary NUMERIC)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$ 
DECLARE 
v_totalsalary NUMERIC(10,2);
v_remaining_budget NUMERIC(10,2);
BEGIN

SELECT sum(salary)  into v_totalsalary as totalsalary 
from employee where department_id=p_department_id and is_active='TRUE' ;

SELECT budget into v_remaining_budget from department where id=p_department_id;

if(v_totalsalary +p_new_salary ) >v_remaining_budget then
raise exception 'insuffient budget' ;
end if;

return v_remaining_budget -(v_totalsalary +p_new_salary);
end;
$$;

SELECT * FROM fn_departmentbudget('1a2850b1-d83e-4025-bfe8-a2c9741ec2eb', 10000) AS remaing_budget;


SELECT * FROM employee WHERE joining_date <= CURRENT_DATE - INTERVAL '6 months';

select  e.department_id , e.company_id ,count(e.id) as Employee_count
from employee e join department d 
on d.id=e.department_id  group by e.department_id , e.company_id
order by Employee_count desc LIMIT 1;
