<p align="center">
  <a href="http://fidesonnova.io/" target="blank"><img src="https://fidesinnova.io/Download/FidesInnova-Token-Logo.png" width="200" alt="FidesInnova Logo" /></a>
</p>
<p align="center">Step-by-step Installation Instructions for <a href="http://fidesinnova.io" target="_blank">FidesInnova Server Backend</a>.</p>
<p align="center">

## 1- Prepare operating system
First of all install Ubuntu 20.04 LTS on your server. 

## 2- Install MongoDB
### Step 1 — Installing MongoDB
Install MongoDB version 4.4
```
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
apt-key list
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org
```
### Step 2 — Starting the MongoDB Service and Testing the Database
```
sudo systemctl start mongod.service
sudo systemctl status mongod
sudo systemctl enable mongod
```

### Note: For managing the MongoDB Service you can use the following commands:
```
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl start mongod
sudo systemctl restart mongod
sudo systemctl disable mongod
sudo systemctl enable mongod
```

## 3- Install nginx web server 
```
https://phoenixnap.com/kb/how-to-install-nginx-on-ubuntu-20-04  or https://www.linuxcapable.com/how-to-install-nginx-with-lets-encrypt-tls-ssl-on-ubuntu-20-04/
sudo apt update
sudo apt -y install nginx
systemctl status nginx
```

### Update the `nginx.conf` file in `/etc/nginx/nginx.conf`
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

	# Note: Make sure to create the certificate for domain and all subdomains
	ssl_certificate  ssl/fullchain.pem;
	ssl_certificate_key ssl/privkey.pem;

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
		server_name panel.YOUR_DOMAIN.io;

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
		listen 443 ssl;
		listen [::]:443 ssl;
		server_name admin.YOUR_DOMAIN.io;

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
-  Make sure to edit `server_name` to subdomain.yourdomain.com
### Restart Nginx
```
systemctl restart nginx
```

## 4- Installation of Node.js (Version 20.9.0) and NestJS on Ubuntu
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm install -g n        
n 20.9.0
npm i -g @nestjs/cli 
```

## 5- Configure Firewall 
### Allow connections
Install `ufw`
```
apt install ufw
```
Allow OpenSSH connection
```
sudo ufw allow OpenSSH
```
Allow nginx connection
```
sudo ufw allow 'nginx full'
```
Allow Mobile App to connect to the server through port 3000 
```
sudo ufw allow 3000
```
Allow Web App to connect to the server through port 4000 
```
sudo ufw allow 4000
```
Allow Admin Web App to connect to the server through port 4000 
```
sudo ufw allow 5000
```
Allow IoT devices to connect to the MQTT broker through port 8883 
```
sudo ufw allow 8883
```

### Enable firewall 
```
sudo ufw enable
```
### Check the firewall status
```
sudo ufw status
```
## 6- Clone the project
Install `git`
```
apt install git
```
In the root directory clone the project
```
cd /root
git clone https://github.com/FidesInnova/server_backend_developer.git
```

## 7- Prepare app host configuration
-  In project root folder, create `.env` file and edit parameters based on your node URL info
```
cd ~/server_backend_developer
sudo nano .env
```
Inside the `.env` file, past the parameters.
```
API_Mode = "Productionn"
PORT = 5000
SWAGGER_LOCAL_SERVER = http://localhost:5000

# Server Configuration
HOST_PROTOCOL = 'https://'
HOST_NAME_OR_IP = 'panel.YOUR_DOMAIN.COM'
HOST_PORT = '3000'
HOST_SUB_DIRECTORY = 'app'

# Node Servers
NODE_SERVERS=[{"Name":"EnergyWise","MQTT":"panel.fidesinnova.io","API":"panel.fidesinnova.io/app"},{"Name":"Cherry","MQTT":"panel.cherrynode.tech","API":"panel.cherrynode.tech/app"},{"Name":"Developer","MQTT":"developer.fidesinnova.io","API":"developer.fidesinnova.io/app"}]

# StorX Config
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

# Mail server
MAIL_HOST = YOUR_HOST_MAIL_SERVER_PROVIDER
MAIL_PORT = 465
MAIL_USER = noreply@YOUR_DOMAIN.COM
MAIL_PASSWORD = YOUR_MAIL_SERVER_PASSWORD
MAIL_FROM = noreply@YOUR_DOMAIN.COM
# optional
MAIL_TRANSPORT = smtp://${MAIL_USER}:${MAIL_PASSWORD}@${MAIL_HOST}

ACCESS_TOKEN_ISSUER = 'https://fidesinnova.io'
ACCESS_TOKEN_EXPIRATION_TIME = 1200000000     # Miliseconds
ACCESS_TOKEN_SECRET_KEY = '?#6KRVytq*zn5zhWWLHksL$MJj7Krkan^&^^BzZD?fqUjs4mhWNExZZ8S7CPXXkPGYMEzj2y$bK7@TWwYaja=7j^+ccFqG8#EpM4&4ppmST?A7?F_a3bq=m6B&CwRrb3'
# ACCESS_TOKEN_ALGORITHM = 'PS384'
ACCESS_TOKEN_ALGORITHM = 'HS384'

REFRESH_TOKEN_ISSUER = 'https://fidesinnova.io'
REFRESH_TOKEN_EXPIRATION_TIME = 2400000000    # Miliseconds
REFRESH_TOKEN_SECRET_KEY = 'Cn3ZU$EQcpc_C9Yyqc*t3pur#Rg_Q9xUt4GUVnf8=Q4ruE?f@8^ngFgKpE7Nh=gytxzY3!tcpBZ4STj-ehCfb2k-&C43sFgYfSfZ&ALP!XJhe3R%hNGTMmHXCMsm9Bfv'
REFRESH_TOKEN_ALGORITHM = 'HS384'

ADMIN_MOBILE = '0123456789'
ADMIN_PASSWORD = '9876543210'

# Multer Configuration     # Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
MULTER_MEDIA_PATH = ./storages/resources
MULTER_MEDIA_SIZE = 10000000    # 10 MB
```
Update these parameters:
```
HOST_NAME_OR_IP = 'panel.YOUR_DOMAIN.COM'

MAIL_HOST = YOUR_HOST_MAIL_SERVER_PROVIDER
MAIL_PORT = 465
MAIL_USER = noreply@YOUR_DOMAIN.COM
MAIL_PASSWORD = YOUR_MAIL_SERVER_PASSWORD
MAIL_FROM = noreply@YOUR_DOMAIN.COM
```

### put ssl certificate files in following directory:
```
assets/certificates/webprivate.pem
assets/certificates/webpublic.pem
```

## 8- Installation of packages
In the project root directory run the following commands to install npm packages and then, build the project:
```
cd ~/server_backend_developer
npm install
npm run build
```

## 9- Run the project with pm2
### install pm2
```
sudo npm i -g pm2
```
### Run the project with pm2
```
cd /root
pm2 start server_backend_developer/dist/main.js --name "Backend Server"
pm2 save
pm2 startup
```

## 10- Running the project in developer mode
### development
```
npm run start
```
### watch mode (For developers)
```
npm run start:dev
```
### production mode (For developers)
```
npm run start:prod
```
-  For first run of the app or after pull the project from GitHub or any change in project's code, before run following command you must run the app with `npm run start` once.

### unit tests
```
npm run test
```
### e2e tests
```
npm run test:e2e
```
### test coverage
```
npm run test:cov
```
