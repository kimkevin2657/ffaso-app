import React from 'react';
import { Alert } from 'react-native';
import { createSlice } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
  teacherGyms: [],
  errorMsg: null,
};

const teacherGymSlice = createSlice({
  name: 'teacherGym',
  initialState: {
    teacherGyms: [],
    errorMsg: null,
  },
  reducers: {
    resetData: (state) => initialState,
    saveGyms(state, action) {
      state.teacherGyms = action.payload;
    },
    saveErrorMsg(state, action) {
      state.errorMsg = action.payload;
    },
  },
});

export const { saveGyms, saveErrorMsg } = teacherGymSlice.actions;

export const getTeacherGyms = () => async (dispatch, getState) => {
  const {
    auth: { token },
  } = getState();

  try {
    const { data } = await api.get(`teacher-gyms/?isMine=true`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    dispatch(saveGyms(data));
  } catch (err) {
    console.log('err', err.response);
    let msg = '서버와 통신에 실패하였습니다.';

    const { data } = err.response;
    if (!data.ok && data.msg) {
      msg = data.msg;
      Alert.alert(msg);
    }
  }
};

export default teacherGymSlice.reducer;
