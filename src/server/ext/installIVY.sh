#!/bin/bash
echo "Installing IVY..."
cat IVY.zip.part* > IVY.zip
rm -rf IVY
unzip -qq IVY.zip
rm -rf IVY.zip
echo "IVY installed successfully!"
