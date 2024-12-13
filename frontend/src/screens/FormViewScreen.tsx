import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { IForm, IFormField } from '../types/form';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

type FormViewScreenRouteProp = RouteProp<RootStackParamList, 'FormView'>;

const FormViewScreen: React.FC = () => {
  const [form, setForm] = useState<IForm | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const route = useRoute<FormViewScreenRouteProp>();
  const { shareableLink } = route.params;

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/forms/share/${shareableLink}`);
        if (!response.ok) {
          throw new Error('Failed to fetch form');
        }
        const data = await response.json();
        setForm(data);
      } catch (err) {
        setError('Error fetching form. Please try again.');
        console.error('Error fetching form:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [shareableLink]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSubmit = async () => {
    if (!form) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form._id,
          data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('Form submitted successfully!');
      setFormData({});
    } catch (err) {
      setError('Error submitting form. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!form) return <Text style={styles.errorText}>Form not found</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>
      <Text style={styles.description}>{form.description}</Text>
      {form.fields.map((field: IFormField, index: number) => (
        <View key={index} style={styles.fieldContainer}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleInputChange(field.label, value)}
            value={formData[field.label] || ''}
            placeholder={field.label}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
          />
        </View>
      ))}
      <Button
        title={isSubmitting ? 'Submitting...' : 'Submit'}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </ScrollView>
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
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FormViewScreen;