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

    sudo ln -s /opt/pvs6.0/pvs /usr/bin/pvs
    sudo ln -s /opt/pvs6.0/pvsio /usr/bin/pvsio
    sudo ln -s /opt/pvs6.0/proveit /usr/bin/proveit

####nodejs
Note that pvsio-web depends on NodeJS (http://nodejs.org/download/). Please download and install nodejs before proceeding to installing pvsio-web.

Installation
------------
To install, use

### zip
Download the zip archive of the project from [https://github.com/thehogfather/pvsio-web/archive/master.zip](https://github.com/thehogfather/pvsio-web/archive/master.zip)

Extract the zip file to a location of your preference.

To download all the dependencies of the project, change directory into the extracted folder and run

    npm install

Continue as in the instruction for __'Running pvsio-web'__

### npm

    sudo npm install pvsio-web -g

The installer will copy pvsio-web in /usr/local/lib/node_modules/pvsio-web. By default, the directory is owned by "nobody". You will need to change the ownership and assign it to your user with the following command:

    sudo chown -R myUserName /usr/local/lib/node_modules/pvsio-web

(where "myUserName" is to be replaced with the actual username on your machine)

### git
clone this repository, cd into the pvsio-web directory and run: "node pvssocketserver.js"

Running pvsio-web
-----------------
To run pvsio-web, a backend and a frontend need to be started.

To start the backend: open a Terminal window, and use the following command (and leave the Terminal window open):

    /usr/local/lib/node_modules/pvsio-web/start.sh

To start the frontend: open a browser (Firefox 21 or greater, or Chrome), and type the following address in the address bar:

    http://localhost:8082/


Demos
-----
A demo of a realistic medical infusion pump is included in the pvsio-web distribution.

To execute the demo:

Start the pvsio-web backed by typing the following command in a Terminal window, and leave the Terminal window open:

    /usr/local/lib/node_modules/pvsio-web/start.sh

Start the pvsio-web frontend by opening a browser at the following address:

    http://localhost:8082/demos/GPCA-UI_PVS/NavKeys


Wiki
----
A more comprehensive guide about pvsio-web can be found at https://github.com/thehogfather/pvsio-web/wiki


Uninstallation
--------------
To uninstall pvsio-web, use the following command

    sudo npm uninstall pvsio-web -g
