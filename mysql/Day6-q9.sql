--create table temp
CREATE TABLE #Numbers(Value INT);

--insert 10 numbers with while loop
DECLARE @i INT=1;
WHILE @i<=10
BEGIN
INSERT INTO #Numbers VALUES(@i);
SET @i=@i+1;
END;

SELECT * 
FROM #Numbers;

--iterate with while
DECLARE @num INT;
DECLARE @lastValue INT = 0;

WHILE EXISTS (SELECT 1 FROM #Numbers WHERE Value > @lastValue)
BEGIN
    SELECT @num = MIN(Value)
    FROM #Numbers
    WHERE Value > @lastValue;

    SELECT @num AS Number;

    SET @lastValue = @num;
END;


--while with continue 
DECLARE @num1 INT;
DECLARE @lastValue1 INT = 0;

WHILE EXISTS (SELECT 1 FROM #Numbers WHERE Value > @lastValue1)
BEGIN
    SELECT @num1 = MIN(Value)
    FROM #Numbers
    WHERE Value > @lastValue1;

    SET @lastValue1 = @num1;   -- move pointer forward

    IF (@num1 % 2 = 0)
        CONTINUE;

    SELECT @num1 AS Number;
END;

--while with break
DECLARE @num2 INT;
DECLARE @lastValue2 INT = 0;

WHILE EXISTS (SELECT 1 FROM #Numbers WHERE Value > @lastValue2)
BEGIN
    SELECT @num2 = MIN(Value)
    FROM #Numbers
    WHERE Value > @lastValue2;

    SET @lastValue2 = @num2;

    IF @num2 = 5
        BREAK;

    SELECT @num2 AS Number;
END;