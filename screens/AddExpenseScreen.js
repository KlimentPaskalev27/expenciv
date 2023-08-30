import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Text, TouchableWithoutFeedback, Keyboard, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // local database
import { useNavigation } from '@react-navigation/native';
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const AddExpensePage = ({ route }) => {
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const { selectedMonth, selectedYear, username } = route.params;
  const navigation = useNavigation(); // Get the navigation object

  // generate a random colour for this expense so that PieChart can use in chart and in legend
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256); // use floor() to not exceed 255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r},${g},${b},1)`;
  };

  const handleAddExpense = async () => {
    if (expenseName && expenseAmount) {
      try {
        // Get existing expenses from AsyncStorage
        const existingExpensesJSON = await AsyncStorage.getItem('expenses');
        const existingExpenses = existingExpensesJSON
          ? JSON.parse(existingExpensesJSON)
          : [];

        // Add the new expense to the existing expenses
        const newExpense = {
          name: expenseName,
          amount: parseFloat(expenseAmount), // avoid long floats
          color: getRandomColor(),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
          month: selectedMonth,
          year: selectedYear,
          user: username, // make sure the expense is mapped for the currently logged in user only
        };
        const updatedExpenses = [...existingExpenses, newExpense];

        // Save the updated expenses to AsyncStorage
        await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

        // Clear input fields
        setExpenseName('');
        setExpenseAmount('');

        // After successfully adding an expense, navigate back to the Home page
        navigation.navigate('Monthly expenses');

      } catch (error) {

        showAlert('Error adding expense:', error);
      }
    } else {
      
      showAlert('Please enter both expense name and amount.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
    <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
      <ImageBackground
          source={require('../assets/img3.jpg')}
          style={styles.backgroundImage}
        >
        <View style={styles.innerContainer}>
          <TextInput
            placeholder="Expense name"
            value={expenseName}
            placeholderTextColor="white"
            onChangeText={setExpenseName}
            style={styles.input}
          />
          <TextInput
            placeholder="Expense amount"
            placeholderTextColor="white"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.hasIcon, styles.button]}
            onPress={handleAddExpense}
            activeOpacity={0.7} // Opacity when button is pressed
          >
            <Image source={require('../assets/add-teal.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Add expense</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
    </TouchableWithoutFeedback >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    height: "100%",
    width: "80%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    color: '#fff',
    width: "100%",
    fontSize: 16,
    backgroundColor: 'rgba(0, 80, 80, 0.6)',
    //using for shadow https://ethercreative.github.io/react-native-shadow-generator/
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5

  },
  backgroundImage: {
    flex: 1, // Make sure the image takes the entire screen
    resizeMode: 'cover', // Adjust the image's size to cover the entire container
    height: "100%",
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 20, // Add some margin around each button
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    borderColor: "teal",
    borderWidth: 1,
  },
  buttonText: {
    color: 'teal',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hasIcon: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default AddExpensePage;
