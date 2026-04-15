import Paths from '@common/constants/Paths';
import UserController from '@domain/users/UserController';
import { Router } from 'express';

const userRouter = Router();

userRouter.get(Paths.Users.Profile, UserController.getProfile);
userRouter.put(Paths.Users.Account, UserController.updatePersonalData);
userRouter.put(Paths.Users.Password, UserController.updatePassword);
userRouter.put(Paths.Users.Education, UserController.updateEducation);
userRouter.delete(Paths.Users.Account, UserController.deleteAccount);
userRouter.delete(Paths.Users.Attempts, UserController.deleteAttempts);
userRouter.delete(Paths.Users.Messages, UserController.deleteMessages);

export default userRouter;
