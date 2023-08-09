import { ApiProperty } from '@nestjs/swagger';

export class ResDeleteCloudinaryFileDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    examples: ['ok', 'not found'],
  })
  result: string;
}

export enum CloudinaryImageStatusEnum {
  DELETED = 'deleted',
  NOT_FOUND = 'not_found',
}

export class ResDeleteCloudinaryFilesDto {
  @ApiProperty({
    description: 'Information about the deleted files',
    type: 'object',
    example: {
      'hotel-app/hotels/hotels/images/faf3a3ff-e10c-48d8-95be-ff15b677b3e7-20230704_121528':
        'deleted',
      'hotel-app/hotels/hotels/images/b3837d3e-a07a-414f-b73d-37d81fff9cf4-20230704_121701':
        'not_found',
    },
  })
  deleted: {
    [key: string]: CloudinaryImageStatusEnum;
  };

  @ApiProperty({
    description: 'Information about the deleted files',
    type: 'object',
    example: {
      'hotel-app/hotels/hotels/images/faf3a3ff-e10c-48d8-95be-ff15b677b3e7-20230704_121528':
        { original: 1, derived: 0 },
      'hotel-app/hotels/hotels/images/3802ecb6-d465-4fe2-8da9-1aaccd92ee31-20230704_121528':
        { original: 1, derived: 0 },
    },
  })
  deleted_counts: {
    [key: string]: { original: number; derived: number };
  };

  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: false,
  })
  partial: boolean;

  @ApiProperty({
    description: 'The number of requests allowed per hour',
    type: 'number',
    example: 500,
  })
  rate_limit_allowed: number;

  @ApiProperty({
    description: 'The time when the rate limit will be reset',
    type: 'string',
    example: '2023-07-04T18:00:00.000Z',
  })
  rate_limit_reset_at: Date;

  @ApiProperty({
    description: 'The number of requests remaining in the current hour',
    type: 'number',
    example: 496,
  })
  rate_limit_remaining: number;
}
