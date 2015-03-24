git clone git://git.libwebsockets.org/libwebsockets
cd libwebsockets
mkdir build
cd build
sudo apt-get install cmake
cmake -DLIB_SUFFIX=64 ..
make
