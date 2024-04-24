import {createAsyncThunk} from "@reduxjs/toolkit";
import {isAxiosError} from "axios";
import axiosApi from "../axiosApi";

export const signUp = createAsyncThunk("user/signUp", async (userData, {rejectWithValue}) => {
  try {
    const response = await axiosApi.post("register/", userData);
    return response.data;
  }
  catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});

export const signIn = createAsyncThunk("user/signIn", async (userData, {rejectWithValue}) => {
  try {
    const response = await axiosApi.post("login/", userData);
    return response.data;
  }
  catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }

});
