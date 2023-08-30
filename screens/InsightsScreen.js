import { View, Text, StyleSheet, ScrollView, StatusBar, SafeAreaView, ImageBackground } from 'react-native';
import {useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import getMonthName from '../functions/getMonthName'; // map 0-11 index to month names
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const InsightsScreen = ({ route }) => {
  const [expensesData, setExpensesData] = useState([]);
  const { selectedYear, username } = route.params;

  useEffect(() => {
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
  }, []);

  const calculateTotalExpenses = () => {
    return expensesData.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateMonthlyStatistics = () => {
    const monthlyStatistics = Array.from({ length: 12 }, () => {
      return {
        totalExpenses: 0,
        mostExpensiveItem: null,
        leastExpensiveItem: null,
        numberOfExpenses: 0,
      };
    });

    expensesData.forEach((expense) => {
      const monthIndex = expense.month;
      const currentMonthStats = monthlyStatistics[monthIndex];
      
      currentMonthStats.totalExpenses += expense.amount;
      currentMonthStats.numberOfExpenses++;

      if (!currentMonthStats.mostExpensiveItem || expense.amount > currentMonthStats.mostExpensiveItem.amount) {
        currentMonthStats.mostExpensiveItem = expense;
      }

      if (!currentMonthStats.leastExpensiveItem || expense.amount < currentMonthStats.leastExpensiveItem.amount) {
        currentMonthStats.leastExpensiveItem = expense;
      }
    });

    return monthlyStatistics;
  };

  const calculateYearlyStatistics = () => {
    const yearlyStats = {
      totalExpenses: calculateTotalExpenses(),
      highestMonth: null,
      lowestMonth: null,
      averageMonthlyExpense: calculateTotalExpenses() / 12,
    };

    monthlyStatistics.forEach((monthStats, index) => {
      if (
        !yearlyStats.highestMonth ||
        monthStats.totalExpenses > yearlyStats.highestMonth.totalExpenses
      ) {
        yearlyStats.highestMonth = {
          monthIndex: index,
          totalExpenses: monthStats.totalExpenses,
        };
      }

      if (
        !yearlyStats.lowestMonth ||
        monthStats.totalExpenses < yearlyStats.lowestMonth.totalExpenses
      ) {
        yearlyStats.lowestMonth = {
          monthIndex: index,
          totalExpenses: monthStats.totalExpenses,
        };
      }
    });

    return yearlyStats;
  };

  const monthlyStatistics = calculateMonthlyStatistics();
  const yearlyStatistics = calculateYearlyStatistics();

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require('../assets/img3.jpg')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor="#097579c"
          />
          <ScrollView style={styles.container}>
            <Text style={styles.title}>Insights</Text>

            <View style={styles.statisticsContainer}>
          <Text style={styles.statisticsTitle}>Yearly Statistics</Text>
          <Text style={styles.statText}>
            Total Expenses: £{yearlyStatistics.totalExpenses.toFixed(2)}
          </Text>
          <Text style={styles.statText}>
            Highest Spending Month: {getMonthName(yearlyStatistics.highestMonth.monthIndex)} (£
            {yearlyStatistics.highestMonth.totalExpenses.toFixed(2)})
          </Text>
          <Text style={styles.statText}>
            Lowest Spending Month: {getMonthName(yearlyStatistics.lowestMonth.monthIndex)} (£
            {yearlyStatistics.lowestMonth.totalExpenses.toFixed(2)})
          </Text>
          <Text style={styles.statText}>
            Average Monthly Spending: £{yearlyStatistics.averageMonthlyExpense.toFixed(2)}
          </Text>
        </View>

            {monthlyStatistics.map((monthStats, index) => (
              <View key={index} style={styles.statisticsContainer}>
                <Text style={styles.statisticsTitle}>{getMonthName(index)}</Text>
                <Text style={styles.statText}>
                  Total Expenses: £{monthStats.totalExpenses.toFixed(2)}
                </Text>
                {monthStats.mostExpensiveItem && (
                  <Text style={styles.statText}>
                    Most Expensive Item: {monthStats.mostExpensiveItem.name} (£
                    {monthStats.mostExpensiveItem.amount.toFixed(2)})
                  </Text>
                )}
                {monthStats.leastExpensiveItem && (
                  <Text style={styles.statText}>
                    Least Expensive Item: {monthStats.leastExpensiveItem.name} (£
                    {monthStats.leastExpensiveItem.amount.toFixed(2)})
                  </Text>
                )}
                <Text style={styles.statText}>
                  Number of Expenses: {monthStats.numberOfExpenses}
                </Text>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white",
  },
  statText: {
    fontSize: 16,
    marginBottom: 10,
    color: "white",
  },
  backgroundImage: {
    flex: 1, // Make sure the image takes the entire screen
    resizeMode: 'cover', // Adjust the image's size to cover the entire container
    height: "100%",
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  statisticsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 80, 80, 0.7)',
    //using for shadow https://ethercreative.github.io/react-native-shadow-generator/
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statisticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
});

export default InsightsScreen;