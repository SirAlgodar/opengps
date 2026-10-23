import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SearchResult, Location } from '../types';
import { searchService } from '../services/SearchService';

interface SearchBarProps {
  currentLocation: Location | null;
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
}

export function SearchBar({ currentLocation, onSelect, placeholder = 'Buscar lugar...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (text.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const searchResults = await searchService.search(text, currentLocation ?? undefined);
      setResults(searchResults);
      setShowResults(true);
      setLoading(false);
    }, 300);
  }, [currentLocation]);

  const handleSelect = useCallback((result: SearchResult) => {
    onSelect(result);
    setQuery(result.name);
    setShowResults(false);
  }, [onSelect]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
        {loading && <ActivityIndicator style={styles.loader} size="small" />}
      </View>

      {showResults && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.resultName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.resultAddress} numberOfLines={1}>
                {item.address}
              </Text>
              {item.distance != null && (
                <Text style={styles.resultDistance}>
                  {item.distance < 1000
                    ? `${Math.round(item.distance)}m`
                    : `${(item.distance / 1000).toFixed(1)}km`}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearText: {
    fontSize: 18,
    color: '#999',
  },
  loader: {
    marginLeft: 8,
  },
  resultsList: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 300,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  resultDistance: {
    fontSize: 12,
    color: '#4ECDC4',
    marginTop: 4,
  },
});
