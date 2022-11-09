import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserModel, UserSliceStateModel } from '../../models';
import { RootState } from '../store';

const initialState: UserSliceStateModel = {
  user: undefined,
  isLoggedIn: false,
};

const signIn: CaseReducer<UserSliceStateModel, PayloadAction<UserModel>> = (
  state,
  action
) => {
  state.user = { ...state.user, ...action.payload };
  state.isLoggedIn = true;
};

const register: CaseReducer<UserSliceStateModel, PayloadAction<UserModel>> = (
  state,
  action
) => {
  state.user = { ...state.user, ...action.payload };
  state.isLoggedIn = true;
};

const signOut: CaseReducer<UserSliceStateModel> = (state) => {
  state.user = undefined;
  state.isLoggedIn = false;
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    signIn,
    register,
    signOut,
  },
});

export const selectUser = (state: RootState) => state.user.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export const userActions = userSlice.actions;
export default userSlice.reducer;
