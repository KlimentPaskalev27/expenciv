import { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Animated, SafeAreaView, Image } from 'react-native';
//npm install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClearDatabaseButton from '../components/ClearDatabaseButton';
// for dropdown  //npm install react-native-picker-select
import RNPickerSelect from 'react-native-picker-select';
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const DashboardScreen = ({ navigation, route }) => {

  const [expensesData, setExpensesData] = useState([]);
  const [welcomeMessageOpacity] = useState(new Animated.Value(0));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [username, setUsername] = useState(route.params.username);

  useEffect(() => {
    if (route.params.username != undefined) {
      setUsername(route.params.username);
    }
  }, []);


  useEffect(() => {  
    const fetchExpensesData = async () => {
      try {
        // Fetch expenses data from AsyncStorage
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);
          const filteredExpensesByUser = expenses.filter(expense => expense.user === username);
          const filteredExpensesByYear = filteredExpensesByUser.filter(expense => expense.year === selectedYear);
          setExpensesData(filteredExpensesByYear);
        }
      } catch (error) {
        showAlert('Error fetching expenses data:', error);
      }
    };

    fetchExpensesData();
  }, [selectedYear, username]);  ////Runs on the first render And any time any dependency value changes

  useEffect(() => {
    // Animate welcome message and buttons to appear
    Animated.timing(welcomeMessageOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();

  }, [welcomeMessageOpacity]);

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 }, (_, index) => {
      const year = currentYear - index;
      return { label: year.toString(), value: year };
    });
    return years;
  };
  
  return (
    <ImageBackground
      source={require('../assets/img2.jpg')}
      style={styles.backgroundImage}
    >
    <SafeAreaView style={styles.backgroundImage}>
    <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
    <ScrollView tyle={styles.backgroundImage}>

      <View style={styles.titleContainer}>
        <Animated.Text style={[styles.welcomeMessage, { opacity: welcomeMessageOpacity }]}>
          Welcome {username}!
        </Animated.Text>
      </View>

      <View style={styles.titleContainer, styles.yearSelection}>
        <Text style={styles.buttonText}>Pick year</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select a year...', value: null }}
            onValueChange={(value) => setSelectedYear(value)}
            items={getYearOptions()} // Create a function to generate year options
            style={pickerSelectStyles}
            value={selectedYear}
          />
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.hasIcon, styles.button}
          onPress={() => navigation.navigate('Monthly expenses', { 
            selectedYear: selectedYear, username: username 
            }
          )}
        >
          <Image source={require('../assets/piechart.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Monthly expenses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.hasIcon, styles.button}
          onPress={() => navigation.navigate('Annual spending', { 
            selectedYear: selectedYear,
            username: username,
          })}
        >
          <Image source={require('../assets/linechart.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Annual spending</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.hasIcon, styles.button} 
          onPress={() => navigation.navigate('Insights', { 
            selectedYear: selectedYear,
            username: username,
          } )}
        >
          <Image source={require('../assets/insights.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Insights</Text>
        </TouchableOpacity>


          <TouchableOpacity  
            style={styles.hasIcon, styles.button} 
            onPress={()=>navigation.navigate('History', { username: username })}
          >
            <Image source={require('../assets/history.png')} style={styles.icon} />
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hasIcon, styles.button}
            onPress={() => navigation.navigate('Settings', username )}
          >
            <Image source={require('../assets/settings.png')} style={styles.icon} />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        
        
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.hasIcon, styles.button} onPress={() => navigation.navigate('Login')} >
              <Image source={require('../assets/logout.png')} style={styles.icon} />
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
            
            {/* Only show this button if any data is avaliable at all */}
            {expensesData.length > 0 ? 
              <ClearDatabaseButton style={styles.button} />
              : null
            }
          </View>

        </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    paddingHorizontal: 16, 
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap', 
    padding: 16,
  },
  welcomeMessage: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  yearSelection: {
    flexDirection: 'column',
    padding: 16,
    flex: 1,
    alignItems: 'start',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 2,
    justifyContent: 'end',
    flexDirection: 'column',
    paddingTop: 60,
  },
  button: {
    backgroundColor: 'teal',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 8,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
    flexDirection: "row",
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// styles for different OS for the dropdown RNPickerSelect element
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

export default DashboardScreen;
