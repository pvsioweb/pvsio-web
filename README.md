PVSio-web
=========

PVSio-web is a new graphical tool to prototype and analyse user interface software. It provides the typical functionalities of an animation environment that allows designers to load and simulate realistic user interfaces. Underneath, it uses SRI's state-of-the-art theorem prover PVS for analysis, and the pvsio component as a basis for simulation. 

Simulations created with PVSio-web can be watched in this youtube video https://www.youtube.com/watch?v=T0QmUe0bwL8

Live version
------------

A realistic prototype created using PVSio-web can be found at the following link:
http://pvsioweb.herokuapp.com/demos/BBraun

A live version of the full PVSio-web tool is available at http://pvsioweb.herokuapp.com/

Please note that the web server where the tool is installed has limited processing power and network bandwidth so its response time might not be optimal.

![Screenshot](screenshot.png?raw=true)


Prerequisites
-------------
#### Prerequisite 1: PVS
PVS (http://pvs.csl.sri.com/download.shtml) is required to run pvsio-web. Please download and install PVS before proceeding to installing pvsio-web.

Once PVS is installed, please add the PVS executable files pvs, pvsio and proveit to your PATH. A way to do this is to create symbolic links to those files, and place the symbolic links in /usr/bin. For instance, if PVS is installed in /opt/pvs6.0/pvs, the following commands executed in a Terminal window create the required symbolic links (note that you need to specify absolute paths):

    sudo ln -s /opt/pvs6.0/pvs /usr/bin/pvs
    sudo ln -s /opt/pvs6.0/pvsio /usr/bin/pvsio
    sudo ln -s /opt/pvs6.0/proveit /usr/bin/proveit

#### Prerequisite 2: NodeJS
NodeJS (http://nodejs.org/download/) is required to run pvsio-web. Please download and install NodeJS before proceeding to installing pvsio-web.

Installation
------------
To install pvsio-web, create a directory on your computer, open a Terminal window in the created directory, and execute the following commands from the created directory:

    git clone https://github.com/thehogfather/pvsio-web.git
    cd pvsio-web
    npm install


Running pvsio-web
-----------------
To run pvsio-web, a backend and a frontend need to be started.

To start the backend: open a Terminal window in the pvsio-web directory, and use the following command (and leave the Terminal window open):

    ./start.sh

To start the frontend: open a browser (Firefox 21 or greater, or Chrome), and type the following address in the address bar:

    http://localhost:8082/

Updating pvsio-web
------------------
To update pvsio-web to the latest version, open a Terminal window, and execute the following command from the pvsio-web directory:

	git pull

Examples
--------
Realistic simulations created with PVSio-web can be watched in this youtube video: https://www.youtube.com/watch?v=T0QmUe0bwL8

All simulation examples demonstrated in the youtube video are included in the PVSio-web distribution in examples/projects. To open these examples, start pvsio-web and click the "Open Projects" button of the pvsio-web frontend and select one of the examples from the list.


Directory structure
-------------------
This project has the following setup:

* start.sh - the script used to initiate the server.
* examples/ - this directory contains projects and demos
* src/ - this directory contains the pvsio-web source code
	* client/ - this directory contains the source code for the pvsio-web client. This code is executed in the user's browser
	* server/ - this directory contains the source code for the pvsio-web server. This code is executed in the node.JS environment, and manages communication between pvs/pvsio and the client code.


Nightly builds
--------------
To obtain the latest development versions of pvsio-web, you can clone our alpha and beta branches of the github repository.

To clone the alpha branch, create a new directory (for example, pvsioweb-alpha), open a Terminal window, and execute the following commands from the created directory:

    git clone https://github.com/thehogfather/pvsio-web.git -b alpha
    cd pvsio-web
    npm install

To clone the alpha branch, create a new directory (for example, pvsioweb-beta), open a Terminal window, and execute the following commands from the created directory:

    git clone https://github.com/thehogfather/pvsio-web.git -b beta
    cd pvsio-web
    npm install


Testing the installation
------------------------
To test the client, start the pvsio-web backend by running the following command in a Terminal window (and leave the Terminal window open):
	./start.sh
	
and type the following address in a browser window:

	http://localhost:8082/tests
	
To test the server, run the following command in a Terminal window

	run npm test
	
(Note: the command for testing the server is a shortcut for running jasmine-node --verbose src/server/servertests)


Uninstallation :(
--------------
To uninstall, delete the pvsio-web folder from your computer.
	
