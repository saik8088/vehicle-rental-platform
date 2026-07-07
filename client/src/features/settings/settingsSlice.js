import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingsService from './settingsService';

const initialState = {
  settings: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get settings
export const getSettings = createAsyncThunk('settings/get', async (_, thunkAPI) => {
  try {
    return await settingsService.getSettings();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update settings
export const updateSettings = createAsyncThunk('settings/update', async (settingsData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await settingsService.updateSettings(settingsData, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.settings = action.payload.data;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.settings = action.payload.data;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = settingsSlice.actions;
export default settingsSlice.reducer;
