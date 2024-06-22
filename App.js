import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNotes = async notes => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error(error);
    }
  };

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = () => {
    if (note.length > 0) {
      setNotes([...notes, { key: Math.random().toString(), value: note }]);
      setNote('');
    } else {
      Alert.alert('Error', 'La nota no puede estar vacía');
    }
  };

  const deleteNote = key => {
    /* alert de confirmacion de eliminacion de nota */
    Alert.alert('Eliminar Nota', '¿Estás seguro de eliminar esta nota?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        onPress: () => {
          setNotes(notes.filter(note => note.key !== key));
        },
      },
    ]);
  };

  const editNote = key => {
    const note = notes.find(note => note.key === key);
    setNote(note.value);
    setNotes(notes.filter(note => note.key !== key));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NotaMía</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textarea}
          placeholder="Escribe tu nota aquí..."
          value={note}
          onChangeText={setNote}
          multiline={true}
          numberOfLines={4}
        />
        <Button title="Agregar Nota" onPress={addNote} />
      </View>
      <FlatList
        style={styles.list}
        data={notes}
        /* sin datos que diga no hay notas escribe una... */
        ListEmptyComponent={() => (
          <View style={{marginTop: 50, alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>No hay notas</Text>
            <Text style={{fontSize: 16}}>Escribe una nota para comenzar</Text>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity  onPress={() => editNote(item.key)} onLongPress={() => deleteNote(item.key)}>
            <View style={styles.noteItem}>
              <Text style={styles.noteText}>{item.value}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  textarea: {
    height: 100,
    borderColor: '#6200EE',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  noteItem: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomColor: '#6200EE',
    borderBottomWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
  },
});

export default App;
