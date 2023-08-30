import { useState } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ImageBackground, SafeAreaView, Image, Vibration, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showAlert from '../functions/showAlert'; // takes title and message and displays an alert, not cancelable

const SettingsScreen = ({ navigation, route }) => {

  const [username, setUsername] = useState(route.params);
  const [newUsername, setNewUsername] = useState(route.params);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangeUsername = async () => {
  
    if (newUsername.trim() === '') {
      Alert.alert('Error', 'Please enter a valid new username.');
      return;
    }

    // Check for special characters or spaces
    const usernamePattern = /^[a-zA-Z0-9]*$/;
    if (!usernamePattern.test(newUsername)) {
      Alert.alert('Error', 'Username can only contain letters and numbers.');
      return;
    }

    try {
      // Check if the current password matches the stored password
      const userData = await getUserByUsername(username);

      if (userData != undefined) {
        // first update all existing expenses for this user to have the new username
        // Fetch expenses data from AsyncStorage
        const expensesJSON = await AsyncStorage.getItem('expenses');
        if (expensesJSON) {
          const expenses = JSON.parse(expensesJSON);

          // Update expenses with the new username
          // iterate over all expense objects
          const updatedExpenses = expenses.map(expense => {
            // if you find an expense that is for this user
            if (expense.user === username) {
              // all the rest of the properties, last is user, update it to newUsername
              return { ...expense, user: newUsername };
            }
            // return the updated expense to the list
            return expense;
          }); // all expenses are iterated and updated if they had old username with new username
          
          // Save the updated expenses to AsyncStorage
          await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        }

        //Now ready to update username user object username in AsyncStorage
        userData.username = newUsername; 

        await updateUser(userData);
        // Update the username in AsyncStorage as well
        //https://stackoverflow.com/questions/62524642/route-not-updating-state-from-navigation-params
        setUsername(newUsername);
        showAlert('Username changed successfully', "Your new username is now " + userData.username.toString() );
      } else {

        showAlert('userData is undefined', "When searching for thisusername, undefined was returned.");
        navigation.navigate('Settings', {username});
      }
    } catch (error) {
      showAlert('Username change failed', error);
    }
  };

  const handleChangeEmail = async () => {
    try {
      // Check if the current password matches the stored password
      const userData = await getUserByUsername(username);
      if (userData != undefined) {
        // Update the email in AsyncStorage
        userData.email = newEmail; // Assuming you have a 'newEmail' state variable
        await updateUser(userData);
        showAlert('Email address changed successfully');

      } else {
        showAlert('userData is undefined', "When searching for this username, undefined was returned");
        navigation.navigate('Settings', {username});
      }
      
    } catch (error) {
      showAlert('Email change failed', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Check if the current password matches the stored password
      const userData = await getUserByUsername(username);
      if (userData != undefined) {
        if (userData.password !== currentPassword) {
          showAlert('Current password is incorrect', "Try again or contact support.");
          return;
        }

        // Update the password in AsyncStorage
        userData.password = newPassword; // Assuming you have a 'newPassword' state variable
        await updateUser(userData);
        showAlert('Password changed successfully');

      } else {
        showAlert('userData is undefined', "When searching for this user using username, undefined was returned. Something with this username is not right. Log out and log in again.");
        navigation.navigate('Settings', {username});
      }

    } catch (error) {
      showAlert('Password change failed', error);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed',
          style: 'destructive',
          onPress: async () => {
            try {
              // Check if the current password matches the stored password
              const userData = await getUserByUsername(username);
              // Delete the user account from AsyncStorage
              await deleteUser(userData);
              showAlert("Account deleted successfully", "You will now be taken to login page...");

              // Navigate back to the login screen or any other desired screen
              navigation.navigate('Login');
            } catch (error) {
              showAlert("Account deletion failed", error);
            }
          },
        },
      ],
    );
  };

  const getUserByUsername = async (username) => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = JSON.parse(storedUsers) || [];
      return users.find(user => user.username === username);
    } catch (error) {
      showAlert("Could not find user by username", error);
      return null;
    }
  };

  const updateUser = async (user) => {
    try {
      const users = await getAllUsers();

      // get the users array from the database
      // them go through all of them, and check if each of them has a matching username as the currently logged in user
      // u.username === username
      // if such a user is found, replace that user object in the DB, with our newly created user that has an updated username
      // ? user : u
      // user is the new one we pass to this function, u is the user from the db
      // users.map goes through all of them
      // (u =>   checks each user object in the db
      const updatedUsers = users.map(u => (u.username === username ? user : u));
      // https://stackoverflow.com/questions/37585309/replacing-objects-in-array

      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));

    } catch (error) {
      showAlert("Something went wrong", error);
    }
  };

  const deleteUser = async (userToDelete) => {
    try {
      // first delete all expenses this user has entered
      // Fetch expenses data from AsyncStorage
      const expensesJSON = await AsyncStorage.getItem('expenses');
      if (expensesJSON) {
        const expenses = JSON.parse(expensesJSON);

        // Filter expenses with a user property that matches the current username
        const updatedExpenses = expenses.filter(expense => expense.user !== userToDelete.username);

        // Save the updated expenses to AsyncStorage
        await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      }
      // now delete the user
      const users = await getAllUsers();
      const updatedUsers = users.filter(u => u.username !== userToDelete.username);
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      showAlert("Something went wrong", error);
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

  return (
    <ImageBackground source={require('../assets/img2.jpg')} style={styles.backgroundImage} >
      <SafeAreaView style={styles.backgroundImage}>
        <StatusBar translucent barStyle="light-content" backgroundColor="#097579c" />
        <ScrollView>

          <View style={styles.container}>
            <Text style={styles.pageTitle}>Settings</Text>
          </View>

          <View style={styles.containerDark}>
            <Text style={styles.title}>Change username</Text>
            <TextInput
              style={styles.input}
              placeholder="New Username"
              onChangeText={text => setNewUsername(text)}
              value={newUsername}
              placeholderTextColor="#ffffff"
            />
            <TouchableOpacity style={styles.button} onPress={handleChangeUsername} >
              <Text style={styles.buttonText}>Change username</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.containerDark}>
            <Text style={styles.title}>Change email</Text>
            <TextInput
              style={styles.input}
              placeholder="New Email"
              onChangeText={text => setNewEmail(text)}
              value={newEmail}
              placeholderTextColor="#ffffff"
            />
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail} >
              <Text style={styles.buttonText}>Change email</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.containerDark}>
            <Text style={styles.title}>Change password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              onChangeText={text => setCurrentPassword(text)}
              value={currentPassword}
              secureTextEntry
              placeholderTextColor="#ffffff"
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              onChangeText={text => setNewPassword(text)}
              value={newPassword}
              secureTextEntry
              placeholderTextColor="#ffffff"
            />
            <TouchableOpacity style={styles.button} onPress={handleChangePassword} >
              <Text style={styles.buttonText}>Change password</Text>
            </TouchableOpacity>
          </View>

          

          <View style={styles.container}>
            <TouchableOpacity
              style={styles.hasIcon, styles.button}
              onPress={() => {
                navigation.replace('Dashboard', { username: newUsername });
                //https://stackoverflow.com/questions/62524642/route-not-updating-state-from-navigation-params
              }}
              //https://reactnavigation.org/docs/navigation-prop/
            >
              <Text style={styles.buttonText}>Back to dashboard</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <TouchableOpacity 
              style={styles.hasIcon, styles.deleteButton } 
              onPress={() => { 
                Vibration.vibrate(); // Trigger device vibration ONCE
                handleDeleteAccount();
              }}
            >
              <Image source={require('../assets/warning.png')} style={styles.icon} />
              <Text style={styles.buttonText}>Delete account</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingVertical: 5,
  },
  containerDark: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 8,
  },
  pageTitle: {
    fontSize: 28,
    marginBottom: 10,
    color: '#ffffff',
  },
  title: {
    fontSize: 22,
    paddingBottom: 10,
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
  button: {
    backgroundColor: 'teal',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
  },
  deleteButton: {
    backgroundColor: "#AA0000", // dark red, same as on "Delete expense" screen
    paddingVertical: 10,
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
  }
});

export default SettingsScreen;