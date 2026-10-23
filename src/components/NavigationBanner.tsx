import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigationState } from '../types';

interface NavigationBannerProps {
  navState: NavigationState;
  onStop: () => void;
}

const MANEUVER_ICONS: Record<string, string> = {
  turn: '🔄',
  'new name': '➡️',
  depart: '🚗',
  arrive: '🏁',
  merge: '🔀',
  'on ramp': '↗️',
  'off ramp': '↘️',
  fork: '🍴',
  'end of road': '↩️',
  continue: '⬆️',
  roundabout: '🔄',
  rotary: '🔄',
};

const MODIFIER_LABELS: Record<string, string> = {
  left: 'à esquerda',
  right: 'à direita',
  'slight left': 'leve à esquerda',
  'slight right': 'leve à direita',
  'sharp left': 'à esquerda',
  'sharp right': 'à direita',
  straight: 'em frente',
  uturn: 'retorno',
};

export function NavigationBanner({ navState, onStop }: NavigationBannerProps) {
  if (!navState.isNavigating || !navState.currentRoute) return null;

  const currentStep = navState.currentRoute.steps[navState.currentStepIndex];
  const nextStep = navState.currentRoute.steps[navState.currentStepIndex + 1];

  return (
    <View style={styles.container}>
      <View style={styles.maneuverRow}>
        <Text style={styles.maneuverIcon}>
          {MANEUVER_ICONS[currentStep?.maneuver.type] ?? '➡️'}
        </Text>
        <View style={styles.maneuverText}>
          <Text style={styles.instruction} numberOfLines={2}>
            {currentStep?.instruction ?? 'Continue em frente'}
          </Text>
          {nextStep && (
            <Text style={styles.nextInstruction} numberOfLines={1}>
              Depois: {nextStep.instruction}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <Text style={styles.stopText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>
            {formatDistance(navState.remainingDistance)}
          </Text>
          <Text style={styles.infoLabel}>restante</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>
            {formatDuration(navState.remainingDuration)}
          </Text>
          <Text style={styles.infoLabel}>tempo</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>
            {navState.nextManeuver
              ? formatDistance(navState.nextManeuver.distance)
              : '-'}
          </Text>
          <Text style={styles.infoLabel}>próxima curva</Text>
        </View>
      </View>
    </View>
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h${remainMins > 0 ? ` ${remainMins}min` : ''}`;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C3E50',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  maneuverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  maneuverIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  maneuverText: {
    flex: 1,
  },
  instruction: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  nextInstruction: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  stopButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoValue: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '700',
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  infoDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 4,
  },
});
