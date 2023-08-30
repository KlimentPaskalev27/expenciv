import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, TouchableWithoutFeedback, Keyboard, Image  } from 'react-native';
//npm install @react-native-async-storage/async-storage
//import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const RegisterPage = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleRegister = async () => {

    // Check for valid email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showAlert('Registration Error', 'Please enter a valid email address');
      return;
    }

    // Check for password strength
    const strongPasswordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strongPasswordPattern.test(password)) {
      showAlert('Registration Error', 'Password must be at least 8 characters long and include both letters and numbers');
      return;
    }

    const existingUser = await checkExistingUser(username, email);
    if (existingUser) {
      showAlert('Registration Error', 'Username or email already in use');
      return;
    }

    try {
      const userData = { username, email, password };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      const newUser = { username, email, password };
      await saveUser(newUser);
      navigation.navigate('RegisterSuccess');

    } catch (error) {
      showAlert('Registration failed', error);
    }
  };

  const checkExistingUser = async (username, email) => {
    
    try {
      const users = await getAllUsers();
      return users.some(user => user.username === username || user.email === email);
    } catch (error) {
      showAlert('Error checking existing user:', error);
      return false;
    }
    
  };

  const getAllUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      return JSON.parse(storedUsers) || [];
    } catch (error) {
      showAlert('Error getting users:', error);
      return [];
    }
  };

  const saveUser = async (user) => {
    try {
      const users = await getAllUsers();
      users.push(user);
      await AsyncStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      showAlert('Error saving user:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
    <LinearGradient
      colors={['#00a9cb', '#097579', '#007358']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#097579c" />

      <SafeAreaView style={styles.container}>

        <Image source={require('../assets/logo_transparent.png')} style={styles.logo} />

        <Text style={styles.title}>Register Page</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={text => setUsername(text)}
          value={username}
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ffffff"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          value={password}
          placeholderTextColor="#ffffff"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Login here.</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  </View>
  </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
    
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#ffffff',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#ffffff',
  },
  loginLink: {
    marginTop: 40,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    position: "absolute",
    width: "15%",
    height: "15%",
    top: "5%",
    left: "10%",
  },
});

export default RegisterPage;
