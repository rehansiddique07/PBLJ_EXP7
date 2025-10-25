CREATE DATABASE IF NOT EXISTS schooldb;
USE schooldb;

-- Part A: Employee table
CREATE TABLE IF NOT EXISTS Employee (
  EmpID INT PRIMARY KEY,
  Name VARCHAR(100),
  Salary DOUBLE
);

-- Part B: Product table
CREATE TABLE IF NOT EXISTS Product (
  ProductID INT PRIMARY KEY AUTO_INCREMENT,
  ProductName VARCHAR(150),
  Price DOUBLE,
  Quantity INT
);

-- Part C: Student table
CREATE TABLE IF NOT EXISTS Student (
  StudentID INT PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(150),
  Department VARCHAR(100),
  Marks INT
);

-- Sample data for Employee
INSERT INTO Employee VALUES 
  (1, 'Alice', 50000),
  (2, 'Bob', 45000),
  (3, 'Charlie', 55000)
ON DUPLICATE KEY UPDATE Name=Name;

-- Sample data for Product
INSERT INTO Product (ProductName, Price, Quantity) VALUES 
  ('Mouse', 399.0, 50),
  ('Keyboard', 699.0, 30),
  ('Monitor', 8999.0, 15)
ON DUPLICATE KEY UPDATE ProductName=ProductName;

-- Sample data for Student
INSERT INTO Student (Name, Department, Marks) VALUES 
  ('Mabud', 'CSE', 85),
  ('Zara', 'ECE', 90),
  ('Arjun', 'CSE', 78)
ON DUPLICATE KEY UPDATE Name=Name;
