import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiProperty({example: 'Create a new Angular project', required: false })
    title?: string;

    @ApiProperty({ example: 'Create a new Angular project to manage your tasks', required: false })
    description?: string;

    @ApiProperty({ 
        example: false, 
        description: 'Whether the task is completed', 
        required: false 
    })
    completed?: boolean;
}
