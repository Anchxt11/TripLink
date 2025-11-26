-- Add phone_number column to users table
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(15) UNIQUE AFTER email;
