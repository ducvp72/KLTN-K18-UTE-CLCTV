import React from 'react';
import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PreferencesContext } from '../context/PreferencesContext';
import { Voximplant } from 'react-native-voximplant';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const initialAuthState = {isLoggedIn: false};

export const login = (user, tokens, qr) => ({
  type: LOGIN,
  user,
  tokens,
  qr,
});

export const logout = (user) => ({
  type: LOGOUT,
});

function auth(state = initialAuthState, action) {
  const { removeSocketContext } = React.useContext(PreferencesContext);
  const voximplant = Voximplant.getInstance();
  switch (action.type) {
    case LOGIN:
      return {...state, isLoggedIn: true, user: action.user, tokens: action.tokens, qr: action.qr};
    case LOGOUT:
      AsyncStorage.removeItem('@loggedInUserID:id');
      AsyncStorage.removeItem('@loggedInUserID:key');
      AsyncStorage.removeItem('@loggedInUserID:access');
      AsyncStorage.removeItem('@loggedInUserID:refresh');
      AsyncStorage.removeItem('@loggedInUserID:messageToken');
      AsyncStorage.removeItem('@loggedInUserID:contacts');
      AsyncStorage.removeItem('user-language');
      removeSocketContext()
      voximplant.disconnect();
      // messaging().deleteToken()
      return {...state, isLoggedIn: false, user: {}, tokens: {}, qr: {}};
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  auth,
});

export default AppReducer;
