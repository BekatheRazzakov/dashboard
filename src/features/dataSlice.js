import {createSlice} from "@reduxjs/toolkit";
import { fetchAbonsData, fetchAbonsDataArray, fetchSquares } from "./dataThunk";

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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAbonsData.pending, (state) => {
      state.fetchAbonsLoading = true;
    });
    builder.addCase(fetchAbonsData.fulfilled, (state, action) => {
      state.fetchAbonsLoading = false;
      state.abonsData = {
        oab: action.payload?.all_count || 0,
        aab: action.payload?.count['Актив'] || 0,
        nab: action.payload?.count['Неактив'] || 0,
      };
    });
    builder.addCase(fetchAbonsData.rejected, (state) => {
      state.abonsDataArrayLoading = false;
    });
    
    builder.addCase(fetchAbonsDataArray.pending, (state) => {
      state.abonsDataArrayLoading = true;
    });
    builder.addCase(fetchAbonsDataArray.fulfilled, (state, action) => {
      state.abonsDataArrayLoading = false;
      state.abonsDataArray = action.payload;
    });
    builder.addCase(fetchAbonsDataArray.rejected, (state) => {
      state.fetchAbonsLoading = false;
    });
    
    builder.addCase(fetchSquares.pending, (state) => {
      state.fetchAbonsLoading = true;
    });
    builder.addCase(fetchSquares.fulfilled, (state, action) => {
      state.fetchAbonsLoading = false;
      let data = {};
      for (const square of action.payload) {
        if (square.regions?.length) {
          data[square.regions[0]] = [...data[square.regions[0]] || [], square];
        }
      }
      state.squares = data;
    });
    builder.addCase(fetchSquares.rejected, (state) => {
      state.fetchAbonsLoading = false;
    });
  },
});

export const dataReducer = DataSlice.reducer;
export const {setDateFieldName, setDropdown, setTab, setRegion, setCurrentSquare} = DataSlice.actions;
