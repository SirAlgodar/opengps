import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MAP_STYLES, MAP_STYLE_LABELS, MapStyleKey } from '../constants';

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
  const styles_list = Object.entries(MAP_STYLES) as [MapStyleKey, string][];

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

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {styles_list.map(([key, styleUrl]) => (
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
                  {currentStyle === styleUrl && (
                    <Text style={styles.styleCheck}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
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
    maxHeight: '60%',
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
  styleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  styleNameActive: {
    color: '#4ECDC4',
  },
  styleCheck: {
    fontSize: 24,
    color: '#4ECDC4',
    fontWeight: '700',
  },
});
