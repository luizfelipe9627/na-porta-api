import { BadRequestException, ParseUUIDPipe } from '@nestjs/common';

export class ParseUuidPipe extends ParseUUIDPipe {
  constructor() {
    super({
      exceptionFactory: () =>
        new BadRequestException('O ID informado não é um UUID válido.'),
    });
  }
}
