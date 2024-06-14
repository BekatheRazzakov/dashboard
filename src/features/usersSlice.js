import {createSlice} from "@reduxjs/toolkit";
import {signIn, signUp} from "./userThunk";

const initialState = {
  user: "",
  signInLoading: false,
  signUpLoading: false,
  authorizationError: "",
  authorizationMessage: "",
};

const UsersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.user = '';
      state.signUpLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, {payload: res}) => {
      state.signUpLoading = false;
    });
    builder.addCase(signUp.rejected, (state, {payload: error}) => {
      state.signUpLoading = false;
    });
    
    builder.addCase(signIn.pending, (state) => {
      state.user = '';
      state.authorizationError = '';
      state.authorizationMessage = '';
      state.signInLoading = true;
    });
    builder.addCase(signIn.fulfilled, (state, {payload: res}) => {
      state.signInLoading = false;
      state.user = res?.token || '' || res;
      state.authorizationMessage = res.message;
    });
    builder.addCase(signIn.rejected, (state, {payload: error}) => {
      state.signInLoading = false;
      state.authorizationError = error?.error || 'Произошла ошибка. Попробуйте позже';
    });
  },
});

export const userReducer = UsersSlice.reducer;
export const {logout} = UsersSlice.actions;
