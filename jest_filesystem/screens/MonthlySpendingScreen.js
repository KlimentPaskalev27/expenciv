import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, Image, StatusBar, ScrollView, Dimensions } from 'react-native';
import PieChartComponent from '../components/PieChart';
import {useState, useEffect, useCallback} from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage'; 
import RNPickerSelect from 'react-native-picker-select'; // for dropdown  //npm install react-native-picker-select
import { useIsFocused } from '@react-navigation/native';
import getMonthName from '../functions/getMonthName'; // map 0-11 index to month names
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable


const MonthlySpendingScreen = ({ navigation, route }) => {

  const [expensesData, setExpensesData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const currentMonth = new Date().getMonth(); // Get the current month (January is 0)
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [counter, setCounter] = useState(0);
  const { selectedYear, username } = route.params;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isFocused = true // useIsFocused(); // Get the focused state of the screen

  useEffect(() => {
    if (isFocused) {
      // Update chart data whenever the screen is focused
      const updatedChartData = calculateChartData(selectedMonth);
      setChartData(updatedChartData);
    }
  }, [isFocused, calculateChartData, selectedMonth]);


  // This effect will run only once on page load
  useEffect(() => {
    setTimeout(() => {
      if ( currentMonth != selectedMonth ){
        setSelectedMonth(currentMonth);
      } else {
        handleRefresh(selectedMonth);
      }
    }, 100); // after seconds
  }, []); // The empty dependency array ensures it runs only once


  useEffect(() => {
    // Calculate the sum of expenses for the selected month
    const calculateTotalExpenses = () => {
      let totalExpense = 0;
      chartData.forEach(expense => {
        totalExpense += expense.value;
      });
      return totalExpense;
    };

    // Update the counter with a 2-second animation
    const totalExpense = calculateTotalExpenses();
    let currentCounter = 0;
    const animationDuration = 2000; // 2 seconds
    const step = totalExpense / (animationDuration / 100);
    
    const counterAnimation = setInterval(() => {
      currentCounter += step;
      if (currentCounter >= totalExpense) {
        clearInterval(counterAnimation);
        currentCounter = totalExpense;
      }
      setCounter(currentCounter);
    }, 100);

    return () => {
      clearInterval(counterAnimation);
    };
  }, [chartData, selectedMonth]); // Run this effect whenever a dependency changes


  useEffect(() => {
    // Fetch expenses data from AsyncStorage
    const fetchExpensesData = async () => {
      try {
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);
          const filteredExpensesByUser = expenses.filter(expense => expense.user === username);
          const filteredExpenses = filteredExpensesByUser.filter(expense => expense.year === selectedYear);
          setExpensesData(filteredExpenses);
        }
        
      } catch (error) {
        showAlert('Error fetching expenses data:', error);
      }
    };

    fetchExpensesData();
  }, [selectedMonth, expensesData, selectedYear, username]);  
  //Runs on the first render And any time any dependency value changes
  // https://www.w3schools.com/react/react_useeffect.asp#:~:text=The%20useEffect%20Hook%20allows%20you,useEffect%20accepts%20two%20arguments.


  useEffect(() => {
    // Calculate and set chart data whenever the selected month changes
    const chartData = calculateChartData(selectedMonth);
    setChartData(chartData);
  }, [calculateChartData, selectedMonth]); // Run this effect whenever selectedMonth changes


  // prepares an object with the expenses for the selected month and returns it
  // meant to feed into Pie Chart component
  const calculateChartData = useCallback((selectedMonth) => {
    if (expensesData.length === 0) {
      return [];
    }

    //https://stackoverflow.com/questions/46862976/how-to-filter-array-of-objects-in-react-native
    // filters all the expenses so that only for selected month are returned
    const filteredExpenses = expensesData.filter((expense) => {
      const expenseMonth = parseInt(expense.month);
      const expenseYear = parseInt(expense.year);
      const expenseUser = expense.user;
      return (expenseMonth.toString() === selectedMonth.toString() 
        && expenseYear.toString() === selectedYear.toString() 
        && expenseUser === username 
      );
    });

    // Calculate chart data from expenses data and filter them by month
    const chartData = filteredExpenses.map((
        expense: { 
          name: string, 
          amount: number,
          color: string,
          legendFontColor: string,
          legendFontSize: number,
          month: number,
          year: number,
          user: string,
        }
      ) => (
        {
          name: expense.name,
          value: expense.amount,
          color: expense.color,
          legendFontColor: expense.legendFontColor,
          legendFontSize: expense.legendFontSize,
          month: expense.month,
          year: expense.year,
          user: expense.user,
        }
    ));
    return chartData;
  }, [expensesData]);


  const handleAddExpense = () => {
    navigation.navigate('Add expense', { 
      selectedMonth: selectedMonth, 
      selectedYear: selectedYear, 
      username: username });
  };

  const handleDeleteExpense = () => {
    navigation.navigate('Delete expense', { 
      selectedMonth: selectedMonth, 
      selectedYear: selectedYear, 
      username: username });
  };

  const handleRefresh = (selectedMonth) => {
    const updatedChartData = calculateChartData(selectedMonth);
    setChartData(updatedChartData);
    // Increment the refreshKey value to trigger a re-render
    setRefreshKey(refreshKey + 1);
  };

  return (
    <View style={styles.container} >
      <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
      <ImageBackground source={require('../assets/img1.jpg')} style={styles.backgroundImage} >
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollContainer}>

            <View style={styles.monthPickerContainerOuter}>
              <View style={styles.monthPickerContainerInner}>
                <Text style={styles.monthPickerTitle}>Select month:</Text>
                <RNPickerSelect
                  placeholder={{ label: `${getMonthName(selectedMonth)}`, value: selectedMonth }}
                  onValueChange={(value) => {
                    setSelectedMonth(value);
                    handleRefresh(value); // Call handleRefresh with selected month
                  }}
                  items={[
                    { label: 'January', value: '0' },
                    { label: 'February', value: '1' },
                    { label: 'March', value: '2' },
                    { label: 'April', value: '3' },
                    { label: 'May', value: '4' },
                    { label: 'June', value: '5' },
                    { label: 'July', value: '6' },
                    { label: 'August', value: '7' },
                    { label: 'September', value: '8' },
                    { label: 'October', value: '9' },
                    { label: 'November', value: '10' },
                    { label: 'December', value: '11' },
                  ]}
                  style={pickerSelectStyles}
                  value={selectedMonth} // Set the selected month as the default value
                />
              </View>
            </View>

            <View style={styles.addDeleteExpenses}>
              <TouchableOpacity style={[styles.hasIcon, styles.button]} onPress={handleDeleteExpense}>
                <Image source={require('../assets/remove.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Delete expense</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.hasIcon, styles.button]} onPress={handleAddExpense}>
                <Image source={require('../assets/add.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Add expense</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pieChartContainer}>
              {chartData.length === 0 ? (
                <Text>No data yet.</Text>
              ) : (
                <PieChartComponent data={chartData} 
                  diameter={ 
                    screenWidth > screenHeight ? 
                    screenWidth * 0.5 
                    : screenWidth
                  } 
                />
              )}
            </View>

            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                Spent this month: £{counter.toFixed(2)}
              </Text>
            </View>

            <View>
              <TouchableOpacity 
                style={[styles.hasIcon, styles.button]} 
                onPress={() => handleRefresh(selectedMonth)}
              >
                <Image source={require('../assets/refresh.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Refresh</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
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
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
    width: "100%",
  },
  monthPickerTitle: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    color: 'teal',
    fontWeight: 'bold',
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
    backgroundColor: 'teal',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 8, // Add some margin around each button
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    color: 'teal',
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthPickerContainerOuter: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  monthPickerContainerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addDeleteExpenses: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hasIcon: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    backgroundColor: '#fff',
  },
});

export default MonthlySpendingScreen;