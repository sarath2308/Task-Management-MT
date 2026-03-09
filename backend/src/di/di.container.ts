import { AuthController } from "@/controller/auth.controller";
import { TaskController } from "@/controller/task.controller";
import { IAuthService } from "@/interface/auth.service.interface";
import { IAuthenticateMiddleware } from "@/interface/auth/auth.middleware.interface";
import { IEmailService } from "@/interface/emai.service.interface";
import { IpasswordService } from "@/interface/password.service.interface";
import { ITaskRepo } from "@/interface/task.repo.interface";
import { ITaskService } from "@/interface/task.service.interface";
import { IUserRepo } from "@/interface/user.repo.interface";
import { IUserService } from "@/interface/user.service.interface";
import { AuthenticateMiddleware } from "@/middleware/auth.middleware";
import taskModel, { ITask } from "@/model/task.model";
import { IUser, User } from "@/model/user.mode";
import { RedisRepository } from "@/repo/redis.repo";
import { TaskRepo } from "@/repo/task.repo";
import { UserRepo } from "@/repo/user.repo";
import { AuthService } from "@/services/auth.service";
import { TaskService } from "@/services/task.service";
import { UserService } from "@/services/user.service";
import { TYPES } from "@/types/inversify/inversify.types";
import { EmailService } from "@/utils/email.service";
import { IOtpService, OtpService } from "@/utils/otp.service";
import { PasswordService } from "@/utils/password.service";
import { ITokenService, TokenService } from "@/utils/token.service";
import { Container } from "inversify";
import { Model } from "mongoose";
import "reflect-metadata";

const container = new Container();

//models
container.bind<Model<IUser>>(TYPES.IUser).toConstantValue(User);
container.bind<Model<ITask>>(TYPES.ITask).toConstantValue(taskModel);

//repo
container
  .bind(TYPES.IRedisRepo)
  .to(RedisRepository).inSingletonScope();
container.bind<IUserRepo>(TYPES.IUserRepo).to(UserRepo).inSingletonScope();
container.bind<ITaskRepo>(TYPES.ITaskRepo).to(TaskRepo).inSingletonScope();

// services
container
  .bind<ITokenService>(TYPES.ITokenService)
  .to(TokenService)
  .inSingletonScope();
container
  .bind<IAuthService>(TYPES.IAuthService)
  .to(AuthService)
  .inSingletonScope();
container
  .bind<IEmailService>(TYPES.IEmailService)
  .to(EmailService)
  .inSingletonScope();
container
  .bind<IOtpService>(TYPES.IOtpService)
  .to(OtpService)
  .inSingletonScope();
container
  .bind<IpasswordService>(TYPES.IPasswordService)
  .to(PasswordService)
  .inSingletonScope();
container
  .bind<IUserService>(TYPES.IUserService)
  .to(UserService)
  .inSingletonScope();
container.bind<ITaskService>(TYPES.ITaskService).to(TaskService).inSingletonScope();
//middleware
container
  .bind<IAuthenticateMiddleware>(TYPES.IAuthMiddleware)
  .to(AuthenticateMiddleware);

//controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<TaskController>(TYPES.TaskController).to(TaskController);

export default container;
