import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersCqrsController } from './users-cqrs.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

// Command Handlers
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';
import { LoginUserHandler } from './commands/handlers/login-user.handler';

// Query Handlers
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetAllUsersHandler } from './queries/handlers/get-all-users.handler';
import { GetUserByEmailHandler } from './queries/handlers/get-user-by-email.handler';
import { ValidateUserHandler } from './queries/handlers/validate-user.handler';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  LoginUserHandler,
];

const QueryHandlers = [
  GetUserHandler,
  GetAllUsersHandler,
  GetUserByEmailHandler,
  ValidateUserHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UsersController, UsersCqrsController],
  providers: [UsersService, JwtStrategy, ...CommandHandlers, ...QueryHandlers],
  exports: [UsersService],
})
export class UsersModule {}
