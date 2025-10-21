import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './user/jwt-auth/jwt.strategy';
import { StorageModule } from './storage/storage.module';
import { CoursModule } from './cours/cours.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './user/jwt-auth/jwt-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/e-learning"),
    UserModule,
    AuthModule,
    StorageModule,
    CoursModule,
  ],
  providers: [{
    provide:APP_GUARD,
    useClass:JwtAuthGuard
  }],
  controllers: [ UserController],
})
export class AppModule {}
