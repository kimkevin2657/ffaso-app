import React from 'react';
import { Alert } from 'react-native';
import { createSlice } from '@reduxjs/toolkit';
import api from '../api/api';
import axios from 'axios';

const initialState = {
  user: null,
  token: null,

  logoutSuccess: false,
  editProfileSuccess: false,
  errorMsg: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,

    logoutSuccess: false,
    editProfileSuccess: false,
    errorMsg: null,
  },
  reducers: {
    resetAuth: (state) => initialState,
    saveSignUpSuccess(state) {
      state.logoutSuccess = false;
    },
    saveUserInfo(state, action) {
      const { user, token } = action.payload;
      console.log('saveUserInfo payload', action.payload);
      state.user = user;
      state.token = token;
      // api.defaults.headers.common['Authorization'] = `Token ${state.token}`;
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      axios.defaults.headers.post['Content-Type'] = 'application/json';
    },
    loginSuccess(state) {
      state.logoutSuccess = false;
    },
    logoutSuccess(state) {
      state.logoutSuccess = true;
    },
    logoutReset(state) {
      state.logoutSuccess = false;
    },
    saveEditProfileSuccess(state) {
      state.editProfileSuccess = true;
    },
    saveEditProfileReset(state) {
      state.editProfileSuccess = false;
    },
    saveErrorMsg(state, action) {
      state.errorMsg = action.payload;
    },
  },
});

export const {
  saveSignUpSuccess,
  saveUserInfo,
  logoutSuccess,
  loginSuccess,
  saveEditProfileSuccess,
  saveEditProfileReset,
  resetAuth,
  saveErrorMsg,
} = userSlice.actions;

export const signUp = (userData) => async (dispatch) => {
  try {
    // let { data } = await api.post(`sign-up`, userData, config);
    let { data } = await api.post(`sign-up`, userData);
    console.log('userRes data', data);

    dispatch(saveErrorMsg(null));
    dispatch(saveSignUpSuccess());
    dispatch(saveUserInfo({ user: data.user, token: data.token }));
  } catch (err) {
    console.log('err', err.response);
    let msg = '서버와 통신에 실패하였습니다.';

    const { data } = err.response;
    if (!data.ok && data.msg) {
      msg = data.msg;
      dispatch(saveErrorMsg(msg));
    }
    // Alert.alert(msg);
  }
};

export const signIn = (userData) => async (dispatch) => {
  try {
    let { data } = await api.post(`app-sign-in`, userData);
    console.log('userRes data', data);

    dispatch(loginSuccess());
    dispatch(saveUserInfo({ user: data.user, token: data.token }));
  } catch (err) {
    console.log('err', err);
    console.log('err.res', err.response);
    let msg = '서버와 통신에 실패하였습니다.';

    const { data } = err.response;
    if (!data.ok && data.msg) {
      msg = data.msg;
    }
    Alert.alert(msg);
  }
};

export const signOut = () => async (dispatch) => {
  try {
    await api.post('sign-out');

    dispatch(logoutSuccess());
    dispatch(resetAuth());
  } catch (err) {
    console.log(err);
    console.log(err.response);
  }
};

export const editReset = () => async (dispatch) => {
  try {
    dispatch(saveEditProfileReset());
  } catch (e) {
    console.log(e.response);
  }
};
export const updateUserInfo = (formData) => async (dispatch, getState) => {
  // console.log('formData', formData);
  const {
    auth: { token },
  } = getState();

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  };

  try {
    const { data } = await api.patch('profile', formData, config);
    console.log('update data', data);
    dispatch(saveEditProfileSuccess());
    dispatch(saveUserInfo({ user: data.user, token: data.token }));
    // dispatch(saveUserInfo(data));
    Alert.alert('', '프로필 정보가 수정되었습니다.');
  } catch (err) {
    console.log('err', err);
    console.log('err', err.response);
    let msg = '서버와 통신에 실패하였습니다.';

    const { data } = err.response;
    if (!data.ok && data.msg) {
      msg = data.msg;
    }
    Alert.alert('유저 업데이트', msg);
  }
};

export const getUserInfo = () => async (dispatch, getState) => {
  const {
    auth: { token },
  } = getState();

  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };

  try {
    const { data } = await api.post('profile', {}, config);
    // console.log('updateData', data);
    dispatch(saveUserInfo({ user: data.user, token: data.token }));
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

export const deleteUser = (id, token) => async (dispatch, getState) => {
  try {
    // console.log('before delete call', token, id);
    const res = await api.delete(
      'profile',
      // { id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      }
    );
    // console.log('deleteUser res', res);
    dispatch(resetAuth());
  } catch (err) {
    console.log('err', err);
    console.log('err.res', err.response);
    let msg = '서버와 통신에 실패하였습니다.';

    // const { data } = err.response;
    // if (!data.ok && data.msg) {
    //   msg = data.msg;
    // }
    // Alert.alert(msg);
  }
};

export const resetErrMsg = () => async (dispatch) => {
  try {
    dispatch(saveErrorMsg(null));
  } catch (e) {
    console.log(e.response);
  }
};

export default userSlice.reducer;
