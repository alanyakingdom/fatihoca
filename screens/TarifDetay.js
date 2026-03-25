import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TarifDetay({ route, navigation, isDarkMode, theme }) {
  const { isim, sure, malzemeler, yapilis, id, toggleFavori, favoriMi } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Modern Header Visual */}
        <View style={[styles.headerVisual, { backgroundColor: theme.colors.primary }]}>
          <MaterialCommunityIcons name="silverware-clean" size={80} color="rgba(255,255,255,0.3)" />
          <View style={styles.headerOverlay}>
            <Text style={styles.baslik}>{isim}</Text>
            <View style={styles.headerInfo}>
              <View style={styles.infoCapsule}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="white" />
                <Text style={styles.infoText}>{sure} dakika</Text>
              </View>
              <View style={styles.infoCapsule}>
                <MaterialCommunityIcons name="fire" size={16} color="white" />
                <Text style={styles.infoText}>Pratik</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Favori Butonu */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.favoriBtn,
              { backgroundColor: favoriMi ? '#fee2e2' : theme.colors.primary }
            ]}
            onPress={() => {
              toggleFavori(id);
              navigation.goBack();
            }}
          >
            <MaterialCommunityIcons 
              name={favoriMi ? "heart" : "heart-outline"} 
              size={22} 
              color={favoriMi ? "#ef4444" : "white"} 
            />
            <Text style={[styles.favoriBtnText, { color: favoriMi ? "#ef4444" : "white" }]}>
              {favoriMi ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            </Text>
          </TouchableOpacity>

          {/* Malzemeler Bölümü */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color={theme.colors.primary} />
              <Text style={[styles.altBaslik, { color: theme.colors.text }]}>Malzemeler</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              {malzemeler.map((malzeme, index) => (
                <View key={index} style={styles.malzemeSatir}>
                  <View style={[styles.nokta, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.malzeme, { color: theme.colors.text }]}>
                    {malzeme}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Yapılış Bölümü */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chef-hat" size={20} color={theme.colors.primary} />
              <Text style={[styles.altBaslik, { color: theme.colors.text }]}>Nasıl Yapılır?</Text>
            </View>
            <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.yapilis, { color: theme.colors.text }]}>
                {yapilis}
              </Text>
            </View>
          </View>
          
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerVisual: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  baslik: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: -1,
  },
  headerInfo: {
    flexDirection: 'row',
    marginTop: 10,
  },
  infoCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },
  content: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  favoriBtn: {
    flexDirection: 'row',
    marginTop: 15,
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  favoriBtnText: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 8,
  },
  section: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 5,
  },
  altBaslik: {
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  malzemeSatir: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nokta: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  malzeme: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  yapilis: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
  },
});
