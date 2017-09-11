#!/usr/bin/env bash
# for Development

# --build: Build images before starting containers
# --abort-on-container-exit: stop all container if any container is stopped
docker-compose up --build --abort-on-container-exit
