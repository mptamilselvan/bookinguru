import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { LoginRequestDto, LoginResponseDto, PollutionResponseDto } from './dto/external-api.dto';

@Injectable()
export class ExternalApiService {
    private readonly baseUrl: string;
    private readonly username: string;
    private readonly password: string;
    private readonly authTimeout: number;
    private readonly dataTimeout: number;
    private readonly tokenExpiryHours: number;
    private authToken: string | null = null;
    private refreshToken: string | null = null;
    private tokenExpiry: number | null = null;

    constructor() {
        this.baseUrl = process.env.EXTERNAL_API_BASE_URL || 'https://be-recruitment-task.onrender.com';
        this.username = process.env.EXTERNAL_API_USERNAME || 'testuser';
        this.password = process.env.EXTERNAL_API_PASSWORD || 'testpass';
        this.authTimeout = parseInt(process.env.EXTERNAL_API_AUTH_TIMEOUT || '10000', 10);
        this.dataTimeout = parseInt(process.env.EXTERNAL_API_DATA_TIMEOUT || '15000', 10);
        this.tokenExpiryHours = parseInt(process.env.TOKEN_EXPIRY_HOURS || '1', 10);
    }

    /**
     * Get a valid authentication token (either cached or fresh)
     */
    async getValidToken(): Promise<string> {
        // Check if we have a valid token (with 10 second buffer)
        if (this.authToken && this.tokenExpiry && Date.now() < (this.tokenExpiry - 10000)) {
            return this.authToken;
        }

        // If we have a refresh token and current token is expired, try to refresh
        if (this.refreshToken && this.authToken && this.tokenExpiry && Date.now() >= this.tokenExpiry) {
            try {
                return await this.refreshAuthToken();
            } catch (error) {
                console.warn('Token refresh failed, attempting new login:', error.message);
                // Fall through to new authentication
            }
        }

        // Perform new authentication
        return await this.authenticate();
    }

    /**
     * Authenticate with the external API and get a token
     */
    async authenticate(): Promise<string> {
        try {
            const loginPayload: LoginRequestDto = {
                username: this.username,
                password: this.password
            };

            const response: AxiosResponse<LoginResponseDto> = await axios.post(
                `${this.baseUrl}/auth/login`,
                loginPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: this.authTimeout,
                }
            );
            console.log('authenticate', response.data);
            if (response.data && response.data.token) {
                this.authToken = response.data.token;
                this.refreshToken = response.data.refreshToken || null;
                // Set token expiry based on response or default to 60 seconds
                const expiresIn = response.data.expiresIn || 60;
                this.tokenExpiry = Date.now() + (expiresIn * 1000);
                console.log(`Authentication successful. Token expires in ${expiresIn} seconds`);
                return this.authToken;
            } else {
                throw new HttpException(
                    'Invalid authentication response',
                    HttpStatus.UNAUTHORIZED
                );
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new HttpException(
                        `Authentication failed: ${error.response.data?.message || error.message}`,
                        error.response.status
                    );
                } else if (error.request) {
                    throw new HttpException(
                        'Authentication service unavailable',
                        HttpStatus.SERVICE_UNAVAILABLE
                    );
                }
            }
            throw new HttpException(
                'Authentication failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Refresh authentication token using refresh token
     */
    async refreshAuthToken(): Promise<string> {
        if (!this.refreshToken) {
            throw new HttpException(
                'No refresh token available',
                HttpStatus.UNAUTHORIZED
            );
        }

        try {
            const response: AxiosResponse<LoginResponseDto> = await axios.post(
                `${this.baseUrl}/auth/refresh`,
                { refreshToken: this.refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: this.authTimeout,
                }
            );

            if (response.data && response.data.token) {
                this.authToken = response.data.token;
                this.refreshToken = response.data.refreshToken || this.refreshToken;
                // Set token expiry based on response or default to 60 seconds
                const expiresIn = response.data.expiresIn || 60;
                this.tokenExpiry = Date.now() + (expiresIn * 1000);
                console.log(`Token refreshed successfully. New token expires in ${expiresIn} seconds`);
                return this.authToken;
            } else {
                throw new HttpException(
                    'Invalid refresh response',
                    HttpStatus.UNAUTHORIZED
                );
            }
        } catch (error) {
            // Clear tokens on refresh failure
            this.authToken = null;
            this.refreshToken = null;
            this.tokenExpiry = null;

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new HttpException(
                        `Token refresh failed: ${error.response.data?.message || error.message}`,
                        error.response.status
                    );
                } else if (error.request) {
                    throw new HttpException(
                        'Refresh service unavailable',
                        HttpStatus.SERVICE_UNAVAILABLE
                    );
                }
            }
            throw new HttpException(
                'Token refresh failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get pollution data for a specific country
     */
    async getPollutionData(country: string, page: number = 1, limit: number = 10): Promise<PollutionResponseDto> {
        try {
            // Get a valid token (cached, refreshed, or new)
            const token = await this.getValidToken();

            const response: AxiosResponse<PollutionResponseDto> = await axios.get(
                `${this.baseUrl}/pollution`,
                {
                    params: {
                        country: country.toUpperCase(),
                        page,
                        limit
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: this.dataTimeout,
                }
            );
            //console.log('getPollutionData', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // If we get a 401, clear tokens and try once more
                    if (error.response.status === 401) {
                        console.warn('Token expired, clearing cache and retrying...');
                        this.authToken = null;
                        this.refreshToken = null;
                        this.tokenExpiry = null;
                        return this.getPollutionData(country, page, limit);
                    }

                    throw new HttpException(
                        `Failed to fetch pollution data: ${error.response.data?.message || error.message}`,
                        error.response.status
                    );
                } else if (error.request) {
                    throw new HttpException(
                        'Pollution data service unavailable',
                        HttpStatus.SERVICE_UNAVAILABLE
                    );
                }
            }
            throw new HttpException(
                'Failed to fetch pollution data',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get Wikipedia snippet for a city
     */
    async getWikipediaSnippet(cityName: string): Promise<string> {
        try {
            const response = await axios.get(
                'https://en.wikipedia.org/w/api.php',
                {
                    params: {
                        action: 'query',
                        list: 'search',
                        srsearch: cityName,
                        format: 'json',
                        origin: '*'
                    },
                    timeout: 5000, // 5 second timeout for Wikipedia API
                }
            );

            if (response.data &&
                response.data.query &&
                response.data.query.search &&
                response.data.query.search.length > 0) {
                //console.log('cityName', cityName);
                //console.log('getWikipediaSnippet', response.data.query.search);
                // Get the first search result snippet
                const snippet = response.data.query.search[0].snippet;

                // Clean the snippet (remove HTML tags and decode entities)
                const cleanSnippet = this.cleanWikipediaSnippet(snippet);

                return cleanSnippet;
            }

            return 'No description available';
        } catch (error) {
            console.warn(`Failed to fetch Wikipedia snippet for ${cityName}:`, error.message);
            return 'Description unavailable';
        }
    }

    /**
     * Clean Wikipedia snippet by removing HTML tags and decoding entities
     */
    private cleanWikipediaSnippet(snippet: string): string {
        // Remove HTML tags
        let cleanSnippet = snippet.replace(/<[^>]*>/g, '');

        // Decode HTML entities
        cleanSnippet = cleanSnippet
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ');

        // Remove extra whitespace and trim
        cleanSnippet = cleanSnippet.replace(/\s+/g, ' ').trim();

        // Limit length to reasonable size
        if (cleanSnippet.length > 200) {
            cleanSnippet = cleanSnippet.substring(0, 200) + '...';
        }

        return cleanSnippet;
    }

    /**
     * Clear cached authentication tokens
     */
    clearAuthToken(): void {
        this.authToken = null;
        this.refreshToken = null;
        this.tokenExpiry = null;
        console.log('Authentication tokens cleared');
    }
}
