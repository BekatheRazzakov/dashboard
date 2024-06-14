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

export const signIn = createAsyncThunk("user/signIn", async (userData) => {
  if (
    (userData.login === 'admin' && userData.password === 'skynet') ||
    (userData.login === 'osh' && userData.password === 'oshskynet02') ||
    (userData.login === 'djalalabad' && userData.password === 'djskynet03') ||
    (userData.login === 'talas' && userData.password === 'talasskynet07') ||
    (userData.login === 'ik' && userData.password === 'ikskynet09') ||
    (userData.login === 'naryn' && userData.password === 'narynskynet05') ||
    (userData.login === 'meerim' && userData.password === '665688') ||
    (userData.login === 'ruslan' && userData.password === 'skyboss')
  ) {
    return userData.login;
  } else return '';
  // try {
  //   const response = await axiosApi.post("login/", userData);
  //   return response.data;
  // }
  // catch (e) {
  //   if (isAxiosError(e) && e.response && e.response.status === 400) {
  //     return rejectWithValue(e.response.data);
  //   }
  //   throw e;
  // }
});
