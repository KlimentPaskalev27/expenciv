import React from 'react';
import { render } from 'react-native-testing-library';
import MonthlySpendingScreen from '../screens/MonthlySpendingScreen';

describe('<MonthlySpendingScreen />', () => {
  it('should match snapshot', () => {
    const route = {
      "params": {
        selectedYear: 2023,
        username: "tester"
      }
    }
    const snap = render(<MonthlySpendingScreen route={route} />).toJSON();
    expect(snap).toMatchSnapshot();
  });
})
    