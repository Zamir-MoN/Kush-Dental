#!/bin/bash
sudo -u postgres psql -d kush_dental_prod -c "SELECT 1;"
sudo -u postgres psql -d kush_dental_prod -c "\dt"
pm2 status
pm2 logs kush-dental-backend --lines 50 --nostream
