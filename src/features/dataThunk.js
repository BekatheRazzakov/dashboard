import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../axiosApi";

export const fetchAbonsData = createAsyncThunk("user/fetchAbonsData", async (data) => {
  try {
    const formData = new FormData();
    
    formData.append('date_filter', data.date.split('.').reverse().join('-'));
    formData.append('squares_id', data.square);
    
    const response = await axiosApi.post("/filtered_squares/", formData);
    return response.data;
  } catch (e) {
    console.log(e);
  }
});

export const fetchAbonsDataArray = createAsyncThunk("user/fetchAbonsDataArray", async (data) => {
  try {
    let abonsDataArray = [
      {
        "id": "ААБ",
        "color": '#1DBF12',
        "data": [],
      },
      {
        "id": "НАБ",
        "color": '#E31A1A',
        "data": [],
      },
      {
        "id": "Отклонение",
        "color": '#4318FF',
        "data": []
      }
    ];
    
    for (const date of data.dates) {
      const formData = new FormData();
      formData.append('date_filter', date.split('.').reverse().join('-'));
      formData.append('squares_id', data.square);
      const response = await axiosApi.post("/filtered_squares/", formData);
      abonsDataArray[0].data.push({"x": date, "y": response?.data?.count?.['Актив'] || 0});
      abonsDataArray[1].data.push({"x": date, "y": response?.data?.count?.['Неактив'] || 0});
      abonsDataArray[2].data.push({
        "x": date, "y": Number(((response?.data?.count?.['Актив'] || 0) / ((response?.data?.count?.['Актив'] || 0) +
          (response?.data?.count?.['Неактив'] || 0) || 0) * 100)) - 90 || 0
      });
    }
    
    return abonsDataArray;
  } catch (e) {
    console.log(e);
  }
});

export const fetchSquares = createAsyncThunk("user/fetchSquares", async () => {
  try {
    const req = await axiosApi('squares/');
    const res = await req.data;
    return res.data;
  } catch (e) {
    console.log(e);
  }
});
