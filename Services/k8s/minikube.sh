#!/bin/bash
cd ../Authentication
docker build -t gabrielgelgor/authentication .
cd ../client
docker build -t gabrielgelgor/client .
cd ../DBHelper 
docker build -t gabrielgelgor/dbhelper .
cd ../ElasticSearch
docker build -t gabrielgelgor/search-worker .
#cd ..
#kubectl apply -f /k8s/