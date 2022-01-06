import { StatusBar } from "expo-status-bar";
import reactDom from "react-dom";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "0fe71ea402453601d39f797465e169dc";
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
};

export default function App() {
  const [district, setDistrict] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weathers, setWeathers] = useState([]);

  const ask = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      setErrorMsg(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setDistrict(location[0].district);
    const json = await (
      await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric
    `)
    ).json();
    setWeathers(json.daily);
  };
  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{district}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {weathers.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator />
          </View>
        ) : (
          weathers.map((weather, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>
                {parseFloat(weather.temp.day).toFixed(1)}
              </Text>
              <Fontisto
                name={icons[weather.weather[0].main]}
                size={24}
                color="black"
              />
              <Text style={styles.desc}>{weather.weather[0].main}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 60,
    fontWeight: "600",
  },
  weather: {
    backgroundColor: "white",
  },
  day: {
    width: SCREEN_WIDTH,
    marginTop: 100,
    backgroundColor: "white",
    alignItems: "center",
  },
  temp: {
    fontSize: 90,
    marginTop: 10,
  },
  desc: { fontSize: 30 },
});
