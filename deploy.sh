#!/bin/bash
set -ex

# 1. Install missing system dependencies
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3.14-dev python3-dev build-essential

# 2. Setup python backend
cd /home/ubuntu/dev/Kush-Dental-main/python_backend
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
chmod +x start.sh

# 3. Setup frontend
cd ../frontend
npm install
npm run build

# 4. Start PM2
cd /home/ubuntu/dev/Kush-Dental-main
pm2 start ecosystem.config.js
pm2 save
