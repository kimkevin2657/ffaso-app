import React from 'react';
import { Alert } from 'react-native';
import { createSlice } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
  gyms: [],
  errorMsg: null,
  editSuccess: false,
  isFilterReset: false,
};

const gymSlice = createSlice({
  name: 'gym',
  initialState: {
    gyms: [],
    errorMsg: null,
    editSuccess: false,
    currentScreenPath: '',
  },
  reducers: {
    resetData: (state) => initialState,
    saveGyms(state, action) {
      state.gyms = action.payload;
    },
    saveEditSuccess(state) {
      state.editSuccess = true;
    },
    saveEditReset(state) {
      state.editSuccess = false;
    },
    saveErrorMsg(state, action) {
      state.errorMsg = action.payload;
    },
    saveCurrentScreen(state, action) {
      state.currentScreenPath = action.payload;
    },
  },
});

export const {
  saveGyms,
  saveEditSuccess,
  saveEditReset,
  resetData,
  saveCurrentScreen,
  saveErrorMsg,
} = gymSlice.actions;

export const editReset = () => async (dispatch) => {
  try {
    dispatch(saveEditReset());
  } catch (e) {
    console.log(e.response);
  }
};

export const getGyms =
  (keyword, category, lesson, coord) => async (dispatch, getState) => {
    const {
      auth: { token },
    } = getState();

    try {
      const { data } = await api.get(
        `gyms?categories=${category || ''}&keyword=${keyword || ''}
      &lesson=${lesson || ''}&coord=${coord || ''}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      dispatch(saveGyms(data));
    } catch (err) {
      console.log('err', err.response);
      let msg = '서버와 통신에 실패하였습니다.';

      const { data } = err.response;
      if (!data.ok && data.msg) {
        msg = data.msg;
      }
      Alert.alert(msg);
    }
  };

export const onChangeCurrentScreen = (screenName) => (dispatch, getState) => {
  try {
    dispatch(saveCurrentScreen(screenName));
  } catch (e) {
    console.log(e);
    console.log(e.response);
  }
};
export default gymSlice.reducer;
