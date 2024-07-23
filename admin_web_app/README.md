<p align="center">
  <a href="http://fidesonnova.io/" target="blank"><img src="https://fidesinnova.io/Download/FidesInnova-Token-Logo.png" width="200" alt="FidesInnova Logo" /></a>
</p>
<p align="center">Step-by-step Installation Instructions for <a href="http://fidesinnova.io" target="_blank">FidesInnova Admin Web App</a>.</p>
<p align="center">

## 1-Clone the project
```
cd /root
git clone https://github.com/FidesInnova/admin_web_app_panel.git
```

### Note:
  * The program's source is situated in the folder "Source_webapp". After building it from the source, you can place it in the "Runner_webapp/frontend". The runner section has already been executed on the server following the provided instructions.
  * If you are a Node owner, contact FidesInnova team at info@fidesinnova.io to add your Admin Web App URL address to FidesInnova website.
## 2- Installation of packages
```
cd ~/admin_web_app_panel/Source_webapp
npm install
```

## 3- Prepare app configuration
-  In project root folder, create `.env` file and edit parameters based on your node URL info
```
cd ~/admin_web_app_panel/Source_webapp
sudo nano .env
```
Inside the `.env` file, past the parameters.
*  Make sure to add `/app/` to the end of the `VITE_URL` path!
```
VITE_URL='panel.YOUR_DOMAIN.COM/app/'
```
### Put SSL certificate files in the following path:
```
/root/admin_web_app_panel/Runner_webapp/assets/certificates/webpublic.pem
/root/admin_web_app_panel/Runner_webapp/assets/certificates/webprivate.pem
```

## 4- Build
```
cd ~/admin_web_app_panel/Source_webapp
npm run build
```
**The build artifacts will be stored in the `admin_web_app_panel/Source_webapp/build/` directory, you must copy the contents of the `build` folder into the `admin_web_app_panel/Runner_webapp/frontend`.
**


## 5- Configure Firewall
Allow Admin Web App to connect to the server through port 5000 
```
sudo ufw allow 5000
```
## 6- Install npm packages for Runner
```
cd ~/admin_web_app_panel/Runner_webapp
npm i
```

## 7- Run the project with pm2
```
cd ~/admin_web_app_panel/Runner_webapp
pm2 start main.js --name "Admin Web App"
```
## 8- Running the project in developer mode
### Build the project
```
tsc
```
### Run the program
```
node main.js
```
### production mode (For developers)
```
npm run start:prod
```
