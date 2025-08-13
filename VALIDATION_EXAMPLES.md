# Cities API Validation Examples

This document provides examples of how the validation works for the Cities API.

## Valid Requests

### ✅ Valid Country Names
```bash
# Basic country name
curl "http://localhost:3000/api/cities?country=india"

# Country with spaces
curl "http://localhost:3000/api/cities?country=united%20states"

# Mixed case (will be converted to lowercase)
curl "http://localhost:3000/api/cities?country=InDiA"

# Country with multiple spaces
curl "http://localhost:3000/api/cities?country=new%20zealand"
```

## Invalid Requests (Will Return 400 Bad Request)

### ❌ Missing Country Parameter
```bash
curl "http://localhost:3000/api/cities"
```
**Response:**
```json
{
  "statusCode": 400,
  "message": ["Country parameter is required"],
  "error": "Bad Request"
}
```

### ❌ Empty Country Parameter
```bash
curl "http://localhost:3000/api/cities?country="
```
**Response:**
```json
{
  "statusCode": 400,
  "message": ["Country parameter is required"],
  "error": "Bad Request"
}
```

### ❌ Country Too Short
```bash
curl "http://localhost:3000/api/cities?country=a"
```
**Response:**
```json
{
  "statusCode": 400,
  "message": ["Country must be at least 2 characters long"],
  "error": "Bad Request"
}
```

### ❌ Country Too Long
```bash
curl "http://localhost:3000/api/cities?country=verylongcountrynamethatexceedsfiftycharacters"
```
**Response:**
```json
{
  "statusCode": 400,
  "message": ["Country must not exceed 50 characters"],
  "error": "Bad Request"
}
```

### ❌ Country with Numbers
```bash
curl "http://localhost:3000/api/cities?country=india123"
```
**Response:**
```json
{
  "statusCode": 400,
  "message": ["Country must contain only letters and spaces"],
  "error": "Bad Request"
}
```

### ❌ Country with Special Characters
```bash
curl "http://localhost:3000/api/cities?country=india@#$"
```
**Response:**
```json
{
  "statusCode": 400,
  "message": ["Country must contain only letters and spaces"],
  "error": "Bad Request"
}
```

## Data Transformation

The API automatically transforms the country parameter:

1. **Lowercase conversion**: `InDiA` → `india`
2. **Trim whitespace**: `  india  ` → `india`
3. **URL decoding**: `united%20states` → `united states`

## Testing

Run the validation test suite:
```bash
node test-validation.js
```

This will test all the scenarios above and show the results.
