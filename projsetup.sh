#!/bin/bash

# Install PostgreSQL and PostgreSQL contrib packages
#sudo apt install postgresql postgresql-contrib -y
#psql --version

# Install Node.js and npm
sudo apt install nodejs npm -y
node -v

# Get into postgres
#POSTGRES_PASSWORD="mydata"
#sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"

# Unzip application
cd /home/admin && unzip ./webapp.zip

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service