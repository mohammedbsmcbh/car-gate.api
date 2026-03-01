#!/bin/bash

EMAIL="test_${RANDOM}@example.com"
PASSWORD="Password123!"

echo "Registering user: $EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"Test User\", \"role\": \"INDIVIDUAL\", \"phone\": \"12345678\"}")

echo "Register Response: $REGISTER_RESPONSE"

# Use node to extract access token reliably
ACCESS_TOKEN=$(node -e "try { console.log(JSON.parse('$REGISTER_RESPONSE').accessToken); } catch(e) { console.error(e); process.exit(1); }")

if [ $? -ne 0 ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "Failed to get access token"
  exit 1
fi

echo "Access Token: $ACCESS_TOKEN"

echo "Getting Me..."
ME_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Me Response: $ME_RESPONSE"
