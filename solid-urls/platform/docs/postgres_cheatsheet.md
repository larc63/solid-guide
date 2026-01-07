Postgres cheat sheet
====================

Databases
---------

#### List PostgreSQL databases

`\l`

// List all databases using \l (or \list) (psql)

`\l+`

// List all databases using \l+ with more details (including description, tablespace & DB size) (psql)

#### Help on `CREATE DATABASE` command syntax

`\h CREATE  DATABASE`

// Help on SQL Command Syntax (For e.g. CREATE DATABASE) (psql)

#### Create database

`CREATE  DATABASE mytest;`

// Creates a new database "mytest" (SQL)

By default, the owner of the database is the current login user.

`\c test You are now connected to  database  "test"  as  user  "postgres".`

// Connect to a PostgreSQL database "test" as "postgres" user (psql)

Tables
------

#### Show table

`\d TABLE_NAME`

// Show table definition including indexes, constraints & triggers (psql)

#### Show details

`\d+ TABLE_NAME`

// More detailed table definition including description and physical disk size (psql)

#### List tables from current schema

`\dt`

// List tables from current schema (psql)

#### List tables from all schemas

`\dt *.*`

// List tables from all schemas (psql)

#### List tables for a schema

`\dt <name-of-schema>.*`

// List the tables in a specific schema (psql)

#### Copy table data to CSV file

`\copy (SELECT  *  FROM __table_name__)  TO  'file_path_and_name.csv'  WITH CSV`

// Export a table as CSV (psql)

#### Check indexes for a table using sql

`SELECT  *  FROM pg_indexes WHERE tablename='__table_name__'  AND  schemaname='__schema_name__';`

// Show table indexes (SQL)

#### Collects statistics about the contents of tables

`ANALYZE  [__table__]`

// Analyze a table and store the results in the pg_statistic system catalog (SQL)

With no parameter, `ANALYZE` examines every table in the current database

#### Adding comment on table/column

Comment on table employee is 'Stores employee records';

`// Comment on table (SQL)`

Comment on column employee.ssn is 'Employee Social Security Number';

`// Comment on column (SQL)`

#### Approximate table row count / table cardinality

`SELECT reltuples AS card FROM pg_class WHERE relname =  '<table_name>';`

// Use this to do fast (but not exact) counts from tables. Helpful if a table has millions/billions of records and you just want estimated rows quickly. (SQL)

Connecting
----------

#### Login using PostgreSQL user

`$ ssh -l postgres 200.34.22.75  postgres@200.34.22.75's password: Linux localhost 4.9.0-9-amd64 #1 SMP Debian 4.9.168-1 (2019-04-12) x86_64`

// Login as PostgreSQL superuser "postgres" on remote PostgreSQL server using ssh (Linux)

`root@localhost:~# su - postgres`

// Login as PostgreSQL superuser "postgres" (Linux)

[Learn how to test your PostgreSQL connection](https://www.timescale.com/blog/how-to-test-your-postgresql-connection?__hstc=231067136.820f73b7f8c5f085613ee85ecf2768af.1763734253320.1763734253320.1763734253320.1&__hssc=231067136.1.1763734253320&__hsfp=2689941607).

#### Enter PostgreSQL terminal

`postgres@localhost:~$ psql psql (9.6.12)Type  "help"  for help.postgres=#`

// Enter PostgreSQL Command Line via "psql" client (psql)

#### Connect database

`\c test You are now connected to  database  "test"  as  user  "postgres".`

// Connect to a PostgreSQL database "test" as "postgres" user (psql)

#### Check psql client version

`$ psql -V psql (PostgreSQL)  9.6.12`

// Check psql client version (psql)

#### Check Postgres server version

`select version();  version -----------------------------------------------------------------------------------------------------------  PostgreSQL 9.6.12  on x86_64-pc-linux-gnu, compiled by gcc (Debian 6.3.0-18+deb9u1)  6.3.0  20170516,  64-bit  (1  row)`

// Check Postgres server version (SQL)

Queries
=======

#### Create a new table

`CREATE  TABLE  IF  NOT  EXISTS employee (  emp_id SERIAL  PRIMARY  KEY,  -- AUTO_INCREMENT integer, as primary key  emp_name VARCHAR(50)  NOT  NULL,  emp_salary NUMERIC(9,2)  NOT  NULL  );  `// Creates a new table (SQL)

#### Display table

`\d employee Table  "public.employee"  Column  |  Type  | Modifiers ------------+-----------------------+-----------------------------------------------------------  emp_id |  integer  |  not  null  default nextval('employee_emp_id_seq'::regclass)  emp_name |  character  varying(50)  |  not  null  emp_salar |  numeric(9,2)  |  not  null  Indexes: "employee_pkey"  PRIMARY  KEY,  btree  (emp_id)  `// Display table (psql)

#### Insert query

`INSERT  INTO employee (emp_name, emp_salary)  VALUES  ('John',  5000),  ('Jack',  4568.0),  ('Robert',7500.50);`

// Insert records into table (SQL)

#### Conditional select query

`select  *  from employee where emp_salary >=  5000;  emp_id | emp_name | emp_salary --------+----------+------------  1  | John |  5000.00  3  | Robert |  7500.50  (2  rows)  `// Select data based on filter condition (e.g. emp_salary >= 5000) (SQL)

#### Conditional update query (Safe Update);

`BEGIN;  update employee set emp_salary =  6000  where emp_name =  'John';  COMMIT;`

// Update record based on a condition (e.g. Update emp_salary for employee 'John') (SQL)

Records are not committed inside database unless you issue a commit. Updates can be undone as well if you issue `ROLLBACK` command instead of `COMMIT`.

Functions
---------

#### Create a new function

`$$ CREATE  FUNCTION  add(integer,  integer)  RETURNS  integer  AS  'select $1 + $2;'  LANGUAGE  SQL  IMMUTABLE RETURNS  NULL  ON  NULL INPUT;  $$`

// Create a function to add 2 integers (SQL)

This function takes two integers as parameters `IMMUTABLE` means that the function cannot modify the database and always returns the same result when given the same argument values.

#### Calling function

`select  add(5,9);  add  -----  14  (1  row)`

// Function call (SQL)

#### List functions

`\df List of functions Schema  | Name | Result data  type  | Argument data  types  |  Type  --------+------+------------------+---------------------+--------  public  |  add  |  integer  |  integer,  integer  | normal (1  row)`

// Display all Functions (psql)

`\df+`

// Display all functions and additional information, including owner, source code, and description, etc. (psql)

#### Edit function

`\ef myfunction`

// Edit a function in default editor (psql)

Views
=====

Listing PostgreSQL views helps in comprehending the database structure, optimizing queries, analyzing dependencies, documentation, and maintaining security and access control.

#### List views

`\dv`

// List views from current schema (psql)

`\dv *.*`

// List views from all schemas (psql)

Users
=====

#### Set/reset Postgres user password

`\password username`

// To set/reset a password for PostgreSQL database user (psql)

For example: Change password for current user "postgres":

`\password postgres Enter new password: xxxx Enter it again: xxxx`

#### Show all users

`select  *  from pg_user;  `// Display PostgreSQL database users (SQL)

`\du List of roles Role name | Attributes | Member of  -----------+------------------------------------------------------------+-----------  testrole |  | {} postgres | Superuser,  Create role,  Create DB,  Replication, Bypass RLS | {}`

// Display PostgreSQL database roles (psql)

### Login & enter PostgreSQL terminal

`$ psql -U testuser mytest Password for  user testuser: ......  psql (9.6.12)  Type  "help"  for help.`

// Login to PostgreSQL: psql -U user database (psql)

Indexes
=======

#### Create a new index on a table

`create index idx_employee_emp_name on employee using btree (emp_name asc);`

// Create a new index on the emp_name column of the employee table (SQL)

This index specifies "btree" as the index method and uses "asc" to store the index key column data in ascending order.

#### View indexes of a table

`\d employee postgres=# \d employee;  Table  "public.employee"  Column  |  Type  | Modifiers ------------+-----------------------+-----------------------------------------------------------  emp_id |  integer  |  not  null  default nextval('employee_emp_id_seq'::regclass)  emp_name |  character  varying(50)  |  not  null  emp_salary |  numeric(9,2)  |  not  null  Indexes: "employee_pkey"  PRIMARY  KEY,  btree  (emp_id)  "idx_employee_emp_name"  btree  (emp_name)`

// List indexes of a table along with table definition (psql)

#### List all indexes

`\di List of relations Schema  | Name |  Type  | Owner |  Table  --------+-----------------------+-------+----------+----------  public  | employee_pkey |  index  | postgres | employee public  | idx_employee_emp_name |  index  | postgres | employee (2  rows)`

// List all indexes from all tables (psql)

*Database indexes in Timescale work the same as in regular PostgreSQL. *When working with Timescale's hypertables (which abstract partitioning, taking care of it automatically), Timescale will also create the indexes automatically. [Try Timescale for free today](https://console.cloud.timescale.com/signup?__hstc=231067136.820f73b7f8c5f085613ee85ecf2768af.1763734253320.1763734253320.1763734253320.1&__hssc=231067136.1.1763734253320&__hsfp=2689941607).

#### Drop index from a table

`drop index idx_employee_emp_name;`

// Drop an existing index from a table (SQL)

Constraints
===========

Postgres constraints are rules enforced on data columns within a table to maintain data integrity and prevent the insertion of invalid data.

#### Create a table with primary & unique constraints

`$$ CREATE  TABLE  IF  NOT  EXISTS employee (  emp_id SERIAL  `PRIMARY`  KEY,  emp_name VARCHAR(50)  NOT  NULL,  emp_ssn VARCHAR  (30)  NOT  NULL  `UNIQUE`,  emp_salary NUMERIC(9,2)  NOT  NULL  );  $$`

// Creates a new table with primary & unique key constraints (SQL)

Primary Key Constraint: Enforces the uniqueness of a column or a set of columns, ensuring that each row in a table is uniquely identified.

Unique Constraint: Ensures that all values in a column or a set of columns are distinct, except for null values.

#### Avoid duplicate records

`INSERT  INTO employee (emp_name, emp_ssn, emp_salary)  values  ('Rohit',  '1234',  5000.0);  INSERT  0  1  INSERT  INTO employee (emp_name, emp_ssn, emp_salary)  values  (Mason,  '1234',  7500.0);  ERROR: duplicate  key  value violates unique  constraint  "employee_emp_ssn_key"  DETAIL: Key  (emp_ssn)=(1234) already exists.`

// Insert records in a table with unique key constraints specified (SQL)

This table uses `emp_id` as primary key column (Keyword "primary") and a unique constraint (Keyword "unique") is specified on employee social security number (`emp_ssn`) to avoid duplicate ssn being entered.

#### Create a table with check constraint

`$$ CREATE  TABLE orders(  ord_no integer,  ord_date date,  ord_qty numeric,  ord_amount numeric  `CHECK (ord_amount>0)`  );  $$`

// Creates a new table with check constraint specified (SQL)

`insert  into orders(ord_no, ord_date, ord_qty, ord_amount)  values  (1,  '2019-08-29',  1,  10);  INSERT  0  1  insert  into orders(ord_no, ord_date, ord_qty, ord_amount)  values  (2,  '2019-08-29',  1,  0);  ERROR: new row  for relation "orders" violates check  constraint  "orders_ord_amount_check"  DETAIL: Failing row  contains  (2,  2019-08-29,  1,  0).`

// Insert records in table with check constraints specified (SQL)

Check constraint (Keyword "check") is specified on order amount (`ord_amount > 0`) on table so any records with `ord_amount <=0` will fail to insert.

Check Constraint: Verifies that all values in a column or a set of columns satisfy a specified condition or expression.

#### Define relation between two tables (foreign key constraint)

`$$ CREATE  TABLE  IF  NOT  EXISTS department (  dept_id SERIAL  PRIMARY  KEY,  dept_name VARCHAR(50)  NOT  NULL  );  $$ CREATE  TABLE  $$ CREATE  TABLE  IF  NOT  EXISTS employee (  emp_id SERIAL  PRIMARY  KEY,  emp_name VARCHAR(50)  NOT  NULL,  emp_ssn VARCHAR  (30)  NOT  NULL  UNIQUE,  emp_salary NUMERIC(9,2)  NOT  NULL,  emp_dept_id INTEGER  `REFERENCES` department (dept_id)  -- Foreign Key  );  $$ CREATE  TABLE`

// Creates table department & employee and defines a relation of an employee to department using foreign key ("REFERENCES") (SQL)

Foreign Key Constraint: Establishes a link between data in two tables, enforcing referential integrity by preserving the relationships between the linked tables.

#### Check constraints on a table (using \d option)

`\d employee;  Table  "public.employee"  Column  |  Type  | Modifiers -------------+-----------------------+-----------------------------------------------------------  emp_id |  integer  |  not  null  default nextval('employee_emp_id_seq'::regclass)  .  .  .  Indexes: "employee_pkey"  PRIMARY  KEY,  btree  (emp_id)  "employee_emp_ssn_key"  UNIQUE  CONSTRAINT,  btree  (emp_ssn)  Foreign-key constraints: "employee_emp_dept_id_fkey"  FOREIGN  KEY  (emp_dept_id)  REFERENCES department(dept_id)`

// Display constraints on a table (using \d option) (psql)

Identifiers
===========

#### String concatenate operator [ string || string ]

`select  'Gordon'  ||  ' '  ||  'Moore'  As fullName;  fullname --------------  Gordon Moore (1  row)`

// Concatenates two or more strings using "||". (SQL)

This operator can be applied on table columns as well. e.g. "select first_name || ' ' || last_name As fullName from person".

#### Square & cube root operator (|/ & ||/)

`select  |/25  As sqrt;  sqrt ------  5  (1  row)`

// Square root operator. (SQL)

`select  ||/125  As cubert;  cubert ------  5  (1  row)`

// Cube root operator. (SQL)

#### Factorial operator (!)

`select  5!  As factorial;  factorial -----------  120  (1  row)`

// Factorial operator. (SQL)

#### Binary complement operator (~)

`select  ~60  As compl;  compl ----------  -61  (1  row)`

// Binary 2's complement. This operator has a flipping effect on bits. (SQL)

Assume if A = 60, now in binary format they will be as follows - A = 0011 1100 ~A = 1100 0011 (flipping bits. change 0 to 1 & 1 to 0).

#### String lower & upper function [ lower(string), upper(string) ]

`select lower('Rohit Kumawat')  As lowerCase, upper('Rohit Kumawat')  As upperCase;  lowercase | uppercase ---------------+---------------  rohit kumawat | ROHIT KUMAWAT (1  row)`

// Postgres lower & upper function (SQL)

#### Number of characters in string [ char_length(string) ]

`select char_length('Arizona')  as num_chars;  num_chars -----------  7  (1  row)`

// Number of characters in string (SQL)

#### Location of specified substring [ position(substring in string) ]

`select position('pan'  in  'japan')  As pos;  pos -----  3  (1  row)`

// Location of specified substring (SQL)

#### Extract substring [ substring(string from [int] for [int] ]

`select substring('postgres'  from  3  for  3)  As sub_string;  sub_string ------------  stg (1  row)`

// Extract substring 'postgres' starting from third character up to three characters length (SQL)

#### Insert newline in SQL output

`postgres=# select 'line 1'||E'\n'||'line 2' As newline;  newline ---------  line 1  +  line 2  (1  row)`

// Insert new line using `E'\n'` (SQL)

Another option is to use the `chr()` function. (E is used for the Escape String constant). Here's a few other escape sequences: \b backspace \f form feed \n newline \r carriage return \t tab.

#### Quote identifier

`Update "my table" set "a&b" = 0;`

// Using double quotes as delimited identifier

This allows constructing table or column names that would otherwise not be possible, such as ones containing spaces or ampersands. Also double quotes are used for escaping reserved keywords in PostgreSQL.

#### Dollar-quoted string constant

`select $$Maria's dogs$$ As col;  col --------------------  Maria's dogs (1  row)`

// Use dollar quotes string constant instead of double quotes for strings (SQL)

If a string contains many single quotes or backslashes then PostgreSQL has an alternative called "dollar quoting."

Maintenance
-----------

#### Garbage collect (reclaim storage)

`VACUUM [__Table__]  vacuum(verbose,  analyze) employee;  INFO: vacuuming "public.employee"  INFO: scanned index  "employee_pkey"  to remove 1  row versions .  .  .  sample,  1 estimated total rows  VACUUM`

// Use the vacuum command to reclaim storage from deleted rows in the employee table (SQL)

1\. Table rows that are deleted or obsoleted by an update are not physically removed from their table; they remain present until a `VACUUM` command is executed. Therefore it's necessary to do `VACUUM` periodically, especially on frequently-updated tables. 2. Verbose Prints a detailed vacuum activity report for each table. 3. Analyze update statistics for table.

#### Gather statistics

`ANALYZE  [__table__]  analyze verbose employee;  INFO: analyzing "public.employee"  INFO: "employee": scanned 1  of  1 pages, containing 1 live rows  and  0 dead rows;  1  rows  in sample,  1 estimated total rows  ANALYZE`

// Analyzes a table and stores the results in the `pg_statistic` system catalog (SQL)

1\. `ANALYZE` gathers statistics for the query planner to create the most efficient query execution plans. Accurate statistics assist planner to choose the most appropriate query plan, and thereby improve the speed of query processing.

2\. Verbose prints a detailed analyze activity report for each table.

3\. With no table name specified, `ANALYZE` examines every table in the current database.

Monitoring
----------

#### Session monitor

`SELECT  pid ,datname ,usename ,application_name ,client_hostname ,state ,client_port ,backend_start ,query_start ,query FROM pg_stat_activity `// Monitors Postgres sessions (SQL)

### Few important parameters to know

Pid - Backend process ID

Datname - Database name

Username - User running the query

Application_name - Client application name

State - State of Session (e.g., active, waiting, idle ..)

Query - Query executed

#### Cancel running query

`SELECT pg_cancel_backend(pid);  `// To cancel a running query with pid provided. This is useful in case of killing long-running queries (SQL)

#### Biggest PostgreSQL table/indexes by their sizes

`SELECT  nspname ||  '.'  || relname AS  "Object Name", relkind As  "Object Type",  pg_size_pretty(pg_relation_size(C.oid))  AS  "size"  FROM pg_class C LEFT  JOIN pg_namespace N ON  (N.oid = C.relnamespace)  WHERE nspname NOT  IN  ('pg_catalog',  'information_schema')  ORDER  BY pg_relation_size(C.oid)  DESC  LIMIT  20;`

// Top 20 big tables/indexes (excluding catalog tables) (SQL)

Backup
======

#### Database backup (with default options)

`$ pg_dump mydb > mydb.bak.sql`

// Create a backup for a database "mydb" in plain-text SQL Script file (mydb.bak.sql) (pg_dump)

Backups in Timescale are fully automated. [Learn how Timescale handles database backups and disaster recovery](https://www.timescale.com/blog/database-backups-and-disaster-recovery-in-postgresql-your-questions-answered/?__hstc=231067136.820f73b7f8c5f085613ee85ecf2768af.1763734253320.1763734253320.1763734253320.1&__hssc=231067136.1.1763734253320&__hsfp=2689941607).

#### Database backup (with customized options)

`$ pg_dump -c -C -F p -f mydb.bak.sql mydb`

// Creates a backup for a database "mydb" in plain text format with drop & create database commands included in output file mydb.bak.sql (pg_dump)

Backup options:

-- `-c`: Output commands to clean(drop) database objects prior to writing commands to create them

-- `-C`: Begin output with "CREATE DATABASE" command itself and reconnect to created database

-- `-F`: Format of the output (value p means plain SQL output and value c means custom archive format suitable for pg_restore)

-- `-f`: Backup output file name

#### Remote backup

`$ pg_dump -h <remote_host> -p <port> -U <user> -f mydb.bak mydb`

// Running pg_dump on the client computer to back up data on a remote Postgres server (pg_dump)

Use the -h flag to specify the IP address of your remote Host and -p to identify the port on which PostgreSQL is listening:

#### All databases backup

`$ pg_dumpall > alldb.bak.sql`

// Backup of all databases along with database roles and cluster-wide information. (`pg_dumpall`)

Restore
=======

#### Restore from backup file (.sql)

`$ psql -U username -f filename.sql`

// Restore database plain-text backup(.sql) generated by pg_dump or pg_dumpall with psql utility (psql)

#### Restore from custom archive backup file (.bak)

`$ pg_restore -d db_name /path/to/your/file/db_name.bak -c -U db_user`

// Restore database custom archive backup(.bak) using pg_restore utility (pg_restore)

Want to learn more about restoring your PostgreSQL database? [We put together a guide to help you](https://www.timescale.com/learn/a-guide-to-pg_restore-and-pg_restore-example?__hstc=231067136.820f73b7f8c5f085613ee85ecf2768af.1763734253320.1763734253320.1763734253320.1&__hssc=231067136.1.1763734253320&__hsfp=2689941607).

Configuration
=============

#### Stop / start PostgreSQL service

`service postgresql stop`

// Stops PostgreSQL service through root user (Linux)

`service postgresql start`

// Starts PostgreSQL service through root user (Linux)

`service postgresql restart`

// Restarts PostgreSQL service through root user (Linux)

If running from non root user you must prefix your command with "sudo" and non-root user should already be there in sudoer's list. Also be careful with running these commands because some distributors don't provide them these days.

#### Display configuration parameters

`show all`

// List all current runtime configuration parameters (psql)

#### Display configuration parameters using sql

`select * from pg_settings;`

// List all current runtime configuration parameters using SQL with additional details, including description (SQL)

#### Show current setting from "max_connections"

`SELECT current_setting('max_connections');  current_setting -----------------  100  (1  row)`

// Display current value set for "max_connections" parameter (SQL)

#### Show PostgreSQL config file location

`show config_file;  config_file ------------------------------------------  /etc/postgresql/9.6/main/postgresql.conf (1  row)  `// Show PostgreSQL configuration file location (psql)

The PostgreSQL configuration files are stored in directory from above command output. The main configuration file is called "postgresql.conf." [Want an easier way to find it](https://www.timescale.com/blog/connecting-to-postgres-with-psql-and-pg_service-conf?__hstc=231067136.820f73b7f8c5f085613ee85ecf2768af.1763734253320.1763734253320.1763734253320.1&__hssc=231067136.1.1763734253320&__hsfp=2689941607)?

#### Display contents of Postgres config file location

`postgres@localhost:~$ less /etc/postgresql/9.6/main/postgresql.conf .  .  .  .  data_directory =  '/var/lib/postgresql/9.6/main'  # use data in another directory # (change requires restart)  hba_file =  '/etc/postgresql/9.6/main/pg_hba.conf'  # host-based authentication file # (change requires restart)  ident_file =  '/etc/postgresql/9.6/main/pg_ident.conf'  # ident configuration file # (change requires restart)  listen_addresses =  '*'  # what IP address(es) to listen on; # comma-separated list of addresses; # defaults to 'localhost'; use '*' for all # (change requires restart)  port =  5432  # (change requires restart) .  .  .  .  `(Linux)

-- `data_directory` directive tells where the database files are stored.

-- `hba_file` directive tells the host based authentication file.

-- `port` directive tells the TCP port number. The default is 5432.

//End