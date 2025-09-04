import { Controller, Post, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import {  UpdateUserDto } from './dto/update-profile.dto';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  register(@Body() dto: CreateUserDto) {
    return this.service.register(dto.username, dto.password);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: Object })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.username, dto.password);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth() 
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
    return this.service.updateProfile(req.user.sub, dto.username, dto.password);
  }
}