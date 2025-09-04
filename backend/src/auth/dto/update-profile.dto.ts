import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'JhonDoe', description: 'User Username' })
    username?: string;

    @ApiProperty({example: '1234', description: 'User Password'})
    password?: string;
}
