#!/bin/bash
# source vars.env

# echo $BUILD_NUMBER

cd platform && docker build -t platform:Oct23 . && cd ..

cd client && docker build -t client:Oct23 . && cd ..

# echo "BUILD_NUMBER=$(($BUILD_NUMBER+1))" > vars.env