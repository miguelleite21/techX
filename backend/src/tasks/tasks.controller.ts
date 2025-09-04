import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ApiTags, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tasks')
@ApiBearerAuth('JWT')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Post()
  @ApiBody({ type: CreateTaskDto, description: 'Data to create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created', type: Task })
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all tasks', type: [Task] })
  findAll(@Req() req) {
    return this.service.findAll(req.user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task returned successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id, req.user);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to update' })
  @ApiBody({ type: UpdateTaskDto, description: 'Data to update the task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Req() req, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID of the task to delete' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id, req.user);
  }
}
