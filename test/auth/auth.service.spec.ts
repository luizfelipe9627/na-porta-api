import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/auth/auth.service';
import { JWT_EXPIRES_IN_SECONDS } from '../../src/auth/constants/jwt.constants';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { formatDateTimeWithTimezone } from '../../src/common/utils/date.util';
import { jest } from '@jest/globals';

jest.mock('../../src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

type MockUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

describe('AuthService', () => {
  let authService: AuthService;

  let usersService: {
    findByEmail: jest.Mock<
      (email: string) => Promise<MockUser | null>
    >;
  };
  let jwtService: {
    signAsync: jest.Mock<(...args: unknown[]) => Promise<string>>;
    decode: jest.Mock<
      (...args: unknown[]) => {
        iat: number;
        exp: number;
      }
    >;
  };
  let passwordHash: string;

  const usuario = {
    id: 'c4ab1c69-7e95-47b1-b1c4-7062ff5897b6',
    name: 'Administrador',
    email: 'admin@naporta.com',
    passwordHash: '',
  };

  const dadosLogin: LoginDto = {
    email: 'admin@naporta.com',
    password: 'SenhaForte123!',
  };

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(dadosLogin.password, 10);
  });

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn<(email: string) => Promise<MockUser | null>>(),
    };

    jwtService = {
      signAsync: jest
        .fn<(...args: unknown[]) => Promise<string>>()
        .mockResolvedValue('token-de-teste'),
      decode: jest
        .fn<
          (...args: unknown[]) => {
            iat: number;
            exp: number;
          }
        >()
        .mockReturnValue({
          iat: 1792625487,
          exp: 1792625487 + JWT_EXPIRES_IN_SECONDS,
        }),
    };

    authService = new AuthService(usersService as never, jwtService as never);
  });

  it('deve rejeitar a autenticação quando o e-mail não estiver cadastrado', async () => {
    usersService.findByEmail.mockResolvedValue(null);

    await expect(authService.login(dadosLogin)).rejects.toThrow(
      new UnauthorizedException('Email ou senha inválidos.'),
    );

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('deve rejeitar a autenticação quando a senha estiver incorreta', async () => {
    usersService.findByEmail.mockResolvedValue({
      ...usuario,
      passwordHash,
    });

    await expect(
      authService.login({
        email: dadosLogin.email,
        password: 'SenhaIncorreta123!',
      }),
    ).rejects.toThrow(new UnauthorizedException('Email ou senha inválidos.'));

    expect(jwtService.signAsync).not.toHaveBeenCalled();
  });

  it('deve autenticar o usuário e retornar o token com os dados de expiração', async () => {
    usersService.findByEmail.mockResolvedValue({
      ...usuario,
      passwordHash,
    });

    const resposta = await authService.login(dadosLogin);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      {
        sub: usuario.id,
        email: usuario.email,
      },
      {
        expiresIn: JWT_EXPIRES_IN_SECONDS,
      },
    );

    expect(resposta).toEqual({
      access_token: 'token-de-teste',
      token_type: 'Bearer',
      expires_in: JWT_EXPIRES_IN_SECONDS,
      expires_at: formatDateTimeWithTimezone(
        new Date((1792625487 + JWT_EXPIRES_IN_SECONDS) * 1000),
      ),
    });
  });
});
