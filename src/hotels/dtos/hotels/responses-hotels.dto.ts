import { ApiProperty } from '@nestjs/swagger';
export class CityBase {
  @ApiProperty({
    description: 'The id of the city',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the city',
    type: 'string',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The status of the city',
    type: 'boolean',
    example: true,
    required: false,
  })
  status?: boolean;
}

export class ImageBase {
  @ApiProperty({
    description: 'The id of the image',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the image',
    type: 'string',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The url of the image',
    type: 'string',
    example:
      'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
  })
  secure_url: string;

  @ApiProperty({
    description: 'The status of the image',
    type: 'boolean',
    example: true,
    required: false,
  })
  status?: boolean;
}

class HotelBase {
  @ApiProperty({
    description: 'The id of the hotel',
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the hotel',
    type: 'string',
    example: 'Test',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the hotel',
    type: 'string',
    example: 'Test',
  })
  description: string;

  @ApiProperty({
    description: 'The address of the hotel',
    type: 'string',
    example: 'Av. Test 123',
  })
  address: string;

  @ApiProperty({
    description: 'The email of the hotel',
    type: 'string',
    example: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The rating of the hotel',
    type: 'string',
    example: '5',
  })
  rating: string;

  @ApiProperty({
    description: 'The city of the hotel',
    type: CityBase,
    example: {
      id: 1,
      name: 'Test',
      status: true,
    },
  })
  city: CityBase;

  @ApiProperty({
    description: 'The images of the hotel',
    type: ImageBase,
    isArray: true,
  })
  images: ImageBase[];

  @ApiProperty({
    description: 'The status of the user',
    type: 'boolean',
    example: true,
    required: false,
  })
  status?: boolean;
}

export class ResGetHotelDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'Hotel found',
  })
  message?: string;

  @ApiProperty({
    description: 'Hotel data',
    type: HotelBase,
    example: {
      id: 1,
      name: 'Test',
      address: 'Av. Test 123',
      email: 'test@gmail.com',
      rating: '5',
      city: 'Lima',
      status: true,
      images: [
        {
          id: 1,
          name: 'Test',
          secure_url:
            'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
          status: true,
        },
      ],
    },
  })
  hotel: HotelBase;
}

export class ResGetHotelsDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'Hotels found',
  })
  message?: string;

  @ApiProperty({
    description: 'List of hotels',
    type: HotelBase,
    isArray: true,
    example: [
      {
        id: 1,
        name: 'Test',
        address: 'Av. Test 123',
        email: 'test@gmail.com',
        rating: '5',
        city: 'Lima',
        status: true,
        images: [
          {
            id: 1,
            name: 'Test',
            secure_url:
              'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
            status: true,
          },
        ],
      },
    ],
  })
  hotels: HotelBase[];
}

export class ResCreateHotelDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'User created',
  })
  message?: string;

  @ApiProperty({
    description: 'New hotel created',
    type: HotelBase,
    example: {
      id: 1,
      name: 'Test',
      address: 'Av. Test 123',
      email: 'test@gmail.com',
      rating: '5',
      city: 'Lima',
      status: true,
      images: [
        {
          id: 1,
          name: 'Test',
          secure_url:
            'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
          status: true,
        },
      ],
    },
  })
  hotel: HotelBase;
}

export class ResDeleteHotelDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'Hotel deleted',
  })
  message?: string;

  @ApiProperty({
    description: 'New hotel created',
    type: HotelBase,
    example: {
      id: 1,
      name: 'Test',
      address: 'Av. Test 123',
      email: 'test@gmail.com',
      rating: '5',
      city: 'Lima',
      status: true,
      images: [
        {
          id: 1,
          name: 'Test',
          secure_url:
            'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
          status: true,
        },
      ],
    },
  })
  hotel: HotelBase;
}

export class ResUpdateHotelDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    type: 'boolean',
    example: true,
  })
  ok?: boolean;

  @ApiProperty({
    description: 'Message of the request',
    type: 'string',
    example: 'Hotel updated',
  })
  message?: string;

  @ApiProperty({
    description: 'New hotel created',
    type: HotelBase,
    example: {
      id: 1,
      name: 'Test',
      address: 'Av. Test 123',
      email: 'test@gmail.com',
      rating: '5',
      city: 'Lima',
      status: true,
      images: [
        {
          id: 1,
          name: 'Test',
          secure_url:
            'https://res.cloudinary.com/djlmqpd2n/image/upload/v1623771233/avatars/1.jpg',
          status: true,
        },
      ],
    },
  })
  hotel: HotelBase;
}
