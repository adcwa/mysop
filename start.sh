#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js before running this script."
    exit 1
fi

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Install MidScene CLI globally
echo "Installing MidScene CLI globally..."
npm install -g @midscene/cli || handle_error "Failed to install MidScene CLI"

# Create required directories if they don't exist
mkdir -p frontend/node_modules || handle_error "Failed to create frontend node_modules directory"
mkdir -p backend/node_modules || handle_error "Failed to create backend node_modules directory"

# Install dependencies for frontend
echo "Installing frontend dependencies..."
cd frontend
npm install || handle_error "Failed to install frontend dependencies"

# Build the frontend
echo "Building the frontend..."
npm run build || handle_error "Failed to build the frontend"

# Return to root directory
cd ..

# Install dependencies for backend
echo "Installing backend dependencies..."
cd backend
npm install || handle_error "Failed to install backend dependencies"

# Return to root directory
cd ..

# Start the backend and frontend
echo "Starting the application..."
cd backend && npm run dev &
backend_pid=$!
cd ../frontend && npm run dev &
frontend_pid=$!

# Setup cleanup for when script is terminated
trap "kill $backend_pid $frontend_pid; exit" INT TERM EXIT

# Wait for both processes
wait $backend_pid $frontend_pid 