import React from 'react';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latitude: 37.55594599999999,
  longitude: 126.972317,
};

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    latitude: 37.55594599999999,
    longitude: 126.972317,
  },
  reducers: {
    resetLocation: (state) => initialState,
    saveLocation(state, action) {
      const { latitude, longitude } = action.payload;
      // console.log('updateLocation payload', action.payload);
      state.latitude = latitude;
      state.longitude = longitude;
    },
  },
});

export const { resetLocation, saveLocation } = locationSlice.actions;

export const updateLocation = (latitude, longitude) => async (dispatch) => {
  try {
    dispatch(saveLocation({ latitude, longitude }));
  } catch (err) {
    console.log('err', err);
    console.log('err', err.response);
  }
};
export default locationSlice.reducer;
