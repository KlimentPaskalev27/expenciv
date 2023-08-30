import React from 'react';
import { render } from 'react-native-testing-library';
import PieChartComponent from '../components/PieChart';

describe('PieChartComponent', () => {
  
  it('renders the component with provided data', () => {
    const data = [
      { name: 'Category A', value: 50, color: 'red', month: '8', year: 2023, user: "tester" },
      { name: 'Category B', value: 30, color: 'green', month: '8', year: 2023, user: "tester" },
    ];
    const diameter = 300;

    const { getByTestId, getByText } = render(
      <PieChartComponent data={data} diameter={diameter} />
    );

    // Assert that the legend items are rendered correctly
    data.forEach((item) => {
      const legendItem = getByText(`${item.value}£ ${item.name}`);
      expect(legendItem).toBeTruthy();
    });

    // check if other aspects of the Pie chart component is rendering
    const chartContainer = getByTestId('chart-container');
      expect(chartContainer).toBeTruthy();
    });
});
