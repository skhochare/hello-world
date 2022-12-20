# CCPD

Main app is now deployed to CCPD-APP folder in var/www/html
Main api is under CCPD-API-I, deploys to api folder

CCPD: CCPD APP & API<br>
External API Demo here https://recruitment.camdenpd.com:8443/ <br>
Plesse check the files ->location: (CCPD-API/routes) for more details.

External App - CCPD Apply Form (Check the APP Demo here https://recruitment.camdenpd.com/) <br>
External App - CCPD Community Contact Form (Check the APP Demo here https://seniorcontact.camdenpd.com/) <br>
External App - CCPD HR Mobile (Check the APP Demo here https://hrmobile.camdenpd.com/) <br>
External App - CCPD Policy (Check the APP Demo here https://policy.camdenpd.com/) <br>
Plesse check the files ->location: (CCPD/app) for more details.

Internal API Demo here https://ccpd-apachesrv01.camdenpd.com:3000/ <br>
Plesse check the files ->location: (CCPD-API-I/routes) for more details.

Internal App - CCPD HR System (Check the APP Demo here https://ccpd-apachesrv01.camdenpd.com/) <br>
Internal App - CCPD Lineup (Check the APP Demo here https://lineup.camdenpd.com/) <br>
Internal App - CCPD Missing Person App(Check the APP Demo here https://missingperson.camdenpd.com/) <br>
Plesse check the files ->location: (CCPD-I/app) for more details.

# Part 1: Installing Node.js via package manager
Follow the [instruction link](https://nodejs.org/en/download/package-manager/) here.

## Updating npm & node before getting started
```
> npm install -g npm 
> npm install -g node
```
## Checking after version installation
```
> npm -v
> node -v
```
## Fixing npm issues
```
> npm rebuild
```
This command runs the npm build command on the matched folders. 
This is useful when you install a new version of node, and must recompile all your C++ addons with the new binary.

## Fixing 'Failed using git' issues
```
> sudo yum install git
```

# Part 2: Getting Started (the app)
Download the .zip file.  Extract the contents of the zip file, then open your terminal, change to the project directory, and:
```
> npm install
> npm run serve <serve/build>
```

## Adding the hidden file .babelrc to the project directory before npm run <serve/build>
### .babelrc (support IE 11 now)
```
{
  "presets": ["@babel/preset-react",
    ["@babel/preset-env", {
        "targets": {
          "browsers": ["last 2 versions", "safari >= 7"]
        }
      }]
    ],
  "plugins": ["transform-es2015-arrow-functions"]
}
```

## Development Mode (local server)

### `npm run serve`
Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Running application on webpack-dev-server from terminal forever?
Install nohup, then start the process with the following:
#### Using Nohup
```
> npm install nohup
> sudo nohup npm run serve</dev/null &> /dev/null &
```

### Stopping running application on webpack-dev-server from terminal?
Open the terminal, then change to the project directory, and:
#### Finding the PID number:
```
> ps -ef
```
#### Killing the PID number:
```
> kill -9 <PID>
```

### Running webpack-dev-server on different host or port?
In package.json file
#### Changing the "scripts" from 
```
"scripts": {
    "serve": "webpack-dev-server",
    ...
  }
```
#### To
```
"scripts": {
    "serve": "webpack-dev-server --inline --host <hostname/ip> --port <number>",
    ...
  }
```

### Running webpack-dev-server on IE 9 and IE 10?
Open the terminal, then change to the project directory, and:
#### Changing the "webpack-dev-server" from latest version
```
> npm uninstall webpack-dev-server
```
#### To version @2.7.1 or earlier
```
> npm install --save-dev webpack-dev-server@2.7.1 
```


## Production Mode (cloud server)
```
> ssh UserName@172.16.17.63 (the internal app) || ssh UserName@10.100.10.22 (the external app)
> cd /var/www/html
```
### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


### Deploying to Apache http server 
Change your httpd.conf file on /etc/httpd/conf : <br>
From DocumentRoot “/var/www/html” To DocumentRoot “/var/www/html/dist” <br> 
From <Directory “/var/www/html”> To <Directory “/var/www/html/dist”>

### Getting react routing to work with Apache
change your .htaccess and insert this:
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

or change your httpd.conf and insert this:
```
<VirtualHost *:port>
  ServerName xxx
  DocumentRoot /var/www/html/xxx

  <Directory "/var/www/html/xxx
    ...

    RewriteEngine on
    # Don't rewrite files or directories
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]
    # Rewrite everything else to index.html to allow html5 state links
    RewriteRule ^ index.html [L]
  </Directory>
</VirtualHost>
```

Check [link1](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writting-manually)
or [link2](https://www.reddit.com/r/reactjs/comments/4e6lbt/getting_react_routing_to_work_with_apache2/y) for your refernece.

### Restarting Apache http server (Red Hat Linux Version 7.x or newer)
```
> systemctl restart httpd.service
```

### Starting Apache http server (Red Hat Linux Version 7.x or newer)
```
> systemctl start httpd.service
```

### Stopping Apache http server (Red Hat Linux Version 7.x or newer)
```
> systemctl stop httpd.service
```

# Part 3: Getting Started (the api)
Download the .zip file.  Extract the contents of the zip file, then open your terminal, change to the project directory, and:
```
> npm install
```

## Development Mode (local server)
### `node server.js`
Runs the api in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Production Mode (cloud server)
```
> ssh UserName@172.16.17.63 (the internal api) || ssh UserName@10.100.10.22 (the external api)
> cd /var/www/api
> pm2 start server.js
```

### Restarting API server
```
> pm2 restart server.js
```

### Stop API server
```
> pm2 stop server.js
```

### Start API server
```
> pm2 start server.js
```
