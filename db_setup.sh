#!/bin/bash
sudo -u postgres psql -c "CREATE USER kush_dental_dev WITH PASSWORD 'KushDentalDevSecret123!';"
sudo -u postgres psql -c "CREATE DATABASE kush_dental_dev OWNER kush_dental_dev;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kush_dental_dev TO kush_dental_dev;"
