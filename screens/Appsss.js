import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TarifListesi from './screens/TarifListesi';
import TarifDetay from './screens/TarifDetay';
import Favoriler from './screens/Favoriler';
import QrOkuyucu from './screens/QrOkuyucu';

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

  /* -------------------- MODERN PREMIUM COLOR PALETTE -------------------- */
  const theme = {
    dark: isDarkMode,
    colors: {
      primary: isDarkMode ? '#fbbf24' : '#ea580c',
      background: isDarkMode ? '#0b0f19' : '#fcfbf7',
      card: isDarkMode ? '#111827' : '#ffffff',
      text: isDarkMode ? '#f3f4f6' : '#111827',
      border: isDarkMode ? '#1f2937' : '#e5e7eb',
      notification: '#ef4444',
      secondary: isDarkMode ? '#6b7280' : '#9ca3af',
    }
  };

  const ThemeToggle = () => (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      style={[
        styles.switchContainer,
        {
          backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb',
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
          color={isDarkMode ? "#451a03" : "#1f2937"}
        />
      </Animated.View>
    </TouchableOpacity>
  );

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
          {(props) => {
            // EĞER FAVORİLER BOŞSA MODERN EMPTY STATE GÖSTERİLİR, HİÇBİR DOSYAYA DOKUNULMAZ
            if (favoriIdler.length === 0) {
              return (
                <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
                  <View style={[styles.iconCircle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <MaterialCommunityIcons name="heart-broken" size={46} color={theme.colors.secondary} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Henüz favoriniz yok</Text>
                  <Text style={[styles.emptySubtitle, { color: theme.colors.secondary }]}>
                    Beğendiğiniz tarifleri kalp butonuna basarak buraya ekleyebilirsiniz.
                  </Text>
                </View>
              );
            }

            // Orijinal Favoriler çağrın ve props akışın tamamen korundu
            return (
              <Favoriler
                {...props}
                route={{ ...props.route, params: { favoriIdler: favoriIdler } }}
                toggleFavori={toggleFavori}
                isDarkMode={isDarkMode}
                theme={theme}
              />
            );
          }}
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
          tabBarLabelStyle: { fontSize: 12, fontWeight: '700' }
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
            tabBarBadge: favoriIdler.length > 0 ? favoriIdler.length : undefined,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons 
                name={focused ? "heart" : "heart-outline"} 
                color={focused ? theme.colors.notification : color} 
                size={22} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="QR Okuyucu"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="qrcode-scan" color={color} size={22} />
            ),
          }}
        >
          {() => <QrOkuyucu isDarkMode={isDarkMode} theme={theme} />}
        </Tab.Screen>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  /* --- PREMIUM EMPTY STATE STYLES --- */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
});
