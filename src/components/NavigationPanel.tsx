import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Route, NavigationState, SearchResult } from '../types';
import {
  NAVIGATION_MANEUVERS,
  NAVIGATION_MODIFIERS,
  ROUTE_COLORS,
} from '../constants';

interface NavigationPanelProps {
  destination: SearchResult | null;
  route: Route | null;
  navState: NavigationState;
  isNavigating: boolean;
  onStartNavigation: () => void;
  onStopNavigation: () => void;
  onCancel: () => void;
  onPreviewRoute: () => void;
  isCalculating: boolean;
}

export function NavigationPanel({
  destination,
  route,
  navState,
  isNavigating,
  onStartNavigation,
  onStopNavigation,
  onCancel,
  onPreviewRoute,
  isCalculating,
}: NavigationPanelProps) {
  if (!destination && !isNavigating) return null;

  if (isNavigating) {
    return (
      <NavigationBanner
        navState={navState}
        onStop={onStopNavigation}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationIcon}>📍</Text>
          <View style={styles.destinationText}>
            <Text style={styles.destinationName} numberOfLines={1}>
              {destination?.name || 'Destino'}
            </Text>
            <Text style={styles.destinationAddress} numberOfLines={1}>
              {destination?.address || ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
      </View>

      {isCalculating ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Calculando rota...</Text>
        </View>
      ) : route ? (
        <View style={styles.routeInfo}>
          <View style={styles.routeStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {formatDistance(route.distance)}
              </Text>
              <Text style={styles.statLabel}>distância</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {formatDuration(route.duration)}
              </Text>
              <Text style={styles.statLabel}>tempo</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {route.steps.length}
              </Text>
              <Text style={styles.statLabel}>etapas</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={onPreviewRoute}
            >
              <Text style={styles.previewButtonText}>👁️ Ver Rota</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.startButton}
              onPress={onStartNavigation}
            >
              <Text style={styles.startButtonText}>🚗 Iniciar Navegação</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.stepsList}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {route.steps.slice(0, 10).map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <Text style={styles.stepIcon}>
                  {NAVIGATION_MANEUVERS[step.maneuver.type as keyof typeof NAVIGATION_MANEUVERS] || '➡️'}
                </Text>
                <View style={styles.stepText}>
                  <Text style={styles.stepInstruction} numberOfLines={2}>
                    {step.instruction}
                  </Text>
                  <Text style={styles.stepDistance}>
                    {formatDistance(step.distance)}
                  </Text>
                </View>
              </View>
            ))}
            {route.steps.length > 10 && (
              <Text style={styles.moreSteps}>
                +{route.steps.length - 10} mais etapas...
              </Text>
            )}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Não foi possível calcular a rota
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={onPreviewRoute}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function NavigationBanner({
  navState,
  onStop,
}: {
  navState: NavigationState;
  onStop: () => void;
}) {
  const currentStep = navState.currentRoute?.steps[navState.currentStepIndex];
  const nextStep = navState.currentRoute?.steps[navState.currentStepIndex + 1];

  return (
    <View style={styles.navBanner}>
      <View style={styles.navManeuver}>
        <Text style={styles.navIcon}>
          {NAVIGATION_MANEUVERS[currentStep?.maneuver.type as keyof typeof NAVIGATION_MANEUVERS] || '➡️'}
        </Text>
        <View style={styles.navText}>
          <Text style={styles.navInstruction} numberOfLines={2}>
            {currentStep?.instruction || 'Continue em frente'}
          </Text>
          {nextStep && (
            <Text style={styles.navNext} numberOfLines={1}>
              Depois: {nextStep.instruction}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.navStop} onPress={onStop}>
          <Text style={styles.navStopText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navInfo}>
        <View style={styles.navStat}>
          <Text style={styles.navStatValue}>
            {formatDistance(navState.remainingDistance)}
          </Text>
          <Text style={styles.navStatLabel}>restante</Text>
        </View>
        <View style={styles.navDivider} />
        <View style={styles.navStat}>
          <Text style={styles.navStatValue}>
            {formatDuration(navState.remainingDuration)}
          </Text>
          <Text style={styles.navStatLabel}>tempo</Text>
        </View>
        <View style={styles.navDivider} />
        <View style={styles.navStat}>
          <Text style={styles.navStatValue}>
            {navState.nextManeuver
              ? formatDistance(navState.nextManeuver.distance)
              : '-'}
          </Text>
          <Text style={styles.navStatLabel}>próxima</Text>
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  destinationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  destinationText: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  destinationAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  cancelText: {
    fontSize: 18,
    color: '#666',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  routeInfo: {
    padding: 20,
  },
  routeStats: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4ECDC4',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  previewButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  startButton: {
    flex: 1.5,
    backgroundColor: '#4ECDC4',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  stepsList: {
    maxHeight: 200,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  stepIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  stepDistance: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  moreSteps: {
    textAlign: 'center',
    color: '#999',
    padding: 12,
    fontSize: 13,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  navBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C3E50',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  navManeuver: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  navText: {
    flex: 1,
  },
  navInstruction: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  navNext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  navStop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navStopText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  navInfo: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  navStat: {
    flex: 1,
    alignItems: 'center',
  },
  navStatValue: {
    color: '#4ECDC4',
    fontSize: 18,
    fontWeight: '700',
  },
  navStatLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  navDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 4,
  },
});
