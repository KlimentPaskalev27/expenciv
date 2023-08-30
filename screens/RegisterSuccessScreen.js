import { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Vibration, StatusBar } from 'react-native';

const RegisterSuccessPage = ({ navigation }) => {

  useEffect(() => {
    Vibration.vibrate(); // Trigger device vibration ONCE
  }, []);
  
  return (
    <View style={styles.container}>
    <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
      <Text style={styles.title}>Registration Successful!</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default RegisterSuccessPage;
