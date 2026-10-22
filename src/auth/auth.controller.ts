import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedError } from '../common/swagger/decorator/api-unauthorized-response.decorator';
import { ApiLoginResponse } from '../common/swagger/decorator/api-login-response.decorator';
import { ApiBadRequestError } from '../common/swagger/decorator/api-bad-request-response.decorator';
import { AUTH_REQUEST_EXAMPLES } from '../common/swagger/example/auth.example';

@Controller('auth')
@ApiTags('Autenticação')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({
    type: LoginDto,
    examples: {
      login: AUTH_REQUEST_EXAMPLES.login,
    },
  })
  @ApiLoginResponse()
  @ApiUnauthorizedError('Email ou senha inválidos.')
  @ApiBadRequestError()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
