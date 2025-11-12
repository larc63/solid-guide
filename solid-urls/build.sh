#!/bin/bash
# source vars.env

# echo $BUILD_NUMBER

cd rp && docker build -t rp:alpha . && cd ..

cd platform && docker build -t platform:alpha . && cd ..

cd client && docker build -t client:alpha . && cd ..

# echo "BUILD_NUMBER=$(($BUILD_NUMBER+1))" > vars.env