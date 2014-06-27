PVSio-web
=========

PVSio-web is a new graphical tool to prototype and analyse user interface software. It provides the typical functionalities of an animation environment that allows designers to load and simulate realistic user interfaces. Underneath, it uses SRI's state-of-the-art theorem prover PVS for analysis, and the pvsio component as a basis for simulation. 

Simulations created with PVSio-web can be watched in this youtube video https://www.youtube.com/watch?v=T0QmUe0bwL8

A live version of PVSio-web executed on a cloud server can be found at http://www.pvsioweb.org/

![Screenshot](screenshot.jpg?raw=true)


Prerequisites
-------------
### Prerequisite 1: PVS
PVS (http://pvs.csl.sri.com/download.shtml) is required to run pvsio-web. Please download and install PVS before proceeding to installing pvsio-web.

Once PVS is installed, please add the PVS executable files pvs, pvsio and proveit to your PATH. Alternatively you can create symbolic links to those files in /usr/bin. For instance, assuming that PVS is installed in /opt/pvs6.0/pvs, the following commands should be executed in a Terminal window to create the symbolic links:

    sudo ln -s /opt/pvs6.0/pvs /usr/bin/pvs
    sudo ln -s /opt/pvs6.0/pvsio /usr/bin/pvsio
    sudo ln -s /opt/pvs6.0/proveit /usr/bin/proveit

### Prerequisite 2: NodeJS
NodeJS (http://nodejs.org/download/) is required to run pvsio-web. Please download and install NodeJS before proceeding to installing pvsio-web.

Installation
------------
To install pvsio-web, create a directory on your computer, open a Terminal window in the created directory, and execute the following commands:

    git clone https://github.com/thehogfather/pvsio-web.git
    cd pvsio-web
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
Simulations created with PVSio-web can be watched in this youtube video: https://www.youtube.com/watch?v=T0QmUe0bwL8

All simulations examples demonstrated in the youtube video are included in the PVSio-web distribution as demo projects. To open these demo projects, start pvsio-web and click the "Open Projects" button of the pvsio-web front-end and select one of the saved projects from the list.



Wiki
----
A more comprehensive guide about pvsio-web can be found at https://github.com/thehogfather/pvsio-web/wiki


Uninstallation
--------------
To uninstall pvsio-web, use the following command

    sudo npm uninstall pvsio-web -g
