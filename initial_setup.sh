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
    if [ ! -d "../Runner_webapp/frontend" ]; then
        echo "Frontend folder does not exist. Creating it..."
        mkdir "../Runner_webapp/frontend"
    else
        echo "Frontend folder exists. Cleaning it up..."
        rm -rf "../Runner_webapp/frontend"
        mkdir "../Runner_webapp/frontend"
    fi
    echo "Moving web_app files to Runner_webapp/frontend..."
    mv build/* ../Runner_webapp/frontend/ || { echo "Error: Failed to move web_app files."; exit 1; }
    echo "web_app files moved successfully."
else
    echo "Error: web_app build failed."
    exit 1
fi

# Run build for web_app Runner_webapp
echo "Building Runner_webapp for web_app..."
cd ../Runner_webapp || { echo "Error: Failed to navigate to Runner_webapp directory."; exit 1; }
if npm run build; then
    echo "Runner_webapp for web_app built successfully."
else
    echo "Error: Runner_webapp build failed."
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
    if [ ! -d "../Runner_webapp/frontend" ]; then
        echo "Frontend folder does not exist. Creating it..."
        mkdir "../Runner_webapp/frontend"
    else
        echo "Frontend folder exists. Cleaning it up..."
        rm -rf "../Runner_webapp/frontend"
        mkdir "../Runner_webapp/frontend"
    fi
    echo "Moving admin_web_app files to Runner_webapp/frontend..."
    mv build/* ../Runner_webapp/frontend/ || { echo "Error: Failed to move admin_web_app files."; exit 1; }
    echo "admin_web_app files moved successfully."
else
    echo "Error: admin_web_app build failed."
    exit 1
fi

# Run build for admin_web_app Runner_webapp
echo "Building Runner_webapp for admin_web_app..."
cd ../Runner_webapp || { echo "Error: Failed to navigate to Runner_webapp directory."; exit 1; }
if npm run build; then
    echo "Runner_webapp for admin_web_app built successfully."
else
    echo "Error: Runner_webapp build failed."
    exit 1
fi

# Go back to the base directory
cd ../../ || { echo "Error: Failed to return to base directory."; exit 1; }

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
