PVSio-web [![Build Status](https://travis-ci.org/thehogfather/pvsio-web.svg?branch=alpha)](https://travis-ci.org/thehogfather/pvsio-web) [![NPM Downloads](https://img.shields.io/npm/dt/pvsio-web.svg?style=flat-square)](https://www.npmjs.com/package/pvsio-web)
=========

PVSio-web is a new graphical tool to prototype and analyse user interface software. It provides the typical functionalities of an animation environment that allows designers to load and simulate realistic user interfaces. Underneath, it uses SRI's state-of-the-art theorem prover PVS for analysis, and the pvsio component as a basis for simulation.

Simulations created with PVSio-web can be watched in this youtube video https://www.youtube.com/watch?v=T0QmUe0bwL8

<br>

## Live version

Realistic prototypes created using PVSio-web can be found at the following links:
* http://www.pvsioweb.org/demos/Radical7 (FDA's Generic Infusion Pump prototype - full model)
* http://www.pvsioweb.org/demos/GPCA     (Commercial patient monitor - monitoring mode only)
* http://www.pvsioweb.org/demos/AlarisGP (Commercial infusion pump prototype - full model)
* http://www.pvsioweb.org/demos/BBraun   (Commercial infusion pump prototype - data entry system only)

The full PVSio-web tool with limited features is also available at http://www.pvsioweb.org
(please note that the web server has limited processing power so its response time might not be optimal; also, note that the file system is read-only, so you will not be able to save new prototypes or compile new models using this live version).

![Screenshot](screenshot.png?raw=true)

<br>

## Installation
To install PVSio-web, first you need to install PVS and NodeJS, and then clone the PVSio-web github repository. This can be done as follows.

#### Step 1: Install PVS and add PVS executables to your PATH
PVS is required to run PVSio-web. The tool can be downloaded from http://pvs.csl.sri.com/download.shtml Installation instructions are on the aforementioned website.

Once PVS is installed, please add the following PVS executable files to your PATH: pvs, pvsio and proveit. A simple way to do this is to create symbolic links to those files, and place the symbolic links in /usr/bin. For instance, if PVS is installed in /opt/PVS/pvs, the following commands executed in a Terminal window create the required symbolic links:

    sudo ln -s /opt/PVS/pvs /usr/bin/pvs
    sudo ln -s /opt/PVS/pvsio /usr/bin/pvsio
    sudo ln -s /opt/PVS/proveit /usr/bin/proveit

Please note that the ln command requires a full path.

#### Step 2: Install NodeJS
NodeJS is required to run PVSio-web. Please download and install NodeJS from http://nodejs.org
Installation instructions are on the aforementioned website.

#### Step 3: Clone the PVSio-web repository
Create a directory where you would like to install PVSio-web on your local computer. Open a Terminal window in the created directory, and use 'git' to clone the PVSio-web repository:

    git clone https://github.com/thehogfather/pvsio-web.git
    cd pvsio-web
    npm install

PVSio-web is now installed on your local computer!

<br>

## Running PVSio-Web
To run pvsio-web, a backend and a frontend need to be started.

To start the backend: open a Terminal window in the pvsio-web directory, and use the following command (and leave the Terminal window open):

    ./start.sh

To start the frontend: open a browser (Firefox 21 or greater, or Chrome), and type the following address in the address bar:

    http://localhost:8082/

<br>

## Updating PVSio-Web
To update pvsio-web to the latest version, open a Terminal window, and execute the following command from the pvsio-web directory:

    git pull

<br>

## Examples
Realistic simulations created with PVSio-web can be watched in this youtube video:
* https://www.youtube.com/watch?v=T0QmUe0bwL8

All simulation examples demonstrated in the youtube video are included in the PVSio-web distribution in examples/projects. To open these examples, start pvsio-web and click the "Open Projects" button of the pvsio-web frontend and select one of the examples from the list.

<br>

## Structure
```
.
├── src/                         // PVSio-Web source files
│   ├── client/                  // PVSio-Web client
│   │   ├── common/              // Utility functions
│   │   ├── core/                // Core services (Connection, LayoutManager, PluginsManager, etc.)
│   │   ├── plugins/             // Plugins folder
│   │   ├── devel.html           // Client entry-point (developer view)
│   │   └── index.html           // Client entry-point
│   │
│   ├── server                   // PVSio-Web server
│   │   ├── common/              // Utility functions
│   │   ├── lib/                 // External libraries (co-simulation engine)
│   │   ├── PVSioWebServer       // Server entry-point
│   │   └── PVSioWebServer       // Server entry-point
│   │
│   └── examples/                // PVSio-Web example prototypes
│       └── helloworld/          // Helloworld example, demonstrates how to use the PVSio-Web APIs
│
├── dist/                        // folder created after running 'make', contains the PVSio-Web distribution
├── bundle/                      // folder created after running 'make', contains a webpack version of PVSio-Web
│
├── package.json                 // The extension manifest
├── Makefile                     // Makefile for building PVSio-Web
└── LICENSE                      // Open Source License Agreement
```

<br>

## Uninstallation :(
To uninstall, delete the pvsio-web folder from your computer.
