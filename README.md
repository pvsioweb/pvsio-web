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
To install pvsio-web, use one of the following methods:

### method 1: download pvsio-web as a zip file & use npm to resolve dependencies
Download the zip archive of the project from [https://github.com/thehogfather/pvsio-web/archive/master.zip](https://github.com/thehogfather/pvsio-web/archive/master.zip). Extract the zip file to a location of your preference.

Then, download all remaining dependencies by running the following command from a Terminal window opened in the pvsio-web folder:

    sudo npm install


### method 2: use npm to download pvsio-web

    sudo npm install pvsio-web -g

The installer will copy pvsio-web in /usr/local/lib/node_modules/pvsio-web. By default, the directory is owned by "nobody". You will need to change the ownership and assign it to your user with the following command:

    sudo chown -R myUserName /usr/local/lib/node_modules/pvsio-web

(where "myUserName" is to be replaced with the actual username on your machine)

### method 3: clone git repository
Create a directory pvsio-web. Open a Terminal in the created directory, and clone the pvsio-web repository using the following command:

    git clone https://github.com/thehogfather/pvsio-web.git

Then, download all remaining dependencies by running the following command from a Terminal window opened in the pvsio-web folder:

    sudo npm install


Running pvsio-web
-----------------
To run pvsio-web, a backend and a frontend need to be started.

To start the backend: open a Terminal window in the pvsio-web directory, and use the following command (and leave the Terminal window open):

    ./start.sh

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
