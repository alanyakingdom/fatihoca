import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tarifler from '../data/tarifler';

export default function Favoriler({ route, isDarkMode, theme, navigation, toggleFavori }) {
  const { favoriIdler } = route.params || { favoriIdler: [] };
  
  const favoriTarifler = tarifler.filter(
    (tarif) => favoriIdler.includes(tarif.id)
  );

  const renderFavori = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={[styles.kart, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('TarifDetay', {
        isim: item.isim,
        sure: item.sure,
        malzemeler: item.malzemeler,
        yapilis: item.yapilis,
        id: item.id,
        toggleFavori: toggleFavori,
        favoriMi: favoriIdler.includes(item.id),
      })}
    >
      <View style={styles.kartIc}>
        <View style={styles.iconKonteyner}>
          <MaterialCommunityIcons name="heart" size={24} color="#ef4444" />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={[styles.kartBaslik, { color: theme.colors.text }]}>{item.isim}</Text>
          <Text style={[styles.kartSure, { color: theme.colors.secondary }]}>{item.sure} dakika</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.border} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {favoriTarifler.length === 0 ? (
        <View style={styles.bosAlani}>
          <View style={[styles.bosIconDaire, { backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }]}>
            <MaterialCommunityIcons name="heart-plus-outline" size={50} color={theme.colors.border} />
          </View>
          <Text style={[styles.bosMesaj, { color: theme.colors.text }]}>
            Henüz favoriniz yok
          </Text>
          <Text style={[styles.bosAciklama, { color: theme.colors.secondary }]}>
            Beğendiğiniz tarifleri kalp butonuna basarak buraya ekleyebilirsiniz.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriTarifler}
          renderItem={renderFavori}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kart: {
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  kartIc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconKonteyner: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kartBaslik: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  kartSure: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  bosAlani: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  bosIconDaire: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bosMesaj: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  bosAciklama: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});