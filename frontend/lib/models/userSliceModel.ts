import { UserModel } from './userModel';

export type UserSliceStateModel = {
  user?: UserModel;
  isLoggedIn: boolean;
};
