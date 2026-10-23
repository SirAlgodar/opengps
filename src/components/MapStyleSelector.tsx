import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MAP_STYLES, MAP_STYLE_LABELS, MapStyleKey } from '../constants';
import {
  CUSTOM_MAP_STYLES,
  CUSTOM_MAP_STYLE_LABELS,
  CUSTOM_MAP_STYLE_COLORS,
  CustomMapStyleKey,
} from '../constants/customMapStyles';

interface MapStyleSelectorProps {
  visible: boolean;
  currentStyle: string;
  onSelect: (style: string) => void;
  onClose: () => void;
}

export function MapStyleSelector({
  visible,
  currentStyle,
  onSelect,
  onClose,
}: MapStyleSelectorProps) {
  const standardStyles = Object.entries(MAP_STYLES) as [MapStyleKey, string][];
  const customStyles = Object.entries(CUSTOM_MAP_STYLES) as [CustomMapStyleKey, any][];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Estilo do Mapa</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {/* Custom themed styles */}
            <Text style={styles.sectionTitle}>🎨 Estilos Temáticos</Text>
            {customStyles.map(([key, styleDef]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.styleItem,
                  styles.customStyleItem,
                  currentStyle === key && styles.styleItemActive,
                ]}
                onPress={() => {
                  onSelect(key);
                  onClose();
                }}
              >
                <View style={styles.stylePreview}>
                  <View
                    style={[
                      styles.stylePreviewColor,
                      { backgroundColor: CUSTOM_MAP_STYLE_COLORS[key] },
                    ]}
                  />
                </View>
                <View style={styles.styleInfo}>
                  <Text
                    style={[
                      styles.styleName,
                      currentStyle === key && styles.styleNameActive,
                    ]}
                  >
                    {CUSTOM_MAP_STYLE_LABELS[key]}
                  </Text>
                  <Text style={styles.styleDescription}>
                    {getStyleDescription(key)}
                  </Text>
                </View>
                {currentStyle === key && (
                  <Text style={styles.styleCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Standard styles */}
            <Text style={styles.sectionTitle}>🗺️ Estilos Padrão</Text>
            {standardStyles.map(([key, styleUrl]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.styleItem,
                  currentStyle === styleUrl && styles.styleItemActive,
                ]}
                onPress={() => {
                  onSelect(styleUrl);
                  onClose();
                }}
              >
                <View style={styles.stylePreview}>
                  <View
                    style={[
                      styles.stylePreviewColor,
                      { backgroundColor: getStyleColor(key) },
                    ]}
                  />
                </View>
                <View style={styles.styleInfo}>
                  <Text
                    style={[
                      styles.styleName,
                      currentStyle === styleUrl && styles.styleNameActive,
                    ]}
                  >
                    {MAP_STYLE_LABELS[key]}
                  </Text>
                </View>
                {currentStyle === styleUrl && (
                  <Text style={styles.styleCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function getStyleDescription(key: CustomMapStyleKey): string {
  const descriptions: Record<CustomMapStyleKey, string> = {
    losSantos: 'Estilo GTA com verdes e tons de terra',
    pipBoy: 'Terminal verde estilo Fallout',
    pixelMap: 'Pixel art rosa e roxo',
    cyberpunk: 'Neon ciano e magenta',
    retro: 'Cores clássicas de mapa antigo',
    ocean: 'Tons de azul oceânico',
  };
  return descriptions[key] || '';
}

function getStyleColor(key: MapStyleKey): string {
  const colors: Record<MapStyleKey, string> = {
    streets: '#E8E8E8',
    outdoor: '#90EE90',
    satellite: '#2C3E50',
    dark: '#1A1A2E',
    bright: '#FFE4B5',
    pastel: '#DDA0DD',
  };
  return colors[key] || '#E8E8E8';
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
    marginLeft: 4,
  },
  styleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
  },
  customStyleItem: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  styleItemActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  stylePreview: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  stylePreviewColor: {
    flex: 1,
  },
  styleInfo: {
    flex: 1,
  },
  styleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  styleNameActive: {
    color: '#4ECDC4',
  },
  styleDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  styleCheck: {
    fontSize: 24,
    color: '#4ECDC4',
    fontWeight: '700',
    marginLeft: 8,
  },
});
