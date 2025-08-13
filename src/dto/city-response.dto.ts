import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
    @ApiProperty({
        description: 'Unique identifier for the city',
        example: 1
    })
    id: number;

    @ApiProperty({
        description: 'Name of the city',
        example: 'Mumbai'
    })
    name: string;

    @ApiProperty({
        description: 'Pollution data of the city',
        example: { aqi: 45, level: 'Good' },
        required: false
    })
    pollution?: any;

    @ApiProperty({
        description: 'Country where the city is located',
        example: 'india'
    })
    country: string;

    @ApiProperty({
        description: 'Description or additional info about the city',
        example: 'Unknown',
        required: false
    })
    description?: string;
}

export class GetCitiesResponseDto {
    @ApiProperty({
        description: 'Array of cities matching the country filter',
        type: [CityDto],
        isArray: true
    })
    cities: CityDto[];

    @ApiProperty({
        description: 'Total number of cities found',
        example: 10
    })
    total: number;


    @ApiProperty({
        description: 'Current page number',
        example: 1
    })
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10
    })
    limit: number;


    @ApiProperty({
        description: 'Total number of pages fetched from external API',
        example: 5,
        required: false
    })
    totalPages?: number;

}

export class ValidationErrorDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: 400
    })
    statusCode: number;

    @ApiProperty({
        description: 'Array of validation error messages',
        example: ['Country parameter is required', 'Country must be at least 2 characters long'],
        isArray: true
    })
    message: string[];

    @ApiProperty({
        description: 'Error type',
        example: 'Bad Request'
    })
    error: string;
}
