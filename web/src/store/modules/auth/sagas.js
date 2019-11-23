import { all, takeLatest, call, put } from 'redux-saga/effects';

import { signInSuccess } from './actions';

import api from '~/services/api';

import history from '~/services/history';

export function* signIn({ payload }) {
  const { email, password } = payload;

  const response = yield call(api.post, '/sessions', { email, password });

  const { token, user } = response.data;

  api.defaults.headers.Authorization = `Bearer ${token}`;

  yield put(signInSuccess(token, user));

  history.push('/students');
}

export function singOut() {
  history.push('/');
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_OUT', singOut),
]);