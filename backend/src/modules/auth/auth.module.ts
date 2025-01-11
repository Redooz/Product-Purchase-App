import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../../app/config/configuration';
import { ConfigType } from '@nestjs/config';
import { AuthUsecase } from '@/auth/domain/api/usecase/auth.usecase';
import { AuthServicePort } from '@/auth/domain/api/auth.service.port';
import { LocalStrategy } from '@/auth/infrastructure/external/strategies/local.strategy';
import { JwtStrategy } from '@/auth/infrastructure/external/strategies/jwt.strategy';
import { JwtServiceAdapter } from '@/auth/infrastructure/external/adapter/jwt.service.adapter';
import { JwtServicePort } from '@/auth/domain/spi/jwt.service.port';
import { AuthExceptionHandler } from '@/auth/infrastructure/input/rest/exceptionhandler/auth.exception.handler';
import { AuthHandler } from '@/auth/application/handler/auth.handler';
import { CustomerModule } from '@/customer/customer.module';
import { AuthController } from '@/auth/infrastructure/input/rest/controller/auth.controller';

@Module({
  imports: [
    CustomerModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [configuration.KEY],
      useFactory: async (configService: ConfigType<typeof configuration>) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUsecase,
    LocalStrategy,
    JwtStrategy,
    JwtServiceAdapter,
    AuthExceptionHandler,
    AuthHandler,
    {
      provide: AuthServicePort,
      useExisting: AuthUsecase,
    },
    {
      provide: JwtServicePort,
      useExisting: JwtServiceAdapter,
    },
  ],
})
export class AuthModule {}
