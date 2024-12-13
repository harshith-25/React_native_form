import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { IForm, IFormField } from '../types/form';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

type FormBuilderScreenRouteProp = RouteProp<RootStackParamList, 'FormBuilder'>;
type FormBuilderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FormBuilder'>;

const FormBuilderScreen: React.FC = () => {
  const [form, setForm] = useState<IForm>({ title: '', description: '', fields: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<FormBuilderScreenNavigationProp>();
  const route = useRoute<FormBuilderScreenRouteProp>();
  const formId = route.params?.id;

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/forms/${formId}`);
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

  const handleSaveForm = async () => {
    try {
      setIsLoading(true);
      const url = formId
        ? `http://localhost:5000/api/forms/${formId}`
        : 'http://localhost:5000/api/forms';
      const method = formId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to save form');
      }

      navigation.goBack();
    } catch (err) {
      setError('Error saving form. Please try again.');
      console.error('Error saving form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, { label: '', type: 'text', required: false }],
    }));
  };

  const updateField = (index: number, field: Partial<IFormField>) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.map((f, i) => (i === index ? { ...f, ...field } : f)),
    }));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        value={form.title}
        onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
        placeholder="Form Title"
      />
      <TextInput
        style={styles.input}
        value={form.description}
        onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
        placeholder="Form Description"
        multiline
      />
      {form.fields.map((field, index) => (
        <View key={index} style={styles.fieldContainer}>
          <TextInput
            style={styles.input}
            value={field.label}
            onChangeText={(text) => updateField(index, { label: text })}
            placeholder="Field Label"
          />
          {/* Add more field properties here (type, required, etc.) */}
        </View>
      ))}
      <Button title="Add Field" onPress={addField} />
      <Button title="Save Form" onPress={handleSaveForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FormBuilderScreen;