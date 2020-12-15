import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useSelector} from 'react-redux';
import HomeScreen from './src/screen/Home';
import store from './src/redux/store';
import StackNavigator from './src/StackNavigator';
//oke
/**
 Change to desired app id (dashboard app)

/**
 Controls whether the app needs privacy consent or not
 Will hide the button when false and show it when true
 */
export default function App() {
  return (
    <Provider store={store}>
      {/* <SafeAreaProvider> */}
      <StackNavigator />
      {/* </SafeAreaProvider> */}
    </Provider>
  );
}
