# TripLink Database Setup

## Prerequisites
To use a MySQL database with this project, you need to have **MySQL Server** installed on your computer.

If you don't have it, you can download it from: [MySQL Community Downloads](https://dev.mysql.com/downloads/installer/)

## Setting up the Database
1. Open your MySQL Command Line Client or a tool like MySQL Workbench.
2. Login to your MySQL server.
3. Run the contents of the `database_setup.sql` file included in this directory.

You can do this via command line if MySQL is in your PATH:
```bash
mysql -u root -p < database_setup.sql
```

## Connecting to the Website
**Important**: Your static HTML/CSS/JS website cannot connect directly to this database for security reasons.

To make the website functional with this database, you need a **Backend API**.
Common choices are:
- **Node.js** (using Express and mysql2)
- **Python** (using Django or Flask)
- **PHP**

The backend will:
1. Receive data from your HTML forms (Login, Register, Offer Ride).
2. Connect to the MySQL database.
3. Save or Retrieve the data.
4. Send the result back to your website.
