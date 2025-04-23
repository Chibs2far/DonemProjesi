import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initDatabase } from './src/database/attendance';
import Reports from './src/screens/Reports';
import Students from './src/screens/Students';
import Attendance from './src/screens/Attendance';
import Settings from './src/screens/Settings';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  React.useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Reports') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Students') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Attendance') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Reports" 
          component={Reports} 
          options={{ title: 'Raporlar' }}
        />
        <Tab.Screen 
          name="Students" 
          component={Students} 
          options={{ title: 'Öğrenciler' }}
        />
        <Tab.Screen 
          name="Attendance" 
          component={Attendance} 
          options={{ title: 'Yoklama' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={Settings} 
          options={{ title: 'Ayarlar' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
