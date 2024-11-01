# User Database Project

A client-server application for user registration and search functionality using MySQL and XAMPP. This project allows users to register, sign in, and perform various searches on a user database based on multiple criteria.

## Table of Contents

- [Project Setup](#project-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [How to Use](#how-to-use)
- [License](#license)

## Project Setup

### Backend Setup

1. **Navigate to the `Server` directory**:
   ```bash
   cd path/to/UserDatabaseProject/Backend
2. Initialize the node.js project
npm init -y

3. Install required packages
npm install express mysql cors nodemon dotenv

4. Configure the environment variables:
Create a file named .env in the Backend directory and add the following:
PORT=5050
USER=root
PASSWORD=
DATABASE=web_app
DB_PORT=3306
HOST=localhost

5. Start thr backend server:
npm start

## Frontend Setup:
Open the following URLs in your web browser:
Login Page: http://127.0.0.1:5501/Client/LoginPage.html
Registration Page: http://127.0.0.1:5501/Client/RegistrationPage.html
Search Directory: http://127.0.0.1:5501/Client/SearchDirectory.html
The pages should load correctly if the server is running and XAMPP is properly set up.
Features

User Registration: New users can create an account by entering their username, password, first name, last name, salary, and age.
User Sign-In: Registered users can log in using their username and password.
Search Users by First and/or Last Name: Users can search for others based on their first or last names.
Search Users by User ID: Allows searching users using their unique user ID.
Search Users by Salary Range: Query users whose salary falls between specified values (X and Y).
Search Users by Age Range: Find users whose ages fall within a defined range (X and Y).
Search Users Who Registered After a Specific User: Identify users who registered after a specified user by their user ID.
Search Users Who Never Signed In: Generate a list of users who have registered but never logged in.
Search Users Registered on the Same Day as a Specific User: Find users who registered on the same day as a given user (e.g., John).
Return Users Who Registered Today: Fetch all users who registered on the current date.
Technologies Used

## Backend:
Node.js with Express for server-side logic
MySQL for database management
CORS for handling cross-origin requests
dotenv for managing environment variables
Frontend:
HTML/CSS for user interface
JavaScript for client-side interactions
Development Tools:
XAMPP for running the local MySQL database
npm for package management

## Database Schema

The database schema consists of a Users table created with the following SQL command:
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50), -- Consider encrypting or hashing passwords
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    salary FLOAT,
    age INTEGER,
    registerday DATE,
    signintime DATETIME
);

## How to Use

Start the XAMPP server:
Ensure that Apache and MySQL are running in the XAMPP control panel.
Access the application:
Use the provided URLs to access the login, registration, and search pages.
Register a new user:
Fill in the registration form with the required details and submit.
Sign in with your credentials:
After registering, use your username and password to log in.
Perform searches:
Navigate to the search page and utilize the available search functionalities to retrieve user information based on various criteria.









    

