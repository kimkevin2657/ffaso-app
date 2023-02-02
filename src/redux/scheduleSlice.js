import React from 'react';
import { Alert } from 'react-native';
import { createSlice } from '@reduxjs/toolkit';
import api from '../api/api';

const initialState = {
  schedules: [],
  errorMsg: null,
  addSuccess: false,
  editSuccess: false,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [],
    errorMsg: null,
    addSuccess: false,
    editSuccess: false,
  },
  reducers: {
    resetSchedules: (state) => initialState,
    saveSchedules(state, action) {
      state.schedules = action.payload;
    },
    saveAddSuccess(state) {
      state.addSuccess = true;
    },
    saveEditSuccess(state) {
      state.editSuccess = true;
    },
    saveResetState(state) {
      state.addSuccess = false;
      state.editSuccess = false;
      state.errorMsg = null;
    },
    saveErrorMsg(state, action) {
      state.errorMsg = action.payload;
    },
    addSchedule(state, action) {
      // state.schedules.push({
      //   ...action.payload,
      //   // done: false
      // });
      state.schedules.push(action.payload);
    },
    updateSchedule(state, action) {
      const index = state.schedules.findIndex(
        (schedule) => schedule.id === action.payload
      );
      state.schedules[index] = action.payload;
    },
    removeSchedule(state, action) {
      const index = state.schedules.findIndex(
        (schedule) => schedule.id === action.payload
      );
      state.schedules.splice(index);
      // return state.schedules.filter(schedule=>schedule.id !== action.payload)
    },
  },
});

export const {
  resetSchedules,
  saveSchedules,
  saveResetState,
  saveAddSuccess,
  saveEditSuccess,
  saveErrorMsg,
  addSchedule,
  updateSchedule,
  removeSchedule,
} = scheduleSlice.actions;

export const getMemberSchedules = (date) => async (dispatch, getState) => {
  const {
    auth: { token },
  } = getState();

  try {
    let query = `isMyReservations=True`;
    if (date) {
      query += `&date=${date}`;
    }
    const { data } = await api.get(
      `reservations?` + query,
      // `reservations?isMyReservations=True&date=${date}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    let newData = {};
    data.forEach((reservation) => {
      if (newData[reservation.date] === undefined) {
        newData[reservation.date] = [];
      }
      newData[reservation.date].push(reservation);
    });

    dispatch(saveSchedules(newData));
  } catch (err) {
    console.log('getMemberSchedules err', err);
    console.log('getMemberSchedules err', err.response);
    let msg = '서버와 통신에 실패하였습니다.';

    const { data } = err.response;
    if (!data.ok && data.msg) {
      msg = data.msg;
    }
    // Alert.alert(msg);
  }
};

export const getTeacherSchedules =
  (date, teacherId) => async (dispatch, getState) => {
    const {
      auth: { token },
    } = getState();

    try {
      const {
        data: { schedules },
      } = await api.get(
        `teacher-schedules?date=${date}&teacherId=${teacherId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      let newData = {};
      schedules.forEach((schedule) => {
        if (newData[schedule.date] === undefined) {
          newData[schedule.date] = [];
        }
        newData[schedule.date].push(schedule);
      });

      dispatch(saveSchedules(newData));
    } catch (err) {
      console.log('err', err.response);
      let msg = '서버와 통신에 실패하였습니다.';

      const { data } = err.response;
      if (!data.ok && data.msg) {
        msg = data.msg;
      }
      // Alert.alert(msg);
    }
  };

export const createMemberReservation = (postData) => async (dispatch) => {
  try {
    await api.post('reservations', postData);
    // console.log('data', data);
    Alert.alert('예약이 등록되었습니다.');
    dispatch(getMemberSchedules(postData.date));
    dispatch(saveAddSuccess());
    // dispatch(addSchedule(data))
  } catch (e) {
    console.log('e', e);
    console.log('e.res', e.response);
  }
};

export const createTeacherSchedule =
  (postData) => async (dispatch, getState) => {
    const {
      auth: { user },
    } = getState();

    try {
      await api.post('schedules', postData);
      // console.log('data', data);
      Alert.alert('스케줄이 등록되었습니다.');
      dispatch(getTeacherSchedules(postData.date, user?.id));
      dispatch(saveAddSuccess());
      // dispatch(addSchedule(data))
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);

      if (e.response?.data && e.response.data?.msg) {
        Alert.alert(e.response.data.msg);
        dispatch(saveResetState());
      }
    }
  };

export const resetState = () => async (dispatch) => {
  try {
    dispatch(saveResetState());
  } catch (e) {
    console.log('e', e);
    console.log('e.res', e.response);
  }
};

export default scheduleSlice.reducer;
