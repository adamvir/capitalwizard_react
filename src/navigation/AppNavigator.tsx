// ============================================
// APP NAVIGATOR
// Fő Stack Navigator
// ============================================

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import UniversityScreen from '../screens/UniversityScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ArenaScreen from '../screens/ArenaScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ManagerScreen from '../screens/ManagerScreen';
import LessonHeaderScreen from '../screens/LessonHeaderScreen';
import LessonGameScreen from '../screens/LessonGameScreen';
import BookViewScreen from '../screens/BookViewScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ShopScreen from '../screens/ShopScreen';
import StreakScreen from '../screens/StreakScreen';
import AvatarSelectorScreen from '../screens/AvatarSelectorScreen';
import DailyLimitScreen from '../screens/DailyLimitScreen';
import LessonsScreen from '../screens/LessonsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="University" component={UniversityScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen
        name="Arena"
        component={ArenaScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
          cardStyle: { backgroundColor: 'transparent' },
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Manager" component={ManagerScreen} />
      <Stack.Screen name="Lessons" component={LessonsScreen} />
      <Stack.Screen
        name="LessonHeader"
        component={LessonHeaderScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="LessonGame"
        component={LessonGameScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="BookView"
        component={BookViewScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Stack.Screen name="Streak" component={StreakScreen} />
      <Stack.Screen name="AvatarSelector" component={AvatarSelectorScreen} />
      <Stack.Screen
        name="DailyLimit"
        component={DailyLimitScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </Stack.Navigator>
  );
}
