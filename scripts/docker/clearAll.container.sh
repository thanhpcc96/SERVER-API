D#!/bin/bash
#delete all container

docker rm -f $(docker ps -a -q)