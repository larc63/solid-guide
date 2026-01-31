#!/bin/bash

cd solid-urls
docker compose -f docker-compose-prod.yaml build

cd ../artifacts/
rm *.tar.gz
./saveImages.sh


