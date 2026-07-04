import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import vehicleReducer from '../features/vehicles/vehicleSlice';
import bookingReducer from '../features/bookings/bookingSlice';
import userReducer from '../features/users/userSlice';
import notificationReducer from '../features/notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicle: vehicleReducer,
    booking: bookingReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});
