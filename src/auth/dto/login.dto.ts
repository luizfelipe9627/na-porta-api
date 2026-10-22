import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/utils/validation-messages';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Endereço de email do usuário.',
    example: 'admin@naporta.com',
    format: 'email',
  })
  @IsEmail(
    {},
    {
      message: VALIDATION_MESSAGES.validEmail('O email'),
    },
  )
  email: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: 'Senha123!',
    format: 'password',
  })
  @IsString({
    message: VALIDATION_MESSAGES.string('A senha'),
  })
  @IsNotEmpty({
    message: VALIDATION_MESSAGES.required('A senha'),
  })
  password: string;
}
