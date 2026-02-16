--QUERIS - USING ENUM
--CREATE ENUM TYPES 

create type payment_status_enum as enum('PENDING','SUCCESS','FAILED','REFUNDED');
create type seat_status_enum as enum('AVAILABLE','LOCKED','BOOKED');
create type booking_ststus_enum as enum('CONFIRMED','CANCELLED');

--CREATE TABLES USERS, FLIGHT, SEAT, BOOKING ,PAYMENT

create table users(
user_id serial primary key,
full_name varchar(100) not null,
email varchar(150) unique not null,
created_at timestamp default current_timestamp
);

create table flights(
flight_id serial primary key,
source varchar(50) not null,
destination varchar(50) not null,
flight_date date not null,
total_seat int check(total_seat >0),
created_at timestamp default current_timestamp
);

create table seats(
seat_id serial primary key,
flight_id int not null,
seat_number varchar(100) not null,
seat_status seat_status_enum default 'AVAILABLE',

constraint fk_flight
foreign key(flight_id)
references flights(flight_id)
on delete cascade,

constraint unique_seat_per_flight
unique(flight_id,seat_number)
);

create table bookings(
booking_id serial primary key,
user_id int not null,
flight_id int not null,
seat_id int not null,
booking_status booking_ststus_enum default 'CONFIRMED',
booking_date timestamp default current_timestamp,

foreign key(user_id) references users(user_id) on delete cascade,
foreign key(flight_id) references flights(flight_id) on delete cascade,
foreign key (seat_id ) references seats(seat_id) on delete cascade
);

create table payments(
payment_id serial primary key,
booking_id int not null,
amount numeric(10,2) check (amount>0),
payment_status payment_status_enum default 'PENDING',
payment_date timestamp default current_timestamp,

foreign key(booking_id) references bookings(booking_id) on delete cascade
)

--INSERT SAMPLE DATA
INSERT INTO users (full_name, email) VALUES
('Aasana Lalani', 'aasana@gmail.com'),
('Rahul Sharma', 'rahul@gmail.com'),
('Priya Mehta', 'priya@gmail.com'),
('Amit Patel', 'amit@gmail.com'),
('Neha Singh', 'neha@gmail.com');

insert into users (full_name, email) values ('Karan Karavdra','karan@gmail.com');
insert into users (full_name, email) values ('anya parmar','anya@gmail.com');

INSERT INTO flights (source, destination, flight_date, total_seat) VALUES
('Mumbai','Delhi','2026-05-01',5),
('Delhi','Bangalore','2026-05-02',5),
('Chennai','Hyderabad','2026-05-03',5),
('Kolkata','Mumbai','2026-05-04',5),
('Pune','Goa','2026-05-05',5);

insert into flights (source, destination, flight_date, total_seat) values  ('Diu','Rajkot','2026-09-05',7);

INSERT INTO seats (flight_id, seat_number, seat_status) VALUES
(1,'A1','BOOKED'),
(2,'A1','AVAILABLE'),
(3,'A1','LOCKED'),
(4,'A1','AVAILABLE'),
(5,'A1','BOOKED');


INSERT INTO seats(flight_id, seat_number, seat_status)
values(1,'B1','AVAILABLE');
INSERT INTO bookings (user_id, flight_id, seat_id, booking_status) VALUES
(1,1,1,'CONFIRMED'),
(2,2,2,'CONFIRMED'),
(3,3,3,'CONFIRMED'),
(4,4,4,'CANCELLED'),
(5,5,5,'CONFIRMED');

INSERT INTO payments (booking_id, amount, payment_status) VALUES
(1,5000,'SUCCESS'),
(2,4500,'SUCCESS'),
(3,4000,'FAILED'),
(4,3500,'REFUNDED'),
(5,4800,'PENDING');

select * from users;
select * from flights;
select * from seats;
select * from bookings;
select * from payments;

--QUERIES 
--joins
--1. create join for the user who have bookings with their booking id and name
select u.full_name , b.booking_id from 
users u inner join bookings b 
on u.user_id= b.user_id;

--2.show all user with booking or without booking
select u.full_name , b.booking_id from 
users u inner join bookings b 
on u.user_id= b.user_id;

--3. show all flights with no bookings
select f.flight_id, f.source, f.destination, b.booking_id 
from bookings b right join flights f
on f.flight_id = b.flight_id;

--4.show all users with all the bookings
select u.full_name , b.booking_id
from bookings b full join users u
on u.user_id =b.user_id;

--5.show every user with every flight
select u.full_name , f.flight_id from 
users u cross join flights f;

--6. show all users with the source and destinaton
select u.full_name , f.source ,f.destination
from bookings b join users u on b.user_id=  u.user_id 
join flights f on b.flight_id = f.flight_id;

--7. show seat number with payment status
select s.seat_number , p.payment_status 
from bookings b join seats s on b.seat_id= s.seat_id
join payments p on b.booking_id = p.booking_id;

--indexing
--8.creat index using user email 
create index idx_user_email
on users(email);
--serach using index email
select * from users where email='aasana@gmail.com'; 

--9.Create index for faster joins on bookings.
--index on forign key for the booking table on userid
create index idx_booking_user on bookings(user_id);

select * from bookings where user_id=5;

--count no. bookings per flight - group by flights
select f.flight_id ,count(b.booking_id) as total_bookings
from flights f left join bookings b on f.flight_id= b.flight_id
group by f.flight_id order by total_bookings;

--views
--10. create a view for the availabe seats
create view vw_available_seats as 
select * from seats where seat_status='AVAILABLE';

select * from vw_available_seats;

--11.create a materilized view to store the booking details 
create materialized view vw_booking_details as
select 
u.full_name,
f.source,
f.destination,
s.seat_number,
p.payment_status
from bookings b
join users u on b.user_id= u.user_id 
join flights f on b.flight_id = f.flight_id
join seats s on b.seat_id = s.seat_id
join payments p on b.booking_id = p.booking_id;
REFRESH MATERIALIZED VIEW vw_booking_details;

select * from vw_booking_details;

--12.create a function for count bookings of a flight 
create or replace function count_bookings(fid int)
returns int
language sql
as $$
select  count(*) from bookings where flight_id=fid;
$$;

select count_bookings(4);

--13.create a function such that the user who has done payment > 3000 is
--gold and less than that sliver form payment booking and users 
create or replace function get_user_category()
returns table(
user_id int,
full_name varchar,
total_payment numeric,
category varchar
)

LANGUAGE plpgsql

as $$
begin
return query
select 

u.user_id,
u.full_name,

COALESCE(sum(
case
when p.payment_status='SUCCESS'
then p.amount
end),0) as total_payment,

case 
when 
COALESCE(sum(
case
when p.payment_status='SUCCESS'
then p.amount
end),0) >3000 
then 'GOLD'::VARCHAR 
else 'SILVER'::VARCHAR
END AS category

from users u
left join bookings b
on u.user_id =b.user_id
left join payments p 
on b.booking_id =p.booking_id
group by u.user_id ,u.full_name;

end;
$$

select * from get_user_category();

--creating trigger using trigger function
--13.when payment is success for that particular seat id then make it automalically booked seat
create or replace function auto_book_seat()
returns trigger as $$
DECLARE v_seat_id int;
begin

if new.payment_status ='SUCCESS' 
and old.payment_status <> 'SUCCESS' then
SELECT seat_id
into v_seat_id
from bookings
where booking_id=new.booking_id;

if v_seat_id is not null then
update seats
set seat_status = 'BOOKED'::seat_status_enum
where seat_id = v_seat_id;
end if;
end if;

return new;

end;
$$ language plpgsql;

--using the trigger function in payment table

create trigger trg_auto_book_seat
after update of payment_status
on payments
for each row
execute function auto_book_seat();

--verifying the trigger

update seats set seat_status='LOCKED' where flight_id=5;

SELECT *
FROM bookings
WHERE booking_id = 5;

SELECT * FROM seats WHERE seat_id = 5;

UPDATE payments 
SET payment_status='FAILED'
WHERE booking_id=5;

UPDATE payments 
SET payment_status='SUCCESS'
WHERE booking_id=5;

SELECT s.*
FROM seats s
JOIN bookings b ON s.seat_id=b.seat_id
WHERE b.booking_id=5;

--queris using the flow
--1.search flights from mumbai to delhi
select * from flights where source='Mumbai' and destination='Delhi'
and flight_date='2026-05-01';

--2.search seat for the flightid 1 from seat
select seat_id , seat_number from seats where flight_id=1
and seat_status='AVAILABLE';

--3.FOR temporaray locked seat when user have selected seat for seatid 6 here
begin;
update seats 
set seat_status='LOCKED'
WHERE seat_id=6;
commit;

SELECT * 
FROM seats 
WHERE flight_id = 1 AND seat_number = 'B1';

--4. create a booking for seat_id =6
INSERT INTO bookings(user_id, flight_id, seat_id)
VALUES (6, 1, 6);

SELECT * FROM bookings WHERE seat_id = 6;
--5. payment entries
INSERT INTO payments (booking_id, amount, payment_status)
VALUES (6, 8000, 'PENDING');

select * from payments;

--6. payment success and confirm seat

UPDATE payments
SET payment_status='SUCCESS'
WHERE booking_id=6;

UPDATE seats
SET seat_status='BOOKED'
WHERE seat_id=6;

commit;

--per flight payment
SELECT 
    f.flight_id,
    f.source,
    f.destination,
    f.flight_date,
    SUM(p.amount) AS total_payment
FROM flights f
JOIN bookings b 
    ON f.flight_id = b.flight_id
JOIN payments p 
    ON b.booking_id = p.booking_id
GROUP BY 
    f.flight_id,
    f.source,
    f.destination,
    f.flight_date
ORDER BY f.flight_date;

--per day total 
SELECT
    DATE(payment_date) AS day,
    SUM(amount) AS total_payment
FROM payments
GROUP BY DATE(payment_date)
ORDER BY day;

--user who have done max payment
SELECT 
    u.user_id,
    u.full_name,
    SUM(p.amount) AS total_paid
FROM users u
JOIN bookings b 
    ON u.user_id = b.user_id
JOIN payments p 
    ON b.booking_id = p.booking_id

GROUP BY u.user_id, u.full_name
ORDER BY total_paid DESC
LIMIT 1;

--one user per flight booking name, total no. of seats, flightid ,amount
SELECT
    b.flight_id,
    u.full_name,
    COUNT(b.seat_id) AS total_seats,
    SUM(p.amount) AS total_amount
FROM bookings b
JOIN users u
    ON b.user_id = u.user_id
JOIN payments p
    ON b.booking_id = p.booking_id
GROUP BY b.flight_id, u.full_name
ORDER BY b.flight_id;

