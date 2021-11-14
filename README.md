PVSio-web 3.0 (preview)
=========

PVSio-web 3.0 is a new toolkit for rapid prototyping and analysis of interactive systems. The toolkit is develped in TypeScript, and uses Web Technologies to create realistic interactive simulations of user interfaces. The simulations can be either fully developed in TypeScript, or use formal modeling tools such as the Prototype Verification System (PVS).

Simulations created with PVSio-web can be watched in this youtube video https://www.youtube.com/watch?v=T0QmUe0bwL8

<br>

## Requirements
To compile and execute PVSio-Web, you will need the following software installed on your system:
- NodeJS (v12.16.1 or greater) https://nodejs.org/en/download

<br>

## Installation instructions
To install PVSio-web, clone the source code from the repository (branch `typescript`) and then run make:
    
    git clone https://github.com/pvsioweb/pvsio-web.git -b typescript
    cd pvsio-web && make

<br>

## Use instructions
- Open a terminal in the pvsio-web folder, and run the bash script `./restart.sh` in the terminal window. The script will launch the PVSio-Web server on port 8082. (Please keep the terminal window open otherwise the execution of the server will be terminated.)
- Open Google Chrome at http://localhost:8082

<br>

## Examples
Examples use of PVSio-Web are provided in the `src/examples` folder.
- `helloworld`: this simple prototype demonstrates how to use the PVSio-Web widgets library
- `zoll`: this prototype introduces the use of background images and animated display elements
- `bennet`: this prototype shows how to create multi-screen displays and touchscreen buttons

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
To uninstall PVSio-Web, simply delete the `pvsio-web` folder from your computer.
