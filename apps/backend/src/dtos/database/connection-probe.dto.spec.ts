import { BadRequestException } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateConnectionProbeDto } from './connection-probe.dto';

describe('CreateConnectionProbeDto', () => {
  const pipe = new ZodValidationPipe();
  const validate = (value: unknown): unknown =>
    pipe.transform(value, { type: 'body', metatype: CreateConnectionProbeDto });

  it.each([{}, { message: 42 }, { message: '   ' }])('rejects %j', (body) => {
    expect(() => validate(body)).toThrow(BadRequestException);
  });

  it('trims the message', () => {
    expect(validate({ message: '  hello  ' })).toEqual({ message: 'hello' });
  });
});
