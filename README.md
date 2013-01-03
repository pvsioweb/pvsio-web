pvsio-web
=========

A javascript library to connect to and communicate with a pvsio process using websockets.

Prerequisites
-------------
Before installation, please ensure you download and install pvs and pvsio on your computer and make sure pvsio is available as a command on your path.
Visit http://pvs.csl.sri.com/download.shtml to download PVS.

This package also depends on nodejs (http://nodejs.org/download/). Please download and install nodejs before proceeding to installing pvsio-web.

Installation
------------
# git
clone this repository, cd into the pvsio-web directory and run
	node pvssocketserver.js
	
# npm install (recommended)
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
You can interact with the infusion pump demo by navigating to 
http://localhost:8081/demos/pump/

You can interact with the interactive prototype builder by navigating your browser to
http://localhost:8081/demos/gip/
