import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../axiosApi";

export const fetchAbonsData = createAsyncThunk("user/signUp", async (data) => {
  try {
    const formData = new FormData();

    formData.append('date_filter', data.date.split('.').reverse().join('-'));
    formData.append('squares_id', '19');

    const response = await axiosApi.post("/filtered_squares/", formData);
    return response.data;
  }
  catch (e) {
    console.log(e);
  }
});
