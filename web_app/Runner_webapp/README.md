## 1- Prepare operating system
First of all install Ubuntu 20.04 LTS on your server. 

## 2- Installation of Node.js (Version 16.14.2) and NestJS on Ubuntu

```bash
$ sudo apt update
$ sudo apt install nodejs
$ sudo apt install npm
$ sudo npm install -g n        
$ n 16.14.2
$ npm i -g @nestjs/cli 
```

## 3- Configure Firewall 
Allow ssh connection:
```run
$ sudo ufw allow OpenSSH
```
Allow nginx connection
```run
$ sudo ufw allow 'nginx full'
```
Allow mobile devices connect to server through port 3000 
```run
$ sudo ufw allow 4000
```
Enable firewall 
```run
$ sudo ufw enable
```
Check firewall status
```run
$ sudo ufw status
```
## 4- Clone the project
Create 'implementation' folder in root directory and clone
the project in /root/implementation/ directory.


## 5- Installation of packages
In the project root directory run the following command:

```bash
$ npm install
```

## 6- Running the app

```bash
# Build the project
$ tsc

# Run the program
$ node dist/main.js

# production mode (For developers)
$ npm run start:prod

# with pm2 
# For first run of the app or after pull the project from GitHub or any change in project's code, before run following command you must run the app with "tsc" once.
$ pm2 start dist/main.js --name "Webapp Server"
```