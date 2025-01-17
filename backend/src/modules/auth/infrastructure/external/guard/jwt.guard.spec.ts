import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';
import { IS_PUBLIC_KEY } from '@/auth/infrastructure/external/decorator/public.decorator';

describe('JwtAuthGuard', () => {
  let jwtAuthGuard: JwtAuthGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    jwtAuthGuard = new JwtAuthGuard(reflector);
    context = {
      getHandler: jest.fn(),
      switchToHttp: jest.fn(),
      getClass: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should allow access if route is public', () => {
    // Arrange
    jest.spyOn(reflector, 'get').mockReturnValue(true);

    // Act
    const result = jwtAuthGuard.canActivate(context);

    // Assert
    expect(result).toBe(true);
    expect(reflector.get).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
  });
});
