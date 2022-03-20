PVSio-web [![Build Status](https://travis-ci.org/thehogfather/pvsio-web.svg?branch=alpha)](https://travis-ci.org/thehogfather/pvsio-web) [![NPM Downloads](https://img.shields.io/npm/dt/pvsio-web.svg?style=flat-square)](https://www.npmjs.com/package/pvsio-web)
=========

PVSio-web is a graphical toolkit based on Web technologies for rapid prototyping and analysis of human-machine interfaces. A library of widgets is provided to support the development of realistic user interfaces. Underneath, the toolkit uses the PVS theorem proving system for analysis, and the PVS-io component for simulation.

PVSio-web has been applied successfully to the analysis of medical devices, to identify latent design anomalies that could lead to use errors. Watch this YouTube video for additional info: https://www.youtube.com/watch?v=T0QmUe0bwL8


News
------------
(March 2022) The rapid prototyping capabilities of PVSio-web are now integrated in in [VSCode-PVS](https://github.com/nasa/vscode-pvs), a modern development environment for the PVS verification systems.

<img src="https://github.com/nasa/vscode-pvs/raw/master/vscode-pvs/screenshots/vscode-pvs-rapid-prototyping.gif" width="600"> <br>



Examples
------------

Realistic prototypes created using PVSio-web can be found at the following links:
* http://www.pvsioweb.org/demos/Radical7 (FDA's Generic Infusion Pump prototype - full model)
* http://www.pvsioweb.org/demos/GPCA     (Commercial patient monitor - monitoring mode only)
* http://www.pvsioweb.org/demos/AlarisGP (Commercial infusion pump prototype - full model)
* http://www.pvsioweb.org/demos/BBraun   (Commercial infusion pump prototype - data entry system only)

A live version of the PVSio-web toolkit is available at http://www.pvsioweb.org
(the version has limited capabilities, in particular the file system is read-only, so you will not be able to save any change).



Installation
------------
The latest version of PVSio-web is integrated in [VSCode-PVS](https://github.com/nasa/vscode-pvs), which can be downloaded from the [Visual Studio Code marketplace](https://marketplace.visualstudio.com/items?itemName=paolomasci.vscode-pvs).


Widgets Library
-----------
If you want to use the widget library of PVSio-web, please please clone the [typescript branch](https://github.com/pvsioweb/pvsio-web/tree/typescript) and check the [README.md](https://github.com/pvsioweb/pvsio-web/blob/typescript/README.md) file. 

Examples demonstrating how to use PVSio-web as a library can be found in the [src/examples](https://github.com/pvsioweb/pvsio-web/tree/typescript/src/examples/demos) folder. Use those examples as a reference to learn how to import the widgets and instantiate them.


> Note: PVS v7.1 is needed to execute some of the PVSio-web prototypes. The tool can be downloaded with [VSCode-PVS](https://github.com/nasa/vscode-pvs).

> When using PVSio-web as a library, you will need to add the `pvs`, `pvsio` and `proveit` scripts of the PVS distribution to your PATH environment variable. A simple way to do this is to create symbolic links to those files, and place the symbolic links in /usr/bin. For instance, if PVS is installed in /opt/PVS/pvs, the following commands executed in a Terminal window create the required symbolic links:

>    `sudo ln -s /opt/PVS/pvs /usr/bin/pvs`

>    `sudo ln -s /opt/PVS/pvsio /usr/bin/pvsio`

>    `sudo ln -s /opt/PVS/proveit /usr/bin/proveit`

>
> Please note that the `ln` command requires a full path.
