import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import Home from './screen/Home';
import EditScreen from './screen/Edit';

// type RootStackParamList = {
//   Home: undefined;
//   EditScreen: undefined;
// };

const RootStack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="EditScreen" component={EditScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
