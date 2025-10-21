import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Token, TokenSchema } from './entities/Token.entity';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule
import { JwtStrategy } from './jwt-auth/jwt.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },  { name: Token.name, schema: TokenSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Use a more secure secret in production
      signOptions: { expiresIn: '1h' },  // Set token expiry (e.g., 1 hour)
    }),
  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
