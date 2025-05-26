#!/bin/bash

# Test script for Mini Bug Reporter integration

echo "===== Testing Mini Bug Reporter Integration ====="
echo

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "1. Starting the backend service..."
docker-compose -f docker-compose.standalone.yml up -d db backend
echo "   Waiting for backend to start..."
sleep 10

# Test the backend API
echo "2. Testing backend API..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/bugs)

if [ "$response" == "200" ]; then
    echo "   ✅ Backend API is working properly!"
else
    echo "   ❌ Backend API returned status code $response. Check the logs with 'docker-compose -f docker-compose.standalone.yml logs backend'"
fi

echo
echo "3. Testing CORS configuration..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" http://localhost:8080/api/bugs)

if [ "$response" == "200" ]; then
    echo "   ✅ CORS is configured properly!"
else
    echo "   ❌ CORS test failed with status code $response. Check the CORS configuration in application.properties."
fi

echo
echo "4. Creating a test bug report..."
curl -s -X POST -H "Content-Type: application/json" -d '{"title":"Test Bug","description":"This is a test bug","priority":"MEDIUM","metadata":{"reportedBy":"test@example.com","sourcePage":"/test"}}' http://localhost:8080/api/bugs

echo
echo "5. Retrieving bug reports..."
curl -s http://localhost:8080/api/bugs | grep -o '"title":"Test Bug"'

if [ $? -eq 0 ]; then
    echo "   ✅ Successfully created and retrieved a test bug report!"
else
    echo "   ❌ Failed to create or retrieve the test bug report. Check the logs."
fi

echo
echo "===== Integration Test Complete ====="
echo
echo "To stop the services, run:"
echo "docker-compose -f docker-compose.standalone.yml down"
echo
echo "To integrate with your frontend, use the BugReporter component with:"
echo "apiEndpoint: 'http://localhost:8080/api/bugs'" 