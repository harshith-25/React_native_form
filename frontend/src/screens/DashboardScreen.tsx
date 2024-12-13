import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { IForm } from '../types/form';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const [forms, setForms] = useState<IForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/forms/user/123');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (err) {
        setError('Error fetching forms. Please try again.');
        console.error('Error fetching forms:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Forms</Text>
        <Button
          title="Create New Form"
          onPress={() => navigation.navigate('FormBuilder')}
        />
      </View>
      {forms.length === 0 ? (
        <Text style={styles.emptyText}>You haven't created any forms yet.</Text>
      ) : (
        <FlatList
          data={forms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('FormBuilder', { id: item._id })}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SubmissionsView', { id: item._id })}
                >
                  <Text style={styles.actionText}>View Submissions</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('FormView', { shareableLink: item.shareableLink })}
                >
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  card: {
    marginBottom: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DashboardScreen;