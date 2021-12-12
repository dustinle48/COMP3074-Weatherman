import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { Store } from './redux/store';

import Main from './components/Main'
import Settings from './components/Settings';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen 
            name="Main" 
            component={Main}
            options={{tabBarIcon: () => (<MaterialCommunityIcons name="home" size={26}/>)}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{tabBarIcon: () => (<MaterialCommunityIcons name="cog" size={26} />)}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})