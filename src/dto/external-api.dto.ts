import { ApiProperty } from '@nestjs/swagger';

// Authentication DTOs
export class LoginRequestDto {
    @ApiProperty({
        description: 'Username for authentication',
        example: 'testuser'
    })
    username: string;

    @ApiProperty({
        description: 'Password for authentication',
        example: 'testpass'
    })
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({
        description: 'Authentication token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    token: string;

    @ApiProperty({
        description: 'Token type',
        example: 'Bearer'
    })
    type: string;

    @ApiProperty({
        description: 'Refresh token for token renewal',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        required: false
    })
    refreshToken?: string;

    @ApiProperty({
        description: 'Token expiry in seconds',
        example: 60
    })
    expiresIn: number;
}

// Pollution API DTOs
export class PollutionDataDto {
    @ApiProperty({
        description: 'City name',
        example: 'Warsaw'
    })
    name: string;

    @ApiProperty({
        description: 'Pollution data',
        example: 10
    })
    pollution: number;

}

export class PollutionResponseDto {
    @ApiProperty({
        description: 'Array of pollution data',
        type: [PollutionDataDto],
        isArray: true
    })
    results: PollutionDataDto[];


    meta: {
        page: number;
        limit: number;
        totalPages: number;
    };



}

// Error DTOs
export class ExternalApiErrorDto {
    @ApiProperty({
        description: 'Error message',
        example: 'Authentication failed'
    })
    message: string;

    @ApiProperty({
        description: 'Error status code',
        example: 401
    })
    statusCode?: number;
}
