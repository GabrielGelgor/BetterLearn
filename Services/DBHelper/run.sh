#!/bin/bash
cd ..
docker build -t gabrielgelgor/dbhelper .
docker run -p 5555:5555 -d gabrielgelgor/dbhelper