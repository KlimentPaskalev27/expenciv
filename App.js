import MonthlySpendingScreen from './screens/MonthlySpendingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RegisterSuccessScreen from './screens/RegisterSuccessScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import DeleteExpenseScreen from './screens/DeleteExpenseScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoadingScreen from './screens/LoadingScreen';
import SettingsScreen from './screens/SettingsScreen';
import AnnualSpendingScreen from './screens/AnnualSpendingScreen';
import DashboardScreen from './screens/DashboardScreen';
import InsightsScreen from './screens/InsightsScreen'; 
// npm install @react-navigation/native
import { NavigationContainer } from '@react-navigation/native';
// npm install @react-navigation/stack
import { createStackNavigator } from '@react-navigation/stack';

// use the constructor method to create a new navigator object
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"
        screenOptions={{
          gestureEnabled: false, // Disable the swipe gesture
          //https://reactnavigation.org/docs/stack-navigator/
        }}
      >
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterSuccess" component={RegisterSuccessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Monthly expenses" component={MonthlySpendingScreen} />
        <Stack.Screen name="Add expense" component={AddExpenseScreen} />
        <Stack.Screen name="Delete expense" component={DeleteExpenseScreen} />
        <Stack.Screen name="Annual spending" component={AnnualSpendingScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
