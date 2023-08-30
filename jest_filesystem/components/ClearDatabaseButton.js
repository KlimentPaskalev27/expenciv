import { Vibration, Alert, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const ClearDatabaseButton = () => {

  const handleClearDatabase = () => {
    Alert.alert(
      'Are you sure?',
      'Clearing the information in the database will erase all expenses data and all users data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
            } catch (error) {
              showAlert('Error clearing AsyncStorage:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity
        style={styles.hasIcon, styles.button}
        onPress={() => {
          Vibration.vibrate(); // Trigger device vibration
          handleClearDatabase();
        }}
      >
        <Image source={require('../assets/database.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Clear Database</Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgb(0, 90, 90)',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    margin: 8, // Add some margin around each button
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    width: '100%', // Adjust the width to fit 3 buttons in a row
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center',
    flexDirection: "row",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hasIcon: {
    flexDirection: "row",
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
});

export default ClearDatabaseButton;
