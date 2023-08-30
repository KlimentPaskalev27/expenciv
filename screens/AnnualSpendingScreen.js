import { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, Dimensions, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import AnnualLineChart from '../components/AnnualLineChart';
import getMonthName from '../functions/getMonthName'; // map 0-11 index to month names
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

// get screen width outside of component, to give access in styles
const screenWidth = Dimensions.get('window').width;

const AnnualSpendingScreen = ({ route }) => {
  const [monthlySumData, setMonthlySumData] = useState([]);
  const [totalYearlyExpenses, setTotalYearlyExpenses] = useState(0);
  const { selectedYear, username } = route.params;

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);
          const filteredExpensesByUser = expenses.filter(expense => expense.user === username);
          const filteredExpenses = filteredExpensesByUser.filter(expense => expense.year === selectedYear);
          const monthlySumData = calculateMonthlySumData(filteredExpenses);
          setMonthlySumData(monthlySumData);
        }
      } catch (error) {
        showAlert('Error fetching expenses data:', error);
      }
    };
    fetchExpensesData();
  }, []);

  const calculateMonthlySumData = (expenses) => {
    const monthlySumData = Array(12).fill(0);

    expenses.forEach((expense) => {
      const month = expense.month;
      monthlySumData[month] += expense.amount;
    });

    return monthlySumData;
  };

  const calculateTotalYearlyExpenses = (monthlySumData) => {
    const totalExpenses = monthlySumData.reduce((total, sum) => total + sum, 0);
    return totalExpenses;
  };

  useEffect(() => {
    const fetchExpensesData = async () => {
      try {
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);
          const filteredExpensesByUser = expenses.filter(expense => expense.user === username);
          const filteredExpenses = filteredExpensesByUser.filter(expense => expense.year === selectedYear);
          const monthlySumData = calculateMonthlySumData(filteredExpenses);
          setMonthlySumData(monthlySumData);

          const totalExpenses = calculateTotalYearlyExpenses(monthlySumData);
          setTotalYearlyExpenses(totalExpenses);
        }
      } catch (error) {
        showAlert('Error fetching expenses data:', error);
      }
    };

    fetchExpensesData();
  }, []);



  return (
    <LinearGradient colors={['#00a9cb', '#097579', '#007358']} style={styles.container} >
      <SafeAreaView style={styles.container}>
        <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
        <ScrollView style={styles.scrollContainer}>

          <View>
            <Text style={styles.title}>Spending for {selectedYear}</Text>
            <Text style={styles.undertext}>Spending per month is in £ GBP</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {monthlySumData.length > 0 ? (
              <AnnualLineChart
                monthlySumData={monthlySumData}
                width={screenWidth * 0.9} // Adjusted width for responsiveness
                height={300}
              />
            ) : (
              <Text>No data available.</Text>
            )}
          </View>

          <View style={styles.monthlyStatsContainer}>
            <ScrollView>
              <Text style={styles.monthlyTitle}>Monthly spending</Text>
              {monthlySumData.map((sum, index) => (
                <Text key={index} style={styles.statText}>
                  {getMonthName(index)}: £{sum.toFixed(2)}
                </Text>
              ))}
              <Text style={styles.lastStat}>Total for the year: £{totalYearlyExpenses.toFixed(2)}</Text>
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    maxWidth: "100%",
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    alignItems: "center",
  },
  chartContainer: {
    padding: screenWidth * 0.02,
    width: screenWidth * 0.9,
  },
  monthlyStatsContainer: {
    padding: screenWidth * 0.02,
    width: screenWidth * 0.9,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  title: {
    fontSize: screenWidth * 0.08,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  undertext: {
    fontSize: screenWidth * 0.04,
    marginTop: 10,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  monthlyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  statText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  lastStat: {
    borderWidth: 2,
    borderColor: "white",
    padding: 2,
    color: "white",
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default AnnualSpendingScreen;