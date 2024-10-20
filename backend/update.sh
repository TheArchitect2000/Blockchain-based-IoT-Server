#!/bin/bash

# Navigate to the backend directory
cd backend || { echo "Error: Failed to navigate to backend directory."; exit 1; }

echo "Installing new packages for backend via npm..."
if npm install; then
    echo "Packages for backend installed successfully."
else
    echo "Error: Failed to install backend packages."
    exit 1
fi

echo "Building backend..."
if npm run build; then
    echo "Backend build completed successfully."
else
    echo "Error: Backend build failed."
    exit 1
fi

# Go back to the base directory
cd ../ || { echo "Error: Failed to return to base directory."; exit 1; }

# Build and move for web_app
echo "Navigating to web_app..."
cd web_app/Source_webapp || { echo "Error: Failed to navigate to web_app directory."; exit 1; }

echo "Installing new packages for web_app via npm..."
if npm install; then
    echo "Packages for web_app installed successfully."
else
    echo "Error: Failed to install web_app packages."
    exit 1
fi

echo "Building web_app..."
if npm run build; then
    echo "web_app build completed successfully."
    echo "Cleaning up Runner_webapp frontend folder..."
    rm -rf "../Runner_webapp/frontend"
    mkdir "../Runner_webapp/frontend"
    echo "Moving web_app files to Runner_webapp/frontend..."
    mv build/* ../Runner_webapp/frontend/ || { echo "Error: Failed to move web_app files."; exit 1; }
    echo "web_app files moved successfully."
else
    echo "Error: web_app build failed."
    exit 1
fi

# Go back to the base directory
cd ../../ || { echo "Error: Failed to return to base directory."; exit 1; }

# Build and move for admin_web_app
echo "Navigating to admin_web_app..."
cd admin_web_app/Source_webapp || { echo "Error: Failed to navigate to admin_web_app directory."; exit 1; }

echo "Installing new packages for admin_web_app via npm..."
if npm install; then
    echo "Packages for admin_web_app installed successfully."
else
    echo "Error: Failed to install admin_web_app packages."
    exit 1
fi

echo "Building admin_web_app..."
if npm run build; then
    echo "admin_web_app build completed successfully."
    echo "Cleaning up Runner_webapp frontend folder..."
    rm -rf "../Runner_webapp/frontend"
    mkdir "../Runner_webapp/frontend"
    echo "Moving admin_web_app files to Runner_webapp/frontend..."
    mv build/* ../Runner_webapp/frontend/ || { echo "Error: Failed to move admin_web_app files."; exit 1; }
    echo "admin_web_app files moved successfully."
else
    echo "Error: admin_web_app build failed."
    exit 1
fi

# Go back to the base directory
cd ../../ || { echo "Error: Failed to return to base directory."; exit 1; }

# Restarting PM2 services
echo "Listing PM2 processes..."
pm2 list || { echo "Error: Failed to list PM2 processes."; exit 1; }
echo "Restarting all PM2 processes..."
pm2 restart all || { echo "Error: Failed to restart PM2 processes."; exit 1; }
echo "Saving PM2 process list..."
pm2 save || { echo "Error: Failed to save PM2 processes."; exit 1; }

echo "Update process completed successfully."