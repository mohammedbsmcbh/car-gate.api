#!/bin/bash

AGENCY_EMAIL="agency_${RANDOM}@example.com"
PASSWORD="Password123!"

echo "1. Registering Agency: $AGENCY_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$AGENCY_EMAIL\", \"password\": \"$PASSWORD\", \"name\": \"Test Agency\", \"role\": \"AGENCY\", \"phone\": \"$RANDOM\"}")
  
ACCESS_TOKEN=$(node -e "try { console.log(JSON.parse('$REGISTER_RESPONSE').accessToken); } catch(e) { console.error(e); process.exit(1); }")

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Failed to register agency"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi
echo "Agency Token: ${ACCESS_TOKEN:0:20}..."

echo -e "\n2. Creating Listing..."
LISTING_RESPONSE=$(curl -s -X POST http://localhost:3000/api/listings \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Toyota Camry 2024",
    "description": "Brand new Camry",
    "make": "Toyota",
    "model": "Camry",
    "year": 2024,
    "price": 30000,
    "mileage": 0,
    "type": "CAR",
    "color": "White",
    "transmission": "Automatic",
    "fuelType": "Petrol"
  }')

echo "Listing Response: $LISTING_RESPONSE"
LISTING_ID=$(node -e "try { console.log(JSON.parse('$LISTING_RESPONSE').id); } catch(e) { console.error(e); }")

if [ -z "$LISTING_ID" ] || [ "$LISTING_ID" == "undefined" ]; then
    echo "Failed to create listing"
    exit 1
fi
echo "Listing Created: $LISTING_ID"

echo -e "\n3. Checking Public Feed (Should be empty as it is PENDING)..."
FEED_RESPONSE=$(curl -s -X GET http://localhost:3000/api/listings)
echo "Feed Response: $FEED_RESPONSE"

echo -e "\n4. Checking My Listings (Should contain 1)..."
MY_LISTINGS=$(curl -s -X GET http://localhost:3000/api/listings/my \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo "My Listings: $MY_LISTINGS"
