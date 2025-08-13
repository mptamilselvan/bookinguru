import { Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { GetCitiesDto } from './dto/get-cities.dto';
import { GetCitiesResponseDto, ValidationErrorDto } from './dto/city-response.dto';

@ApiTags('cities')
@Controller('api/cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) { }

    @Get()
    @ApiOperation({
        summary: 'Get cities by country',
        description: 'Retrieves a list of cities filtered by the specified country. The country parameter is case-insensitive and will be automatically converted to lowercase.'
    })
    @ApiQuery({
        name: 'country',
        description: 'The country to filter cities by (2-50 characters, letters and spaces only) <br/> Available values : PL, DE, ES, FR',
        example: 'PL',
        required: true
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved cities',
        type: GetCitiesResponseDto
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Validation error - invalid country parameter',
        type: ValidationErrorDto
    })
    @ApiResponse({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        description: 'External API service unavailable - falling back to local data',
        type: GetCitiesResponseDto
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        type: ValidationErrorDto
    })
    async getCities(@Query() query: GetCitiesDto): Promise<GetCitiesResponseDto> {
        return this.citiesService.getCitiesByCountry(query.country);
    }
}
