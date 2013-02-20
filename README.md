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
### git
clone this repository, cd into the pvsio-web directory and run
	node pvssocketserver.js
	
### npm install (recommended)
To install, use 
	npm install pvsio-web -g
or (if your /usr/local/ directory is owned by root)
	sudo npm install pvsio-web -g 

Uninstallation
--------------
To uninstall use
[sudo] npm uninstall pvsio-web -g

Running
-------
To start the server, use 
	sudo pvsio-web

Demo
----
You can interact with the interactive prototype builder by navigating your browser to
http://localhost:8081/

Wiki
----
A more comprehensive guide about pvsio-web can be found at https://github.com/thehogfather/pvsio-web/wiki
