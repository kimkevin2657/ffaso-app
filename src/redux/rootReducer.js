import { combineReducers } from 'redux';
import authSlice from './authSlice';
import gymSlice from './gymSlice';
import teacherGymSlice from './teacherGymSlice';
import locationSlice from './locationSlice';
import scheduleSlice from './scheduleSlice';

export default combineReducers({
  auth: authSlice,
  gym: gymSlice,
  location: locationSlice,
  schedule: scheduleSlice,
  teacherGym: teacherGymSlice,
});
