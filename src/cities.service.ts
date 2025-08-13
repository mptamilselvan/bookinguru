import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CityDto, GetCitiesResponseDto } from './dto/city-response.dto';
import { ExternalApiService } from './external-api.service';

export interface City {
    id: number;
    name: string;
    state: string;
    population: number;
    country: string;
}

@Injectable()
export class CitiesService {
    constructor(private readonly externalApiService: ExternalApiService) { }

    async getCitiesByCountry(country: string): Promise<GetCitiesResponseDto> {
        try {
            // Get pollution data from external API
            const limit = 10;
            const pollutionData = await this.externalApiService.getPollutionData(country, 1, limit);
            console.log('pollutionData', pollutionData);

            // Fetch all pages of pollution data
            const allPollutionData = await this.fetchAllPollutionData(country, limit, pollutionData.meta.totalPages);

            // Sort the array based on pollution level (AQI) - lowest to highest
            const sortedPollutionData = allPollutionData.sort((a, b) => {
                const aqiA = a.pollution?.aqi || 0;
                const aqiB = b.pollution?.aqi || 0;
                return aqiA - aqiB; // Ascending order (best air quality first)
            });

            // Transform pollution data to city format with Wikipedia descriptions
            const cities = await Promise.all(
                sortedPollutionData.map(async (item, index) => {
                    // Get Wikipedia snippet for the city
                    const description = await this.externalApiService.getWikipediaSnippet(item.name);

                    return {
                        id: index + 1,
                        name: item.name,
                        country: country,
                        pollution: item.pollution,
                        description: description,
                    };
                })
            );

            return {
                cities: cities,
                total: sortedPollutionData.length,
                limit: limit,
                page: 1,
                totalPages: pollutionData.meta.totalPages,
            };
        } catch (error) {
            // If external API fails, fall back to local data
            console.warn(`External API failed for country ${country}, falling back to local data:`, error.message);

            return {
                cities: [],
                total: 0,
                page: 1,
                limit: 0
            };
        }
    }

    /**
     * Fetch all pages of pollution data for a country
     */
    private async fetchAllPollutionData(country: string, limit: number, totalPages: number): Promise<any[]> {
        const allPollutionData: any[] = [];

        // Fetch data from all pages
        for (let page = 1; page <= totalPages; page++) {
            try {
                console.log(`Fetching page ${page} of ${totalPages} for country ${country}`);
                const pageData = await this.externalApiService.getPollutionData(country, page, limit);

                if (pageData.results && Array.isArray(pageData.results)) {
                    allPollutionData.push(...pageData.results);
                }

                // Add a small delay to avoid overwhelming the API
                if (page < totalPages) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            } catch (error) {
                console.warn(`Failed to fetch page ${page} for country ${country}:`, error.message);
                // Continue with other pages even if one fails
            }
        }

        console.log(`Fetched ${allPollutionData.length} pollution records for country ${country}`);
        return allPollutionData;
    }
}
