<p align="center">
  <a href="https://fidesinnova.io/" target="blank"><img src="g-c-web-back.png" /></a>
</p>

<h1 align="center">Blockchain-based IoT Server</h1>

<p align="center">
  A comprehensive IoT server platform with blockchain integration, MQTT broker, and visual service creation capabilities.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.com/invite/NQdM6JGwcs" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://twitter.com/Fidesinnova" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
  - [Step A: Prepare Operating System](#step-a-prepare-operating-system)
  - [Step B: Configure a New Node](#step-b-configure-a-new-node)
  - [Step C: Backup and Restore MongoDB Data](#step-c-backup-and-restore-mongodb-data)
- [Development](#-development)
- [Security](#-security)
- [Maintenance](#-maintenance)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

The **Blockchain-based IoT Server** is a full-stack platform that enables users to manage IoT devices, create custom automation services using a visual Blockly editor, and interact with the Fidesinnova blockchain network. The platform provides separate interfaces for regular users and administrators, with comprehensive device management, service creation, and blockchain integration capabilities.

### Key Components

- **Backend API**: NestJS-based RESTful API with MQTT broker support
- **User Web App**: React-based interface for IoT device management and service creation
- **Admin Web App**: Administrative interface for system management
- **MongoDB Database**: Data persistence layer
- **MQTT Broker**: Real-time communication with IoT devices
- **Blockchain Integration**: Smart contract interactions on Fidesinnova network

---

## ✨ Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with Google OAuth support
- 📱 **IoT Device Management**: Register, monitor, and control MQTT-enabled IoT devices
- 🎨 **Visual Service Creation**: Build automation services using Blockly visual programming
- ⛓️ **Blockchain Integration**: Smart contract interactions for device ownership and NFT management
- 📊 **Real-time Data**: WebSocket and MQTT support for live device data streaming
- 🔔 **Notifications**: Email and push notifications via Firebase
- 📈 **Analytics & Logging**: Comprehensive logging and system monitoring
- 🎯 **Multi-tenant Support**: Support for multiple nodes and organizations
- 🔒 **Security**: SSL/TLS encryption, secure MQTT (MQTTS), and role-based access control
- 📦 **Docker Support**: Containerized deployment for easy setup and scaling

---

## 🛠 Technology Stack

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: MongoDB 7.0
- **MQTT Broker**: Aedes
- **Blockchain**: Ethers.js (Fidesinnova network)
- **Authentication**: Passport.js (JWT, Google OAuth, Local)
- **Real-time**: Socket.io, WebSockets

### Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite
- **State Management**: Redux Toolkit, Zustand
- **UI Libraries**: Tailwind CSS, Heroicons
- **Visual Programming**: Blockly
- **Charts**: ApexCharts, Recharts
- **Blockchain**: Ethers.js, Reown AppKit

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **SSL/TLS**: Let's Encrypt (Certbot)
- **Storage**: StorX (S3-compatible)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (Reverse Proxy)                 │
│                    SSL/TLS Termination                       │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
    ┌──────────▼──────────┐      ┌───────────▼──────────┐
    │   User Web App      │      │   Admin Web App      │
    │   (Port 4000)       │      │   (Port 5000)         │
    │   React + Vite      │      │   React + Vite       │
    └──────────┬──────────┘      └───────────┬──────────┘
               │                              │
               └──────────────┬───────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Backend API      │
                    │   (Port 6000)      │
                    │   NestJS + MQTT    │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼──────┐    ┌─────────▼────────┐   ┌──────▼──────┐
│   MongoDB    │    │  MQTT Broker     │   │ Blockchain  │
│   (Port      │    │  (Port 8883)     │   │  (Fidesinnova│
│   27017)     │    │                  │   │   Network)  │
└──────────────┘    └──────────────────┘   └─────────────┘
```

---

## 📦 Prerequisites

Before installing the IoT server, ensure you have:

- **Operating System**: Ubuntu 24.04 LTS (recommended)
- **Memory**: 16 GB RAM minimum
- **Storage**: 30 GB SSD minimum
- **CPU**: Dual-core processor (x86_64 or ARM64)
- **Network**: Static IP address with domain names configured
- **Domain Names**: Two subdomains (e.g., `panel.yourdomain.com` and `admin.yourdomain.com`)

---

## 🚀 Installation

### Step A: Prepare Operating System

#### A.1. Install Nginx Web Server

```bash
sudo apt update
sudo apt -y install nginx
```

---

#### A.2. Install Docker

Docker lets us run the IoT server in lightweight containers without manual setup. Install and configure Docker:

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

**Note**: Log out and log back in for the Docker group changes to take effect.

---

#### A.3. Install Certbot

- First, stop the `nginx` service:

```bash
sudo systemctl stop nginx
```

- Install `certbot`:

```bash
sudo apt-get update
sudo apt-get install certbot
```

- To manually obtain an SSL certificate for your domains without directly modifying your web server configurations, run the following command:

```bash
sudo certbot certonly --standalone --preferred-challenges http
```

- Make sure to create the certificate for domain and all subdomains. After running the command, enter your web app and admin web app domains separated by a space, like this:

```
PANEL_URL  ADMIN_URL
```

For example:
```
panel.zksensor.tech admin.zksensor.tech
```

- The `certbot` command generates `fullchain.pem` and `privkey.pem` in either `/etc/letsencrypt/PANEL_URL` or `/etc/letsencrypt/ADMIN_URL`.
- Create the `ssl` folder inside `/etc/nginx`:

```bash
sudo mkdir /etc/nginx/ssl
```

- Copy both `fullchain.pem` and `privkey.pem` into `/etc/nginx/ssl`:

```bash
sudo cp /etc/letsencrypt/live/PANEL_URL/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/PANEL_URL/privkey.pem /etc/nginx/ssl/
```

or

```bash
sudo cp /etc/letsencrypt/live/ADMIN_URL/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/ADMIN_URL/privkey.pem /etc/nginx/ssl/
```

---

#### A.4. Update the `nginx.conf` file

- Replace the following configuration in your `nginx.conf` file located at `/etc/nginx/nginx.conf`.

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {
	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
	# server_tokens off;

	# server_names_hash_bucket_size 64;
	# server_name_in_redirect off;


	default_type application/octet-stream;
	include /etc/nginx/mime.types;
	##
	# SSL Settings
	##

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	ssl_certificate     /etc/nginx/ssl/fullchain.pem;
	ssl_certificate_key /etc/nginx/ssl/privkey.pem;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;

	server {
		listen 443 ssl;
		listen [::]:443 ssl;

		index index.html index.htm;
		server_name PANEL_URL;

		root /var/www/html/wikifidesdoc/site;

		# This section is for user Web App on port 4000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			proxy_pass http://localhost:4000;
		}

		# This section is for Server Backend on port 6000
		location /app {
			proxy_pass http://localhost:6000;
		}
	}


	server {
		listen 443 ssl;
		listen [::]:443 ssl;
		server_name ADMIN_URL;

		index index.html index.htm;

		# This section is for Admin Web App on port 5000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			proxy_pass http://localhost:5000;
		}
	}
}
```

**Important**: Replace `PANEL_URL` and `ADMIN_URL` with your actual domain names.

- Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

#### A.5. Configure Firewall

- Install `ufw`, allow OpenSSH connection, allow nginx connection. Then, allow ports 4000, 5000, and 6000 on the server for Mobile App, Web App, and Admin Web App, respectively. Also, open ports 8883 and 8081 to let IoT devices connect to the MQTT broker and the web socket, respectively.

```bash
sudo apt install ufw
sudo ufw allow OpenSSH
sudo ufw allow 'nginx full'
sudo ufw allow 4000
sudo ufw allow 5000
sudo ufw allow 6000
sudo ufw allow 8883
sudo ufw allow 8081
```

- **Note**: If you're using Amazon EC2 or a similar platform, ensure that inbound traffic for TCP 8883 is open. This port is required for secure MQTT communication between the IoT server and users' IoT devices.
- Enable the firewall:

```bash
sudo ufw enable
```

- Check the firewall status:

```bash
sudo ufw status
```

---

#### A.6. Clone the Project

- Install `git`:

```bash
sudo apt install git
```

- Clone the project:

```bash
cd /home
sudo git clone https://github.com/TheArchitect2000/Blockchain-based-IoT-Server.git
```

### Continue with Step B if you want to install a new node, or jump to Step C if you want to restore your node from a previous backup.

---

## Step B: Configure a New Node

### B.1. Generate Two JWT Secret Keys

- Generate an access secret key (256-bit / 32-byte):

```bash
openssl rand -hex 32
```

- Generate a refresh secret key (256-bit / 32-byte):

```bash
openssl rand -hex 32
```

**Save these keys securely** - you'll need them in the next step.

---

### B.2. Create `.env` File in Root of Project

```bash
cd /home/Blockchain-based-IoT-Server
sudo nano .env
```

- Insert the following values:

```env
BACK_PORT=6000
WEBAPP_PORT=4000
ADMIN_WEBAPP_PORT=5000

# Mongo Database Configuration
MONGO_DATABASE_NAME=fidesinnova
MONGO_INITDB_DATABASE=fidesinnova
MONGO_DATABASE_PORT=27017
MONGO_USER=fidesinnova_user
MONGO_PASSWORD=FIDESINNOVA_DB_PASSWORD
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=supersecretadmin
```

Replace `FIDESINNOVA_DB_PASSWORD` with a strong password.

---

### B.3. Backend Configurations

- In the project root folder, navigate to the backend directory and create `.env` file:

```bash
cd /home/Blockchain-based-IoT-Server/backend
sudo nano .env
```

- Inside the `.env` file, paste the following parameters. Note that your user web app URL is "PANEL_URL" (e.g., "panel.zksensor.com").

```env
# Set this with your node URL (e.g., 'zksensor.com')
PANEL_URL='YOUR_NODE_DOMAIN'

# Set this with your node admin URL (e.g., 'admin.zksensor.com')
ADMIN_URL='YOUR_NODE_ADMIN_DOMAIN'

# Set this with your node name (e.g., 'zkSensor')
NODE_NAME='YOUR_NODE_NAME'


# RPC URL - This is the address of a blockchain node in the network that provides RPC service to your IoT server
RPC_URL='https://rpc1.fidesinnova.io'

# Faucet Wallet Private Key
FAUCET_WALLET_PRIVATE_KEY='YOUR_FAUCET_WALLET_PRIVATE_KEY'

# Admin Wallet Private Key
ADMIN_WALLET_PRIVATE_KEY='YOUR_ADMIN_WALLET_PRIVATE_KEY'

# Sets how many times passwords are hashed. Higher values mean stronger security but slower processing
CRYPTION_SALT=10

# Allow insecure RPC connections (set to true for development, false for production)
ALLOW_INSECURE_RPC=true

# Syslog Server Configuration
SYSLOG_SERVER_ENABLED='True'
SYSLOG_SERVER_HOST='YOUR_SYSLOG_SERVER'
SYSLOG_SERVER_PORT=514
SYSLOG_SERVER_LEVEL=7
SYSLOG_SERVER_USERNAME=''
SYSLOG_SERVER_PASSWORD=''

# Internal logging
INTERNAL_LOGGING_ENABLED='True'
MAX_LOG_FILE_SIZE_PER_MB='12'

# Server Configuration
HOST_PROTOCOL='https://'
HOST_PORT='6000'
HOST_SUB_DIRECTORY='app'

# StorX Configuration
STORX_BUCKET_NAME='fidesinnova'
STORX_HOST='https://b2.storx.io'
STORX_AUTH_HOST='https://auth.storx.io'
STORX_CALLBACK_URI='https://PANEL_URL/account/settings/storx'
STORX_STG_AUTH_URL='https://stagingauth.storx.io'
STORX_AUTH_EMAIL='your-storx-email@example.com'
STORX_AUTH_PASSWORD='YOUR_STORX_PASSWORD'
STORX_NAME='your_storx_name'
STORX_CLIENT_ID='YOUR_STORX_CLIENT_ID'
STORX_CLIENT_SECRET='YOUR_STORX_CLIENT_SECRET'

# Mongo Database Configuration
MONGO_DATABASE_NAME='fidesinnova'
MONGO_USER='FIDESINNOVA_DB_USERNAME'
MONGO_PASSWORD='FIDESINNOVA_DB_PASSWORD'
MONGO_PORT=27017
MONGO_HOST=mongo

# Email Configuration
NOTIFICATION_BY_MAIL='enabled'
NOTIFICATION_BY_NOTIFICATION='enabled'

LOG_RETENTION_DAYS=14

# Email Server Configuration
MAIL_HOST='YOUR_HOST_MAIL_SERVER_PROVIDER'
# Please check your email server's mail port number by configuring an email client on your mobile or computer to confirm. On some servers, it may be 587 or a different port.
MAIL_PORT=465
MAIL_USER='noreply@YOUR_NODE_DOMAIN'
MAIL_PASSWORD='YOUR_MAIL_SERVER_PASSWORD'
MAIL_FROM='noreply@YOUR_NODE_DOMAIN'
# optional
MAIL_TRANSPORT=smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}

# Application color codes in hex. Please write it without '#'. Example: #4e46e7 -> 4e46e7
# This text color is for Mobile App
THEME_TEXT='ffffff'
# These colors are for Web App and Mobile App
THEME_BACKGROUND='1D293D'
THEME_BOX='1D293D'
THEME_BUTTON='33658A'

# IoT Server logo path
THEME_LOGO='https://PANEL_URL/app/uploads/logo.png'

ACCESS_TOKEN_ISSUER='https://fidesinnova.io'
ACCESS_TOKEN_EXPIRATION_TIME=1200000000
ACCESS_TOKEN_SECRET_KEY='YOUR_ACCESS_SECRET_KEY'
ACCESS_TOKEN_ALGORITHM='HS384'

REFRESH_TOKEN_ISSUER='https://fidesinnova.io'
REFRESH_TOKEN_EXPIRATION_TIME=2400000000
REFRESH_TOKEN_SECRET_KEY='YOUR_REFRESH_SECRET_KEY'
REFRESH_TOKEN_ALGORITHM='HS384'

# your admins emails that can make other users into admin or developer
SUPER_ADMIN_EMAILS=['SERVER_ADMIN_EMAIL@EXAMPLE.COM']

# Multer Configuration
# Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
MULTER_MEDIA_PATH=./storages/resources
MULTER_MEDIA_SIZE=10000000

# Smart Contract Addresses
IDENTITY_OWNERSHIP_REGISTERATION='0xb02c53d07b2b40cb9edf3f7531ab9735bfa5eded'
DEVICE_NFT_MANAGEMENT='0x640335b9cab770dd720c9f57a82becc60bc97d02'
COMMITMENT_MANAGEMENT='0x96259fba1f845b42c257f72088dd38c7e8540504'
ZKP_STORAGE='0x897264b7d872e07a3d8e1d22b199f12cfb4bb26d'
NODE_SERVICE_DEVICE_MANAGEMENT='0x4b08ea934e6bfb7c72a376c842c911e1dd2aa74f'

# Host Configuration
HOST_NAME_OR_IP='PANEL_URL'

# MQTT Broker Configuration
MQTT_BROKER_PORT=8885
MQTT_WEBSOCKET_PORT=8083
```

- Create two wallet addresses on the Fidesinnova network for the admin and the faucet. To learn how to connect your wallet to the Fides network, please [watch this video on YouTube](https://www.youtube.com/watch?v=3GVfyu4uzhs)
- Email only the wallet addresses (excluding private keys) to [info@fidesinnova.io](mailto:info@fidesinnova.io) and ask to receive some tokens for your node operation. The admin address will be authorized on the network. The faucet address will be used to distribute tokens to your users on your server.
- **⚠️ Never share your account's private key with anyone.**
- Update these parameters in the file:

```env
# Set this with your node URL (e.g., 'zksensor.com')
PANEL_URL='YOUR_NODE_DOMAIN'

# Set this with your node admin URL (e.g., 'admin.zksensor.com')
ADMIN_URL='YOUR_NODE_ADMIN_DOMAIN'

# Set this with your node name (e.g., 'zkSensor')
NODE_NAME='YOUR_NODE_NAME'

MONGO_USER='FIDESINNOVA_DB_USERNAME'
MONGO_PASSWORD='FIDESINNOVA_DB_PASSWORD'

FAUCET_WALLET_PRIVATE_KEY='YOUR_FAUCET_WALLET_PRIVATE_KEY'
ADMIN_WALLET_PRIVATE_KEY='YOUR_ADMIN_WALLET_PRIVATE_KEY'

# Email Server Configuration
MAIL_HOST='YOUR_HOST_MAIL_SERVER_PROVIDER'
# Please check your email server's mail port number by configuring an email client on your mobile or computer to confirm. On some servers, it may be 587 or a different port.
MAIL_PORT=465
MAIL_USER='noreply@YOUR_NODE_DOMAIN'
MAIL_PASSWORD='YOUR_MAIL_SERVER_PASSWORD'
MAIL_FROM='noreply@YOUR_NODE_DOMAIN'

# Application color codes in hex. Please write it without '#'. Example: #4e46e7 -> 4e46e7
# This text color is for Mobile App
THEME_TEXT='ffffff'
# These colors are for Web App and Mobile App
THEME_BACKGROUND='1D293D'
THEME_BOX='1D293D'
THEME_BUTTON='33658A'

ACCESS_TOKEN_SECRET_KEY='YOUR_ACCESS_SECRET_KEY'
REFRESH_TOKEN_SECRET_KEY='YOUR_REFRESH_SECRET_KEY'

SUPER_ADMIN_EMAILS=['SERVER_ADMIN_EMAIL@EXAMPLE.COM']

IDENTITY_OWNERSHIP_REGISTERATION='0xb02c53d07b2b40cb9edf3f7531ab9735bfa5eded'
DEVICE_NFT_MANAGEMENT='0x640335b9cab770dd720c9f57a82becc60bc97d02'
COMMITMENT_MANAGEMENT='0x96259fba1f845b42c257f72088dd38c7e8540504'
ZKP_STORAGE='0x897264b7d872e07a3d8e1d22b199f12cfb4bb26d'
NODE_SERVICE_DEVICE_MANAGEMENT='0x4b08ea934e6bfb7c72a376c842c911e1dd2aa74f'

HOST_NAME_OR_IP='PANEL_URL'

MQTT_BROKER_PORT=8885
MQTT_WEBSOCKET_PORT=8083
```

- Please update only the necessary values in the `.env` file, and make sure **not to add any extra spaces** before or after the `=` sign. For example:

```ini
THEME_BOX='0xabcd'      ✔️ Correct
THEME_BOX ='0xabcd'     ❌ Incorrect
THEME_BOX= '0xabcd'     ❌ Incorrect
THEME_BOX = '0xabcd'    ❌ Incorrect
```

- Additionally, ensure that **no comments** are placed on the same line as any parameter.

```ini
API_KEY='123456'        ✔️ Correct
API_KEY='123456' # key  ❌ Incorrect
```

---

### 🔔 Enable Node Mobile Notifications

To enable mobile notifications on your Node server, follow these steps:

1. **Request the Firebase Admin SDK**  
   Email our admin at [info@fidesinnova.io](mailto:info@fidesinnova.io) and request the `firebase-adminsdk.json` file.

2. **Place the File in the Backend**  
   Move the file to the backend directory:

   ```bash
   sudo mkdir -p /home/Blockchain-based-IoT-Server/backend/src/data/
   sudo nano /home/Blockchain-based-IoT-Server/backend/src/data/firebase-adminsdk.json
   ```

3. **Paste JSON Content**  
   Open the file with `nano`, then paste the full content of the `firebase-adminsdk.json` file you received.

---

### B.4. Web App Logo

- Copy your logo in `.png` format with the `logo` name as `logo.png` in `/home/Blockchain-based-IoT-Server/backend/uploads` folder on your server.

```bash
sudo mkdir -p /home/Blockchain-based-IoT-Server/backend/uploads
# Copy your logo.png file to this directory
```

---

### B.5. Device Configuration File

Fidesinnova offers a mobile app to control IoT devices that support the MQTT protocol. The device configuration files, which specify the IoT device types, are stored on the IoT server. In this section, we will review how to create a device configuration file on the server. Each device in the configuration file is represented by an image, a title, a type, and its parameters:

- **fileName**: Refers to the image file that should be placed in the `/Blockchain-based-IoT-Server/backend/uploads/device` directory. This image will be displayed in the mobile app (e.g., "ecard.png").
- **title**: The display name for the device (e.g., "E-Card").
- **type**: Device type identifier (e.g., "E-CARD").
- **Device Parameters**: Parameters specify data points each device supports. These parameters will be passed to the web app Blockly editor for creating new services.
- If a parameter's `value` is an empty array `[]`, it indicates dynamic data input.
- If `value` has specific options (e.g., `["Open", "Close"]`), it will show these options in the Blockly dropdown as predefined outputs.

#### B.5.1. Edit the `devices.json` file

- Create `devices.json` file in the `backend/src/data/` in the project folder:

```bash
cd /home/Blockchain-based-IoT-Server/backend/src
sudo mkdir -p data
cd data
sudo nano devices.json
```

- Copy the following config in your `devices.json` file if you would like to use zkSensor's devices. Please note that you can edit this file and add your own IoT devices. When you add your new IoT device make sure you upload a `.png` file in `/home/Blockchain-based-IoT-Server/backend/uploads/devices`. We have already copied three `zksensor-ecard.png`, `zksensor-minisensor.png`, and `zksensor-zk-multisensor.png` files in this folder for the following devices.

```json
[
  {
    "fileName": "ecard.png",
    "title": "E-Card",
    "type": "E-CARD",
    "parameters": [
      { "label": "Temperature", "value": [] },
      { "label": "Humidity", "value": [] },
      { "label": "Button", "value": ["Pressed", "NOT Pressed"] }
    ]
  },
  {
    "fileName": "multisensor.png",
    "title": "MiniSensor",
    "type": "MINI_SENSOR",
    "parameters": [
      { "label": "Temperature", "value": [] },
      { "label": "Humidity", "value": [] },
      { "label": "Door", "value": ["Open", "Close"] },
      { "label": "Movement", "value": ["Scanning...", "Detected"] },
      { "label": "Button", "value": ["Pressed", "NOT Pressed"] }
    ]
  },
  {
    "fileName": "zkmultisensor.png",
    "title": "ZK-MultiSensor",
    "type": "ZK_MULTISENSOR",
    "parameters": [
      { "label": "Temperature", "value": [] },
      { "label": "Humidity", "value": [] },
      { "label": "Noise", "value": [] },
      { "label": "Pressure", "value": [] },
      { "label": "eCO2", "value": [] },
      { "label": "TVOC", "value": [] },
      { "label": "Door", "value": ["Open", "Close"] },
      { "label": "Movement", "value": ["Scanning...", "Detected"] },
      { "label": "Button", "value": ["Pressed", "NOT Pressed"] }
    ]
  },
  {
    "fileName": "iot2050.png",
    "title": "Siemens IOT2050",
    "type": "Siemens_IOT2050",
    "parameters": [
      { "label": "Temperature", "value": [] },
      { "label": "Humidity", "value": [] },
      { "label": "Noise", "value": [] },
      { "label": "Pressure", "value": [] },
      { "label": "eCO2", "value": [] },
      { "label": "TVOC", "value": [] },
      { "label": "Door", "value": ["Open", "Close"] },
      { "label": "Movement", "value": ["Scanning...", "Detected"] },
      { "label": "Button", "value": ["Pressed", "NOT Pressed"] }
    ]
  },
  {
    "fileName": "Methane_Sensor.png",
    "title": "Methane Sensor",
    "type": "Methane_Sensor",
    "parameters": [
      { "label": "ID", "value": [] },
      { "label": "DateTimeStamp", "value": [] },
      { "label": "Location", "value": [] },
      { "label": "BatteryPercentage", "value": [] },
      { "label": "DeviceStatus", "value": ["ONLINE", "OFFLINE"] },
      { "label": "MethaneLevel", "value": [] },
      { "label": "TempCLevel", "value": [] },
      { "label": "TempFLevel", "value": [] },
      { "label": "HumidityLevel", "value": [] }
    ]
  }
]
```

---

### B.6. Initial Panel Web App for Users

```bash
cd /home/Blockchain-based-IoT-Server/web_app/
sudo nano .env
```

Enter the following lines in the `.env` file and replace `YOUR_NODE_NAME` with your actual node name.

```env
VITE_URL='https://PANEL_URL/app/'
VITE_NODE_NAME='YOUR_NODE_NAME'
VITE_RPC_URL='https://rpc1.fidesinnova.io'
MQTT_WEBSOCKET_PORT=8082
PORT=4000
```

---

### B.7. Initial Admin Web App for Administrator

```bash
cd /home/Blockchain-based-IoT-Server/admin_web_app
sudo nano .env
```

Enter the following lines in the `.env` file and replace `YOUR_NODE_NAME` with your actual node name.

```env
VITE_URL='https://PANEL_URL/app/'
VITE_NODE_NAME='YOUR_NODE_NAME'
VITE_RPC_URL='https://rpc1.fidesinnova.io'
PORT=5000
```

---

### B.8. Run the App

Set the project name environment variable and build/start the containers:

```bash
export PROJECT_NAME=blockchain-iot-server
cd /home/Blockchain-based-IoT-Server
docker compose -p $PROJECT_NAME build --no-cache
docker compose -p $PROJECT_NAME up -d
```

To check the status of your containers:

```bash
docker compose -p $PROJECT_NAME ps
```

To view logs:

```bash
docker compose -p $PROJECT_NAME logs -f
```

---

## Step C: Backup and Restore MongoDB Data

### C.1. Backup MongoDB Data

To create a backup of your MongoDB database, follow these steps:

- First, identify your MongoDB container name or ID:

```bash
sudo docker ps
```

- Create a backup directory on your host machine:

```bash
sudo mkdir -p /home/mongodb-backup
```

- Run `mongodump` to create a backup. Replace `<CONTAINER_ID>` with your MongoDB container ID or name, `<USER>` with your MongoDB username, and `<PASS>` with your MongoDB password:

```bash
sudo docker exec -it <CONTAINER_ID> mongodump \
  --username <USER> \
  --password <PASS> \
  --authenticationDatabase admin \
  --out /dump
```

- Copy the backup from the container to your host machine:

```bash
sudo docker cp <CONTAINER_ID>:/dump /home/mongodb-backup/
```

- The backup files will be stored in `/home/mongodb-backup/dump/`. You can compress this directory for easier storage and transfer:

```bash
sudo tar -czf /home/mongodb-backup/mongodb-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /home/mongodb-backup dump/
```

---

### C.2. Restore MongoDB Data

To restore MongoDB data from a backup, follow these steps:

- First, identify your MongoDB container name or ID:

```bash
sudo docker ps
```

- If you have a compressed backup, extract it first:

```bash
sudo tar -xzf /home/mongodb-backup/mongodb-backup-YYYYMMDD-HHMMSS.tar.gz -C /home/mongodb-backup/
```

- Copy the backup files into the MongoDB container:

```bash
sudo docker cp /home/mongodb-backup/dump <CONTAINER_ID>:/dump
```

- Restore the data using `mongorestore`. Replace `<CONTAINER_ID>` with your MongoDB container ID or name, `<USER>` with your MongoDB username, and `<PASS>` with your MongoDB password:

```bash
sudo docker exec -it <CONTAINER_ID> mongorestore \
  --username <USER> \
  --password <PASS> \
  --authenticationDatabase admin \
  /dump
```

- After restoration, you can clean up the dump directory inside the container:

```bash
sudo docker exec -it <CONTAINER_ID> rm -rf /dump
```

---

### C.3. Congratulations

- Panel Web App, `https://PANEL_URL` is for your regular users.
- Admin Web App, `https://ADMIN_URL` is for your super admin users.
- Contact FidesInnova at [info@fidesinnova.io](mailto:info@fidesinnova.io) to add your Web App URLs to the FidesInnova website. These are already registered IoT Servers:
  - [https://panel.motioncertified.online](https://panel.motioncertified.online/)
  - [https://panel.zksensor.tech](https://panel.zksensor.tech/)
  - [https://panel.trustlearn.xyz](https://panel.trustlearn.xyz/)
  - [https://panel.energywisenetwork.com](https://panel.energywisenetwork.com/)
  - [https://panel.trustsense.tech](https://panel.trustsense.tech/)

---

## 💻 Development

### Prerequisites for Development

- Node.js 18.x or higher
- npm or yarn
- Docker and Docker Compose (for local database)

### Running in Development Mode

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend will run on `http://localhost:6000` and Swagger documentation will be available at `http://localhost:6000/app/api`.

#### User Web App

```bash
cd web_app
npm install
npm run dev
```

The user web app will run on `http://localhost:4000`.

#### Admin Web App

```bash
cd admin_web_app
npm install
npm run dev
```

The admin web app will run on `http://localhost:5000`.

### Building for Production

#### Backend

```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend Applications

```bash
# User Web App
cd web_app
npm run build

# Admin Web App
cd admin_web_app
npm run build
```

---

## 🔐 Security

### Automated Web App Security Scan with OWASP ZAP (Docker)

This guide walks you through setting up Java, and Docker, and running a baseline security scan using OWASP ZAP against a web application endpoint. Ultimately, you'll get a nicely formatted `zap-report.html` you can open in any browser.

#### 📦 1. Install Java Runtime Environment (JRE)

ZAP requires Java to run. Begin by updating your system and installing the default JRE:

```bash
sudo apt update
sudo apt install default-jre -y
java -version
```

You should see a version output confirming Java is installed. Example:

```bash
openjdk version "11.0.20" 2023-07-18
OpenJDK Runtime Environment (build 11.0.20+8-Ubuntu)
```

#### 🧰 2. Pull OWASP ZAP Docker Image

Download the official stable ZAP image:

```bash
sudo docker pull zaproxy/zap-stable
```

#### 📁 3. Prepare Report Directory

Create a directory to store your report and make it writable:

```bash
sudo mkdir /home/security-report
sudo chmod -R 777 /home/security-report
cd /home/security-report
```

This ensures the ZAP container can write the report files without permission issues.

#### 🚀 4. Run ZAP Baseline Scan

Now run the security scan:

```bash
sudo docker run -v $(pwd):/zap/wrk/:rw zaproxy/zap-stable zap-baseline.py -t https://<<node-address>>/app/api -r zap-report.html
```

Make sure to replace `<<node-address>>` with your actual domain or IP address.  
Example:

```bash
panel.zksensor.tech
```

> 🕓 Note: This process can take a while depending on your network and app complexity.

#### 📊 5. View Results

Once the scan is complete, the following files will appear in your `/home/security-report` folder:

- `zap-report.html` — Main visual report (open this in any browser)
- `zap.yaml` — Scan configuration and results in YAML format

To review the results:

1. Download the `/home/security-report` folder to your local machine.
2. Open `zap-report.html` in a browser to inspect potential vulnerabilities.

---

## 🔧 Maintenance

### D.1. Troubleshooting

Useful commands for troubleshooting:

```bash
# to make file writable and other permissions:
chmod +rwx chainthreed

# see busy ports
sudo netstat -tulpn | grep LISTEN

# something similar to the top one
sudo ss -ltn

# kill a port
sudo kill -9 $(sudo lsof -t -i:6060)

# see firewall status
systemctl status ufw

# restart the firewall
systemctl restart ufw

# move something into something else:
mv source target

# delete a directory or file
rm -rf directoryName

# View logs for a specific container (last 1 minute):
sudo docker compose logs $service-name -f

# Check the status of a service:
sudo docker ps

# Restart containers:
sudo docker compose -p $stage-name build

# Stop a service:
sudo docker stop $service-name

# See syslogs
sudo tail -f /var/log/syslog | grep -v UFW
```

### Common Issues

1. **Port Already in Use**: If a port is already in use, identify the process and kill it using the commands above.
2. **Docker Permission Denied**: Ensure your user is in the docker group: `sudo usermod -aG docker $USER` (requires logout/login).
3. **SSL Certificate Issues**: Ensure your domain names are correctly configured and DNS is pointing to your server IP.
4. **MongoDB Connection Issues**: Verify MongoDB container is running and credentials in `.env` files are correct.

---

