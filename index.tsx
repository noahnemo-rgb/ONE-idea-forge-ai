import ExceptionsManager from 'react-native/Libraries/Core/ExceptionsManager';

if (__DEV__) {
  ExceptionsManager.handleException = (error, isFatal) => {
    // no-op
  };
}

import 'react-native-url-polyfill/auto';
global.Buffer = require('buffer').Buffer;

import '@expo/metro-runtime';
import { LogBox } from 'react-native';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import App from './entrypoint';

if (__DEV__) {
  LogBox.ignoreAllLogs();
}

renderRootComponent(App);
