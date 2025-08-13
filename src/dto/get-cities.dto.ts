import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetCitiesDto {
    @ApiProperty({
        description: 'Country code to filter cities (dropdown selection)',
        example: 'PL',
        enum: ['PL', 'DE', 'ES', 'FR'],
        enumName: 'CountryCode'
    })
    @IsString({ message: 'Country must be a string' })
    @IsNotEmpty({ message: 'Country is required' })
    @IsIn(['PL', 'DE', 'ES', 'FR'], { message: 'Country must be one of: PL, DE, ES, FR' })
    @Transform(({ value }) => value?.toUpperCase().trim())
    country: string;
}
