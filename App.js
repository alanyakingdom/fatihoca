import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TarifListesi from './screens/TarifListesi';
import TarifDetay from './screens/TarifDetay';
import Favoriler from './screens/Favoriler';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [favoriIdler, setFavoriIdler] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const switchAnim = useRef(new Animated.Value(isDarkMode ? 22 : 2)).current;

  useEffect(() => {
    Animated.spring(switchAnim, {
      toValue: isDarkMode ? 22 : 2,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  }, [isDarkMode]);

  const toggleFavori = (id) => {
    setFavoriIdler((onceki) => {
      if (onceki.includes(id)) {
        return onceki.filter((favId) => favId !== id);
      } else {
        return [...onceki, id];
      }
    });
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    dark: isDarkMode,
    colors: {
      primary: isDarkMode ? '#60a5fa' : '#2563eb',
      background: isDarkMode ? '#0f172a' : '#f8fafc',
      card: isDarkMode ? '#1e293b' : '#ffffff',
      text: isDarkMode ? '#f1f5f9' : '#1e293b',
      border: isDarkMode ? '#334155' : '#e2e8f0',
      notification: '#ef4444',
      secondary: isDarkMode ? '#94a3b8' : '#64748b',
    }
  };

  const ThemeToggle = () => (
    <TouchableOpacity 
      onPress={toggleTheme} 
      activeOpacity={0.8}
      style={[
        styles.switchContainer, 
        { 
          backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
          borderColor: theme.colors.border 
        }
      ]}
    >
      <Animated.View style={[
        styles.switchKnob, 
        { 
          backgroundColor: isDarkMode ? '#fbbf24' : '#ffffff',
          transform: [{ translateX: switchAnim }],
          shadowColor: isDarkMode ? '#fbbf24' : '#000',
        }
      ]}>
        <MaterialCommunityIcons 
          name={isDarkMode ? "weather-sunny" : "weather-night"} 
          size={14} 
          color={isDarkMode ? "#78350f" : "#1e293b"} 
        />
      </Animated.View>
    </TouchableOpacity>
  );

  // Ortak Stack yapısı: Hem Tarifler hem de Favoriler bu detay sayfasını görebilmeli
  function TariflerStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.card },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
          headerRight: () => <ThemeToggle />,
          headerTitleStyle: { fontWeight: '800', fontSize: 20, letterSpacing: -0.5 },
        }}
      >
        <Stack.Screen name="TarifListesi" options={{ title: 'Lezzet Dünyası' }}>
          {(props) => (
            <TarifListesi
              {...props}
              toggleFavori={toggleFavori}
              favoriIdler={favoriIdler}
              isDarkMode={isDarkMode}
              theme={theme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="TarifDetay"
          options={({ route }) => ({ title: route.params.isim, headerBackTitleVisible: false })}
        >
          {(props) => <TarifDetay {...props} isDarkMode={isDarkMode} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  function FavorilerStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.card },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
          headerRight: () => <ThemeToggle />,
          headerTitleStyle: { fontWeight: '800', fontSize: 20, letterSpacing: -0.5 },
        }}
      >
        <Stack.Screen name="FavorilerListesi" options={{ title: 'Favorilerim' }}>
          {(props) => (
            <Favoriler
              {...props}
              route={{ ...props.route, params: { favoriIdler: favoriIdler } }}
              toggleFavori={toggleFavori}
              isDarkMode={isDarkMode}
              theme={theme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="TarifDetay"
          options={({ route }) => ({ title: route.params.isim, headerBackTitleVisible: false })}
        >
          {(props) => <TarifDetay {...props} isDarkMode={isDarkMode} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarStyle: { 
            backgroundColor: theme.colors.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
          },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }
        }}
      >
        <Tab.Screen
          name="Tarifler"
          component={TariflerStack}
          options={{ 
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="silverware-fork-knife" color={color} size={22} />
            ),
          }}
        />
        <Tab.Screen
          name="Favoriler"
          component={FavorilerStack}
          options={{ 
            tabBarBadge: favoriIdler.length > 0 ? favoriIdler.length : null,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name={focused ? "heart" : "heart-outline"} color={color} size={22} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    width: 48,
    height: 26,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 15,
    justifyContent: 'center',
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  }
});