#!/bin/bash

# Build frontend
echo "Building Frontend (Material App)..."
npm run build --prefix material-react-app

# Start backend
echo "Starting Backend (Node API)..."
npm run start:prod --prefix node-api
