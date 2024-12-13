import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ISubmission } from '../types/submission';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

type SubmissionsViewScreenRouteProp = RouteProp<RootStackParamList, 'SubmissionsView'>;

const SubmissionsViewScreen: React.FC = () => {
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const route = useRoute<SubmissionsViewScreenRouteProp>();
  const { id } = route.params;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/submissions/form/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError('Error fetching submissions. Please try again.');
        console.error('Error fetching submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [id]);

  const handleExport = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/submissions/export/${id}`);
      if (!response.ok) {
        throw new Error('Failed to export submissions');
      }
      // Handle the CSV file (e.g., save it or open it in another app)
      alert('Submissions exported successfully!');
    } catch (err) {
      setError('Error exporting submissions. Please try again.');
      console.error('Error exporting submissions:', err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (submissions.length === 0) return <Text style={styles.emptyText}>No submissions found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Form Submissions</Text>
      <Button title="Export as CSV" onPress={handleExport} />
      <FlatList
        data={submissions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.submissionItem}>
            <Text style={styles.submissionId}>Submission ID: {item._id}</Text>
            <Text style={styles.submissionDate}>
              Date: {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.submissionData}>
              {JSON.stringify(item.data, null, 2)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  submissionItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  submissionId: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  submissionDate: {
    marginBottom: 8,
  },
  submissionData: {
    fontFamily: 'monospace',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SubmissionsViewScreen;