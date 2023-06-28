import React, { useState } from "react";
import { StyleSheet, Animated, Dimensions, Platform, View } from "react-native";

import { ScrollableDates } from "./scrollableDates";

const { height } = Dimensions.get("screen");

export function AnimatedCalendar(props) {
  const [position, setPosition] = useState(new Animated.Value(-height));
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const [calendarDay, setCalendarDay] = useState(props.currentDate);

  const treatDateOverview = () => {
    let dateOverview: any = {};

    for (let i = 0; i < dateOverview.length; i++) {
      let d = dateOverview[i];
      if (d.numeroAgendamentos > 0 || d.numeroHorariosLivres > 0) {
        let statusDate = "DISPONIVEL";
        let colorDate = "green";

        if (d.numeroHorariosLivres === 0) {
          statusDate = "SEM_HORARIOS";
          colorDate = "red";
        } else if (d.numeroHorariosLivres <= d.numeroAgendamentos) {
          statusDate = "BLOQUEADA";
          colorDate = "yellow";
        }

        d.Cor = colorDate;
        d.Descricao = statusDate;

        dateOverview[d.date] = {
          marked: true,
          dotColor: colorDate,
          selectedDotColor: colorDate,
        };
      }
    }

    let calendarDayOverview = dateOverview[calendarDay];
    if (!calendarDayOverview) {
      calendarDayOverview = {};
    }
    calendarDayOverview.selected = true;

    dateOverview[calendarDay] = calendarDayOverview;

    return dateOverview;
  };

  const openCalendar = () => {
    props.navigation.navigate("HomeFilter", {
      currentProfessional: props.currentProfessional,
      professionalName: props.professionalName,
      currentDate: props.currentDate,
      onFilter: filter,
    });
  };

  const closeCalendar = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start();

    Animated.timing(position, {
      toValue: -height,
      duration: 600,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      if (props.onDismissCalendar) {
        props.onDismissCalendar();
      }
    }, 600);
  };

  const selectDay = (day: any) => {
    setCalendarDay(day.dateString);
  };

  const filter = (params: any) => {
    props.onFilter(params);
    closeCalendar();
  };

  const setDate = (date: string) => {
    props.onFilter({
      calendarDay: date,
      selectedProfessional: props.currentProfessional,
    });
  };

  const data = treatDateOverview();
  if (data) {
    return (
      <View style={styles.container}>
        <ScrollableDates
          overview={data}
          openCalendar={() => openCalendar()}
          current={props.currentDate}
          onPress={(date) => setDate(date)}
          onDatePress={(date) => selectDay(date)}
          swipeDownCalendar={openCalendar}
        />
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    paddingLeft: 10,
    borderRadius: 20,
    justifyContent: "space-between",
    marginLeft: "3.5%",
    marginTop: Platform.OS === "ios" ? 1 : 8,
    width: "93%",
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
  },
});
