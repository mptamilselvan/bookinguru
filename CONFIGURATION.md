# Configuration Guide

This document explains how to configure the Cities API application using environment variables.

## Environment Variables

The application uses a `.env` file to manage configuration. Copy `.env.example` to `.env` and modify the values as needed.

### Application Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port number for the application to run on |
| `NODE_ENV` | `development` | Environment (development, production, test) |
| `LOG_LEVEL` | `info` | Logging level (error, warn, info, debug) |

### External API Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `EXTERNAL_API_BASE_URL` | `https://be-recruitment-task.onrender.com` | Base URL for external API |
| `EXTERNAL_API_USERNAME` | `testuser` | Username for external API authentication |
| `EXTERNAL_API_PASSWORD` | `testpass` | Password for external API authentication |
| `EXTERNAL_API_AUTH_TIMEOUT` | `10000` | Authentication request timeout (ms) |
| `EXTERNAL_API_DATA_TIMEOUT` | `15000` | Data request timeout (ms) |
| `TOKEN_EXPIRY_HOURS` | `1` | Token expiry time in hours |

## Setup Instructions

### 1. Create Environment File

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your configuration
nano .env
```

### 2. Configure External API Credentials

Update the external API credentials in your `.env` file:

```env
EXTERNAL_API_USERNAME=your_username
EXTERNAL_API_PASSWORD=your_password
```

### 3. Environment-Specific Configuration

#### Development
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

#### Production
```env
NODE_ENV=production
PORT=8080
LOG_LEVEL=warn
```

#### Testing
```env
NODE_ENV=test
PORT=3001
LOG_LEVEL=error
```

## Security Considerations

### Environment Variables

- **Never commit `.env` files** to version control
- Use `.env.example` for documentation
- Use different credentials for different environments
- Rotate credentials regularly

### External API Security

- Store credentials securely
- Use environment variables for sensitive data
- Consider using a secrets management service in production
- Monitor API usage and implement rate limiting

## Configuration Validation

The application validates configuration on startup:

- Required environment variables are checked
- Default values are provided for optional variables
- Invalid values are logged as warnings

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the `PORT` variable in `.env`
   - Check if another service is using the port

2. **External API authentication fails**
   - Verify `EXTERNAL_API_USERNAME` and `EXTERNAL_API_PASSWORD`
   - Check network connectivity
   - Verify the external API is available

3. **Timeout errors**
   - Increase timeout values in `.env`
   - Check network latency
   - Verify external API performance

### Debug Mode

Enable debug logging by setting:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

This will provide detailed logs for troubleshooting.

## Example Configuration Files

### Minimal Configuration
```env
PORT=3000
NODE_ENV=development
EXTERNAL_API_USERNAME=testuser
EXTERNAL_API_PASSWORD=testpass
```

### Production Configuration
```env
PORT=8080
NODE_ENV=production
LOG_LEVEL=warn
EXTERNAL_API_BASE_URL=https://be-recruitment-task.onrender.com
EXTERNAL_API_USERNAME=prod_user
EXTERNAL_API_PASSWORD=prod_pass
EXTERNAL_API_AUTH_TIMEOUT=15000
EXTERNAL_API_DATA_TIMEOUT=20000
TOKEN_EXPIRY_HOURS=2
```
