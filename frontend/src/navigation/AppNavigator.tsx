import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import FormBuilderScreen from '../screens/FormBuilderScreen';
import FormViewScreen from '../screens/FormViewScreen';
import SubmissionsViewScreen from '../screens/SubmissionsViewScreen';

export type RootStackParamList = {
  Dashboard: undefined;
  FormBuilder: { id?: string };
  FormView: { shareableLink: string };
  SubmissionsView: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="FormBuilder" component={FormBuilderScreen} />
        <Stack.Screen name="FormView" component={FormViewScreen} />
        <Stack.Screen name="SubmissionsView" component={SubmissionsViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;