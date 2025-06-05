<p align="center">
  <a href="https://fidesinnova.io/" target="blank"><img src="g-c-web-back.png" /></a>
</p>

# Step-by-step Installation Instructions for IoT Server 

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.com/invite/NQdM6JGwcs" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://twitter.com/Fidesinnova" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>

To install the back-end and front-end components of the Fidesinnova platform, including both the web app and mobile app, you can follow the steps below. These instructions assume that you have a basic understanding of setting up development environments and are familiar with JavaScript, Node.js, and related technologies.

# Step A. Prepare operating system
To run `iot-server` effectively, the following system specifications are recommended:

- **Operating System:** Ubuntu 24.04 LTS
- **Memory:** 16 GB RAM
- **Storage:** 30 GB SSD minimum
- **CPU:** Dual-core processor (x86_64 or ARM64)

_These requirements are suitable for typical IoT workloads. Actual needs may vary based on deployment scale and data volume._

## A.1. Install MongoDB
- Install MongoDB version 8.0 for ARM64.
- If you have a x86 machine, please check the MongoDB documentation.
```
sudo apt update
sudo apt upgrade
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt update
sudo apt install -y mongodb-org
```

- Start the MongoDB service and test the database
```
sudo systemctl start mongod
sudo systemctl start mongod.service
sudo systemctl enable mongod
```

- Set MongoDB password
Run `mongosh`
```
mongosh
```

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD`, and type the following lines in the `mongosh` terminal. Note that the password must contain only lowercase or uppercase characters or numbers.
```
use admin
```

```
db.createUser({
  user: "MONGODB_ADMIN_USERNAME",
  pwd: "MONGODB_ADMIN_PASSWORD",
  roles: [{ role: "root", db: "admin" }]
})
```
This account can be used later to connect to MongoDB using MongoDB Compass.

Set `FIDESINNOVA_DB_USERNAME` and `FIDESINNOVA_DB_PASSWORD`, and type the following lines in the `mongosh` terminal. Note that the password must contain only lowercase or uppercase characters or numbers.
```
use fidesinnova
```

```
db.createUser({
  user: "FIDESINNOVA_DB_USERNAME",
  pwd: "FIDESINNOVA_DB_PASSWORD",
  roles: [{ role: "readWrite", db: "fidesinnova" }]
})
```
This account will be used later to let the system backend connects to the database. Save both credentials in a secure place. 
Exit from the mongosh environment.
```
exit
```


- Edit the config file
```
sudo nano /etc/mongod.conf
```
Find the security section and enable authentication:
```
security:
  authorization: enabled
```

- Restart the MongoDb service
```
sudo systemctl restart mongod  
```

- The MongoDB configuration is done. To conect to MongoDB, use `mongosh -u 'ADMIN_USERNAME' -p 'ADMIN_PASSWORD' --authenticationDatabase admin`. Also, to manage the MongoDB service, use the following commands:
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
```
## A.3. Install Certbot
- First, stop the `nginx`
```
sudo systemctl stop nginx
```
- Now, install the `certbot`
```
sudo apt-get update
sudo apt-get install certbot
```
- To manually obtain an SSL certificate for your domains without directly modifying your web server configurations, run the following command:
```
sudo certbot certonly --standalone --preferred-challenges http
```
-  Make sure to create the certificate for domain and all subdomains
After running the command, enter your web app and admin web app domains separated by a space, like this:
```
panel.YOUR_DOMAIN admin.YOUR_DOMAIN
```
- The 'certbot' command generates `fullchain.pem` and `privkey.pem` in either `/etc/letsencrypt/admin.YOURDOMAIN.COM` or `/etc/letsencrypt/panel.YOURDOMAIN.COM`.
- Create the `ssl` folder inside `/etc/nginx` 
```
sudo mkdir /etc/nginx/ssl
```
- Copy both `fullchain.pem` and `privkey.pem` into `/etc/nginx/ssl`. 
```
sudo cp /etc/letsencrypt/live/panel.YOUR_DOMAIN/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/panel.YOUR_DOMAIN/privkey.pem /etc/nginx/ssl/
```
or
```
sudo cp /etc/letsencrypt/live/admin.YOUR_DOMAIN/fullchain.pem /etc/nginx/ssl/
sudo cp /etc/letsencrypt/live/admin.YOUR_DOMAIN/privkey.pem /etc/nginx/ssl/
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
- Replace the following configuration in your `nginx.conf` file located at `/etc/nginx/nginx.conf`.
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
		server_name panel.YOUR_DOMAIN;

		root /var/www/html/wikifidesdoc/site;

		# This section is for user Web App on port 4000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			proxy_pass https://localhost:4000;
		}

		# This section is for Server Backend on port 3000
		location /app {
			proxy_pass http://localhost:3000;
		}
	}


	server {


		ssl_certificate  /etc/nginx/ssl/fullchain.pem;
		ssl_certificate_key /etc/nginx/ssl/privkey.pem;

		listen 443 ssl;
		listen [::]:443 ssl;
		server_name admin.YOUR_DOMAIN;

		index index.html index.htm;

		# This section is for Admin Web App on port 5000
		location / {
			proxy_set_header Authorization $http_authorization;
			proxy_pass_header Authorization;
			proxy_pass https://localhost:5000;
		}
	}
}

```
- Please update YOUR_DOMAIN with your actual domain name in admin.YOUR_DOMAIN.
- Please update YOUR_DOMAIN with your actual domain name in panel.YOUR_DOMAIN.
  
- Restart Nginx 
```
sudo systemctl restart nginx
```

## A.5. Install Node.js and NestJS
```
sudo apt update
sudo apt install -y curl build-essential
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g n
sudo n 22.14.0
sudo npm i -g @nestjs/cli 
```

## A.6. Configure Firewall 
- Install `ufw`, allow OpenSSH connection, allow nginx connection. Then, allow ports 3000, 4000, and 5000 on the server for Mobile App, Web App, and Admin Web App, respectively. Also, open ports 8883 and 8081 to let IoT devices to connect to the MQTT broker and the web socket, respectively.
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
- Note: If you’re using Amazon EC2 or a similar platform, ensure that inbound traffic for TCP 8883 is open. This port is required for secure MQTT communication between the IoT server and users’ IoT devices.
- Enable the firewall
```
sudo ufw enable
```
- Check the firewall status
```
sudo ufw status
```

## A.7. Install PM2
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
sudo git clone https://github.com/FidesInnova/iot-server.git
```

### Continue with Step B if you want to install a new node, or jump to Step C if you want to restore your node from a previous backup.

# Step B. Configure a New Node
## B.1. Generate two JWT secret keys  
- Generate an access secret key (256-bit / 32-byte)
```
openssl rand -hex 32
```

- Generate a refresh secret key (256-bit / 32-byte)
```
openssl rand -hex 32
```

## B.2. Backend configurations
- In project root folder, create `.env` file and edit parameters based on your node URL info
```
cd /home/iot-server/backend
sudo nano .env
```

- Inside the `.env` file, paste the following parameters. Note that your user web app URL is "panel.YOUR_DOMAIN"  (e.g., "panel.zksensor.tech").

```
# Set this with your node URL (e.g., 'zksensor.tech')
NODE_ID='YOUR_DOMAIN' 

# Set this with your node name (e.g., 'zkSensor')
NODE_NAME='YOUR_NODE_NAME'

SWAGGER_LOCAL_SERVER=http://localhost:5000

# RPC URL - This is the address of a blockchain node in the network that provides RPC sevice to your IoT server
RPC_URL='https://rpc1.fidesinnova.io'

# Faucet Wallet Private Key
FAUCET_WALLET_PRIVATE_KEY='YOUR_FAUCET_WALLET_PRIVATE_KEY'

# Admin Wallet Private Key
ADMIN_WALLET_PRIVATE_KEY='YOUR_ADMIN_WALLET_PRIVATE_KEY'

# Server Configuration
HOST_PROTOCOL='https://'
HOST_NAME_OR_IP='panel.YOUR_DOMAIN'
HOST_PORT='3000'
HOST_SUB_DIRECTORY='app'

# StorX Configuration
STORX_BUCKET_NAME='fidesinnova'
STORX_HOST='https://b2.storx.io'
STORX_AUTH_HOST='https://auth.storx.io'

# Mongo Database Configuration
MONGO_DATABASE_NAME='fidesinnova'
MONGO_USER='FIDESINNOVA_DB_USERNAME'
MONGO_PASSWORD='FIDESINNOVA_DB_PASSWORD'
MONGO_PORT=27017
MONGO_HOST=127.0.0.1

# Email Configuration
NOTIFICATION_BY_MAIL='enabled'
NOTIFICATION_BY_NOTIFICATION='enabled'

LOG_RETENTION_DAYS=14

# Email Server Configuration
MAIL_HOST='YOUR_HOST_MAIL_SERVER_PROVIDER'
# Please check your email server’s mail port number by configuring an email client on your mobile or computer to confirm. On some servers, it may be 587 or a different port.
MAIL_PORT=465
MAIL_USER='noreply@YOUR_DOMAIN'
MAIL_PASSWORD='YOUR_MAIL_SERVER_PASSWORD'
MAIL_FROM='noreply@YOUR_DOMAIN'
# optional
MAIL_TRANSPORT=smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST} 

# Application color codes in hex. Please write it without '#'. Exmaple: #4e46e7 -> 4e46e7
# This text color is for Mobile App 
THEME_TEXT='ffffff' 
# These colors are for Web App and Mobile App
THEME_BACKGROUND='1D293D'
THEME_BOX='1D293D'
THEME_BUTTON='33658A'

# IoT Server logo path
THEME_LOGO='https://panel.YOUR_DOMAIN/app/uploads/logo.png'

ACCESS_TOKEN_ISSUER='https://fidesinnova.io'
ACCESS_TOKEN_EXPIRATION_TIME=1200000000     # Miliseconds
ACCESS_TOKEN_SECRET_KEY='YOUR_ACCESS_SECRET_KEY'
ACCESS_TOKEN_ALGORITHM='HS384'

REFRESH_TOKEN_ISSUER='https://fidesinnova.io'
REFRESH_TOKEN_EXPIRATION_TIME=2400000000    # Miliseconds
REFRESH_TOKEN_SECRET_KEY='YOUR_REFRESH_SECRET_KEY'
REFRESH_TOKEN_ALGORITHM='HS384'

# your admins emails that can make other users into admin or developer
SUPER_ADMIN_EMAILS=['SERVER_ADMIN_EMAIL@EXAMPLE.COM'] 

# Multer Configuration
# Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
MULTER_MEDIA_PATH=./storages/resources
MULTER_MEDIA_SIZE=10000000    # 10 MB

IDENTITY_OWNERSHIP_REGISTERATION='0xb02c53d07b2b40cb9edf3f7531ab9735bfa5eded'
DEVICE_NFT_MANAGEMENT='0x640335b9cab770dd720c9f57a82becc60bc97d02'
COMMITMENT_MANAGEMENT='0x96259fba1f845b42c257f72088dd38c7e8540504'
ZKP_STORAGE='0x897264b7d872e07a3d8e1d22b199f12cfb4bb26d'
NODE_SERVICE_DEVICE_MANAGEMENT='0x4b08ea934e6bfb7c72a376c842c911e1dd2aa74f'
```
- Create two wallets address on Fidesinnova network for the admin and the faucet. To learn how to connect your wallet to fides network, please [watch this video on YouTube](https://www.youtube.com/watch?v=3GVfyu4uzhs) 
- Email only the wallet addresses (excluding private keys) to info@fidesinnova.io and ask to receive some tokens for your node operation. The admin address will be authorized on the network. The faucet address will be used to distribute tokens to your users on your server.
Never share your account’s private key with anyone.
- Update these parameters in the file:
```
# Set this with your node URL (e.g., 'zksensor.tech')
NODE_ID='YOUR_DOMAIN' 

# Set this with your node name (e.g., 'zkSensor')
NODE_NAME='YOUR_NODE_NAME'

MONGO_USER='FIDESINNOVA_DB_USERNAME'
MONGO_PASSWORD='FIDESINNOVA_DB_PASSWORD'

FAUCET_WALLET_PRIVATE_KEY='YOUR_FAUCET_WALLET_PRIVATE_KEY'
ADMIN_WALLET_PRIVATE_KEY='YOUR_ADMIN_WALLET_PRIVATE_KEY'

HOST_NAME_OR_IP='panel.YOUR-DOMAIN'

# Email Server Configuration
MAIL_HOST='YOUR_HOST_MAIL_SERVER_PROVIDER'
# Please check your email server’s mail port number by configuring an email client on your mobile or computer to confirm. On some servers, it may be 587 or a different port.
MAIL_PORT=465
MAIL_USER='noreply@YOUR_DOMAIN'
MAIL_PASSWORD='YOUR_MAIL_SERVER_PASSWORD'
MAIL_FROM='noreply@YOUR_DOMAIN'

# Application color codes in hex. Please write it without '#'. Exmaple: #4e46e7 -> 4e46e7
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
```

- Note: Please change only the the necessary values in the 'env' file, and do not add any extra space before or after '='. For exmaple,
```
THEME_BOX='0xabcd'  <--- correct
THEME_BOX ='0xabcd'  <--- wrong
THEME_BOX= '0xabcd'  <--- wrong
THEME_BOX = '0xabcd'  <--- wrong
```

### 🔔 Enable Node Mobile Notifications

To enable mobile notifications on your Node server, follow these steps:

1. **Request the Firebase Admin SDK**  
   Email our admin at [info@fidesinnova.io](mailto:info@fidesinnova.io) and request the `firebase-adminsdk.json` file.

2. **Place the File in the Backend**  
   Move the file to the backend directory:

   ```bash
   sudo mkdir /home/iot-server/backend/src/data/
   sudo nano /home/iot-server/backend/src/data/firebase-adminsdk.json
   ```

3. **Paste JSON Content**  
   Open the file with `nano`, then paste the full content of the `firebase-adminsdk.json` file you received.

## B.3. Web App Logo
- Copy your logo in `.png` format with the `logo` name as `logo.png` in `\home\iot-server\backend\uploads` folder on your server. 

## B.4. Device Configuration File
- Fidesinnova offers a mobile app to control IoT devices that support the MQTT protocol. The device configuration files, which specify the IoT device types, are stored on the IoT server. In this section, we will review how to create a device configuration file on the server. Each device in the configuration file is represented by an image, a title, a type, and its parameters:
- **fileName**: Refers to the image file that should be placed in the `/iot-server/backend/uploads/device` directory. This image will be displayed in the mobile app (e.g., "ecard.png").
- **title**: The display name for the device (e.g., "E-Card").
- **type**: Device type identifier (e.g., "E-CARD").
- **Device Parameters**: Parameters specify data points each device supports. These parameters will be passed to the web app Blockly editor for creating new services. 
- If a parameter’s `value` is an empty array `[]`, it indicates dynamic data input.
- If `value` has specific options (e.g., `["Open", "Close"]`), it will show these options in the Blockly dropdown as predefined outputs.

### B.4.1. Edit the `devices.json` file
- Create `devices.json` file in the `backend/src/data/` in the project folder
```
cd /home/iot-server/backend/src
sudo mkdir data
cd data
sudo nano devices.json
```

- Copy the following config in your `devices.json` file if you would like to use zkSensor's devices. Please note that you can edit this file and add your own IoT devices. When you add your new IoT device make sure you upload a `.png` file in `/home/iot-server/backend/uploads/devices`. We hae already copied three `zksensor-ecard.png`, `zksensor-minisensor.png`, and `zksensor-zk-multisensor.png` files in this folder for the following devices.
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

## B.5. Install Panel Web App for users
- In `Source_webapp` folder, create `.env` file.
```
cd /home/iot-server/web_app/Source_webapp
sudo nano .env
```
Enter the following lines in the .env file and replace `YOUR_NODE_NAME` with your actual node name.
```
VITE_URL='https://panel.YOUR_DOMAIN/app/'
VITE_NODE_NAME='YOUR_NODE_NAME'
VITE_RPC_URL='https://rpc1.fidesinnova.io'
```

## B.6. Install Admin Web App for administrator
- In `Source_webapp` folder, create `.env` file.
```
cd /home/iot-server/admin_web_app/Source_webapp
sudo nano .env
```
Enter the following lines in the .env file and replace `YOUR_NODE_NAME` with your actual node name.
```
VITE_URL='https://panel.YOUR_DOMAIN/app/'
VITE_NODE_NAME='YOUR_NODE_NAME'
```

# C. Restore Node from Backup
- Create the 'backups' folder.
   ```
   cd /home/iot-server/
   sudo mkdir backups
   ```
- Copy your backup file (e.g. iot_server_backup_2025-02-12.tar.gz ) to this folder.
- Execute the restore script file
```
   cd /home/iot-server/
   sudo chmod +x restore.sh
   sudo ./restore.sh
```

# D. Build and Execute
## D.1. Build the System
To automate the setup and build processes for both the backend and frontend applications, run the `initial_setup.sh` script located in the root directory of the project. This script will handle building both the backend and frontend applications and configuring PM2 services automatically.
   ```
   cd /home/iot-server/
   sudo chmod +x initial_setup.sh
   sudo ./initial_setup.sh
   ```
## D.2. Account Setup
- Goto `https://panel.YOUR_DOMAIN` and go to the 'Sign up' section and create a password for your `super admin email address`.
- Goto `https://admin.YOUR_DOMAIN` and login with your `super admin email address` and its password.
  
## D.3. Congratulations
- Panel Web App, `https://panel.YOUR_DOMAIN` is for your regular users.
- Admin Web App, `https://admin.YOUR_DOMAIN` is for your super admin users.
- Contact FidesInnova at info@fidesinnova.io to add your Web App URLs to the FidesInnova website. These are already registered IoT Servers:
- [https://panel.motioncertified.online](https://panel.motioncertified.online/)
- [https://panel.zksensor.tech](https://panel.zksensor.tech/)
- [https://panel.trustlearn.xyz](https://panel.trustlearn.xyz/)
- [https://panel.energywisenetwork.com](https://panel.energywisenetwork.com/)
- [https://panel.trustsense.tech](https://panel.trustsense.tech/)

# E. Maintenance
## E.1. Update IoT Server
- Every time Fidesinnova core development team push a new version of the code on GitHub.
```
cd /home/iot-server/
sudo git fetch
sudo git pull
```

- Every time you pull a new version of the server code from GitHub or you make a change to any `.env` files in the system, you should apply the changes to your production server via update script.
```
cd /home/iot-server/
sudo chmod +x update.sh
sudo ./update.sh
```
## E.2. Backup IoT Server
- Every time you want to get a backup from your server, you should execute the following script and get your backup file in the 'backups' folder.
```
cd /home/iot-server/
sudo chmod +x backup.sh
sudo ./backup.sh
```
## E.3. Troubleshooting
- Useful commands for troubleshooting
```
# to make file writable and other permissions :
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

pm2 list                               # Show running processes  
pm2 show my-app                        # Show details of a specific process  
pm2 stop my-app                        # Stop a process  
pm2 restart my-app                     # Restart a process  
pm2 delete my-app                      # Remove a process from PM2
pm2 logs                               # Show logs of all processes  
```
## E.4. Web App Ports
- Change the Panel Web App Port
In `Runner_webapp` folder, create `.env` file.
```
cd /home/iot-server/web_app/Runner_webapp
sudo nano .env
```
Change the port number in the following line.
```
PORT=4000
```

- Change the Admin Web App Port
- In `Runner_webapp` folder, create `.env` file.
```
cd /home/iot-server/admin_web_app/Runner_webapp
sudo nano .env
```
Change the port number in the following line.
```
PORT=5000
```
Note: If you change these two ports, please make sure you consult with the Fides Innova repository manager to avoid any future git push conflicts.

--------

# 🔐 Automated Web App Security Scan with OWASP ZAP (Docker)

This guide walks you through setting up Java, and Docker, and running a baseline security scan using OWASP ZAP against a web application endpoint. Ultimately, you'll get a nicely formatted `zap-report.html` you can open in any browser.

## 📦 1. Install Java Runtime Environment (JRE)

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

## 🐳 2. Install Docker

Docker lets us run ZAP in a lightweight container without manual setup. Install and configure Docker:

```bash
sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

## 🧰 3. Pull OWASP ZAP Docker Image

Download the official stable ZAP image:

```bash
sudo docker pull zaproxy/zap-stable
```

## 📁 4. Prepare Report Directory

Create a directory to store your report and make it writable:

```bash
sudo mkdir /home/security-report
sudo chmod -R 777 /home/security-report
cd /home/security-report
```

This ensures the ZAP container can write the report files without permission issues.

## 🚀 5. Run ZAP Baseline Scan

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

## 📊 6. View Results

Once the scan is complete, the following files will appear in your `/home/security-report` folder:

- `zap-report.html` — Main visual report (open this in any browser)  
- `zap.yaml` — Scan configuration and results in YAML format

To review the results:

1. Download the `/home/security-report` folder to your local machine.  
2. Open `zap-report.html` in a browser to inspect potential vulnerabilities.
