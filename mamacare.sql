CREATE DATABASE mamacare_db;
CREATE USER 'mamacare_user'@'localhost' IDENTIFIED BY '12345';
GRANT ALL PRIVILEGES ON mamacare_db.* TO 'mamacare_user'@'localhost';
FLUSH PRIVILEGES;