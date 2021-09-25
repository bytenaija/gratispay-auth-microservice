import {
  CreateGoogleUserDto,
  CreateUserDto,
  PinDto,
} from '../../models/apiModels/user.dto';
import { LoginDto } from '../../models/apiModels/login.dto';
import { Public } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger/';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'result Token' })
  @Public()
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'Created User' })
  @Public()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('google')
  @ApiBody({ type: CreateGoogleUserDto })
  @ApiOkResponse({ description: 'Created User' })
  @Public()
  async googleLogin(@Body() createGoogleUserDto: CreateGoogleUserDto) {
    return this.authService.googleLogin(createGoogleUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('pin')
  @ApiBody({ type: PinDto })
  verifyPin(@Request() req, @Body() pinData: PinDto) {
    pinData.userId = req.user.id;
    return this.authService.getPin(pinData);
  }

  @Patch('pin')
  @ApiBody({ type: PinDto })
  setPin(@Request() req, @Body() pinData: PinDto) {
    pinData.userId = req.user.id;
    return this.authService.setPin(pinData);
  }

  @Get('pin')
  checkPinSet(@Request() req) {
    return this.authService.checkPinSet(req.user.id);
  }
}
