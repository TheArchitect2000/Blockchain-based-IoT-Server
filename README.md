<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--![Backers on Open Collective](https://opencollective.com/nest#backer)
  ![Sponsors on Open Collective](https://opencollective.com/nest#sponsor)-->

## Description

Nest framework TypeScript starter repository.

## Step-by-step Installation Instructions

## 1- Prepare operating system
First of all install Ubuntu 20.04 LTS on your server. 

## 2- Install MongoDB
### Step 1 — Installing MongoDB
Install MongoDB version 4.4

mongo
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -

mongo
apt-key list

mongo
$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

mongo
sudo apt update

mongo
sudo apt install -y mongodb-org

### Step 2 — Starting the MongoDB Service and Testing the Database
mongotest
sudo systemctl start mongod.service

mongotest
sudo systemctl status mongod

mongotest
sudo systemctl enable mongod


### Note: For managing the MongoDB Service you can use the following commands:
bash
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl start mongod
sudo systemctl restart mongod
sudo systemctl disable mongod
sudo systemctl enable mongod


## 3- Install nginx web server 
https://phoenixnap.com/kb/how-to-install-nginx-on-ubuntu-20-04  or https://www.linuxcapable.com/how-to-install-nginx-with-lets-encrypt-tls-ssl-on-ubuntu-20-04/

nginx
sudo apt update

nginx
sudo apt -y install nginx

nginx
systemctl status nginx


### Update the nginx.conf in /etc/nginx/nginx.conf also edit server_name  subdomain.yourdomain.com; 

codenginx

user www-data;
worker_processes auto;
pid /run/nginx.pid;
# include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 1024;
	# multi_accept on;
}

http {

	##
	# Basic Settings
	##
	
	sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    # keepalive_timeout   6000;
    # types_hash_max_size 2048;
    client_max_body_size 100M;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;
	
	##
	# Virtual Host Configs
	##

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;
	
	
	##
	# Logging Settings
	##
	
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    
	
    server {
        gzip on;
        listen 80;
    
        server_name  _;
        root         /usr/share/nginx/html;
		
		##
		# SSL Settings
		##
		
		ssl_certificate  ssl/webpublic.pem;
		ssl_certificate_key ssl/webprivate.pem;
		
		server_name  subdomain.yourdomain.com;    
        return 301 https://$host$request_uri;
    }
	

    server {
		gzip on;
	    listen       443 ssl;
		
		##
		# SSL Settings
		##
	  
	    ssl_certificate  ssl/webpublic.pem;
	    ssl_certificate_key ssl/webprivate.pem;


	    location / {
			proxy_pass http://localhost:80;
			proxy_http_version 1.1;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection 'upgrade';
			proxy_set_header Host $host;
			proxy_cache_bypass $http_upgrade;
		
			add_header "Pragma" "no-cache";
			add_header "Expires" "-1";
			add_header Last-Modified $date_gmt;
			add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
			if_modified_since off;
			expires off;
			etag off;
	    }
		
		# This section is for backend server on port 3000
		location /app {

			proxy_pass http://localhost:3000;
			proxy_http_version 1.1;
			proxy_set_header Upgrade $http_upgrade;
			proxy_set_header Connection 'upgrade';
			proxy_set_header Host $host;
			proxy_cache_bypass $http_upgrade;
		
			add_header "Pragma" "no-cache";
			add_header "Expires" "-1";
			add_header Last-Modified $date_gmt;
			add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
			if_modified_since off;
			expires off;
			etag off;

	    }
		
	}
}



### Restart Nginx

nginx
systemctl restart nginx



## 4- Installation of Node.js (Version 16.14.2) and NestJS on Ubuntu

bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm install -g n        
n 16.14.2
npm i -g @nestjs/cli 


## 5- Configure Firewall 
Allow ssh connection:
run
sudo ufw allow OpenSSH

Allow nginx connection
run
sudo ufw allow 'nginx full'

Allow mobile devices connect to server through port 3000 
run
sudo ufw allow 3000

Allow IoT devices connect to broker server through port 8883 
run
sudo ufw allow 8883


Enable firewall 
run
sudo ufw enable

Check firewall status
run
sudo ufw status

## 6- Clone the project
Create 'implementation' folder in root directory and clone
the project in /root/implementation/ directory.

## 7- Prepare app host configuration
In project root folder, find .env file and edit:
HOST_NAME_OR_IP='subdomain.yourdomain.com'

put ssl certificate files in following directory:
assets/certificates/webprivate.pem
assets/certificates/webpublic.pem

## 8- Installation of packages
In the project root directory run the following command:

bash
npm install


## 9- Running the app

bash
# development
npm run start

# watch mode (For developers)
npm run start:dev

# production mode (For developers)
npm run start:prod

# with pm2 
sudo npm i -g pm2
# For first run of the app or after pull the project from GitHub or any change in project's code, before run following command you must run the app with "npm run start" once.
pm2 start dist/main.js --name "Backend Server"
pm2 save
pm2 startup


## Test

bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please read more here.

## Stay in touch

- Author - Kamil Myśliwiec
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - @nestframework

## License

Nest is [MIT licensed](LICENSE).
