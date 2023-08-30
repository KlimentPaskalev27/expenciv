import React from 'react';
import { render } from 'react-native-testing-library';
import AnnualLineChart from '../components/AnnualLineChart';

describe('AnnualLineChart', () => {
  it('renders correctly', () => {
    const mockMonthlySumData = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650];
    const { getByTestId } = render(
      <AnnualLineChart monthlySumData={mockMonthlySumData} width={300} height={200} />
    );

    // Check if the LineChart component is rendered
    const lineChart = getByTestId('line-chart');
    expect(lineChart).toBeTruthy();
  });
});
