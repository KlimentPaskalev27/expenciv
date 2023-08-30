import { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, Image, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Animated, Easing, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Make sure to install 'expo-linear-gradient'
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnimation, setIsLoadingAnimation] = useState(true); 
  // State to control loading animation in the start
  // Animated rotation value for spinning circle
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Start the spinning animation when component mounts
    startSpinningAnimation();
    // Hide the loading animation after 2 seconds
    setTimeout(() => {
      setIsLoadingAnimation(false);
    }, 2000);
  }, []);

  const startSpinningAnimation = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserByUsername(username);
      
      if (userData && userData.password === password) {
        navigation.navigate('Loading', { username }); // Pass the username as a parameter
      } else {
        showAlert('Login Error', 'Invalid username or password');
      }
    } catch (error) {
      showAlert('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserByUsername = async (username) => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = JSON.parse(storedUsers) || [];
      return users.find(user => user.username === username);
    } catch (error) {
      showAlert('Error getting user:', error);
      return null;
    }
  };


  return (

    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
     
      {isLoadingAnimation ? ( // Display loading animation for the first two seconds
        <>
          <View>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }) }] }}>
            <View style={styles.loadingCircle} />
          </Animated.View>
        </>
      ) : (
        <LinearGradient
        colors={['#00a9cb', '#097579', '#007358']}
        style={styles.container}
      >
      <SafeAreaView style={styles.container}>
        <>

        <Image source={require('../assets/logo_transparent.png')} style={styles.logo} />

        <Text style={styles.title}>Login Page</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={text => setUsername(text)}
          value={username}
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading app...</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Don't have an account? Register here.</Text>
          </TouchableOpacity>
        )}

        </>
        </SafeAreaView>
        </LinearGradient>

      )}
    </View>
    </TouchableWithoutFeedback >
    
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
  registerLink: {
    marginTop: 40,
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  loadingText: {
    marginBottom: 30,
    fontSize: 24,
  },
  loadingCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: 'black',
    borderLeftColor: 'transparent',
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
    top: "10%",
    left: "10%",
  },
});

export default LoginPage;