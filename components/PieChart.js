import { Text, View, StyleSheet } from 'react-native';
import { PieChart} from 'react-native-chart-kit'; //npm i react-native-chart-kit
// https://www.npmjs.com/package/react-native-chart-kit?activeTab=code
// https://github.com/indiespirit/react-native-chart-kit-example/blob/master/App.js

const PieChartComponent = ({ data, diameter }) => {

  const chartPadding = ( diameter - ( diameter / 2 ) ) / 2;

  const chartConfig = {
    color: (opacity = 1, index) => data[index]?.color || `rgba(0, 122, 255, ${opacity})`,
    labelColor: (index) => data[index]?.color || "#7F7F7F",  // optional
    labelFontSize: 15,  // optional
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, styles.pieShadow]}>
        <PieChart
          data={data}
          width={diameter}
          height={diameter}
          absolute
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft={chartPadding}
          hasLegend={false}
          avoidFalseZero={true}
        />
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: item.color,
                  marginRight: 5,
                }}
              />
              <Text>{item.value}£ {item.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    alignSelf: 'center',
    width: '100%',
    flex: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // Wrap items if they exceed container width
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10, // Add spacing between legend items
  },
  pieShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    // used for shadow https://ethercreative.github.io/react-native-shadow-generator/
  },
});

export default PieChartComponent;