#!/bin/bash

echo "Starting build for backend..."
cd backend
npm run build
# Go back to the base directory
cd ../
echo "Waiting for 4 seconds..."
sleep 4
# Build and move for web_app
echo "Starting build for web_app..."
cd web_app/Source_webapp
npm run build
if [ $? -eq 0 ]; then
    echo "remove frontend folder in the Runner_webapp folder"
    rm -rf "../Runner_webapp/frontend"
    echo "Waiting for 2 seconds..."
    sleep 2
    echo "create frontend folder in the Runner_webapp folder"
    mkdir "../Runner_webapp/frontend"
    echo "Waiting for 2 seconds..."
    sleep 2
    echo "web_app build successful, moving files..."
    mv build/* ../Runner_webapp/frontend/
    echo "web_app files moved to Runner_webapp/frontend successfully."
else
    echo "web_app build failed. No files were moved."
fi

# Go back to the base directory
cd ../../
echo "Waiting for 3 seconds..."
sleep 3
# Build and move for admin_web_app
echo "Starting build for admin_web_app..."
cd admin_web_app/Source_webapp
npm run build
if [ $? -eq 0 ]; then
    echo "remove frontend folder in the Runner_webapp folder"
    rm -rf "../Runner_webapp/frontend"
    echo "Waiting for 2 seconds..."
    sleep 2
    echo "create frontend folder in the Runner_webapp folder"
    mkdir "../Runner_webapp/frontend"
    echo "admin_web_app build successful, moving files..."
    echo "Waiting for 2 seconds..."
    sleep 2
    mv build/* ../Runner_webapp/frontend/
    echo "admin_web_app files moved to Runner_webapp/frontend successfully."
    echo "Waiting for 2 seconds..."
    sleep 2
else
    echo "admin_web_app build failed. No files were moved."
fi

# Go back to the base directory
cd ../../
pm2 list
echo "Waiting for 3 seconds..."
sleep 3
pm2 restart all
echo "Waiting for 3 seconds..."
sleep 3
pm2 save