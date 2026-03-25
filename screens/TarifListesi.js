import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tarifler from '../data/tarifler';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Her bir kartı ayrı bir bileşen yaparak hook kullanım hatasını gideriyoruz
const TarifKarti = ({ item, index, navigation, toggleFavori, favoriMi, isDarkMode, theme }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.kart, 
        { 
          backgroundColor: theme.colors.card, 
          borderColor: theme.colors.border,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
      onPress={() => navigation.navigate('TarifDetay', {
        isim: item.isim,
        sure: item.sure,
        malzemeler: item.malzemeler,
        yapilis: item.yapilis,
        id: item.id,
        toggleFavori: toggleFavori,
        favoriMi: favoriMi,
      })}
    >
      <View style={styles.kartIc}>
        <View style={{ flex: 1 }}>
          <View style={styles.ustBilgi}>
            <Text style={[styles.kartBaslik, { color: theme.colors.text }]}>{item.isim}</Text>
            {favoriMi && (
              <MaterialCommunityIcons name="heart" size={18} color="#ef4444" />
            )}
          </View>
          <View style={styles.altBilgi}>
            <View style={styles.badge}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.secondary} />
              <Text style={[styles.badgeText, { color: theme.colors.secondary }]}>{item.sure} dk</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isDarkMode ? '#334155' : '#f1f5f9' }]}>
              <Text style={[styles.kategoriText, { color: theme.colors.primary }]}>{item.kategori}</Text>
            </View>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.border} />
      </View>
    </AnimatedTouchableOpacity>
  );
};

export default function TarifListesi({ navigation, toggleFavori, favoriIdler, isDarkMode, theme }) {
  const [aramaMetni, setAramaMetni] = useState('');
  const [seciliKategori, setSeciliKategori] = useState('Hepsi');
  
  const kategoriler = ['Hepsi', 'kahvalti', 'ana yemek', 'atistirmalik'];

  const filtrelenmisTarifler = tarifler.filter((item) => {
    const kategoriUygun = seciliKategori === 'Hepsi' || item.kategori === seciliKategori;
    const aramaUygun = item.isim.toLowerCase().includes(aramaMetni.toLowerCase());
    return kategoriUygun && aramaUygun;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.aramaKonteyner, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.secondary} />
        <TextInput
          style={[styles.aramaKutusu, { color: theme.colors.text }]}
          placeholder="Bugün ne pişirmek istersin?"
          placeholderTextColor={theme.colors.secondary}
          value={aramaMetni}
          onChangeText={setAramaMetni}
        />
      </View>

      <View style={styles.kategoriKonteyner}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
          {kategoriler.map((kat) => (
            <TouchableOpacity
              key={kat}
              activeOpacity={0.8}
              style={[
                styles.kategoriButon,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                seciliKategori === kat && { 
                  backgroundColor: theme.colors.primary, 
                  borderColor: theme.colors.primary,
                  elevation: 4,
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                }
              ]}
              onPress={() => setSeciliKategori(kat)}
            >
              <Text style={[
                styles.kategoriMetin,
                { color: theme.colors.secondary },
                seciliKategori === kat && { color: '#ffffff' }
              ]}>
                {kat === 'Hepsi' ? 'Tümü' : kat.charAt(0).toUpperCase() + kat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtrelenmisTarifler}
        renderItem={({ item, index }) => (
          <TarifKarti 
            item={item} 
            index={index} 
            navigation={navigation} 
            toggleFavori={toggleFavori}
            favoriMi={favoriIdler.includes(item.id)}
            isDarkMode={isDarkMode}
            theme={theme}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.bosListe}>
            <MaterialCommunityIcons name="cookie-outline" size={60} color={theme.colors.border} />
            <Text style={[styles.bosListeMetin, { color: theme.colors.secondary }]}>Tarif bulunamadı.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aramaKonteyner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  aramaKutusu: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  kategoriKonteyner: {
    marginBottom: 20,
  },
  kategoriButon: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
  },
  kategoriMetin: {
    fontWeight: '700',
    fontSize: 13,
  },
  kart: {
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  kartIc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ustBilgi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 10,
  },
  kartBaslik: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  altBilgi: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  kategoriText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  bosListe: {
    alignItems: 'center',
    marginTop: 80,
  },
  bosListeMetin: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
});
