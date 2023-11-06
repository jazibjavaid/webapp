#!/bin/bash

# Install PostgreSQL and PostgreSQL contrib packages
#sudo apt install postgresql postgresql-contrib -y
#psql --version

# Install Node.js and npm
sudo apt install nodejs npm -y
node -v


#POSTGRES_PASSWORD="mydata"
#sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '$POSTGRES_PASSWORD';"

sudo groupadd myusrgrp
sudo useradd -s /bin/false -g myusrgrp -d /opt/mywebappdir -m webappusr

sudo mv /tmp/webapp.zip /opt/mywebappdir/webapp.zip
cd /opt/mywebappdir && sudo unzip ./webapp.zip

sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo mv /tmp/cloudwatch_config.json /opt/mywebappdir/cloudwatch_config.json

sudo chown -R webappusr:myusrgrp /opt/mywebappdir