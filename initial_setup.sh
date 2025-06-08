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


echo "Installing new packages for web_app/Runner_webapp..."
cd ../Runner_webapp || { echo "Error: Failed to navigate to Runner_webapp directory."; exit 1; }
if npm install; then
    echo "Packages of Runner_webapp for web_app installed successfully."
else
    echo "Error: Runner_webapp package installation failed."
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


echo "Installing new packages for admin_web_app/Runner_webapp..."
cd ../Runner_webapp || { echo "Error: Failed to navigate to Runner_webapp directory."; exit 1; }
if npm install; then
    echo "Packages of Runner_webapp for admin_web_app installed successfully."
else
    echo "Error: Runner_webapp package installation failed."
    exit 1
fi

# Go back to the base directory
cd ../../ || { echo "Error: Failed to return to base directory."; exit 1; }


# Create systemd service files and enable/start them
create_service() {
  local name=$1
  local description=$2
  local exec_start=$3
  local working_dir=$4
  local env_file=$5

  local service_file="/etc/systemd/system/${name}.service"

  echo "Creating systemd service: $name"

  sudo bash -c "cat > $service_file" <<EOF
[Unit]
Description=$description
After=network.target

[Service]
ExecStart=/usr/bin/node $exec_start
WorkingDirectory=$working_dir
Restart=always
User=root
EnvironmentFile=$env_file

[Install]
WantedBy=multi-user.target
EOF

  echo "Reloading systemd daemon..."
  sudo systemctl daemon-reexec
  sudo systemctl daemon-reload

  echo "Enabling and starting $name..."
  sudo systemctl enable --now "$name"

  echo "Status of $name:"
  sudo systemctl status "$name" --no-pager
}

# Backend service
create_service "fides.backend" \
  "FidesInnova Backend Server" \
  "/home/Blockchain-based-IoT-Server/backend/dist/main.js" \
  "/home/Blockchain-based-IoT-Server/backend" \
  "/home/Blockchain-based-IoT-Server/backend/.env"

# User Webapp service
create_service "fides.userwebapp" \
  "FidesInnova User Webapp" \
  "/home/Blockchain-based-IoT-Server/web_app/Runner_webapp/main.js" \
  "/home/Blockchain-based-IoT-Server/web_app/Runner_webapp" \
  "/home/Blockchain-based-IoT-Server/web_app/Runner_webapp/.env"

# Admin Webapp service
create_service "fides.adminwebapp" \
  "FidesInnova Admin Webapp" \
  "/home/Blockchain-based-IoT-Server/admin_web_app/Runner_webapp/main.js" \
  "/home/Blockchain-based-IoT-Server/admin_web_app/Runner_webapp" \
  "/home/Blockchain-based-IoT-Server/admin_web_app/Runner_webapp/.env"

echo "All services started successfully."
