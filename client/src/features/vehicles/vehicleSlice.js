import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  vehicles: [],
  myVehicles: [],
  vehicle: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

// Get all vehicles (public)
export const getVehicles = createAsyncThunk(
  'vehicles/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/vehicles');
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get provider's own vehicles
export const getMyVehicles = createAsyncThunk(
  'vehicles/getMy',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/vehicles/my');
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single vehicle
export const getVehicle = createAsyncThunk(
  'vehicles/get',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new vehicle (FormData with images)
export const createVehicle = createAsyncThunk(
  'vehicles/create',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/vehicles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update vehicle
export const updateVehicle = createAsyncThunk(
  'vehicles/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const isFormData = data instanceof FormData;
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      const response = await api.put(`/vehicles/${id}`, data, config);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete vehicle
export const deleteVehicle = createAsyncThunk(
  'vehicles/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/vehicles/${id}`);
      return id;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicles.pending, (state) => { state.isLoading = true; })
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.vehicles = action.payload;
      })
      .addCase(getVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMyVehicles.pending, (state) => { state.isLoading = true; })
      .addCase(getMyVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myVehicles = action.payload;
      })
      .addCase(getMyVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getVehicle.pending, (state) => { state.isLoading = true; })
      .addCase(getVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.vehicle = action.payload;
      })
      .addCase(getVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createVehicle.pending, (state) => { state.isLoading = true; })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myVehicles.push(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateVehicle.pending, (state) => { state.isLoading = true; })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.myVehicles.findIndex(v => v._id === action.payload._id);
        if (index !== -1) state.myVehicles[index] = action.payload;
        // Also update in public vehicles array
        const pubIndex = state.vehicles.findIndex(v => v._id === action.payload._id);
        if (pubIndex !== -1) state.vehicles[pubIndex] = action.payload;
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteVehicle.pending, (state) => { state.isLoading = true; })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myVehicles = state.myVehicles.filter(v => v._id !== action.payload);
        state.vehicles = state.vehicles.filter(v => v._id !== action.payload);
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = vehicleSlice.actions;
export default vehicleSlice.reducer;
