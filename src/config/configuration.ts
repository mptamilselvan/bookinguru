export interface DatabaseConfig {
    host: string;
    port: number;
}

export interface ExternalApiConfig {
    baseUrl: string;
    username: string;
    password: string;
    authTimeout: number;
    dataTimeout: number;
    tokenExpiryHours: number;
}

export interface AppConfig {
    port: number;
    environment: string;
    logLevel: string;
    externalApi: ExternalApiConfig;
}

export default (): AppConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
    externalApi: {
        baseUrl: process.env.EXTERNAL_API_BASE_URL || 'https://be-recruitment-task.onrender.com',
        username: process.env.EXTERNAL_API_USERNAME || 'testuser',
        password: process.env.EXTERNAL_API_PASSWORD || 'testpass',
        authTimeout: parseInt(process.env.EXTERNAL_API_AUTH_TIMEOUT, 10) || 10000,
        dataTimeout: parseInt(process.env.EXTERNAL_API_DATA_TIMEOUT, 10) || 15000,
        tokenExpiryHours: parseInt(process.env.TOKEN_EXPIRY_HOURS, 10) || 1,
    },
});
