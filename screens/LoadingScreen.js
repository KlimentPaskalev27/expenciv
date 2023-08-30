import { useState, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions, StatusBar, Image } from 'react-native';


const LoadingScreen = ({ navigation, route }) => {
  const [loadingProgress] = useState(new Animated.Value(0));
  const [welcomeMessageOpacity] = useState(new Animated.Value(0));
  const [secondMessageOpacity] = useState(new Animated.Value(0));
  const [loadingBarHeight] = useState(new Animated.Value(10)); // initial height
  const [loadingColor] = useState(new Animated.Value(0));

  const { username } = route.params; // Get the username from the navigation params

  useEffect(() => {
    // Animate loading progress bar
    Animated.timing(loadingProgress, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    // Animate loading bar color
    Animated.timing(loadingColor, {
      toValue: 1,
      duration: 4400,
      useNativeDriver: false,
    }).start();

    // Animate welcome message
    Animated.timing(welcomeMessageOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Animate second message
    Animated.timing(secondMessageOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 2000,
      useNativeDriver: true,
    }).start();

    // Expand loading bar height after animations complete
    setTimeout(() => {
      Animated.timing(loadingBarHeight, {
        toValue: Dimensions.get('window').height, // Expand to full screen height
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 4200); // Expand after 4.2 seconds

    // Redirect to HomeScreen after all animations complete
    setTimeout(() => {
      navigation.navigate('Dashboard', { username });
    }, 5000); // Redirect after 5 seconds
  }, [navigation, loadingProgress, welcomeMessageOpacity]);

  const loadingWidth = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const loadingBarColor = loadingColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['darkblue', 'turquoise'],
  });

  return (
    <View style={styles.container}>
    <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />

      <Animated.View style={[styles.logoContainer, { opacity: welcomeMessageOpacity }]} >
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </Animated.View>
    
      <Animated.Text style={[styles.welcomeMessage, { opacity: welcomeMessageOpacity }]}>
        Welcome {username}!
      </Animated.Text>


      <Animated.View
        style={[styles.loadingBar, { 
          width: loadingWidth, 
          height: loadingBarHeight, 
          backgroundColor: loadingBarColor
        }]}
      />

      <Animated.Text style={[styles.secondMessage, { opacity: secondMessageOpacity }]}>
        Easily keep track of your finance
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingBar: {
    backgroundColor: 'blue',
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  secondMessage: {
    fontSize: 24,
  },
  logoContainer: {
    position: "absolute",
    width: 250,
    height: 250,
    top: "10%",
  },
  logo: {
    width: 250,
    height: 250,
  }
});

export default LoadingScreen;
