<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

This project contains a NestJS application that provides a REST API for retrieving cities and pollution data.

## Cities API

### GET /api/cities

Retrieves cities data filtered by country.

**Query Parameters:**
- `country` (string, required): The country to filter cities by (case-insensitive)
  - Must be 2-50 characters long
  - Must contain only letters and spaces
  - Will be automatically converted to lowercase and trimmed

**Example Request:**
```
GET /api/cities?country=PL
```

**Example Response:**
```json
{
  "cities": [
    {
      "id": 1,
      "name": "Warsaw",
      "country": "PL",
      "pollution": {
        "aqi": 45,
        "level": "Good"
      },
      "description": "Warsaw is the capital and largest city of Poland..."
    },
    {
      "id": 2,
      "name": "Krakow",
      "country": "PL",
      "pollution": {
        "aqi": 52,
        "level": "Moderate"
      },
      "description": "Krakow is the second-largest and one of the oldest cities in Poland..."
    }
  ],
  "total": 25,
  "country": "PL",
  "page": 1,
  "limit": 10,
  "pollutionDataAvailable": true,
  "totalPages": 3,
  "sortedBy": "air_quality_index_ascending"
}
```

## Running the Application
1. Clone the repository
   ```bash
   git clone https://github.com/mptamilselvan/bookinguru.git
   ```
2. Navigate to the cities-api directory:
   ```bash
   cd bookinguru
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

6. The API will be available at `http://localhost:3000` (or your configured PORT)
7. Swagger documentation will be available at `http://localhost:3000/api-docs` (or your configured PORT)

## Testing

### Test the API
```bash
# Test with valid countries
curl "http://localhost:3000/api/cities?country=PL"
curl "http://localhost:3000/api/cities?country=DE"
curl "http://localhost:3000/api/cities?country=ES"
curl "http://localhost:3000/api/cities?country=FR"

# Test validation (should return 400 error)
curl "http://localhost:3000/api/cities?country=US"
curl "http://localhost:3000/api/cities?country=IN"
curl "http://localhost:3000/api/cities"
```

### Run Validation Tests
```bash
node test-validation.js
```

### Test Swagger Documentation
```bash
node test-swagger.js
```
## Configuration

For detailed configuration information, see [CONFIGURATION.md](./CONFIGURATION.md).

### Environment Variables

The application uses environment variables for configuration:

- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production/test)
- `EXTERNAL_API_USERNAME`: External API username
- `EXTERNAL_API_PASSWORD`: External API password
- `EXTERNAL_API_BASE_URL`: External API base URL
- `EXTERNAL_API_AUTH_TIMEOUT`: Authentication timeout
- `EXTERNAL_API_DATA_TIMEOUT`: Data request timeout
- `TOKEN_EXPIRY_HOURS`: Token expiry time
- `LOG_LEVEL`: Logging level

## API Features

- No authentication required
- Returns JSON format
- Case-insensitive country filtering
- Input validation with detailed error messages
- Automatic data transformation (lowercase, trim)
- Includes city details: id, name, state, population, and country
- Returns total count of cities for the specified country
- Interactive API documentation with Swagger UI
- External API integration for pollution data
- Automatic fallback to local data when external API is unavailable
- Environment-based configuration management
- Multi-page data fetching and aggregation
- Automatic sorting by air quality index
- Wikipedia integration for city descriptions
- Intelligent token caching and refresh mechanism
- Dropdown validation for country parameter (PL, DE, ES, FR)

## Validation Rules

The API includes dropdown-style validation for the `country` parameter:

- **Required**: Country parameter must be provided
- **String type**: Must be a valid string
- **Allowed Values**: Only **PL**, **DE**, **ES**, **FR** are accepted
- **Case Insensitive**: pl, PL, Pl all work (converted to uppercase)
- **Dropdown Selection**: Swagger UI shows dropdown with valid options

### Supported Countries

| Code | Country |
|------|---------|
| PL   | Poland  |
| DE   | Germany |
| ES   | Spain   |
| FR   | France  |

### Example Validation Errors

```json
{
  "statusCode": 400,
  "message": [
    "Country must be one of: PL, DE, ES, FR"
  ],
  "error": "Bad Request"
}
```

## Swagger Documentation

The API includes comprehensive interactive documentation powered by Swagger UI.

### Accessing Swagger UI

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

### Features

- **Interactive API Explorer**: Test API endpoints directly from the browser
- **Request/Response Examples**: See example requests and responses
- **Parameter Validation**: Visual indication of required parameters and their constraints
- **Response Models**: Detailed schema for all response types
- **Error Documentation**: Complete documentation of error responses

### Swagger UI Features

1. **Try it out**: Click "Try it out" to test endpoints directly
2. **Parameter Input**: Enter parameters with validation hints
3. **Response Preview**: See actual API responses
4. **Schema Documentation**: View detailed data models
5. **Authentication**: (Not required for this API)

### Example Usage in Swagger UI

1. Navigate to `http://localhost:3000/api-docs`
2. Find the "cities" section
3. Click on "GET /api/cities"
4. Click "Try it out"
5. Enter a country name (e.g., "india")
6. Click "Execute"
7. View the response and response headers

## External API Integration

The API integrates with an external pollution data service to provide real-time air quality information for cities.

### External API Endpoints

1. **Authentication**: `POST https://be-recruitment-task.onrender.com/auth/login`
   - Payload: `{ "username": "testuser", "password": "testpass" }`
   - Returns: Bearer token for API access

2. **Pollution Data**: `GET https://be-recruitment-task.onrender.com/pollution`
   - Parameters: `country`, `page`, `limit`
   - Headers: `Authorization: Bearer <token>`
   - Returns: Pollution data for cities in the specified country

### Data Flow

1. **Primary Flow**: 
   - Authenticate with external API
   - Fetch pollution data for the requested country
   - Transform data to city format with air quality information
   - Return enriched city data

2. **Fallback Flow**:
   - If external API fails, use local city data
   - Maintain API consistency with local data structure
   - Log warning messages for monitoring

### Response Enhancements

When external API data is available, the response includes:
- `airQualityIndex`: Numerical air quality measurement
- `airQualityLevel`: Qualitative air quality description
- `timestamp`: When the pollution data was measured
- `pollutionDataAvailable`: Boolean indicating data source
- `page` & `limit`: Pagination information

### Example Enhanced Response

```json
{
  "cities": [
    {
      "id": 1,
      "name": "Warsaw",
      "country": "PL",
      "pollution": {
        "aqi": 45,
        "level": "Good"
      },
      "description": "Unknown"
    }
  ],
  "total": 25,
  "country": "PL",
  "page": 1,
  "limit": 10,
  "pollutionDataAvailable": true,
  "totalPages": 3,
  "sortedBy": "air_quality_index_ascending"
}
```

## Pagination and Sorting Features

The API now includes advanced data processing capabilities:

### Multi-Page Data Fetching

- **Automatic Pagination**: Fetches all available pages from the external API
- **Data Aggregation**: Combines data from multiple pages into a single response
- **Progress Logging**: Shows progress during multi-page fetching
- **Error Resilience**: Continues fetching even if individual pages fail

### Intelligent Sorting

- **Air Quality Sorting**: Automatically sorts cities by AQI (Air Quality Index)
- **Ascending Order**: Best air quality (lowest AQI) appears first
- **Consistent Results**: Same sorting applied regardless of page order
- **Performance Optimized**: Sorting applied after all data is collected

### Response Enhancements

- **`totalPages`**: Number of pages fetched from external API
- **`sortedBy`**: Indicates the sorting criteria applied
- **`total`**: Total number of cities after aggregation
- **`pollutionDataAvailable`**: Boolean indicating data source

### Example Sorting Logic

```javascript
// Cities are sorted by AQI (ascending)
const sortedData = allPollutionData.sort((a, b) => {
    const aqiA = a.pollution?.aqi || 0;
    const aqiB = b.pollution?.aqi || 0;
    return aqiA - aqiB; // Best air quality first
});
```

## Wikipedia Integration

The API integrates with Wikipedia to provide rich city descriptions.

### Wikipedia API Integration

- **Endpoint**: `GET https://en.wikipedia.org/w/api.php`
- **Parameters**: 
  - `action=query`
  - `list=search`
  - `srsearch={cityName}`
  - `format=json`
  - `origin=*`
- **Data Source**: First search result snippet from Wikipedia

### Description Processing

1. **Search**: Query Wikipedia for each city name
2. **Extract**: Get the first search result snippet
3. **Clean**: Remove HTML tags and decode entities
4. **Limit**: Truncate to 200 characters maximum
5. **Fallback**: Use default description if Wikipedia fails

### Example Wikipedia Response

Based on the [Wikipedia API search for Chennai](https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Chennai&format=json&origin=*), the API extracts snippets like:

```json
{
  "query": {
    "search": [
      {
        "snippet": "Chennai, also known as Madras (its official name until 1996), is the capital and largest city of Tamil Nadu, the southernmost state of India. It is located..."
      }
    ]
  }
}
```

### Description Cleaning Process

```javascript
// Remove HTML tags and decode entities
const cleanSnippet = snippet
    .replace(/<[^>]*>/g, '')           // Remove HTML tags
    .replace(/&amp;/g, '&')            // Decode &amp;
    .replace(/&lt;/g, '<')             // Decode &lt;
    .replace(/&gt;/g, '>')             // Decode &gt;
    .replace(/&quot;/g, '"')           // Decode &quot;
    .replace(/&#39;/g, "'")            // Decode &#39;
    .replace(/&nbsp;/g, ' ')           // Decode &nbsp;
    .replace(/\s+/g, ' ')              // Normalize whitespace
    .trim();                           // Trim edges

// Limit length
if (cleanSnippet.length > 200) {
    cleanSnippet = cleanSnippet.substring(0, 200) + '...';
}
```

### Enhanced Response Example

```json
{
  "cities": [
    {
      "id": 1,
      "name": "Warsaw",
      "country": "PL",
      "pollution": {
        "aqi": 45,
        "level": "Good"
      },
      "description": "Warsaw is the capital and largest city of Poland. The metropolis stands on the Vistula River in east-central Poland, and its population is officially estimated at 1.8 million residents within a greater metropolitan area of 3.1 million residents..."
    }
  ],
  "total": 25,
  "country": "PL",
  "page": 1,
  "limit": 10,
  "pollutionDataAvailable": true,
  "totalPages": 3,
  "sortedBy": "air_quality_index_ascending"
}
```

## Token Caching and Refresh System

The API implements an intelligent token management system to optimize performance and reduce authentication overhead.

### Token Lifecycle Management

#### **1. Initial Authentication**
- **Endpoint**: `POST https://be-recruitment-task.onrender.com/auth/login`
- **Payload**: `{ "username": "testuser", "password": "testpass" }`
- **Response**: `{ "token": "...", "refreshToken": "...", "expiresIn": 60 }`

#### **2. Token Caching**
- **Cache Duration**: 60 seconds (with 10-second buffer)
- **Storage**: In-memory token storage
- **Validation**: Automatic expiry checking before each request

#### **3. Token Refresh**
- **Endpoint**: `POST https://be-recruitment-task.onrender.com/auth/refresh`
- **Payload**: `{ "refreshToken": "..." }`
- **Trigger**: When current token expires
- **Fallback**: New authentication if refresh fails

### Performance Optimization

#### **Token Caching Benefits:**
- **Reduced Latency**: Subsequent requests use cached tokens
- **Fewer API Calls**: No repeated authentication requests
- **Better Performance**: Significant response time improvement
- **Automatic Management**: Seamless token lifecycle handling

#### **Smart Token Validation:**
```typescript
async getValidToken(): Promise<string> {
    // Check if we have a valid token (with 10 second buffer)
    if (this.authToken && this.tokenExpiry && Date.now() < (this.tokenExpiry - 10000)) {
        return this.authToken;
    }

    // Try refresh if token expired
    if (this.refreshToken && this.authToken && this.tokenExpiry && Date.now() >= this.tokenExpiry) {
        try {
            return await this.refreshAuthToken();
        } catch (error) {
            // Fall through to new authentication
        }
    }

    // Perform new authentication
    return await this.authenticate();
}
```

### Error Handling and Recovery

#### **Token Expiry Handling:**
- **401 Response**: Automatically clear tokens and retry
- **Refresh Failure**: Fall back to new authentication
- **Network Issues**: Graceful degradation with retry logic

#### **Token Refresh Process:**
```typescript
async refreshAuthToken(): Promise<string> {
    const response = await axios.post(
        `${this.baseUrl}/auth/refresh`,
        { refreshToken: this.refreshToken },
        { timeout: this.authTimeout }
    );

    if (response.data && response.data.token) {
        this.authToken = response.data.token;
        this.refreshToken = response.data.refreshToken || this.refreshToken;
        const expiresIn = response.data.expiresIn || 60;
        this.tokenExpiry = Date.now() + (expiresIn * 1000);
        return this.authToken;
    }
}
```

### Performance Metrics

#### **Expected Performance Improvements:**
- **First Request**: ~2000-3000ms (authentication + data fetch)
- **Cached Requests**: ~500-1000ms (data fetch only)
- **Performance Gain**: 60-80% improvement for subsequent requests

#### **Token Management Features:**
- ✅ **Automatic Caching**: Tokens cached for 60 seconds
- ✅ **Smart Refresh**: Automatic refresh before expiry
- ✅ **Error Recovery**: Graceful fallback on failures
- ✅ **Performance Monitoring**: Response time tracking
- ✅ **Memory Efficient**: Minimal memory footprint

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
