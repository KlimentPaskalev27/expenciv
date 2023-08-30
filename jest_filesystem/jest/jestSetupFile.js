jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// https://react-native-async-storage.github.io/async-storage/docs/advanced/jest/



// OR

// import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

//https://stackoverflow.com/questions/40952566/how-to-test-async-storage-with-jest