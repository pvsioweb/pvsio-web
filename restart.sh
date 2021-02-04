#!/bin/bash
# npm install
if [ -d "dist/server/lib" ] && [ -f "dist/server/lib/glassfish-4-1.zip.partaa" ] && 
	[ -f "dist/server/lib/glassfish-4-1.zip.partab" ] && 
	[ -f "dist/server/lib/glassfish-4-1.zip.partac" ] && 
	[ -f "dist/server/lib/glassfish-4-1.zip.partad" ] && 
	[ -f "dist/server/lib/glassfish-4-1.zip.partae" ] && 
	[ -f "dist/server/lib/glassfish-4-1.zip.partaf" ] && 
	[ -f "dist/server/lib/glassfish-4-1.zip.partag" ] && 
	[ ! -d "dist/server/lib/glassfish4" ]; then
  cd dist/server/lib/
  ./installNC.sh
  cd ../../..
fi
if [ -d "dist/server/ext" ] && [ ! -d "dist/server/ext/IVY" ] &&
    [ -f "dist/server/ext/IVY.zip.partaa" ] && 
	[ -f "dist/server/ext/IVY.zip.partab" ] && 
	[ -f "dist/server/ext/IVY.zip.partac" ]; then
  cd dist/server/ext/
  ./installIVY.sh
  cd ../../..
fi
if [ -d "PVS" ] && [ -f "PVS/pvs" ] && [ -f "PVS/pvsio" ] && [ -f "PVS/proveit" ]; then
    PVS_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )/PVS"
    echo "PVS installation found at $PVS_DIR"
	if [ -d "PVS/nasalib" ]; then
		NASALIB_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )/PVS/nasalib"
		echo "NASA LIB found at $NASALIB_DIR"
		export PVS_LIBRARY_PATH=$NASALIB_DIR
		cd PVS/nasalib
		./install-scripts
		cd ../..
	else
		cd PVS
		bin/relocate
		cd ..
	fi
	cd dist/server
	node PVSioWebServer.js pvsdir:$PVS_DIR restart
elif [ -f "../pvs" ] && [ -f "../pvsio" ] && [ -f "../proveit" ]; then
    PVS_DIR=${PWD%/*}
    pvsioweb_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
    echo "PVS installation found at $PVS_DIR"
	if [ -d "$PVS_DIR/nasalib" ]; then
		NASALIB_DIR="$PVS_DIR/nasalib"
		echo "NASA LIB found at $NASALIB_DIR"
		export PVS_LIBRARY_PATH=$NASALIB_DIR
		cd $PVS_DIR/nasalib
		./install-scripts
		cd $pvsioweb_DIR
	else
		cd $PVS_DIR
		bin/relocate
		cd $pvsioweb_DIR
	fi
	cd dist/server
	node PVSioWebServer.js pvsdir:$PVS_DIR restart
else
	# pvsio -version
	# if [ $? -eq 0 ]; then
	# 	cd dist/server
	# 	node PVSioWebServer.js restart
	# else
	# 	#FAIL
    #     echo "================================================================"
    #     echo "================================================================"
	# 	echo "====   ERROR: Failed to locate PVS executable files         ===="
    #     echo "================================================================"
    #     echo "====   Please install PVSio-web within the PVS folder       ===="
    #     echo "====   or alternatively place the PVS executable files on   ===="
    #     echo "====   your PATH (see README.md for installation details).  ===="
    #     echo "================================================================"
    #     echo "================================================================"
	# 	#start in any case the UI, this is useful for developing additional PVSio-web UI components even without PVS
	# 	cd dist/server
	# 	node PVSioWebServer.js restart
	# fi
	cd dist/server
	node PVSioWebServer.js "$@"
fi
