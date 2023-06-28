import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "@expo/vector-icons/Feather";
import moment from "moment"; // @ts-ignore
import ptbr from "moment/locale/pt-br";

interface ScrollableDatesProps {
  current: any;
  overview: any;
  openCalendar: () => void;
  onDatePress?: (date: any) => void;
  onPress: (date: string) => void;
  swipeDownCalendar?: () => void;
}

export function ScrollableDates(props: ScrollableDatesProps) {
  const [dates, setDates] = useState([]);

  const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => (ref.current = value), [value]);

    return ref.current;
  };

  const prevSelectedDate = usePrevious(props.current);
  useEffect(() => {
    if (prevSelectedDate !== props.current) {
      createDates();
    }
  }, [props.current]);

  const createDates = () => {
    // @ts-ignore
    moment().localeData(ptbr);

    const oneDayBefore = moment(props.current).add(1, "days");
    const twoDaysBefore = moment(props.current).add(2, "days");
    const threeDaysBefore = moment(props.current).add(3, "days");
    const currentDay = moment(props.current);
    const oneDayAfter = moment(props.current).add(1, "days");
    const twoDaysAfter = moment(props.current).add(2, "days");
    const threeDaysAfter = moment(props.current).add(3, "days");

    const extractDotColor = (date: any) => {
      if (props.overview[date]) {
        return props.overview[date].dotColor;
      }
      return null;
    };

    const finalDates: any = [
      {
        name: threeDaysBefore.format("ddd"),
        day: threeDaysBefore.get("D"),
        fullDay: threeDaysBefore.format("YYYY-MM-DD"),
        dotColor: extractDotColor(threeDaysBefore.format("YYYY-MM-DD")),
      },
      {
        name: twoDaysBefore.format("ddd"),
        day: twoDaysBefore.get("D"),
        fullDay: twoDaysBefore.format("YYYY-MM-DD"),
        dotColor: extractDotColor(twoDaysBefore.format("YYYY-MM-DD")),
      },
      {
        name: oneDayBefore.format("ddd"),
        day: oneDayBefore.get("D"),
        fullDay: oneDayBefore.format("YYYY-MM-DD"),
        dotColor: extractDotColor(oneDayBefore.format("YYYY-MM-DD")),
      },
      {
        name: currentDay.format("ddd"),
        day: currentDay.get("D"),
        fullDay: currentDay.format("YYYY-MM-DD"),
        dotColor: extractDotColor(currentDay.format("YYYY-MM-DD")),
      },
      {
        name: oneDayAfter.format("ddd"),
        day: oneDayAfter.get("D"),
        fullDay: oneDayAfter.format("YYYY-MM-DD"),
        dotColor: extractDotColor(oneDayAfter.format("YYYY-MM-DD")),
      },
      {
        name: twoDaysAfter.format("ddd"),
        day: twoDaysAfter.get("D"),
        fullDay: twoDaysAfter.format("YYYY-MM-DD"),
        dotColor: extractDotColor(twoDaysAfter.format("YYYY-MM-DD")),
      },
      {
        name: threeDaysAfter.format("ddd"),
        day: threeDaysAfter.get("D"),
        fullDay: threeDaysAfter.format("YYYY-MM-DD"),
        dotColor: extractDotColor(threeDaysAfter.format("YYYY-MM-DD")),
      },
    ];
    setDates(finalDates);
  };

  const renderDates = ({ item }: any) => {
    const { name, day, fullDay, dotColor } = item;
    const isCurrent = fullDay === props.current;
    const today = moment(moment().format("YYYY-MM-DD"));
    let pastDate = today.isAfter(moment(fullDay, "YYYY-MM-DD"));
    let isCurrentDate = today.isSame(moment(fullDay, "YYYY-MM-DD"));
    const dayFormatted = day.toString().length === 1 ? "0" + day : day;

    const getDot = () => {
      if (dotColor) {
        return (
          <View
            style={{
              backgroundColor: dotColor,
              height: 5,
              top: 4,
              bottom: 3,
              width: 5,
              borderRadius: 4,
            }}
          />
        );
      }
      return null;
    };
    return (
      <TouchableOpacity
        key={item.name}
        onPress={() => {
          props.onPress(fullDay);
        }}
      >
        <View style={styles.dateShorcut}>
          <Text>{name}</Text>
          <View
            style={
              (styles.dateInnerContainer,
              { backgroundColor: isCurrent ? "blue" : "transparent" })
            }
          >
            <Text
              style={
                (styles.dateInnerText,
                {
                  color: isCurrent
                    ? "white"
                    : pastDate
                    ? "gray"
                    : isCurrentDate && "blue",
                })
              }
            >
              {dayFormatted}
            </Text>
          </View>
          {getDot()}
        </View>
      </TouchableOpacity>
    );
  };

  let marginLeft = 24;
  let marginRight = 29;

  if (Array.isArray(dates)) {
    return (
      <View style={styles.contentScrollStyle}>
        <FlatList
          data={dates}
          keyExtractor={(item: any) => item.fullDay}
          renderItem={renderDates}
          horizontal={true}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-around",
          }}
        />
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => props.openCalendar()}
            style={{
              alignItems: "center",
              marginRight: marginRight,
              marginLeft: marginLeft,
            }}
          >
            {/* TODO: REMOVER ESSE BOTAO E FAZER TODO O COMPONENTE SE TORNAR UM MODAL QUE CRESCE DE FORMA ANIMADA */}
            <Icon name="sliders" size={26} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return null;
}

ScrollableDates.defaultProps = {
  current: moment().format("YYYY-MM-DD"),
};

const styles = StyleSheet.create({
  contentScrollStyle: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  dateShorcut: {
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "space-around",
    alignItems: "center",
  },
  dateInnerContainer: {
    borderRadius: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  dateInnerText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    padding: 4,
  },
});
