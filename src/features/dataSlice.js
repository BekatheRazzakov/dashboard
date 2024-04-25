import {createSlice} from "@reduxjs/toolkit";
import {fetchAbonsData} from "./dataThunk";

const initialState = {
  fetchAbonsLoading: false,
  abonsData: {
    oab: 0,
    aab: 0,
    nab: 0,
  },
  currentDropDown: '',
  dateFieldName: 'abonsNumDate',
};

const DataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setDropdown: (state, action) => {
      state.currentDropDown = action.payload;
    },
    setDateFieldName: (state, action) => {
      state.dateFieldName = action.payload;
    }
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
      state.fetchAbonsLoading = false;
    });
  },
});

export const dataReducer = DataSlice.reducer;
export const {setDateFieldName, setDropdown} = DataSlice.actions;
