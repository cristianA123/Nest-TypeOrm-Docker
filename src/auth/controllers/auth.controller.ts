import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SignupUserDto, LoginAuthDto } from '../dtos';
import { AuthService } from '../services';
import { GoogleOAuth2Guard, RefreshTokenGuard } from '../guards';
import { GetCurrentUser, Public, GetCurrentUserId } from '../decorators';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuth2Guard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOAuth2Guard)
  async googleAuthCallback(@Req() req) {
    return this.authService.handleGoogleAuth2(req.user);
  }

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signupLocal(signupUserDto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.siginLocal(loginAuthDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @ApiSecurity('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
