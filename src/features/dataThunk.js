import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../axiosApi";

export const fetchAbonsData = createAsyncThunk("user/fetchAbonsData", async (data) => {
  try {
    const req = await axiosApi(
      `/test_data_active/?day=${data?.date}${data.square ? `&square=${data?.square}` : ''}`
    );
    const res = await req.data;
    return res.count;
  } catch (e) {
    console.log(e);
  }
});

export const fetchAbonsDataArray = createAsyncThunk("user/fetchAbonsDataArray", async (data) => {
  try {
    let abonsDataArray = [{
      "id": "ААБ", "color": '#1DBF12', "data": [],
    }, {
      "id": "НАБ", "color": '#E31A1A', "data": [],
    }, {
      "id": "Отклонение", "color": '#4318FF', "data": []
    }];
    
    const req = await axiosApi.post("/filer_data_active_neactive/", {
      date_filter: data.dates, squares_id: data.square,
    });
    const res = await req.data;
    
    abonsDataArray[0].data = res?.aab.map(day => ({
      x: day?.date,
      y: day?.amount || 0,
    }));
    abonsDataArray[1].data = res?.nab.map(day => ({
      x: day?.date,
      y: day?.amount || 0,
    }));
    abonsDataArray[2].data = res?.aab.map((day, i) => {
      return {
        x: day?.date,
        y: Number(((res?.aab[i]?.amount || 0) / ((res?.aab[i]?.amount || 0) +
          (res?.nab[i]?.amount || 0) || 0) * 100)) - 90 || 0,
      }
    });
    
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

export const fetchRating = createAsyncThunk("user/fetchRating", async (data) => {
  try {
    const req = await axiosApi(
      `/raiting_si/?month=${data?.date}${data.square ? `&squares=${data?.square}` : ''}`
    );
    const res = await req.data;
    return res.raitingSi;
  } catch (e) {
    console.log(e);
  }
});

export const fetchTariffs = createAsyncThunk("user/fetchTariffs", async (data) => {
  try {
    const req = await axiosApi(
      `/tariffs_daily?day=${data?.date}${data.square ? `&square=${data?.square}` : ''}`
    );
    const res = await req.data;
    return res.tariffs?.filter(tariff => tariff.aab > 5 && tariff.nab > 5);
  } catch (e) {
    console.log(e);
  }
});

export const fetchDataByRegions = createAsyncThunk("user/fetchDataByRegions", async ({startDate, endDate}) => {
  try {
    const req = await axiosApi(
      `/fulldata_active_neactive/?start_date=${startDate}&end_date=${endDate}`
    );
    const res = await req.data;
    return res?.full_data;
  } catch (e) {
    console.log(e);
  }
});
