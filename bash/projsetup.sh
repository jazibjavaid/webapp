#!/bin/bash

# Update the package lists
sudo apt update

# Install PostgreSQL and PostgreSQL contrib packages
sudo apt install postgresql postgresql-contrib -y

# Install Node.js and npm
sudo apt install nodejs npm -y

# Install unzip 
apt install unzip

# Check the installed Node.js version
node -v

# Output the PostgreSQL version
psql --version

# Get into postgres
su - postgres
psql

# Alter password for database
ALTER USER postgres PASSWORD 'mydata';

# Exit postgres
\q
exit

