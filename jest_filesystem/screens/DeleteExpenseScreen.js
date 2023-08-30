import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Image, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import { LinearGradient } from 'expo-linear-gradient'; 
import getMonthName from '../functions/getMonthName'; // map 0-11 index to month names
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const DeleteExpensePage = ({ route }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [allExpensesData, setAllExpensesData] = useState([]);
  const { selectedMonth, selectedYear, username } = route.params;

  useEffect(() => {
    // Fetch expenses data from AsyncStorage
    const fetchExpensesData = async () => {
      try {
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);
          setAllExpensesData(expenses)
          const filteredExpensesByUser = expenses.filter(expense => expense.user === username);
          const filteredExpenses = filteredExpensesByUser.filter(expense => expense.year === selectedYear);
          const expensesForSelectedMonth = filteredExpenses.filter(
            (expense) => expense.month == selectedMonth
          );
          setExpensesData(expensesForSelectedMonth);
        }
      } catch (error) {
        showAlert('Error fetching expenses data:', error);
      }
    };

    fetchExpensesData();
  }, []); 

  const handleDeleteExpense = async (index) => {
    try {
      const allOtherMonthData  = allExpensesData.filter(
            (expense) => expense.month !== selectedMonth
          );
      const thisMonthsDataWithRemovedItem = expensesData.filter((_, i) => i !== index);
      const updatedExpenses = [];

      // iterate over each array item and push it into a common array to combine both
      updatedExpenses.push(...allOtherMonthData);
      updatedExpenses.push(...thisMonthsDataWithRemovedItem);
      // this is now the new data, with only the deleted item missing

      // push the updated expeses data into database
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      // update local variables so that process can be repeated
      setAllExpensesData(updatedExpenses);
      setExpensesData(thisMonthsDataWithRemovedItem);
    } catch (error) {
      showAlert('Error deleting expense:', error);
    }
  };

  return (
    <View style={styles.container}>
    <LinearGradient
        colors={['#00a9cb', '#097579', '#007358']}
        style={styles.container}
      >

    <SafeAreaView style={styles.container}>

    <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />

      <Text style={styles.title}>Expenses in {getMonthName(selectedMonth)} {selectedYear}</Text>

      <FlatList
        data={expensesData}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatlist}
        renderItem={({ item, index }) => (

          <View style={styles.expenseRow}>
            <View style={styles.expensesItem}>
              <View style={styles.expenseItemInfo}>
                <Text style={styles.expenseItemText}>{item.name}</Text>
                <Text style={styles.expenseItemPrice}>£{item.amount.toFixed(2)}</Text>
              </View>

              <TouchableOpacity 
                style={styles.hasIcon, styles.expenseItemCta, styles.button} 
                onPress={()=>handleDeleteExpense(index)}
              >
                <Image source={require('../assets/remove-red.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
  
    </SafeAreaView>
    </LinearGradient>
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
    width: "100%",
  },
  title: {
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  flatlist: {
    height: "100%",
    width: "80%",
  },
  expensesItem: {
    backgroundColor: "rgba(255,255,255,0.6)",
    width: "100%",
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  expenseItemInfo: {
    flex: 2,
  },
  expenseItemCta: {
    flex: 1,
  },
  button: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },
  buttonText: {
    color: "#AA0000", // dark red to match icon. Bright red doesnt match accessibility with bright background
    fontSize: 16,
  },
  hasIcon: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 8,
  },
  expenseItemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseItemPrice: {
    fontSize: 12,
    color: "grey",
  },
});

export default DeleteExpensePage;
