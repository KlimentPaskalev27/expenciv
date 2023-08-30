import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const AnnualLineChart = ({ monthlySumData, width, height }) => {
  //https://github.com/indiespirit/react-native-chart-kit
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    yAxisLabel: "Money spent £ (GBP)",
    xAxisLabel: "Month",
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
          ],
          datasets: [{ 
            data: monthlySumData,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
            strokeWidth: 2, // optional
            }],
        }}
        width={width}
        height={height}
        chartConfig={chartConfig}
        style={styles.chart}
        bezier // Add this prop to make the line chart smooth and curvy  /https://github.com/indiespirit/react-native-chart-kit#bezier-line-chart
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});

export default AnnualLineChart;
