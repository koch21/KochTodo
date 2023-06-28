import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import moment from "moment";

import { AnimatedCalendar } from "./src/components/animatedCalendar";

export default function App(props: any) {
  const [visible, setVisible] = useState(false);
  const [dateSelected, setDateSelected] = useState<string>(
    moment().format("YYYY-MM-DD")
  );

  const handleExpandCalendar = useCallback(() => {
    setVisible(true);
  }, []);

  const handleDismissCalendar = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Scrollable Calendar */}
      <AnimatedCalendar
        onExpandCalendar={handleExpandCalendar}
        onDismissCalendar={handleDismissCalendar}
        currentDate={dateSelected}
        onFilter={setDateSelected}
        navigation={props.navigation}
      />
      {/* List with the buttom that cover all the screen with some icon in the left text in the middle and a simple ball in the right  */}
      {/* A buttom with a PLUS icon to add more todo */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
});
