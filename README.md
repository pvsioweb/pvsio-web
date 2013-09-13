pvsio-web
=========

A javascript library to connect to and communicate with a pvsio process using websockets.

Prerequisites
-------------
###PVS
Before installation, please ensure you download and install pvs and pvsio on your computer and make sure pvsio is available as a command on your path.
Visit http://pvs.csl.sri.com/download.shtml to download PVS.

####Add PVS to your path
You will need to add pvs, pvsio and proveit to your PATH alternatively you can create symbolic links in /usr/bin for pvs, pvsio, and proveit with the ln command. For instance, assuming that pvs is installed in /opt/pvs6.0/pvs, the following commands should be executed in a terminal/shell:

* sudo ln -s /opt/pvs6.0/pvs /usr/bin/pvs
* sudo ln -s /opt/pvs6.0/pvsio /usr/bin/pvsio
* sudo ln -s /opt/pvs6.0/proveit /usr/bin/proveit

####nodejs
This package also depends on nodejs (http://nodejs.org/download/). Please download and install nodejs before proceeding to installing pvsio-web.

Installation
------------
### npm (recommended)
To install, use 
	sudo npm install pvsio-web -g 

The installer will copy pvsio-web in /usr/local/lib/node_modules/pvsio-web. By default, the directory is owned by "nobody". You will need to change the ownership and assign it to your user with the following command:
        sudo chown -R <username> /usr/local/lib/node_modules/pvsio-web

### git
clone this repository, cd into the pvsio-web directory and run
	node pvssocketserver.js

Running pvsio-web
-----------------
To run pvsio-web, a backend and a frontend need to be started.

* to start the backend: open a Terminal window, and use the following command (and leave the Terminal window open):
	/usr/local/lib/node_modules/pvsio-web/start.sh
	
* to start the frontend: open a browser (Firefox 21 or greater, or Chrome), and type the following address in the address bar:
       http://localhost:8082/


Demos
-----
A demo of a realistic medical infusion pump is included in the pvsio-web distribution. To execute the demo:
* start the pvsio-web backed by typing the following command in a Terminal window, and leave the Terminal window open:
       /usr/local/lib/node_modules/pvsio-web/start.sh
* start the pvsio-web frontend by opening a browser at the following address: 
       http://localhost:8082/demos/GPCA-UI_PVS/NavKeys
 

Wiki
----
A more comprehensive guide about pvsio-web can be found at https://github.com/thehogfather/pvsio-web/wiki


Uninstallation
--------------
To uninstall pvsio-web, use the following command
       sudo npm uninstall pvsio-web -g
