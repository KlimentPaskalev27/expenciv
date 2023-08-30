import React from 'react';
import { render } from 'react-native-testing-library';
import InsightsScreen from '../screens/InsightsScreen';

describe('<InsightsScreen />', () => {
  it('should match snapshot', () => {
    const route = {
      "params": {
        selectedYear: 2023,
        username: "tester"
      }
    }
    const snap = render(<InsightsScreen route={route}  />).toJSON();
    expect(snap).toMatchSnapshot();
  });
})
    