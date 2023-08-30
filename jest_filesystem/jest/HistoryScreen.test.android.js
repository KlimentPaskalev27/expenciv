import React from 'react';
import { render } from 'react-native-testing-library';
import SettingsScreen from '../screens/SettingsScreen';

describe('<SettingsScreen />', () => {
  it('should match snapshot', () => {
    const route = {
      "params": {
        username: "tester"
      }
    }
    const snap = render(<SettingsScreen route={route}  />).toJSON();
    expect(snap).toMatchSnapshot();
  });
})
    