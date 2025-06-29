import { BadRequestException } from '@nestjs/common';

import { passwordFormatValidation } from './password-utils.service';

describe('passwordFormatValidation', () => {
  it('should pass for valid password', () => {
    const validPasswords = [
      'Password1',
      'Strong123',
      'HelloWorld9',
      'A1bcdefg',
      'MyPassw0rd',
    ];

    for (const password of validPasswords) {
      expect(() => passwordFormatValidation(password)).not.toThrow();
    }
  });

  it('should throw for password without uppercase', () => {
    expect(() => passwordFormatValidation('password1')).toThrow(BadRequestException);
  });

  it('should throw for password without lowercase', () => {
    expect(() => passwordFormatValidation('PASSWORD1')).toThrow(BadRequestException);
  });

  it('should throw for password without digit', () => {
    expect(() => passwordFormatValidation('Password')).toThrow(BadRequestException);
  });

  it('should throw for password too short', () => {
    expect(() => passwordFormatValidation('Pw1')).toThrow(BadRequestException);
  });

  it('should include the expected message in the error', () => {
    try {
      passwordFormatValidation('short');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toContain('Password must contain');
    }
  });
});
