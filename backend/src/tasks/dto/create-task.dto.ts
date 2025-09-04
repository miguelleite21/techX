import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Study Angular', description: 'Title of the task' })
  title: string;

    @ApiProperty({ 
        example: 'Review Angular components and services', 
        description: 'Description of the task', 
        required: false 
    })
    description?: string;
}
