#!/bin/bash

# Start Backend Server
echo "Navigating to backend directory and starting Backend Server..."
cd backend || { echo "Error: Failed to navigate to backend directory."; exit 1; }
pm2 start dist/main.js --name "Backend Server" || { echo "Error: Failed to start Backend Server."; exit 1; }

# Start Web App
echo "Navigating to web_app directory and starting Web App..."
cd ../web_app/Runner_webapp || { echo "Error: Failed to navigate to web_app directory."; exit 1; }
pm2 start main.js --name "Web App" || { echo "Error: Failed to start Web App."; exit 1; }

# Start Admin Web App
echo "Navigating to admin_web_app directory and starting Admin Web App..."
cd ../../admin_web_app/Runner_webapp || { echo "Error: Failed to navigate to admin_web_app directory."; exit 1; }
pm2 start main.js --name "Admin Web App" || { echo "Error: Failed to start Admin Web App."; exit 1; }

# Save PM2 process list and ensure PM2 startup
echo "Saving PM2 process list and setting up PM2 startup..."
pm2 save || { echo "Error: Failed to save PM2 processes."; exit 1; }
pm2 startup || { echo "Error: Failed to setup PM2 startup."; exit 1; }

echo "All services started successfully."
