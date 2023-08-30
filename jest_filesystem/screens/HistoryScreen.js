import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getMonthName from '../functions/getMonthName'; // map 0-11 index to month names
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const HistoryScreen = ({ route }) => {
  const [expensesData, setExpensesData] = useState([]);
  const { username } = route.params;

  useEffect(() => {
    // Fetch expenses data from AsyncStorage
    const fetchExpensesData = async () => {
      try {
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);
          const filteredExpensesByUser = expenses.filter(expense => expense.user === username);
          setExpensesData(filteredExpensesByUser);
        }
      } catch (error) {
        showAlert('Error fetching expenses data:', error);
      }
    };

    fetchExpensesData();
  }, []);

  // Sorting expenses in reverse order (newest first) across all years
  const sortedExpenses = [...expensesData].sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1); // Subtract 1 from month since it's 0-indexed
    const dateB = new Date(b.year, b.month - 1);
    return dateB - dateA; // Reversed the comparison here
  });


  return (
    <View style={styles.container}>
      <ImageBackground
      source={require('../assets/img2.jpg')}
      style={styles.backgroundImage}
    >
      <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.expensesTable}>
          <Text style={styles.heading}>Expenses History</Text>
          {sortedExpenses.map((expense, index) => (
            <View key={index} style={styles.expenseItem}>
              <Text style={styles.expenseName}>{expense.name}</Text>
              <Text style={styles.expenseAmount}>{expense.amount} £</Text>
              <Text style={styles.expenseDate}>
                {getMonthName(expense.month)}{"\n"}{expense.year}
              </Text>
            </View>
          ))}
        </View>
  
      </ScrollView>
    </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  expensesTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '80%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  expenseName: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseAmount: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
  },
  expenseDate: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HistoryScreen;
