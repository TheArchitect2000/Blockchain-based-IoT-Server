<p align="center">
  <a href="https://fidesinnova.io/" target="blank"><img src="https://fidesinnova.io/Download/logo/g-c-web-back.png" /></a>
</p>

# Step-by-step Installation Instructions for IoT Node 

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.com/invite/NQdM6JGwcs" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://twitter.com/Fidesinnova" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>

To install the back-end and front-end components of the Fidesinnova platform, including both the web app and mobile app, you can follow the steps below. These instructions assume that you have a basic understanding of setting up development environments and are familiar with JavaScript, Node.js, and related technologies.




# Step A. Prepare operating system
First of all install Ubuntu 24.04 LTS on your server. 

## A.1. Install MongoDB
### A.1.1 Installing MongoDB
Install MongoDB version 8.0
```
sudo apt update
sudo apt upgrade
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
```
### A.1.2 Starting the MongoDB Service and Testing the Database
```
sudo systemctl start mongod
sudo systemctl start mongod.service
sudo systemctl enable mongod
sudo systemctl status mongod
```

### A.1.3. Note: For managing the MongoDB Service you can use the following commands:
```
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl start mongod
sudo systemctl restart mongod
sudo systemctl disable mongod
sudo systemctl enable mongod
```

## A.2. Install nginx web server 
```
sudo apt update
sudo apt -y install nginx
sudo systemctl status nginx
```
## A.3. How to install Certbot
```
sudo apt-get update
sudo apt-get install certbot
```

## A.3.1. Obtain an SSL Certificate
To manually obtain an SSL certificate for your domains without directly modifying your web server configurations, run the following command:
```
sudo certbot certonly --standalone --preferred-challenges http
```
-  Make sure to create the certificate for domain and all subdomains
After running the command, enter your web app and admin web app domains separated by a space, like this:

```
panel.YOUR_DOMAIN.COM admin.YOUR_DOMAIN.COM
```
- The 'certbot' command generates `fullchain.pem` and `privkey.pem` in either `/etc/letsencrypt/admin.YOURDOMAIN.COM` or `/etc/letsencrypt/panel.YOURDOMAIN.COM`.
- Create the `ssl` folder inside `/etc/nginx` 
```
sudo mkdir /etc/nginx/sll
```
- Copy both `fullchain.pem` and `privkey.pem` into `/etc/nginx/ssl`. 
```
sudo cp /etc/letsencrypt/live/panel.YOUR_DOMAIN.COM/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/panel.YOUR_DOMAIN.COM/privkey.pem /etc/nginx/ssl/
```
or
```
sudo cp /etc/letsencrypt/live/admin.YOUR_DOMAIN.COM/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/admin.YOUR_DOMAIN.COM/privkey.pem /etc/nginx/ssl/
```
<!-- - Required commands for SSL by Certbot:
  - Check the expiration date of your SSL certificates:
  ```
  sudo certbot certificates
  ```
  - Renew your SSL certificate:
  ```
  sudo certbot renew
  ``` -->

## A.4. Update the `nginx.conf` file
- Replace the following configuration in your nginx.conf file located at /etc/nginx/nginx.conf.
```
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

	ssl_certificate  /etc/nginx/ssl/fullchain.pem;
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
		server_name panel.YOUR_DOMAIN.COM;

		root /var/www/html/wikifidesdoc/site;

		add_header 'Access-Control-Allow-Credentials' 'true';
		add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
		add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

		# This section is for user Web App on port 4000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			add_header Access-Control-Allow-Origin '*';
			add_header Access-Control-Allow-Headers '*';
			proxy_pass https://localhost:4000;
		}

		# This section is for Server Backend on port 3000
		location /app {
			proxy_pass http://localhost:3000;
			add_header Access-Control-Allow-Origin *;
		}
	}


	server {


		ssl_certificate  /etc/nginx/ssl/fullchain.pem;
		ssl_certificate_key /etc/nginx/ssl/privkey.pem;

		listen 443 ssl;
		listen [::]:443 ssl;
		server_name admin.YOUR_DOMAIN.COM;

		index index.html index.htm;

		add_header 'Access-Control-Allow-Credentials' 'true';
		add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
		add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';

		# This section is for Admin Web App on port 5000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			add_header Access-Control-Allow-Origin '*';
			add_header Access-Control-Allow-Headers '*';
			proxy_pass https://localhost:5000;
		}
	}
}

```
-  Please update YOUR_DOMAIN.COM with your actual domain name in admin.YOUR_DOMAIN.COM.
- Please update YOUR_DOMAIN.COM with your actual domain name in panel.YOUR_DOMAIN.COM.
  
## A.4.1. Restart Nginx
```
sudo systemctl restart nginx
```

## A.5. Installation of Node.js (Version 20.9.0) and NestJS on Ubuntu
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm install -g n
sudo n 20.9.0
sudo npm i -g @nestjs/cli 
```

## A.6. Configure Firewall 
## A.6.1. Allow connections
- Install `ufw`, allow OpenSSH connection, allow nginx connection. Then, allow ports 3000, 4000, and 5000 on the server for Mobile App, Web App, and Admin Web App, respectively. Also, open ports 8883 and 8081 to let IoT devices to connect to the MQTT broker and to let IoT devices to connect to the MQTT web socket, respectively.
```
sudo apt install ufw
sudo ufw allow OpenSSH
sudo ufw allow 'nginx full'
sudo ufw allow 3000
sudo ufw allow 4000
sudo ufw allow 5000
sudo ufw allow 8883
sudo ufw allow 8081
```
## A.6.2. Enable firewall 
- Enable the firewall
```
sudo ufw enable
```
- Check the firewall status
```
sudo ufw status
```
## A.7. Install PM2
- Install `pm2`
```
sudo npm install -g pm2
```

## A.8. Clone the project
- Install `git`
```
sudo apt install git
```
- Clone the project
```
cd /home
sudo git clone https://github.com/FidesInnova/iot_node_backend_web_app_source.git
```

# Step B. Prepare the app
## B.1. host configurations
- In project root folder, create `.env` file and edit parameters based on your node URL info
```
cd /home/iot_node_backend_web_app_source/backend
sudo nano .env
```
- Inside the `.env` file, paste the following parameters.
- Note that your domain must be "panel.YOUR_DOMAIN.COM". This domain provides access to the node's control and monitoring panel (e.g., "panel.zksensor.tech").
```

# Set this with your node URL (e.g., "zksensor.tech")
NODE_ID = "YOUR_DOMAIN.COM" 
PORT = 5000

# Set this with your node name (e.g., "zksensor")
NODE_NAME = "YOUR_NODE_NAME" 
SWAGGER_LOCAL_SERVER = http://localhost:5000

# RPC URL - This is the address of a blockchain node in the network that provides RPC sevice.
RPC_URL = 'https://fidesf1-rpc.fidesinnova.io'

# Smart contract user & pass
REMIX_USER = 'rmadmin'
REMIX_PASS = 'rm123'

# ZKP user & pass
ZKP_USER = 'zkpadmin'
ZKP_PASS = 'zkp123'

# Faucet Wallet Private Key
FAUCET_WALLET_PRIVATE_KEY = 'YOUR_FAUCET_WALLET_PRIVATE_KEY'

# Admin Wallet Private Key
ADMIN_WALLET_PRIVATE_KEY = 'YOUR_ADMIN_WALLET_PRIVATE_KEY'

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=panel.YOUR-DOMAIN.COM/app/authentication/google/redirect

# Server Configuration
HOST_PROTOCOL = 'https://'
HOST_NAME_OR_IP = 'panel.YOUR_DOMAIN.COM'
HOST_PORT = '3000'
HOST_SUB_DIRECTORY = 'app'

# StorX Configuration
STORX_BUCKET_NAME = 'fidesinnova'
STORX_HOST = 'https://b2.storx.io'
STORX_AUTH_HOST = 'https://auth.storx.io'

# Mongo Database Configuration
MONGO_DATABASE_NAME = fidesinnova
MONGO_USER = Administrator
# MONGO_PASSWORD = 'PASSWORD'
MONGO_PORT = 27017
MONGO_HOST = mongodb://127.0.0.1
MONGO_CONNECTION = mongodb://127.0.0.1:27017/fidesinnova

# Email Configuration
NOTIFICATION_BY_MAIL = 'enabled'
NOTIFICATION_BY_NOTIFICATION = 'enabled'

# Mail Server Configuration
MAIL_HOST = YOUR_HOST_MAIL_SERVER_PROVIDER
# Please check your email server’s mail port number by configuring an email client on your mobile or computer to confirm. On some servers, it may be 587 or a different port.
MAIL_PORT = 465
MAIL_USER = noreply@YOUR_DOMAIN.COM
MAIL_PASSWORD = YOUR_MAIL_SERVER_PASSWORD
MAIL_FROM = noreply@YOUR_DOMAIN.COM
# optional
MAIL_TRANSPORT = smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}

# Mobile theme ( hex color code without # )
THEME_LOGO = "www.example.com/image.png"
THEME_TEXT = "ffffff"
THEME_BACKGROUND = "212838"
THEME_BOX = "2d355c"
THEME_BUTTON = "4e46e7"

ACCESS_TOKEN_ISSUER = 'https://fidesinnova.io'
ACCESS_TOKEN_EXPIRATION_TIME = 1200000000     # Miliseconds
ACCESS_TOKEN_SECRET_KEY = '?#6KRVytq*zn5zhWWLHksL$MJj7Krkan^&^^BzZD?fqUjs4mhWNExZZ8S7CPXXkPGYMEzj2y$bK7@TWwYaja=7j^+ccFqG8#EpM4&4ppmST?A7?F_a3bq=m6B&CwRrb3'
# ACCESS_TOKEN_ALGORITHM = 'PS384'
ACCESS_TOKEN_ALGORITHM = 'HS384'

REFRESH_TOKEN_ISSUER = 'https://fidesinnova.io'
REFRESH_TOKEN_EXPIRATION_TIME = 2400000000    # Miliseconds
REFRESH_TOKEN_SECRET_KEY = 'Cn3ZU$EQcpc_C9Yyqc*t3pur#Rg_Q9xUt4GUVnf8=Q4ruE?f@8^ngFgKpE7Nh=gytxzY3!tcpBZ4STj-ehCfb2k-&C43sFgYfSfZ&ALP!XJhe3R%hNGTMmHXCMsm9Bfv'
REFRESH_TOKEN_ALGORITHM = 'HS384'

SUPER_ADMIN_EMAILS = ["server.admin.email@example.com"] # your admins emails that can make other users into admin

# Multer Configuration     # Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
MULTER_MEDIA_PATH = ./storages/resources
MULTER_MEDIA_SIZE = 10000000    # 10 MB
```
- Create two wallets address on Fidesinnova network for the admin and the faucet. To learn how to connect your wallet to fides network, please [watch this video on YouTube](https://www.youtube.com/watch?v=3GVfyu4uzhs) 
- Email only the wallet addresses (excluding private keys) to info@fidesinnova.io and ask to receive some tokens for your node operation. The admin address will be authorized on the network. The faucet address will be used to distribute tokens to your users on your server.
Never share your account’s private key with anyone.
- Update these parameters in the file:
```
NODE_ID = "your-node-url" # Set this to your node URL
NODE_NAME = "your-node-name"

FAUCET_WALLET_PRIVATE_KEY = "your-faucet-wallet-private-key"
ADMIN_WALLET_PRIVATE_KEY = 'your-admin-wallet-private-key'

HOST_NAME_OR_IP = 'panel.YOUR-DOMAIN.COM'

MAIL_HOST = YOUR-HOST-MAIL-SERVER-PROVIDER
MAIL_PORT = 465
MAIL_USER = noreply@YOUR-DOMAIN.COM
MAIL_PASSWORD = YOUR-MAIL-SERVER-PASSWORD
MAIL_FROM = noreply@YOUR_-DOMAIN.COM

THEME_LOGO = 'your-logo-url'

RPC_URL = 'your-rpc-url'

SUPER_ADMIN_EMAILS = ["admin.email.@example.com"]

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=panel.YOUR-DOMAIN.COM/app/authentication/google/redirect

```

## B.2. Device Installation Data

During the installation process in the mobile app, the following devices will be displayed based on the data provided in the `iot_node_backend_web_app_source/backend/src/data/devices.json` file. Each device is represented by an image, a title, and various parameters.

Each device in `devices.json` includes:
- **fileName**: Refers to the image file that should be placed in the `/iot_node_backend_web_app_source/backend/uploads/device` directory. This image will be displayed in the mobile app (e.g., "ecard.png").
- **title**: The display name for the device (e.g., "E-Card").
- **type**: Device type identifier (e.g., "E-CARD").

**Device Parameters**:
Parameters specify data points each device supports. These parameters will be passed to the web app Blockly editor for creating new services. 

- If a parameter’s `value` is an empty array `[]`, it indicates dynamic data input.
- If `value` has specific options (e.g., `["Open", "Close"]`), it will show these options in the Blockly dropdown as predefined outputs.

<!-- ### Example of a Device
```json
{
  "fileName": "multisensor.png",
  "title": "Multi Sensor",
  "type": "MULTI_SENSOR",
  "parameters": [
    { "label": "Temperature", "value": [] },            // dynamic input
    { "label": "Button", "value": ["Pressed", "NOT Pressed"] } // predefined options
  ]
}
``` -->

This configuration ensures that each device and its parameters are accessible for service configuration within the Blockly environment.

### B.2.1. A full sample file has been executed (device.json)
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
    "fileName": "zk-multisensor.png",
    "title": "zk-MultiSensor",
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
  }
]

```

# Step C. How to Install Web App

## C.1. How to Install Panel Web App for users
- In `Source_webapp` folder, create `.env` file.
```
cd /home/iot_node_backend_web_app_source/web_app/Source_webapp
sudo nano .env
```
- Enter the following lines in the .env file and replace `YOUR_NODE_NAME` with your actual node name.
```
VITE_URL='https://panel.YOUR_DOMAIN.COM/app/'
VITE_NODE_NAME = 'YOUR_NODE_NAME'
```

- In `Runner_webapp` folder, create `.env` file.
```
cd /home/iot_node_backend_web_app_source/web_app/Runner_webapp
sudo nano .env
```
- Enter the following line in the `.env` file.
```
PORT=4000
```

## C.2. How to Install Admin Web App for administrator
- In `Source_webapp` folder, create `.env` file.
```
cd /home/iot_node_backend_web_app_source/admin_web_app/Source_webapp
sudo nano .env
```
- Enter the following lines in the .env file and replace `YOUR_NODE_NAME` with your actual node name.
```
VITE_URL='https://panel.YOUR_DOMAIN.COM/app/'
VITE_NODE_NAME = 'YOUR_NODE_NAME'
```

- In `Runner_webapp` folder, create `.env` file.
```
cd /home/iot_node_backend_web_app_source/admin_web_app/Runner_webapp
sudo nano .env
```
- Enter the following line in the `.env` file.
```
PORT=5000
```

## C.3. Building and Running
To automate the setup and build processes for both the backend and frontend applications, run the `initial_setup.sh` script located in the root directory of the project.

### C.3.1. Set the appropriate permissions
- Before running the setup script for the first time, ensure it has executable permissions by running the following command in the terminal:
   ```
   cd /home/iot_node_backend_web_app_source/
   sudo chmod +x initial_setup.sh
   ```

### C.3.2. Run the setup script
- After setting the permissions, execute the setup script to build the applications and create PM2 services.
   ```
   cd /home/iot_node_backend_web_app_source/
   sudo ./initial_setup.sh
   ```
- This script will handle building both the backend and frontend applications and configuring PM2 services automatically.

## C.4. Subsequent Updates
- After the initial setup, you only need to run the update process to keep the applications up to date
To update both the backend and frontend applications, simply run the `update.sh` script located in the root directory of the project. 

### C.4.1. Set the appropriate permissions
- Before running the update script for the first time, ensure it has executable permissions by running the following command in the terminal:
   ```
   cd /home/iot_node_backend_web_app_source/
   sudo chmod +x update.sh
   ```
### C.4.2. Run the update script
- After setting the permissions, update the applications automatically by running
   ```
   cd /home/iot_node_backend_web_app_source/
   sudo ./update.sh
   ```
- Choose option 1 to let the script handles pulling the latest changes, rebuilding the apps, and restarting services automatically.

## C.5. Note
- If you are an IoT server administrator, contact the FidesInnova team at info@fidesinnova.io to add your Web App URL to the FidesInnova website.
- Every time you make a change to any `.env` file in the system, you should run Step C.4.2 to apply the changes to your production server.
