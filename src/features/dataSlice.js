import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAbonsData,
  fetchAbonsDataArray,
  fetchDataByRegions,
  fetchRating,
  fetchSquares,
  fetchTariffs
} from "./dataThunk";

const initialState = {
  fetchAbonsLoading: false,
  abonsData: {
    oab: 0,
    aab: 0,
    nab: 0,
  },
  currentDropDown: '',
  currentTab: 'stat',
  currentRegion: '',
  dateFieldName: 'abonsNumDate',
  squares: null,
  squaresLoading: false,
  currentSquare: null,
  fetchSquaresLoading: false,
  abonsDataArray: [
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
  ],
  abonsDataArrayLoading: false,
  rating: [],
  fetchRatingLoading: false,
  tariffs: [],
  tariffsLoading: false,
  fetchDataByRegionsLoading: false,
  dataByRegions: null,
};

const DataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setDropdown: (state, action) => {
      state.currentDropDown = action.payload;
    },
    setTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setRegion: (state, action) => {
      state.currentRegion = action.payload;
      state.currentSquare = null;
    },
    setDateFieldName: (state, action) => {
      state.dateFieldName = action.payload;
    },
    setCurrentSquare: (state, action) => {
      state.currentSquare = action.payload;
      state.currentRegion = '';
    },
    setAbonsData: (state, action) => {
      state.abonsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAbonsData.pending, (state) => {
      state.fetchAbonsLoading = true;
    });
    builder.addCase(fetchAbonsData.fulfilled, (state, action) => {
      state.fetchAbonsLoading = false;
      state.abonsData = action.payload;
    });
    builder.addCase(fetchAbonsData.rejected, (state) => {
      state.fetchAbonsLoading = false;
    });
    
    builder.addCase(fetchAbonsDataArray.pending, (state) => {
      state.abonsDataArrayLoading = true;
    });
    builder.addCase(fetchAbonsDataArray.fulfilled, (state, action) => {
      state.abonsDataArrayLoading = false;
      state.abonsDataArray = action.payload;
    });
    builder.addCase(fetchAbonsDataArray.rejected, (state) => {
      state.abonsDataArrayLoading = false;
    });
    
    builder.addCase(fetchSquares.pending, (state) => {
      state.squaresLoading = true;
    });
    builder.addCase(fetchSquares.fulfilled, (state, action) => {
      state.squaresLoading = false;
      let data = {};
      for (const square of action?.payload) {
        if (square.regions?.length) {
          data[square.regions[0]] = [...data[square.regions[0]] || [], square];
        }
      }
      state.squares = data;
    });
    builder.addCase(fetchSquares.rejected, (state) => {
      state.squaresLoading = false;
    });
    
    builder.addCase(fetchRating.pending, (state) => {
      state.fetchRatingLoading = true;
    });
    builder.addCase(fetchRating.fulfilled, (state, action) => {
      state.fetchRatingLoading = false;
      state.rating = action.payload;
    });
    builder.addCase(fetchRating.rejected, (state) => {
      state.fetchRatingLoading = false;
    });
    
    builder.addCase(fetchTariffs.pending, (state) => {
      state.tariffsLoading = true;
    });
    builder.addCase(fetchTariffs.fulfilled, (state, action) => {
      state.tariffsLoading = false;
      state.tariffs = action.payload;
    });
    builder.addCase(fetchTariffs.rejected, (state) => {
      state.tariffsLoading = false;
    });
    
    builder.addCase(fetchDataByRegions.pending, (state) => {
      state.fetchDataByRegionsLoading = true;
      state.rating = [];
      state.tariffs = [];
      state.abonsDataArray[0].data = [];
      state.abonsDataArray[1].data = [];
      state.abonsDataArray[2].data = [];
    });
    builder.addCase(fetchDataByRegions.fulfilled, (state, action) => {
      state.fetchDataByRegionsLoading = false;
      state.dataByRegions = action.payload;
      if (state.currentRegion.length) {
        state.abonsData = {
          aab: state.dataByRegions?.[state.currentRegion]?.aab || 0,
          nab: state.dataByRegions?.[state.currentRegion]?.nab || 0,
          oab: (state.dataByRegions?.[state.currentRegion]?.aab + state.dataByRegions?.['Нарын']?.nab) || 0,
        };
      }
    });
    builder.addCase(fetchDataByRegions.rejected, (state) => {
      state.fetchDataByRegionsLoading = false;
    });
  },
});

export const dataReducer = DataSlice.reducer;
export const {
  setDateFieldName,
  setDropdown,
  setTab,
  setRegion,
  setCurrentSquare,
  setAbonsData
} = DataSlice.actions;
